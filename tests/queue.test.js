/**
 * RasaLore AI - FIFO Queue & Failure Isolation Integration Tests
 * Validates sequential execution (concurrency = 1), per-dish failure isolation, and single-dish retry.
 */

import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { FifoQueueManager } from '../src/queue/fifo-queue.js';
import { SchemaValidator } from '../src/parsers/schema-validator.js';

describe('FifoQueueManager & Failure Isolation Integration Tests', () => {

  it('Scenario 1: Processes multi-dish requests in strict sequential FIFO order (concurrency = 1)', async () => {
    const executionLog = [];
    let concurrentOperations = 0;
    let maxConcurrencyObserved = 0;

    // Mock InferenceAdapter that records timing and asserts single concurrency
    const mockAdapter = {
      async enrichDish({ dish }) {
        concurrentOperations++;
        if (concurrentOperations > maxConcurrencyObserved) {
          maxConcurrencyObserved = concurrentOperations;
        }

        executionLog.push(`START:${dish.id}`);
        // Simulate async model latency
        await new Promise(resolve => setTimeout(resolve, 20));

        executionLog.push(`FINISH:${dish.id}`);
        concurrentOperations--;

        return {
          success: true,
          rawText: JSON.stringify({
            originalName: dish.name,
            culturalNarrative: { en: `Cultural heritage of ${dish.name}` },
            flavorProfile: {
              descriptors: ['Aromatic', 'Savory'],
              primaryTaste: 'Savory',
              spiceLevel: 'Mild'
            },
            allergenFlags: [],
            dietaryTags: ['Halal-Friendly'],
            requiresKitchenVerification: false
          }),
          parsedDish: SchemaValidator.normalizeDishCard({
            id: dish.id,
            originalName: dish.name,
            culturalNarrative: { en: `Cultural heritage of ${dish.name}` },
            flavorProfile: {
              descriptors: ['Aromatic', 'Savory'],
              primaryTaste: 'Savory',
              spiceLevel: 'Mild'
            },
            allergenFlags: [],
            dietaryTags: ['Halal-Friendly'],
            requiresKitchenVerification: false
          }, dish),
          promptTokens: 100,
          completionTokens: 80,
          engineUsed: 'LOCAL_OLLAMA',
          latencyMs: 20
        };
      }
    };

    const queueManager = new FifoQueueManager(mockAdapter, { delayBetweenMs: 5 });

    const dishesToEnqueue = [
      { id: 'dish-1', name: 'Soto Betawi', rawIngredients: 'beef, coconut milk, lemongrass' },
      { id: 'dish-2', name: 'Nasi Liwet', rawIngredients: 'rice, coconut milk, lemongrass, bay leaves' },
      { id: 'dish-3', name: 'Gudeg Yu Djum', rawIngredients: 'young jackfruit, palm sugar, eggs' }
    ];

    queueManager.enqueue(dishesToEnqueue);
    const results = await queueManager.start();

    // Verify concurrency was strictly 1 at all times
    assert.equal(maxConcurrencyObserved, 1, 'Concurrency must strictly remain 1');

    // Verify sequential execution order
    assert.deepEqual(
      executionLog,
      [
        'START:dish-1',
        'FINISH:dish-1',
        'START:dish-2',
        'FINISH:dish-2',
        'START:dish-3',
        'FINISH:dish-3'
      ],
      'Dishes must execute in sequential FIFO order'
    );

    // Verify all 3 dishes are enriched
    assert.equal(results.length, 3);
    assert.equal(results[0].status, 'ENRICHED');
    assert.equal(results[1].status, 'ENRICHED');
    assert.equal(results[2].status, 'ENRICHED');
  });

  it('Scenario 2: Single-dish failure is isolated to FAILED_ANOMALY without freezing remaining queue', async () => {
    const processedDishes = [];

    // Mock InferenceAdapter where dish-2 synthetically throws a network error / timeout
    const mockAdapter = {
      async enrichDish({ dish }) {
        processedDishes.push(dish.id);

        if (dish.id === 'dish-2-fail') {
          // Synthetic failure: model timeout or parsing exception
          throw new Error('ETIMEDOUT: Ollama model generation timed out after 15000ms');
        }

        return {
          success: true,
          rawText: JSON.stringify({
            originalName: dish.name,
            culturalNarrative: { en: `Rich narrative for ${dish.name}` },
            flavorProfile: {
              descriptors: ['Flavorful'],
              primaryTaste: 'Rich',
              spiceLevel: 'None'
            },
            allergenFlags: [],
            dietaryTags: ['Heritage'],
            requiresKitchenVerification: false
          }),
          parsedDish: SchemaValidator.normalizeDishCard({
            id: dish.id,
            originalName: dish.name,
            culturalNarrative: { en: `Rich narrative for ${dish.name}` },
            flavorProfile: {
              descriptors: ['Flavorful'],
              primaryTaste: 'Rich',
              spiceLevel: 'None'
            },
            allergenFlags: [],
            dietaryTags: ['Heritage'],
            requiresKitchenVerification: false
          }, dish),
          promptTokens: 120,
          completionTokens: 90,
          engineUsed: 'LOCAL_OLLAMA',
          latencyMs: 15
        };
      }
    };

    const queueManager = new FifoQueueManager(mockAdapter, { delayBetweenMs: 5 });

    queueManager.enqueue([
      { id: 'dish-1-ok', name: 'Rendang Padang', rawIngredients: 'beef, coconut milk, chili' },
      { id: 'dish-2-fail', name: 'Corrupted Dish Payload', rawIngredients: 'unknown roots' },
      { id: 'dish-3-ok', name: 'Ayam Betutu', rawIngredients: 'chicken, bumbu genep' }
    ]);

    const results = await queueManager.start();

    // Verify all 3 dishes were attempted in order
    assert.deepEqual(processedDishes, ['dish-1-ok', 'dish-2-fail', 'dish-3-ok']);

    // Verify Dish #1 succeeded
    assert.equal(results[0].id, 'dish-1-ok');
    assert.equal(results[0].status, 'ENRICHED');

    // Verify Dish #2 failed gracefully into FAILED_ANOMALY
    assert.equal(results[1].id, 'dish-2-fail');
    assert.equal(results[1].status, 'FAILED_ANOMALY');
    assert.match(results[1].errorMessage, /ETIMEDOUT/);
    assert.equal(results[1].requiresKitchenVerification, true);

    // Verify Dish #3 was NOT aborted and succeeded
    assert.equal(results[2].id, 'dish-3-ok');
    assert.equal(results[2].status, 'ENRICHED');
  });

  it('Scenario 3: Retrying failed dish updates only that card without re-running other dishes', async () => {
    let dish2Attempts = 0;
    let dish1Runs = 0;
    let dish3Runs = 0;

    const mockAdapter = {
      async enrichDish({ dish }) {
        if (dish.id === 'dish-1') dish1Runs++;
        if (dish.id === 'dish-3') dish3Runs++;

        if (dish.id === 'dish-2') {
          dish2Attempts++;
          if (dish2Attempts === 1) {
            // First attempt fails
            return {
              success: false,
              rawText: 'MALFORMED OUTPUT NO BRACES',
              parsedDish: SchemaValidator.createFallbackDishCard(dish, 'MALFORMED OUTPUT', 'Syntax Error'),
              promptTokens: 50,
              completionTokens: 20,
              engineUsed: 'LOCAL_OLLAMA',
              latencyMs: 10,
              error: 'Syntax Error'
            };
          }
          // Second attempt (retry) succeeds!
          return {
            success: true,
            rawText: JSON.stringify({
              originalName: 'Pempek Palembang',
              culturalNarrative: { en: 'Traditional fish cake in savory sweet-sour cuko broth.' },
              flavorProfile: {
                descriptors: ['Savory Mackerel', 'Tangy Tamarind'],
                primaryTaste: 'Tangy, Savory & Spicy',
                spiceLevel: 'Medium'
              },
              allergenFlags: [{ allergen: 'Fish', severity: 'CRITICAL_WARNING', sourceIngredient: 'mackerel', isImplicit: false, advisoryNote: 'Contains fish' }],
              dietaryTags: ['Pescatarian'],
              requiresKitchenVerification: false
            }),
            parsedDish: SchemaValidator.normalizeDishCard({
              id: dish.id,
              originalName: 'Pempek Palembang',
              culturalNarrative: { en: 'Traditional fish cake in savory sweet-sour cuko broth.' },
              flavorProfile: {
                descriptors: ['Savory Mackerel', 'Tangy Tamarind'],
                primaryTaste: 'Tangy, Savory & Spicy',
                spiceLevel: 'Medium'
              },
              allergenFlags: [{ allergen: 'Fish', severity: 'CRITICAL_WARNING', sourceIngredient: 'mackerel', isImplicit: false, advisoryNote: 'Contains fish' }],
              dietaryTags: ['Pescatarian'],
              requiresKitchenVerification: false
            }, dish),
            promptTokens: 110,
            completionTokens: 95,
            engineUsed: 'LOCAL_OLLAMA',
            latencyMs: 12
          };
        }

        return {
          success: true,
          rawText: '{}',
          parsedDish: SchemaValidator.normalizeDishCard({}, dish),
          promptTokens: 50,
          completionTokens: 50,
          engineUsed: 'LOCAL_OLLAMA',
          latencyMs: 10
        };
      }
    };

    const queueManager = new FifoQueueManager(mockAdapter, { delayBetweenMs: 2 });

    queueManager.enqueue([
      { id: 'dish-1', name: 'Dish One' },
      { id: 'dish-2', name: 'Pempek Palembang', rawIngredients: 'mackerel, tapioca, vinegar, chili' },
      { id: 'dish-3', name: 'Dish Three' }
    ]);

    await queueManager.start();

    // Verify initial state
    assert.equal(queueManager.getDish('dish-2').status, 'FAILED_ANOMALY');
    assert.equal(dish1Runs, 1);
    assert.equal(dish2Attempts, 1);
    assert.equal(dish3Runs, 1);

    // Now trigger isolated single-dish retry
    const retryResult = await queueManager.retryDish('dish-2');

    // Verify Dish #2 is now ENRICHED
    assert.equal(retryResult.status, 'ENRICHED');
    assert.equal(queueManager.getDish('dish-2').status, 'ENRICHED');
    assert.equal(dish2Attempts, 2);

    // Verify Dish #1 and Dish #3 were NEVER re-run
    assert.equal(dish1Runs, 1, 'Dish 1 must not be re-executed during Dish 2 retry');
    assert.equal(dish3Runs, 1, 'Dish 3 must not be re-executed during Dish 2 retry');
  });

  it('Scenario 4: Emits accurate progress events throughout lifecycle', async () => {
    const progressEvents = [];

    const mockAdapter = {
      async enrichDish({ dish }) {
        return {
          success: true,
          rawText: '{}',
          parsedDish: SchemaValidator.normalizeDishCard({ originalName: dish.name }, dish),
          promptTokens: 10,
          completionTokens: 10,
          engineUsed: 'LOCAL_OLLAMA',
          latencyMs: 5
        };
      }
    };

    const queueManager = new FifoQueueManager(mockAdapter, { delayBetweenMs: 2 });
    queueManager.onProgress(event => {
      progressEvents.push({
        dishId: event.dishId,
        status: event.status,
        index: event.index,
        total: event.total
      });
    });

    queueManager.enqueue([
      { id: 'p-1', name: 'Bakso Malang' },
      { id: 'p-2', name: 'Mie Aceh' }
    ]);

    await queueManager.start();

    // Verify the lifecycle event types
    const eventStatuses = progressEvents.map(e => `${e.dishId}:${e.status}`);
    assert.deepEqual(eventStatuses, [
      'p-1:QUEUED',
      'p-2:QUEUED',
      'p-1:PROCESSING',
      'p-1:ENRICHED',
      'p-2:PROCESSING',
      'p-2:ENRICHED'
    ]);

    // Verify indices and totals
    const processingEvent1 = progressEvents.find(e => e.dishId === 'p-1' && e.status === 'PROCESSING');
    assert.equal(processingEvent1.index, 1);
    assert.equal(processingEvent1.total, 2);

    const enrichedEvent2 = progressEvents.find(e => e.dishId === 'p-2' && e.status === 'ENRICHED');
    assert.equal(enrichedEvent2.index, 2);
    assert.equal(enrichedEvent2.total, 2);
  });
});
