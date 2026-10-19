*This is a submission for the [Hacktoberfest Open-Source AI Challenge Week 2: Side Hustle](https://dev.to/challenges/hacktoberfest-week2-2026-10-12)*

# 🌿 RasaLore AI — Cultural Culinary Heritage Menu & Allergen Intelligence Studio

![RasaLore AI Banner](https://img.shields.io/badge/Open%20Source%20AI-Google%20Gemma%202-blue?style=for-the-badge&logo=google)
![Side Hustle Economics](https://img.shields.io/badge/Gross%20Margin-99.8%25-success?style=for-the-badge)
![Automated Test Suite](https://img.shields.io/badge/Test%20Suite-33%2F33%20Passed-brightgreen?style=for-the-badge)
![Zero Bundler](https://img.shields.io/badge/Zero--Bundler-Native%20ES%20Modules-emerald?style=for-the-badge)

---

## What I Built

### The Real-World Problem
Every year, millions of international travelers visit Southeast Asia seeking authentic culinary experiences. Yet, local food & beverage (F&B) owners—boutique cafes, traditional *warungs*, and heritage family bistros—face two critical roadblocks when presenting their menus to foreign diners:

1. **The Tragic Loss of Cultural Nuance:** Generic machine translation tools (Google Translate, DeepL) strip the soul out of traditional food. Translating Bali's ceremonial *"Bebek Betutu"* into *"Duck with Spices"* or East Java's century-old *"Rawon"* into *"Black Beef Soup"* turns rich gastronomic heritage into flat, uninspired cafeteria listings.
2. **The Deadly Hidden Allergen Blindspot:** In traditional Indonesian and Southeast Asian cooking, dangerous allergens lurk inside complex base pastes (*bumbu*, *sambal terasi* fermented shrimp paste containing **Crustaceans**, *petis* containing shellfish, or *emping* crackers containing **Tree Nuts/Melinjo**). A tourist asking *"Does this soup contain shellfish?"* will be met with a blank stare from waitstaff who only know the soup as beef broth—leading to severe, life-threatening anaphylactic reactions.
3. **The Small Business Tech Barrier:** Local restaurateurs cannot afford $10,000 custom agency retainers or pay variable monthly cloud API subscription fees to translate dynamic seasonal menus. Furthermore, master chefs refuse to upload their proprietary recipes and spice ratios to cloud servers where their intellectual property could be logged.

### The Solution: RasaLore AI
**RasaLore AI** is an open-source, local-first **Cultural Menu & Allergen Intelligence Studio**. It acts as an **AI Culinary Consultant in a Box**—a profitable, turnkey *Side Hustle* that any developer or freelance consultant can run from a laptop.

With RasaLore AI, a consultant can walk into a local bistro, take their raw dish names or kitchen recipe notes, and instantly generate:
- **Heritage Storytelling:** Culturally nuanced culinary narratives across 4 languages (**English, Japanese, Chinese, and French**).
- **Sensory Flavor Profiles:** Visual spice gauges (Fiery, Hot, Medium, Mild, Non-Spicy), primary taste classifications (*Deep & Savory*, *Sweet & Fragrant*), and sensory descriptor chips.
- **Deep Allergen Intelligence:** Automated identification of implicit/hidden allergens with distinct severity badges (`CRITICAL_WARNING` vs. `DIETARY_NOTICE`) and precise source ingredient traceability (e.g., *"Crustaceans detected within implicit Sambal Terasi"*).
- **Kitchen Verification Alerts:** Proactive flags when recipe notes are too sparse, directing waitstaff to double-check with the head chef.
- **Commercial Table Insert Printouts:** High-contrast, black-and-gold dual-column A4 printouts styled specifically for restaurant tables using `@media print` (AC-011).
- **POS-Ready JSON Export:** Structured, schema-validated `DishCardModel[]` payloads that plug directly into restaurant Point-of-Sale (POS) and digital kiosk systems.
- **Built-in Side Hustle Margin Calculator:** An interactive financial widget proving the economics of the business model in real time.

---

## Demo

- **Live Repository:** [github.com/mochammadqaysa/hf-challenges-week-2](https://github.com/mochammadqaysa/hf-challenges-week-2)
- **Local Interactive Studio:** The studio runs locally on `http://localhost:3000` with 0 build steps using native Modern ES Modules.

### Key Studio Walkthrough:
1. **Curated Heritage Presets:** Instant, zero-latency (0ms) preview of authentic regional menus:
   - *Bali Bistro* (Bebek Betutu, Sate Lilit Ikan, Lawar Bali, Pisang Rai)
   - *Warung Nusantara* (Rendang Daging Sapi, Rawon Surabaya, Gado-Gado Batavia, Es Cendol Nangka)
   - *Kopitiam Heritage* (Kaya Toast Butter, Laksa Medan, Nasi Lemak Bungkus, Kopi Tubruk Robusta)
2. **Real-Time Multilingual Switcher:** Click between **English (EN)**, **Japanese (JA)**, **Chinese (ZH)**, and **French (FR)** to watch the narrative seamlessly adapt while preserving allergen flags completely untouched.
3. **Custom Dish Enrichment:** Submit your own local specialty (e.g., *"Soto Ayam Madura"*) and watch the sequential FIFO progress bar analyze the recipe with Google Gemma 2 in real-time.
4. **Physical Table Insert:** Click **"🖨️ Print Physical Menu"** to preview a commercial-grade A4 black-and-gold table insert ready for restaurant laminating.
5. **Point-of-Sale Export:** Click **"💾 Export POS JSON"** to download a verified POS-compatible JSON file.
6. **Side Hustle Commercial Margin Calculator:** Adjust the consulting fee slider ($25 - $100) and menus per week to see real-time avoided cloud costs, profit margins, and monthly projections.

---

## Code

The complete source code is open source and hosted on GitHub:

{% github mochammadqaysa/hf-challenges-week-2 %}

### Repository Highlights:
- **`src/app.js`**: Studio Application Controller with sequential queue integration and surgical DOM updates.
- **`src/prompts/gemma-prompts.js`**: Structured JSON prompt templates tailored specifically for Google Gemma 2 open-weight models.
- **`src/parsers/json-sanitizer.js`**: Multi-stage resilient JSON recovery pipeline that strips markdown fences, trims conversational banter, and auto-closes truncated bracket stacks.
- **`src/queue/fifo-queue.js`**: Sequential FIFO Queue (`concurrency = 1`) with per-dish failure isolation (`FAILED_ANOMALY`).
- **`src/components/margin-widget.js`**: Side Hustle financial calculator and avoided cost algorithm.
- **`src/styles/print.css`**: Commercial print stylesheet conforming to A4 portrait dual-column layout.
- **`tests/`**: Comprehensive automated test suite with **33 passing tests** across 5 suites (`tests/sanitizer.test.js`, `tests/queue.test.js`, `tests/margin.test.js`, `tests/export.test.js`).

---

## How I Built It

### The Open-Source AI Engine: Google Gemma 2
At the heart of RasaLore AI is **Google Gemma 2 (`gemma2:2b` / `gemma2:9b`)**, running locally and completely offline via [Ollama](https://ollama.com/) on standard consumer hardware.

Gemma 2 was chosen for three definitive reasons:
1. **Exceptional Multilingual Understanding in Small Parameter Sizes:** Despite running at just 2 billion parameters, Gemma 2 exhibits remarkable sensitivity to Southeast Asian cultural idioms, food ingredients, and regional dialects that other lightweight models often mangle.
2. **Air-Gapped Local Inference (`localhost:11434`):** With Ollama, Gemma 2 runs entirely in memory without requiring an internet connection. Private restaurant recipes and secret spice blends never leave the owner's laptop.
3. **Zero Marginal Token Cost:** Running locally means the marginal cost of enriching 1,000 menu items is exactly **$0.00**, transforming what would be an expensive recurring cloud expense into pure consulting profit.

### Headless Architecture Seams & Dual-Mode Inference
To support both local offline execution and remote hackathon evaluation, RasaLore AI implements a clean **Inference Adapter Seam**:
- **Primary Mode (`LOCAL_OLLAMA`):** Directly queries `http://localhost:11434/api/generate` with zero data egress.
- **Remote Fallback Mode (`REMOTE_FALLBACK`):** For hackathon judges or remote testing without local Ollama, the studio features an ephemeral settings drawer powered by the Hugging Face Serverless Inference API (`google/gemma-2-2b-it`). User tokens are stored strictly in `sessionStorage` (never saved to `localStorage` or transmitted anywhere else), upholding strict zero-leakage security principles (`SEC-002`).

### Architectural Pillars of the Build:
- **Resilient Multi-Stage JSON Sanitizer (`src/parsers/json-sanitizer.js`):** Lightweight LLMs running in constrained hardware occasionally produce conversational banter, wrap outputs in markdown fences (` ```json `), or truncate unclosed brackets. Our custom multi-stage sanitizer automatically strips preambles, cleans illegal trailing commas, and reconstructs truncated bracket stacks before validating against the strict `DishCardModel` schema.
- **Sequential FIFO Queue & Failure Isolation (`src/queue/fifo-queue.js`):** Processing multiple dishes in parallel will instantly thrash CPU/RAM on an 8GB laptop. RasaLore AI enforces strict sequential execution (`concurrency = 1`). If a single dish fails or encounters malformed output, it is isolated into a `FAILED_ANOMALY` state with an interactive "Retry Dish" button, allowing the rest of the queue to complete uninterrupted.
- **Surgical DOM Updates:** Rather than re-rendering the entire card grid during language changes (which causes flickering and destroys state), `CardStudio.updateCardNarrative()` surgically targets only the narrative DOM element, keeping allergen badges, flavor chips, and sibling cards rock-solid.
- **Zero-Bundler Conformance (`CON-001`):** The entire application is built using modern native ES Modules (`<script type="module">`) and Vanilla CSS. It requires zero compilation, zero bundling, and has zero runtime `node_modules` dependencies.

---

## Why Does Open Innovation Matter?

Open innovation is not just a philosophical preference for RasaLore AI—**it is the fundamental reason this side hustle can exist as a profitable business.**

### 1. The Economics of the $0.00 Marginal Cost
If this side hustle relied on closed proprietary APIs (like OpenAI GPT-4o or Anthropic Claude 3.5 Sonnet), every dish enrichment would incur token charges, network latency, and billing overhead. 
- Auditing a 20-dish menu with multilingual translations across 4 languages requires approximately 30,000 to 50,000 prompt and completion tokens per restaurant.
- Closed APIs create unpredictable recurring costs and vulnerability to price changes or sudden deprecations.
- By utilizing open-weight **Google Gemma 2**, inference costs drop to **$0.00**. As our built-in Margin Widget demonstrates, an operator charging **$50 per menu** and servicing 5 restaurants a week earns **$1,082.50 per month at 99.8%+ gross profit margins**. Open-source AI transforms a thin-margin software subscription into a high-margin service business.

### 2. Radical Recipe Privacy & Air-Gapped Trust
Traditional restaurant owners are intensely protective of their trade secrets. When approaching a legacy family restaurant in Bali or Penang, asking them to upload their handwritten grandmother's recipe into an unknown corporate cloud server is an immediate non-starter.
Open innovation allows us to say to the restaurant owner:
> *"We unplug the Wi-Fi cable before we run the tool. Your secret ingredients never leave this laptop, are never used to train someone else's model, and are never saved to any corporate server."*

This air-gapped privacy guarantee is completely impossible with closed commercial APIs, and it is the single most compelling sales argument when closing local clients.

### 3. Independence from Vendor Lock-In & Arbitrary Restrictions
Closed AI platforms can arbitrarily change terms of service, ban accounts, experience outages, or impose rate limits during critical service hours. Open-weight models belong to the community. Once downloaded, Gemma 2 will run forever on our hardware, immune to server outages, internet disconnects, or third-party corporate decisions.

---

## My First User

To test the viability of this side hustle in the real world, I brought RasaLore AI to its first test user: **Ibu Wayan**, owner of a boutique coastal warung in Sanur, Bali.

### Who She Is
Ibu Wayan runs a traditional warung serving authentic Balinese recipes passed down from her family. With the influx of Australian, European, and East Asian tourists, her paper menu was causing constant friction. Her handwritten English translations were confusing (her award-winning *Bebek Betutu* was simply labeled *"Duck Chicken Flavor"*), and her waitstaff struggled to explain what was in the food.

### The Problem She Faced
A week prior, an Australian customer with a severe crustacean allergy had a scary allergic reaction after ordering vegetable soup that contained an implicit dollop of fermented shrimp paste (*terasi*). Ibu Wayan was terrified of repeat incidents but couldn't afford the $1,500 quote from a local branding agency to rewrite and reprint her menus.

### The Engagement & Feedback
I ran Ibu Wayan's 8 core dishes through RasaLore AI right at her dining table:
1. **The Nuance:** When she read the English and French narratives generated for *Bebek Betutu*—describing it as *"a sacred Balinese ceremonial feast slow-roasted in banana leaves with rich wangen spice paste"*—she was overjoyed: *"Yes! That is exactly what my grandmother taught me!"*
2. **The Allergen Catch:** RasaLore AI immediately flagged her *Sambal Matah* and *Sayur Urap* with **CRITICAL: Crustaceans (Source: Terasi)** and flagged her peanut sauce with **CRITICAL: Peanuts**.
3. **The Deliverable:** Within 15 minutes, we generated a clean black-and-gold A4 table insert using the studio's print engine, printed two copies at the local print shop for $2, and slipped them onto her front tables.

### Did She Pay?
**Yes!** Ibu Wayan paid **Rp 500,000 (~$32 USD)** in cash on the spot for the 8-dish audit and laminated table inserts. 
When asked what she would want next, she asked: *"Can you put a QR code on the table that opens this in Japanese for my tourists from Tokyo?"* (which is now fully supported through our responsive web view!).

---

## Prize Categories

I am officially entering RasaLore AI into the following categories for **Hacktoberfest Week 2: Side Hustle**:

### 🌟 Featured Category: Best Use of Gemma
RasaLore AI is built from the ground up around **Google Gemma 2 (`gemma2:2b` and `gemma2:9b`)**:
- Engineered structured JSON prompt templates specifically optimized for Gemma 2 instruction formatting (`src/prompts/gemma-prompts.js`).
- Deep cultural translation and allergen classification executed entirely through Gemma 2's open weights running locally on Ollama and remotely on Hugging Face Serverless.
- Complete resilience engineering (bracket auto-closers, code fence strippers) designed specifically to handle edge-case generation quirks in lightweight open-weight models.

### 🏆 Overall Winner
RasaLore AI delivers on every dimension of the Week 2 "Side Hustle" prompt:
- Solves a genuine, high-stakes problem for real small businesses.
- Open-source AI is the irreplaceable engine that makes the unit economics work (99.8%+ profit margin).
- Proven in the real world with a paying first customer.
- Impeccable technical execution: 33 automated unit/integration tests with 100% pass rate, zero runtime dependencies, surgical DOM rendering, and production-ready print/POS exports.

---

*Thank you to DEV, Hacktoberfest, and the open-source community for empowering developers to build real-world, sustainable businesses with open innovation!*