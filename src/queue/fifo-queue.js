/**
 * RasaLore AI - Sequential FIFO Queue Manager
 * Processes dishes sequentially (concurrency = 1) with per-dish failure isolation.
 */

import { SchemaValidator } from '../parsers/schema-validator.js';

export class FifoQueueManager {
  /**
   * @param {object} inferenceAdapter - Instance of InferenceAdapter (IInferenceAdapter)
   * @param {object} [options={}]
   * @param {number} [options.delayBetweenMs=50] - Optional delay between dishes for UI smoothing
   */
  constructor(inferenceAdapter, options = {}) {
    if (!inferenceAdapter) {
      throw new Error('FifoQueueManager requires an inferenceAdapter instance');
    }

    this.adapter = inferenceAdapter;
    this.delayBetweenMs = options.delayBetweenMs ?? 50;

    /** @type {Array<object>} Internal queue of DishInput items */
    this.queue = [];

    /** @type {Map<string, object>} Stores latest DishCardModel for each dish */
    this.dishCards = new Map();

    /** @type {Map<string, object>} Stores original DishInput for retry capability */
    this.originalInputs = new Map();

    /** @type {Array<Function>} */
    this.callbacks = [];

    this.isProcessing = false;
    this.isStopped = false;
    this.currentIndex = 0;
    this.totalBatchSize = 0;
  }

  /**
   * Registers a progress callback.
   * @param {Function} callback
   * @returns {Function} Unsubscribe function
   */
  onProgress(callback) {
    if (typeof callback === 'function') {
      this.callbacks.push(callback);
    }
    return () => {
      this.callbacks = this.callbacks.filter(cb => cb !== callback);
    };
  }

  /**
   * Emits progress event to all registered listeners.
   * @private
   * @param {object} event
   */
  emitProgress(event) {
    for (const cb of this.callbacks) {
      try {
        cb(event);
      } catch (err) {
        console.error('[FifoQueueManager] Progress callback error:', err);
      }
    }
  }

  /**
   * Enqueues one or more dishes into the FIFO queue.
   * @param {object|Array<object>} dishes - DishInput or DishInput[]
   */
  enqueue(dishes) {
    const list = Array.isArray(dishes) ? dishes : [dishes];

    for (const dish of list) {
      if (!dish || typeof dish !== 'object') continue;

      const id = dish.id || `dish-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
      const normalizedInput = {
        ...dish,
        id,
        name: dish.name || dish.originalName || 'Untitled Dish'
      };

      this.originalInputs.set(id, normalizedInput);
      this.queue.push(normalizedInput);

      // Create an initial placeholder card with QUEUED status
      const initialCard = {
        id,
        originalName: normalizedInput.name,
        regionalOrigin: normalizedInput.regionalOrigin || 'Regional Heritage',
        priceText: normalizedInput.priceText || '',
        rawIngredients: normalizedInput.rawIngredients || '',
        culturalNarrative: { en: 'Queued for cultural intelligence analysis...' },
        flavorProfile: {
          descriptors: ['Pending Analysis'],
          primaryTaste: 'Pending',
          spiceLevel: 'None'
        },
        allergenFlags: [],
        dietaryTags: [],
        requiresKitchenVerification: false,
        status: 'QUEUED'
      };

      this.dishCards.set(id, initialCard);

      this.emitProgress({
        dishId: id,
        index: this.dishCards.size,
        total: this.dishCards.size,
        status: 'QUEUED',
        result: initialCard
      });
    }

    this.totalBatchSize = this.dishCards.size;
  }

  /**
   * Starts sequential processing of the queue.
   * Concurrency is strictly 1 to avoid browser memory spikes and Ollama thread contention.
   * @returns {Promise<Array<object>>} Resolves with all processed dish cards
   */
  async start() {
    if (this.isProcessing) {
      return this.getAllDishes();
    }

    this.isProcessing = true;
    this.isStopped = false;
    this.totalBatchSize = this.dishCards.size;

    while (this.queue.length > 0 && !this.isStopped) {
      const currentInput = this.queue.shift();
      const dishId = currentInput.id;
      this.currentIndex++;

      // 1. Emit PROCESSING state
      const processingCard = {
        ...(this.dishCards.get(dishId) || currentInput),
        status: 'PROCESSING'
      };
      this.dishCards.set(dishId, processingCard);

      this.emitProgress({
        dishId,
        index: this.currentIndex,
        total: this.totalBatchSize,
        status: 'PROCESSING',
        result: processingCard
      });

      // 2. Perform isolated inference
      try {
        const response = await this.adapter.enrichDish({ dish: currentInput });

        if (response.success && response.parsedDish) {
          const enrichedCard = {
            ...response.parsedDish,
            status: 'ENRICHED'
          };
          this.dishCards.set(dishId, enrichedCard);

          this.emitProgress({
            dishId,
            index: this.currentIndex,
            total: this.totalBatchSize,
            status: 'ENRICHED',
            result: enrichedCard
          });
        } else {
          // LLM Anomaly or parsing error handled gracefully
          const rawText = response?.rawText || '';
          const errMsg = response?.error || 'Inference produced malformed output';
          const anomalyCard = response?.parsedDish?.status === 'FAILED_ANOMALY'
            ? response.parsedDish
            : SchemaValidator.createFallbackDishCard(currentInput, rawText, errMsg);

          this.dishCards.set(dishId, anomalyCard);

          this.emitProgress({
            dishId,
            index: this.currentIndex,
            total: this.totalBatchSize,
            status: 'FAILED_ANOMALY',
            result: anomalyCard,
            error: errMsg
          });
        }
      } catch (err) {
        // Uncaught network error, timeout, or unexpected runtime crash -> isolate to FAILED_ANOMALY
        const anomalyCard = SchemaValidator.createFallbackDishCard(
          currentInput,
          '',
          err.message || 'Unexpected queue processing error'
        );
        this.dishCards.set(dishId, anomalyCard);

        this.emitProgress({
          dishId,
          index: this.currentIndex,
          total: this.totalBatchSize,
          status: 'FAILED_ANOMALY',
          result: anomalyCard,
          error: err.message
        });
      }

      // Small delay between tasks for smooth UI event loop breathing
      if (this.delayBetweenMs > 0 && this.queue.length > 0) {
        await new Promise(resolve => setTimeout(resolve, this.delayBetweenMs));
      }
    }

    this.isProcessing = false;
    return this.getAllDishes();
  }

  /**
   * Retries an individual dish independently without clearing or restarting other dishes.
   * @param {string} dishId
   * @returns {Promise<object>} Resolves with updated DishCardModel
   */
  async retryDish(dishId) {
    const input = this.originalInputs.get(dishId) || this.dishCards.get(dishId);
    if (!input) {
      throw new Error(`Cannot retry dish: ID '${dishId}' not found in queue history`);
    }

    const dishInput = {
      id: dishId,
      name: input.name || input.originalName || 'Untitled Dish',
      regionalOrigin: input.regionalOrigin || 'Regional Heritage',
      rawIngredients: input.rawIngredients || '',
      priceText: input.priceText || ''
    };

    // Emit PROCESSING state for this specific dish
    const retryingCard = {
      ...(this.dishCards.get(dishId) || dishInput),
      status: 'PROCESSING',
      errorMessage: undefined
    };
    this.dishCards.set(dishId, retryingCard);

    this.emitProgress({
      dishId,
      index: this.currentIndex,
      total: this.totalBatchSize || 1,
      status: 'PROCESSING',
      result: retryingCard
    });

    try {
      const response = await this.adapter.enrichDish({ dish: dishInput });

      if (response.success && response.parsedDish) {
        const enrichedCard = {
          ...response.parsedDish,
          status: 'ENRICHED'
        };
        this.dishCards.set(dishId, enrichedCard);

        this.emitProgress({
          dishId,
          index: this.currentIndex,
          total: this.totalBatchSize || 1,
          status: 'ENRICHED',
          result: enrichedCard
        });

        return enrichedCard;
      } else {
        const rawText = response?.rawText || '';
        const errMsg = response?.error || 'Retry attempt produced malformed output';
        const anomalyCard = response?.parsedDish?.status === 'FAILED_ANOMALY'
          ? response.parsedDish
          : SchemaValidator.createFallbackDishCard(dishInput, rawText, errMsg);

        this.dishCards.set(dishId, anomalyCard);

        this.emitProgress({
          dishId,
          index: this.currentIndex,
          total: this.totalBatchSize || 1,
          status: 'FAILED_ANOMALY',
          result: anomalyCard,
          error: errMsg
        });

        return anomalyCard;
      }
    } catch (err) {
      const anomalyCard = SchemaValidator.createFallbackDishCard(
        dishInput,
        '',
        err.message || 'Retry attempt failed'
      );
      this.dishCards.set(dishId, anomalyCard);

      this.emitProgress({
        dishId,
        index: this.currentIndex,
        total: this.totalBatchSize || 1,
        status: 'FAILED_ANOMALY',
        result: anomalyCard,
        error: err.message
      });

      return anomalyCard;
    }
  }

  /**
   * Signals the queue to stop further items from processing.
   */
  stop() {
    this.isStopped = true;
  }

  /**
   * Returns all current dish cards in order of addition.
   * @returns {Array<object>}
   */
  getAllDishes() {
    return Array.from(this.dishCards.values());
  }

  /**
   * Retrieves a specific dish card by ID.
   * @param {string} dishId
   * @returns {object|null}
   */
  getDish(dishId) {
    return this.dishCards.get(dishId) || null;
  }

  /**
   * Resets the queue state.
   */
  clear() {
    this.stop();
    this.queue = [];
    this.dishCards.clear();
    this.originalInputs.clear();
    this.isProcessing = false;
    this.currentIndex = 0;
    this.totalBatchSize = 0;
  }
}
