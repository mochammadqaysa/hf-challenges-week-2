/**
 * RasaLore AI - Google Gemma 2 Prompt Engineering
 * Structured few-shot prompt templates optimized for Google Gemma 2 2B / 9B.
 */

/**
 * Builds the structured culinary historian and allergen intelligence prompt for Gemma 2.
 * @param {object} dish - Dish input data
 * @param {string} dish.name - Dish name
 * @param {string} [dish.regionalOrigin] - Region of origin
 * @param {string} [dish.rawIngredients] - Raw kitchen ingredients or notes
 * @param {string} [dish.priceText] - Price string
 * @returns {string} Fully formatted prompt for Gemma 2.
 */
export function buildCulinaryEnrichmentPrompt(dish) {
  const dishName = dish.name || dish.originalName || 'Traditional Dish';
  const regionalOrigin = dish.regionalOrigin || 'Regional Heritage';
  const rawIngredients = dish.rawIngredients || '';
  const priceText = dish.priceText || '';

  return `<start_of_turn>user
You are an elite Southeast Asian Culinary Historian, Cultural Menu Localization Expert, and Food Safety Allergen Specialist.
Analyze the traditional culinary dish described below and generate a rich cultural narrative, sensory flavor profile, and proactive allergen intelligence audit.

Input Dish Details:
- Name: "${dishName}"
- Regional Origin: "${regionalOrigin}"
- Raw Kitchen Ingredients: "${rawIngredients || 'Not provided'}"
${priceText ? `- Price: "${priceText}"` : ''}

Culinary Guidelines:
1. Cultural Narrative: Write a 1-2 sentence evocative, culturally respectful English narrative explaining the heritage, traditional preparation, and cooking method. NEVER use cheap, literal machine translations (e.g., do NOT translate "Rawon" as "Black Soup", "Soto" as "Yellow Broth", or "Nasi Goreng" as "Fried Rice").
2. Flavor Profile:
   - Descriptors: 3 to 5 high-impact sensory aroma and taste tags (e.g., "Aromatic Galangal", "Smoky Coconut", "Rich Umami").
   - Primary Taste: Summarize the primary flavor balance (e.g., "Deeply Fragrant, Savory & Earthy").
   - Spice Level: Exactly one of: "None", "Mild", "Medium", "Hot", "Fiery".
3. Proactive Allergen Intelligence:
   - Detect both EXPLICIT and IMPLICIT (hidden) regional allergens from common Indonesian and Southeast Asian spice bases:
     * Fermented shrimp paste (terasi, belacan, petis udang) -> Allergen: "Crustaceans", Severity: "CRITICAL_WARNING", isImplicit: true.
     * Candlenut (kemiri) -> Allergen: "TreeNuts", Severity: "CRITICAL_WARNING", isImplicit: true.
     * Sweet soy sauce (kecap manis) or wheat noodles -> Allergen: "Soy" and "Gluten", isImplicit: false or true.
     * Peanut sauce (bumbu kacang) -> Allergen: "Peanuts", Severity: "CRITICAL_WARNING", isImplicit: false.
     * Fish sauce, petis ikan -> Allergen: "Fish", Severity: "CRITICAL_WARNING".
     * Salted egg, egg noodles -> Allergen: "Egg".
   - Supported Allergen Types: "Crustaceans", "TreeNuts", "Peanuts", "Gluten", "Soy", "Dairy", "Egg", "Fish", "Sesame", "Mollusks", "Sulfites".
   - Severity: "CRITICAL_WARNING" for life-threatening/common anaphylactic triggers, or "DIETARY_NOTICE" for mild or cross-contact notes.
4. Dietary Tags: Include valid tags such as "Halal-Friendly", "Vegetarian", "Vegan", "Pescatarian", "Nut-Free", "Gluten-Free", "Dairy-Free".
5. Kitchen Verification: Set "requiresKitchenVerification": true if raw ingredients are empty, sparse, or ambiguous.

Example Output Format:
{
  "originalName": "Rawon Surabaya",
  "regionalOrigin": "Surabaya, East Java",
  "culturalNarrative": {
    "en": "A legendary East Javanese heritage beef soup slow-simmered with fermented black kluwek nuts, lemongrass, and aromatic herbs, creating an iconic pitch-black, earthy broth."
  },
  "flavorProfile": {
    "descriptors": ["Earthy Kluwek", "Aromatic Lemongrass", "Savory Beef Umami", "Warm Ginger"],
    "primaryTaste": "Deep, Earthy, Rich & Savory",
    "spiceLevel": "Mild"
  },
  "allergenFlags": [
    {
      "allergen": "Crustaceans",
      "severity": "CRITICAL_WARNING",
      "sourceIngredient": "sambal terasi",
      "isImplicit": true,
      "advisoryNote": "Accompanied by traditional sambal terasi containing implicit fermented shrimp paste."
    },
    {
      "allergen": "TreeNuts",
      "severity": "CRITICAL_WARNING",
      "sourceIngredient": "candlenut (kemiri)",
      "isImplicit": true,
      "advisoryNote": "Candlenut is ground into the base bumbu paste as a traditional thickening agent."
    }
  ],
  "dietaryTags": ["Halal-Friendly", "Dairy-Free"],
  "requiresKitchenVerification": false
}

Output strictly valid raw JSON only. Do not enclose in markdown code fences or add conversational text.
<end_of_turn>
<start_of_turn>model
`;
}

/**
 * Builds the narrative localization prompt for translating English cultural narratives.
 * @param {string} englishNarrative
 * @param {'ja'|'zh'|'fr'} targetLang
 * @returns {string}
 */
export function buildLocalizationPrompt(englishNarrative, targetLang) {
  const langNames = {
    ja: 'Japanese (日本語)',
    zh: 'Simplified Chinese (简体中文)',
    fr: 'French (Français)'
  };

  const langTarget = langNames[targetLang] || targetLang;

  return `<start_of_turn>user
Translate the following culinary cultural narrative into elegant, natural, and evocative ${langTarget}.
Keep culinary terminology authentic while ensuring local diners understand the sensory textures and cooking heritage.

English Narrative:
"${englishNarrative}"

Output strictly the translated narrative string. Do not include quotes, markdown backticks, or commentary.
<end_of_turn>
<start_of_turn>model
`;
}
