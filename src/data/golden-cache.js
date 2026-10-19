/**
 * RasaLore AI - Pre-Cached Golden Responses
 * Validated, high-fidelity Google Gemma 2 responses for instant offline and remote evaluation.
 */

export const GOLDEN_CACHE = {
  // ==========================================
  // Preset 1: Bali Tropical Bistro
  // ==========================================
  'bali-1': {
    id: 'bali-1',
    presetId: 'bali-bistro',
    originalName: 'Bebek Betutu',
    regionalOrigin: 'Gianyar, Bali',
    priceText: 'IDR 125.000',
    rawIngredients: 'duck, cassava leaves, lemongrass, shallots, garlic, red chili, candlenut, turmeric, ginger, galangal, shrimp paste (terasi)',
    culturalNarrative: {
      en: 'A revered Balinese ceremonial dish featuring tender duck slow-braised and roasted for hours in traditional bumbu genep spice paste, wrapped tightly in aromatic banana and cassava leaves.',
      ja: '何時間もかけて伝統的なスパイスペースト（ブンブ・グネップ）でじっくりと煮込み、バナナの葉で包んで蒸し焼きにした、バリ島の伝統的な儀式用のアヒル料理です。',
      zh: '一道尊贵的巴厘岛传统节庆鸭肉料理，将鸭肉包裹在芳香的香蕉叶和木薯叶中，与秘制Bumbu Genep香料长时间慢炖慢烤，肉质酥烂入味。',
      fr: "Un plat de canard cérémoniel balinais emblématique, mijoté lentement puis rôti pendant des heures dans une pâte d'épices bumbu genep, enveloppé de feuilles de bananier parfumées."
    },
    flavorProfile: {
      descriptors: ['Aromatic Lemongrass', 'Smoky Galangal', 'Warm Turmeric', 'Savory Shallots'],
      primaryTaste: 'Deeply Fragrant, Savory & Earthy',
      spiceLevel: 'Medium'
    },
    allergenFlags: [
      {
        allergen: 'Crustaceans',
        severity: 'CRITICAL_WARNING',
        sourceIngredient: 'shrimp paste (terasi)',
        isImplicit: true,
        advisoryNote: 'Contains traditional fermented shrimp paste (terasi) ground into the base aromatic spice paste.'
      },
      {
        allergen: 'TreeNuts',
        severity: 'CRITICAL_WARNING',
        sourceIngredient: 'candlenut (kemiri)',
        isImplicit: true,
        advisoryNote: 'Contains candlenut (kemiri), an Indonesian tree nut used as a culinary thickening and richness agent.'
      }
    ],
    dietaryTags: ['Halal-Friendly', 'Gluten-Free', 'Dairy-Free'],
    requiresKitchenVerification: false,
    status: 'ENRICHED',
    tokensConsumed: {
      promptTokens: 462,
      completionTokens: 338,
      totalTokens: 800
    }
  },

  'bali-2': {
    id: 'bali-2',
    presetId: 'bali-bistro',
    originalName: 'Sate Lilit Ikan',
    regionalOrigin: 'Jimbaran, Bali',
    priceText: 'IDR 65.000',
    rawIngredients: 'minced Spanish mackerel, grated coconut, lemongrass stalks, kaffir lime leaves, shallots, garlic, candlenut, chili',
    culturalNarrative: {
      en: 'Coastal Balinese minced mackerel skewers blended with freshly grated coconut and aromatic lime leaves, hand-wrapped around fragrant lemongrass stalks and charcoal grilled.',
      ja: '新鮮なサワラのすり身に削りたてのココナッツとライムリーフを練り込み、レモングラスの茎に巻きつけて炭火で香ばしく焼き上げたバリ島の名物串焼きです。',
      zh: '巴厘岛海滨标志性鱼肉串，将新鲜马鲛鱼泥与鲜刨椰丝、青柠叶及香料混合，缠绕在芳香的香料柠檬草梗上经炭火微焦炙烤。',
      fr: 'Brochettes balinaises côtières de maquereau haché mélangé à de la noix de coco râpée et des feuilles de lime kaffir, façonnées sur des tiges de citronnelle et grillées au charbon de bois.'
    },
    flavorProfile: {
      descriptors: ['Fresh Lime Zest', 'Smoky Coconut', 'Subtle Lemongrass', 'Sweet Mackerel'],
      primaryTaste: 'Citrusy, Smoky & Sweetly Savory',
      spiceLevel: 'Mild'
    },
    allergenFlags: [
      {
        allergen: 'Fish',
        severity: 'CRITICAL_WARNING',
        sourceIngredient: 'minced Spanish mackerel',
        isImplicit: false,
        advisoryNote: 'Prepared from fresh wild-caught Spanish mackerel.'
      },
      {
        allergen: 'TreeNuts',
        severity: 'CRITICAL_WARNING',
        sourceIngredient: 'candlenut',
        isImplicit: true,
        advisoryNote: 'Ground candlenut incorporated into the herbal binding paste.'
      }
    ],
    dietaryTags: ['Pescatarian', 'Halal-Friendly', 'Gluten-Free', 'Dairy-Free'],
    requiresKitchenVerification: false,
    status: 'ENRICHED',
    tokensConsumed: {
      promptTokens: 440,
      completionTokens: 310,
      totalTokens: 750
    }
  },

  'bali-3': {
    id: 'bali-3',
    presetId: 'bali-bistro',
    originalName: 'Sambal Matah',
    regionalOrigin: 'Denpasar, Bali',
    priceText: 'IDR 25.000',
    rawIngredients: "shallots, bird's eye chili, lemongrass heart, kaffir lime leaves, warm coconut oil, shrimp paste (terasi), calamansi lime juice",
    culturalNarrative: {
      en: 'A vibrant raw Balinese salsa made of finely sliced crisp shallots, fiery bird’s eye chilies, and lemongrass hearts infused with warm coconut oil and a squeeze of fragrant calamansi.',
      ja: 'スライスした新鮮なエシャロット、激辛唐辛子、レモングラスの中心部を、温めたココナッツオイルとカラマンシー果汁でさっと和えたフレッシュなバリ風生サルサ。',
      zh: '巴厘岛生拌红葱辣椒酱，选用鲜脆小红葱、鸟眼椒与柠檬草嫩芯切碎，浇上温热纯椰子油与新鲜金桔汁，生鲜爽脆、热辣芳香。',
      fr: "Un condiment cru balinais éclatant composé d'échalotes croquantes, de piments œil-d'oiseau et de cœurs de citronnelle, infusés d'huile de coco chaude et de jus de calamansi."
    },
    flavorProfile: {
      descriptors: ['Crisp Raw Shallots', 'Fiery Bird’s Eye', 'Bright Calamansi', 'Pure Coconut Oil'],
      primaryTaste: 'Fiery, Citrusy Fresh & Pungent',
      spiceLevel: 'Hot'
    },
    allergenFlags: [
      {
        allergen: 'Crustaceans',
        severity: 'CRITICAL_WARNING',
        sourceIngredient: 'shrimp paste (terasi)',
        isImplicit: true,
        advisoryNote: 'Contains toasted fermented shrimp paste dissolved in the warm coconut oil dressing.'
      }
    ],
    dietaryTags: ['Pescatarian', 'Gluten-Free', 'Dairy-Free', 'Nut-Free'],
    requiresKitchenVerification: false,
    status: 'ENRICHED',
    tokensConsumed: {
      promptTokens: 410,
      completionTokens: 290,
      totalTokens: 700
    }
  },

  'bali-4': {
    id: 'bali-4',
    presetId: 'bali-bistro',
    originalName: 'Lawar Ayam',
    regionalOrigin: 'Ubud, Bali',
    priceText: 'IDR 48.000',
    rawIngredients: 'shredded chicken breast, young jackfruit, long beans, spiced grated coconut, galangal, fried shallots, candlenut, kaffir lime',
    culturalNarrative: {
      en: 'An ancient ceremonial vegetable and poultry salad combining tender shredded chicken, crisp long beans, and young jackfruit tossed in warm spiced coconut and roasted candlenut paste.',
      ja: '細切りチキン、インゲン、若いジャックフルーツを、炒りココナッツとスパイスペーストで和えたバリ島の伝統的な儀式用温サラダです。',
      zh: '巴厘岛古法传统节庆温拌菜，以手撕鸡肉、脆嫩长豆角与嫩波罗蜜为主料，拌入微炒香料椰丝、高良姜与烘烤石栗泥。',
      fr: "Une salade cérémonielle balinaise traditionnelle mêlant poulet effiloché, haricots longs et jeune jacquier, assaisonnée de noix de coco épicée et de pâte de bancoulier."
    },
    flavorProfile: {
      descriptors: ['Spiced Coconut', 'Crisp Yardlong Beans', 'Tender Jackfruit', 'Aromatic Galangal'],
      primaryTaste: 'Earthy, Nutty Savory & Aromatic',
      spiceLevel: 'Medium'
    },
    allergenFlags: [
      {
        allergen: 'TreeNuts',
        severity: 'CRITICAL_WARNING',
        sourceIngredient: 'candlenut (kemiri)',
        isImplicit: true,
        advisoryNote: 'Contains crushed candlenut integrated into the coconut dressing.'
      }
    ],
    dietaryTags: ['Halal-Friendly', 'Gluten-Free', 'Dairy-Free'],
    requiresKitchenVerification: false,
    status: 'ENRICHED',
    tokensConsumed: {
      promptTokens: 435,
      completionTokens: 315,
      totalTokens: 750
    }
  },

  // ==========================================
  // Preset 2: Warung Nusantara Autentik
  // ==========================================
  'nusantara-1': {
    id: 'nusantara-1',
    presetId: 'warung-nusantara',
    originalName: 'Rawon Surabaya',
    regionalOrigin: 'Surabaya, East Java',
    priceText: 'IDR 65.000',
    rawIngredients: 'beef shank, kluwek nut, lemongrass, galangal, shallots, garlic, bean sprouts, salted duck egg, sambal terasi',
    culturalNarrative: {
      en: 'A legendary East Javanese heritage stew celebrated for its deep, pitch-black broth infused with fermented kluwek nuts, simmered with tender beef shank and served alongside crisp short bean sprouts and salted duck egg.',
      ja: '発酵させた黒いクルウェックの実を使ってコク深い漆黒のスープに仕立てた東ジャワの伝統的な牛肉煮込み。塩漬けアヒル卵と生モヤシを添えていただきます。',
      zh: '东爪哇泗水传世黑牛肉汤，精选发酵黑坚果Kluwek熬制出浓郁深黑汤底，牛肉牛腱慢火炖至软嫩，佐以生脆小豆芽与油香咸鸭蛋。',
      fr: "Un ragoût légendaire de l'est de Java réputé pour son bouillon noir d'ébène infusé de noix de kluwek fermentées, mijoté avec du jarret de bœuf tendre et servi avec œuf de canard salé."
    },
    flavorProfile: {
      descriptors: ['Earthy Kluwek', 'Savory Beef Umami', 'Aromatic Lemongrass', 'Subtle Nutty Bitter'],
      primaryTaste: 'Deeply Savory, Earthy & Complex',
      spiceLevel: 'Mild'
    },
    allergenFlags: [
      {
        allergen: 'Crustaceans',
        severity: 'CRITICAL_WARNING',
        sourceIngredient: 'sambal terasi',
        isImplicit: true,
        advisoryNote: 'Contains fermented shrimp paste (terasi) in the accompanying sambal condiment.'
      },
      {
        allergen: 'Egg',
        severity: 'DIETARY_NOTICE',
        sourceIngredient: 'salted duck egg',
        isImplicit: false,
        advisoryNote: 'Accompanied by cured whole salted duck egg.'
      }
    ],
    dietaryTags: ['Halal-Friendly', 'Dairy-Free', 'Nut-Free'],
    requiresKitchenVerification: false,
    status: 'ENRICHED',
    tokensConsumed: {
      promptTokens: 470,
      completionTokens: 345,
      totalTokens: 815
    }
  },

  'nusantara-2': {
    id: 'nusantara-2',
    presetId: 'warung-nusantara',
    originalName: 'Rendang Daging Sapi',
    regionalOrigin: 'Minangkabau, West Sumatra',
    priceText: 'IDR 85.000',
    rawIngredients: 'beef chuck, rich coconut milk, galangal, toasted grated coconut (kerisik), lemongrass, kaffir lime leaves, turmeric leaves, shallots, garlic, red chili',
    culturalNarrative: {
      en: 'The crown jewel of West Sumatran culinary art: beef chuck gently caramelized over low wood fires for eight hours in spiced coconut milk until dark, velvety, and deeply infused with galangal and toasted coconut.',
      ja: '西スマトラ・ミナンカバウ族が誇る世界の至宝。牛肉をスパイスとココナッツミルクでじっくり8時間煮詰め、水分を飛ばしてキャラメリゼした極上の煮込み料理。',
      zh: '西苏门答腊米南佳保族传世名肴仁当牛肉，将厚切牛腩浸没于浓郁椰奶与十余种南洋香料中微火慢炖八小时，直至酱汁焦糖化，酱香醇厚、肉香四溢。',
      fr: "Le joyau de la cuisine sumatranaise : du bœuf caramélisé lentement pendant huit heures au feu doux dans du lait de coco épicé jusqu'à obtenir une texture sombre et veloutée."
    },
    flavorProfile: {
      descriptors: ['Caramelized Coconut', 'Galangal Warmth', 'Toasted Kerisik', 'Rich Beef Fat'],
      primaryTaste: 'Intensely Savory, Coconut Rich & Spiced',
      spiceLevel: 'Medium'
    },
    allergenFlags: [],
    dietaryTags: ['Halal-Friendly', 'Gluten-Free', 'Dairy-Free', 'Nut-Free'],
    requiresKitchenVerification: false,
    status: 'ENRICHED',
    tokensConsumed: {
      promptTokens: 480,
      completionTokens: 350,
      totalTokens: 830
    }
  },

  'nusantara-3': {
    id: 'nusantara-3',
    presetId: 'warung-nusantara',
    originalName: 'Soto Betawi',
    regionalOrigin: 'Jakarta (Betawi)',
    priceText: 'IDR 55.000',
    rawIngredients: 'beef brisket, aromatic broth infused with fresh cow milk and coconut milk, tomatoes, fried potato wedges, emping melinjo crackers, sweet soy sauce (kecap manis)',
    culturalNarrative: {
      en: 'A comforting Betawi heritage soup featuring tender beef brisket swimming in a silky, golden broth enriched with fresh cow milk and coconut cream, topped with tart tomatoes and crisp emping melinjo bitters.',
      ja: 'ジャカルタの先住民族ブタウィに伝わる名物スープ。牛ブリスケットをココナッツミルクと新鮮な牛乳をブレンドしたクリーミーな黄金スープで煮込みました。',
      zh: '雅加达本土巴达维传统牛肉汤，将牛胸肉浸入鲜牛奶与浓郁椰浆调和的丝滑金汤中慢煨，搭配鲜切番茄、炸土豆块与微苦脆香的白果片。',
      fr: 'Une soupe réconfortante de Jakarta mêlant poitrine de bœuf tendre et bouillon doré soyeux enrichi de lait frais de vache et de crème de coco, surmonté de tomates fraîches.'
    },
    flavorProfile: {
      descriptors: ['Creamy Coconut Milk', 'Warm Nutmeg & Clove', 'Beef Brisket Umami', 'Melinjo Bitters'],
      primaryTaste: 'Velvety Rich, Sweet Creamy & Aromatic',
      spiceLevel: 'Mild'
    },
    allergenFlags: [
      {
        allergen: 'Dairy',
        severity: 'CRITICAL_WARNING',
        sourceIngredient: 'fresh cow milk',
        isImplicit: true,
        advisoryNote: 'Broth is uniquely enriched with fresh dairy milk alongside coconut milk.'
      },
      {
        allergen: 'Soy',
        severity: 'DIETARY_NOTICE',
        sourceIngredient: 'sweet soy sauce (kecap manis)',
        isImplicit: false,
        advisoryNote: 'Seasoned with wheat-fermented Indonesian sweet soy sauce.'
      },
      {
        allergen: 'Gluten',
        severity: 'DIETARY_NOTICE',
        sourceIngredient: 'sweet soy sauce',
        isImplicit: true,
        advisoryNote: 'Traditional sweet soy sauce contains trace wheat gluten.'
      }
    ],
    dietaryTags: ['Halal-Friendly'],
    requiresKitchenVerification: false,
    status: 'ENRICHED',
    tokensConsumed: {
      promptTokens: 490,
      completionTokens: 360,
      totalTokens: 850
    }
  },

  'nusantara-4': {
    id: 'nusantara-4',
    presetId: 'warung-nusantara',
    originalName: 'Gado-Gado Batavia',
    regionalOrigin: 'Jakarta (Betawi)',
    priceText: 'IDR 40.000',
    rawIngredients: 'blanched cabbage, long beans, bean sprouts, fried tofu, artisanal tempeh, hard-boiled egg, roasted peanut dressing, emping crackers',
    culturalNarrative: {
      en: 'An Indonesian national treasure: lightly blanched market vegetables, artisanal tempeh, and golden tofu draped in a decadent, stone-ground peanut dressing perfumed with kaffir lime and palm sugar.',
      ja: '湯通しした新鮮野菜、揚げ豆腐、テンペ、ゆで卵に、石臼で挽いた濃厚な特製ピーナッツソースをたっぷりとかけたインドネシアを代表するごちそうサラダ。',
      zh: '印尼国宝级传统温拌蔬果沙拉，精选焯水时蔬、手作天贝与金黄豆腐，淋上石臼研磨的高级浓郁烤花生酱与椰糖青柠汁。',
      fr: 'Un classique indonésien : légumes du marché délicatement blanchis, tempeh artisanal et tofu doré, nappés d’une sauce veloutée aux arachides grillées et sucre de palme.'
    },
    flavorProfile: {
      descriptors: ['Velvety Peanuts', 'Sweet Palm Sugar', 'Fresh Crisp Greens', 'Subtle Lime Zest'],
      primaryTaste: 'Rich, Sweet & Nutty Savory',
      spiceLevel: 'Mild'
    },
    allergenFlags: [
      {
        allergen: 'Peanuts',
        severity: 'CRITICAL_WARNING',
        sourceIngredient: 'roasted peanut dressing',
        isImplicit: false,
        advisoryNote: 'Core dressing is crafted from whole ground roasted peanuts.'
      },
      {
        allergen: 'Soy',
        severity: 'DIETARY_NOTICE',
        sourceIngredient: 'fried tofu, artisanal tempeh',
        isImplicit: false,
        advisoryNote: 'Contains fermented whole soy cakes (tempeh) and soy curd (tofu).'
      },
      {
        allergen: 'Egg',
        severity: 'DIETARY_NOTICE',
        sourceIngredient: 'hard-boiled egg',
        isImplicit: false,
        advisoryNote: 'Garnished with sliced farm chicken egg.'
      }
    ],
    dietaryTags: ['Vegetarian', 'Halal-Friendly', 'Dairy-Free'],
    requiresKitchenVerification: false,
    status: 'ENRICHED',
    tokensConsumed: {
      promptTokens: 465,
      completionTokens: 335,
      totalTokens: 800
    }
  },

  // ==========================================
  // Preset 3: Specialty Coffee & Heritage Sweets
  // ==========================================
  'coffee-1': {
    id: 'coffee-1',
    presetId: 'specialty-coffee',
    originalName: 'Kopi Tubruk Robusta Dampit',
    regionalOrigin: 'Dampit, East Java',
    priceText: 'IDR 28.000',
    rawIngredients: 'coarse Dampit robusta grounds, boiling volcanic spring water, raw cane sugar',
    culturalNarrative: {
      en: 'The quintessential Indonesian heritage coffee ritual: coarse volcanic Robusta steeped unfiltered in rolling boiling water, developing a dense, velvety crema and deep dark cocoa notes.',
      ja: '火山灰土壌のダンピット産ロブスタ豆を粗挽きにし、沸騰した湯でフィルターを通さず直接抽出するインドネシア伝統の濃厚な土着コーヒー。',
      zh: '印尼群岛最原始纯粹的无滤沉淀咖啡仪式：精选东爪哇火山带粗磨罗布斯塔咖啡粉，以滚沸火山泉水冲焖，表面浮起浓厚醇甘的深色油脂。',
      fr: "Le rituel caféier historique d'Indonésie : un café Robusta volcanique moulu grossièrement infusé sans filtre dans une eau bouillante, révélant des arômes intenses de cacao noir."
    },
    flavorProfile: {
      descriptors: ['Dark Chocolate', 'Earthy Cedar', 'Dense Crema', 'Caramelized Sugar'],
      primaryTaste: 'Bold, Dark Bitter & Smoky Sweet',
      spiceLevel: 'None'
    },
    allergenFlags: [],
    dietaryTags: ['Vegan', 'Halal-Friendly', 'Gluten-Free', 'Dairy-Free', 'Nut-Free'],
    requiresKitchenVerification: false,
    status: 'ENRICHED',
    tokensConsumed: {
      promptTokens: 390,
      completionTokens: 270,
      totalTokens: 660
    }
  },

  'coffee-2': {
    id: 'coffee-2',
    presetId: 'specialty-coffee',
    originalName: 'Klepon Pandan Cake',
    regionalOrigin: 'Central Java',
    priceText: 'IDR 32.000',
    rawIngredients: 'glutinous rice flour, fragrant pandan leaf extract, molten organic aren palm sugar, freshly steamed grated coconut',
    culturalNarrative: {
      en: 'An ethereal Javanese delicacy featuring vibrant emerald glutinous rice pillows perfumed with natural screwpine pandan, bursting with molten warm liquid palm sugar and coated in sea-salted coconut.',
      ja: '天然のパンダンリーフで鮮やかな緑に色づけたモチモチの餅菓子。口に含むと温かい椰子蜜がトロリと溢れ出し、塩気のある削りココナッツと絶妙に調和します。',
      zh: '爪哇传世经典天然香兰椰糖糯米糍：以鲜榨班兰叶汁揉制成翠绿软糯外皮，咬开瞬间温热纯有机棕榈椰蜜在口中爆浆，裹以微咸鲜蒸椰蓉。',
      fr: 'Une délicatesse javanaise exquise : de petites bouchées de riz gluant vert émeraude parfumées au pandan, éclatant de sucre de palme liquide et enrobées de noix de coco salée.'
    },
    flavorProfile: {
      descriptors: ['Fragrant Pandan', 'Molten Palm Sugar', 'Salted Coconut', 'Chewy Texture'],
      primaryTaste: 'Sweet Molten Caramel & Floral Pandan',
      spiceLevel: 'None'
    },
    allergenFlags: [],
    dietaryTags: ['Vegan', 'Vegetarian', 'Halal-Friendly', 'Gluten-Free', 'Dairy-Free', 'Nut-Free'],
    requiresKitchenVerification: false,
    status: 'ENRICHED',
    tokensConsumed: {
      promptTokens: 415,
      completionTokens: 295,
      totalTokens: 710
    }
  },

  'coffee-3': {
    id: 'coffee-3',
    presetId: 'specialty-coffee',
    originalName: 'Pisang Goreng Madu Wijen',
    regionalOrigin: 'Bandung, West Java',
    priceText: 'IDR 30.000',
    rawIngredients: 'ripe Raja bananas, wheat flour batter, wild forest honey glaze, toasted white sesame seeds, coconut oil',
    culturalNarrative: {
      en: 'Sundanese street fritters crafted from caramelized ripe Raja bananas dipped in a light airy batter, fried golden, and finished with a dark wild forest honey glaze and nutty toasted sesame.',
      ja: '完熟ラジャバナナを軽い衣でカリッと揚げ、濃厚な天然ハチミツのグレーズと芳ばしい白ゴマを贅沢にまとわせたバンドン発祥の極上バナナフリッター。',
      zh: '万隆特色古早蜜汁芝麻炸香蕉：选用天然糖化完熟大蕉（Pisang Raja），裹轻薄酥浆炸至金黄焦脆，浇淋深色野生森林蜂蜜与炒香白芝麻。',
      fr: 'Beignets de banane sundanais croustillants élaborés à partir de bananes Raja caramélisées, nappés d’un glaçage au miel de forêt sauvage et de sésame grillé.'
    },
    flavorProfile: {
      descriptors: ['Caramelized Banana', 'Wild Forest Honey', 'Toasted Sesame', 'Crispy Batter'],
      primaryTaste: 'Crispy Sweet, Honeyed & Nutty',
      spiceLevel: 'None'
    },
    allergenFlags: [
      {
        allergen: 'Gluten',
        severity: 'CRITICAL_WARNING',
        sourceIngredient: 'wheat flour batter',
        isImplicit: false,
        advisoryNote: 'Crispy batter shell is made from wheat flour containing gluten.'
      },
      {
        allergen: 'Sesame',
        severity: 'DIETARY_NOTICE',
        sourceIngredient: 'toasted white sesame seeds',
        isImplicit: false,
        advisoryNote: 'Generously garnished with toasted whole sesame seeds.'
      }
    ],
    dietaryTags: ['Vegetarian', 'Halal-Friendly', 'Dairy-Free'],
    requiresKitchenVerification: false,
    status: 'ENRICHED',
    tokensConsumed: {
      promptTokens: 425,
      completionTokens: 305,
      totalTokens: 730
    }
  },

  'coffee-4': {
    id: 'coffee-4',
    presetId: 'specialty-coffee',
    originalName: 'Es Kopi Susu Gula Aren',
    regionalOrigin: 'Jakarta Urban',
    priceText: 'IDR 35.000',
    rawIngredients: 'double espresso shot, fresh dairy milk, organic aren liquid palm sugar, crystal ice cubes',
    culturalNarrative: {
      en: 'The definitive contemporary Indonesian cafe beverage: bold dark-roast espresso layered over silky chilled fresh dairy milk and smoky unrefined organic aren palm sugar.',
      ja: '濃厚なエスプレッソダブルショットに冷たい新鮮な牛乳を重ね、スモーキーな未精製アレン椰子蜜シロップを沈めたジャカルタ発祥の国民的アイスラテ。',
      zh: '印尼当代精品咖啡馆代表作：深烘双份意式浓缩注入冰镇新鲜全脂鲜奶，底层融入醇厚焦香的爪哇天然未精炼阿莲棕榈椰糖蜜。',
      fr: 'La boisson emblématique des cafés indonésiens : un double expresso corsé versé sur du lait frais crémeux et du sucre de palme aren liquide bio non raffiné.'
    },
    flavorProfile: {
      descriptors: ['Bold Dark Roast', 'Smoky Palm Sugar', 'Silky Fresh Dairy', 'Caramel Finish'],
      primaryTaste: 'Creamy Sweet, Smoky & Bold Cocoa',
      spiceLevel: 'None'
    },
    allergenFlags: [
      {
        allergen: 'Dairy',
        severity: 'CRITICAL_WARNING',
        sourceIngredient: 'fresh dairy milk',
        isImplicit: false,
        advisoryNote: 'Crafted with fresh whole cow milk.'
      }
    ],
    dietaryTags: ['Vegetarian', 'Halal-Friendly', 'Gluten-Free', 'Nut-Free'],
    requiresKitchenVerification: false,
    status: 'ENRICHED',
    tokensConsumed: {
      promptTokens: 405,
      completionTokens: 285,
      totalTokens: 690
    }
  }
};

/**
 * Retrieves all pre-cached golden dish cards for a preset ID.
 * @param {string} presetId
 * @returns {Array<object>}
 */
export function getGoldenDishesByPreset(presetId) {
  return Object.values(GOLDEN_CACHE).filter(dish => dish.presetId === presetId);
}

/**
 * Retrieves a single pre-cached golden dish card by dish ID.
 * @param {string} dishId
 * @returns {object|null}
 */
export function getGoldenDishById(dishId) {
  return GOLDEN_CACHE[dishId] || null;
}
