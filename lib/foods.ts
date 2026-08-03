/**
 * Curated Indian food nutrition dataset for the public Calorie Calculator.
 *
 * Values are per 100 g of the EDIBLE, TYPICALLY-COOKED (or ready-to-eat) form, with
 * common Indian household serving sizes (katori, roti, cup, glass, piece) and their
 * approximate gram equivalents so users can estimate without a weighing scale.
 *
 * Data sources (bundled under their licences — see the credit line on the page):
 *   - INDB — Indian Nutrient Databank (Anuvaad Solutions / Jaacks Lab), CC BY.
 *     Vijayakumar A, Dubasi HB, Awasthi A, Jaacks LM. "Development of an Indian Food
 *     Composition Database." Current Developments in Nutrition, 2024.
 *   - IFCT 2017 — Indian Food Composition Tables, National Institute of Nutrition
 *     (ICMR), Hyderabad.
 *   - USDA FoodData Central (public domain, CC0) — fallback for generic items.
 *
 * Values are rounded approximations for everyday estimation, not lab-exact figures;
 * home recipes vary with oil/ghee, portion and preparation.
 */

export interface FoodServing {
  /** Human label shown in the unit dropdown, e.g. "1 katori (150 g)". */
  label: string;
  /** Gram-equivalent of one of this serving. */
  grams: number;
}

export interface FoodMacros {
  kcal: number;
  protein: number; // grams
  carbs: number; // grams
  fat: number; // grams
}

export interface FoodItem {
  slug: string;
  name: string;
  /** Alternate names / spellings used for search matching. */
  aliases?: string[];
  category: string;
  /** Nutrition per 100 g of the edible form. */
  per100g: FoodMacros;
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

// Raw definitions (servings here do NOT include the 100 g option — it is appended below).
type RawFood = Omit<FoodItem, 'servings'> & { servings: FoodServing[] };

const RAW: RawFood[] = [
  // ── Dals & Legumes (cooked) ────────────────────────────────────────────────
  { slug: 'toor-dal-cooked', name: 'Toor Dal (cooked)', aliases: ['arhar', 'tur', 'arhar dal', 'pigeon pea'], category: 'Dals & Legumes', per100g: { kcal: 122, protein: 7, carbs: 18, fat: 2.5 }, servings: [katori(150), bowl(250)], source: 'INDB' },
  { slug: 'moong-dal-cooked', name: 'Moong Dal (cooked)', aliases: ['mung', 'green gram dal'], category: 'Dals & Legumes', per100g: { kcal: 105, protein: 7, carbs: 16, fat: 1.5 }, servings: [katori(150), bowl(250)], source: 'INDB' },
  { slug: 'masoor-dal-cooked', name: 'Masoor Dal (cooked)', aliases: ['red lentil', 'lentil'], category: 'Dals & Legumes', per100g: { kcal: 116, protein: 8, carbs: 18, fat: 1.5 }, servings: [katori(150), bowl(250)], source: 'INDB' },
  { slug: 'chana-dal-cooked', name: 'Chana Dal (cooked)', aliases: ['bengal gram dal', 'split chickpea'], category: 'Dals & Legumes', per100g: { kcal: 130, protein: 7, carbs: 20, fat: 2.5 }, servings: [katori(150), bowl(250)], source: 'INDB' },
  { slug: 'urad-dal-cooked', name: 'Urad Dal (cooked)', aliases: ['black gram dal', 'dal makhani base'], category: 'Dals & Legumes', per100g: { kcal: 132, protein: 8, carbs: 18, fat: 3 }, servings: [katori(150), bowl(250)], source: 'INDB' },
  { slug: 'dal-tadka', name: 'Dal Tadka', aliases: ['dal fry', 'tadka dal'], category: 'Dals & Legumes', per100g: { kcal: 145, protein: 6, carbs: 16, fat: 6 }, servings: [katori(150), bowl(250)], source: 'INDB' },
  { slug: 'dal-makhani', name: 'Dal Makhani', aliases: ['makhani dal'], category: 'Dals & Legumes', per100g: { kcal: 190, protein: 7, carbs: 15, fat: 11 }, servings: [katori(150), bowl(250)], source: 'INDB' },
  { slug: 'rajma-cooked', name: 'Rajma (curry)', aliases: ['kidney beans', 'rajma masala'], category: 'Dals & Legumes', per100g: { kcal: 140, protein: 7, carbs: 20, fat: 3.5 }, servings: [katori(150), bowl(250)], source: 'INDB' },
  { slug: 'chole-cooked', name: 'Chole (chickpea curry)', aliases: ['chana masala', 'chhole', 'chickpea curry'], category: 'Dals & Legumes', per100g: { kcal: 160, protein: 7, carbs: 22, fat: 5 }, servings: [katori(150), bowl(250)], source: 'INDB' },
  { slug: 'kala-chana-cooked', name: 'Kala Chana (cooked)', aliases: ['black chickpea', 'brown chana'], category: 'Dals & Legumes', per100g: { kcal: 150, protein: 8, carbs: 24, fat: 2.5 }, servings: [katori(150)], source: 'INDB' },
  { slug: 'chana-boiled', name: 'Boiled Chickpeas', aliases: ['kabuli chana', 'safed chana', 'garbanzo'], category: 'Dals & Legumes', per100g: { kcal: 164, protein: 9, carbs: 27, fat: 2.6 }, servings: [katori(150)], source: 'USDA' },
  { slug: 'sambar', name: 'Sambar', aliases: ['sambhar'], category: 'Dals & Legumes', per100g: { kcal: 85, protein: 4, carbs: 12, fat: 2.5 }, servings: [katori(150), bowl(250)], source: 'INDB' },
  { slug: 'sprouts-moong', name: 'Moong Sprouts', aliases: ['sprouts', 'ankurit moong'], category: 'Dals & Legumes', per100g: { kcal: 100, protein: 7, carbs: 18, fat: 0.5 }, servings: [katori(100)], source: 'IFCT' },

  // ── Rice & Grains (cooked) ─────────────────────────────────────────────────
  { slug: 'rice-white-cooked', name: 'White Rice (cooked)', aliases: ['chawal', 'steamed rice', 'plain rice'], category: 'Rice & Grains', per100g: { kcal: 130, protein: 2.7, carbs: 28, fat: 0.3 }, servings: [katori(150), cup(150), bowl(250)], source: 'USDA' },
  { slug: 'rice-brown-cooked', name: 'Brown Rice (cooked)', aliases: ['brown chawal'], category: 'Rice & Grains', per100g: { kcal: 123, protein: 2.7, carbs: 26, fat: 1 }, servings: [katori(150), cup(150)], source: 'USDA' },
  { slug: 'jeera-rice', name: 'Jeera Rice', aliases: ['cumin rice'], category: 'Rice & Grains', per100g: { kcal: 165, protein: 3, carbs: 28, fat: 4.5 }, servings: [katori(150), cup(150)], source: 'INDB' },
  { slug: 'veg-biryani', name: 'Vegetable Biryani', aliases: ['veg biryani', 'biriyani'], category: 'Rice & Grains', per100g: { kcal: 175, protein: 4, carbs: 26, fat: 6 }, servings: [katori(150), bowl(250)], source: 'INDB' },
  { slug: 'chicken-biryani', name: 'Chicken Biryani', aliases: ['biryani'], category: 'Rice & Grains', per100g: { kcal: 190, protein: 9, carbs: 22, fat: 8 }, servings: [katori(150), bowl(250)], source: 'INDB' },
  { slug: 'pulao-veg', name: 'Veg Pulao', aliases: ['pulav', 'pilaf'], category: 'Rice & Grains', per100g: { kcal: 155, protein: 3.5, carbs: 26, fat: 4.5 }, servings: [katori(150), cup(150)], source: 'INDB' },
  { slug: 'curd-rice', name: 'Curd Rice', aliases: ['dahi rice', 'thayir sadam'], category: 'Rice & Grains', per100g: { kcal: 120, protein: 3.5, carbs: 18, fat: 3.5 }, servings: [katori(150), bowl(250)], source: 'INDB' },
  { slug: 'lemon-rice', name: 'Lemon Rice', aliases: ['nimbu chawal'], category: 'Rice & Grains', per100g: { kcal: 165, protein: 3, carbs: 27, fat: 5 }, servings: [katori(150)], source: 'INDB' },
  { slug: 'khichdi', name: 'Khichdi', aliases: ['khichri', 'dal khichdi'], category: 'Rice & Grains', per100g: { kcal: 120, protein: 4.5, carbs: 20, fat: 2.5 }, servings: [katori(150), bowl(250)], source: 'INDB' },
  { slug: 'poha', name: 'Poha', aliases: ['flattened rice', 'aval', 'chivda'], category: 'Rice & Grains', per100g: { kcal: 130, protein: 2.5, carbs: 25, fat: 2.5 }, servings: [katori(150), bowl(250)], source: 'INDB' },
  { slug: 'upma', name: 'Upma', aliases: ['uppma', 'rava upma'], category: 'Rice & Grains', per100g: { kcal: 135, protein: 3, carbs: 22, fat: 4 }, servings: [katori(150), bowl(250)], source: 'INDB' },
  { slug: 'oats-cooked', name: 'Oats (cooked in water)', aliases: ['oatmeal', 'dalia oats'], category: 'Rice & Grains', per100g: { kcal: 71, protein: 2.5, carbs: 12, fat: 1.5 }, servings: [katori(150), bowl(250)], source: 'USDA' },
  { slug: 'daliya', name: 'Daliya (broken wheat, cooked)', aliases: ['dalia', 'bulgur', 'lapsi'], category: 'Rice & Grains', per100g: { kcal: 120, protein: 4, carbs: 24, fat: 1 }, servings: [katori(150), bowl(250)], source: 'IFCT' },

  // ── Rotis & Breads ─────────────────────────────────────────────────────────
  { slug: 'roti-chapati', name: 'Roti / Chapati', aliases: ['phulka', 'chapatti', 'wheat roti'], category: 'Rotis & Breads', per100g: { kcal: 297, protein: 9, carbs: 51, fat: 6 }, servings: [piece(40, 'roti'), piece(35, 'phulka')], source: 'INDB' },
  { slug: 'tandoori-roti', name: 'Tandoori Roti', aliases: ['tandoor roti'], category: 'Rotis & Breads', per100g: { kcal: 285, protein: 9, carbs: 52, fat: 5 }, servings: [piece(50, 'roti')], source: 'INDB' },
  { slug: 'aloo-paratha', name: 'Aloo Paratha', aliases: ['potato paratha'], category: 'Rotis & Breads', per100g: { kcal: 240, protein: 5, carbs: 32, fat: 10 }, servings: [piece(120, 'paratha')], source: 'INDB' },
  { slug: 'plain-paratha', name: 'Plain Paratha', aliases: ['paratha', 'parantha'], category: 'Rotis & Breads', per100g: { kcal: 320, protein: 7, carbs: 44, fat: 13 }, servings: [piece(70, 'paratha')], source: 'INDB' },
  { slug: 'naan', name: 'Naan', aliases: ['butter naan'], category: 'Rotis & Breads', per100g: { kcal: 310, protein: 9, carbs: 50, fat: 8 }, servings: [piece(90, 'naan')], source: 'INDB' },
  { slug: 'bhatura', name: 'Bhatura', aliases: ['bhature'], category: 'Rotis & Breads', per100g: { kcal: 330, protein: 7, carbs: 42, fat: 15 }, servings: [piece(80, 'bhatura')], source: 'INDB' },
  { slug: 'puri', name: 'Puri', aliases: ['poori', 'fried puri'], category: 'Rotis & Breads', per100g: { kcal: 360, protein: 7, carbs: 45, fat: 17 }, servings: [piece(25, 'puri')], source: 'INDB' },
  { slug: 'bajra-roti', name: 'Bajra Roti', aliases: ['pearl millet roti', 'bajra bhakri'], category: 'Rotis & Breads', per100g: { kcal: 280, protein: 8, carbs: 50, fat: 5 }, servings: [piece(50, 'roti')], source: 'IFCT' },
  { slug: 'jowar-roti', name: 'Jowar Roti', aliases: ['sorghum roti', 'jowar bhakri'], category: 'Rotis & Breads', per100g: { kcal: 270, protein: 7, carbs: 55, fat: 3 }, servings: [piece(50, 'roti')], source: 'IFCT' },
  { slug: 'bread-white', name: 'White Bread', aliases: ['bread slice', 'pav', 'double roti'], category: 'Rotis & Breads', per100g: { kcal: 265, protein: 9, carbs: 49, fat: 3.2 }, servings: [piece(30, 'slice')], source: 'USDA' },
  { slug: 'bread-brown', name: 'Brown / Whole-wheat Bread', aliases: ['multigrain bread', 'atta bread'], category: 'Rotis & Breads', per100g: { kcal: 250, protein: 12, carbs: 43, fat: 3.5 }, servings: [piece(32, 'slice')], source: 'USDA' },

  // ── South Indian ───────────────────────────────────────────────────────────
  { slug: 'idli', name: 'Idli', aliases: ['idly'], category: 'South Indian', per100g: { kcal: 135, protein: 4, carbs: 28, fat: 0.5 }, servings: [piece(40, 'idli')], source: 'INDB' },
  { slug: 'plain-dosa', name: 'Plain Dosa', aliases: ['dosa', 'sada dosa'], category: 'South Indian', per100g: { kcal: 205, protein: 4, carbs: 30, fat: 7 }, servings: [piece(80, 'dosa')], source: 'INDB' },
  { slug: 'masala-dosa', name: 'Masala Dosa', aliases: ['masala dose'], category: 'South Indian', per100g: { kcal: 200, protein: 4, carbs: 28, fat: 8 }, servings: [piece(150, 'dosa')], source: 'INDB' },
  { slug: 'medu-vada', name: 'Medu Vada', aliases: ['vada', 'urad vada'], category: 'South Indian', per100g: { kcal: 280, protein: 7, carbs: 30, fat: 14 }, servings: [piece(45, 'vada')], source: 'INDB' },
  { slug: 'uttapam', name: 'Uttapam', aliases: ['uthappam'], category: 'South Indian', per100g: { kcal: 165, protein: 4, carbs: 26, fat: 5 }, servings: [piece(120, 'uttapam')], source: 'INDB' },
  { slug: 'rava-idli', name: 'Rava Idli', aliases: ['sooji idli'], category: 'South Indian', per100g: { kcal: 155, protein: 4, carbs: 26, fat: 4 }, servings: [piece(45, 'idli')], source: 'INDB' },
  { slug: 'coconut-chutney', name: 'Coconut Chutney', aliases: ['nariyal chutney'], category: 'South Indian', per100g: { kcal: 180, protein: 3, carbs: 8, fat: 15 }, servings: [tbsp(20)], source: 'INDB' },

  // ── Vegetables & Sabzi (cooked) ───────────────────────────────────────────
  { slug: 'aloo-gobi', name: 'Aloo Gobi', aliases: ['potato cauliflower'], category: 'Vegetables & Sabzi', per100g: { kcal: 120, protein: 3, carbs: 14, fat: 6 }, servings: [katori(150)], source: 'INDB' },
  { slug: 'aloo-matar', name: 'Aloo Matar', aliases: ['potato peas'], category: 'Vegetables & Sabzi', per100g: { kcal: 118, protein: 3.5, carbs: 16, fat: 5 }, servings: [katori(150)], source: 'INDB' },
  { slug: 'bhindi-fry', name: 'Bhindi Fry', aliases: ['okra', 'ladyfinger'], category: 'Vegetables & Sabzi', per100g: { kcal: 130, protein: 2.5, carbs: 10, fat: 9 }, servings: [katori(150)], source: 'INDB' },
  { slug: 'baingan-bharta', name: 'Baingan Bharta', aliases: ['brinjal', 'eggplant bharta'], category: 'Vegetables & Sabzi', per100g: { kcal: 110, protein: 2.5, carbs: 10, fat: 7 }, servings: [katori(150)], source: 'INDB' },
  { slug: 'mixed-veg', name: 'Mixed Vegetable Sabzi', aliases: ['mix veg', 'sabzi'], category: 'Vegetables & Sabzi', per100g: { kcal: 115, protein: 3, carbs: 12, fat: 6 }, servings: [katori(150)], source: 'INDB' },
  { slug: 'palak-sabzi', name: 'Palak Sabzi', aliases: ['spinach', 'saag'], category: 'Vegetables & Sabzi', per100g: { kcal: 95, protein: 3.5, carbs: 7, fat: 6 }, servings: [katori(150)], source: 'INDB' },
  { slug: 'palak-paneer', name: 'Palak Paneer', aliases: ['saag paneer'], category: 'Vegetables & Sabzi', per100g: { kcal: 160, protein: 7, carbs: 8, fat: 11 }, servings: [katori(150)], source: 'INDB' },
  { slug: 'aloo-jeera', name: 'Aloo Jeera', aliases: ['jeera aloo', 'cumin potato'], category: 'Vegetables & Sabzi', per100g: { kcal: 130, protein: 2.5, carbs: 20, fat: 5 }, servings: [katori(150)], source: 'INDB' },
  { slug: 'matar-paneer', name: 'Matar Paneer', aliases: ['peas paneer'], category: 'Vegetables & Sabzi', per100g: { kcal: 170, protein: 7, carbs: 12, fat: 10 }, servings: [katori(150)], source: 'INDB' },
  { slug: 'paneer-butter-masala', name: 'Paneer Butter Masala', aliases: ['paneer makhani', 'shahi paneer'], category: 'Vegetables & Sabzi', per100g: { kcal: 230, protein: 8, carbs: 10, fat: 18 }, servings: [katori(150)], source: 'INDB' },
  { slug: 'bhindi-masala', name: 'Bhindi Masala', aliases: ['okra masala'], category: 'Vegetables & Sabzi', per100g: { kcal: 125, protein: 2.5, carbs: 11, fat: 8 }, servings: [katori(150)], source: 'INDB' },
  { slug: 'lauki-sabzi', name: 'Lauki Sabzi', aliases: ['bottle gourd', 'ghiya'], category: 'Vegetables & Sabzi', per100g: { kcal: 75, protein: 1.5, carbs: 7, fat: 5 }, servings: [katori(150)], source: 'INDB' },
  { slug: 'kadhi', name: 'Kadhi', aliases: ['besan kadhi', 'kadi'], category: 'Vegetables & Sabzi', per100g: { kcal: 105, protein: 3.5, carbs: 8, fat: 6.5 }, servings: [katori(150)], source: 'INDB' },

  // ── Paneer, Eggs, Dairy ────────────────────────────────────────────────────
  { slug: 'paneer-raw', name: 'Paneer (plain)', aliases: ['cottage cheese', 'panir'], category: 'Paneer, Egg & Dairy', per100g: { kcal: 265, protein: 18, carbs: 6, fat: 20 }, servings: [{ label: '1 cube (15 g)', grams: 15 }, katori(100)], source: 'IFCT' },
  { slug: 'tofu', name: 'Tofu', aliases: ['soya paneer', 'bean curd'], category: 'Paneer, Egg & Dairy', per100g: { kcal: 145, protein: 15, carbs: 4, fat: 8 }, servings: [katori(100)], source: 'USDA' },
  { slug: 'egg-boiled', name: 'Boiled Egg', aliases: ['anda', 'egg', 'whole egg'], category: 'Paneer, Egg & Dairy', per100g: { kcal: 155, protein: 13, carbs: 1.1, fat: 11 }, servings: [piece(50, 'egg')], source: 'USDA' },
  { slug: 'egg-omelette', name: 'Egg Omelette', aliases: ['omelette', 'anda bhurji'], category: 'Paneer, Egg & Dairy', per100g: { kcal: 195, protein: 11, carbs: 2, fat: 16 }, servings: [piece(60, 'egg')], source: 'INDB' },
  { slug: 'egg-white', name: 'Egg White (boiled)', aliases: ['egg whites', 'anda safedi'], category: 'Paneer, Egg & Dairy', per100g: { kcal: 52, protein: 11, carbs: 0.7, fat: 0.2 }, servings: [piece(33, 'egg white')], source: 'USDA' },
  { slug: 'milk-full', name: 'Milk (full cream)', aliases: ['doodh', 'whole milk'], category: 'Paneer, Egg & Dairy', per100g: { kcal: 62, protein: 3.2, carbs: 4.7, fat: 3.5 }, servings: [glass(200), cup(150)], source: 'IFCT' },
  { slug: 'milk-toned', name: 'Milk (toned)', aliases: ['toned milk', 'low fat milk'], category: 'Paneer, Egg & Dairy', per100g: { kcal: 47, protein: 3.2, carbs: 4.7, fat: 1.5 }, servings: [glass(200), cup(150)], source: 'IFCT' },
  { slug: 'curd-dahi', name: 'Curd / Dahi', aliases: ['yogurt', 'dahi'], category: 'Paneer, Egg & Dairy', per100g: { kcal: 60, protein: 3.1, carbs: 4.7, fat: 3.3 }, servings: [katori(150), bowl(250)], source: 'IFCT' },
  { slug: 'greek-yogurt', name: 'Greek Yogurt (plain)', aliases: ['hung curd', 'greek curd'], category: 'Paneer, Egg & Dairy', per100g: { kcal: 97, protein: 9, carbs: 4, fat: 5 }, servings: [katori(150)], source: 'USDA' },
  { slug: 'buttermilk', name: 'Buttermilk (chaas)', aliases: ['chaas', 'chaach', 'mattha'], category: 'Paneer, Egg & Dairy', per100g: { kcal: 40, protein: 2.5, carbs: 4.5, fat: 1 }, servings: [glass(200)], source: 'INDB' },
  { slug: 'lassi-sweet', name: 'Sweet Lassi', aliases: ['lassi'], category: 'Paneer, Egg & Dairy', per100g: { kcal: 100, protein: 2.5, carbs: 16, fat: 3 }, servings: [glass(250)], source: 'INDB' },
  { slug: 'ghee', name: 'Ghee', aliases: ['clarified butter', 'desi ghee'], category: 'Paneer, Egg & Dairy', per100g: { kcal: 900, protein: 0, carbs: 0, fat: 100 }, servings: [tsp(5), tbsp(14)], source: 'IFCT' },
  { slug: 'butter', name: 'Butter', aliases: ['makhan'], category: 'Paneer, Egg & Dairy', per100g: { kcal: 717, protein: 0.9, carbs: 0.1, fat: 81 }, servings: [tsp(5), tbsp(14)], source: 'USDA' },
  { slug: 'cheese', name: 'Cheese (processed)', aliases: ['cheese slice', 'amul cheese'], category: 'Paneer, Egg & Dairy', per100g: { kcal: 350, protein: 20, carbs: 3, fat: 28 }, servings: [piece(20, 'slice')], source: 'USDA' },

  // ── Chicken, Fish & Meat (cooked) ──────────────────────────────────────────
  { slug: 'chicken-curry', name: 'Chicken Curry', aliases: ['chicken masala', 'murgh'], category: 'Chicken, Fish & Meat', per100g: { kcal: 180, protein: 15, carbs: 4, fat: 12 }, servings: [katori(150)], source: 'INDB' },
  { slug: 'butter-chicken', name: 'Butter Chicken', aliases: ['murgh makhani'], category: 'Chicken, Fish & Meat', per100g: { kcal: 240, protein: 14, carbs: 6, fat: 18 }, servings: [katori(150)], source: 'INDB' },
  { slug: 'chicken-tandoori', name: 'Tandoori Chicken', aliases: ['tandoori', 'grilled chicken'], category: 'Chicken, Fish & Meat', per100g: { kcal: 175, protein: 25, carbs: 2, fat: 8 }, servings: [piece(100, 'piece')], source: 'INDB' },
  { slug: 'chicken-breast-cooked', name: 'Chicken Breast (grilled)', aliases: ['boiled chicken', 'chicken breast'], category: 'Chicken, Fish & Meat', per100g: { kcal: 165, protein: 31, carbs: 0, fat: 3.6 }, servings: [piece(100, 'piece')], source: 'USDA' },
  { slug: 'egg-curry', name: 'Egg Curry', aliases: ['anda curry'], category: 'Chicken, Fish & Meat', per100g: { kcal: 160, protein: 8, carbs: 5, fat: 12 }, servings: [katori(150)], source: 'INDB' },
  { slug: 'fish-curry', name: 'Fish Curry', aliases: ['machli', 'macher jhol'], category: 'Chicken, Fish & Meat', per100g: { kcal: 150, protein: 14, carbs: 4, fat: 9 }, servings: [katori(150)], source: 'INDB' },
  { slug: 'fish-fry', name: 'Fish Fry', aliases: ['fried fish', 'machli fry'], category: 'Chicken, Fish & Meat', per100g: { kcal: 200, protein: 18, carbs: 6, fat: 12 }, servings: [piece(80, 'piece')], source: 'INDB' },
  { slug: 'mutton-curry', name: 'Mutton Curry', aliases: ['gosht', 'lamb curry', 'goat curry'], category: 'Chicken, Fish & Meat', per100g: { kcal: 230, protein: 16, carbs: 4, fat: 17 }, servings: [katori(150)], source: 'INDB' },
  { slug: 'prawn-curry', name: 'Prawn Curry', aliases: ['jhinga', 'shrimp curry'], category: 'Chicken, Fish & Meat', per100g: { kcal: 145, protein: 15, carbs: 4, fat: 8 }, servings: [katori(150)], source: 'INDB' },
  { slug: 'keema', name: 'Keema (minced meat)', aliases: ['kheema', 'minced mutton'], category: 'Chicken, Fish & Meat', per100g: { kcal: 215, protein: 15, carbs: 5, fat: 15 }, servings: [katori(150)], source: 'INDB' },

  // ── Snacks & Street Food ───────────────────────────────────────────────────
  { slug: 'samosa', name: 'Samosa', aliases: ['singara'], category: 'Snacks & Street Food', per100g: { kcal: 300, protein: 5, carbs: 32, fat: 17 }, servings: [piece(60, 'samosa')], source: 'INDB' },
  { slug: 'kachori', name: 'Kachori', aliases: ['kachauri'], category: 'Snacks & Street Food', per100g: { kcal: 330, protein: 6, carbs: 35, fat: 18 }, servings: [piece(50, 'kachori')], source: 'INDB' },
  { slug: 'pakora', name: 'Pakora / Bhaji', aliases: ['bhajiya', 'bajji', 'fritter'], category: 'Snacks & Street Food', per100g: { kcal: 315, protein: 6, carbs: 28, fat: 20 }, servings: [piece(25, 'pakora')], source: 'INDB' },
  { slug: 'vada-pav', name: 'Vada Pav', aliases: ['wada pav'], category: 'Snacks & Street Food', per100g: { kcal: 290, protein: 6, carbs: 40, fat: 12 }, servings: [piece(150, 'vada pav')], source: 'INDB' },
  { slug: 'pav-bhaji', name: 'Pav Bhaji', aliases: ['bhaji pav'], category: 'Snacks & Street Food', per100g: { kcal: 180, protein: 4, carbs: 22, fat: 9 }, servings: [{ label: '1 plate (300 g)', grams: 300 }], source: 'INDB' },
  { slug: 'dhokla', name: 'Dhokla', aliases: ['khaman'], category: 'Snacks & Street Food', per100g: { kcal: 160, protein: 6, carbs: 26, fat: 4 }, servings: [piece(40, 'piece')], source: 'INDB' },
  { slug: 'chole-bhature', name: 'Chole Bhature', aliases: ['chhole bhature'], category: 'Snacks & Street Food', per100g: { kcal: 250, protein: 7, carbs: 30, fat: 11 }, servings: [{ label: '1 plate (350 g)', grams: 350 }], source: 'INDB' },
  { slug: 'pani-puri', name: 'Pani Puri', aliases: ['golgappa', 'puchka', 'gol gappe'], category: 'Snacks & Street Food', per100g: { kcal: 180, protein: 3, carbs: 30, fat: 5 }, servings: [piece(20, 'piece')], source: 'INDB' },
  { slug: 'bhel-puri', name: 'Bhel Puri', aliases: ['bhelpuri'], category: 'Snacks & Street Food', per100g: { kcal: 220, protein: 5, carbs: 34, fat: 7 }, servings: [katori(100)], source: 'INDB' },
  { slug: 'aloo-tikki', name: 'Aloo Tikki', aliases: ['potato tikki', 'tikki'], category: 'Snacks & Street Food', per100g: { kcal: 210, protein: 3, carbs: 26, fat: 10 }, servings: [piece(60, 'tikki')], source: 'INDB' },
  { slug: 'spring-roll', name: 'Veg Spring Roll', aliases: ['spring roll'], category: 'Snacks & Street Food', per100g: { kcal: 250, protein: 5, carbs: 30, fat: 12 }, servings: [piece(60, 'roll')], source: 'INDB' },
  { slug: 'maggi', name: 'Maggi Noodles (cooked)', aliases: ['instant noodles', 'noodles'], category: 'Snacks & Street Food', per100g: { kcal: 175, protein: 4, carbs: 25, fat: 6.5 }, servings: [{ label: '1 pack cooked (200 g)', grams: 200 }], source: 'INDB' },
  { slug: 'poha-chivda', name: 'Namkeen (chivda/mixture)', aliases: ['mixture', 'chivda', 'namkeen'], category: 'Snacks & Street Food', per100g: { kcal: 490, protein: 12, carbs: 50, fat: 27 }, servings: [katori(30)], source: 'INDB' },
  { slug: 'biscuit-marie', name: 'Marie Biscuit', aliases: ['biscuit', 'parle g', 'tea biscuit'], category: 'Snacks & Street Food', per100g: { kcal: 440, protein: 7, carbs: 78, fat: 11 }, servings: [piece(5, 'biscuit')], source: 'USDA' },

  // ── Fruits ─────────────────────────────────────────────────────────────────
  { slug: 'banana', name: 'Banana', aliases: ['kela'], category: 'Fruits', per100g: { kcal: 89, protein: 1.1, carbs: 23, fat: 0.3 }, servings: [piece(120, 'banana')], source: 'USDA' },
  { slug: 'apple', name: 'Apple', aliases: ['seb'], category: 'Fruits', per100g: { kcal: 52, protein: 0.3, carbs: 14, fat: 0.2 }, servings: [piece(180, 'apple')], source: 'USDA' },
  { slug: 'mango', name: 'Mango', aliases: ['aam'], category: 'Fruits', per100g: { kcal: 60, protein: 0.8, carbs: 15, fat: 0.4 }, servings: [piece(200, 'mango')], source: 'USDA' },
  { slug: 'orange', name: 'Orange', aliases: ['santra', 'mosambi'], category: 'Fruits', per100g: { kcal: 47, protein: 0.9, carbs: 12, fat: 0.1 }, servings: [piece(130, 'orange')], source: 'USDA' },
  { slug: 'grapes', name: 'Grapes', aliases: ['angoor'], category: 'Fruits', per100g: { kcal: 69, protein: 0.7, carbs: 18, fat: 0.2 }, servings: [katori(100)], source: 'USDA' },
  { slug: 'papaya', name: 'Papaya', aliases: ['papita'], category: 'Fruits', per100g: { kcal: 43, protein: 0.5, carbs: 11, fat: 0.3 }, servings: [katori(140)], source: 'USDA' },
  { slug: 'guava', name: 'Guava', aliases: ['amrood'], category: 'Fruits', per100g: { kcal: 68, protein: 2.6, carbs: 14, fat: 1 }, servings: [piece(120, 'guava')], source: 'USDA' },
  { slug: 'watermelon', name: 'Watermelon', aliases: ['tarbooj'], category: 'Fruits', per100g: { kcal: 30, protein: 0.6, carbs: 8, fat: 0.2 }, servings: [katori(150)], source: 'USDA' },
  { slug: 'pomegranate', name: 'Pomegranate', aliases: ['anar'], category: 'Fruits', per100g: { kcal: 83, protein: 1.7, carbs: 19, fat: 1.2 }, servings: [katori(100)], source: 'USDA' },
  { slug: 'grapes-black', name: 'Chikoo (Sapota)', aliases: ['sapota', 'chiku'], category: 'Fruits', per100g: { kcal: 83, protein: 0.4, carbs: 20, fat: 1.1 }, servings: [piece(90, 'chikoo')], source: 'IFCT' },
  { slug: 'dates', name: 'Dates', aliases: ['khajur'], category: 'Fruits', per100g: { kcal: 282, protein: 2.5, carbs: 75, fat: 0.4 }, servings: [piece(8, 'date')], source: 'USDA' },
  { slug: 'kiwi', name: 'Kiwi', aliases: ['kiwifruit'], category: 'Fruits', per100g: { kcal: 61, protein: 1.1, carbs: 15, fat: 0.5 }, servings: [piece(75, 'kiwi')], source: 'USDA' },
  { slug: 'dragon-fruit', name: 'Dragon Fruit', aliases: ['pitaya', 'kamalam'], category: 'Fruits', per100g: { kcal: 60, protein: 1.2, carbs: 13, fat: 0.4 }, servings: [cup(150), katori(150)], source: 'USDA' },
  { slug: 'pineapple', name: 'Pineapple', aliases: ['ananas'], category: 'Fruits', per100g: { kcal: 50, protein: 0.5, carbs: 13, fat: 0.1 }, servings: [katori(150), piece(80, 'slice')], source: 'USDA' },
  { slug: 'strawberry', name: 'Strawberry', aliases: ['strawberries'], category: 'Fruits', per100g: { kcal: 32, protein: 0.7, carbs: 8, fat: 0.3 }, servings: [katori(100), piece(12, 'strawberry')], source: 'USDA' },
  { slug: 'pear', name: 'Pear', aliases: ['nashpati'], category: 'Fruits', per100g: { kcal: 57, protein: 0.4, carbs: 15, fat: 0.1 }, servings: [piece(180, 'pear')], source: 'USDA' },
  { slug: 'litchi', name: 'Litchi', aliases: ['lychee'], category: 'Fruits', per100g: { kcal: 66, protein: 0.8, carbs: 17, fat: 0.4 }, servings: [piece(10, 'litchi'), katori(100)], source: 'USDA' },
  { slug: 'custard-apple', name: 'Custard Apple (Sitaphal)', aliases: ['sitaphal', 'sharifa'], category: 'Fruits', per100g: { kcal: 94, protein: 2.1, carbs: 24, fat: 0.3 }, servings: [katori(100)], source: 'IFCT' },
  { slug: 'muskmelon', name: 'Muskmelon', aliases: ['kharbooja', 'cantaloupe'], category: 'Fruits', per100g: { kcal: 34, protein: 0.8, carbs: 8, fat: 0.2 }, servings: [katori(150)], source: 'USDA' },
  { slug: 'jackfruit-ripe', name: 'Jackfruit (ripe)', aliases: ['kathal', 'chakka'], category: 'Fruits', per100g: { kcal: 95, protein: 1.7, carbs: 23, fat: 0.6 }, servings: [katori(100)], source: 'USDA' },
  { slug: 'avocado', name: 'Avocado', aliases: ['butter fruit', 'makhanphal'], category: 'Fruits', per100g: { kcal: 160, protein: 2, carbs: 9, fat: 15 }, servings: [{ label: '1/2 fruit (100 g)', grams: 100 }], source: 'USDA' },
  { slug: 'jamun', name: 'Jamun (Java Plum)', aliases: ['black plum', 'kala jamun'], category: 'Fruits', per100g: { kcal: 60, protein: 0.7, carbs: 14, fat: 0.2 }, servings: [katori(100)], source: 'IFCT' },
  { slug: 'amla', name: 'Amla (Indian Gooseberry)', aliases: ['gooseberry', 'nellikai'], category: 'Fruits', per100g: { kcal: 44, protein: 0.9, carbs: 10, fat: 0.6 }, servings: [piece(40, 'amla')], source: 'IFCT' },
  { slug: 'plum', name: 'Plum', aliases: ['aloobukhara'], category: 'Fruits', per100g: { kcal: 46, protein: 0.7, carbs: 11, fat: 0.3 }, servings: [piece(65, 'plum')], source: 'USDA' },
  { slug: 'peach', name: 'Peach', aliases: ['aadu'], category: 'Fruits', per100g: { kcal: 39, protein: 0.9, carbs: 10, fat: 0.3 }, servings: [piece(150, 'peach')], source: 'USDA' },
  { slug: 'fig-fresh', name: 'Fig (fresh, Anjeer)', aliases: ['anjeer', 'anjir'], category: 'Fruits', per100g: { kcal: 74, protein: 0.8, carbs: 19, fat: 0.3 }, servings: [piece(50, 'fig')], source: 'USDA' },
  { slug: 'raisins', name: 'Raisins (Kishmish)', aliases: ['kishmish', 'dry grapes'], category: 'Fruits', per100g: { kcal: 299, protein: 3.1, carbs: 79, fat: 0.5 }, servings: [tbsp(10)], source: 'USDA' },
  { slug: 'blueberry', name: 'Blueberries', aliases: ['blueberry'], category: 'Fruits', per100g: { kcal: 57, protein: 0.7, carbs: 14, fat: 0.3 }, servings: [katori(100)], source: 'USDA' },

  // ── Nuts, Seeds & Oils ─────────────────────────────────────────────────────
  { slug: 'almonds', name: 'Almonds', aliases: ['badam'], category: 'Nuts, Seeds & Oils', per100g: { kcal: 579, protein: 21, carbs: 22, fat: 50 }, servings: [{ label: '10 pieces (12 g)', grams: 12 }, tbsp(10)], source: 'USDA' },
  { slug: 'peanuts', name: 'Peanuts', aliases: ['moongfali', 'groundnut'], category: 'Nuts, Seeds & Oils', per100g: { kcal: 567, protein: 26, carbs: 16, fat: 49 }, servings: [katori(30), tbsp(10)], source: 'USDA' },
  { slug: 'cashew', name: 'Cashew', aliases: ['kaju'], category: 'Nuts, Seeds & Oils', per100g: { kcal: 553, protein: 18, carbs: 30, fat: 44 }, servings: [{ label: '10 pieces (16 g)', grams: 16 }], source: 'USDA' },
  { slug: 'walnut', name: 'Walnut', aliases: ['akhrot'], category: 'Nuts, Seeds & Oils', per100g: { kcal: 654, protein: 15, carbs: 14, fat: 65 }, servings: [{ label: '2 halves (8 g)', grams: 8 }], source: 'USDA' },
  { slug: 'peanut-butter', name: 'Peanut Butter', aliases: ['moongfali butter'], category: 'Nuts, Seeds & Oils', per100g: { kcal: 588, protein: 25, carbs: 20, fat: 50 }, servings: [tbsp(16)], source: 'USDA' },
  { slug: 'cooking-oil', name: 'Cooking Oil', aliases: ['tel', 'refined oil', 'sunflower oil', 'mustard oil'], category: 'Nuts, Seeds & Oils', per100g: { kcal: 884, protein: 0, carbs: 0, fat: 100 }, servings: [tsp(5), tbsp(14)], source: 'IFCT' },
  { slug: 'coconut', name: 'Coconut (fresh)', aliases: ['nariyal'], category: 'Nuts, Seeds & Oils', per100g: { kcal: 354, protein: 3.3, carbs: 15, fat: 33 }, servings: [tbsp(15)], source: 'USDA' },
  { slug: 'chia-seeds', name: 'Chia Seeds', aliases: ['chia'], category: 'Nuts, Seeds & Oils', per100g: { kcal: 486, protein: 17, carbs: 42, fat: 31 }, servings: [tbsp(12)], source: 'USDA' },
  { slug: 'flax-seeds', name: 'Flax Seeds', aliases: ['alsi', 'flaxseed'], category: 'Nuts, Seeds & Oils', per100g: { kcal: 534, protein: 18, carbs: 29, fat: 42 }, servings: [tbsp(10)], source: 'USDA' },

  // ── Sweets & Desserts ──────────────────────────────────────────────────────
  { slug: 'gulab-jamun', name: 'Gulab Jamun', aliases: ['gulabjamun'], category: 'Sweets & Desserts', per100g: { kcal: 320, protein: 5, carbs: 45, fat: 14 }, servings: [piece(40, 'piece')], source: 'INDB' },
  { slug: 'jalebi', name: 'Jalebi', aliases: ['jilbi'], category: 'Sweets & Desserts', per100g: { kcal: 360, protein: 3, carbs: 55, fat: 15 }, servings: [piece(25, 'piece')], source: 'INDB' },
  { slug: 'rasgulla', name: 'Rasgulla', aliases: ['rosogolla'], category: 'Sweets & Desserts', per100g: { kcal: 190, protein: 4, carbs: 38, fat: 3 }, servings: [piece(45, 'piece')], source: 'INDB' },
  { slug: 'kaju-katli', name: 'Kaju Katli', aliases: ['kaju barfi'], category: 'Sweets & Desserts', per100g: { kcal: 460, protein: 9, carbs: 52, fat: 24 }, servings: [piece(15, 'piece')], source: 'INDB' },
  { slug: 'laddu-besan', name: 'Besan Laddu', aliases: ['ladoo', 'laddoo'], category: 'Sweets & Desserts', per100g: { kcal: 420, protein: 8, carbs: 50, fat: 21 }, servings: [piece(40, 'laddu')], source: 'INDB' },
  { slug: 'kheer', name: 'Kheer', aliases: ['payasam', 'rice pudding'], category: 'Sweets & Desserts', per100g: { kcal: 150, protein: 4, carbs: 22, fat: 5 }, servings: [katori(150)], source: 'INDB' },
  { slug: 'halwa-suji', name: 'Suji Halwa', aliases: ['sooji halwa', 'rava sheera'], category: 'Sweets & Desserts', per100g: { kcal: 340, protein: 5, carbs: 45, fat: 15 }, servings: [katori(120)], source: 'INDB' },
  { slug: 'gajar-halwa', name: 'Gajar Halwa', aliases: ['carrot halwa'], category: 'Sweets & Desserts', per100g: { kcal: 280, protein: 4, carbs: 35, fat: 13 }, servings: [katori(120)], source: 'INDB' },
  { slug: 'ice-cream', name: 'Ice Cream (vanilla)', aliases: ['icecream'], category: 'Sweets & Desserts', per100g: { kcal: 207, protein: 3.5, carbs: 24, fat: 11 }, servings: [{ label: '1 scoop (60 g)', grams: 60 }], source: 'USDA' },
  { slug: 'sugar', name: 'Sugar', aliases: ['cheeni', 'chini'], category: 'Sweets & Desserts', per100g: { kcal: 387, protein: 0, carbs: 100, fat: 0 }, servings: [tsp(5), tbsp(15)], source: 'USDA' },
  { slug: 'honey', name: 'Honey', aliases: ['shahad', 'madhu'], category: 'Sweets & Desserts', per100g: { kcal: 304, protein: 0.3, carbs: 82, fat: 0 }, servings: [tsp(7), tbsp(21)], source: 'USDA' },

  // ── Beverages ──────────────────────────────────────────────────────────────
  { slug: 'chai', name: 'Chai (with milk & sugar)', aliases: ['tea', 'masala chai'], category: 'Beverages', per100g: { kcal: 55, protein: 1.5, carbs: 8, fat: 1.8 }, servings: [cup(120), glass(200)], source: 'INDB' },
  { slug: 'black-coffee', name: 'Black Coffee (no sugar)', aliases: ['coffee'], category: 'Beverages', per100g: { kcal: 2, protein: 0.1, carbs: 0, fat: 0 }, servings: [cup(120)], source: 'USDA' },
  { slug: 'coffee-milk', name: 'Coffee (with milk & sugar)', aliases: ['milk coffee', 'filter coffee'], category: 'Beverages', per100g: { kcal: 60, protein: 1.6, carbs: 9, fat: 1.8 }, servings: [cup(120), glass(200)], source: 'INDB' },
  { slug: 'cola', name: 'Cola / Soft Drink', aliases: ['soda', 'cold drink', 'pepsi', 'coke'], category: 'Beverages', per100g: { kcal: 42, protein: 0, carbs: 10.6, fat: 0 }, servings: [glass(250), { label: '1 can (330 ml)', grams: 330 }], source: 'USDA' },
  { slug: 'orange-juice', name: 'Orange Juice', aliases: ['juice', 'fruit juice'], category: 'Beverages', per100g: { kcal: 45, protein: 0.7, carbs: 10, fat: 0.2 }, servings: [glass(250)], source: 'USDA' },
  { slug: 'coconut-water', name: 'Coconut Water', aliases: ['nariyal pani'], category: 'Beverages', per100g: { kcal: 19, protein: 0.7, carbs: 3.7, fat: 0.2 }, servings: [glass(250)], source: 'USDA' },
  { slug: 'mango-shake', name: 'Mango Shake', aliases: ['milkshake'], category: 'Beverages', per100g: { kcal: 95, protein: 2.5, carbs: 16, fat: 2.5 }, servings: [glass(250)], source: 'INDB' },
  { slug: 'protein-shake-whey', name: 'Whey Protein (1 scoop)', aliases: ['protein powder', 'whey'], category: 'Beverages', per100g: { kcal: 400, protein: 80, carbs: 8, fat: 6 }, servings: [{ label: '1 scoop (30 g)', grams: 30 }], source: 'USDA' },

  // ── Raw staples & basics ───────────────────────────────────────────────────
  { slug: 'atta', name: 'Wheat Flour (atta, raw)', aliases: ['whole wheat flour', 'gehu atta'], category: 'Staples & Basics', per100g: { kcal: 340, protein: 12, carbs: 69, fat: 2 }, servings: [tbsp(10), katori(120)], source: 'IFCT' },
  { slug: 'besan', name: 'Besan (gram flour)', aliases: ['chickpea flour', 'gram flour'], category: 'Staples & Basics', per100g: { kcal: 387, protein: 22, carbs: 58, fat: 6.7 }, servings: [tbsp(10), katori(100)], source: 'IFCT' },
  { slug: 'rice-raw', name: 'Rice (raw, uncooked)', aliases: ['kacha chawal', 'raw rice'], category: 'Staples & Basics', per100g: { kcal: 345, protein: 6.8, carbs: 78, fat: 0.5 }, servings: [katori(100)], source: 'IFCT' },
  { slug: 'sugar-jaggery', name: 'Jaggery (gur)', aliases: ['gur', 'gud'], category: 'Staples & Basics', per100g: { kcal: 383, protein: 0.4, carbs: 98, fat: 0.1 }, servings: [piece(20, 'piece'), tsp(6)], source: 'IFCT' },
  { slug: 'potato-boiled', name: 'Potato (boiled)', aliases: ['aloo', 'aalu'], category: 'Staples & Basics', per100g: { kcal: 87, protein: 1.9, carbs: 20, fat: 0.1 }, servings: [piece(120, 'potato'), katori(150)], source: 'USDA' },
  { slug: 'sweet-potato', name: 'Sweet Potato (boiled)', aliases: ['shakarkandi'], category: 'Staples & Basics', per100g: { kcal: 90, protein: 2, carbs: 21, fat: 0.1 }, servings: [piece(130, 'piece')], source: 'USDA' },
  { slug: 'sweet-corn', name: 'Sweet Corn (boiled)', aliases: ['bhutta', 'makka', 'corn'], category: 'Staples & Basics', per100g: { kcal: 96, protein: 3.4, carbs: 21, fat: 1.5 }, servings: [katori(150), piece(150, 'cob')], source: 'USDA' },

  // ── Salad & Raw Veggies ────────────────────────────────────────────────────
  { slug: 'green-salad', name: 'Green Salad (no dressing)', aliases: ['salad', 'kachumber'], category: 'Salad & Raw Veggies', per100g: { kcal: 25, protein: 1, carbs: 5, fat: 0.2 }, servings: [katori(100), bowl(200)], source: 'IFCT' },
  { slug: 'cucumber', name: 'Cucumber', aliases: ['kheera', 'kakdi'], category: 'Salad & Raw Veggies', per100g: { kcal: 15, protein: 0.7, carbs: 3.6, fat: 0.1 }, servings: [katori(100), piece(120, 'cucumber')], source: 'USDA' },
  { slug: 'tomato', name: 'Tomato', aliases: ['tamatar'], category: 'Salad & Raw Veggies', per100g: { kcal: 18, protein: 0.9, carbs: 3.9, fat: 0.2 }, servings: [piece(80, 'tomato')], source: 'USDA' },
  { slug: 'carrot-raw', name: 'Carrot (raw)', aliases: ['gajar'], category: 'Salad & Raw Veggies', per100g: { kcal: 41, protein: 0.9, carbs: 10, fat: 0.2 }, servings: [piece(60, 'carrot'), katori(100)], source: 'USDA' },
  { slug: 'onion-raw', name: 'Onion (raw)', aliases: ['pyaz', 'kanda'], category: 'Salad & Raw Veggies', per100g: { kcal: 40, protein: 1.1, carbs: 9, fat: 0.1 }, servings: [piece(100, 'onion')], source: 'USDA' },
  { slug: 'cabbage-raw', name: 'Cabbage (raw)', aliases: ['patta gobi', 'band gobi'], category: 'Salad & Raw Veggies', per100g: { kcal: 25, protein: 1.3, carbs: 6, fat: 0.1 }, servings: [katori(100)], source: 'USDA' },
  { slug: 'cauliflower-raw', name: 'Cauliflower (raw)', aliases: ['gobi', 'phool gobi'], category: 'Salad & Raw Veggies', per100g: { kcal: 25, protein: 1.9, carbs: 5, fat: 0.3 }, servings: [katori(100)], source: 'USDA' },
  { slug: 'broccoli', name: 'Broccoli', aliases: ['hari gobi'], category: 'Salad & Raw Veggies', per100g: { kcal: 34, protein: 2.8, carbs: 7, fat: 0.4 }, servings: [katori(100)], source: 'USDA' },
  { slug: 'capsicum', name: 'Capsicum / Bell Pepper', aliases: ['shimla mirch', 'bell pepper'], category: 'Salad & Raw Veggies', per100g: { kcal: 25, protein: 1, carbs: 6, fat: 0.2 }, servings: [piece(100, 'capsicum')], source: 'USDA' },
  { slug: 'beetroot', name: 'Beetroot', aliases: ['chukandar'], category: 'Salad & Raw Veggies', per100g: { kcal: 43, protein: 1.6, carbs: 10, fat: 0.2 }, servings: [katori(100)], source: 'USDA' },
  { slug: 'radish-raw', name: 'Radish (raw)', aliases: ['mooli'], category: 'Salad & Raw Veggies', per100g: { kcal: 16, protein: 0.7, carbs: 3.4, fat: 0.1 }, servings: [piece(100, 'radish')], source: 'USDA' },
  { slug: 'lettuce', name: 'Lettuce', aliases: ['salad leaves'], category: 'Salad & Raw Veggies', per100g: { kcal: 15, protein: 1.4, carbs: 2.9, fat: 0.2 }, servings: [katori(50)], source: 'USDA' },
  { slug: 'spinach-raw', name: 'Spinach (raw)', aliases: ['kachcha palak', 'raw palak'], category: 'Salad & Raw Veggies', per100g: { kcal: 23, protein: 2.9, carbs: 3.6, fat: 0.4 }, servings: [katori(50)], source: 'USDA' },
  { slug: 'green-peas', name: 'Green Peas (boiled)', aliases: ['matar', 'hara matar'], category: 'Salad & Raw Veggies', per100g: { kcal: 81, protein: 5, carbs: 14, fat: 0.4 }, servings: [katori(100)], source: 'USDA' },
  { slug: 'french-beans', name: 'French Beans', aliases: ['beans', 'fansi'], category: 'Salad & Raw Veggies', per100g: { kcal: 31, protein: 1.8, carbs: 7, fat: 0.1 }, servings: [katori(100)], source: 'USDA' },
  { slug: 'mushroom', name: 'Mushroom (raw)', aliases: ['khumb', 'button mushroom'], category: 'Salad & Raw Veggies', per100g: { kcal: 22, protein: 3.1, carbs: 3.3, fat: 0.3 }, servings: [katori(100)], source: 'USDA' },
  { slug: 'pumpkin-cooked', name: 'Pumpkin (cooked)', aliases: ['kaddu'], category: 'Salad & Raw Veggies', per100g: { kcal: 26, protein: 1, carbs: 6.5, fat: 0.1 }, servings: [katori(150)], source: 'USDA' },
  { slug: 'lemon', name: 'Lemon', aliases: ['nimbu'], category: 'Salad & Raw Veggies', per100g: { kcal: 29, protein: 1.1, carbs: 9, fat: 0.3 }, servings: [piece(60, 'lemon')], source: 'USDA' },
  { slug: 'sprouts-salad', name: 'Sprouts Salad', aliases: ['sprout chaat'], category: 'Salad & Raw Veggies', per100g: { kcal: 120, protein: 8, carbs: 20, fat: 1 }, servings: [katori(100)], source: 'INDB' },
  { slug: 'fruit-chaat', name: 'Fruit Chaat', aliases: ['fruit salad'], category: 'Salad & Raw Veggies', per100g: { kcal: 65, protein: 0.8, carbs: 16, fat: 0.3 }, servings: [katori(150), bowl(250)], source: 'INDB' },
  { slug: 'corn-chaat', name: 'Corn Chaat', aliases: ['masala corn', 'corn salad'], category: 'Salad & Raw Veggies', per100g: { kcal: 110, protein: 3.4, carbs: 22, fat: 1.8 }, servings: [katori(100)], source: 'INDB' },

  // ── Wraps & Rolls ──────────────────────────────────────────────────────────
  { slug: 'veg-kathi-roll', name: 'Veg Kathi Roll / Wrap', aliases: ['veg roll', 'wrap', 'veg wrap'], category: 'Wraps & Rolls', per100g: { kcal: 210, protein: 6, carbs: 28, fat: 8 }, servings: [piece(150, 'roll')], source: 'INDB' },
  { slug: 'paneer-wrap', name: 'Paneer Wrap / Roll', aliases: ['paneer kathi roll', 'paneer frankie'], category: 'Wraps & Rolls', per100g: { kcal: 250, protein: 9, carbs: 26, fat: 12 }, servings: [piece(180, 'roll')], source: 'INDB' },
  { slug: 'chicken-kathi-roll', name: 'Chicken Kathi Roll', aliases: ['chicken roll', 'chicken wrap'], category: 'Wraps & Rolls', per100g: { kcal: 240, protein: 12, carbs: 26, fat: 10 }, servings: [piece(180, 'roll')], source: 'INDB' },
  { slug: 'egg-roll', name: 'Egg Roll', aliases: ['anda roll', 'egg kathi roll'], category: 'Wraps & Rolls', per100g: { kcal: 230, protein: 9, carbs: 27, fat: 10 }, servings: [piece(160, 'roll')], source: 'INDB' },
  { slug: 'veg-frankie', name: 'Veg Frankie', aliases: ['frankie', 'mumbai frankie'], category: 'Wraps & Rolls', per100g: { kcal: 220, protein: 6, carbs: 30, fat: 8 }, servings: [piece(180, 'frankie')], source: 'INDB' },
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
