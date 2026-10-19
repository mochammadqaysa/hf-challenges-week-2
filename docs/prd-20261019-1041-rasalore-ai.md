# PRD: RasaLore AI - Cultural Menu Translation & Allergen Intelligence Studio

## 1. Product overview

### 1.1 Document title and version

- **Document Title**: Product Requirements Document (PRD) - RasaLore AI
- **Version**: 1.0.0
- **Status**: Draft for Clarification Gate
- **Created Date**: 2026-10-19
- **SDLC Phase**: Phase PRD (Product Requirements)
- **Target Event**: Hacktoberfest 2026 Open-Source AI Challenge Week 2 (Side Hustle)
- **Target Partner Category**: Best Use of Gemma (Google Gemma 2 2B / 9B)

### 1.2 Product summary

RasaLore AI is an open-source, local-first Cultural Menu Translation and Allergen Intelligence Studio designed specifically for independent restaurants, heritage cafes, boutique coffee shops, and culinary entrepreneurs. In regions with rich food heritages, independent food and beverage (F&B) operators frequently lose revenue from international tourists because standard machine translation tools (such as Google Translate) produce comical, unappealing literal translations (e.g., converting "Rawon" to "Black Soup" or "Soto Betawi" to "Intestine Soup in Coconut Milk"). More critically, generic translation fails to surface culturally implicit allergens—such as fermented shrimp paste (*terasi*), candlenut (*kemiri*), or dairy hidden in traditional broths—creating dangerous liability and severe health risks for foreign diners.

RasaLore AI solves this problem by utilizing **Google Gemma 2** open-weight models executed locally on any standard laptop or point-of-sale (POS) workstation via Ollama. By running 100% on-premise without recurring cloud API fees, RasaLore AI preserves absolute confidentiality for proprietary kitchen recipes while unlocking an immediately monetizable "Side Hustle" agency model. Freelancers and digital agencies can deliver a comprehensive "Cultural Digital Menu & Allergen Audit Service" to local eateries for $25–$100 per menu, generating high profit margins with zero variable token costs.

To ensure flawless evaluation during hackathon judging and remote demonstrations, RasaLore AI implements a **Dual-Mode Inference** architecture. The application runs offline on local open weights by default, with a seamless, zero-config toggle to an online web fallback gateway for evaluators without local Ollama installations.

---

## 2. Goals

### 2.1 Business goals

- **Unlock Zero-Overhead Side Hustle Economics**: Enable technical freelancers and boutique marketing agencies to offer a high-margin ($25–$100/menu) culinary localization and food safety audit service with $0 ongoing token expenditure.
- **Champion Open-Source AI Independence**: Demonstrate the superiority of local open-weight models (Google Gemma 2) over proprietary closed-API subscriptions for micro-businesses, ensuring zero vendor lock-in and complete price predictability.
- **Guarantee Complete Culinary Privacy**: Ensure 100% on-premise data governance so that family recipes, secret spice formulations, and kitchen notes never leave the local hardware.
- **Achieve Hackathon Recognition**: Win the Hacktoberfest Week 2 "Side Hustle" Challenge and the "Best Use of Gemma" sponsor track by showcasing production-grade prompt engineering, deterministic output extraction, and instant evaluability (< 10 seconds to value).

### 2.2 User goals

- **For Restaurant Guests & International Diners**: Discover authentic regional dishes through evocative, appetizing **Cultural Narratives** while remaining completely protected by unambiguous, proactive **Allergen Flags**.
- **For Restaurant Owners & Chefs**: Welcome international patrons with pride, eliminate communication friction at the table, eliminate dietary liability, and receive ready-to-print physical menu cards and digital QR menus.
- **For Freelancers & Operators**: Ingest raw, messy kitchen menus in seconds, enrich them automatically through local Gemma 2 inference, inspect profit margins via an interactive **Side Hustle Margin** widget, and export client deliverables in under 5 minutes.
- **For Evaluators & Judges**: Verify the complete functionality of the application in under 10 seconds through pre-loaded realistic culinary presets without requiring complex local configuration.

### 2.3 Non-goals (Out of Scope)

- **Point-of-Sale (POS) Transaction Processing**: The platform will not handle order billing, credit card payments, cashier ledger balancing, or table reservation booking.
- **Kitchen Inventory & Supply Chain Management**: Tracking raw ingredient stock levels, procurement orders, or supplier invoicing is out of scope.
- **Centralized SaaS Multi-Tenant Cloud Architecture**: The application will not require cloud user signups, centralized user authentication, or persistent remote databases; local-first browser storage and local inference are the core architectural foundations.
- **In-Browser Model Training / Fine-Tuning**: The application consumes pre-trained Google Gemma 2 weights and will not perform on-device weight adaptation or LoRA fine-tuning.

---

## 3. User personas

### 3.1 Key user types

1. **Side Hustle Consultant / Freelance Developer** (Primary Operator)
2. **Independent Restaurant Owner / Chef** (B2B Client)
3. **International Tourist / Diner with Dietary Restrictions** (End Beneficiary)
4. **Hackathon Judge / Open Innovation Evaluator** (Reviewer)

### 3.2 Basic persona details

- **Budi (The Side Hustle Consultant)**:
  - *Demographics*: 26-year-old freelance web developer and digital marketer in Denpasar/Jakarta.
  - *Needs*: High-margin service offerings to upsell local hospitality clients without incurring recurring cloud API bills.
  - *Frustrations*: Expensive subscription APIs (OpenAI, Claude) that eat into project profits and fail on regional slang and traditional food nuance.
  - *Goal*: Run batch menu audits on his laptop, demonstrate immediate visual value to cafe owners, and hand over polished physical and digital menus for a quick $50 fee per gig.

- **Chef Wayan (The Heritage Restaurant Owner)**:
  - *Demographics*: 48-year-old owner of a traditional Balinese bistro with 20 tables.
  - *Needs*: Attract high-spending international tourists while preventing allergen incidents caused by unstated ingredients like *terasi* (fermented shrimp paste).
  - *Frustrations*: Online translation tools make his signature dishes sound bizarre and unappetizing. Reluctant to share secret spice recipes on cloud websites.
  - *Goal*: Professional English and Japanese menu descriptions that tell the cultural story of his dishes, with clear allergen warnings and zero technical hassle.

- **Elena (The International Tourist with Food Allergies)**:
  - *Demographics*: 31-year-old traveler from Melbourne with severe peanut and shellfish allergies.
  - *Needs*: Safe exploration of authentic local street food and traditional dishes.
  - *Frustrations*: Fear of hidden allergens in unfamiliar sauces, uninformative menus, and staff language barriers.
  - *Goal*: Scan a digital QR card or read a physical menu card that clearly highlights dietary flags, spicy notes, and cultural origins in clear English.

- **Alex (The Hackathon Judge)**:
  - *Demographics*: Technical evaluator judging entries for Hacktoberfest Week 2 and Google Gemma partner tracks.
  - *Needs*: Immediate verification of the project's technical architecture, local-first open-weight integration, and genuine side-hustle utility.
  - *Frustrations*: Projects that require 30 minutes of setup, broken localhost endpoints, or lack live fallback demonstrations.
  - *Goal*: Evaluate the app in under 60 seconds using pre-built presets, inspect the Gemma prompt engineering, and review the open innovation value proposition.

### 3.3 Role-based access

- **Studio Operator (Freelancer / Restaurant Manager)**:
  - Full access to the Menu Studio workstation.
  - Ability to choose inference engine (Local Ollama vs. Web Fallback Gateway).
  - Ability to input/edit dishes, trigger AI enrichment, adjust **Flavor Profiles**, configure **Allergen Flags**, view the **Side Hustle Margin** widget, and trigger multi-format exports.
- **Guest / Diner (Read-Only Consumer)**:
  - Read-only access to interactive digital dish cards and print layouts.
  - Ability to toggle viewing language (English, Japanese, Mandarin, French) and filter by dietary preference (Halal, Vegan, Nut-Free, Shellfish-Free).

---

## 4. Functional requirements

### 4.1 Dual-Mode Inference Engine Hub (Priority: P0 - Critical)

- The system MUST provide an intuitive connection manager that interfaces with a local Ollama instance running `gemma2:2b` or `gemma2:9b` via `http://localhost:11434`.
- The system MUST offer a one-click toggle to a **Remote Web Fallback Gateway** (via Hugging Face Serverless Inference API) to allow instant evaluation when Ollama is not installed or running.
- The system MUST automatically detect connection status and display visual health indicators: `Connected (Local Ollama)`, `Fallback Active (Cloud Web)`, or `Disconnected`.
- When local Ollama encounters CORS or connection failures, the system MUST display friendly, copy-pasteable terminal instructions (`OLLAMA_ORIGINS="*" ollama serve`) and provide an immediate switch to Fallback Mode.

### 4.2 Cultural Narrative & Nuance Generation (Priority: P0 - Critical)

- The system MUST transform basic or traditional dish names and raw ingredient lists into rich, evocative **Cultural Narratives** (1-2 sentences) explaining heritage, cooking techniques, and mouthwatering context instead of literal word-for-word translations.
- The system MUST strictly enforce prompt constraints guiding Google Gemma 2 to act as a World-Class Culinary Historian and Food Safety Specialist.
- The generation MUST maintain a low temperature (`0.3`) to balance creative culinary storytelling with strict factual consistency regarding ingredients.

### 4.3 Sensory Flavor Profile Extraction (Priority: P0 - Critical)

- The system MUST extract a structured **Flavor Profile** for each processed dish containing 3 to 5 sensory descriptors (e.g., "Aromatic Lemongrass", "Smoky Galangal", "Velvety Coconut", "Earthy Turmeric").
- Descriptors MUST be rendered as high-contrast, visually pleasing sensory chips on each digital menu card.

### 4.4 Implicit Allergen Intelligence & Dietary Flagging (Priority: P0 - Critical)

- The system MUST identify and categorize implicit and explicit allergens commonly found in regional culinary preparations, including but not limited to:
  - Crustaceans & Shellfish (e.g., *terasi*, shrimp paste, dried shrimp)
  - Tree Nuts & Peanuts (e.g., *kemiri*/candlenut, peanut sauce)
  - Soy & Gluten (e.g., *kecap manis*, wheat-based noodles, fermented soybean)
  - Dairy & Egg (e.g., egg washes, ghee, condensed milk)
- The system MUST generate explicit **Allergen Flags** with severity badges (Critical Warning vs. Dietary Notice) and dietary certifications (e.g., *Halal-Friendly*, *Vegetarian*, *Vegan*).
- If ingredient information is ambiguous, the system MUST tag the dish with a "Kitchen Verification Advised" safety banner rather than assuming the dish is allergen-free.

### 4.5 Resilient Multi-Stage JSON Sanitizer (Priority: P0 - Critical)

- The system MUST include a resilient schema adapter capable of parsing and repairing imperfect JSON structures generated by small open-weight language models.
- The sanitizer MUST handle and strip markdown code fences (```json ... ```), remove leading/trailing conversational text, fix missing closing brackets, and clean illegal trailing commas.
- If JSON recovery completely fails, the system MUST provide a graceful fallback card with raw text recovery and an instant 1-click retry button.

### 4.6 Curated Multi-Regional Presets (Priority: P0 - Critical)

- The system MUST provide at least three pre-loaded, realistic culinary presets accessible with a single click:
  1. **Bali Tropical Bistro**: Showcasing dishes like *Bebek Betutu*, *Sate Lilit Ikan*, *Sambal Matah*, and *Lawar*.
  2. **Warung Nusantara Autentik**: Showcasing dishes like *Rawon Daging Surabaya*, *Rendang Daging Sapi*, *Soto Betawi*, and *Gado-Gado*.
  3. **Specialty Coffee & Heritage Sweets**: Showcasing items like *Kopi Tubruk Robusta*, *Klepon Pandan Cake*, and *Pisang Goreng Madu Wijen*.
- Activating a preset MUST instantly populate the menu queue and allow full AI generation in under 10 seconds.

### 4.7 Multi-Language Translation (Priority: P1 - High)

- The system MUST support localized display of the generated **Cultural Narrative** and **Flavor Profile** in four primary tourism languages: English (default), Japanese, Simplified Mandarin, and French.
- Language switching MUST dynamically update the active menu cards without requiring a full re-run of the initial allergen extraction pipeline.

### 4.8 Side Hustle Margin Widget (Priority: P1 - High)

- The system MUST include an interactive financial calculator demonstrating the cost comparison between local Google Gemma 2 execution ($0 per token) and commercial cloud APIs (e.g., GPT-4o / Claude 3.5).
- The widget MUST calculate:
  - Estimated Tokens Consumed per Menu Audit.
  - Cloud API Cost Avoided ($).
  - Client Service Fee Charged ($25–$100 slider).
  - Realized Gross Margin Percentage (typically > 98%).
- The calculator MUST allow users to model their weekly or monthly side-hustle revenue based on the number of menus audited.

### 4.9 Multi-Format Commercial Export Studio (Priority: P1 - High)

- **Print-Ready Physical Menu Card**: The system MUST implement a dedicated `@media print` stylesheet that reformats digital dish cards into elegant, high-contrast, print-optimized physical table inserts or a two-column restaurant menu card.
- **POS / Web JSON Export**: The system MUST allow 1-click export of the clean, structured menu data as a `.json` file for integration into POS systems, tablets, or websites.
- **Live Digital QR Card Preview**: The system MUST provide an interactive preview showing how the menu appears on mobile screens when scanned by a dining patron.

---

## 5. User experience

### 5.1 Entry points & first-time user flow

- **Immediate Visual Impact**: The application opens to a dark/warm luxury culinary canvas featuring glowing amber and emerald accents, an active inference status pill in the header, and an inspiring tagline.
- **Zero-Barrier Start (The 10-Second Test)**: Prominently placed in the hero section are three Quick Preset buttons (*Bali Bistro*, *Warung Nusantara*, *Specialty Coffee*).
- **First-Time Flow**:
  1. The user clicks a Preset (or pastes custom text into the input drawer).
  2. The dish items appear in a clean "Input Queue" with detected dish names and ingredients.
  3. The user clicks **"Generate Cultural Menu & Allergen Audit"**.
  4. An animated progress bar with step indicators shows inference progress (`Connecting to Gemma 2` → `Analyzing Regional Heritage` → `Auditing Hidden Allergens` → `Rendering Cards`).
  5. The enriched menu cards appear below with sensory chips, badges, and export options.

### 5.2 Core experience

- **Step 1: Input & Configuration**: User selects preset or inputs dishes; selects local Gemma 2 model (`gemma2:2b` recommended) or activates Web Fallback.
- **Step 2: Dual-Mode Processing**: The `InferenceAdapter` sends structured prompts with few-shot culinary examples to the chosen engine.
- **Step 3: Sanitization & Parsing**: Output is filtered through the multi-stage JSON sanitizer to ensure safe object hydration.
- **Step 4: Interactive Review & Editing**: User inspects dishes, adjusts descriptions or toggles allergen warnings if extra kitchen context is known.
- **Step 5: Monetization & Export**: User reviews the **Side Hustle Margin** widget, verifies cost savings, and clicks "Print Physical Menu" or "Export POS JSON".

### 5.3 UI/UX highlights & Edge cases

- **Design Aesthetic**: Modern Glassmorphism combined with deep culinary slate (`#0F141C`), warm spice amber (`#F59E0B`), turmeric gold (`#FBBF24`), and pandan emerald (`#10B981`).
- **Responsive Layout**: Fluid single-page design reflowing seamlessly from desktop workstation (split-pane studio) to mobile screen (stacked inspection view).
- **Edge Cases & Graceful Degradation**:
  - *Ollama Not Installed / Not Running*: System displays a yellow warning banner with a 1-click button: "Switch to Web Fallback Demo (No Setup Needed)".
  - *CORS Restriction on Localhost*: System displays a modal with the exact environment variable to set (`OLLAMA_ORIGINS="*"`) and an instant fallback link.
  - *Severely Truncated Output*: If Gemma runs out of tokens, the system recovers valid parsed dishes and offers a "Retry Remaining Items" button.
  - *Missing Ingredients in Custom Input*: If the user inputs only dish names without ingredients, the AI prompts Gemma's culinary knowledge base to infer traditional regional recipes while adding an explicit "Verify with Kitchen" badge.

---

## 6. Narrative

Imagine Wayan, a passionate Balinese restaurant owner whose family has crafted authentic *Bebek Betutu* for three generations. When international foodies visit his warung, they open online translation apps that describe his signature slow-cooked ceremonial duck as "Dirty Roasted Bird with Chili Paste." Horrified by the unappealing description and terrified of hidden shrimp paste (*terasi*), travelers often walk away to eat generic burger chains. Meanwhile, Budi, an ambitious local freelancer equipped with RasaLore AI on his modest laptop, approaches Chef Wayan. In less than 10 minutes, Budi runs Wayan's menu through a locally running Google Gemma 2 model. Without sending a single secret family spice recipe to a corporate cloud server, RasaLore AI produces a breathtaking menu: the duck is celebrated as a "Richly spiced ceremonial duck slow-braised for 12 hours in traditional *bumbu genep* aromatic herbs," accompanied by vivid sensory tags and an unmistakable crustacean allergy warning. Budi prints out luxury QR table tent cards right then and there, pocketing a crisp $50 service fee with 99% profit margin, while Chef Wayan fills his tables with grateful, delighted international diners.

---

## 7. Success metrics

### 7.1 User-centric metrics

- **Time-to-Value (TTV)**: Under **10 seconds** from application load to full menu visualization when using curated presets.
- **Cultural Authenticity Perception**: > **90%** of culinary descriptions preferred over standard Google Translate in side-by-side tasting menu comparisons.
- **Allergen Detection Sensitivity**: **100% recall** of high-risk regional implicit allergens (*terasi*, *kemiri*, peanut paste, gluten) from standard ingredient lists.

### 7.2 Business metrics

- **Side Hustle Gross Margin**: > **95%** gross margin on client menu audit packages resulting from $0 variable inference cost.
- **Average Audit Completion Time**: Under **15 minutes** for a full 10-dish restaurant menu transformation from raw input to final print/export.
- **Data Privacy Guarantee**: **0 bytes** of customer recipe data or kitchen trade secrets transmitted over external networks during Local Mode execution.

### 7.3 Technical metrics

- **Application Initial Load Time**: < **250ms** first contentful paint (FCP) utilizing zero-dependency Vanilla Web Standards.
- **Local Inference Latency**: < **3.5 seconds** per dish using `gemma2:2b` on standard consumer hardware (Apple Silicon / modern quad-core x86 CPU).
- **Memory Footprint**: < **2.0 GB** active RAM required for the complete local inference pipeline.
- **JSON Sanitization Success Rate**: > **99.5%** successful parse recovery on malformed or markdown-wrapped language model responses.

---

## 8. Technical considerations (Input for Engineering Team)

### 8.1 Integration points

- **Ollama Local REST API**: Direct HTTP POST endpoint `http://localhost:11434/api/generate` utilizing stream or non-stream JSON payloads. Target models: `gemma2:2b` (default) and `gemma2:9b` (high precision).
- **Hugging Face Serverless Inference API**: Web fallback endpoint connecting to `google/gemma-2-2b-it` via serverless HTTP for instant zero-install judge demonstrations.
- **DevRelay Gateway**: Integration points to log agent sessions, embed session transcripts, and stage project metadata for Hacktoberfest submission tracking.

### 8.2 Data storage & privacy

- **Client-Side Local Storage**: All application states, custom user menus, selected languages, and operator settings persist in browser `localStorage`. No remote tracking or third-party cookies.
- **Air-Gapped Operation**: In Local Mode, the client makes zero outbound network calls, ensuring complete compliance with culinary confidentiality agreements.

### 8.3 Scalability & potential technical challenges

- **Browser CORS with Localhost**: Direct browser fetch requests to `http://localhost:11434` are subject to cross-origin resource sharing policies. The application must gracefully detect blocked fetches and clearly instruct users or offer the remote gateway.
- **Small Model JSON Formatting Flaws**: Gemma 2B may occasionally wrap outputs in backticks or emit comments. Engineering must enforce multi-stage sanitization prior to `JSON.parse()`.
- **System Resource Constraints**: The UI must prevent simultaneous concurrent inference calls that could choke low-spec laptops, implementing an internal FIFO batch queue for multi-dish menus.

---

## 9. Milestones & sequencing

### 9.1 Project estimate & Team composition

- **Estimated Duration**: 1 week (7 calendar days) for complete production build, testing, and submission.
- **Team Size**: 1 Senior Full-Stack Engineer / Product Developer (Antigravity AI Agent + Human Lead).

### 9.2 Suggested phases

- **Phase 1: Foundation & Dual-Mode Inference Engine (Days 1–2)**
  - Establish Vanilla CSS Design System and culinary luxury glassmorphic theme.
  - Implement `InferenceAdapter` supporting local Ollama (`gemma2:2b`) and remote fallback.
  - Build connection health diagnostic banner and CORS guidance modal.
- **Phase 2: Preset Library, Resilient Sanitizer & Card Renderer (Days 3–4)**
  - Implement the three multi-regional culinary presets (*Bali Bistro*, *Warung Nusantara*, *Specialty Coffee*).
  - Develop the multi-stage regex-powered JSON Sanitizer.
  - Build interactive glassmorphic dish cards with **Cultural Narratives**, **Flavor Profile** chips, and **Allergen Flag** badges.
- **Phase 3: Side Hustle Margin Widget & Multi-Format Export (Days 5–6)**
  - Build the interactive **Side Hustle Margin** financial calculator widget.
  - Implement multi-language selector (English, Japanese, Mandarin, French).
  - Develop `@media print` styles for physical menu cards and 1-click POS JSON export.
- **Phase 4: Verification, Polish, DevRelay Session & Submission (Day 7)**
  - End-to-end edge case testing across both Local and Fallback modes.
  - Record and curate DevRelay agent session transcript.
  - Finalize `template.md` with demo URLs, screenshots, and complete the Hacktoberfest Week 2 DEV post.

---

## 10. User stories & Acceptance Criteria

### 10.1. Curated Quick-Start Culinary Presets

- **ID**: `GH-001`
- **Story**: As a Hackathon Judge or first-time evaluator, I want to click pre-loaded authentic culinary presets, so that I can experience and evaluate the full application in under 10 seconds without typing manual menu data.
- **Acceptance criteria**:
  - [ ] The hero section features three distinct preset buttons: *Bali Tropical Bistro*, *Warung Nusantara Autentik*, and *Specialty Coffee & Heritage Sweets*.
  - [ ] Clicking any preset immediately loads at least 3 realistic regional dishes with traditional names and raw ingredient lists into the input queue.
  - [ ] Loading a preset automatically selects the recommended inference parameters and enables the "Generate Cultural Menu" action button.
  - [ ] Switching between presets clears previous uncommitted inputs without causing state corruption or memory leaks.

### 10.2. Dual-Mode Gemma 2 Inference Engine

- **ID**: `GH-002`
- **Story**: As a freelance consultant or evaluator, I want to seamlessly switch between local offline Ollama inference and an online web fallback, so that I can run zero-cost audits locally or demonstrate the app anywhere without local setup.
- **Acceptance criteria**:
  - [ ] The UI displays an active engine switcher with options for `Local Ollama (Gemma 2B / 9B)` and `Remote Web Fallback`.
  - [ ] When `Local Ollama` is selected, the application queries `http://localhost:11434/api/generate` with a connection timeout of 5 seconds.
  - [ ] If local Ollama is unreachable or blocked by browser CORS, a non-blocking alert appears with copy-paste setup commands and an immediate one-click fallback button.
  - [ ] In `Remote Web Fallback` mode, requests route through the serverless Hugging Face endpoint and return identical structured output.

### 10.3. Cultural Narrative & Nuance Generation

- **ID**: `GH-003`
- **Story**: As an international dining guest or restaurant owner, I want the system to generate culturally rich English descriptions of traditional dishes, so that the authentic heritage and culinary preparation are celebrated instead of ruined by literal translations.
- **Acceptance criteria**:
  - [ ] Prompt template instructs Google Gemma 2 to act as a World-Class Culinary Historian and Food Safety Specialist.
  - [ ] Model outputs a 1-to-2 sentence **Cultural Narrative** explaining culinary heritage, spice blends, and preparation methods.
  - [ ] Translations strictly avoid comical literal terms (e.g., "Rawon" is never translated as "Black Soup"; "Sate Lilit" is never translated as "Wrapped Meat Sticks").
  - [ ] Generation uses a controlled temperature of `0.3` to ensure culinary accuracy and prevent hallucinated ingredients.

### 10.4. Implicit Allergen Intelligence & Dietary Flagging

- **ID**: `GH-004`
- **Story**: As a diner with food allergies or dietary restrictions, I want implicit and explicit allergens highlighted clearly on every dish card, so that I can safely enjoy traditional cuisine without health risks.
- **Acceptance criteria**:
  - [ ] The engine scans both explicit ingredients and implicit culinary bases (e.g., detecting crustaceans in *sambal terasi*, tree nuts in *bumbu kemiri*, gluten in soy sauce).
  - [ ] Identified allergens are categorized with clear visual badges: Crustaceans, Tree Nuts, Peanuts, Gluten, Soy, Dairy, and Egg.
  - [ ] Dietary lifestyle tags (*Halal-Friendly*, *Vegetarian*, *Vegan*) are assigned based on ingredient verification.
  - [ ] If an ingredient profile is uncertain or incomplete, a yellow "Kitchen Verification Advised" warning flag is displayed.

### 10.5. Resilient Multi-Stage JSON Sanitization

- **ID**: `GH-005`
- **Story**: As an operator using small open-weight language models, I want the system to automatically repair imperfect or markdown-wrapped JSON responses, so that the application never crashes due to formatting anomalies.
- **Acceptance criteria**:
  - [ ] The sanitization module strips markdown fences (e.g., ```` ```json ```` and ```` ``` ````) and cleans leading/trailing conversational text.
  - [ ] The sanitizer fixes trailing commas before closing braces/brackets and automatically closes truncated objects if the output was cut off.
  - [ ] In the event of an unrecoverable JSON parse failure, the raw output is safely caught, an informative error message is displayed, and a "Retry Dish" action is provided.
  - [ ] Unit test suite validates parsing across at least 5 known edge-case LLM output strings with 100% pass rate.

### 10.6. Interactive Glassmorphic Dish Card Studio

- **ID**: `GH-006`
- **Story**: As a restaurant owner or consultant, I want to view my localized menu in an elegant, interactive glassmorphic card studio, so that I can inspect, verify, and showcase the aesthetic value to clients.
- **Acceptance criteria**:
  - [ ] Each dish card displays: Original Dish Name, **Cultural Narrative**, **Flavor Profile** sensory chips (3-5 items), and **Allergen Flags**.
  - [ ] Cards adhere to the luxury warm-culinary palette (dark slate background, glowing amber borders, emerald badges).
  - [ ] Hover and focus states feature smooth micro-animations without layout jank.
  - [ ] Cards allow inline editing of descriptions and allergen toggles for final operator adjustments.

### 10.7. Side Hustle Margin Calculator Widget

- **ID**: `GH-007`
- **Story**: As a freelance developer or agency operator, I want to calculate my cost savings and profit margins compared to closed cloud APIs, so that I can quantify the commercial viability of my local AI side hustle.
- **Acceptance criteria**:
  - [ ] The widget features an interactive slider or input for "Client Audit Fee" ($10 to $250, default $50).
  - [ ] The widget calculates and displays the avoided cloud API cost based on standard token pricing for competitive models.
  - [ ] The widget dynamically computes the **Side Hustle Margin** percentage (showing > 95% for local execution).
  - [ ] The widget displays a monthly projection based on audit volume (e.g., 5 menus/week = $1,000/month net profit).

### 10.8. Multi-Format Commercial Export (Print & POS JSON)

- **ID**: `GH-008`
- **Story**: As a side hustle consultant, I want to export the audited menu as a print-ready physical layout and as a structured JSON file, so that I can deliver tangible physical and digital assets to my restaurant clients.
- **Acceptance criteria**:
  - [ ] Clicking "Print Physical Menu" triggers browser print mode with specialized `@media print` CSS.
  - [ ] The print layout removes UI controls, sidebars, and dark backgrounds, rendering a clean, high-contrast, black-and-gold printable table menu card.
  - [ ] Clicking "Export POS JSON" downloads a validated `.json` file containing all dishes, descriptions, flavor profiles, and allergen classifications.
  - [ ] A "Mobile QR Card Preview" mode simulates the smartphone view for dining guests.
