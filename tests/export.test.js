/**
 * RasaLore AI - Export Studio & Commercial Print Verification Test Suite
 * Validates TASK-401, TASK-402, and TASK-403 adhering to spec Section 12.2, AC-011, AC-012, and CON-001.
 */

import { describe, it } from 'node:test';
import assert from 'node:assert';
import fs from 'node:fs';
import path from 'node:path';

import { SchemaValidator } from '../src/parsers/schema-validator.js';
import { CULINARY_PRESETS } from '../src/data/presets.js';
import { getGoldenDishesByPreset } from '../src/data/golden-cache.js';

describe('ExportStudio & Commercial Print Automation Tests', () => {

  describe('Scenario 1: AC-012 Bulk DishCardModel[] Schema Conformance', () => {
    it('All preset menu datasets strictly validate as DishCardModel[] with 0 errors', () => {
      let totalTested = 0;

      for (const preset of CULINARY_PRESETS) {
        const dishes = getGoldenDishesByPreset(preset.id);
        assert.ok(Array.isArray(dishes) && dishes.length > 0, `Preset ${preset.id} must provide dishes array`);

        const result = SchemaValidator.validateDishCards(dishes);
        assert.strictEqual(result.isValid, true, `Preset ${preset.id} failed DishCardModel[] validation: ${result.errors.join('; ')}`);
        assert.strictEqual(result.errors.length, 0);
        assert.strictEqual(result.count, dishes.length);

        totalTested += dishes.length;
      }

      assert.strictEqual(totalTested, 12, 'Must validate all 12 preset dishes across the 3 culinary presets');
    });

    it('Rejects invalid non-array inputs or objects with missing required fields', () => {
      const nonArrayResult = SchemaValidator.validateDishCards({ notAnArray: true });
      assert.strictEqual(nonArrayResult.isValid, false);
      assert.ok(nonArrayResult.errors[0].includes('array'));

      const corruptDishes = [
        { id: 'dish-1', originalName: 'Valid' }, // missing culturalNarrative, flavorProfile, etc.
        null,
        'string-instead-of-object'
      ];
      const corruptResult = SchemaValidator.validateDishCards(corruptDishes);
      assert.strictEqual(corruptResult.isValid, false);
      assert.strictEqual(corruptResult.errors.length, 3);
    });
  });

  describe('Scenario 2: POS JSON Serialization and Round-Trip Fidelity', () => {
    it('Serialized JSON preserves 100% structural fidelity and can be parsed back with zero loss', () => {
      const dishes = getGoldenDishesByPreset('warung-nusantara');
      const jsonString = JSON.stringify(dishes, null, 2);

      assert.ok(typeof jsonString === 'string');
      assert.ok(jsonString.length > 500);

      const parsed = JSON.parse(jsonString);
      assert.strictEqual(parsed.length, dishes.length);

      const validation = SchemaValidator.validateDishCards(parsed);
      assert.strictEqual(validation.isValid, true);
      assert.strictEqual(validation.errors.length, 0);

      // Verify specific culinary and allergen details survived
      const rendang = parsed.find(d => d.originalName === 'Rendang Daging Sapi');
      assert.ok(rendang, 'Rendang dish must exist in parsed output');
      assert.strictEqual(rendang.regionalOrigin, 'Minangkabau, West Sumatra');
      assert.strictEqual(rendang.status, 'ENRICHED');
      assert.ok(Array.isArray(rendang.allergenFlags));
      assert.strictEqual(typeof rendang.culturalNarrative.en, 'string');
      assert.ok(rendang.culturalNarrative.en.includes('crown jewel'));

      // Verify Rawon has implicit allergen flag (sambal terasi -> Crustaceans)
      const rawon = parsed.find(d => d.originalName === 'Rawon Surabaya');
      assert.ok(rawon, 'Rawon dish must exist in parsed output');
      assert.ok(rawon.allergenFlags.length > 0);
      assert.ok(rawon.allergenFlags.some(f => f.allergen === 'Crustaceans' && f.isImplicit === true));
    });

    it('Generates formatted filename following the rasalore-menu-[preset-or-timestamp].json pattern', () => {
      const presetId = 'bali-bistro';
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19);
      const filename = `rasalore-menu-${presetId}-${timestamp}.json`;

      const regex = /^rasalore-menu-[a-z0-9-]+-\d{4}-\d{2}-\d{2}T\d{2}-\d{2}-\d{2}\.json$/;
      assert.ok(regex.test(filename), `Generated filename "${filename}" must conform to expected pattern`);
    });
  });

  describe('Scenario 3: AC-011 Print Stylesheet Structural & Contract Verification', () => {
    const printCssPath = path.resolve('src/styles/print.css');

    it('print.css exists and is non-empty', () => {
      assert.ok(fs.existsSync(printCssPath), 'src/styles/print.css must exist');
      const content = fs.readFileSync(printCssPath, 'utf8');
      assert.ok(content.length > 200, 'print.css must contain rules');
    });

    it('print.css enforces A4 portrait geometry and black-and-gold dual-column specifications', () => {
      const content = fs.readFileSync(printCssPath, 'utf8');

      // 1. Media print block
      assert.ok(content.includes('@media print'), 'Must include @media print query');

      // 2. A4 page setup
      assert.ok(content.includes('size: A4 portrait'), 'Must define A4 portrait page size');

      // 3. Dual-column grid layout
      assert.ok(
        content.includes('grid-template-columns: 1fr 1fr'),
        'Must specify dual-column grid (1fr 1fr) for menu cards'
      );

      // 4. Warm amber / gold accent border (#B45309)
      assert.ok(
        content.includes('#B45309'),
        'Must include warm amber/gold (#B45309) accent border matching spec Section 12.2'
      );

      // 5. Page break inside avoid
      assert.ok(
        content.includes('page-break-inside: avoid') || content.includes('break-inside: avoid'),
        'Must enforce page-break-inside: avoid on physical cards'
      );

      // 6. Interactive studio chrome elements are hidden
      const hiddenSelectors = [
        '.site-header',
        '.hero',
        '.presets-section',
        '.custom-dish-section',
        '.queue-progress-container',
        '.side-hustle-margin-widget',
        '.studio-toolbar',
        '.export-studio-bar',
        '.site-footer',
        '.btn'
      ];

      for (const sel of hiddenSelectors) {
        assert.ok(content.includes(sel), `print.css must hide interactive element selector: ${sel}`);
      }
    });

    it('index.html links print.css with media="print" attribute', () => {
      const indexHtmlPath = path.resolve('index.html');
      const htmlContent = fs.readFileSync(indexHtmlPath, 'utf8');

      assert.ok(
        htmlContent.includes('href="src/styles/print.css"') && htmlContent.includes('media="print"'),
        'index.html must link src/styles/print.css with media="print"'
      );
    });
  });

  describe('Scenario 4: CON-001 Zero-Bundler & Clean Native ES Modules Audit', () => {
    it('package.json contains no bundler dependencies or complex build steps', () => {
      const pkgPath = path.resolve('package.json');
      const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf8'));

      // Verify no bundler devDependencies
      const forbiddenTools = ['webpack', 'vite', 'rollup', 'babel', 'parcel', 'esbuild', 'turbopack'];
      const allDeps = {
        ...(pkg.dependencies || {}),
        ...(pkg.devDependencies || {})
      };

      for (const tool of forbiddenTools) {
        assert.strictEqual(
          allDeps[tool],
          undefined,
          `CON-001 violation: Found heavy bundler "${tool}" in package.json`
        );
      }

      // Verify test script uses native Node test runner
      assert.ok(
        pkg.scripts && pkg.scripts.test && pkg.scripts.test.includes('node --test'),
        'Test script must use native node --test'
      );
    });

    it('index.html uses native Modern ES module entrypoint (<script type="module">)', () => {
      const indexHtmlPath = path.resolve('index.html');
      const html = fs.readFileSync(indexHtmlPath, 'utf8');

      assert.ok(
        html.includes('<script type="module" src="src/app.js"></script>'),
        'index.html must bootstrap via native <script type="module">'
      );
    });

    it('All application source files use standard ES module imports with .js extensions', () => {
      const srcFiles = [
        'src/app.js',
        'src/components/card-studio.js',
        'src/components/connection-banner.js',
        'src/components/margin-widget.js',
        'src/components/remote-fallback-drawer.js',
        'src/components/export-studio.js',
        'src/parsers/json-sanitizer.js',
        'src/parsers/schema-validator.js',
        'src/queue/fifo-queue.js',
        'src/data/presets.js',
        'src/data/golden-cache.js',
        'src/prompts/gemma-prompts.js',
        'src/adapters/inference-adapter.js',
        'src/adapters/ollama-client.js',
        'src/adapters/hf-client.js'
      ];

      for (const relPath of srcFiles) {
        const fullPath = path.resolve(relPath);
        assert.ok(fs.existsSync(fullPath), `File must exist: ${relPath}`);

        const code = fs.readFileSync(fullPath, 'utf8');
        // Match import lines: import ... from './...'
        const importMatches = code.match(/from\s+['"](\.[^'"]+)['"]/g) || [];

        for (const imp of importMatches) {
          assert.ok(
            imp.endsWith(".js'") || imp.endsWith('.js"'),
            `Native ES modules require explicit .js extension: found "${imp}" in ${relPath}`
          );
        }
      }
    });
  });
});
