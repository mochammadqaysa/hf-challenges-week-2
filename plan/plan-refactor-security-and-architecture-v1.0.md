---
goal: Remediate DOM XSS in Queue Progress, Harden Token Masking, and Optimize Card Narrative Re-Renders
version: 1.0.0
date_created: 2026-10-19
last_updated: 2026-10-19
owner: RasaLore AI Engineering Team
status: "Completed"
tags: ["refactor", "clean-code", "architecture", "security", "xss-remediation"]
---

# Introduction

![Status: Completed](https://img.shields.io/badge/status-Completed-brightgreen)

This refactoring plan addresses security vulnerabilities and architectural inefficiencies identified during the comprehensive **Phase 1 through Phase 4 Code Review & Security Audit** of RasaLore AI. The primary focus is eliminating a **Critical DOM-based Cross-Site Scripting (XSS)** vulnerability in the sequential FIFO queue progress bar (`src/app.js`), hardening ephemeral token display masking (`src/components/remote-fallback-drawer.js`), and replacing redundant full-grid DOM re-renders during multilingual localization with targeted, surgical element updates (`CardStudio.updateCardNarrative`).

## 1. Traceability: Requirements & Constraints

- **SEC-003**: Output encoding and DOM injection prevention. All user and LLM input rendered into the DOM must be strictly sanitized using HTML entity encoding.
- **SEC-002**: Ephemeral storage isolation. Credentials and token displays must remain completely isolated without leakage or injection surfaces.
- **PRN-001**: Single Responsibility and Surgical DOM Updates. Avoid destroying and rebuilding the entire cards grid when updating single-card narrative text.
- **CON-001**: Zero-Bundler conformance. Fixes must maintain modern native ES modules without introducing external runtime packages or build steps.

## 2. Implementation Steps

> **⚠️ EXECUTION DIRECTIVE FOR AI AGENTS (`/sdlc-write-code`):**
> You MUST execute this plan phase by phase. You MUST run the specific testing/verification task at the end of each phase. After a phase is tested, you **MUST STOP AND WAIT** for the user's explicit approval before proceeding to the next phase. **DO NOT SKIP PHASES.**

### Implementation Phase 1: Security Remediation & Injection Hardening

- **GOAL-001**: Patch the critical DOM XSS vulnerability in `src/app.js` and harden status indicator string interpolation in `src/components/remote-fallback-drawer.js` and `src/components/card-studio.js`.

| Task ID  | Description (Include Exact File Paths & Micro-Testing) | Ref ID | Completed | Date |
| -------- | ------------------------------------------------------ | ------ | :-------: | :--: |
| TASK-101 | In `src/app.js`, import `escapeHtml` from `./components/card-studio.js` and sanitize `dishName` in `handleQueueProgressEvent` (lines 226, 239-250) prior to interpolating into `this.elements.queueProgressText.innerHTML`. | SEC-003 | [x] | 2026-10-19 |
| TASK-102 | In `src/components/remote-fallback-drawer.js` (`updateStatusDisplay`, lines 260-269), safely set `this.statusValEl` content using `textContent` for the dynamic masked token string or escape with `escapeHtml` to prevent markup injection. | SEC-002, SEC-003 | [x] | 2026-10-19 |
| TASK-103 | In `src/components/card-studio.js` (line 246), defensively sanitize `dish.tokensConsumed.totalTokens` via `escapeHtml(String(...))` or `Number(...)` before interpolation into the card footer template. | SEC-003 | [x] | 2026-10-19 |
| TASK-104 | In `tests/export.test.js` or new test case in `tests/sanitizer.test.js`, add automated unit assertions verifying that malicious dish names containing `<script>` and `<img>` payloads are properly escaped in queue progress events and card studio renders. | SEC-003 | [x] | 2026-10-19 |
| TASK-105 | **VERIFY**: Execute `npm test` to confirm 100% test pass with the new security assertions included. | - | [x] | 2026-10-19 |
| TASK-106 | **APPROVAL**: 🛑 Wait for explicit user confirmation to proceed to Phase 2. | - | [x] | 2026-10-19 |

### Implementation Phase 2: Architectural Optimization & Surgical Re-renders

- **GOAL-002**: Eliminate redundant full-grid DOM re-renders in `setLanguage()` by leveraging surgical narrative element updates.

| Task ID  | Description (Include Exact File Paths & Micro-Testing) | Ref ID | Completed | Date |
| -------- | ------------------------------------------------------ | ------ | :-------: | :--: |
| TASK-201 | In `src/app.js` (`setLanguage`, lines 434-483), replace repeated full calls to `this.render()` inside the per-dish translation loop with surgical calls to `CardStudio.updateCardNarrative(cardElement, dish, lang)`. | PRN-001 | [x] | 2026-10-19 |
| TASK-202 | In `src/app.js` (`RasaLoreStudioApp`), extract literal configuration strings (`'rasalore_hf_token'`, `'bali-bistro'`) into top-level constants. | PRN-001 | [x] | 2026-10-19 |
| TASK-203 | **VERIFY**: Execute `npm test` and verify smooth language switching in browser studio with zero DOM flickering or UI latency regressions. | - | [x] | 2026-10-19 |
| TASK-204 | **APPROVAL**: 🛑 Wait for explicit user confirmation to finalize refactoring. | - | [x] | 2026-10-19 |

## 3. Structural Remedies & Alternatives

- **ALT-001: Replacing `innerHTML` with `document.createElement` everywhere (Evaluated)**:
  - *Trade-off*: Rebuilding all card layouts with pure DOM node creation would add ~500 lines of verbose imperative code without significant safety improvements over standard, well-tested `escapeHtml()` escaping.
  - *Remedy Chosen*: Retain `CardStudio` template strings with universal `escapeHtml()` application, and rigorously enforce that all dynamic strings entering any `innerHTML` assignment (including `src/app.js`) pass through `escapeHtml()`.

## 4. Dependencies

- **Zero new external dependencies introduced (CON-001)**: All sanitization and surgical updates use native browser APIs and internal utility functions (`escapeHtml`, `textContent`).

## 5. Files Affected

- **`src/app.js`**: Import `escapeHtml`, sanitize queue progress text interpolation, and optimize `setLanguage` re-rendering.
- **`src/components/remote-fallback-drawer.js`**: Harden status badge token masking against HTML injection.
- **`src/components/card-studio.js`**: Defensively sanitize tokens consumed count in card footer.
- **`tests/sanitizer.test.js`**: Add XSS payload defense verification tests.

## 6. Testing Strategy

- **TEST-001 (XSS Boundary Test)**: Assert that input strings `<img src=x onerror=alert(1)>` and `<script>console.log('pwned')</script>` pass through `escapeHtml` and render as harmless text nodes without triggering execution.
- **TEST-002 (Regression Test)**: Run full test suite `node --test tests/*.test.js` to ensure zero regressions across JSON parsing, sequential FIFO queueing, margin calculations, and POS export contracts.

## 7. Risks & Rollback Plan

- **RISK-001**: Double-escaping characters in existing sanitized fields.
  - *Mitigation*: Ensure `escapeHtml()` is only called once at the rendering boundary, never pre-escaped into the underlying `DishCardModel` state.
- **Rollback Strategy**: Revert changes via git or backup if any card styling breaks.
