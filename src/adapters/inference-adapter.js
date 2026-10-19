/**
 * RasaLore AI - Dual-Mode Inference Adapter
 * Orchestrates Local Ollama, Pre-Cached Golden responses, and Hugging Face Serverless fallback.
 */

import { OllamaClient } from './ollama-client.js';
import { HfClient } from './hf-client.js';
import { JsonSanitizer } from '../parsers/json-sanitizer.js';
import { SchemaValidator } from '../parsers/schema-validator.js';
import { getGoldenDishById, GOLDEN_CACHE } from '../data/golden-cache.js';
import { buildCulinaryEnrichmentPrompt, buildLocalizationPrompt } from '../prompts/gemma-prompts.js';

export class InferenceAdapter {
  /**
   * @param {object} [config={}]
   * @param {'LOCAL_OLLAMA'|'REMOTE_FALLBACK'} [config.mode='LOCAL_OLLAMA']
   * @param {string} [config.ollamaBaseUrl='http://localhost:11434']
   * @param {string} [config.modelName='gemma2:2b']
   * @param {string|null} [config.hfToken=null]
   * @param {number} [config.timeoutMs=15000]
   * @param {OllamaClient} [config.ollamaClient=null] - For testing/mocking
   * @param {HfClient} [config.hfClient=null] - For testing/mocking
   */
  constructor(config = {}) {
    this.mode = config.mode || 'LOCAL_OLLAMA';
    this.ollamaBaseUrl = config.ollamaBaseUrl || 'http://localhost:11434';
    this.modelName = config.modelName || 'gemma2:2b';
    this.hfToken = config.hfToken || null;
    this.timeoutMs = config.timeoutMs || 15000;

    this.ollamaClient = config.ollamaClient || new OllamaClient({
      baseUrl: this.ollamaBaseUrl,
      modelName: this.modelName,
      timeoutMs: this.timeoutMs
    });

    this.hfClient = config.hfClient || new HfClient({
      timeoutMs: this.timeoutMs
    });
  }

  /**
   * Sets the inference mode.
   * @param {'LOCAL_OLLAMA'|'REMOTE_FALLBACK'} mode
   */
  setMode(mode) {
    if (mode === 'LOCAL_OLLAMA' || mode === 'REMOTE_FALLBACK') {
      this.mode = mode;
    }
  }

  /**
   * Sets or clears ephemeral HF_TOKEN.
   * @param {string|null} token
   */
  setHfToken(token) {
    this.hfToken = token && typeof token === 'string' ? token.trim() : null;
  }

  /**
   * Probes Ollama health endpoint.
   * @param {number} [timeoutMs=3000]
   * @returns {Promise<{ isAvailable: boolean, message: string, mode: string, isCorsError?: boolean }>}
   */
  async checkHealth(timeoutMs = 3000) {
    const health = await this.ollamaClient.checkHealth(timeoutMs);
    return {
      ...health,
      mode: this.mode
    };
  }

  /**
   * Finds pre-cached golden dish if exists by id or normalized name.
   * @param {object} dish - Dish input
   * @returns {object|null}
   */
  findGoldenDish(dish) {
    if (!dish) return null;
    if (dish.id && getGoldenDishById(dish.id)) {
      return getGoldenDishById(dish.id);
    }
    const match = Object.values(GOLDEN_CACHE).find(
      g => g.originalName && dish.name && g.originalName.toLowerCase() === dish.name.toLowerCase()
    );
    return match || null;
  }

  /**
   * Enriches a dish using the active inference engine or resilient fallback.
   * @param {object} request
   * @param {object} request.dish - Dish input details
   * @param {'en'|'ja'|'zh'|'fr'} [request.targetLanguage='en']
   * @returns {Promise<{
   *   success: boolean,
   *   rawText: string,
   *   parsedDish: object,
   *   promptTokens: number,
   *   completionTokens: number,
   *   engineUsed: 'LOCAL_OLLAMA' | 'PRECACHED_GOLDEN' | 'HF_SERVERLESS',
   *   latencyMs: number,
   *   error?: string
   * }>}
   */
  async enrichDish(request) {
    const t0 = performance.now();
    const dish = request?.dish || {};
    const golden = this.findGoldenDish(dish);

    let rawText = '';
    let promptTokens = 0;
    let completionTokens = 0;
    let engineUsed = 'LOCAL_OLLAMA';
    let generationError = null;

    // Check if we should use Pre-Cached Golden immediately
    const useGoldenImmediately = golden && (
      (this.mode === 'REMOTE_FALLBACK' && !this.hfToken) ||
      dish.isPreset === true ||
      dish.id?.startsWith('bali-') ||
      dish.id?.startsWith('warung-') ||
      dish.id?.startsWith('coffee-')
    );

    if (useGoldenImmediately) {
      const latencyMs = Math.round(performance.now() - t0);
      return {
        success: true,
        rawText: JSON.stringify(golden),
        parsedDish: golden,
        promptTokens: golden.tokensConsumed?.promptTokens || 0,
        completionTokens: golden.tokensConsumed?.completionTokens || 0,
        engineUsed: 'PRECACHED_GOLDEN',
        latencyMs
      };
    }

    const prompt = buildCulinaryEnrichmentPrompt(dish);

    if (this.mode === 'LOCAL_OLLAMA') {
      try {
        const genResult = await this.ollamaClient.generate(prompt);
        rawText = genResult.text;
        promptTokens = genResult.promptTokens;
        completionTokens = genResult.completionTokens;
        engineUsed = 'LOCAL_OLLAMA';
      } catch (ollamaErr) {
        generationError = ollamaErr.message;
        // Fallback to Golden record if dish belongs to presets
        if (golden) {
          const latencyMs = Math.round(performance.now() - t0);
          return {
            success: true,
            rawText: JSON.stringify(golden),
            parsedDish: golden,
            promptTokens: golden.tokensConsumed?.promptTokens || 0,
            completionTokens: golden.tokensConsumed?.completionTokens || 0,
            engineUsed: 'PRECACHED_GOLDEN',
            latencyMs,
            error: `Ollama unavailable (${ollamaErr.message}). Fallback to pre-cached golden record.`
          };
        }
      }
    } else if (this.mode === 'REMOTE_FALLBACK') {
      if (this.hfToken) {
        try {
          const hfResult = await this.hfClient.generate(prompt, this.hfToken);
          rawText = hfResult.text;
          promptTokens = hfResult.promptTokens;
          completionTokens = hfResult.completionTokens;
          engineUsed = 'HF_SERVERLESS';
        } catch (hfErr) {
          generationError = hfErr.message;
          if (golden) {
            const latencyMs = Math.round(performance.now() - t0);
            return {
              success: true,
              rawText: JSON.stringify(golden),
              parsedDish: golden,
              promptTokens: golden.tokensConsumed?.promptTokens || 0,
              completionTokens: golden.tokensConsumed?.completionTokens || 0,
              engineUsed: 'PRECACHED_GOLDEN',
              latencyMs,
              error: `Hugging Face unavailable (${hfErr.message}). Fallback to pre-cached golden record.`
            };
          }
        }
      } else {
        // No HF token provided in remote mode
        if (golden) {
          const latencyMs = Math.round(performance.now() - t0);
          return {
            success: true,
            rawText: JSON.stringify(golden),
            parsedDish: golden,
            promptTokens: golden.tokensConsumed?.promptTokens || 0,
            completionTokens: golden.tokensConsumed?.completionTokens || 0,
            engineUsed: 'PRECACHED_GOLDEN',
            latencyMs
          };
        }
        generationError = 'NO_INFERENCE_ENGINE: Remote Fallback requires HF_TOKEN or pre-cached culinary preset';
      }
    }

    const latencyMs = Math.round(performance.now() - t0);

    // If generation completely failed (e.g. network failure, timeout, or missing token)
    if (generationError && !rawText) {
      const fallbackCard = SchemaValidator.createFallbackDishCard(dish, '', generationError);
      return {
        success: false,
        rawText: '',
        parsedDish: fallbackCard,
        promptTokens: 0,
        completionTokens: 0,
        engineUsed,
        latencyMs,
        error: generationError
      };
    }

    // Sanitize and repair raw model output
    const sanitized = JsonSanitizer.sanitize(rawText);

    if (sanitized.success && sanitized.data) {
      const parsedDish = SchemaValidator.normalizeDishCard(sanitized.data, dish);
      parsedDish.status = 'ENRICHED';
      parsedDish.tokensConsumed = {
        promptTokens,
        completionTokens,
        totalTokens: promptTokens + completionTokens
      };

      return {
        success: true,
        rawText,
        parsedDish,
        promptTokens,
        completionTokens,
        engineUsed,
        latencyMs
      };
    }

    // Sanitization failed (extreme anomaly or empty/corrupted response)
    const fallbackCard = SchemaValidator.createFallbackDishCard(
      dish,
      rawText,
      sanitized.error || 'Failed to parse model output into valid culinary intelligence schema'
    );

    return {
      success: false,
      rawText,
      parsedDish: fallbackCard,
      promptTokens,
      completionTokens,
      engineUsed,
      latencyMs,
      error: sanitized.error || 'Malformed JSON output'
    };
  }

  /**
   * Localizes a narrative string on demand.
   * @param {string} dishId
   * @param {string} englishText
   * @param {'ja'|'zh'|'fr'} targetLang
   * @returns {Promise<string>}
   */
  async localizeNarrative(dishId, englishText, targetLang) {
    if (!englishText || !targetLang || targetLang === 'en') {
      return englishText;
    }

    // Check golden cache for pre-translated narrative
    const golden = getGoldenDishById(dishId);
    if (golden?.culturalNarrative && golden.culturalNarrative[targetLang]) {
      return golden.culturalNarrative[targetLang];
    }

    const prompt = buildLocalizationPrompt(englishText, targetLang);

    try {
      if (this.mode === 'LOCAL_OLLAMA') {
        const result = await this.ollamaClient.generate(prompt, { temperature: 0.3 });
        return result.text.trim() || englishText;
      }
      if (this.mode === 'REMOTE_FALLBACK' && this.hfToken) {
        const result = await this.hfClient.generate(prompt, this.hfToken, { temperature: 0.3 });
        return result.text.trim() || englishText;
      }
    } catch {
      // Graceful fallback to English narrative if translation fails
    }

    return englishText;
  }
}
