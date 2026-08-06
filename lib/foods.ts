/**
 * Curated food nutrition dataset for the public Calorie Calculator.
 *
 * Values are per 100 g of the EDIBLE, TYPICALLY-COOKED (or ready-to-eat) form, with
 * common Indian household serving sizes (katori, roti, cup, glass, piece) and their
 * approximate gram equivalents so users can estimate without a weighing scale.
 *
 * Each food carries full macros AND key micronutrients per 100 g:
 *   MACROS (grams): kcal, protein, carbs, fat, fibre, sugar
 *   MICROS (mg):    sodium, calcium, iron, potassium, vitaminC
 *
 * Data sources (bundled under their licences — see the credit line on the page):
 *   - INDB — Indian Nutrient Databank (Anuvaad Solutions / Jaacks Lab), CC BY.
 *     Vijayakumar A, Dubasi HB, Awasthi A, Jaacks LM. "Development of an Indian Food
 *     Composition Database." Current Developments in Nutrition, 2024.
 *   - IFCT 2017 — Indian Food Composition Tables, National Institute of Nutrition
 *     (ICMR), Hyderabad.
 *   - USDA FoodData Central (public domain, CC0) — generic and worldwide items.
 *
 * Values are rounded approximations for everyday estimation, not lab-exact figures;
 * home recipes vary with oil/ghee, portion and preparation. Micronutrients for
 * composite cooked dishes are recipe-based estimates.
 */

export interface FoodServing {
  /** Human label shown in the unit dropdown, e.g. "1 katori (150 g)". */
  label: string;
  /** Gram-equivalent of one of this serving. */
  grams: number;
}

/** Per-serving nutrients. Macros in grams; micros in milligrams. */
export interface FoodNutrients {
  kcal: number;
  protein: number; // g
  carbs: number; // g
  fat: number; // g
  fiber: number; // g (dietary fibre)
  sugar: number; // g (total sugars)
  sodium: number; // mg
  calcium: number; // mg
  iron: number; // mg
  potassium: number; // mg
  vitaminC: number; // mg
}

/** @deprecated Kept for backwards-compatibility; use FoodNutrients. */
export type FoodMacros = FoodNutrients;

export interface FoodItem {
  slug: string;
  name: string;
  /** Alternate names / spellings used for search matching. */
  aliases?: string[];
  category: string;
  /** Nutrition per 100 g of the edible form. */
  per100g: FoodNutrients;
  /** Household serving options; a "100 g" option is appended automatically. */
  servings: FoodServing[];
  source: 'INDB' | 'IFCT' | 'USDA';
}

// ── Serving builders (kept terse so the dataset stays readable) ──────────────
const G100: FoodServing = { label: '100 g', grams: 100 };
const katori = (grams = 150): FoodServing => ({ label: `1 katori (${grams} g)`, grams });
const bowl = (grams = 250): FoodServing => ({ label: `1 bowl (${grams} g)`, grams });
const cup = (grams = 150): FoodServing => ({ label: `1 cup (${grams} g)`, grams });
const glass = (grams = 200): FoodServing => ({ label: `1 glass (${grams} g)`, grams });
const tbsp = (grams = 15): FoodServing => ({ label: `1 tbsp (${grams} g)`, grams });
const tsp = (grams = 5): FoodServing => ({ label: `1 tsp (${grams} g)`, grams });
const piece = (grams: number, name = 'piece'): FoodServing => ({ label: `1 ${name} (${grams} g)`, grams });

/**
 * per100g nutrient builder — fixed argument order (keeps each food on one line):
 *   kcal, protein, carbs, fat, fibre, sugar (g);  sodium, calcium, iron, potassium, vitaminC (mg)
 */
const nut = (
  kcal: number, protein: number, carbs: number, fat: number, fiber: number, sugar: number,
  sodium: number, calcium: number, iron: number, potassium: number, vitaminC: number
): FoodNutrients => ({ kcal, protein, carbs, fat, fiber, sugar, sodium, calcium, iron, potassium, vitaminC });

// Raw definitions (servings here do NOT include the 100 g option — it is appended below).
type RawFood = Omit<FoodItem, 'servings'> & { servings: FoodServing[] };

const RAW: RawFood[] = [
  // ── Dals & Legumes (cooked) ────────────────────────────────────────────────
  { slug: 'toor-dal-cooked', name: 'Toor Dal (cooked)', aliases: ['arhar', 'tur', 'arhar dal', 'pigeon pea'], category: 'Dals & Legumes', per100g: nut(122, 7, 18, 2.5, 3.5, 1.5, 240, 17, 1.5, 220, 0), servings: [katori(150), bowl(250)], source: 'INDB' },
  { slug: 'moong-dal-cooked', name: 'Moong Dal (cooked)', aliases: ['mung', 'green gram dal'], category: 'Dals & Legumes', per100g: nut(105, 7, 16, 1.5, 3, 1.2, 240, 15, 1.4, 200, 0), servings: [katori(150), bowl(250)], source: 'INDB' },
  { slug: 'masoor-dal-cooked', name: 'Masoor Dal (cooked)', aliases: ['red lentil', 'lentil'], category: 'Dals & Legumes', per100g: nut(116, 8, 18, 1.5, 4, 1.5, 240, 16, 2, 250, 0), servings: [katori(150), bowl(250)], source: 'INDB' },
  { slug: 'chana-dal-cooked', name: 'Chana Dal (cooked)', aliases: ['bengal gram dal', 'split chickpea'], category: 'Dals & Legumes', per100g: nut(130, 7, 20, 2.5, 5, 2, 240, 20, 1.5, 240, 0), servings: [katori(150), bowl(250)], source: 'INDB' },
  { slug: 'urad-dal-cooked', name: 'Urad Dal (cooked)', aliases: ['black gram dal', 'dal makhani base'], category: 'Dals & Legumes', per100g: nut(132, 8, 18, 3, 4, 1, 240, 25, 2, 250, 0), servings: [katori(150), bowl(250)], source: 'INDB' },
  { slug: 'dal-tadka', name: 'Dal Tadka', aliases: ['dal fry', 'tadka dal'], category: 'Dals & Legumes', per100g: nut(145, 6, 16, 6, 3.5, 2, 400, 25, 1.5, 220, 1), servings: [katori(150), bowl(250)], source: 'INDB' },
  { slug: 'dal-makhani', name: 'Dal Makhani', aliases: ['makhani dal'], category: 'Dals & Legumes', per100g: nut(190, 7, 15, 11, 4, 3, 450, 60, 2, 280, 1), servings: [katori(150), bowl(250)], source: 'INDB' },
  { slug: 'rajma-cooked', name: 'Rajma (curry)', aliases: ['kidney beans', 'rajma masala'], category: 'Dals & Legumes', per100g: nut(140, 7, 20, 3.5, 6, 1.5, 300, 35, 2.2, 400, 1), servings: [katori(150), bowl(250)], source: 'INDB' },
  { slug: 'chole-cooked', name: 'Chole (chickpea curry)', aliases: ['chana masala', 'chhole', 'chickpea curry'], category: 'Dals & Legumes', per100g: nut(160, 7, 22, 5, 6, 4, 400, 50, 2.5, 290, 2), servings: [katori(150), bowl(250)], source: 'INDB' },
  { slug: 'kala-chana-cooked', name: 'Kala Chana (cooked)', aliases: ['black chickpea', 'brown chana'], category: 'Dals & Legumes', per100g: nut(150, 8, 24, 2.5, 8, 3, 250, 55, 3, 300, 1), servings: [katori(150)], source: 'INDB' },
  { slug: 'chana-boiled', name: 'Boiled Chickpeas', aliases: ['kabuli chana', 'safed chana', 'garbanzo'], category: 'Dals & Legumes', per100g: nut(164, 8.9, 27.4, 2.6, 7.6, 4.8, 7, 49, 2.9, 291, 1.3), servings: [katori(150)], source: 'USDA' },
  { slug: 'sambar', name: 'Sambar', aliases: ['sambhar'], category: 'Dals & Legumes', per100g: nut(85, 4, 12, 2.5, 3, 3, 400, 30, 1.2, 250, 3), servings: [katori(150), bowl(250)], source: 'INDB' },
  { slug: 'sprouts-moong', name: 'Moong Sprouts', aliases: ['sprouts', 'ankurit moong'], category: 'Dals & Legumes', per100g: nut(100, 7, 18, 0.5, 7, 3, 15, 30, 2.5, 250, 10), servings: [katori(100)], source: 'IFCT' },
  { slug: 'lobia-cooked', name: 'Black-Eyed Peas (Lobia, boiled)', aliases: ['chawli', 'cowpea', 'black eyed peas'], category: 'Dals & Legumes', per100g: nut(116, 7.7, 20.8, 0.5, 6.5, 3.3, 4, 24, 2.5, 278, 0.4), servings: [katori(150)], source: 'USDA' },
  { slug: 'soy-chunks', name: 'Soya Chunks (cooked)', aliases: ['soya nuggets', 'nutrela', 'meal maker'], category: 'Dals & Legumes', per100g: nut(115, 17.5, 9.9, 0.5, 3, 2, 5, 120, 6, 200, 0), servings: [katori(100)], source: 'INDB' },
  { slug: 'soybeans-cooked', name: 'Soybeans (boiled)', aliases: ['soybean', 'bhat'], category: 'Dals & Legumes', per100g: nut(172, 18.2, 8.4, 9, 6, 3, 1, 102, 5.1, 515, 1.7), servings: [katori(100)], source: 'USDA' },
  { slug: 'tempeh', name: 'Tempeh', aliases: ['fermented soybean cake', 'tempe'], category: 'Dals & Legumes', per100g: nut(192, 20.3, 7.6, 10.8, 4.5, 0, 9, 111, 2.7, 412, 0), servings: [piece(30, 'slice'), { label: '1 serving (85 g)', grams: 85 }, katori(100)], source: 'USDA' },
  { slug: 'black-beans-boiled', name: 'Black Beans (boiled)', aliases: ['turtle beans', 'frijoles negros'], category: 'Dals & Legumes', per100g: nut(132, 8.9, 23.7, 0.5, 8.7, 0.3, 1, 27, 2.1, 355, 0), servings: [katori(150), { label: '1 cup (172 g)', grams: 172 }], source: 'USDA' },
  { slug: 'edamame-boiled', name: 'Edamame (boiled)', aliases: ['green soybeans', 'edamame beans'], category: 'Dals & Legumes', per100g: nut(122, 11.9, 8.9, 5.2, 5.2, 2.2, 6, 63, 2.3, 436, 6.1), servings: [katori(150), { label: '1 cup (155 g)', grams: 155 }], source: 'USDA' },
  { slug: 'hummus', name: 'Hummus', aliases: ['houmous', 'chickpea dip'], category: 'Dals & Legumes', per100g: nut(166, 7.9, 14.3, 9.6, 6, 0.3, 379, 38, 2.4, 228, 0), servings: [tbsp(15), katori(100)], source: 'USDA' },
  { slug: 'white-beans-boiled', name: 'White Beans (Cannellini, boiled)', aliases: ['cannellini beans', 'white kidney beans', 'safed rajma'], category: 'Dals & Legumes', per100g: nut(139, 9.7, 25.1, 0.4, 6.3, 0.3, 6, 90, 3.7, 561, 0), servings: [katori(150), { label: '1 cup (179 g)', grams: 179 }], source: 'USDA' },
  { slug: 'moth-beans-boiled', name: 'Moth Beans (Matki, boiled)', aliases: ['matki', 'matki beans', 'dew beans', 'turkish gram'], category: 'Dals & Legumes', per100g: nut(117, 7.8, 21.1, 0.5, 5, 2, 11, 3, 1.6, 283, 0.9), servings: [katori(150), { label: '1 cup (177 g)', grams: 177 }], source: 'USDA' },
  { slug: 'horse-gram-boiled', name: 'Horse Gram (Kulith, boiled)', aliases: ['kulith', 'kulthi', 'hurali', 'muthira', 'kollu'], category: 'Dals & Legumes', per100g: nut(130, 8.9, 23, 0.2, 5.3, 1, 5, 130, 3, 300, 1), servings: [katori(150)], source: 'IFCT' },

  // ── Rice & Grains (cooked) ─────────────────────────────────────────────────
  { slug: 'rice-white-cooked', name: 'White Rice (cooked)', aliases: ['chawal', 'steamed rice', 'plain rice'], category: 'Rice & Grains', per100g: nut(130, 2.7, 28, 0.3, 0.4, 0.1, 1, 10, 1.2, 35, 0), servings: [katori(150), cup(150), bowl(250)], source: 'USDA' },
  { slug: 'rice-brown-cooked', name: 'Brown Rice (cooked)', aliases: ['brown chawal'], category: 'Rice & Grains', per100g: nut(123, 2.7, 26, 1, 1.8, 0.4, 4, 10, 0.5, 79, 0), servings: [katori(150), cup(150)], source: 'USDA' },
  { slug: 'jeera-rice', name: 'Jeera Rice', aliases: ['cumin rice'], category: 'Rice & Grains', per100g: nut(165, 3, 28, 4.5, 0.6, 0.2, 200, 15, 1, 45, 0), servings: [katori(150), cup(150)], source: 'INDB' },
  { slug: 'veg-biryani', name: 'Vegetable Biryani', aliases: ['veg biryani', 'biriyani'], category: 'Rice & Grains', per100g: nut(175, 4, 26, 6, 1.5, 1.5, 350, 25, 1, 120, 3), servings: [katori(150), bowl(250)], source: 'INDB' },
  { slug: 'chicken-biryani', name: 'Chicken Biryani', aliases: ['biryani'], category: 'Rice & Grains', per100g: nut(190, 9, 22, 8, 1, 1, 380, 25, 1.2, 150, 2), servings: [katori(150), bowl(250)], source: 'INDB' },
  { slug: 'pulao-veg', name: 'Veg Pulao', aliases: ['pulav', 'pilaf'], category: 'Rice & Grains', per100g: nut(155, 3.5, 26, 4.5, 1.2, 1.5, 300, 20, 0.9, 110, 3), servings: [katori(150), cup(150)], source: 'INDB' },
  { slug: 'curd-rice', name: 'Curd Rice', aliases: ['dahi rice', 'thayir sadam'], category: 'Rice & Grains', per100g: nut(120, 3.5, 18, 3.5, 0.4, 2.5, 250, 70, 0.6, 100, 0.5), servings: [katori(150), bowl(250)], source: 'INDB' },
  { slug: 'lemon-rice', name: 'Lemon Rice', aliases: ['nimbu chawal'], category: 'Rice & Grains', per100g: nut(165, 3, 27, 5, 0.8, 0.5, 300, 20, 1, 60, 3), servings: [katori(150)], source: 'INDB' },
  { slug: 'khichdi', name: 'Khichdi', aliases: ['khichri', 'dal khichdi'], category: 'Rice & Grains', per100g: nut(120, 4.5, 20, 2.5, 1.5, 0.8, 300, 20, 1.3, 110, 0.5), servings: [katori(150), bowl(250)], source: 'INDB' },
  { slug: 'poha', name: 'Poha', aliases: ['flattened rice', 'aval', 'chivda'], category: 'Rice & Grains', per100g: nut(130, 2.5, 25, 2.5, 1, 1, 250, 15, 2.5, 60, 2), servings: [katori(150), bowl(250)], source: 'INDB' },
  { slug: 'upma', name: 'Upma', aliases: ['uppma', 'rava upma'], category: 'Rice & Grains', per100g: nut(135, 3, 22, 4, 1.5, 1, 300, 20, 0.9, 80, 2), servings: [katori(150), bowl(250)], source: 'INDB' },
  { slug: 'oats-cooked', name: 'Oats (cooked in water)', aliases: ['oatmeal', 'dalia oats'], category: 'Rice & Grains', per100g: nut(71, 2.5, 12, 1.5, 1.7, 0.3, 4, 9, 0.9, 61, 0), servings: [katori(150), bowl(250)], source: 'USDA' },
  { slug: 'daliya', name: 'Daliya (broken wheat, cooked)', aliases: ['dalia', 'bulgur', 'lapsi'], category: 'Rice & Grains', per100g: nut(120, 4, 24, 1, 2.5, 1, 150, 15, 1, 90, 0.5), servings: [katori(150), bowl(250)], source: 'IFCT' },
  { slug: 'suji-cooked', name: 'Suji / Semolina (cooked, plain)', aliases: ['sooji', 'rava', 'semolina'], category: 'Rice & Grains', per100g: nut(110, 3.9, 22.3, 0.6, 1, 0.5, 150, 8, 0.6, 30, 0), servings: [katori(150), bowl(250)], source: 'IFCT' },
  { slug: 'quinoa-cooked', name: 'Quinoa (cooked, plain)', aliases: ['kinwa'], category: 'Rice & Grains', per100g: nut(120, 4.4, 21.3, 1.9, 2.8, 0.9, 7, 17, 1.5, 172, 0), servings: [katori(150), cup(150)], source: 'USDA' },
  { slug: 'vermicelli-cooked', name: 'Vermicelli (cooked, plain)', aliases: ['semiya', 'seviyan'], category: 'Rice & Grains', per100g: nut(158, 5.8, 30.9, 0.9, 1.5, 0.5, 100, 10, 1, 40, 0), servings: [katori(150), bowl(250)], source: 'IFCT' },
  { slug: 'pasta-cooked', name: 'Pasta (white, cooked)', aliases: ['pasta', 'penne', 'macaroni', 'white pasta', 'spaghetti'], category: 'Rice & Grains', per100g: nut(158, 5.8, 30.9, 0.9, 1.8, 0.6, 1, 7, 1.3, 44, 0), servings: [cup(150), bowl(250)], source: 'USDA' },
  { slug: 'whole-wheat-pasta-cooked', name: 'Whole Wheat Pasta (cooked)', aliases: ['whole wheat pasta', 'wholegrain pasta', 'atta pasta', 'brown pasta'], category: 'Rice & Grains', per100g: nut(124, 5.3, 26.5, 0.5, 3.9, 0.8, 3, 15, 1.5, 62, 0), servings: [cup(150), bowl(250)], source: 'USDA' },
  { slug: 'couscous-cooked', name: 'Couscous (cooked)', aliases: ['couscous', 'semolina couscous'], category: 'Rice & Grains', per100g: nut(112, 3.8, 23.2, 0.2, 1.4, 0.1, 5, 8, 0.4, 58, 0), servings: [cup(150), bowl(250)], source: 'USDA' },
  { slug: 'millet-bajra-cooked', name: 'Pearl Millet / Bajra (cooked grain)', aliases: ['bajra', 'pearl millet', 'cooked millet', 'bajra grain'], category: 'Rice & Grains', per100g: nut(119, 3.5, 23.7, 1, 2, 0.2, 3, 10, 1.5, 70, 0), servings: [katori(150), bowl(250)], source: 'IFCT' },
  { slug: 'buckwheat-kuttu-cooked', name: 'Buckwheat / Kuttu (cooked)', aliases: ['kuttu', 'buckwheat', 'kuttu ka atta', 'phaphra'], category: 'Rice & Grains', per100g: nut(92, 3.4, 19.9, 0.6, 2.7, 0.9, 4, 7, 0.8, 88, 0), servings: [katori(150), bowl(250)], source: 'USDA' },

  // ── Rotis & Breads ─────────────────────────────────────────────────────────
  { slug: 'roti-chapati', name: 'Roti / Chapati', aliases: ['phulka', 'chapatti', 'wheat roti'], category: 'Rotis & Breads', per100g: nut(297, 9, 51, 6, 4.9, 1.5, 250, 30, 2.5, 150, 0), servings: [piece(40, 'roti'), piece(35, 'phulka')], source: 'INDB' },
  { slug: 'tandoori-roti', name: 'Tandoori Roti', aliases: ['tandoor roti'], category: 'Rotis & Breads', per100g: nut(285, 9, 52, 5, 3.5, 2, 350, 25, 2, 120, 0), servings: [piece(50, 'roti')], source: 'INDB' },
  { slug: 'aloo-paratha', name: 'Aloo Paratha', aliases: ['potato paratha'], category: 'Rotis & Breads', per100g: nut(240, 5, 32, 10, 3, 1.5, 300, 25, 1.8, 200, 5), servings: [piece(120, 'paratha')], source: 'INDB' },
  { slug: 'plain-paratha', name: 'Plain Paratha', aliases: ['paratha', 'parantha'], category: 'Rotis & Breads', per100g: nut(320, 7, 44, 13, 4, 1.5, 350, 25, 2.2, 130, 0), servings: [piece(70, 'paratha')], source: 'INDB' },
  { slug: 'naan', name: 'Naan', aliases: ['butter naan'], category: 'Rotis & Breads', per100g: nut(310, 9, 50, 8, 2.2, 3.9, 450, 80, 2.7, 115, 0), servings: [piece(90, 'naan')], source: 'INDB' },
  { slug: 'bhatura', name: 'Bhatura', aliases: ['bhature'], category: 'Rotis & Breads', per100g: nut(330, 7, 42, 15, 2, 2, 400, 30, 2, 100, 0), servings: [piece(80, 'bhatura')], source: 'INDB' },
  { slug: 'puri', name: 'Puri', aliases: ['poori', 'fried puri'], category: 'Rotis & Breads', per100g: nut(360, 7, 45, 17, 3, 1, 200, 25, 2.2, 130, 0), servings: [piece(25, 'puri')], source: 'INDB' },
  { slug: 'bajra-roti', name: 'Bajra Roti', aliases: ['pearl millet roti', 'bajra bhakri'], category: 'Rotis & Breads', per100g: nut(280, 8, 50, 5, 6, 1.5, 250, 30, 5, 200, 0), servings: [piece(50, 'roti')], source: 'IFCT' },
  { slug: 'jowar-roti', name: 'Jowar Roti', aliases: ['sorghum roti', 'jowar bhakri'], category: 'Rotis & Breads', per100g: nut(270, 7, 55, 3, 4.5, 1.5, 250, 25, 3.5, 250, 0), servings: [piece(50, 'roti')], source: 'IFCT' },
  { slug: 'bread-white', name: 'White Bread', aliases: ['bread slice', 'pav', 'double roti'], category: 'Rotis & Breads', per100g: nut(265, 9, 49, 3.2, 2.7, 5, 490, 150, 3.6, 100, 0), servings: [piece(30, 'slice')], source: 'USDA' },
  { slug: 'bread-brown', name: 'Brown / Whole-wheat Bread', aliases: ['multigrain bread', 'atta bread'], category: 'Rotis & Breads', per100g: nut(250, 12, 43, 3.5, 6, 6, 450, 160, 2.5, 250, 0), servings: [piece(32, 'slice')], source: 'USDA' },
  { slug: 'ragi-roti', name: 'Ragi Roti', aliases: ['finger millet roti', 'nachni roti'], category: 'Rotis & Breads', per100g: nut(262, 6.5, 53, 2, 6, 1, 250, 320, 3, 200, 0), servings: [piece(40, 'roti')], source: 'IFCT' },
  { slug: 'makki-roti', name: 'Makki Roti', aliases: ['maize roti', 'corn roti'], category: 'Rotis & Breads', per100g: nut(290, 7, 56, 5, 6, 1, 250, 10, 2.5, 250, 0), servings: [piece(50, 'roti')], source: 'IFCT' },
  { slug: 'bagel-plain', name: 'Bagel (plain)', aliases: ['bagel', 'plain bagel'], category: 'Rotis & Breads', per100g: nut(257, 10, 50.9, 1.7, 2.2, 5.3, 490, 53, 3.6, 99, 0), servings: [piece(98, 'bagel'), { label: 'half bagel (49 g)', grams: 49 }], source: 'USDA' },
  { slug: 'whole-wheat-tortilla', name: 'Whole Wheat Tortilla', aliases: ['tortilla', 'wheat wrap', 'whole wheat wrap'], category: 'Rotis & Breads', per100g: nut(306, 8.2, 49, 7.4, 6, 2, 560, 100, 3, 180, 0), servings: [piece(49, 'tortilla'), piece(62, 'large tortilla')], source: 'USDA' },
  { slug: 'sourdough-bread', name: 'Sourdough Bread', aliases: ['sourdough', 'sour dough bread'], category: 'Rotis & Breads', per100g: nut(274, 8.8, 52, 2.4, 2.2, 2.5, 580, 35, 3.3, 120, 0), servings: [piece(50, 'slice'), piece(64, 'thick slice')], source: 'USDA' },
  { slug: 'rye-bread', name: 'Rye Bread', aliases: ['rye', 'rye loaf', 'dark rye bread'], category: 'Rotis & Breads', per100g: nut(259, 8.5, 48.3, 3.3, 5.8, 3.9, 603, 73, 2.8, 166, 0.4), servings: [piece(32, 'slice'), piece(48, 'thick slice')], source: 'USDA' },

  // ── South Indian ───────────────────────────────────────────────────────────
  { slug: 'idli', name: 'Idli', aliases: ['idly'], category: 'South Indian', per100g: nut(135, 4, 28, 0.5, 1, 0.5, 200, 15, 1, 60, 0), servings: [piece(40, 'idli')], source: 'INDB' },
  { slug: 'plain-dosa', name: 'Plain Dosa', aliases: ['dosa', 'sada dosa'], category: 'South Indian', per100g: nut(205, 4, 30, 7, 1.5, 0.6, 250, 12, 1.2, 90, 0), servings: [piece(80, 'dosa')], source: 'INDB' },
  { slug: 'masala-dosa', name: 'Masala Dosa', aliases: ['masala dose'], category: 'South Indian', per100g: nut(200, 4, 28, 8, 2, 1, 280, 15, 1.3, 150, 3), servings: [piece(150, 'dosa')], source: 'INDB' },
  { slug: 'medu-vada', name: 'Medu Vada', aliases: ['vada', 'urad vada'], category: 'South Indian', per100g: nut(280, 7, 30, 14, 3, 0.8, 300, 30, 1.5, 200, 0), servings: [piece(45, 'vada')], source: 'INDB' },
  { slug: 'uttapam', name: 'Uttapam', aliases: ['uthappam'], category: 'South Indian', per100g: nut(165, 4, 26, 5, 1.8, 1.5, 250, 20, 1.2, 120, 4), servings: [piece(120, 'uttapam')], source: 'INDB' },
  { slug: 'rava-idli', name: 'Rava Idli', aliases: ['sooji idli'], category: 'South Indian', per100g: nut(155, 4, 26, 4, 1.5, 1, 280, 20, 1, 90, 0), servings: [piece(45, 'idli')], source: 'INDB' },
  { slug: 'coconut-chutney', name: 'Coconut Chutney', aliases: ['nariyal chutney'], category: 'South Indian', per100g: nut(180, 3, 8, 15, 4, 3, 200, 15, 1.5, 150, 1), servings: [tbsp(20)], source: 'INDB' },
  { slug: 'appam', name: 'Appam', aliases: ['aappam', 'palappam', 'rice hopper'], category: 'South Indian', per100g: nut(120, 2.5, 24, 1.5, 1, 3, 150, 10, 0.8, 80, 0), servings: [piece(60, 'appam')], source: 'IFCT' },
  { slug: 'ven-pongal', name: 'Ven Pongal', aliases: ['pongal', 'khara pongal', 'ghee pongal'], category: 'South Indian', per100g: nut(200, 5, 30, 7, 2, 0.5, 300, 20, 1.2, 100, 0), servings: [{ label: '1 plate (200 g)', grams: 200 }], source: 'IFCT' },

  // ── Vegetables & Sabzi (cooked) ───────────────────────────────────────────
  { slug: 'aloo-gobi', name: 'Aloo Gobi', aliases: ['potato cauliflower'], category: 'Vegetables & Sabzi', per100g: nut(120, 3, 14, 6, 3.5, 3, 300, 30, 1, 350, 25), servings: [katori(150)], source: 'INDB' },
  { slug: 'aloo-matar', name: 'Aloo Matar', aliases: ['potato peas'], category: 'Vegetables & Sabzi', per100g: nut(118, 3.5, 16, 5, 4, 3.5, 300, 30, 1.2, 330, 12), servings: [katori(150)], source: 'INDB' },
  { slug: 'bhindi-fry', name: 'Bhindi Fry', aliases: ['okra', 'ladyfinger'], category: 'Vegetables & Sabzi', per100g: nut(130, 2.5, 10, 9, 3.5, 2, 280, 75, 0.7, 300, 13), servings: [katori(150)], source: 'INDB' },
  { slug: 'baingan-bharta', name: 'Baingan Bharta', aliases: ['brinjal', 'eggplant bharta'], category: 'Vegetables & Sabzi', per100g: nut(110, 2.5, 10, 7, 3.5, 5, 300, 25, 0.5, 250, 6), servings: [katori(150)], source: 'INDB' },
  { slug: 'mixed-veg', name: 'Mixed Vegetable Sabzi', aliases: ['mix veg', 'sabzi'], category: 'Vegetables & Sabzi', per100g: nut(115, 3, 12, 6, 4, 4, 300, 40, 1.2, 300, 20), servings: [katori(150)], source: 'INDB' },
  { slug: 'palak-sabzi', name: 'Palak Sabzi', aliases: ['spinach', 'saag'], category: 'Vegetables & Sabzi', per100g: nut(95, 3.5, 7, 6, 3, 1, 350, 130, 2.5, 450, 20), servings: [katori(150)], source: 'INDB' },
  { slug: 'palak-paneer', name: 'Palak Paneer', aliases: ['saag paneer'], category: 'Vegetables & Sabzi', per100g: nut(160, 7, 8, 11, 2.5, 2, 350, 200, 2, 350, 15), servings: [katori(150)], source: 'INDB' },
  { slug: 'aloo-jeera', name: 'Aloo Jeera', aliases: ['jeera aloo', 'cumin potato'], category: 'Vegetables & Sabzi', per100g: nut(130, 2.5, 20, 5, 2.5, 1.5, 300, 15, 0.8, 400, 12), servings: [katori(150)], source: 'INDB' },
  { slug: 'matar-paneer', name: 'Matar Paneer', aliases: ['peas paneer'], category: 'Vegetables & Sabzi', per100g: nut(170, 7, 12, 10, 3, 4, 350, 180, 1.5, 250, 8), servings: [katori(150)], source: 'INDB' },
  { slug: 'paneer-butter-masala', name: 'Paneer Butter Masala', aliases: ['paneer makhani', 'shahi paneer'], category: 'Vegetables & Sabzi', per100g: nut(230, 8, 10, 18, 1.5, 5, 400, 200, 1, 200, 6), servings: [katori(150)], source: 'INDB' },
  { slug: 'bhindi-masala', name: 'Bhindi Masala', aliases: ['okra masala'], category: 'Vegetables & Sabzi', per100g: nut(125, 2.5, 11, 8, 3.5, 3, 300, 70, 0.8, 300, 13), servings: [katori(150)], source: 'INDB' },
  { slug: 'lauki-sabzi', name: 'Lauki Sabzi', aliases: ['bottle gourd', 'ghiya'], category: 'Vegetables & Sabzi', per100g: nut(75, 1.5, 7, 5, 1.5, 2, 250, 20, 0.4, 150, 8), servings: [katori(150)], source: 'INDB' },
  { slug: 'kadhi', name: 'Kadhi', aliases: ['besan kadhi', 'kadi'], category: 'Vegetables & Sabzi', per100g: nut(105, 3.5, 8, 6.5, 0.5, 3, 350, 90, 0.8, 150, 1), servings: [katori(150)], source: 'INDB' },

  // ── Paneer, Eggs, Dairy ────────────────────────────────────────────────────
  { slug: 'paneer-raw', name: 'Paneer (plain)', aliases: ['cottage cheese', 'panir'], category: 'Paneer, Egg & Dairy', per100g: nut(265, 18.3, 6.1, 20.8, 0, 6.1, 22, 420, 0.2, 138, 0), servings: [{ label: '1 cube (15 g)', grams: 15 }, katori(100)], source: 'IFCT' },
  { slug: 'tofu', name: 'Tofu', aliases: ['soya paneer', 'bean curd'], category: 'Paneer, Egg & Dairy', per100g: nut(144, 15.8, 4.3, 8.7, 2.3, 0.6, 14, 350, 2.7, 121, 0.1), servings: [katori(100)], source: 'USDA' },
  { slug: 'egg-boiled', name: 'Boiled Egg', aliases: ['anda', 'egg', 'whole egg'], category: 'Paneer, Egg & Dairy', per100g: nut(155, 12.6, 1.1, 10.6, 0, 1.1, 124, 50, 1.2, 126, 0), servings: [piece(50, 'egg')], source: 'USDA' },
  { slug: 'egg-omelette', name: 'Egg Omelette', aliases: ['omelette', 'anda bhurji'], category: 'Paneer, Egg & Dairy', per100g: nut(195, 10.6, 2, 15.9, 0, 1.3, 300, 56, 1.4, 142, 0), servings: [piece(60, 'egg')], source: 'INDB' },
  { slug: 'egg-white', name: 'Egg White (boiled)', aliases: ['egg whites', 'anda safedi'], category: 'Paneer, Egg & Dairy', per100g: nut(52, 10.9, 0.7, 0.2, 0, 0.7, 166, 7, 0.1, 163, 0), servings: [piece(33, 'egg white')], source: 'USDA' },
  { slug: 'milk-full', name: 'Milk (full cream)', aliases: ['doodh', 'whole milk'], category: 'Paneer, Egg & Dairy', per100g: nut(62, 3.2, 4.7, 3.5, 0, 4.7, 44, 120, 0.1, 150, 1), servings: [glass(200), cup(150)], source: 'IFCT' },
  { slug: 'milk-toned', name: 'Milk (toned)', aliases: ['toned milk', 'low fat milk'], category: 'Paneer, Egg & Dairy', per100g: nut(47, 3.2, 4.7, 1.5, 0, 4.7, 44, 120, 0.1, 150, 1), servings: [glass(200), cup(150)], source: 'IFCT' },
  { slug: 'curd-dahi', name: 'Curd / Dahi', aliases: ['yogurt', 'dahi'], category: 'Paneer, Egg & Dairy', per100g: nut(60, 3.1, 4.7, 3.3, 0, 4.7, 46, 149, 0.1, 180, 0.5), servings: [katori(150), bowl(250)], source: 'IFCT' },
  { slug: 'greek-yogurt', name: 'Greek Yogurt (plain)', aliases: ['hung curd', 'greek curd'], category: 'Paneer, Egg & Dairy', per100g: nut(97, 9, 3.9, 5, 0, 3.9, 35, 100, 0.1, 141, 0), servings: [katori(150)], source: 'USDA' },
  { slug: 'buttermilk', name: 'Buttermilk (chaas)', aliases: ['chaas', 'chaach', 'mattha'], category: 'Paneer, Egg & Dairy', per100g: nut(40, 2.5, 4.5, 1, 0, 4.5, 105, 116, 0.1, 151, 1), servings: [glass(200)], source: 'INDB' },
  { slug: 'lassi-sweet', name: 'Sweet Lassi', aliases: ['lassi'], category: 'Paneer, Egg & Dairy', per100g: nut(100, 2.5, 16, 3, 0, 15, 40, 90, 0.1, 130, 0.5), servings: [glass(250)], source: 'INDB' },
  { slug: 'ghee', name: 'Ghee', aliases: ['clarified butter', 'desi ghee'], category: 'Paneer, Egg & Dairy', per100g: nut(900, 0, 0, 100, 0, 0, 0, 0, 0, 0, 0), servings: [tsp(5), tbsp(14)], source: 'IFCT' },
  { slug: 'butter', name: 'Butter', aliases: ['makhan'], category: 'Paneer, Egg & Dairy', per100g: nut(717, 0.9, 0.1, 81.1, 0, 0.1, 11, 24, 0, 24, 0), servings: [tsp(5), tbsp(14)], source: 'USDA' },
  { slug: 'cheese', name: 'Cheese (processed)', aliases: ['cheese slice', 'amul cheese'], category: 'Paneer, Egg & Dairy', per100g: nut(350, 20, 3, 28, 0, 0.5, 621, 700, 0.7, 98, 0), servings: [piece(20, 'slice')], source: 'USDA' },
  { slug: 'mozzarella-cheese', name: 'Mozzarella Cheese', aliases: ['mozzarella', 'pizza cheese'], category: 'Paneer, Egg & Dairy', per100g: nut(300, 22.2, 2.2, 22.4, 0, 1, 627, 505, 0.4, 76, 0), servings: [piece(20, 'slice'), { label: '1 cube (15 g)', grams: 15 }], source: 'USDA' },
  { slug: 'cheddar-cheese', name: 'Cheddar Cheese', aliases: ['cheddar', 'yellow cheese'], category: 'Paneer, Egg & Dairy', per100g: nut(404, 22.9, 3.1, 33.3, 0, 0.5, 653, 721, 0.7, 98, 0), servings: [piece(20, 'slice'), { label: '1 cube (15 g)', grams: 15 }], source: 'USDA' },
  { slug: 'cream-cheese', name: 'Cream Cheese', aliases: ['cream cheese spread', 'philadelphia cheese'], category: 'Paneer, Egg & Dairy', per100g: nut(342, 6.2, 5.5, 34.2, 0, 3.2, 321, 98, 0.1, 138, 0), servings: [tbsp(15), piece(20, 'portion')], source: 'USDA' },
  { slug: 'paneer-low-fat', name: 'Paneer / Cottage Cheese (low-fat)', aliases: ['low fat paneer', 'cottage cheese low fat', 'low fat cottage cheese'], category: 'Paneer, Egg & Dairy', per100g: nut(72, 12.4, 2.7, 1, 0, 2.7, 330, 86, 0.1, 84, 0), servings: [{ label: '1 cube (15 g)', grams: 15 }, katori(100)], source: 'USDA' },

  // ── Chicken, Fish & Meat (cooked) ──────────────────────────────────────────
  { slug: 'chicken-curry', name: 'Chicken Curry', aliases: ['chicken masala', 'murgh'], category: 'Chicken, Fish & Meat', per100g: nut(180, 15, 4, 12, 1, 2.5, 420, 30, 1.4, 250, 4), servings: [katori(150)], source: 'INDB' },
  { slug: 'butter-chicken', name: 'Butter Chicken', aliases: ['murgh makhani'], category: 'Chicken, Fish & Meat', per100g: nut(240, 14, 6, 18, 1, 4, 450, 60, 1.2, 240, 3), servings: [katori(150)], source: 'INDB' },
  { slug: 'chicken-tandoori', name: 'Tandoori Chicken', aliases: ['tandoori', 'grilled chicken'], category: 'Chicken, Fish & Meat', per100g: nut(175, 25, 2, 8, 0.5, 1.5, 400, 40, 1.3, 300, 1), servings: [piece(100, 'piece')], source: 'INDB' },
  { slug: 'chicken-breast-cooked', name: 'Chicken Breast (grilled)', aliases: ['boiled chicken', 'chicken breast'], category: 'Chicken, Fish & Meat', per100g: nut(165, 31, 0, 3.6, 0, 0, 74, 15, 1, 256, 0), servings: [piece(100, 'piece')], source: 'USDA' },
  { slug: 'egg-curry', name: 'Egg Curry', aliases: ['anda curry'], category: 'Chicken, Fish & Meat', per100g: nut(160, 8, 5, 12, 1, 3, 400, 55, 1.6, 180, 3), servings: [katori(150)], source: 'INDB' },
  { slug: 'fish-curry', name: 'Fish Curry', aliases: ['machli', 'macher jhol'], category: 'Chicken, Fish & Meat', per100g: nut(150, 14, 4, 9, 1, 2.5, 400, 40, 1.2, 280, 3), servings: [katori(150)], source: 'INDB' },
  { slug: 'fish-fry', name: 'Fish Fry', aliases: ['fried fish', 'machli fry'], category: 'Chicken, Fish & Meat', per100g: nut(200, 18, 6, 12, 0.5, 0.5, 350, 40, 1.3, 300, 0), servings: [piece(80, 'piece')], source: 'INDB' },
  { slug: 'mutton-curry', name: 'Mutton Curry', aliases: ['gosht', 'lamb curry', 'goat curry'], category: 'Chicken, Fish & Meat', per100g: nut(230, 16, 4, 17, 1, 2.5, 400, 25, 2.2, 250, 2), servings: [katori(150)], source: 'INDB' },
  { slug: 'prawn-curry', name: 'Prawn Curry', aliases: ['jhinga', 'shrimp curry'], category: 'Chicken, Fish & Meat', per100g: nut(145, 15, 4, 8, 1, 2.5, 500, 70, 1.5, 220, 3), servings: [katori(150)], source: 'INDB' },
  { slug: 'keema', name: 'Keema (minced meat)', aliases: ['kheema', 'minced mutton'], category: 'Chicken, Fish & Meat', per100g: nut(215, 15, 5, 15, 1.5, 2.5, 400, 25, 2, 280, 3), servings: [katori(150)], source: 'INDB' },
  { slug: 'chicken-breast-raw', name: 'Chicken Breast (raw)', aliases: ['raw chicken breast'], category: 'Chicken, Fish & Meat', per100g: nut(120, 22.5, 0, 2.6, 0, 0, 45, 5, 0.4, 334, 0), servings: [piece(120, 'breast')], source: 'USDA' },
  { slug: 'chicken-thigh-raw', name: 'Chicken Thigh (raw)', aliases: ['raw chicken thigh'], category: 'Chicken, Fish & Meat', per100g: nut(119, 19.7, 0, 4.1, 0, 0, 86, 6, 0.9, 230, 0), servings: [piece(90, 'thigh')], source: 'USDA' },
  { slug: 'chicken-thigh-cooked', name: 'Chicken Thigh (boiled)', aliases: ['boiled chicken thigh'], category: 'Chicken, Fish & Meat', per100g: nut(209, 26, 0, 10.9, 0, 0, 88, 8, 1.3, 240, 0), servings: [piece(90, 'thigh')], source: 'USDA' },
  { slug: 'chicken-liver-raw', name: 'Chicken Liver (raw)', aliases: ['kaleji', 'liver'], category: 'Chicken, Fish & Meat', per100g: nut(119, 16.9, 0.7, 4.8, 0, 0, 71, 8, 9, 230, 17.9), servings: [piece(60, 'piece')], source: 'USDA' },
  { slug: 'chicken-liver-cooked', name: 'Chicken Liver (boiled)', aliases: ['kaleji cooked'], category: 'Chicken, Fish & Meat', per100g: nut(167, 24.5, 1.1, 6.5, 0, 0, 80, 11, 11.6, 263, 27.9), servings: [piece(60, 'piece')], source: 'USDA' },
  { slug: 'white-fish-raw', name: 'White Fish, lean (raw)', aliases: ['fish raw', 'lean fish'], category: 'Chicken, Fish & Meat', per100g: nut(96, 20.1, 0, 1.7, 0, 0, 60, 15, 0.4, 400, 0), servings: [piece(120, 'fillet')], source: 'USDA' },
  { slug: 'white-fish-cooked', name: 'White Fish, lean (boiled)', aliases: ['fish boiled', 'lean fish cooked'], category: 'Chicken, Fish & Meat', per100g: nut(128, 26.2, 0, 2.7, 0, 0, 80, 20, 0.5, 450, 0), servings: [piece(120, 'fillet')], source: 'USDA' },
  { slug: 'salmon-raw', name: 'Salmon (raw)', aliases: [], category: 'Chicken, Fish & Meat', per100g: nut(208, 20.4, 0, 13.4, 0, 0, 59, 9, 0.3, 363, 0), servings: [piece(120, 'fillet')], source: 'USDA' },
  { slug: 'salmon-cooked', name: 'Salmon (boiled)', aliases: [], category: 'Chicken, Fish & Meat', per100g: nut(232, 25.4, 0, 14.6, 0, 0, 66, 15, 0.3, 384, 0), servings: [piece(120, 'fillet')], source: 'USDA' },
  { slug: 'rohu-raw', name: 'Rohu Fish (raw)', aliases: ['rohu'], category: 'Chicken, Fish & Meat', per100g: nut(97, 17.8, 0, 2.4, 0, 0, 55, 150, 0.9, 320, 0), servings: [piece(120, 'piece')], source: 'IFCT' },
  { slug: 'rohu-cooked', name: 'Rohu Fish (boiled)', aliases: ['rohu cooked'], category: 'Chicken, Fish & Meat', per100g: nut(129, 24, 0, 3.2, 0, 0, 65, 180, 1.1, 380, 0), servings: [piece(120, 'piece')], source: 'IFCT' },
  { slug: 'katla-raw', name: 'Katla Fish (raw)', aliases: ['catla'], category: 'Chicken, Fish & Meat', per100g: nut(111, 18.5, 0, 3.8, 0, 0, 55, 150, 1, 310, 0), servings: [piece(120, 'piece')], source: 'IFCT' },
  { slug: 'katla-cooked', name: 'Katla Fish (boiled)', aliases: ['catla cooked'], category: 'Chicken, Fish & Meat', per100g: nut(145, 24.5, 0, 5, 0, 0, 65, 180, 1.2, 370, 0), servings: [piece(120, 'piece')], source: 'IFCT' },
  { slug: 'tilapia-raw', name: 'Tilapia (raw)', aliases: [], category: 'Chicken, Fish & Meat', per100g: nut(96, 20.1, 0, 1.7, 0, 0, 52, 10, 0.6, 302, 0), servings: [piece(120, 'fillet')], source: 'USDA' },
  { slug: 'tilapia-cooked', name: 'Tilapia (boiled)', aliases: [], category: 'Chicken, Fish & Meat', per100g: nut(128, 26.2, 0, 2.7, 0, 0, 56, 14, 0.7, 380, 0), servings: [piece(120, 'fillet')], source: 'USDA' },
  { slug: 'pomfret-raw', name: 'Pomfret (raw)', aliases: ['paplet'], category: 'Chicken, Fish & Meat', per100g: nut(114, 19.3, 0, 4, 0, 0, 90, 30, 1, 350, 0), servings: [piece(120, 'piece')], source: 'IFCT' },
  { slug: 'pomfret-cooked', name: 'Pomfret (boiled)', aliases: ['paplet cooked'], category: 'Chicken, Fish & Meat', per100g: nut(146, 25.4, 0, 5.2, 0, 0, 100, 40, 1.2, 420, 0), servings: [piece(120, 'piece')], source: 'IFCT' },
  { slug: 'tuna-raw', name: 'Tuna (raw)', aliases: [], category: 'Chicken, Fish & Meat', per100g: nut(109, 24.4, 0, 0.5, 0, 0, 45, 4, 0.8, 441, 0), servings: [piece(120, 'fillet')], source: 'USDA' },
  { slug: 'tuna-cooked', name: 'Tuna (boiled)', aliases: [], category: 'Chicken, Fish & Meat', per100g: nut(132, 29.9, 0, 1, 0, 0, 54, 5, 1, 522, 0), servings: [piece(120, 'fillet')], source: 'USDA' },
  { slug: 'prawns-raw', name: 'Prawns (raw)', aliases: ['shrimp', 'jhinga'], category: 'Chicken, Fish & Meat', per100g: nut(85, 20.1, 0.2, 0.5, 0, 0, 119, 54, 0.2, 259, 0), servings: [katori(100)], source: 'USDA' },
  { slug: 'prawns-cooked', name: 'Prawns (boiled)', aliases: ['shrimp cooked', 'jhinga boiled'], category: 'Chicken, Fish & Meat', per100g: nut(99, 24, 0.2, 0.8, 0, 0, 111, 70, 0.3, 259, 0), servings: [katori(100)], source: 'USDA' },
  { slug: 'mutton-raw', name: 'Mutton, lean (raw)', aliases: ['lamb raw', 'goat raw', 'gosht raw'], category: 'Chicken, Fish & Meat', per100g: nut(143, 20.3, 0, 6.9, 0, 0, 82, 12, 2, 385, 0), servings: [piece(120, 'piece')], source: 'USDA' },
  { slug: 'mutton-cooked', name: 'Mutton, lean (boiled)', aliases: ['lamb cooked', 'goat cooked', 'gosht boiled'], category: 'Chicken, Fish & Meat', per100g: nut(206, 29.2, 0, 9.6, 0, 0, 90, 15, 3, 400, 0), servings: [piece(120, 'piece')], source: 'USDA' },
  { slug: 'beef-raw', name: 'Beef, lean (raw)', aliases: [], category: 'Chicken, Fish & Meat', per100g: nut(137, 21.4, 0, 5, 0, 0, 55, 12, 1.8, 330, 0), servings: [piece(120, 'piece')], source: 'USDA' },
  { slug: 'beef-cooked', name: 'Beef, lean (boiled)', aliases: [], category: 'Chicken, Fish & Meat', per100g: nut(188, 29, 0, 7.6, 0, 0, 60, 15, 2.5, 350, 0), servings: [piece(120, 'piece')], source: 'USDA' },
  { slug: 'turkey-raw', name: 'Turkey Breast (raw)', aliases: [], category: 'Chicken, Fish & Meat', per100g: nut(114, 23.7, 0, 1.6, 0, 0, 63, 8, 0.7, 300, 0), servings: [piece(120, 'piece')], source: 'USDA' },
  { slug: 'turkey-cooked', name: 'Turkey Breast (boiled)', aliases: [], category: 'Chicken, Fish & Meat', per100g: nut(135, 29, 0, 1.8, 0, 0, 70, 10, 0.9, 320, 0), servings: [piece(120, 'piece')], source: 'USDA' },
  { slug: 'chicken-drumstick-cooked', name: 'Chicken Drumstick (cooked)', aliases: ['drumstick', 'roasted chicken drumstick', 'chicken leg'], category: 'Chicken, Fish & Meat', per100g: nut(172, 28.3, 0, 5.7, 0, 0, 95, 12, 1.3, 240, 0), servings: [piece(44, 'drumstick'), piece(100, 'piece')], source: 'USDA' },
  { slug: 'chicken-wings-cooked', name: 'Chicken Wings (cooked)', aliases: ['chicken wing', 'roasted wings', 'buffalo wing base'], category: 'Chicken, Fish & Meat', per100g: nut(290, 26.9, 0, 19.5, 0, 0, 82, 14, 1.2, 210, 0), servings: [piece(34, 'wing'), piece(100, 'piece')], source: 'USDA' },
  { slug: 'bacon-cooked', name: 'Bacon (cooked)', aliases: ['pork bacon', 'fried bacon', 'streaky bacon'], category: 'Chicken, Fish & Meat', per100g: nut(541, 37, 1.4, 42, 0, 0, 1717, 11, 1.4, 565, 0), servings: [piece(8, 'slice'), piece(100, 'piece')], source: 'USDA' },
  { slug: 'pork-chop-cooked', name: 'Pork Chop (cooked)', aliases: ['pork loin chop', 'grilled pork chop', 'pork cutlet'], category: 'Chicken, Fish & Meat', per100g: nut(231, 25.7, 0, 13.9, 0, 0, 62, 20, 0.7, 360, 0), servings: [piece(120, 'chop'), piece(100, 'piece')], source: 'USDA' },
  { slug: 'sardines', name: 'Sardines (canned in oil, drained)', aliases: ['canned sardines', 'pilchards', 'tinned sardines'], category: 'Chicken, Fish & Meat', per100g: nut(208, 24.6, 0, 11.5, 0, 0, 307, 382, 2.9, 397, 0), servings: [{ label: '1 can (92 g)', grams: 92 }, katori(100)], source: 'USDA' },
  { slug: 'mackerel-bangda', name: 'Mackerel (Bangda, cooked)', aliases: ['bangda', 'indian mackerel', 'bangude', 'aiyla'], category: 'Chicken, Fish & Meat', per100g: nut(180, 25, 0, 8.5, 0, 0, 90, 50, 2, 400, 0), servings: [katori(100)], source: 'IFCT' },
  { slug: 'crab-cooked', name: 'Crab (cooked)', aliases: ['blue crab', 'crab meat', 'kekda'], category: 'Chicken, Fish & Meat', per100g: nut(97, 19.4, 0, 1.5, 0, 0, 395, 89, 0.8, 262, 0), servings: [katori(100)], source: 'USDA' },

  // ── Snacks & Street Food ───────────────────────────────────────────────────
  { slug: 'samosa', name: 'Samosa', aliases: ['singara'], category: 'Snacks & Street Food', per100g: nut(300, 5, 32, 17, 3, 2, 400, 25, 1.5, 250, 4), servings: [piece(60, 'samosa')], source: 'INDB' },
  { slug: 'kachori', name: 'Kachori', aliases: ['kachauri'], category: 'Snacks & Street Food', per100g: nut(330, 6, 35, 18, 3, 1.5, 450, 30, 2, 200, 0), servings: [piece(50, 'kachori')], source: 'INDB' },
  { slug: 'pakora', name: 'Pakora / Bhaji', aliases: ['bhajiya', 'bajji', 'fritter'], category: 'Snacks & Street Food', per100g: nut(315, 6, 28, 20, 4, 2, 400, 40, 2, 300, 3), servings: [piece(25, 'pakora')], source: 'INDB' },
  { slug: 'vada-pav', name: 'Vada Pav', aliases: ['wada pav'], category: 'Snacks & Street Food', per100g: nut(290, 6, 40, 12, 3, 3, 500, 50, 2.2, 250, 5), servings: [piece(150, 'vada pav')], source: 'INDB' },
  { slug: 'pav-bhaji', name: 'Pav Bhaji', aliases: ['bhaji pav'], category: 'Snacks & Street Food', per100g: nut(180, 4, 22, 9, 3, 3, 450, 40, 1.8, 300, 10), servings: [{ label: '1 plate (300 g)', grams: 300 }], source: 'INDB' },
  { slug: 'dhokla', name: 'Dhokla', aliases: ['khaman'], category: 'Snacks & Street Food', per100g: nut(160, 6, 26, 4, 2.5, 4, 400, 30, 1.5, 180, 1), servings: [piece(40, 'piece')], source: 'INDB' },
  { slug: 'chole-bhature', name: 'Chole Bhature', aliases: ['chhole bhature'], category: 'Snacks & Street Food', per100g: nut(250, 7, 30, 11, 5, 2, 450, 45, 2.5, 300, 3), servings: [{ label: '1 plate (350 g)', grams: 350 }], source: 'INDB' },
  { slug: 'pani-puri', name: 'Pani Puri', aliases: ['golgappa', 'puchka', 'gol gappe'], category: 'Snacks & Street Food', per100g: nut(180, 3, 30, 5, 2, 3, 400, 20, 1.5, 150, 2), servings: [piece(20, 'piece')], source: 'INDB' },
  { slug: 'bhel-puri', name: 'Bhel Puri', aliases: ['bhelpuri'], category: 'Snacks & Street Food', per100g: nut(220, 5, 34, 7, 4, 4, 500, 30, 2, 250, 8), servings: [katori(100)], source: 'INDB' },
  { slug: 'aloo-tikki', name: 'Aloo Tikki', aliases: ['potato tikki', 'tikki'], category: 'Snacks & Street Food', per100g: nut(210, 3, 26, 10, 2.5, 2, 350, 15, 1.2, 350, 8), servings: [piece(60, 'tikki')], source: 'INDB' },
  { slug: 'spring-roll', name: 'Veg Spring Roll', aliases: ['spring roll'], category: 'Snacks & Street Food', per100g: nut(250, 5, 30, 12, 2.5, 3, 450, 25, 1.3, 200, 6), servings: [piece(60, 'roll')], source: 'INDB' },
  { slug: 'maggi', name: 'Maggi Noodles (cooked)', aliases: ['instant noodles', 'noodles'], category: 'Snacks & Street Food', per100g: nut(175, 4, 25, 6.5, 1.5, 1.5, 600, 15, 1.5, 90, 0), servings: [{ label: '1 pack cooked (200 g)', grams: 200 }], source: 'INDB' },
  { slug: 'poha-chivda', name: 'Namkeen (chivda/mixture)', aliases: ['mixture', 'chivda', 'namkeen'], category: 'Snacks & Street Food', per100g: nut(490, 12, 50, 27, 6, 5, 700, 40, 3, 400, 1), servings: [katori(30)], source: 'INDB' },
  { slug: 'biscuit-marie', name: 'Marie Biscuit', aliases: ['biscuit', 'parle g', 'tea biscuit'], category: 'Snacks & Street Food', per100g: nut(440, 7, 78, 11, 2.5, 20, 300, 30, 2.5, 120, 0), servings: [piece(5, 'biscuit')], source: 'USDA' },
  { slug: 'roasted-chana', name: 'Roasted Chana (dry)', aliases: ['bhuna chana', 'roasted gram'], category: 'Snacks & Street Food', per100g: nut(369, 22.5, 60.7, 5.3, 18, 10, 30, 58, 4.6, 800, 0), servings: [katori(30), tbsp(15)], source: 'IFCT' },
  { slug: 'makhana', name: 'Makhana (fox nuts, roasted)', aliases: ['fox nuts', 'phool makhana', 'lotus seeds'], category: 'Snacks & Street Food', per100g: nut(347, 9.7, 76.9, 0.1, 7.6, 0.1, 20, 60, 1.4, 500, 0), servings: [katori(20)], source: 'IFCT' },
  { slug: 'popcorn', name: 'Popcorn (air-popped, plain)', aliases: [], category: 'Snacks & Street Food', per100g: nut(387, 12.9, 77.8, 4.5, 14.5, 0.9, 8, 7, 3.2, 329, 0), servings: [{ label: '1 bowl (15 g)', grams: 15 }], source: 'USDA' },
  { slug: 'veg-momos', name: 'Veg Momos (steamed)', aliases: ['vegetable momos', 'steamed momos', 'veg dim sum'], category: 'Snacks & Street Food', per100g: nut(180, 5, 30, 4, 2, 2, 350, 25, 1.5, 150, 5), servings: [piece(25, 'momo'), { label: '1 plate (150 g)', grams: 150 }], source: 'INDB' },
  { slug: 'chicken-momos', name: 'Chicken Momos (steamed)', aliases: ['chicken dumplings', 'steamed chicken momos'], category: 'Snacks & Street Food', per100g: nut(200, 9, 27, 6, 1.5, 1.5, 380, 20, 1.3, 170, 2), servings: [piece(28, 'momo'), { label: '1 plate (168 g)', grams: 168 }], source: 'INDB' },
  { slug: 'french-fries', name: 'French Fries', aliases: ['fries', 'potato fries', 'finger chips'], category: 'Snacks & Street Food', per100g: nut(312, 3.4, 41, 15, 3.8, 0.3, 210, 18, 0.8, 579, 5.4), servings: [{ label: '1 plate (100 g)', grams: 100 }], source: 'USDA' },
  { slug: 'veg-burger', name: 'Veg Burger', aliases: ['vegetable burger', 'aloo tikki burger'], category: 'Snacks & Street Food', per100g: nut(250, 7, 33, 10, 3, 5, 450, 80, 2.5, 200, 2), servings: [piece(130, 'burger')], source: 'INDB' },
  { slug: 'chicken-burger', name: 'Chicken Burger', aliases: ['chicken sandwich burger', 'crispy chicken burger'], category: 'Snacks & Street Food', per100g: nut(260, 13, 28, 11, 2, 4, 480, 70, 2, 220, 1), servings: [piece(150, 'burger')], source: 'USDA' },
  { slug: 'pizza-margherita-slice', name: 'Pizza Margherita Slice', aliases: ['margherita pizza', 'cheese pizza slice', 'pizza slice'], category: 'Snacks & Street Food', per100g: nut(266, 11, 33, 10, 2.3, 3.5, 550, 180, 2.5, 180, 1), servings: [piece(100, 'slice')], source: 'USDA' },
  { slug: 'veg-hakka-noodles', name: 'Veg Hakka Noodles', aliases: ['hakka noodles', 'chowmein', 'veg chow mein'], category: 'Snacks & Street Food', per100g: nut(180, 5, 28, 6, 2.5, 3, 500, 25, 1.5, 150, 4), servings: [{ label: '1 plate (200 g)', grams: 200 }], source: 'INDB' },

  // ── Fruits ─────────────────────────────────────────────────────────────────
  { slug: 'banana', name: 'Banana', aliases: ['kela'], category: 'Fruits', per100g: nut(89, 1.1, 22.8, 0.3, 2.6, 12.2, 1, 5, 0.3, 358, 8.7), servings: [piece(120, 'banana')], source: 'USDA' },
  { slug: 'apple', name: 'Apple', aliases: ['seb'], category: 'Fruits', per100g: nut(52, 0.3, 13.8, 0.2, 2.4, 10.4, 1, 6, 0.1, 107, 4.6), servings: [piece(180, 'apple')], source: 'USDA' },
  { slug: 'mango', name: 'Mango', aliases: ['aam'], category: 'Fruits', per100g: nut(60, 0.8, 15, 0.4, 1.6, 13.7, 1, 11, 0.2, 168, 36.4), servings: [piece(200, 'mango')], source: 'USDA' },
  { slug: 'orange', name: 'Orange', aliases: ['santra'], category: 'Fruits', per100g: nut(47, 0.9, 11.8, 0.1, 2.4, 9.4, 0, 40, 0.1, 181, 53.2), servings: [piece(130, 'orange')], source: 'USDA' },
  { slug: 'grapes', name: 'Grapes', aliases: ['angoor'], category: 'Fruits', per100g: nut(69, 0.7, 18.1, 0.2, 0.9, 15.5, 2, 10, 0.4, 191, 3.2), servings: [katori(100)], source: 'USDA' },
  { slug: 'papaya', name: 'Papaya', aliases: ['papita'], category: 'Fruits', per100g: nut(43, 0.5, 10.8, 0.3, 1.7, 7.8, 8, 20, 0.3, 182, 60.9), servings: [katori(140)], source: 'USDA' },
  { slug: 'guava', name: 'Guava', aliases: ['amrood'], category: 'Fruits', per100g: nut(68, 2.6, 14.3, 1, 5.4, 8.9, 2, 18, 0.3, 417, 228.3), servings: [piece(120, 'guava')], source: 'USDA' },
  { slug: 'watermelon', name: 'Watermelon', aliases: ['tarbooj'], category: 'Fruits', per100g: nut(30, 0.6, 7.6, 0.2, 0.4, 6.2, 1, 7, 0.2, 112, 8.1), servings: [katori(150)], source: 'USDA' },
  { slug: 'pomegranate', name: 'Pomegranate', aliases: ['anar'], category: 'Fruits', per100g: nut(83, 1.7, 18.7, 1.2, 4, 13.7, 3, 10, 0.3, 236, 10.2), servings: [katori(100)], source: 'USDA' },
  { slug: 'grapes-black', name: 'Chikoo (Sapota)', aliases: ['sapota', 'chiku'], category: 'Fruits', per100g: nut(83, 0.4, 20, 1.1, 5.3, 12, 12, 21, 0.8, 193, 14.7), servings: [piece(90, 'chikoo')], source: 'IFCT' },
  { slug: 'dates', name: 'Dates', aliases: ['khajur'], category: 'Fruits', per100g: nut(282, 2.5, 75, 0.4, 8, 63.4, 2, 39, 1, 656, 0.4), servings: [piece(8, 'date')], source: 'USDA' },
  { slug: 'kiwi', name: 'Kiwi', aliases: ['kiwifruit'], category: 'Fruits', per100g: nut(61, 1.1, 14.7, 0.5, 3, 9, 3, 34, 0.3, 312, 92.7), servings: [piece(75, 'kiwi')], source: 'USDA' },
  { slug: 'dragon-fruit', name: 'Dragon Fruit', aliases: ['pitaya', 'kamalam'], category: 'Fruits', per100g: nut(60, 1.2, 13, 0.4, 3, 8, 0, 9, 0.7, 116, 3), servings: [cup(150), katori(150)], source: 'USDA' },
  { slug: 'pineapple', name: 'Pineapple', aliases: ['ananas'], category: 'Fruits', per100g: nut(50, 0.5, 13.1, 0.1, 1.4, 9.9, 1, 13, 0.3, 109, 47.8), servings: [katori(150), piece(80, 'slice')], source: 'USDA' },
  { slug: 'strawberry', name: 'Strawberry', aliases: ['strawberries'], category: 'Fruits', per100g: nut(32, 0.7, 7.7, 0.3, 2, 4.9, 1, 16, 0.4, 153, 58.8), servings: [katori(100), piece(12, 'strawberry')], source: 'USDA' },
  { slug: 'pear', name: 'Pear', aliases: ['nashpati'], category: 'Fruits', per100g: nut(57, 0.4, 15.2, 0.1, 3.1, 9.8, 1, 9, 0.2, 116, 4.3), servings: [piece(180, 'pear')], source: 'USDA' },
  { slug: 'litchi', name: 'Litchi', aliases: ['lychee'], category: 'Fruits', per100g: nut(66, 0.8, 16.5, 0.4, 1.3, 15.2, 1, 5, 0.3, 171, 71.5), servings: [piece(10, 'litchi'), katori(100)], source: 'USDA' },
  { slug: 'custard-apple', name: 'Custard Apple (Sitaphal)', aliases: ['sitaphal', 'sharifa'], category: 'Fruits', per100g: nut(94, 2.1, 23.6, 0.3, 4.4, 19, 9, 24, 0.6, 247, 36.3), servings: [katori(100)], source: 'IFCT' },
  { slug: 'muskmelon', name: 'Muskmelon', aliases: ['kharbooja', 'cantaloupe'], category: 'Fruits', per100g: nut(34, 0.8, 8.2, 0.2, 0.9, 7.9, 16, 9, 0.2, 267, 36.7), servings: [katori(150)], source: 'USDA' },
  { slug: 'jackfruit-ripe', name: 'Jackfruit (ripe)', aliases: ['kathal', 'chakka'], category: 'Fruits', per100g: nut(95, 1.7, 23.3, 0.6, 1.5, 19.1, 2, 24, 0.2, 448, 13.7), servings: [katori(100)], source: 'USDA' },
  { slug: 'avocado', name: 'Avocado', aliases: ['butter fruit', 'makhanphal'], category: 'Fruits', per100g: nut(160, 2, 8.5, 14.7, 6.7, 0.7, 7, 12, 0.6, 485, 10), servings: [{ label: '1/2 fruit (100 g)', grams: 100 }], source: 'USDA' },
  { slug: 'jamun', name: 'Jamun (Java Plum)', aliases: ['black plum', 'kala jamun'], category: 'Fruits', per100g: nut(60, 0.7, 15.6, 0.2, 0.6, 14, 14, 19, 0.2, 79, 14.3), servings: [katori(100)], source: 'IFCT' },
  { slug: 'amla', name: 'Amla (Indian Gooseberry)', aliases: ['gooseberry', 'nellikai'], category: 'Fruits', per100g: nut(44, 0.9, 10, 0.6, 4.3, 5, 1, 25, 0.3, 198, 300), servings: [piece(40, 'amla')], source: 'IFCT' },
  { slug: 'plum', name: 'Plum', aliases: ['aloobukhara'], category: 'Fruits', per100g: nut(46, 0.7, 11.4, 0.3, 1.4, 9.9, 0, 6, 0.2, 157, 9.5), servings: [piece(65, 'plum')], source: 'USDA' },
  { slug: 'peach', name: 'Peach', aliases: ['aadu'], category: 'Fruits', per100g: nut(39, 0.9, 9.5, 0.3, 1.5, 8.4, 0, 6, 0.3, 190, 6.6), servings: [piece(150, 'peach')], source: 'USDA' },
  { slug: 'fig-fresh', name: 'Fig (fresh, Anjeer)', aliases: ['anjeer', 'anjir'], category: 'Fruits', per100g: nut(74, 0.8, 19.2, 0.3, 2.9, 16.3, 1, 35, 0.4, 232, 2), servings: [piece(50, 'fig')], source: 'USDA' },
  { slug: 'raisins', name: 'Raisins (Kishmish)', aliases: ['kishmish', 'dry grapes'], category: 'Fruits', per100g: nut(299, 3.1, 79.2, 0.5, 3.7, 59.2, 11, 50, 1.9, 749, 2.3), servings: [tbsp(10)], source: 'USDA' },
  { slug: 'blueberry', name: 'Blueberries', aliases: ['blueberry'], category: 'Fruits', per100g: nut(57, 0.7, 14.5, 0.3, 2.4, 10, 1, 6, 0.3, 77, 9.7), servings: [katori(100)], source: 'USDA' },
  { slug: 'mosambi', name: 'Sweet Lime (Mosambi)', aliases: ['mosambi', 'sweet lime', 'musambi'], category: 'Fruits', per100g: nut(43, 0.8, 10.5, 0.2, 0.5, 9, 0, 40, 0.5, 200, 50), servings: [piece(120, 'mosambi')], source: 'IFCT' },
  { slug: 'cherries', name: 'Cherries (sweet, raw)', aliases: ['cherry'], category: 'Fruits', per100g: nut(63, 1.1, 16, 0.2, 2.1, 12.8, 0, 13, 0.4, 222, 7), servings: [katori(100)], source: 'USDA' },
  { slug: 'raspberry', name: 'Raspberry', aliases: ['red raspberry', 'raspberries'], category: 'Fruits', per100g: nut(52, 1.2, 11.9, 0.7, 6.5, 4.4, 1, 25, 0.7, 151, 26.2), servings: [katori(100), { label: '1 handful (30 g)', grams: 30 }], source: 'USDA' },
  { slug: 'blackberry', name: 'Blackberry', aliases: ['bramble', 'blackberries'], category: 'Fruits', per100g: nut(43, 1.4, 9.6, 0.5, 5.3, 4.9, 1, 29, 0.6, 162, 21), servings: [katori(100), { label: '1 handful (30 g)', grams: 30 }], source: 'USDA' },
  { slug: 'apricot-fresh', name: 'Apricot (fresh)', aliases: ['khubani', 'fresh apricot'], category: 'Fruits', per100g: nut(48, 1.4, 11.1, 0.4, 2, 9.2, 1, 13, 0.4, 259, 10), servings: [piece(35, 'apricot'), katori(100)], source: 'USDA' },
  { slug: 'dried-apricot', name: 'Dried Apricot', aliases: ['sukhi khubani', 'dried khubani'], category: 'Fruits', per100g: nut(241, 3.4, 62.6, 0.5, 7.3, 53.4, 10, 55, 2.7, 1162, 1), servings: [{ label: '5 pieces (40 g)', grams: 40 }, { label: '1 handful (30 g)', grams: 30 }], source: 'USDA' },
  { slug: 'prunes', name: 'Prunes (dried plum)', aliases: ['dried plum', 'sukha aloo bukhara'], category: 'Fruits', per100g: nut(240, 2.2, 63.9, 0.4, 7.1, 38.1, 2, 43, 0.9, 732, 0.6), servings: [{ label: '5 prunes (42 g)', grams: 42 }, { label: '1 handful (30 g)', grams: 30 }], source: 'USDA' },
  { slug: 'dried-cranberry', name: 'Dried Cranberry (sweetened)', aliases: ['craisins', 'sweetened cranberry'], category: 'Fruits', per100g: nut(308, 0.2, 82.8, 1.4, 5.7, 65, 3, 9, 0.5, 49, 0.2), servings: [{ label: '1 handful (40 g)', grams: 40 }, katori(100)], source: 'USDA' },
  { slug: 'passion-fruit', name: 'Passion Fruit', aliases: ['krishna phal', 'granadilla'], category: 'Fruits', per100g: nut(97, 2.2, 23.4, 0.7, 10.4, 11.2, 28, 12, 1.6, 348, 30), servings: [piece(18, 'fruit'), katori(100)], source: 'USDA' },
  { slug: 'star-fruit', name: 'Star Fruit (Carambola)', aliases: ['carambola', 'kamrakh'], category: 'Fruits', per100g: nut(31, 1, 6.7, 0.3, 2.8, 4, 2, 3, 0.1, 133, 34.4), servings: [piece(91, 'fruit'), katori(100)], source: 'USDA' },
  { slug: 'mangosteen', name: 'Mangosteen', aliases: ['mangostan', 'purple mangosteen'], category: 'Fruits', per100g: nut(73, 0.4, 17.9, 0.6, 1.8, 15.6, 7, 12, 0.3, 48, 2.9), servings: [katori(100), piece(80, 'fruit')], source: 'USDA' },

  // ── Nuts, Seeds & Oils ─────────────────────────────────────────────────────
  { slug: 'almonds', name: 'Almonds', aliases: ['badam'], category: 'Nuts, Seeds & Oils', per100g: nut(579, 21.2, 21.6, 49.9, 12.5, 4.4, 1, 269, 3.7, 733, 0), servings: [{ label: '10 pieces (12 g)', grams: 12 }, tbsp(10)], source: 'USDA' },
  { slug: 'peanuts', name: 'Peanuts', aliases: ['moongfali', 'groundnut'], category: 'Nuts, Seeds & Oils', per100g: nut(567, 25.8, 16.1, 49.2, 8.5, 4.7, 18, 92, 4.6, 705, 0), servings: [katori(30), tbsp(10)], source: 'USDA' },
  { slug: 'cashew', name: 'Cashew', aliases: ['kaju'], category: 'Nuts, Seeds & Oils', per100g: nut(553, 18.2, 30.2, 43.9, 3.3, 5.9, 12, 37, 6.7, 660, 0.5), servings: [{ label: '10 pieces (16 g)', grams: 16 }], source: 'USDA' },
  { slug: 'walnut', name: 'Walnut', aliases: ['akhrot'], category: 'Nuts, Seeds & Oils', per100g: nut(654, 15.2, 13.7, 65.2, 6.7, 2.6, 2, 98, 2.9, 441, 1.3), servings: [{ label: '2 halves (8 g)', grams: 8 }], source: 'USDA' },
  { slug: 'peanut-butter', name: 'Peanut Butter', aliases: ['moongfali butter'], category: 'Nuts, Seeds & Oils', per100g: nut(588, 25.1, 19.6, 50.4, 5.6, 9.2, 459, 49, 1.7, 558, 0), servings: [tbsp(16)], source: 'USDA' },
  { slug: 'cooking-oil', name: 'Cooking Oil', aliases: ['tel', 'refined oil', 'sunflower oil', 'mustard oil'], category: 'Nuts, Seeds & Oils', per100g: nut(884, 0, 0, 100, 0, 0, 0, 0, 0, 0, 0), servings: [tsp(5), tbsp(14)], source: 'IFCT' },
  { slug: 'coconut', name: 'Coconut (fresh)', aliases: ['nariyal'], category: 'Nuts, Seeds & Oils', per100g: nut(354, 3.3, 15.2, 33.5, 9, 6.2, 20, 14, 2.4, 356, 3.3), servings: [tbsp(15)], source: 'USDA' },
  { slug: 'chia-seeds', name: 'Chia Seeds', aliases: ['chia'], category: 'Nuts, Seeds & Oils', per100g: nut(486, 16.5, 42.1, 30.7, 34.4, 0, 16, 631, 7.7, 407, 1.6), servings: [tbsp(12)], source: 'USDA' },
  { slug: 'flax-seeds', name: 'Flax Seeds', aliases: ['alsi', 'flaxseed'], category: 'Nuts, Seeds & Oils', per100g: nut(534, 18.3, 28.9, 42.2, 27.3, 1.6, 30, 255, 5.7, 813, 0.6), servings: [tbsp(10)], source: 'USDA' },
  { slug: 'pistachios', name: 'Pistachios', aliases: ['pista'], category: 'Nuts, Seeds & Oils', per100g: nut(560, 20.2, 27.2, 45.3, 10.6, 7.7, 1, 105, 3.9, 1025, 5.6), servings: [{ label: '20 g (handful)', grams: 20 }], source: 'USDA' },
  { slug: 'pumpkin-seeds', name: 'Pumpkin Seeds', aliases: ['kaddu seeds'], category: 'Nuts, Seeds & Oils', per100g: nut(559, 30.2, 10.7, 49.1, 6, 1.4, 7, 46, 8.8, 809, 1.9), servings: [{ label: '20 g (2 tbsp)', grams: 20 }], source: 'USDA' },
  { slug: 'sunflower-seeds', name: 'Sunflower Seeds', aliases: ['surajmukhi seeds'], category: 'Nuts, Seeds & Oils', per100g: nut(584, 20.8, 20, 51.5, 8.6, 2.6, 9, 78, 5.3, 645, 1.4), servings: [{ label: '20 g (2 tbsp)', grams: 20 }], source: 'USDA' },
  { slug: 'sesame-seeds', name: 'Sesame Seeds', aliases: ['til'], category: 'Nuts, Seeds & Oils', per100g: nut(573, 17.7, 23.5, 49.7, 11.8, 0.3, 11, 975, 14.6, 468, 0), servings: [tbsp(9), { label: '20 g', grams: 20 }], source: 'USDA' },
  { slug: 'olive-oil', name: 'Olive Oil', aliases: ['jaitun oil'], category: 'Nuts, Seeds & Oils', per100g: nut(884, 0, 0, 100, 0, 0, 0, 0, 0, 0, 0), servings: [tsp(5), tbsp(14)], source: 'IFCT' },
  { slug: 'mustard-oil', name: 'Mustard Oil', aliases: ['sarson oil'], category: 'Nuts, Seeds & Oils', per100g: nut(884, 0, 0, 100, 0, 0, 0, 0, 0, 0, 0), servings: [tsp(5), tbsp(14)], source: 'IFCT' },
  { slug: 'rice-bran-oil', name: 'Rice Bran Oil', aliases: [], category: 'Nuts, Seeds & Oils', per100g: nut(884, 0, 0, 100, 0, 0, 0, 0, 0, 0, 0), servings: [tsp(5), tbsp(14)], source: 'IFCT' },
  { slug: 'coconut-oil', name: 'Coconut Oil', aliases: ['nariyal oil'], category: 'Nuts, Seeds & Oils', per100g: nut(892, 0, 0, 100, 0, 0, 0, 0, 0, 0, 0), servings: [tsp(5), tbsp(14)], source: 'IFCT' },
  { slug: 'hazelnut', name: 'Hazelnut', aliases: ['filbert', 'hazelnuts'], category: 'Nuts, Seeds & Oils', per100g: nut(628, 15, 16.7, 60.8, 9.7, 4.3, 0, 114, 4.7, 680, 6.3), servings: [{ label: '20 g (handful)', grams: 20 }, { label: '10 g (5 nuts)', grams: 10 }], source: 'USDA' },
  { slug: 'macadamia', name: 'Macadamia Nut', aliases: ['macadamia nut', 'macadamias'], category: 'Nuts, Seeds & Oils', per100g: nut(718, 7.9, 13.8, 75.8, 8.6, 4.6, 5, 85, 3.7, 368, 1.2), servings: [{ label: '20 g (handful)', grams: 20 }, { label: '10 g (5 nuts)', grams: 10 }], source: 'USDA' },
  { slug: 'brazil-nut', name: 'Brazil Nut', aliases: ['brazilnut', 'para nut'], category: 'Nuts, Seeds & Oils', per100g: nut(659, 14.3, 11.7, 67.1, 7.5, 2.3, 3, 160, 2.4, 659, 0.7), servings: [{ label: '6 nuts (30 g)', grams: 30 }, { label: '20 g (handful)', grams: 20 }], source: 'USDA' },

  // ── Sweets & Desserts ──────────────────────────────────────────────────────
  { slug: 'gulab-jamun', name: 'Gulab Jamun', aliases: ['gulabjamun'], category: 'Sweets & Desserts', per100g: nut(320, 5, 45, 14, 0.8, 40, 60, 120, 1, 120, 0), servings: [piece(40, 'piece')], source: 'INDB' },
  { slug: 'jalebi', name: 'Jalebi', aliases: ['jilbi'], category: 'Sweets & Desserts', per100g: nut(360, 3, 55, 15, 0.5, 40, 40, 20, 1.2, 45, 0), servings: [piece(25, 'piece')], source: 'INDB' },
  { slug: 'rasgulla', name: 'Rasgulla', aliases: ['rosogolla'], category: 'Sweets & Desserts', per100g: nut(190, 4, 38, 3, 0, 36, 50, 100, 0.3, 90, 0), servings: [piece(45, 'piece')], source: 'INDB' },
  { slug: 'kaju-katli', name: 'Kaju Katli', aliases: ['kaju barfi'], category: 'Sweets & Desserts', per100g: nut(460, 9, 52, 24, 1.5, 45, 25, 45, 3, 300, 0), servings: [piece(15, 'piece')], source: 'INDB' },
  { slug: 'laddu-besan', name: 'Besan Laddu', aliases: ['ladoo', 'laddoo'], category: 'Sweets & Desserts', per100g: nut(420, 8, 50, 21, 3, 38, 30, 60, 2.5, 350, 0), servings: [piece(40, 'laddu')], source: 'INDB' },
  { slug: 'kheer', name: 'Kheer', aliases: ['payasam', 'rice pudding'], category: 'Sweets & Desserts', per100g: nut(150, 4, 22, 5, 0.3, 18, 55, 130, 0.3, 160, 1), servings: [katori(150)], source: 'INDB' },
  { slug: 'halwa-suji', name: 'Suji Halwa', aliases: ['sooji halwa', 'rava sheera'], category: 'Sweets & Desserts', per100g: nut(340, 5, 45, 15, 1, 25, 40, 40, 1.2, 80, 0), servings: [katori(120)], source: 'INDB' },
  { slug: 'gajar-halwa', name: 'Gajar Halwa', aliases: ['carrot halwa'], category: 'Sweets & Desserts', per100g: nut(280, 4, 35, 13, 2, 30, 55, 130, 0.8, 200, 2), servings: [katori(120)], source: 'INDB' },
  { slug: 'ice-cream', name: 'Ice Cream (vanilla)', aliases: ['icecream'], category: 'Sweets & Desserts', per100g: nut(207, 3.5, 24, 11, 0.7, 21, 80, 128, 0.1, 199, 0.6), servings: [{ label: '1 scoop (60 g)', grams: 60 }], source: 'USDA' },
  { slug: 'sugar', name: 'Sugar', aliases: ['cheeni', 'chini'], category: 'Sweets & Desserts', per100g: nut(387, 0, 100, 0, 0, 100, 1, 1, 0.1, 2, 0), servings: [tsp(5), tbsp(15)], source: 'USDA' },
  { slug: 'honey', name: 'Honey', aliases: ['shahad', 'madhu'], category: 'Sweets & Desserts', per100g: nut(304, 0.3, 82, 0, 0.2, 82.1, 4, 6, 0.4, 52, 0.5), servings: [tsp(7), tbsp(21)], source: 'USDA' },
  { slug: 'dark-chocolate', name: 'Dark Chocolate (70-85%)', aliases: ['dark chocolate', 'bittersweet chocolate', '70% chocolate'], category: 'Sweets & Desserts', per100g: nut(598, 7.8, 45.9, 42.6, 10.9, 24, 20, 73, 11.9, 715, 0), servings: [{ label: '1 square (10 g)', grams: 10 }, piece(30, 'piece')], source: 'USDA' },
  { slug: 'milk-chocolate', name: 'Milk Chocolate', aliases: ['milk chocolate', 'chocolate bar'], category: 'Sweets & Desserts', per100g: nut(535, 7.7, 59.4, 29.7, 3.4, 51.5, 79, 189, 2.4, 372, 0), servings: [{ label: '1 square (7 g)', grams: 7 }, piece(40, 'piece')], source: 'USDA' },
  { slug: 'chocolate-brownie', name: 'Chocolate Brownie', aliases: ['brownie', 'fudge brownie'], category: 'Sweets & Desserts', per100g: nut(466, 6, 63, 21, 2.5, 40, 350, 40, 2.4, 200, 0), servings: [piece(56, 'brownie')], source: 'USDA' },
  { slug: 'cheesecake', name: 'Cheesecake', aliases: ['cheesecake', 'new york cheesecake'], category: 'Sweets & Desserts', per100g: nut(321, 5.5, 25.5, 22.5, 0.4, 22, 438, 51, 0.6, 90, 0.2), servings: [piece(80, 'slice')], source: 'USDA' },
  { slug: 'chocolate-chip-cookie', name: 'Chocolate Chip Cookie', aliases: ['chocolate chip cookie', 'choc chip cookie', 'cookie'], category: 'Sweets & Desserts', per100g: nut(488, 5.1, 64.3, 24.3, 2.6, 38, 344, 27, 2.6, 160, 0), servings: [piece(16, 'cookie')], source: 'USDA' },

  // ── Beverages ──────────────────────────────────────────────────────────────
  { slug: 'chai', name: 'Chai (with milk & sugar)', aliases: ['tea', 'masala chai'], category: 'Beverages', per100g: nut(55, 1.5, 8, 1.8, 0, 7.5, 15, 50, 0, 60, 0), servings: [cup(120), glass(200)], source: 'INDB' },
  { slug: 'black-coffee', name: 'Black Coffee (no sugar)', aliases: ['coffee'], category: 'Beverages', per100g: nut(2, 0.1, 0, 0, 0, 0, 2, 2, 0, 49, 0), servings: [cup(120)], source: 'USDA' },
  { slug: 'coffee-milk', name: 'Coffee (with milk & sugar)', aliases: ['milk coffee', 'filter coffee'], category: 'Beverages', per100g: nut(60, 1.6, 9, 1.8, 0, 8, 20, 55, 0, 80, 0), servings: [cup(120), glass(200)], source: 'INDB' },
  { slug: 'cola', name: 'Cola / Soft Drink', aliases: ['soda', 'cold drink', 'pepsi', 'coke'], category: 'Beverages', per100g: nut(42, 0, 10.6, 0, 0, 10.6, 4, 2, 0.1, 2, 0), servings: [glass(250), { label: '1 can (330 ml)', grams: 330 }], source: 'USDA' },
  { slug: 'orange-juice', name: 'Orange Juice', aliases: ['juice', 'fruit juice'], category: 'Beverages', per100g: nut(45, 0.7, 10.4, 0.2, 0.2, 8.4, 1, 11, 0.2, 200, 50), servings: [glass(250)], source: 'USDA' },
  { slug: 'coconut-water', name: 'Coconut Water', aliases: ['nariyal pani'], category: 'Beverages', per100g: nut(19, 0.7, 3.7, 0.2, 1.1, 2.6, 105, 24, 0.3, 250, 2.4), servings: [glass(250)], source: 'USDA' },
  { slug: 'mango-shake', name: 'Mango Shake', aliases: ['milkshake'], category: 'Beverages', per100g: nut(95, 2.5, 16, 2.5, 0.5, 14, 30, 80, 0.1, 150, 5), servings: [glass(250)], source: 'INDB' },
  { slug: 'protein-shake-whey', name: 'Whey Protein (1 scoop)', aliases: ['protein powder', 'whey'], category: 'Beverages', per100g: nut(400, 80, 8, 6, 1, 4, 300, 500, 1, 400, 0), servings: [{ label: '1 scoop (30 g)', grams: 30 }], source: 'USDA' },
  { slug: 'almond-milk-unsweetened', name: 'Almond Milk (unsweetened)', aliases: ['almond milk', 'unsweetened almond milk', 'badam milk unsweetened'], category: 'Beverages', per100g: nut(15, 0.6, 0.6, 1.2, 0.4, 0.1, 63, 184, 0.3, 67, 0), servings: [glass(200), cup(150)], source: 'USDA' },
  { slug: 'soy-milk', name: 'Soy Milk (unsweetened)', aliases: ['soya milk', 'soymilk', 'plant milk soy'], category: 'Beverages', per100g: nut(43, 3.3, 1.8, 1.8, 0.6, 0.9, 51, 123, 0.4, 118, 0), servings: [glass(200), cup(150)], source: 'USDA' },
  { slug: 'oat-milk', name: 'Oat Milk (unsweetened)', aliases: ['oatmilk', 'oat drink', 'plant milk oat'], category: 'Beverages', per100g: nut(47, 1, 7, 1.5, 0.8, 2.5, 42, 120, 0.2, 150, 0), servings: [glass(200), cup(150)], source: 'USDA' },
  { slug: 'coconut-milk-beverage', name: 'Coconut Milk Beverage', aliases: ['coconut milk drink', 'coconut milk carton', 'coconut plant milk'], category: 'Beverages', per100g: nut(31, 0.2, 2.9, 2.1, 0, 2.9, 21, 188, 0.3, 50, 0), servings: [glass(200), cup(150)], source: 'USDA' },
  { slug: 'green-tea-plain', name: 'Green Tea (plain)', aliases: ['green tea', 'plain green tea', 'unsweetened green tea'], category: 'Beverages', per100g: nut(1, 0.2, 0, 0, 0, 0, 1, 0, 0, 8, 0), servings: [glass(200), cup(150)], source: 'USDA' },
  { slug: 'beer', name: 'Beer (regular)', aliases: ['lager', 'ale', 'regular beer'], category: 'Beverages', per100g: nut(43, 0.5, 3.6, 0, 0, 0, 4, 4, 0, 27, 0), servings: [glass(200), { label: '1 can (330 ml)', grams: 330 }], source: 'USDA' },
  { slug: 'red-wine', name: 'Red Wine', aliases: ['wine', 'red table wine'], category: 'Beverages', per100g: nut(85, 0.1, 2.6, 0, 0, 0.6, 4, 8, 0.5, 127, 0), servings: [{ label: '1 glass (150 ml)', grams: 150 }], source: 'USDA' },
  { slug: 'cappuccino', name: 'Cappuccino', aliases: ['cappucino', 'coffee cappuccino'], category: 'Beverages', per100g: nut(37, 1.9, 3, 1.9, 0, 3, 24, 66, 0, 100, 0), servings: [cup(150), glass(200)], source: 'USDA' },

  // ── Raw staples & basics ───────────────────────────────────────────────────
  { slug: 'atta', name: 'Wheat Flour (atta, raw)', aliases: ['whole wheat flour', 'gehu atta'], category: 'Staples & Basics', per100g: nut(340, 12, 69, 2, 11, 0.5, 2, 40, 4, 350, 0), servings: [tbsp(10), katori(120)], source: 'IFCT' },
  { slug: 'besan', name: 'Besan (gram flour)', aliases: ['chickpea flour', 'gram flour'], category: 'Staples & Basics', per100g: nut(387, 22, 58, 6.7, 10.8, 10.9, 64, 45, 4.9, 846, 0), servings: [tbsp(10), katori(100)], source: 'IFCT' },
  { slug: 'rice-raw', name: 'Rice (raw, uncooked)', aliases: ['kacha chawal', 'raw rice'], category: 'Staples & Basics', per100g: nut(345, 6.8, 78, 0.5, 1.5, 0.1, 5, 10, 1, 110, 0), servings: [katori(100)], source: 'IFCT' },
  { slug: 'sugar-jaggery', name: 'Jaggery (gur)', aliases: ['gur', 'gud'], category: 'Staples & Basics', per100g: nut(383, 0.4, 98, 0.1, 0, 97, 30, 80, 4, 140, 0), servings: [piece(20, 'piece'), tsp(6)], source: 'IFCT' },
  { slug: 'potato-boiled', name: 'Potato (boiled)', aliases: ['aloo', 'aalu'], category: 'Staples & Basics', per100g: nut(87, 1.9, 20, 0.1, 1.8, 0.9, 5, 8, 0.3, 379, 7.4), servings: [piece(120, 'potato'), katori(150)], source: 'USDA' },
  { slug: 'sweet-potato', name: 'Sweet Potato (boiled)', aliases: ['shakarkandi'], category: 'Staples & Basics', per100g: nut(90, 2, 21, 0.1, 3.3, 6.5, 36, 27, 0.7, 475, 12.8), servings: [piece(130, 'piece')], source: 'USDA' },
  { slug: 'sweet-corn', name: 'Sweet Corn (boiled)', aliases: ['bhutta', 'makka', 'corn'], category: 'Staples & Basics', per100g: nut(96, 3.4, 21, 1.5, 2.4, 4.5, 1, 3, 0.6, 218, 5.5), servings: [katori(150), piece(150, 'cob')], source: 'USDA' },
  { slug: 'seitan', name: 'Seitan (wheat gluten)', aliases: ['wheat meat', 'wheat gluten', 'gluten meat'], category: 'Staples & Basics', per100g: nut(141, 25, 5, 1.9, 0.6, 0, 400, 40, 5.2, 100, 0), servings: [{ label: '1 serving (100 g)', grams: 100 }, katori(120)], source: 'USDA' },

  // ── Salad & Raw Veggies ────────────────────────────────────────────────────
  { slug: 'green-salad', name: 'Green Salad (no dressing)', aliases: ['salad', 'kachumber'], category: 'Salad & Raw Veggies', per100g: nut(25, 1, 5, 0.2, 1.8, 2.5, 15, 25, 0.6, 250, 15), servings: [katori(100), bowl(200)], source: 'IFCT' },
  { slug: 'cucumber', name: 'Cucumber', aliases: ['kheera', 'kakdi'], category: 'Salad & Raw Veggies', per100g: nut(15, 0.7, 3.6, 0.1, 0.5, 1.7, 2, 16, 0.3, 147, 2.8), servings: [katori(100), piece(120, 'cucumber')], source: 'USDA' },
  { slug: 'tomato', name: 'Tomato', aliases: ['tamatar'], category: 'Salad & Raw Veggies', per100g: nut(18, 0.9, 3.9, 0.2, 1.2, 2.6, 5, 10, 0.3, 237, 13.7), servings: [piece(80, 'tomato')], source: 'USDA' },
  { slug: 'carrot-raw', name: 'Carrot (raw)', aliases: ['gajar'], category: 'Salad & Raw Veggies', per100g: nut(41, 0.9, 9.6, 0.2, 2.8, 4.7, 69, 33, 0.3, 320, 5.9), servings: [piece(60, 'carrot'), katori(100)], source: 'USDA' },
  { slug: 'onion-raw', name: 'Onion (raw)', aliases: ['pyaz', 'kanda'], category: 'Salad & Raw Veggies', per100g: nut(40, 1.1, 9.3, 0.1, 1.7, 4.2, 4, 23, 0.2, 146, 7.4), servings: [piece(100, 'onion')], source: 'USDA' },
  { slug: 'cabbage-raw', name: 'Cabbage (raw)', aliases: ['patta gobi', 'band gobi'], category: 'Salad & Raw Veggies', per100g: nut(25, 1.3, 5.8, 0.1, 2.5, 3.2, 18, 40, 0.5, 170, 36.6), servings: [katori(100)], source: 'USDA' },
  { slug: 'cauliflower-raw', name: 'Cauliflower (raw)', aliases: ['gobi', 'phool gobi'], category: 'Salad & Raw Veggies', per100g: nut(25, 1.9, 5, 0.3, 2, 1.9, 30, 22, 0.4, 299, 48.2), servings: [katori(100)], source: 'USDA' },
  { slug: 'broccoli', name: 'Broccoli', aliases: ['hari gobi'], category: 'Salad & Raw Veggies', per100g: nut(34, 2.8, 6.6, 0.4, 2.6, 1.7, 33, 47, 0.7, 316, 89.2), servings: [katori(100)], source: 'USDA' },
  { slug: 'capsicum', name: 'Capsicum / Bell Pepper', aliases: ['shimla mirch', 'bell pepper'], category: 'Salad & Raw Veggies', per100g: nut(20, 0.9, 4.6, 0.2, 1.7, 2.4, 3, 10, 0.3, 175, 80.4), servings: [piece(100, 'capsicum')], source: 'USDA' },
  { slug: 'beetroot', name: 'Beetroot', aliases: ['chukandar'], category: 'Salad & Raw Veggies', per100g: nut(43, 1.6, 9.6, 0.2, 2.8, 6.8, 78, 16, 0.8, 325, 4.9), servings: [katori(100)], source: 'USDA' },
  { slug: 'radish-raw', name: 'Radish (raw)', aliases: ['mooli'], category: 'Salad & Raw Veggies', per100g: nut(16, 0.7, 3.4, 0.1, 1.6, 1.9, 39, 25, 0.3, 233, 14.8), servings: [piece(100, 'radish')], source: 'USDA' },
  { slug: 'lettuce', name: 'Lettuce', aliases: ['salad leaves'], category: 'Salad & Raw Veggies', per100g: nut(15, 1.4, 2.9, 0.2, 1.3, 0.8, 28, 36, 0.9, 194, 9.2), servings: [katori(50)], source: 'USDA' },
  { slug: 'spinach-raw', name: 'Spinach (raw)', aliases: ['kachcha palak', 'raw palak'], category: 'Salad & Raw Veggies', per100g: nut(23, 2.9, 3.6, 0.4, 2.2, 0.4, 79, 99, 2.7, 558, 28.1), servings: [katori(50)], source: 'USDA' },
  { slug: 'green-peas', name: 'Green Peas (boiled)', aliases: ['matar', 'hara matar'], category: 'Salad & Raw Veggies', per100g: nut(81, 5.4, 14.5, 0.4, 5.7, 5.7, 5, 25, 1.5, 244, 40), servings: [katori(100)], source: 'USDA' },
  { slug: 'french-beans', name: 'French Beans', aliases: ['beans', 'fansi'], category: 'Salad & Raw Veggies', per100g: nut(31, 1.8, 7, 0.2, 2.7, 3.3, 6, 37, 1, 211, 12.2), servings: [katori(100)], source: 'USDA' },
  { slug: 'mushroom', name: 'Mushroom (raw)', aliases: ['khumb', 'button mushroom'], category: 'Salad & Raw Veggies', per100g: nut(22, 3.1, 3.3, 0.3, 1, 2, 5, 3, 0.5, 318, 2.1), servings: [katori(100)], source: 'USDA' },
  { slug: 'pumpkin-cooked', name: 'Pumpkin (cooked)', aliases: ['kaddu'], category: 'Salad & Raw Veggies', per100g: nut(20, 0.7, 4.9, 0.1, 1.1, 2.1, 1, 15, 0.6, 230, 4.7), servings: [katori(150)], source: 'USDA' },
  { slug: 'lemon', name: 'Lemon', aliases: ['nimbu'], category: 'Salad & Raw Veggies', per100g: nut(29, 1.1, 9.3, 0.3, 2.8, 2.5, 2, 26, 0.6, 138, 53), servings: [piece(60, 'lemon')], source: 'USDA' },
  { slug: 'sprouts-salad', name: 'Sprouts Salad', aliases: ['sprout chaat'], category: 'Salad & Raw Veggies', per100g: nut(110, 8, 19, 1.2, 7, 3, 15, 55, 2.5, 330, 15), servings: [katori(100)], source: 'INDB' },
  { slug: 'fruit-chaat', name: 'Fruit Chaat', aliases: ['fruit salad'], category: 'Salad & Raw Veggies', per100g: nut(65, 0.8, 16, 0.3, 2.5, 12, 20, 15, 0.4, 200, 30), servings: [katori(150), bowl(250)], source: 'INDB' },
  { slug: 'corn-chaat', name: 'Corn Chaat', aliases: ['masala corn', 'corn salad'], category: 'Salad & Raw Veggies', per100g: nut(110, 3.4, 22, 1.8, 2.5, 5, 200, 5, 0.6, 250, 6), servings: [katori(100)], source: 'INDB' },
  { slug: 'lauki-boiled', name: 'Bottle Gourd (Lauki, boiled)', aliases: ['ghiya', 'dudhi'], category: 'Salad & Raw Veggies', per100g: nut(15, 0.6, 3.7, 0.1, 1, 1.5, 2, 24, 0.3, 150, 8.5), servings: [katori(150)], source: 'IFCT' },
  { slug: 'ridge-gourd', name: 'Ridge Gourd (Turai, boiled)', aliases: ['turai', 'tori', 'gilki'], category: 'Salad & Raw Veggies', per100g: nut(18, 0.8, 4.2, 0.2, 1.5, 1.8, 3, 20, 0.4, 140, 5), servings: [katori(150)], source: 'IFCT' },
  { slug: 'karela-raw', name: 'Bitter Gourd (Karela, raw)', aliases: ['bitter gourd'], category: 'Salad & Raw Veggies', per100g: nut(17, 1, 3.7, 0.2, 2.8, 1, 5, 19, 0.4, 296, 84), servings: [katori(100)], source: 'IFCT' },
  { slug: 'brinjal-raw', name: 'Brinjal / Eggplant (raw)', aliases: ['baingan', 'aubergine', 'eggplant'], category: 'Salad & Raw Veggies', per100g: nut(25, 1, 5.9, 0.2, 3, 3.5, 2, 9, 0.2, 229, 2.2), servings: [piece(100, 'brinjal')], source: 'USDA' },
  { slug: 'bhindi-raw', name: 'Okra / Ladyfinger (Bhindi, raw)', aliases: ['okra', 'ladyfinger', 'bhindi'], category: 'Salad & Raw Veggies', per100g: nut(33, 1.9, 7.5, 0.2, 3.2, 1.5, 7, 82, 0.6, 299, 23), servings: [katori(100)], source: 'USDA' },
  { slug: 'turnip-raw', name: 'Turnip (Shalgam, raw)', aliases: ['shalgam'], category: 'Salad & Raw Veggies', per100g: nut(28, 0.9, 6.4, 0.1, 1.8, 3.8, 67, 30, 0.3, 191, 21), servings: [piece(100, 'turnip')], source: 'USDA' },
  { slug: 'drumstick', name: 'Drumstick (Moringa pods, raw)', aliases: ['moringa', 'sahjan', 'saijan'], category: 'Salad & Raw Veggies', per100g: nut(37, 2.1, 8.5, 0.2, 3.2, 3, 42, 30, 0.4, 461, 120), servings: [katori(100)], source: 'IFCT' },
  { slug: 'tinda', name: 'Tinda (Apple Gourd, raw)', aliases: ['apple gourd', 'round gourd', 'indian squash'], category: 'Salad & Raw Veggies', per100g: nut(21, 0.9, 4.8, 0.2, 1.5, 2, 3, 20, 0.4, 130, 18), servings: [katori(100)], source: 'IFCT' },
  { slug: 'ash-gourd', name: 'Ash Gourd (Petha, raw)', aliases: ['petha', 'winter melon', 'white pumpkin'], category: 'Salad & Raw Veggies', per100g: nut(13, 0.4, 3, 0.2, 2.9, 1.9, 111, 19, 0.4, 6, 13), servings: [katori(100)], source: 'IFCT' },
  { slug: 'zucchini', name: 'Zucchini (raw)', aliases: ['courgette'], category: 'Salad & Raw Veggies', per100g: nut(17, 1.2, 3.1, 0.3, 1, 2.5, 8, 16, 0.4, 261, 17.9), servings: [katori(100)], source: 'USDA' },
  { slug: 'kale', name: 'Kale (raw)', aliases: ['curly kale', 'borecole'], category: 'Salad & Raw Veggies', per100g: nut(35, 2.9, 4.4, 1.5, 4.1, 0.8, 53, 254, 1.6, 348, 93.4), servings: [katori(100), { label: '1 cup chopped (67 g)', grams: 67 }], source: 'USDA' },
  { slug: 'asparagus', name: 'Asparagus (raw)', aliases: ['garden asparagus', 'sparrow grass'], category: 'Salad & Raw Veggies', per100g: nut(20, 2.2, 3.9, 0.1, 2.1, 1.9, 2, 24, 2.1, 202, 5.6), servings: [katori(100), piece(12, 'spear')], source: 'USDA' },
  { slug: 'bok-choy', name: 'Bok Choy (raw)', aliases: ['pak choi', 'chinese cabbage', 'pok choi'], category: 'Salad & Raw Veggies', per100g: nut(13, 1.5, 2.2, 0.2, 1, 1.2, 65, 105, 0.8, 252, 45), servings: [katori(100), { label: '1 cup shredded (70 g)', grams: 70 }], source: 'USDA' },
  { slug: 'brussels-sprouts', name: 'Brussels Sprouts (raw)', aliases: ['baby cabbage'], category: 'Salad & Raw Veggies', per100g: nut(43, 3.4, 9, 0.3, 3.8, 2.2, 25, 42, 1.4, 389, 85), servings: [katori(100), piece(19, 'sprout')], source: 'USDA' },
  { slug: 'arugula', name: 'Arugula (raw)', aliases: ['rocket', 'rucola', 'salad rocket'], category: 'Salad & Raw Veggies', per100g: nut(25, 2.6, 3.7, 0.7, 1.6, 2.1, 27, 160, 1.5, 369, 15), servings: [katori(100), { label: '1 cup (20 g)', grams: 20 }], source: 'USDA' },
  { slug: 'celery', name: 'Celery (raw)', aliases: ['celery stalk'], category: 'Salad & Raw Veggies', per100g: nut(16, 0.7, 3, 0.2, 1.6, 1.3, 80, 40, 0.2, 260, 3.1), servings: [katori(100), piece(40, 'stalk')], source: 'USDA' },
  { slug: 'red-bell-pepper', name: 'Red Bell Pepper (raw)', aliases: ['red capsicum', 'red pepper', 'lal shimla mirch'], category: 'Salad & Raw Veggies', per100g: nut(31, 1, 6, 0.3, 2.1, 4.2, 4, 7, 0.4, 211, 127.7), servings: [katori(100), piece(119, 'pepper')], source: 'USDA' },
  { slug: 'methi-leaves', name: 'Methi / Fenugreek Leaves (raw)', aliases: ['fenugreek leaves', 'methi saag', 'kasuri methi'], category: 'Salad & Raw Veggies', per100g: nut(49, 4.4, 6, 0.9, 1.1, 1, 76, 395, 1.9, 51, 52), servings: [katori(100), { label: '1 cup chopped (85 g)', grams: 85 }], source: 'IFCT' },

  // ── Wraps & Rolls ──────────────────────────────────────────────────────────
  { slug: 'veg-kathi-roll', name: 'Veg Kathi Roll / Wrap', aliases: ['veg roll', 'wrap', 'veg wrap'], category: 'Wraps & Rolls', per100g: nut(210, 6, 28, 8, 3, 3, 400, 40, 1.8, 200, 5), servings: [piece(150, 'roll')], source: 'INDB' },
  { slug: 'paneer-wrap', name: 'Paneer Wrap / Roll', aliases: ['paneer kathi roll', 'paneer frankie'], category: 'Wraps & Rolls', per100g: nut(250, 9, 26, 12, 2.5, 3, 420, 120, 1.5, 180, 3), servings: [piece(180, 'roll')], source: 'INDB' },
  { slug: 'chicken-kathi-roll', name: 'Chicken Kathi Roll', aliases: ['chicken roll', 'chicken wrap'], category: 'Wraps & Rolls', per100g: nut(240, 12, 26, 10, 2, 2.5, 450, 40, 1.8, 220, 3), servings: [piece(180, 'roll')], source: 'INDB' },
  { slug: 'egg-roll', name: 'Egg Roll', aliases: ['anda roll', 'egg kathi roll'], category: 'Wraps & Rolls', per100g: nut(230, 9, 27, 10, 2, 2.5, 420, 45, 1.8, 150, 2), servings: [piece(160, 'roll')], source: 'INDB' },
  { slug: 'veg-frankie', name: 'Veg Frankie', aliases: ['frankie', 'mumbai frankie'], category: 'Wraps & Rolls', per100g: nut(220, 6, 30, 8, 3, 3, 420, 40, 1.7, 200, 4), servings: [piece(180, 'frankie')], source: 'INDB' },
];

/** Full dataset — each item guaranteed to include a "100 g" serving option. */
export const FOODS: FoodItem[] = RAW.map((f) => ({
  ...f,
  servings: [...f.servings, G100],
}));

/** Distinct categories in dataset order (for grouping the search list). */
export const FOOD_CATEGORIES: string[] = FOODS.reduce<string[]>((acc, f) => {
  if (!acc.includes(f.category)) acc.push(f.category);
  return acc;
}, []);

const norm = (s: string) => s.toLowerCase().trim();

/** Case-insensitive search over name + aliases + category. Empty query → all foods. */
export function searchFoods(query: string): FoodItem[] {
  const q = norm(query);
  if (!q) return FOODS;
  return FOODS.filter((f) => {
    const hay = [f.name, f.category, ...(f.aliases ?? [])].map(norm).join(' ');
    return hay.includes(q);
  });
}

export function getFoodBySlug(slug: string): FoodItem | undefined {
  return FOODS.find((f) => f.slug === slug);
}
