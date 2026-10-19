/**
 * RasaLore AI - Schema Validator & Model Hydrator
 * Validates, normalizes, and constructs DishCardModel objects according to specification.
 */

export const VALID_ALLERGENS = [
  'Crustaceans',
  'TreeNuts',
  'Peanuts',
  'Gluten',
  'Soy',
  'Dairy',
  'Egg',
  'Fish',
  'Sesame',
  'Mollusks',
  'Sulfites'
];

export const VALID_SEVERITIES = ['CRITICAL_WARNING', 'DIETARY_NOTICE'];
export const VALID_SPICE_LEVELS = ['None', 'Mild', 'Medium', 'Hot', 'Fiery'];
export const VALID_STATUSES = ['IDLE', 'QUEUED', 'PROCESSING', 'ENRICHED', 'FAILED_ANOMALY'];

export class SchemaValidator {
  /**
   * Validates whether an object strictly adheres to DishCardModel.
   * @param {unknown} data
   * @returns {{ isValid: boolean, errors: string[] }}
   */
  static validateDishCard(data) {
    const errors = [];

    if (!data || typeof data !== 'object') {
      return { isValid: false, errors: ['Input must be a non-null object'] };
    }

    if (!data.id || typeof data.id !== 'string') {
      errors.push('Missing or invalid string field: id');
    }

    if (!data.originalName || typeof data.originalName !== 'string') {
      errors.push('Missing or invalid string field: originalName');
    }

    if (!data.culturalNarrative || typeof data.culturalNarrative !== 'object') {
      errors.push('Missing culturalNarrative object');
    } else if (!data.culturalNarrative.en || typeof data.culturalNarrative.en !== 'string') {
      errors.push('culturalNarrative must contain at least an English (en) narrative string');
    }

    if (!data.flavorProfile || typeof data.flavorProfile !== 'object') {
      errors.push('Missing flavorProfile object');
    } else {
      if (!Array.isArray(data.flavorProfile.descriptors)) {
        errors.push('flavorProfile.descriptors must be an array of strings');
      }
      if (!data.flavorProfile.primaryTaste || typeof data.flavorProfile.primaryTaste !== 'string') {
        errors.push('flavorProfile.primaryTaste must be a non-empty string');
      }
      if (!VALID_SPICE_LEVELS.includes(data.flavorProfile.spiceLevel)) {
        errors.push(`flavorProfile.spiceLevel must be one of: ${VALID_SPICE_LEVELS.join(', ')}`);
      }
    }

    if (!Array.isArray(data.allergenFlags)) {
      errors.push('allergenFlags must be an array');
    } else {
      data.allergenFlags.forEach((flag, idx) => {
        if (!flag || typeof flag !== 'object') {
          errors.push(`allergenFlags[${idx}] must be an object`);
          return;
        }
        if (!VALID_ALLERGENS.includes(flag.allergen)) {
          errors.push(`allergenFlags[${idx}].allergen must be a valid allergen type`);
        }
        if (!VALID_SEVERITIES.includes(flag.severity)) {
          errors.push(`allergenFlags[${idx}].severity must be CRITICAL_WARNING or DIETARY_NOTICE`);
        }
        if (typeof flag.isImplicit !== 'boolean') {
          errors.push(`allergenFlags[${idx}].isImplicit must be a boolean`);
        }
      });
    }

    if (!Array.isArray(data.dietaryTags)) {
      errors.push('dietaryTags must be an array');
    }

    if (typeof data.requiresKitchenVerification !== 'boolean') {
      errors.push('requiresKitchenVerification must be a boolean');
    }

    if (data.status && !VALID_STATUSES.includes(data.status)) {
      errors.push(`status must be one of: ${VALID_STATUSES.join(', ')}`);
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  /**
   * Validates an array of items to ensure complete conformance with DishCardModel[].
   * Adheres to AC-012 for POS JSON export verification.
   * @param {unknown} items
   * @returns {{ isValid: boolean, count: number, errors: string[] }}
   */
  static validateDishCards(items) {
    if (!Array.isArray(items)) {
      return {
        isValid: false,
        count: 0,
        errors: ['Expected an array of DishCardModel objects']
      };
    }

    const allErrors = [];
    items.forEach((item, index) => {
      const result = SchemaValidator.validateDishCard(item);
      if (!result.isValid) {
        allErrors.push(`[Dish Index ${index} (${item?.originalName || 'unknown'})]: ${result.errors.join('; ')}`);
      }
    });

    return {
      isValid: allErrors.length === 0,
      count: items.length,
      errors: allErrors
    };
  }

  /**
   * Normalizes model output or partial data into a fully hydrated DishCardModel.
   * @param {object} raw
   * @param {object} [fallbackInput={}]
   * @returns {object} Normalized DishCardModel
   */
  static normalizeDishCard(raw, fallbackInput = {}) {
    const rawObj = (raw && typeof raw === 'object') ? raw : {};

    const id = String(rawObj.id || fallbackInput.id || `dish-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`);
    const originalName = String(rawObj.originalName || rawObj.dishName || rawObj.name || fallbackInput.name || 'Untitled Dish');
    const regionalOrigin = String(rawObj.regionalOrigin || fallbackInput.regionalOrigin || 'Regional Heritage');
    const priceText = String(rawObj.priceText || fallbackInput.priceText || '');
    const rawIngredients = String(rawObj.rawIngredients || fallbackInput.rawIngredients || '');

    // Cultural Narrative normalization
    let culturalNarrative = { en: 'Traditional culinary preparation.' };
    if (typeof rawObj.culturalNarrative === 'string') {
      culturalNarrative = { en: rawObj.culturalNarrative };
    } else if (rawObj.culturalNarrative && typeof rawObj.culturalNarrative === 'object') {
      culturalNarrative = {
        en: String(rawObj.culturalNarrative.en || 'Traditional culinary preparation.'),
        ...(rawObj.culturalNarrative.ja ? { ja: String(rawObj.culturalNarrative.ja) } : {}),
        ...(rawObj.culturalNarrative.zh ? { zh: String(rawObj.culturalNarrative.zh) } : {}),
        ...(rawObj.culturalNarrative.fr ? { fr: String(rawObj.culturalNarrative.fr) } : {})
      };
    }

    // Flavor Profile normalization
    const rawFp = rawObj.flavorProfile || {};
    const descriptors = Array.isArray(rawFp.descriptors) && rawFp.descriptors.length > 0
      ? rawFp.descriptors.map(d => String(d).trim()).filter(Boolean)
      : ['Aromatic Spices', 'Rich Umami'];
    const primaryTaste = String(rawFp.primaryTaste || 'Deep & Savory');
    const spiceLevel = VALID_SPICE_LEVELS.includes(rawFp.spiceLevel) ? rawFp.spiceLevel : 'Mild';

    // Allergen Flags normalization
    const allergenFlags = Array.isArray(rawObj.allergenFlags)
      ? rawObj.allergenFlags.map(f => ({
          allergen: VALID_ALLERGENS.includes(f.allergen) ? f.allergen : 'Sulfites',
          severity: VALID_SEVERITIES.includes(f.severity) ? f.severity : 'DIETARY_NOTICE',
          sourceIngredient: String(f.sourceIngredient || 'Traditional base'),
          isImplicit: typeof f.isImplicit === 'boolean' ? f.isImplicit : true,
          advisoryNote: String(f.advisoryNote || 'Verify with kitchen for culinary sensitivities.')
        }))
      : [];

    // Dietary Tags normalization
    const dietaryTags = Array.isArray(rawObj.dietaryTags)
      ? rawObj.dietaryTags.map(t => String(t).trim()).filter(Boolean)
      : ['Regional Heritage'];

    // Kitchen verification is required if ingredients are empty or explicitly flagged
    const hasSparseIngredients = !rawIngredients || rawIngredients.trim().length === 0;
    const requiresKitchenVerification = typeof rawObj.requiresKitchenVerification === 'boolean'
      ? rawObj.requiresKitchenVerification
      : hasSparseIngredients;

    const status = VALID_STATUSES.includes(rawObj.status) ? rawObj.status : 'ENRICHED';

    return {
      id,
      originalName,
      regionalOrigin,
      priceText,
      rawIngredients,
      culturalNarrative,
      flavorProfile: {
        descriptors,
        primaryTaste,
        spiceLevel
      },
      allergenFlags,
      dietaryTags,
      requiresKitchenVerification,
      status,
      ...(rawObj.rawResponseText ? { rawResponseText: String(rawObj.rawResponseText) } : {}),
      ...(rawObj.errorMessage ? { errorMessage: String(rawObj.errorMessage) } : {}),
      ...(rawObj.tokensConsumed ? { tokensConsumed: rawObj.tokensConsumed } : {})
    };
  }

  /**
   * Constructs an isolated FAILED_ANOMALY DishCardModel for non-recoverable responses.
   * @param {object} dishInput - Original dish input
   * @param {string} rawResponseText - Captured raw text
   * @param {string} errorMessage - Error description
   * @returns {object} DishCardModel with FAILED_ANOMALY status
   */
  static createFallbackDishCard(dishInput = {}, rawResponseText = '', errorMessage = 'Failed to parse model output') {
    return {
      id: dishInput.id || `dish-anomaly-${Date.now()}`,
      originalName: dishInput.name || 'Unknown Dish',
      regionalOrigin: dishInput.regionalOrigin || 'Regional Heritage',
      priceText: dishInput.priceText || '',
      rawIngredients: dishInput.rawIngredients || '',
      culturalNarrative: {
        en: 'Culinary analysis could not be parsed. The original ingredients remain available for inspection.'
      },
      flavorProfile: {
        descriptors: ['Awaiting Audit'],
        primaryTaste: 'Unspecified',
        spiceLevel: 'None'
      },
      allergenFlags: [],
      dietaryTags: ['Audit Required'],
      requiresKitchenVerification: true,
      status: 'FAILED_ANOMALY',
      rawResponseText: String(rawResponseText || ''),
      errorMessage: String(errorMessage)
    };
  }
}
