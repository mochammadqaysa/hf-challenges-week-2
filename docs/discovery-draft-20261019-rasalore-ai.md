---
title: Project Discovery & Architecture Summary
status: DRAFT (Phase 0)
date_analyzed: 2026-10-19
---

# Project Discovery Summary: RasaLore AI

## 1. Project Overview

**RasaLore AI** is an open-source, local-first Cultural Menu Translation & Allergen Intelligence Studio designed specifically for independent restaurants, cafes, coffee shops, and culinary entrepreneurs.

### The Problem
Independent Food & Beverage (F&B) businesses in culturally rich culinary regions frequently encounter serious issues when attempting to cater to international tourists and diverse clientele:
1. **Loss of Culinary Nuance:** Generic translation tools (like Google Translate) perform literal translations that ruin the dish's appeal (e.g., translating "Rawon" as "Black Soup" or "Soto Betawi" as "Intestine Soup in Coconut Milk").
2. **Dangerous Allergen Gaps:** Generic machine translations fail to highlight implicit allergens (e.g., fermented shrimp paste/terasi, candlenut, or dairy hidden in traditional broths), exposing guests to severe health risks.
3. **Expensive Closed-API Lock-in:** Cloud LLM APIs charge per token and leak private kitchen recipes or business data across third-party servers.

### The Value Proposition ("Side Hustle" Core)
RasaLore AI enables a viable, high-margin side hustle where freelancers or tech-savvy agencies offer a comprehensive "Cultural Digital Menu & Allergen Audit Service" to local restaurants for $25–$100 per menu:
- Zero variable cost per customer: Runs 100% locally on **Google Gemma 2** open weights via Ollama on any standard laptop or POS workstation.
- Absolute data privacy: Kitchen recipes and proprietary ingredient mixes never leave the restaurant's local machine.
- Immediate commercial output: Generates appetizing cultural English narratives, flavor profile notes, comprehensive allergen flags, and print-ready digital QR menu cards.

## 2. Technology Stack & Infrastructure

*(Referenced and synchronized with `docs/ARCHITECTURE.md`)*

- **Core Framework/Language:** Modern Web Standards (HTML5, Vanilla CSS Design System, Modular JavaScript ES Modules).
- **Styling Architecture:** Custom Vanilla CSS design tokens with warm culinary tones, dark/light ambient modes, responsive flex/grid layouts, and glassmorphism.
- **AI Core & Engine:** **Google Gemma 2 (2B / 9B)** open-weight models executed locally via Ollama API (`http://localhost:11434/api/generate`).
- **Demo Fallback Engine:** Hugging Face Inference API / Web Gateway for judges and evaluators without local Ollama setups.
- **Output Schema Adapter:** Resilient Multi-Stage JSON Sanitizer to ensure predictable, structured rendering of menu cards, flavor badges, and allergen flags.

## 3. Current Architecture Assessment

From a Senior Staff Engineer perspective, the architectural foundations of RasaLore AI exhibit strong strategic advantages with targeted risk-mitigation measures:

### Strengths
- **Decoupled Dual-Mode Adapter:** The system isolates the UI from the underlying inference provider. The app communicates with a unified `InferenceAdapter` that transparently switches between local Ollama and remote web fallback without impacting UI components.
- **Zero-Dependency Lightweight Client:** By avoiding heavy frontend frameworks (Next.js/React overhead), the application loads instantly in under 200ms, making it ideal for low-spec POS tablets or offline laptop kiosks.
- **Targeted Open-Weight Model Utilization:** Relying on Gemma 2B provides the optimal balance between high-quality reasoning/cultural description generation and lightweight RAM usage (~1.6 GB VRAM/RAM required).

### Tech Debt & Identified Risks
- **Local LLM Non-Determinism:** Small language models (SLMs) can occasionally hallucinate markdown tags around JSON or truncate closing braces. *Mitigation:* A multi-stage JSON sanitizer with regex cleanup must be incorporated into the data pipeline.
- **CORS Constraints with Localhost:** Accessing `http://localhost:11434` from browser web applications can trigger CORS restrictions if Ollama is not configured with `OLLAMA_ORIGINS="*"`. *Mitigation:* Provide clear setup guidance in the UI and provide a seamless one-click toggle to the Web Demo Fallback.

## 4. Operational Workflow

### Workflow 1: Rapid Preset & Menu Input
1. **User Action:** The user selects a curated preset (e.g., *Bali Tropical Bistro*, *Warung Nusantara Autentik*, *Specialty Coffee & Pastry*) or pastes raw dish names and ingredients.
2. **System Processing:** The UI parses line breaks and organizes dishes into pending queue items.

### Workflow 2: Dual-Mode Gemma Extraction & Cultural Enrichment
1. **Adapter Trigger:** The `InferenceAdapter` constructs a prompt with strict system instructions instructing Gemma 2 to act as a World-Class Culinary Historian and Food Safety Auditor.
2. **Inference Execution:** The prompt is dispatched to Ollama locally (or the web fallback).
3. **Resilient Sanitization:** The raw string response is passed through the JSON Sanitizer, extracting `{ dish_name, cultural_narrative, flavor_profile, allergens, dietary_tags }`.
4. **Visual Rendering:** The UI dynamically renders interactive glassmorphic dish cards with allergen warning badges and flavor tags.

### Workflow 3: Multi-Language Switch & Side Hustle Export
1. **Language Switch:** The user toggles between English, Japanese, Mandarin, or French.
2. **Export Actions:** The user clicks "Export Print Card" (triggers styled `@media print` CSS for physical menu printing) or "Export JSON" (for point-of-sale integration).
3. **Margin Calculation:** The Side Hustle Margin Widget displays cost savings compared to cloud API subscription tiers.

## 5. Handoff Notes for Product Manager (/sdlc-draft-prd)

*Crucial context for the Product Manager before creating the PRD:*
1. **Hacktoberfest Week 2 Criteria Focus:** The PRD must emphasize the *Why Open Innovation Matters* narrative (Offline capability, zero API token costs, recipe privacy, and lack of cloud vendor lock-in).
2. **Partner Category Alignment:** Explicitly feature the "Best Use of Gemma" requirements, detailing prompt engineering and Gemma model parameters (`temperature: 0.3` for structured extraction).
3. **User Experience Priority:** Ensure the PRD specifies pre-loaded realistic menu presets so judges can test and experience full value within 10 seconds of opening the application.
4. **Traceability:** All domain terminology in the upcoming PRD must strictly adhere to the terms established in `CONTEXT.md` (`Cultural Narrative`, `Flavor Profile`, `Allergen Flag`, `Side Hustle Margin`, `Dual-Mode Inference`).
