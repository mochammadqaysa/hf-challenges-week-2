/**
 * RasaLore AI - Studio Application Controller
 * Phase 2: Dual-Mode Inference, Sequential FIFO Queue, and Failure Isolation.
 */

import { CULINARY_PRESETS } from './data/presets.js';
import { getGoldenDishesByPreset } from './data/golden-cache.js';
import { CardStudio, escapeHtml } from './components/card-studio.js';
import { InferenceAdapter } from './adapters/inference-adapter.js';
import { FifoQueueManager } from './queue/fifo-queue.js';
import { ConnectionBanner } from './components/connection-banner.js';
import { MarginWidget } from './components/margin-widget.js';
import { RemoteFallbackDrawer } from './components/remote-fallback-drawer.js';
import { ExportStudio } from './components/export-studio.js';

// Top-Level Configuration Constants (TASK-202)
export const DEFAULT_PRESET_ID = 'bali-bistro';
export const DEFAULT_LANGUAGE = 'en';
export const HF_TOKEN_STORAGE_KEY = 'rasalore_hf_token';
export const DEFAULT_OLLAMA_URL = 'http://localhost:11434';
export const DEFAULT_MODEL_NAME = 'gemma2:2b';
export const DEFAULT_INFERENCE_TIMEOUT_MS = 15000;

class RasaLoreStudioApp {
  constructor() {
    this.activePresetId = DEFAULT_PRESET_ID;
    this.activeLanguage = DEFAULT_LANGUAGE;
    this.currentDishes = [];
    this.startTime = performance.now();

    // Initialize Headless Architecture Seams
    this.adapter = new InferenceAdapter({
      mode: 'LOCAL_OLLAMA',
      ollamaBaseUrl: DEFAULT_OLLAMA_URL,
      modelName: DEFAULT_MODEL_NAME,
      timeoutMs: DEFAULT_INFERENCE_TIMEOUT_MS
    });

    this.queue = new FifoQueueManager(this.adapter, { delayBetweenMs: 80 });

    this.elements = {
      presetButtons: document.querySelectorAll('.btn-preset'),
      presetBannerTitle: document.getElementById('preset-banner-title'),
      presetBannerDesc: document.getElementById('preset-banner-desc'),
      presetBannerRegion: document.getElementById('preset-banner-region'),
      languageButtons: document.querySelectorAll('.lang-btn'),
      cardsGrid: document.getElementById('dish-cards-grid'),
      dishCountStat: document.getElementById('dish-count-stat'),
      latencyStat: document.getElementById('latency-stat'),
      statusPill: document.getElementById('inference-status-pill'),
      corsBannerContainer: document.getElementById('cors-banner-container'),
      customDishForm: document.getElementById('custom-dish-form'),
      inputDishName: document.getElementById('input-dish-name'),
      inputDishRegion: document.getElementById('input-dish-region'),
      inputDishPrice: document.getElementById('input-dish-price'),
      inputDishIngredients: document.getElementById('input-dish-ingredients'),
      btnSubmitDish: document.getElementById('btn-submit-dish'),
      queueProgressContainer: document.getElementById('queue-progress-container'),
      queueProgressText: document.getElementById('queue-progress-text'),
      queueProgressCount: document.getElementById('queue-progress-count'),
      queueProgressFill: document.getElementById('queue-progress-fill'),
      marginWidgetContainer: document.getElementById('margin-widget-container'),
      exportStudioContainer: document.getElementById('export-studio-container'),
      printHeaderSubtitle: document.getElementById('print-header-subtitle'),
      printHeaderPreset: document.getElementById('print-header-preset'),
      printHeaderDate: document.getElementById('print-header-date'),
      btnOpenSettings: document.getElementById('btn-open-settings')
    };

    this.drawer = null;
    this.marginWidget = null;
    this.exportStudio = null;

    // Initialize Connection Health & CORS Guidance Banner
    this.connectionBanner = new ConnectionBanner({
      inferenceAdapter: this.adapter,
      statusPillEl: this.elements.statusPill,
      bannerContainerEl: this.elements.corsBannerContainer,
      onStatusChange: health => this.handleConnectionChange(health)
    });
  }

  /**
   * Initializes event listeners, probes connection health, and loads initial preset.
   */
  async init() {
    this.setupRemoteFallbackDrawer();
    this.setupMarginWidget();
    this.setupExportStudio();
    this.bindEvents();
    this.setupQueueProgress();
    this.loadPreset(this.activePresetId);

    // Auto-probe Ollama connection
    await this.connectionBanner.init();

    const initDuration = Math.round(performance.now() - this.startTime);
    if (this.elements.latencyStat) {
      this.elements.latencyStat.textContent = `⚡ Studio Ready in ${initDuration}ms`;
    }
  }

  /**
   * Initializes the Remote Fallback & Ephemeral Token Settings Drawer (TASK-303).
   */
  setupRemoteFallbackDrawer() {
    this.drawer = new RemoteFallbackDrawer({
      inferenceAdapter: this.adapter,
      storageKey: HF_TOKEN_STORAGE_KEY,
      onTokenChange: token => {
        console.log('[RemoteFallbackDrawer] Ephemeral token updated:', Boolean(token));
        if (this.connectionBanner) {
          this.connectionBanner.probeConnection();
        }
      }
    });
    this.drawer.init();
  }

  /**
   * Initializes the Side Hustle Commercial Margin Calculator Widget (TASK-301).
   */
  setupMarginWidget() {
    if (this.elements.marginWidgetContainer) {
      this.marginWidget = new MarginWidget({
        container: this.elements.marginWidgetContainer,
        initialFee: 50,
        initialMenusPerWeek: 5,
        dishCount: 10,
        dishes: this.currentDishes,
        onFeeChange: fee => {
          console.log(`[MarginWidget] Fee adjusted to: $${fee}`);
        }
      });
      this.marginWidget.init();
    }
  }

  /**
   * Initializes the Production Export Studio Action Bar (TASK-402).
   */
  setupExportStudio() {
    if (this.elements.exportStudioContainer) {
      this.exportStudio = new ExportStudio({
        container: this.elements.exportStudioContainer,
        getDishes: () => this.currentDishes,
        getActivePreset: () => this.activePresetId,
        getActiveLanguage: () => this.activeLanguage,
        onPrint: () => this.syncPrintHeader(),
        onExport: info => {
          console.log(`[RasaLore Studio] POS JSON exported: ${info.filename} (${info.count} dishes)`);
        }
      });
      this.exportStudio.init();
    }
  }

  /**
   * Synchronizes metadata in the physical print-only header.
   */
  syncPrintHeader() {
    const presetMeta = CULINARY_PRESETS.find(p => p.id === this.activePresetId) || CULINARY_PRESETS[0];
    if (this.elements.printHeaderSubtitle) {
      this.elements.printHeaderSubtitle.textContent = presetMeta.description || 'Cultural Culinary Heritage Menu & Allergen Intelligence';
    }
    if (this.elements.printHeaderPreset) {
      this.elements.printHeaderPreset.textContent = `${presetMeta.name} • ${presetMeta.region}`;
    }
    if (this.elements.printHeaderDate) {
      const today = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
      this.elements.printHeaderDate.textContent = `Commercial Table Insert • ${today}`;
    }
  }

  /**
   * Binds UI interactions and form submissions.
   */
  bindEvents() {
    // Remote Fallback Settings Drawer trigger
    if (this.elements.btnOpenSettings) {
      this.elements.btnOpenSettings.addEventListener('click', () => {
        if (this.drawer) this.drawer.open();
      });
    }

    // Preset button click handling
    this.elements.presetButtons.forEach(btn => {
      btn.addEventListener('click', e => {
        const targetBtn = e.currentTarget;
        const presetId = targetBtn.getAttribute('data-preset-id');
        if (presetId && presetId !== this.activePresetId) {
          this.loadPreset(presetId);
        }
      });
    });

    // Language switcher click handling
    this.elements.languageButtons.forEach(btn => {
      btn.addEventListener('click', e => {
        const targetBtn = e.currentTarget;
        const lang = targetBtn.getAttribute('data-lang');
        if (lang && lang !== this.activeLanguage) {
          this.setLanguage(lang);
        }
      });
    });

    // Custom Dish Form Submission
    if (this.elements.customDishForm) {
      this.elements.customDishForm.addEventListener('submit', e => this.handleCustomDishSubmit(e));
    }
  }

  /**
   * Sets up real-time progress callbacks for the sequential FIFO queue.
   */
  setupQueueProgress() {
    this.queue.onProgress(event => {
      this.handleQueueProgressEvent(event);
    });
  }

  /**
   * Handles progress events emitted by FifoQueueManager.
   * @param {object} event - QueueProgressEvent
   */
  handleQueueProgressEvent(event) {
    const { dishId, index, total, status, result } = event;

    // Show Progress Bar
    if (this.elements.queueProgressContainer) {
      this.elements.queueProgressContainer.style.display = 'flex';
    }

    const rawDishName = result?.originalName || 'dish';
    const dishName = escapeHtml(rawDishName);
    const percent = Math.min(100, Math.round((index / total) * 100));

    if (this.elements.queueProgressFill) {
      this.elements.queueProgressFill.style.width = `${percent}%`;
    }
    if (this.elements.queueProgressCount) {
      this.elements.queueProgressCount.textContent = `${index} / ${total}`;
    }

    if (this.elements.queueProgressText) {
      switch (status) {
        case 'QUEUED':
          this.elements.queueProgressText.innerHTML = `<span>⏳</span> Queued: <strong>${dishName}</strong> (${index}/${total})`;
          break;
        case 'PROCESSING':
          this.elements.queueProgressText.innerHTML = `<span>⚡</span> Analyzing with Gemma 2: <strong>${dishName}</strong>...`;
          break;
        case 'ENRICHED':
          this.elements.queueProgressText.innerHTML = `<span>✓</span> Enriched: <strong>${dishName}</strong>`;
          break;
        case 'FAILED_ANOMALY':
          this.elements.queueProgressText.innerHTML = `<span>⚠️</span> Anomaly Isolated: <strong>${dishName}</strong> (Queue continuing)`;
          break;
      }
    }

    // Update current dishes array
    const existingIndex = this.currentDishes.findIndex(d => d.id === dishId);
    if (existingIndex !== -1) {
      this.currentDishes[existingIndex] = result;
    } else if (result) {
      this.currentDishes.push(result);
    }

    // Re-render cards grid to reflect live card state
    this.render();

    // Update Export Studio stats
    if (this.exportStudio) {
      this.exportStudio.updateStats();
    }

    // If batch finished (all items enriched or isolated)
    if (index === total && (status === 'ENRICHED' || status === 'FAILED_ANOMALY')) {
      if (this.elements.latencyStat) {
        this.elements.latencyStat.textContent = `⚡ Queue Complete (${total} items processed)`;
      }
      setTimeout(() => {
        if (this.elements.queueProgressContainer && !this.queue.isProcessing) {
          this.elements.queueProgressContainer.style.display = 'none';
        }
      }, 2500);
    }
  }

  /**
   * Handles custom dish form submission and dispatches to FIFO queue.
   * @param {Event} e
   */
  async handleCustomDishSubmit(e) {
    e.preventDefault();

    const name = this.elements.inputDishName?.value?.trim();
    if (!name) return;

    const regionalOrigin = this.elements.inputDishRegion?.value?.trim() || 'Regional Heritage';
    const priceText = this.elements.inputDishPrice?.value?.trim() || '';
    const rawIngredients = this.elements.inputDishIngredients?.value?.trim() || '';

    // Check AC-003A: Remote Fallback without token & without local Ollama
    const isLocalAvailable = this.connectionBanner.lastHealth?.isAvailable;
    const hasToken = Boolean(this.adapter.hfToken);

    if (!isLocalAvailable && !hasToken && this.adapter.mode === 'REMOTE_FALLBACK') {
      this.connectionBanner.showTokenRequirementsModal(
        presetId => this.loadPreset(presetId),
        () => {
          if (this.drawer) this.drawer.open();
        }
      );
      return;
    }

    const dishInput = {
      id: `custom-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      name,
      regionalOrigin,
      priceText,
      rawIngredients
    };

    // Disable button temporarily
    if (this.elements.btnSubmitDish) {
      this.elements.btnSubmitDish.disabled = true;
      this.elements.btnSubmitDish.innerHTML = '<span class="btn__icon">⏳</span> Enqueuing...';
    }

    // Reset Form fields
    if (this.elements.inputDishName) this.elements.inputDishName.value = '';
    if (this.elements.inputDishRegion) this.elements.inputDishRegion.value = '';
    if (this.elements.inputDishPrice) this.elements.inputDishPrice.value = '';
    if (this.elements.inputDishIngredients) this.elements.inputDishIngredients.value = '';

    // Enqueue dish
    this.queue.enqueue(dishInput);

    // Update Dish Count Stat
    if (this.elements.dishCountStat) {
      this.elements.dishCountStat.textContent = `${this.currentDishes.length + 1} Dishes in Studio`;
    }

    // Update MarginWidget
    if (this.marginWidget) {
      this.marginWidget.updateDishes(this.currentDishes.length + 1, this.currentDishes);
    }

    // Start Queue Execution
    try {
      await this.queue.start();
    } finally {
      if (this.elements.btnSubmitDish) {
        this.elements.btnSubmitDish.disabled = false;
        this.elements.btnSubmitDish.innerHTML = '<span class="btn__icon">⚡</span> Enrich Dish with Gemma 2';
      }
      if (this.marginWidget) {
        this.marginWidget.updateDishes(this.currentDishes.length, this.currentDishes);
      }
    }
  }

  /**
   * Handles connection health status update.
   * @param {object} health
   */
  handleConnectionChange(health) {
    if (health.isAvailable) {
      this.adapter.setMode('LOCAL_OLLAMA');
    } else {
      this.adapter.setMode('REMOTE_FALLBACK');
    }
  }

  /**
   * Loads and renders a preset by ID.
   * @param {string} presetId
   */
  loadPreset(presetId) {
    const t0 = performance.now();
    this.activePresetId = presetId;

    // Update active preset button
    this.elements.presetButtons.forEach(btn => {
      const match = btn.getAttribute('data-preset-id') === presetId;
      btn.classList.toggle('active', match);
    });

    // Find preset metadata
    const presetMeta = CULINARY_PRESETS.find(p => p.id === presetId) || CULINARY_PRESETS[0];

    // Update Banner Info
    if (this.elements.presetBannerTitle) {
      this.elements.presetBannerTitle.textContent = `${presetMeta.icon} ${presetMeta.name}`;
    }
    if (this.elements.presetBannerDesc) {
      this.elements.presetBannerDesc.textContent = presetMeta.description;
    }
    if (this.elements.presetBannerRegion) {
      this.elements.presetBannerRegion.textContent = presetMeta.region;
    }

    // Clear active queue when switching presets
    this.queue.clear();

    // Retrieve golden dishes
    this.currentDishes = getGoldenDishesByPreset(presetId);

    // Update Stats
    if (this.elements.dishCountStat) {
      this.elements.dishCountStat.textContent = `${this.currentDishes.length} Heritage Dishes`;
    }

    // Update MarginWidget
    if (this.marginWidget) {
      this.marginWidget.updateDishes(this.currentDishes.length, this.currentDishes);
    }

    // Render Cards Grid
    this.render();

    // Update Export Studio stats and print header
    if (this.exportStudio) {
      this.exportStudio.updateStats();
    }
    this.syncPrintHeader();

    const elapsed = Math.round(performance.now() - t0);
    if (this.elements.latencyStat) {
      this.elements.latencyStat.textContent = `⚡ Switched in ${elapsed}ms (Pre-Cached Golden)`;
    }
  }

  /**
   * Sets the active viewing language and updates cards (TASK-302).
   * Instant switching (0ms) for pre-translated presets; on-demand translation for custom dishes.
   * Preserves allergen flags and sensory profiles untouched.
   * @param {'en'|'ja'|'zh'|'fr'} lang
   */
  async setLanguage(lang) {
    this.activeLanguage = lang;

    this.elements.languageButtons.forEach(btn => {
      const match = btn.getAttribute('data-lang') === lang;
      btn.classList.toggle('active', match);
    });

    // Instant update for all dishes (initial render for pre-translated items)
    this.render();

    // If switching to non-English, trigger on-demand localization for dishes needing translation
    if (lang !== 'en') {
      const isLocal = this.connectionBanner.lastHealth?.isAvailable;
      const hasToken = Boolean(this.adapter.hfToken);
      const canTranslate = isLocal || hasToken;

      for (const dish of this.currentDishes) {
        if (dish.status !== 'ENRICHED') continue;

        // If not pre-translated
        if (!dish.culturalNarrative || !dish.culturalNarrative[lang]) {
          const cardEl = this.elements.cardsGrid?.querySelector(`[data-dish-id="${dish.id}"]`);

          if (canTranslate) {
            dish.isTranslatingNarrative = true;
            if (cardEl) {
              CardStudio.updateCardNarrative(cardEl, dish, lang);
            } else {
              this.render();
            }

            try {
              const translated = await this.adapter.localizeNarrative(
                dish.id,
                dish.culturalNarrative?.en || dish.originalName,
                lang
              );
              if (!dish.culturalNarrative) dish.culturalNarrative = {};
              dish.culturalNarrative[lang] = translated;
              dish.isTranslatingNarrative = false;
              dish.translationNotice = null;
            } catch (err) {
              dish.isTranslatingNarrative = false;
              dish.translationNotice = 'Live translation error (Canonical English displayed)';
            }

            if (cardEl) {
              CardStudio.updateCardNarrative(cardEl, dish, lang);
            } else {
              this.render();
            }
          } else {
            // Clarification resolution: Retain canonical English with non-intrusive advisory badge
            dish.translationNotice = 'Live translation requires Ollama or HF_TOKEN (Canonical English displayed)';
            if (cardEl) {
              CardStudio.updateCardNarrative(cardEl, dish, lang);
            } else {
              this.render();
            }
          }
        }
      }
    }
  }

  /**
   * Re-renders the cards grid using CardStudio.
   */
  render() {
    CardStudio.renderCardsGrid(
      this.elements.cardsGrid,
      this.currentDishes,
      this.activeLanguage,
      dishId => this.handleRetryDish(dishId),
      (dish, lang) => this.handleLocalizeDish(dish, lang)
    );
  }

  /**
   * On-demand localization handler for single dish.
   * @param {object} dish
   * @param {'en'|'ja'|'zh'|'fr'} lang
   */
  async handleLocalizeDish(dish, lang) {
    if (!dish || lang === 'en') return;
    const isLocal = this.connectionBanner.lastHealth?.isAvailable;
    const hasToken = Boolean(this.adapter.hfToken);
    const cardEl = this.elements.cardsGrid?.querySelector(`[data-dish-id="${dish.id}"]`);

    if (isLocal || hasToken) {
      dish.isTranslatingNarrative = true;
      if (cardEl) {
        CardStudio.updateCardNarrative(cardEl, dish, lang);
      } else {
        this.render();
      }

      try {
        const translated = await this.adapter.localizeNarrative(
          dish.id,
          dish.culturalNarrative?.en || dish.originalName,
          lang
        );
        if (!dish.culturalNarrative) dish.culturalNarrative = {};
        dish.culturalNarrative[lang] = translated;
        dish.isTranslatingNarrative = false;
        dish.translationNotice = null;
      } catch {
        dish.isTranslatingNarrative = false;
        dish.translationNotice = 'Live translation error (Canonical English displayed)';
      }

      if (cardEl) {
        CardStudio.updateCardNarrative(cardEl, dish, lang);
      } else {
        this.render();
      }
    } else {
      dish.translationNotice = 'Live translation requires Ollama or HF_TOKEN (Canonical English displayed)';
      if (cardEl) {
        CardStudio.updateCardNarrative(cardEl, dish, lang);
      } else {
        this.render();
      }
    }
  }

  /**
   * Retries an individual dish isolated in FAILED_ANOMALY state.
   * @param {string} dishId
   */
  async handleRetryDish(dishId) {
    console.log(`[RasaLore Studio] Retrying dish: ${dishId}`);
    try {
      await this.queue.retryDish(dishId);
      if (this.marginWidget) {
        this.marginWidget.updateDishes(this.currentDishes.length, this.currentDishes);
      }
      if (this.exportStudio) {
        this.exportStudio.updateStats();
      }
    } catch (err) {
      console.error(`[RasaLore Studio] Retry failed for dish: ${dishId}`, err);
    }
  }
}

// Bootstrap once DOM content is loaded
document.addEventListener('DOMContentLoaded', () => {
  const app = new RasaLoreStudioApp();
  app.init();
  window.__rasaloreStudio = app; // Expose for testing and browser automation
});
