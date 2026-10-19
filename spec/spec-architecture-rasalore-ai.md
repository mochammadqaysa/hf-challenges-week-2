---
title: RasaLore AI - System Architecture and Technical Specification
version: 1.0.0
date_created: 2026-10-19
last_updated: 2026-10-19
owner: RasaLore AI Core Team
tags: [architecture, specification, gemma-2, ollama, side-hustle, allergen-intelligence, menu-localization]
---

# Introduction

RasaLore AI is an open-source, local-first Cultural Menu Translation and Allergen Intelligence Studio. It bridges the gap between regional culinary heritage and international diners by replacing literal, unappetizing machine translations with rich **Cultural Narratives**, structured sensory **Flavor Profiles**, and proactive **Allergen Flags**. 

Powered by **Google Gemma 2 (`gemma2:2b` / `gemma2:9b`)** running on-premise via Ollama, RasaLore AI operates with 0 network latency, 0 recurring token costs, and 100% privacy for proprietary kitchen recipes. To ensure frictionless evaluation by hackathon judges and prospective hospitality clients, the system implements a **Dual-Mode Inference** architecture pairing local offline weights with pre-cached golden responses and an on-demand serverless fallback.

---

## 1. Purpose & Scope

The purpose of this specification is to define the technical requirements, component architecture, data contracts, failure isolation protocols, and verification standards for the RasaLore AI web studio.

This specification serves as the authoritative blueprint for:
- Implementing the client-side single-page application (SPA) using Modern Web Standards (ES Modules, Vanilla CSS, Web Components/Modular DOM).
- Integrating local Ollama REST endpoints (`http://localhost:11434`) and Hugging Face Serverless fallback.
- Normalizing non-deterministic small-model outputs via a multi-stage regex sanitizer.
- Processing multi-dish menus sequentially through a non-blocking FIFO queue.
- Calculating quantifiable financial savings in the **Side Hustle Margin** widget.
- Generating print-ready physical menu cards and structured POS JSON exports.

### 1.1 Out of Scope

- **Payment Gateway & Table Reservation**: Processing guest bills, credit card transactions, or seating reservations.
- **Inventory & Supply Chain Tracking**: Stock replenishment, ingredient procurement, or kitchen ledger management.
- **Multi-Tenant Cloud Backend**: Centralized user databases, remote session authentication, or persistent server-side storage.
- **In-Browser Model Training**: Training or LoRA fine-tuning of language model weights inside the browser.

### 1.2 Open Questions & Assumptions

- **ASSUMPTION-001**: Local Ollama runs on the default port `11434`. If CORS is blocked, browser `fetch` throws a `TypeError: Failed to fetch`. The UI must trap this error specifically and present copy-pasteable terminal remedies (`OLLAMA_ORIGINS="*" ollama serve`).
- **ASSUMPTION-002**: Evaluators inspecting the application without local Ollama can evaluate all 3 curated presets instantly via pre-cached golden JSON, requiring 0 external network requests and 0 API keys.
- **ASSUMPTION-003**: The primary language model is Google Gemma 2 2B (`gemma2:2b`). The prompt structure is optimized for 2B parameter instruction-tuned weights.
- **ASSUMPTION-004**: In Remote Web Fallback mode, custom ad-hoc dishes require either a local Ollama connection or a user-supplied `HF_TOKEN`. If neither is available, the UI presents an informative modal explaining token constraints and guides the user to the verified pre-cached culinary presets instead of generating unverified mock allergens.

---

## 2. Definitions

All terminology strictly adheres to the project Domain Glossary in `CONTEXT.md`:

- **Cultural Narrative**: A descriptive, culturally contextualized English portrayal of a traditional dish that explains its culinary heritage and preparation rather than translating its literal name. (*Avoid*: Literal translation, direct translation, word-for-word translation).
- **Flavor Profile**: A structured set of sensory taste and aroma attributes that characterize the dish's culinary experience. (*Avoid*: Taste notes, flavor tags, taste description).
- **Allergen Flag**: A critical dietary safety indicator highlighting common food allergens or compliance with specific religious and lifestyle diets. (*Avoid*: Food warning, allergy tag, dietary alert).
- **Side Hustle Margin**: The quantifiable cost savings and profit margin achieved by running local open-source AI models compared to subscription cloud APIs. (*Avoid*: ROI calculator, profit estimate, token savings).
- **Dual-Mode Inference**: An architecture that runs locally offline on an open-weight model engine by default, while providing an online web fallback for remote evaluation. (*Avoid*: Hybrid AI, multi-cloud LLM, mixed runtime).

---

## 3. Requirements, Constraints & Guidelines

### 3.1 Functional Requirements

- **REQ-001 (Dual-Mode Inference Hub)**: The system MUST provide an `InferenceAdapter` that defaults to querying local Ollama (`http://localhost:11434/api/generate`) with model `gemma2:2b`, with a zero-config fallback to pre-cached golden responses for presets and an optional client HF token drawer for custom dishes.
- **REQ-002 (Curated Presets Library)**: The system MUST provide three pre-loaded culinary presets (*Bali Tropical Bistro*, *Warung Nusantara Autentik*, *Specialty Coffee & Heritage Sweets*) loading authentic regional dishes into the queue in < 500ms.
- **REQ-003 (Sequential FIFO Queue)**: Multi-dish requests MUST be dispatched sequentially (concurrency = 1) through a managed FIFO queue to prevent browser memory exhaustion and local Ollama thread contention.
- **REQ-004 (Non-Blocking Per-Dish Failure Isolation)**: If an individual dish encounters an LLM timeout or unrecoverable JSON anomaly, that dish MUST transition to a localized `FAILED_ANOMALY` state with a retry button, while remaining dishes in the queue continue processing.
- **REQ-005 (Resilient Multi-Stage JSON Sanitizer)**: All raw model outputs MUST pass through regex code-fence removal, conversational prefix/suffix trimming, bracket balancing, and trailing comma elimination before invoking `JSON.parse()`.
- **REQ-006 (English-Primary Core & On-Demand Localization)**: Gemma 2 MUST generate the canonical technical representation in English. Localized views (Japanese, Simplified Mandarin, French) MUST toggle instantly for presets (pre-translated) or invoke on-demand translation for custom dishes without re-running the allergen audit pipeline.
- **REQ-007 (Side Hustle Margin Widget)**: The UI MUST compute avoided commercial cloud token costs and net profit margins based on dynamic client audit fee sliders ($25–$100).
- **REQ-008 (Print & POS Export)**: The system MUST supply a print-specific CSS layout (`@media print`) rendering high-contrast physical table inserts, and generate downloadable valid POS `.json` files.

### 3.2 Security & Privacy Requirements

- **SEC-001 (Air-Gapped Recipe Confidentiality)**: In Local Mode, 0 bytes of menu data, dish names, or kitchen ingredients shall be transmitted over external networks.
- **SEC-002 (Ephemeral Token Storage)**: If a user enters an optional Hugging Face User Access Token (`HF_TOKEN`) in the remote fallback drawer, the token MUST remain strictly in volatile memory (`sessionStorage` or in-memory state), never written to `localStorage`, cookies, or remote logs.
- **SEC-003 (XSS Prevention)**: All LLM-generated strings must be sanitized or injected using safe DOM manipulation APIs (`textContent`, safe template builders) before rendering into dish cards.

### 3.3 Constraints & Guidelines

- **CON-001 (Zero Heavy Bundler Dependency)**: Application core MUST run using modern native ES Modules (`<script type="module">`) and Vanilla CSS, enabling instant execution via any static HTTP file server without mandatory `npm run build` compilation steps.
- **CON-002 (Inference Latency Limit)**: Local inference on consumer hardware with `gemma2:2b` should target < 4.0 seconds per dish. The HTTP timeout for local calls is capped at 15.0 seconds before triggering failure isolation.
- **GUD-001 (Culinary Luxury Aesthetic)**: All UI components must adhere to the defined palette: Deep Culinary Slate (`#0B0F17`), Card Glass (`rgba(18, 24, 38, 0.75)`), Spice Amber (`#F59E0B`), Pandan Emerald (`#10B981`), and Crisp Cream (`#F9FAFB`).

---

## 4. Interfaces & Data Contracts

### 4.1 Domain Data Models

```typescript
/**
 * Supported regional culinary allergen categories.
 */
export type AllergenType =
  | 'Crustaceans'     // e.g., terasi, dried shrimp, paste
  | 'TreeNuts'        // e.g., kemiri / candlenut
  | 'Peanuts'         // e.g., bumbu kacang
  | 'Gluten'          // e.g., wheat soy sauce, noodles
  | 'Soy'             // e.g., kecap manis, tempe, tahu
  | 'Dairy'           // e.g., condensed milk, butter, ghee
  | 'Egg'             // e.g., telur asin, egg wash
  | 'Fish'            // e.g., fish sauce, petis ikan
  | 'Sesame'          // e.g., sesame oil, wijen
  | 'Mollusks'        // e.g., oyster sauce, cumi
  | 'Sulfites';       // e.g., preserved vegetables

export type AllergenSeverity = 'CRITICAL_WARNING' | 'DIETARY_NOTICE';

export interface AllergenFlag {
  allergen: AllergenType;
  severity: AllergenSeverity;
  sourceIngredient: string;
  isImplicit: boolean;         // True if ingredient is hidden/traditional base (e.g., terasi in sambal)
  advisoryNote: string;
}

export type DietaryTag =
  | 'Halal-Friendly'
  | 'Vegetarian'
  | 'Vegan'
  | 'Pescatarian'
  | 'Nut-Free'
  | 'Gluten-Free'
  | 'Dairy-Free';

export interface FlavorProfile {
  descriptors: string[];       // 3 to 5 high-impact sensory tags (e.g., "Aromatic Galangal", "Smoky Coconut")
  primaryTaste: string;        // e.g., "Rich, Savory & Earthy"
  spiceLevel: 'None' | 'Mild' | 'Medium' | 'Hot' | 'Fiery';
}

export interface LocalizedNarrative {
  en: string;
  ja?: string;
  zh?: string;
  fr?: string;
}

export interface DishInput {
  id: string;
  name: string;
  regionalOrigin?: string;     // e.g., "East Java", "Bali", "Betawi"
  rawIngredients: string;      // Comma-separated or natural raw kitchen notes
  priceText?: string;          // e.g., "IDR 45.000" or "$3.50"
  notes?: string;
}

export type DishProcessingStatus =
  | 'IDLE'
  | 'QUEUED'
  | 'PROCESSING'
  | 'ENRICHED'
  | 'FAILED_ANOMALY';

export interface DishCardModel {
  id: string;
  originalName: string;
  regionalOrigin: string;
  priceText: string;
  rawIngredients: string;
  culturalNarrative: LocalizedNarrative;
  flavorProfile: FlavorProfile;
  allergenFlags: AllergenFlag[];
  dietaryTags: DietaryTag[];
  requiresKitchenVerification: boolean; // Flagged when ingredients are vague or incomplete
  status: DishProcessingStatus;
  rawResponseText?: string;             // Preserved on anomaly for inspection & retry
  errorMessage?: string;
  tokensConsumed?: {
    promptTokens: number;
    completionTokens: number;
    totalTokens: number;
  };
}
```

### 4.2 Inference Adapter Contracts

```typescript
export type InferenceEngineMode = 'LOCAL_OLLAMA' | 'REMOTE_FALLBACK';

export interface InferenceAdapterConfig {
  mode: InferenceEngineMode;
  ollamaBaseUrl: string;       // Default: "http://localhost:11434"
  modelName: string;           // Default: "gemma2:2b"
  hfToken?: string;            // Ephemeral token for live remote fallback
  timeoutMs: number;           // Default: 15000
}

export interface InferenceRequest {
  dish: DishInput;
  targetLanguage?: 'en' | 'ja' | 'zh' | 'fr';
}

export interface InferenceResponse {
  success: boolean;
  rawText: string;
  parsedDish?: Partial<DishCardModel>;
  promptTokens: number;
  completionTokens: number;
  engineUsed: 'LOCAL_OLLAMA' | 'PRECACHED_GOLDEN' | 'HF_SERVERLESS';
  latencyMs: number;
  error?: string;
}

export interface IInferenceAdapter {
  checkHealth(): Promise<{ isAvailable: boolean; message: string; mode: InferenceEngineMode }>;
  enrichDish(request: InferenceRequest): Promise<InferenceResponse>;
  localizeNarrative(dishId: string, englishText: string, targetLang: 'ja' | 'zh' | 'fr'): Promise<string>;
}
```

### 4.3 Sanitizer & Schema Validator Contracts

```typescript
export interface SanitizerResult {
  success: boolean;
  repairedJsonString: string;
  data: Partial<DishCardModel> | null;
  anomaliesFixed: string[];    // e.g., ["STRIPPED_CODE_FENCE", "FIXED_TRAILING_COMMA", "CLOSED_UNMATCHED_BRACKET"]
  error?: string;
}

export interface IJsonSanitizer {
  sanitize(rawResponse: string): SanitizerResult;
  validateSchema(data: unknown): { isValid: boolean; errors: string[] };
}
```

### 4.4 FIFO Queue Contracts

```typescript
export interface QueueProgressEvent {
  dishId: string;
  index: number;
  total: number;
  status: DishProcessingStatus;
  result?: DishCardModel;
  error?: string;
}

export interface IFifoQueueManager {
  enqueue(dishes: DishInput[]): void;
  start(): Promise<void>;
  stop(): void;
  retryDish(dishId: string): Promise<void>;
  onProgress(callback: (event: QueueProgressEvent) => void): void;
}
```

---

## 5. Acceptance Criteria

### 5.1 Dual-Mode Inference Hub

- **AC-001**: Given the application is loaded, When checking local connection to `http://localhost:11434/api/tags`, Then the health indicator displays `Connected (Local Ollama)` if reachable within 3 seconds, or `Fallback Active (Pre-Cached / Web)` if unreachable.
- **AC-002**: Given Ollama returns a CORS error or socket refusal, When the connection fails, Then the UI renders a non-blocking banner containing copyable commands (`OLLAMA_ORIGINS="*" ollama serve`) and automatically routes preset evaluations to Pre-cached Golden Responses.
- **AC-003**: Given a user selects Remote Fallback mode and enters a custom dish, When an optional `HF_TOKEN` is supplied in the settings drawer, Then requests dispatch to `https://api-inference.huggingface.co/models/google/gemma-2-2b-it`.
- **AC-003A**: Given an evaluator attempts to generate a custom dish in Remote Fallback mode without an `HF_TOKEN` and without local Ollama, When "Generate" is clicked, Then the UI displays a non-blocking modal explaining token requirements for live fallback inference, providing a direct link to open the token configuration drawer and a 1-click option to switch to one of the 3 verified culinary presets without crashing or generating unverified allergen data.

### 5.2 Cultural Narrative & Allergen Intelligence

- **AC-004**: Given a traditional dish (e.g., *"Rawon Surabaya"* with ingredients *"beef shank, kluwek, lemongrass, garlic, shallot, sambal terasi"*), When Gemma 2 completes inference, Then the generated **Cultural Narrative** details the slow-simmered black kluwek nut broth without literal translation words like "Black Soup".
- **AC-005**: Given ingredients containing *"sambal terasi"*, When the **Allergen Flag** module evaluates the dish, Then an `AllergenFlag` of type `Crustaceans` with severity `CRITICAL_WARNING` and `isImplicit = true` is attached to the card.
- **AC-006**: Given an input containing only a dish name without ingredients, When processed, Then the system marks `requiresKitchenVerification = true` and renders an amber *"Kitchen Verification Advised"* notice on the card.

### 5.3 Resilient JSON Sanitization

- **AC-007**: Given Gemma 2 outputs markdown code blocks ```` ```json { "dishName": "Sate Lilit", ... } ``` ```` with conversational banter (`Here is your culinary analysis:`), When `JsonSanitizer.sanitize()` executes, Then code fences and conversational headers are stripped and valid JSON is parsed.
- **AC-008**: Given an output with trailing commas (`"flavorProfile": ["Savory", "Smoky",],`), When sanitized, Then trailing commas are removed and parsing succeeds with 0 syntax exceptions.
- **AC-009**: Given completely truncated output with missing closing braces, When parsing fails completely, Then the card transitions to `FAILED_ANOMALY`, displaying raw captured text and an interactive *"Retry Dish"* button without freezing the remaining queue.

### 5.4 Side Hustle Margin Widget

- **AC-010**: Given 10 dishes processed via local Ollama ($0 token cost), When the client audit fee slider is set to $50, Then the widget displays: Avoided Cloud Cost: `$0.08` (based on standard token pricing), Realized Gross Margin: `99.8%`+, and Monthly Projection: `$1,000 / month` at 5 audits/week.

### 5.5 Commercial Print & POS Export

- **AC-011**: Given the operator clicks *"Print Physical Menu"*, When browser print preview renders, Then navigation controls, sliders, and dark background graphics are hidden, replaced by an elegant, high-contrast, black-and-gold dual-column printable layout.
- **AC-012**: Given the operator clicks *"Export POS JSON"*, When downloaded, Then the output file conforms 100% to the `DishCardModel[]` schema.

---

## 6. Test Automation Strategy & Testing Seams

### 6.1 Testing Seams

To ensure testability without coupling tests to internal UI widgets, all features are exposed through 4 primary testing seams:

```text
┌────────────────────────────────────────────────────────────────┐
│                        Testing Seams                           │
├───────────────────────────────┬────────────────────────────────┤
│ 1. Adapter Seam               │ InferenceAdapter.enrichDish()   │
│ 2. Sanitizer Seam             │ JsonSanitizer.sanitize()        │
│ 3. Queue Seam                 │ FifoQueueManager.enqueue()     │
│ 4. Financial Math Seam        │ MarginCalculator.calculate()   │
└───────────────────────────────┴────────────────────────────────┘
```

### 6.2 Test Levels & Scenarios

- **Unit Tests (`tests/sanitizer.test.js`)**:
  - Valid standard JSON payload.
  - Markdown fence wrapping (```` ```json ```` and ```` ``` ````).
  - Conversational prefix (`Certainly! Here is...`) and trailing text (`I hope this helps!`).
  - Trailing commas in arrays and nested objects.
  - Truncated JSON recovery via closing bracket injection.
  - Extreme unrecoverable gibberish (asserts graceful anomaly payload generation).
- **Integration Tests (`tests/queue.test.js`)**:
  - Enqueue 3 dishes: verify sequential FIFO execution order.
  - Dish #2 synthetic network error: verify Dish #1 succeeds, Dish #2 isolates into `FAILED_ANOMALY`, Dish #3 processes successfully.
  - Single-dish retry: verify retrying Dish #2 updates its card without affecting Dish #1 or #3.
- **Financial Math Tests (`tests/margin.test.js`)**:
  - Verify zero-division safety when audit fee is set to $0.
  - Verify correct cloud cost avoidance calculation against standard token benchmarks.

### 6.3 Test Data Management

Synthetic LLM output fixtures are stored under `tests/fixtures/`:
- `fixture-gemma-clean.json`
- `fixture-gemma-markdown-fences.txt`
- `fixture-gemma-trailing-commas.txt`
- `fixture-gemma-truncated.txt`

---

## 7. Project Structure & Commands

### 7.1 Project Structure

```text
[Project Root]
├── index.html                  # Single-page web studio entry point
├── src/
│   ├── adapters/
│   │   ├── inference-adapter.js # Dual-Mode manager (Ollama, Golden, HF)
│   │   ├── ollama-client.js     # Localhost:11434 HTTP fetch client
│   │   └── hf-client.js         # Hugging Face serverless client
│   ├── parsers/
│   │   ├── json-sanitizer.js    # Multi-stage regex cleanup & bracket repair
│   │   └── schema-validator.js  # Schema assertions & fallback constructor
│   ├── queue/
│   │   └── fifo-queue.js        # Sequential queue with failure isolation
│   ├── data/
│   │   ├── presets.js           # Bali, Nusantara, Coffee preset datasets
│   │   └── golden-cache.js      # Pre-cached golden responses for instant demo
│   ├── components/
│   │   ├── card-studio.js       # Glassmorphic dish card UI renderer
│   │   ├── margin-widget.js     # Side Hustle Margin calculator
│   │   ├── export-studio.js     # POS JSON download & QR preview modal
│   │   └── connection-banner.js # Health indicator & CORS guidance modal
│   ├── styles/
│   │   ├── main.css             # Glassmorphism, luxury culinary theme
│   │   └── print.css            # @media print physical menu card styles
│   └── prompts/
│       └── gemma-prompts.js     # Few-shot culinary historian prompt templates
├── tests/
│   ├── sanitizer.test.js        # Sanitizer resilience test harness
│   ├── queue.test.js            # Queue failure isolation test harness
│   └── margin.test.js           # Financial formula unit tests
├── docs/                        # Architecture and SDLC documents
│   ├── ARCHITECTURE.md
│   ├── adr/
│   │   └── 0001-hybrid-fallback-and-pre-cached-responses.md
│   └── audit/
├── spec/                        # Technical specifications
│   └── spec-architecture-rasalore-ai.md
└── package.json                 # Optional lightweight test dependencies
```

### 7.2 Commands

- **Local Development Server**:
  ```powershell
  # Using built-in Python static server (zero npm dependencies)
  python -m http.server 3000
  # Or using Node http-server / npx serve
  npx serve . -l 3000
  ```
- **Run Local Ollama Model**:
  ```powershell
  # Pull Google Gemma 2 2B
  ollama pull gemma2:2b
  # Run Ollama with permissive CORS for browser fetch
  $env:OLLAMA_ORIGINS="*"
  ollama serve
  ```
- **Run Verification Tests**:
  ```powershell
  node --test tests/*.test.js
  ```
- **Lint / Format**:
  ```powershell
  npx prettier --check "src/**/*.js"
  ```

---

## 8. Code Style & Conventions

- **Modern Vanilla ES Modules**: Use clean ES6+ exports/imports.
- **Defensive Error Handling**: Every async network call must be wrapped in `try...catch` and return typed result objects rather than throwing unhandled rejections.
- **No Global Scope Pollution**: All components and state managers encapsulate state within closures or classes.
- **Surgical DOM Updates**: Manipulate DOM elements directly through targeted element updates instead of destructive `innerHTML = ""` rewrites that discard event listeners.

```javascript
/**
 * Example: Resilient JSON Sanitizer Pattern
 */
export class JsonSanitizer {
  /**
   * Sanitizes and parses imperfect model output.
   * @param {string} rawText
   * @returns {{ success: boolean, data: object|null, fixedAnomalies: string[], error?: string }}
   */
  static sanitize(rawText) {
    if (!rawText || typeof rawText !== 'string') {
      return { success: false, data: null, fixedAnomalies: [], error: 'Empty input' };
    }

    const fixedAnomalies = [];
    let cleaned = rawText.trim();

    // 1. Strip markdown code fences (```json ... ``` or ``` ... ```)
    const codeFenceMatch = cleaned.match(/```(?:json)?\s*([\s\S]*?)\s*```/i);
    if (codeFenceMatch) {
      cleaned = codeFenceMatch[1].trim();
      fixedAnomalies.push('STRIPPED_CODE_FENCE');
    }

    // 2. Locate first '{' and last '}' to strip conversational banter
    const firstBrace = cleaned.indexOf('{');
    const lastBrace = cleaned.lastIndexOf('}');
    if (firstBrace !== -1 && lastBrace !== -1 && lastBrace > firstBrace) {
      if (firstBrace > 0 || lastBrace < cleaned.length - 1) {
        cleaned = cleaned.substring(firstBrace, lastBrace + 1);
        fixedAnomalies.push('TRIMMED_CONVERSATIONAL_TEXT');
      }
    }

    // 3. Fix trailing commas before closing braces/brackets
    const trailingCommaRegex = /,\s*([}\]])/g;
    if (trailingCommaRegex.test(cleaned)) {
      cleaned = cleaned.replace(trailingCommaRegex, '$1');
      fixedAnomalies.push('FIXED_TRAILING_COMMAS');
    }

    // 4. Attempt JSON.parse
    try {
      const parsed = JSON.parse(cleaned);
      return { success: true, data: parsed, fixedAnomalies };
    } catch (parseError) {
      // 5. Attempt bracket stack auto-closure if truncated
      const openCount = (cleaned.match(/{/g) || []).length;
      const closeCount = (cleaned.match(/}/g) || []).length;
      if (openCount > closeCount) {
        const repaired = cleaned + '}'.repeat(openCount - closeCount);
        try {
          const repairedData = JSON.parse(repaired);
          fixedAnomalies.push('REPAIRED_UNCLOSED_BRACKETS');
          return { success: true, data: repairedData, fixedAnomalies };
        } catch {
          // Fall through to error
        }
      }

      return {
        success: false,
        data: null,
        fixedAnomalies,
        error: `JSON parse failed: ${parseError.message}`
      };
    }
  }
}
```

---

## 9. Implementation Boundaries

The implementing developer agent (`/sdlc-write-code`) must strictly adhere to the Three-Tier Guardrail System:

### Always Do:
- Run verification tests after every module creation.
- Check and trap CORS / connection errors when calling `localhost:11434`.
- Isolate per-dish queue errors without blocking other menu items.
- Maintain responsive, glassmorphic visual aesthetics with no generic unstyled elements.
- Write code comments and git commit messages in clear, concise English.

### Ask First:
- Adding external npm runtime dependencies beyond standard development scripts.
- Modifying the core domain interfaces or changing field names in `DishCardModel`.
- Altering the defined color palette or replacing Google Gemma 2 prompt structures.

### Never Do:
- Remove or bypass schema validation checks to silence parse failures.
- Make outbound cloud network calls while in Local Offline Mode.
- Store user `HF_TOKEN` credentials in persistent `localStorage` or send them to third-party tracking services.
- Overwrite entire files if a surgical edit is sufficient.

---

## 10. Rationale, Context & Architecture Decisions (ADRs)

- **ADR-0001 (Hybrid Fallback and Pre-Cached Golden Responses)**: Documented in [`docs/adr/0001-hybrid-fallback-and-pre-cached-responses.md`](file:///d:/hacktoberfest/hf-challenges-week-2/docs/adr/0001-hybrid-fallback-and-pre-cached-responses.md).
  - *Rationale*: Eliminates evaluator drop-off during remote hackathon judging by providing instant, 0-cost, 100% deterministic evaluations without requiring local Ollama installations or cloud API keys.

---

## 11. Dependencies & External Integrations

### External Systems

- **EXT-001 (Local Ollama Engine)**:
  - *Endpoint*: `http://localhost:11434/api/generate`
  - *Method*: HTTP POST
  - *Payload*: `{ "model": "gemma2:2b", "prompt": "<structured-prompt>", "stream": false, "options": { "temperature": 0.3 } }`
  - *SLA*: Local response time typically 2.0s–4.0s per dish.

### Third-Party Services

- **SVC-001 (Hugging Face Serverless Inference)**:
  - *Endpoint*: `https://api-inference.huggingface.co/models/google/gemma-2-2b-it`
  - *Purpose*: On-demand live fallback for custom dishes when evaluator supplies optional `HF_TOKEN`.
- **SVC-002 (DevRelay Gateway)**:
  - *Purpose*: Recording development agent sessions and staging Hacktoberfest DEV Challenge post metadata.

### Infrastructure Dependencies

- **INF-001 (Static Web Hosting)**: Static HTML5/ES Modules web server (e.g., GitHub Pages, Render, or local static server). Zero server-side compute or backend database required.

### Data Dependencies

- **DAT-001 (Curated Presets Dataset)**: Local static JavaScript module (`src/data/presets.js`) defining Bali, Nusantara, and Specialty Coffee menus.
- **DAT-002 (Pre-Cached Golden Responses)**: Local static JavaScript module (`src/data/golden-cache.js`) containing validated Gemma 2 JSON outputs and multilingual translations.

---

## 12. Examples & Edge Cases

### 12.1 Side Hustle Margin Widget Mathematical Formulas

The financial calculations embedded in `src/components/margin-widget.js` are governed by the following formulas:

#### 1. Avoided Commercial Cloud API Cost ($)
$$\text{Tokens}_{\text{in}} = N_{\text{dishes}} \times 450 \quad (\text{average prompt tokens per dish})$$
$$\text{Tokens}_{\text{out}} = N_{\text{dishes}} \times 350 \quad (\text{average completion tokens per dish})$$
$$\text{Cost}_{\text{avoided}} = \left(\frac{\text{Tokens}_{\text{in}}}{1{,}000{,}000} \times P_{\text{in}}\right) + \left(\frac{\text{Tokens}_{\text{out}}}{1{,}000{,}000} \times P_{\text{out}}\right)$$

*Parameters based on commercial multi-modal frontier benchmarks (GPT-4o equivalent):*
- $P_{\text{in}} = \$2.50 \text{ per 1M input tokens}$
- $P_{\text{out}} = \$10.00 \text{ per 1M output tokens}$
- Local Gemma 2 variable inference cost = $\$0.0000$

#### 2. Realized Gross Margin Percentage (%)
$$\text{Gross Profit} = \text{Fee}_{\text{client}} - \text{Cost}_{\text{direct}}$$
$$\text{Gross Margin} = \left(\frac{\text{Fee}_{\text{client}} - 0}{\text{Fee}_{\text{client}}}\right) \times 100\% = 100\%$$
*(Accounting for amortized hardware electricity of \$0.01 per run yields **99.98%** real margin).*

#### 3. Monthly Revenue Projection ($)
$$\text{Monthly Revenue} = \text{Fee}_{\text{client}} \times (\text{Menus per Week} \times 4.33)$$
*Example with Fee = \$50, Volume = 5 menus/week: \$50 \times 21.65 = **\$1,082.50 / month**.*

---

### 12.2 Print Stylesheet Specifications (`src/styles/print.css`)

```css
@media print {
  /* 1. Global Page Reset */
  @page {
    size: A4 portrait;
    margin: 1.5cm 1.2cm;
  }

  body {
    background: #FFFFFF !important;
    color: #111827 !important;
    font-family: 'Georgia', 'Times New Roman', serif;
    font-size: 10pt;
    line-height: 1.4;
  }

  /* 2. Hide Interactive & Studio Chrome Elements */
  .header-navbar,
  .hero-section,
  .inference-hub,
  .preset-bar,
  .input-drawer,
  .queue-progress-bar,
  .side-hustle-margin-widget,
  .export-action-bar,
  .modal-overlay,
  .btn-retry,
  .language-switcher {
    display: none !important;
  }

  /* 3. Container & Two-Column Menu Card Layout */
  .menu-studio-container {
    width: 100% !important;
    margin: 0 !important;
    padding: 0 !important;
    display: block !important;
  }

  .dish-cards-grid {
    display: grid !important;
    grid-template-columns: 1fr 1fr !important;
    gap: 1.5rem !important;
  }

  /* 4. Elegant Physical Card Styling */
  .dish-card {
    background: #FFFFFF !important;
    border: 1px solid #D1D5DB !important;
    border-top: 3px solid #B45309 !important; /* Elegant warm amber header accent */
    border-radius: 4px !important;
    padding: 1rem !important;
    box-shadow: none !important;
    page-break-inside: avoid !important;
    break-inside: avoid !important;
  }

  .dish-title {
    font-size: 13pt !important;
    font-weight: 700 !important;
    color: #1F2937 !important;
    margin-bottom: 0.25rem !important;
  }

  .dish-origin-price {
    font-size: 9pt !important;
    font-style: italic !important;
    color: #4B5563 !important;
    margin-bottom: 0.5rem !important;
  }

  .dish-narrative {
    font-size: 9.5pt !important;
    color: #374151 !important;
    margin-bottom: 0.75rem !important;
  }

  /* 5. High-Contrast Sensory & Allergen Badges */
  .flavor-profile-chip {
    background: #F3F4F6 !important;
    border: 1px solid #E5E7EB !important;
    color: #1F2937 !important;
    font-size: 8pt !important;
    padding: 2px 6px !important;
  }

  .allergen-badge-critical {
    background: #FEE2E2 !important;
    border: 1px solid #EF4444 !important;
    color: #991B1B !important;
    font-weight: bold !important;
    font-size: 8pt !important;
  }
}
```

---

## 13. Validation Criteria

A build or implementation is declared compliant with this specification if and only if:

1. **Dual-Mode Verification**:
   - `InferenceAdapter` successfully queries local Ollama if online.
   - Preset switches instantly load pre-cached golden records without network errors if Ollama is offline.
2. **Sanitization Resilience**:
   - 100% of test fixtures in `tests/sanitizer.test.js` (including markdown code fences, conversational pre/postamble, and trailing commas) parse into valid `DishCardModel` instances.
3. **Failure Isolation**:
   - Simulated failures on an individual dish in `tests/queue.test.js` isolate that card without freezing or throwing errors across remaining dishes.
4. **Allergen Accuracy**:
   - Hidden regional allergens (*terasi*, *kemiri*, peanut paste) in the preset database are classified with `CRITICAL_WARNING` and `isImplicit = true`.
5. **Print & JSON Export**:
   - Triggering window print renders a two-column black-and-gold layout with zero navigation controls visible.
   - POS JSON export downloads a `.json` file that passes schema validation.

---

## 14. Related Specifications / Further Reading

- [Product Requirements Document (PRD)](file:///d:/hacktoberfest/hf-challenges-week-2/docs/prd-20261019-1041-rasalore-ai.md)
- [Clarification & Decision Audit Report](file:///d:/hacktoberfest/hf-challenges-week-2/docs/audit/clarification-report-rasalore-ai-2026-10-19.md)
- [Architecture Documentation (`docs/ARCHITECTURE.md`)](file:///d:/hacktoberfest/hf-challenges-week-2/docs/ARCHITECTURE.md)
- [Domain Glossary (`CONTEXT.md`)](file:///d:/hacktoberfest/hf-challenges-week-2/CONTEXT.md)
- [ADR 0001: Hybrid Fallback & Pre-Cached Golden Responses](file:///d:/hacktoberfest/hf-challenges-week-2/docs/adr/0001-hybrid-fallback-and-pre-cached-responses.md)
- [Google Gemma 2 Official Documentation](https://ai.google.dev/gemma/docs)
- [Ollama REST API Specification](https://github.com/ollama/ollama/blob/main/docs/api.md)
