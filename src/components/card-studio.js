/**
 * RasaLore AI - Glassmorphic Dish Card Studio Component
 * Renders luxury culinary cards, allergen alerts, sensory chips, and multilingual narratives.
 */

/**
 * Escapes HTML characters to prevent XSS (SEC-003).
 * @param {string} str
 * @returns {string}
 */
export function escapeHtml(str) {
  if (typeof str !== 'string') return '';
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

/**
 * Maps spice level to visual pepper indicators.
 * @param {string} level
 * @returns {string}
 */
function getSpiceBadge(level) {
  switch (level) {
    case 'Fiery':
      return '🌶️🌶️🌶️ Fiery';
    case 'Hot':
      return '🌶️🌶️ Hot';
    case 'Medium':
      return '🌶️ Medium';
    case 'Mild':
      return '🌱 Mild';
    case 'None':
    default:
      return '🍃 Non-Spicy';
  }
}

export class CardStudio {
  /**
   * Renders a single DishCardModel into an HTMLElement.
   * @param {object} dish - DishCardModel
   * @param {'en'|'ja'|'zh'|'fr'} [activeLanguage='en']
   * @param {Function} [onRetry] - Callback when retry button is clicked
   * @param {Function} [onLocalize] - Callback when narrative needs on-demand translation
   * @returns {HTMLElement}
   */
  static createCardElement(dish, activeLanguage = 'en', onRetry = null, onLocalize = null) {
    const card = document.createElement('article');
    card.className = `dish-card ${dish.status === 'FAILED_ANOMALY' ? 'dish-card--anomaly' : ''}`;
    card.setAttribute('data-dish-id', dish.id);
    card.setAttribute('data-status', dish.status);

    if (dish.status === 'FAILED_ANOMALY') {
      card.innerHTML = `
        <div class="dish-card__header">
          <div class="dish-card__identity">
            <span class="badge badge--danger">ANOMALY DETECTED</span>
            <h3 class="dish-card__title">${escapeHtml(dish.originalName)}</h3>
            <p class="dish-card__origin">${escapeHtml(dish.regionalOrigin || 'Regional Heritage')}</p>
          </div>
          <div class="dish-card__price">${escapeHtml(dish.priceText || '')}</div>
        </div>

        <div class="dish-card__anomaly-box">
          <div class="anomaly-header">
            <span class="anomaly-icon">⚠️</span>
            <strong>Inference Parsing Exception</strong>
          </div>
          <p class="anomaly-message">${escapeHtml(dish.errorMessage || 'Model generation truncated or returned malformed JSON.')}</p>
          ${dish.rawResponseText ? `
            <details class="anomaly-raw-toggle">
              <summary>Inspect Captured Raw Output</summary>
              <pre class="anomaly-raw-text"><code>${escapeHtml(dish.rawResponseText)}</code></pre>
            </details>
          ` : ''}
          <div class="anomaly-actions">
            <button type="button" class="btn btn--retry" data-retry-dish-id="${escapeHtml(dish.id)}">
              <span class="btn__icon">🔄</span> Retry Dish
            </button>
          </div>
        </div>
      `;

      if (onRetry) {
        const retryBtn = card.querySelector('[data-retry-dish-id]');
        if (retryBtn) {
          retryBtn.addEventListener('click', () => onRetry(dish.id));
        }
      }

      return card;
    }

    // Normal Enriched Dish Card
    const isPreTranslated = Boolean(dish.culturalNarrative && dish.culturalNarrative[activeLanguage]);
    const narrativeText = isPreTranslated
      ? dish.culturalNarrative[activeLanguage]
      : (dish.culturalNarrative?.en || 'Traditional culinary preparation.');

    const languageLabels = {
      en: '🇺🇸 English Narrative',
      ja: '🇯🇵 日本語ストーリー',
      zh: '🇨🇳 中文文化故事',
      fr: '🇫🇷 Récit Culinaire Français'
    };

    const descriptors = dish.flavorProfile?.descriptors || [];
    const allergenFlags = dish.allergenFlags || [];
    const dietaryTags = dish.dietaryTags || [];

    card.innerHTML = `
      <header class="dish-card__header">
        <div class="dish-card__identity">
          <div class="dish-card__tags-top">
            <span class="badge badge--origin">
              <span class="badge__icon">📍</span> ${escapeHtml(dish.regionalOrigin || 'Indonesia')}
            </span>
            <span class="badge badge--success">
              <span class="badge__icon">✓</span> Gemma 2 Enriched
            </span>
          </div>
          <h3 class="dish-card__title">${escapeHtml(dish.originalName)}</h3>
        </div>
        ${dish.priceText ? `<div class="dish-card__price">${escapeHtml(dish.priceText)}</div>` : ''}
      </header>

      ${dish.requiresKitchenVerification ? `
        <div class="dish-card__kitchen-alert">
          <span class="alert-icon">⚠️</span>
          <div class="alert-content">
            <strong>Kitchen Verification Advised</strong>
            <p>Recipe notes are sparse. Verify traditional implicit bases with the head chef.</p>
          </div>
        </div>
      ` : ''}

      <!-- Cultural Narrative Section (Preserves allergens untouched on localization) -->
      <section class="dish-card__narrative-section">
        <div class="narrative-meta">
          <span class="narrative-label">${languageLabels[activeLanguage] || 'Cultural Narrative'}</span>
          <span class="narrative-tag">Heritage Story</span>
        </div>
        ${dish.isTranslatingNarrative ? `
          <p class="dish-card__narrative-text narrative-translating">
            <span>⚡</span> Translating with Google Gemma 2 (${(activeLanguage || 'EN').toUpperCase()})...
          </p>
        ` : `
          <p class="dish-card__narrative-text">"${escapeHtml(narrativeText)}"</p>
        `}
        ${(!isPreTranslated && activeLanguage !== 'en') ? `
          <div class="narrative-advisory-badge" title="Live localization notice">
            <span>ℹ️</span> ${escapeHtml(dish.translationNotice || 'Live translation requires Ollama or HF_TOKEN (Canonical English displayed)')}
          </div>
        ` : ''}
      </section>

      <!-- Flavor Profile Section -->
      <section class="dish-card__flavor-section">
        <div class="section-title-wrap">
          <h4 class="section-subtitle">SENSORY FLAVOR PROFILE</h4>
          <span class="spice-chip ${dish.flavorProfile?.spiceLevel ? 'spice-chip--' + dish.flavorProfile.spiceLevel.toLowerCase() : ''}">
            ${getSpiceBadge(dish.flavorProfile?.spiceLevel)}
          </span>
        </div>
        <div class="flavor-taste-row">
          <span class="primary-taste-label">Primary Taste:</span>
          <span class="primary-taste-value">${escapeHtml(dish.flavorProfile?.primaryTaste || 'Deep & Savory')}</span>
        </div>
        <div class="flavor-chips-grid">
          ${descriptors.map(d => `<span class="chip chip--sensory">${escapeHtml(d)}</span>`).join('')}
        </div>
      </section>

      <!-- Allergen Intelligence Section -->
      <section class="dish-card__allergen-section">
        <div class="section-title-wrap">
          <h4 class="section-subtitle">ALLERGEN & DIETARY INTELLIGENCE</h4>
          ${allergenFlags.length === 0 ? `
            <span class="badge badge--neutral">No Common Allergens Flagged</span>
          ` : `
            <span class="badge badge--warning-pill">${allergenFlags.length} Flag${allergenFlags.length > 1 ? 's' : ''} Detected</span>
          `}
        </div>

        ${allergenFlags.length > 0 ? `
          <div class="allergen-alerts-list">
            ${allergenFlags.map(flag => `
              <div class="allergen-item allergen-item--${flag.severity === 'CRITICAL_WARNING' ? 'critical' : 'notice'}">
                <div class="allergen-item__header">
                  <span class="allergen-name">
                    ${flag.severity === 'CRITICAL_WARNING' ? '🚨' : 'ℹ️'} ${escapeHtml(flag.allergen)}
                  </span>
                  <div class="allergen-badges">
                    ${flag.isImplicit ? `
                      <span class="badge badge--implicit" title="Hidden within traditional bases or spice pastes">
                        HIDDEN / IMPLICIT
                      </span>
                    ` : ''}
                    <span class="badge badge--severity-${flag.severity.toLowerCase().replace('_', '-')}">
                      ${flag.severity === 'CRITICAL_WARNING' ? 'Critical Warning' : 'Dietary Notice'}
                    </span>
                  </div>
                </div>
                <p class="allergen-item__advisory">${escapeHtml(flag.advisoryNote)}</p>
                <div class="allergen-item__source">
                  <span class="source-label">Source Ingredient:</span>
                  <code class="source-value">${escapeHtml(flag.sourceIngredient)}</code>
                </div>
              </div>
            `).join('')}
          </div>
        ` : ''}

        <!-- Dietary Compliance Badges -->
        ${dietaryTags.length > 0 ? `
          <div class="dietary-tags-row">
            ${dietaryTags.map(tag => `<span class="badge badge--dietary">🌱 ${escapeHtml(tag)}</span>`).join('')}
          </div>
        ` : ''}
      </section>

      <!-- Raw Kitchen Ingredients Collapsible -->
      ${dish.rawIngredients ? `
        <details class="dish-card__ingredients-drawer">
          <summary class="ingredients-summary">
            <span>Kitchen Ingredients Formulation</span>
            <span class="toggle-icon">▾</span>
          </summary>
          <div class="ingredients-body">
            <p>${escapeHtml(dish.rawIngredients)}</p>
          </div>
        </details>
      ` : ''}

      <!-- Card Footer Privacy & Token Meta -->
      <footer class="dish-card__footer">
        <span class="footer-privacy-pill" title="0 bytes transmitted to cloud servers">
          🛡️ Air-Gapped Private
        </span>
        ${dish.tokensConsumed ? `
          <span class="footer-tokens-pill">
            ⚡ ${escapeHtml(String(dish.tokensConsumed.totalTokens ?? '0'))} tokens
          </span>
        ` : ''}
      </footer>
    `;

    return card;
  }

  /**
   * Surgically updates only the narrative section of an existing card without touching allergen flags.
   * @param {HTMLElement} card
   * @param {object} dish
   * @param {'en'|'ja'|'zh'|'fr'} [activeLanguage='en']
   */
  static updateCardNarrative(card, dish, activeLanguage = 'en') {
    if (!card || dish.status === 'FAILED_ANOMALY') return;
    const narrativeSection = card.querySelector('.dish-card__narrative-section');
    if (!narrativeSection) return;

    const languageLabels = {
      en: '🇺🇸 English Narrative',
      ja: '🇯🇵 日本語ストーリー',
      zh: '🇨🇳 中文文化故事',
      fr: '🇫🇷 Récit Culinaire Français'
    };

    const isPreTranslated = Boolean(dish.culturalNarrative && dish.culturalNarrative[activeLanguage]);
    const narrativeText = isPreTranslated
      ? dish.culturalNarrative[activeLanguage]
      : (dish.culturalNarrative?.en || 'Traditional culinary preparation.');

    narrativeSection.innerHTML = `
      <div class="narrative-meta">
        <span class="narrative-label">${languageLabels[activeLanguage] || 'Cultural Narrative'}</span>
        <span class="narrative-tag">Heritage Story</span>
      </div>
      ${dish.isTranslatingNarrative ? `
        <p class="dish-card__narrative-text narrative-translating">
          <span>⚡</span> Translating with Google Gemma 2 (${(activeLanguage || 'EN').toUpperCase()})...
        </p>
      ` : `
        <p class="dish-card__narrative-text">"${escapeHtml(narrativeText)}"</p>
      `}
      ${(!isPreTranslated && activeLanguage !== 'en') ? `
        <div class="narrative-advisory-badge" title="Live localization notice">
          <span>ℹ️</span> ${escapeHtml(dish.translationNotice || 'Live translation requires Ollama or HF_TOKEN (Canonical English displayed)')}
        </div>
      ` : ''}
    `;
  }

  /**
   * Renders an array of dish cards into a container element.
   * @param {HTMLElement} container
   * @param {Array<object>} dishes
   * @param {'en'|'ja'|'zh'|'fr'} [activeLanguage='en']
   * @param {Function} [onRetry]
   * @param {Function} [onLocalize]
   */
  static renderCardsGrid(container, dishes, activeLanguage = 'en', onRetry = null, onLocalize = null) {
    if (!container) return;
    container.innerHTML = '';

    if (!dishes || dishes.length === 0) {
      container.innerHTML = `
        <div class="empty-studio-state">
          <div class="empty-icon">🍽️</div>
          <h3>No Menu Items in Studio</h3>
          <p>Select a curated preset above or enter dishes to begin AI cultural enrichment.</p>
        </div>
      `;
      return;
    }

    const fragment = document.createDocumentFragment();
    for (const dish of dishes) {
      const cardEl = CardStudio.createCardElement(dish, activeLanguage, onRetry, onLocalize);
      fragment.appendChild(cardEl);
    }
    container.appendChild(fragment);
  }
}

