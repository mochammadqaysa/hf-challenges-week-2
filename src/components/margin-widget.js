/**
 * RasaLore AI - Side Hustle Commercial Margin Calculator Component
 * Calculates avoided cloud token costs, gross margins, and monthly projections.
 * Adheres to REQ-007, AC-010, and spec Section 12.1.
 */

/**
 * Headless financial math calculation seam for avoided token costs and margins.
 */
export class MarginCalculator {
  static BENCHMARK_RATES = {
    // Commercial multi-modal / frontier model pricing ($ per 1M tokens)
    INPUT_PRICE_PER_MILLION: 2.50,
    OUTPUT_PRICE_PER_MILLION: 10.00,
    // Average tokens per audited dish (Enrichment prompt + JSON completion + multilingual localization)
    DEFAULT_PROMPT_TOKENS_PER_DISH: 800,
    DEFAULT_COMPLETION_TOKENS_PER_DISH: 600,
    // Local hardware electricity amortized direct cost per 10-dish audit
    DEFAULT_DIRECT_COST_PER_RUN: 0.01,
    DEFAULT_WEEKS_PER_MONTH: 4.33
  };

  /**
   * Calculates avoided commercial cloud API cost.
   * @param {object} params
   * @param {number} [params.dishCount=10]
   * @param {number} [params.promptTokens]
   * @param {number} [params.completionTokens]
   * @param {number} [params.priceInPerMillion=2.50]
   * @param {number} [params.priceOutPerMillion=10.00]
   * @param {Array<object>} [params.dishes=[]]
   * @returns {{ promptTokens: number, completionTokens: number, totalTokens: number, avoidedCost: number, avoidedCostFormatted: string }}
   */
  static calculateAvoidedCost({
    dishCount = 10,
    promptTokens = null,
    completionTokens = null,
    priceInPerMillion = MarginCalculator.BENCHMARK_RATES.INPUT_PRICE_PER_MILLION,
    priceOutPerMillion = MarginCalculator.BENCHMARK_RATES.OUTPUT_PRICE_PER_MILLION,
    dishes = []
  } = {}) {
    const count = Math.max(0, Number(dishCount) || 0);

    let resolvedPromptTokens = 0;
    let resolvedCompletionTokens = 0;

    // Check if dishes have explicit tokensConsumed
    if (Array.isArray(dishes) && dishes.length > 0) {
      for (const d of dishes) {
        if (d?.tokensConsumed) {
          resolvedPromptTokens += Number(d.tokensConsumed.promptTokens) || 0;
          resolvedCompletionTokens += Number(d.tokensConsumed.completionTokens) || 0;
        } else {
          resolvedPromptTokens += MarginCalculator.BENCHMARK_RATES.DEFAULT_PROMPT_TOKENS_PER_DISH;
          resolvedCompletionTokens += MarginCalculator.BENCHMARK_RATES.DEFAULT_COMPLETION_TOKENS_PER_DISH;
        }
      }
    } else {
      resolvedPromptTokens = promptTokens !== null
        ? Number(promptTokens) || 0
        : count * MarginCalculator.BENCHMARK_RATES.DEFAULT_PROMPT_TOKENS_PER_DISH;

      resolvedCompletionTokens = completionTokens !== null
        ? Number(completionTokens) || 0
        : count * MarginCalculator.BENCHMARK_RATES.DEFAULT_COMPLETION_TOKENS_PER_DISH;
    }

    const costIn = (resolvedPromptTokens / 1_000_000) * priceInPerMillion;
    const costOut = (resolvedCompletionTokens / 1_000_000) * priceOutPerMillion;
    const totalAvoided = costIn + costOut;

    return {
      promptTokens: resolvedPromptTokens,
      completionTokens: resolvedCompletionTokens,
      totalTokens: resolvedPromptTokens + resolvedCompletionTokens,
      avoidedCost: Number(totalAvoided.toFixed(4)),
      avoidedCostFormatted: `$${totalAvoided.toFixed(2)}`
    };
  }

  /**
   * Calculates gross profit margin with zero-division safety.
   * @param {object} params
   * @param {number} [params.clientFee=50]
   * @param {number} [params.directCost=0.01] - Amortized local electricity per audit
   * @returns {{ marginPercent: number, marginFormatted: string }}
   */
  static calculateGrossMargin({ clientFee = 50, directCost = 0.01 } = {}) {
    const fee = Number(clientFee) || 0;
    const cost = Math.max(0, Number(directCost) || 0);

    // Zero-division safety: fee of $0 yields 0% margin without NaN or exceptions
    if (fee <= 0) {
      return {
        marginPercent: 0,
        marginFormatted: '0.0%'
      };
    }

    const grossProfit = Math.max(0, fee - cost);
    const rawMargin = (grossProfit / fee) * 100;
    const clampedMargin = Math.min(100, Math.max(0, rawMargin));

    return {
      marginPercent: Number(clampedMargin.toFixed(2)),
      marginFormatted: clampedMargin >= 99.8 ? '99.8%+' : `${clampedMargin.toFixed(1)}%`
    };
  }

  /**
   * Calculates monthly revenue projection based on client audit fee and volume.
   * @param {object} params
   * @param {number} [params.clientFee=50]
   * @param {number} [params.menusPerWeek=5]
   * @param {number} [params.weeksPerMonth=4.33]
   * @returns {{ monthlyRevenue: number, monthlyRevenueFormatted: string, auditsPerMonth: number }}
   */
  static calculateMonthlyRevenue({
    clientFee = 50,
    menusPerWeek = 5,
    weeksPerMonth = MarginCalculator.BENCHMARK_RATES.DEFAULT_WEEKS_PER_MONTH
  } = {}) {
    const fee = Math.max(0, Number(clientFee) || 0);
    const volume = Math.max(0, Number(menusPerWeek) || 0);
    const weeks = Math.max(0, Number(weeksPerMonth) || 4.33);

    const auditsPerMonth = volume * weeks;
    const monthlyRevenue = fee * auditsPerMonth;

    return {
      monthlyRevenue: Number(monthlyRevenue.toFixed(2)),
      monthlyRevenueFormatted: `$${Math.round(monthlyRevenue).toLocaleString('en-US')}`,
      auditsPerMonth: Number(auditsPerMonth.toFixed(2))
    };
  }

  /**
   * Comprehensive financial math summary.
   * @param {object} params
   * @returns {object}
   */
  static calculate({
    dishCount = 10,
    clientFee = 50,
    menusPerWeek = 5,
    directCost = 0.01,
    dishes = []
  } = {}) {
    const fee = Math.max(0, Number(clientFee) || 0);
    const avoided = MarginCalculator.calculateAvoidedCost({ dishCount, dishes });
    const margin = MarginCalculator.calculateGrossMargin({ clientFee: fee, directCost });
    const revenue = MarginCalculator.calculateMonthlyRevenue({ clientFee: fee, menusPerWeek });

    return {
      clientFee: fee,
      dishCount: Math.max(0, Number(dishCount) || 0),
      menusPerWeek: Math.max(0, Number(menusPerWeek) || 0),
      avoidedCost: avoided.avoidedCost,
      avoidedCostFormatted: avoided.avoidedCostFormatted,
      totalTokens: avoided.totalTokens,
      marginPercent: margin.marginPercent,
      marginFormatted: margin.marginFormatted,
      monthlyRevenue: revenue.monthlyRevenue,
      monthlyRevenueFormatted: revenue.monthlyRevenueFormatted
    };
  }
}

/**
 * UI Component rendering the Side Hustle Commercial Margin Calculator widget.
 */
export class MarginWidget {
  /**
   * @param {object} options
   * @param {HTMLElement} options.container - Element where widget is rendered
   * @param {number} [options.initialFee=50] - Initial fee slider value ($25 - $100)
   * @param {number} [options.initialMenusPerWeek=5]
   * @param {number} [options.dishCount=10]
   * @param {Array<object>} [options.dishes=[]]
   * @param {Function} [options.onFeeChange]
   */
  constructor(options = {}) {
    this.container = options.container;
    this.clientFee = Number(options.initialFee) || 50;
    this.menusPerWeek = Number(options.initialMenusPerWeek) || 5;
    this.dishCount = Number(options.dishCount) || 10;
    this.dishes = Array.isArray(options.dishes) ? options.dishes : [];
    this.onFeeChange = options.onFeeChange || null;

    this.elements = {};
  }

  /**
   * Initializes and renders the widget.
   */
  init() {
    if (!this.container) return;
    this.render();
    this.bindEvents();
    this.updateValues();
  }

  /**
   * Generates DOM structure for the widget.
   */
  render() {
    this.container.innerHTML = `
      <section class="side-hustle-margin-widget" aria-label="Side Hustle Margin Calculator">
        <div class="margin-widget__header">
          <div class="margin-widget__title-group">
            <span class="margin-widget__icon">💼</span>
            <div>
              <h3 class="margin-widget__title">Commercial Edge: Side Hustle Margin</h3>
              <p class="margin-widget__subtitle">
                Quantifiable cloud API savings & profit projections when offering menu audits to restaurants.
              </p>
            </div>
          </div>
          <div class="margin-widget__badge">
            <span class="badge badge--success">99.8%+ Gross Margin</span>
          </div>
        </div>

        <div class="margin-widget__body">
          <!-- Slider Control -->
          <div class="margin-slider-control">
            <div class="slider-header">
              <label for="audit-fee-slider" class="slider-label">
                <span>Client Audit Fee per Menu:</span>
                <strong class="slider-fee-value" id="margin-fee-display">$${this.clientFee}</strong>
              </label>
              <span class="slider-hint">Commercial benchmark: $25 – $100 per menu</span>
            </div>
            <div class="slider-track-wrap">
              <span class="slider-bound">$25</span>
              <input
                type="range"
                id="audit-fee-slider"
                class="margin-range-input"
                min="25"
                max="100"
                step="5"
                value="${this.clientFee}"
                aria-label="Client Audit Fee"
              />
              <span class="slider-bound">$100</span>
            </div>
          </div>

          <!-- Financial Metrics Grid -->
          <div class="margin-kpi-grid">
            <!-- Metric 1: Avoided Cloud Cost -->
            <div class="margin-kpi-card">
              <div class="kpi-icon-wrap kpi-icon--emerald">⚡</div>
              <div class="kpi-content">
                <span class="kpi-label">Avoided Cloud Cost</span>
                <strong class="kpi-value" id="margin-avoided-cost">~$0.08</strong>
                <span class="kpi-subtext" id="margin-avoided-detail">10 dishes @ $0.00 Ollama</span>
              </div>
            </div>

            <!-- Metric 2: Realized Gross Margin -->
            <div class="margin-kpi-card">
              <div class="kpi-icon-wrap kpi-icon--gold">📈</div>
              <div class="kpi-content">
                <span class="kpi-label">Realized Gross Margin</span>
                <strong class="kpi-value highlight-gold" id="margin-gross-percent">99.8%+</strong>
                <span class="kpi-subtext">Zero cloud token overhead</span>
              </div>
            </div>

            <!-- Metric 3: Monthly Revenue Projection -->
            <div class="margin-kpi-card">
              <div class="kpi-icon-wrap kpi-icon--amber">💰</div>
              <div class="kpi-content">
                <span class="kpi-label">Monthly Projection</span>
                <strong class="kpi-value highlight-amber" id="margin-monthly-revenue">~$1,082 / mo</strong>
                <span class="kpi-subtext">5 audits/wk × 4.33 weeks</span>
              </div>
            </div>
          </div>
        </div>

        <div class="margin-widget__footer">
          <span class="margin-footer-pill">
            🛡️ Air-Gapped Advantage: Zero cloud API lock-in, zero recurring subscription fees.
          </span>
          <span class="margin-footer-detail">
            Benchmarked against GPT-4o ($2.50/M in, $10.00/M out).
          </span>
        </div>
      </section>
    `;

    // Cache element references
    this.elements = {
      slider: this.container.querySelector('#audit-fee-slider'),
      feeDisplay: this.container.querySelector('#margin-fee-display'),
      avoidedCost: this.container.querySelector('#margin-avoided-cost'),
      avoidedDetail: this.container.querySelector('#margin-avoided-detail'),
      grossPercent: this.container.querySelector('#margin-gross-percent'),
      monthlyRevenue: this.container.querySelector('#margin-monthly-revenue')
    };
  }

  /**
   * Binds slider input event.
   */
  bindEvents() {
    if (this.elements.slider) {
      this.elements.slider.addEventListener('input', e => {
        this.clientFee = Number(e.target.value) || 50;
        this.updateValues();
        if (this.onFeeChange) {
          this.onFeeChange(this.clientFee);
        }
      });
    }
  }

  /**
   * Updates UI metric values based on current state.
   */
  updateValues() {
    const summary = MarginCalculator.calculate({
      dishCount: this.dishCount,
      clientFee: this.clientFee,
      menusPerWeek: this.menusPerWeek,
      dishes: this.dishes
    });

    if (this.elements.feeDisplay) {
      this.elements.feeDisplay.textContent = `$${this.clientFee}`;
    }

    if (this.elements.avoidedCost) {
      this.elements.avoidedCost.textContent = `~${summary.avoidedCostFormatted}`;
    }

    if (this.elements.avoidedDetail) {
      this.elements.avoidedDetail.textContent = `${this.dishCount} dishes @ $0.00 Ollama`;
    }

    if (this.elements.grossPercent) {
      this.elements.grossPercent.textContent = summary.marginFormatted;
    }

    if (this.elements.monthlyRevenue) {
      this.elements.monthlyRevenue.textContent = `~${summary.monthlyRevenueFormatted} / mo`;
    }
  }

  /**
   * Updates the dish count and optional dish list.
   * @param {number} count
   * @param {Array<object>} [dishes=[]]
   */
  updateDishes(count, dishes = []) {
    this.dishCount = Math.max(0, Number(count) || 0);
    this.dishes = Array.isArray(dishes) ? dishes : [];
    this.updateValues();
  }

  /**
   * Programmatically updates the fee.
   * @param {number} fee
   */
  setFee(fee) {
    this.clientFee = Math.max(0, Number(fee) || 0);
    if (this.elements.slider) {
      this.elements.slider.value = this.clientFee;
    }
    this.updateValues();
  }
}
