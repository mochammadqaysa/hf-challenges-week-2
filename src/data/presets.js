/**
 * RasaLore AI - Curated Regional Presets Dataset
 * Pre-configured culinary menus for immediate evaluation (< 500ms).
 */

export const CULINARY_PRESETS = [
  {
    id: 'bali-bistro',
    name: 'Bali Tropical Bistro',
    tagline: 'Heritage Balinese Ceremonial & Coastal Flavors',
    description: 'Traditional Balinese heritage recipes with aromatic bumbu genep, coconut, and coastal spice notes.',
    region: 'Bali, Indonesia',
    icon: '🌴',
    dishes: [
      {
        id: 'bali-1',
        name: 'Bebek Betutu',
        regionalOrigin: 'Gianyar, Bali',
        priceText: 'IDR 125.000',
        rawIngredients: 'duck, cassava leaves, lemongrass, shallots, garlic, red chili, candlenut, turmeric, ginger, galangal, shrimp paste (terasi)'
      },
      {
        id: 'bali-2',
        name: 'Sate Lilit Ikan',
        regionalOrigin: 'Jimbaran, Bali',
        priceText: 'IDR 65.000',
        rawIngredients: 'minced Spanish mackerel, grated coconut, lemongrass stalks, kaffir lime leaves, shallots, garlic, candlenut, chili'
      },
      {
        id: 'bali-3',
        name: 'Sambal Matah',
        regionalOrigin: 'Denpasar, Bali',
        priceText: 'IDR 25.000',
        rawIngredients: "shallots, bird's eye chili, lemongrass heart, kaffir lime leaves, warm coconut oil, shrimp paste (terasi), calamansi lime juice"
      },
      {
        id: 'bali-4',
        name: 'Lawar Ayam',
        regionalOrigin: 'Ubud, Bali',
        priceText: 'IDR 48.000',
        rawIngredients: 'shredded chicken breast, young jackfruit, long beans, spiced grated coconut, galangal, fried shallots, candlenut, kaffir lime'
      }
    ]
  },
  {
    id: 'warung-nusantara',
    name: 'Warung Nusantara Autentik',
    tagline: 'Archipelagic Heritage Broths & Slow-Cooked Umami',
    description: 'Iconic archipelagic comfort classics celebrating rich slow-braised broths and deep umami.',
    region: 'Java & Sumatra, Indonesia',
    icon: '🍲',
    dishes: [
      {
        id: 'nusantara-1',
        name: 'Rawon Surabaya',
        regionalOrigin: 'Surabaya, East Java',
        priceText: 'IDR 65.000',
        rawIngredients: 'beef shank, kluwek nut, lemongrass, galangal, shallots, garlic, bean sprouts, salted duck egg, sambal terasi'
      },
      {
        id: 'nusantara-2',
        name: 'Rendang Daging Sapi',
        regionalOrigin: 'Minangkabau, West Sumatra',
        priceText: 'IDR 85.000',
        rawIngredients: 'beef chuck, rich coconut milk, galangal, toasted grated coconut (kerisik), lemongrass, kaffir lime leaves, turmeric leaves, shallots, garlic, red chili'
      },
      {
        id: 'nusantara-3',
        name: 'Soto Betawi',
        regionalOrigin: 'Jakarta (Betawi)',
        priceText: 'IDR 55.000',
        rawIngredients: 'beef brisket, aromatic broth infused with fresh cow milk and coconut milk, tomatoes, fried potato wedges, emping melinjo crackers, sweet soy sauce (kecap manis)'
      },
      {
        id: 'nusantara-4',
        name: 'Gado-Gado Batavia',
        regionalOrigin: 'Jakarta (Betawi)',
        priceText: 'IDR 40.000',
        rawIngredients: 'blanched cabbage, long beans, bean sprouts, fried tofu, artisanal tempeh, hard-boiled egg, roasted peanut dressing, emping crackers'
      }
    ]
  },
  {
    id: 'specialty-coffee',
    name: 'Specialty Coffee & Heritage Sweets',
    tagline: 'Single-Origin Terroirs & Nostalgic Street Delicacies',
    description: 'Third-wave Indonesian single-origin coffees and artisanal heritage street delicacies.',
    region: 'Archipelago, Indonesia',
    icon: '☕',
    dishes: [
      {
        id: 'coffee-1',
        name: 'Kopi Tubruk Robusta Dampit',
        regionalOrigin: 'Dampit, East Java',
        priceText: 'IDR 28.000',
        rawIngredients: 'coarse Dampit robusta grounds, boiling volcanic spring water, raw cane sugar'
      },
      {
        id: 'coffee-2',
        name: 'Klepon Pandan Cake',
        regionalOrigin: 'Central Java',
        priceText: 'IDR 32.000',
        rawIngredients: 'glutinous rice flour, fragrant pandan leaf extract, molten organic aren palm sugar, freshly steamed grated coconut'
      },
      {
        id: 'coffee-3',
        name: 'Pisang Goreng Madu Wijen',
        regionalOrigin: 'Bandung, West Java',
        priceText: 'IDR 30.000',
        rawIngredients: 'ripe Raja bananas, wheat flour batter, wild forest honey glaze, toasted white sesame seeds, coconut oil'
      },
      {
        id: 'coffee-4',
        name: 'Es Kopi Susu Gula Aren',
        regionalOrigin: 'Jakarta Urban',
        priceText: 'IDR 35.000',
        rawIngredients: 'double espresso shot, fresh dairy milk, organic aren liquid palm sugar, crystal ice cubes'
      }
    ]
  }
];
