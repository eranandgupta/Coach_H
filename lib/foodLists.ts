/**
 * Ranked food lists (/calories/lists/[list]) — "high protein vegetarian foods",
 * "low calorie Indian snacks" etc. Rankings are computed from lib/foods.ts, so they stay
 * correct when the sheet is re-imported; only the framing copy per list is hand-written.
 *
 * Exclusions keep the lists useful as EATING advice: raw staples (flours, dry yeast), protein
 * supplements, raw meat and alcohol would otherwise top several rankings.
 */
import { FOODS, type FoodItem, type FoodNutrients } from './foods';
import { isAlcohol } from './foodPages';

export const LISTS_BASE = 'https://coachhimanshu.com/calories/lists';

const SUPPLEMENT = /protein|gainer|powder|whey|casein/i;
const NON_VEG = /\b(egg|eggs|omelette|chicken|mutton|fish|prawns?|keema|tuna|salmon|bhurji|bacon|beef|pork|turkey|sardines?|crab|lamb|ham|sausage|salami)\b/i;

/** Foods eaten as-is: no raw staples/ingredients, supplements or raw meat. */
const eatable = (f: FoodItem) =>
  f.category !== 'Staples & Basics' &&
  !SUPPLEMENT.test(f.name) &&
  !(f.category === 'Chicken, Fish & Meat' && /\(raw/i.test(f.name));

const WESTERN_FAST_FOOD = /burger|fries|spring roll|pizza|nachos|hot dog|fish fingers|sandwich/i;

export const isVegetarian = (f: FoodItem) => f.category !== 'Chicken, Fish & Meat' && !NON_VEG.test(f.name);

export interface FoodList {
  slug: string;
  /** Short name used in links / breadcrumbs ("High-Protein Vegetarian Foods"). */
  name: string;
  metaTitle: string;
  metaDescription: string;
  intro: string;
  /** Plural noun for generated questions: "Which {noun} have the most protein?" */
  noun: string;
  /** The nutrient the list is ranked by (per 100 g). */
  metric: keyof FoodNutrients;
  metricLabel: string;
  unit: string;
  order: 'desc' | 'asc';
  filter: (f: FoodItem) => boolean;
  limit: number;
  /** Coach's framing — how to actually use the list. */
  coachNote: string;
  /** Answer for "how much do I need / what counts as low", mirrored into FAQ schema. */
  needQuestion: string;
  needAnswer: string;
}

export const FOOD_LISTS: FoodList[] = [
  {
    slug: 'high-protein-vegetarian-foods',
    noun: 'vegetarian foods',
    name: 'High-Protein Vegetarian Foods',
    metaTitle: 'High-Protein Vegetarian Foods (Indian), Ranked',
    metaDescription:
      'The highest-protein vegetarian foods in an Indian diet, ranked by protein per 100 g: paneer, soya, dals, nuts, seeds, cheese and more, with calories for each.',
    intro:
      'Vegetarian Indian diets tend to fall short on protein, not because there are no options but because the options get crowded out by roti and rice. These are the vegetarian foods with the most protein per 100 g, excluding supplements and raw flours.',
    metric: 'protein',
    metricLabel: 'Protein',
    unit: 'g',
    order: 'desc',
    filter: (f) => eatable(f) && isVegetarian(f),
    limit: 25,
    coachNote:
      'Protein per 100 g is only half the story: nuts and seeds rank high, but a 100 g serving is 550–600 kcal. For daily protein without the calories, lean on paneer (low-fat), soya chunks, dals, curd and tofu, and use nuts and seeds as toppings.',
    needQuestion: 'How much protein do vegetarians need per day?',
    needAnswer:
      'ICMR-NIN recommends about 0.8 g of protein per kg of body weight for sedentary adults. If you strength-train or are trying to lose fat while keeping muscle, aim for roughly 1.2–1.6 g per kg, split across 3–4 meals. A 70 kg adult training regularly therefore needs about 85–110 g a day.',
  },
  {
    slug: 'high-protein-non-veg-foods',
    noun: 'non-veg foods',
    name: 'High-Protein Non-Veg Foods',
    metaTitle: 'High-Protein Non-Veg Foods: Chicken, Fish, Eggs & Meat, Ranked',
    metaDescription:
      'Chicken, fish, eggs and meat ranked by protein per 100 g, with calories and fat for each, so you can pick the leanest protein for fat loss or muscle gain.',
    intro:
      'Chicken, fish, eggs and meat are the most protein-dense everyday foods. This list ranks the cooked forms by protein per 100 g, so you can see which ones give you the most protein for the fewest calories.',
    metric: 'protein',
    metricLabel: 'Protein',
    unit: 'g',
    order: 'desc',
    filter: (f) => eatable(f) && !isVegetarian(f),
    limit: 25,
    coachNote:
      'For fat loss, pick from the top of the list and check the calories column: boiled or grilled chicken breast, tuna and white fish give 25–30 g protein for well under 200 kcal. Curries, fried and butter-based dishes carry the same protein with far more fat.',
    needQuestion: 'How much protein do I need to build muscle?',
    needAnswer:
      'Most people building muscle do well on about 1.6 g of protein per kg of body weight a day (roughly 110 g for a 70 kg adult), spread over 3–4 meals of 25–40 g each. More than about 2.2 g per kg adds little extra benefit.',
  },
  {
    slug: 'high-fibre-foods',
    noun: 'foods',
    name: 'High-Fibre Foods',
    metaTitle: 'High-Fibre Foods (Indian Diet), Ranked by Fibre per 100 g',
    metaDescription:
      'The highest-fibre foods in an Indian diet, ranked by fibre per 100 g: seeds, dals, nuts, fruits, vegetables and whole grains, with calories for each.',
    intro:
      'Fibre keeps you full, steadies blood sugar and keeps digestion regular, and most Indian diets built on white rice and refined flour don’t get enough. These are the foods with the most fibre per 100 g.',
    metric: 'fiber',
    metricLabel: 'Fibre',
    unit: 'g',
    order: 'desc',
    filter: (f) => eatable(f) && !isAlcohol(f),
    limit: 25,
    coachNote:
      'Seeds top the chart, but you eat them by the spoon. The fibre that actually adds up day to day comes from dals and chana, whole fruits, vegetables and whole-grain rotis. Increase fibre gradually and drink more water as you do.',
    needQuestion: 'How much fibre should I eat per day?',
    needAnswer:
      'ICMR-NIN suggests about 30 g of dietary fibre for a 2,000 kcal diet, roughly 25–40 g for most adults. A day with two katoris of dal or chana, two whole fruits, vegetables at every meal and whole-wheat rotis gets you there.',
  },
  {
    slug: 'iron-rich-foods',
    noun: 'foods',
    name: 'Iron-Rich Foods',
    metaTitle: 'Iron-Rich Foods (Indian Diet), Veg & Non-Veg, Ranked',
    metaDescription:
      'Iron-rich Indian foods ranked by iron per 100 g: seeds, leafy greens, dals, liver, dry fruits and more, with tips to absorb more iron from vegetarian sources.',
    intro:
      'Iron deficiency is one of the most common nutrient gaps in India, especially for women. These are the foods with the most iron per 100 g, both vegetarian and non-vegetarian.',
    metric: 'iron',
    metricLabel: 'Iron',
    unit: 'mg',
    order: 'desc',
    filter: (f) => eatable(f) && !isAlcohol(f),
    limit: 25,
    coachNote:
      'Cornflakes rank high only because they are fortified with iron. Iron from plants (non-heme iron) is absorbed less well than iron from meat. Pair vegetarian iron sources with vitamin C (lemon on your dal, amla, guava, tomatoes), and keep tea and coffee away from iron-rich meals, since they reduce absorption.',
    needQuestion: 'How much iron do I need per day?',
    needAnswer:
      'ICMR-NIN (2020) recommends about 19 mg of iron a day for adult men and 29 mg for adult women (who lose iron through menstruation). If you feel constantly tired or breathless, get a blood test before taking supplements.',
  },
  {
    slug: 'calcium-rich-foods',
    noun: 'foods',
    name: 'Calcium-Rich Foods',
    metaTitle: 'Calcium-Rich Foods (Indian Diet), Dairy & Non-Dairy, Ranked',
    metaDescription:
      'Calcium-rich Indian foods ranked by calcium per 100 g: sesame, cheese, paneer, ragi, leafy greens, tofu and more, including non-dairy sources.',
    intro:
      'Calcium matters for bones at every age, and it matters more after 40, especially for women. These are the foods with the most calcium per 100 g, including plenty of non-dairy sources.',
    metric: 'calcium',
    metricLabel: 'Calcium',
    unit: 'mg',
    order: 'desc',
    filter: (f) => eatable(f) && !isAlcohol(f),
    limit: 25,
    coachNote:
      'Sesame (til) and cheese rank highest per 100 g, but the reliable daily sources are milk, curd, paneer, ragi and green leafy vegetables. Strength training and enough vitamin D (sunlight) matter as much as calcium for bone strength.',
    needQuestion: 'How much calcium do I need per day?',
    needAnswer:
      'ICMR-NIN (2020) recommends about 1,000 mg of calcium a day for adults. Two glasses of milk or curd plus a serving of paneer or ragi covers most of it.',
  },
  {
    slug: 'vitamin-c-rich-foods',
    noun: 'foods',
    name: 'Vitamin C-Rich Foods',
    metaTitle: 'Vitamin C-Rich Foods: Indian Fruits & Vegetables, Ranked',
    metaDescription:
      'Indian fruits and vegetables ranked by vitamin C per 100 g: amla, guava, bell peppers, drumstick, kiwi and more. Amla has more than 5 times as much as an orange.',
    intro:
      'You don’t need imported fruit for vitamin C: amla and guava beat oranges many times over. These are the foods with the most vitamin C per 100 g.',
    metric: 'vitaminC',
    metricLabel: 'Vitamin C',
    unit: 'mg',
    order: 'desc',
    filter: (f) => eatable(f) && !isAlcohol(f),
    limit: 25,
    coachNote:
      'Vitamin C is destroyed by long cooking, so raw or lightly cooked sources (fruits, salads, a squeeze of lemon) deliver the most. Eating them with dal, rajma or greens also helps you absorb more iron.',
    needQuestion: 'How much vitamin C do I need per day?',
    needAnswer:
      'ICMR-NIN (2020) recommends about 80 mg of vitamin C a day for adult men and 65 mg for adult women. A single guava or one amla covers a full day.',
  },
  {
    slug: 'low-calorie-indian-snacks',
    noun: 'Indian snacks',
    name: 'Low-Calorie Indian Snacks',
    metaTitle: 'Low-Calorie Indian Snacks, Ranked by Calories',
    metaDescription:
      'Indian snacks and street food ranked from lowest to highest calories per 100 g: makhana, popcorn, dhokla, momos, chaat and more, with protein for each.',
    intro:
      'Snacking is where most diets quietly fall apart. These are the Indian snacks and street foods with the fewest calories per 100 g, so you can snack without undoing the rest of your day.',
    metric: 'kcal',
    metricLabel: 'Calories',
    unit: 'kcal',
    order: 'asc',
    filter: (f) => f.category === 'Snacks & Street Food' && eatable(f) && !WESTERN_FAST_FOOD.test(f.name),
    limit: 25,
    coachNote:
      'Steamed beats fried every time: dhokla, chana chaat and steamed momos are far lighter than samosa, kachori or namkeen. Roasted makhana and air-popped popcorn look calorie-dense per 100 g, but they are so light that a big bowl weighs only 20–30 g (about 100 kcal). Snacks with protein, like chana chaat or sprouts, keep you full longer.',
    needQuestion: 'How many calories should a snack have?',
    needAnswer:
      'For most people trying to lose fat, a snack of about 100–200 kcal works well, ideally with some protein or fibre so it actually holds you until the next meal. Check the serving, not just the per-100 g number: a 30 g handful of namkeen is already about 150 kcal.',
  },
  {
    slug: 'low-calorie-indian-sweets',
    noun: 'Indian sweets',
    name: 'Low-Calorie Indian Sweets',
    metaTitle: 'Low-Calorie Indian Sweets & Desserts, Ranked by Calories',
    metaDescription:
      'Indian sweets and desserts ranked from lowest to highest calories per 100 g: rasgulla, sandesh, kheer, fruit custard and more, and which to pick when you’re dieting.',
    intro:
      'You don’t have to give up mithai to lose weight, but some sweets cost far more than others. These are the Indian sweets and desserts with the fewest calories per 100 g.',
    metric: 'kcal',
    metricLabel: 'Calories',
    unit: 'kcal',
    order: 'asc',
    filter: (f) => f.category === 'Sweets & Desserts' && eatable(f),
    limit: 25,
    coachNote:
      'Milk- and chhena-based sweets (kheer, rasmalai, rasgulla, misti doi) are generally lighter than ghee- and khoya-heavy ones (ladoo, burfi, halwa). Portion is the real lever: one piece after a meal, not a plate.',
    needQuestion: 'Can I eat sweets while losing weight?',
    needAnswer:
      'Yes, as long as your total daily calories stay in a deficit. Budget one small sweet (about 100–150 kcal) into your day, pick lighter options like rasgulla, rasmalai or kheer, and have it after a protein-rich meal rather than on an empty stomach.',
  },
  {
    slug: 'low-calorie-drinks',
    noun: 'drinks',
    name: 'Low-Calorie Drinks',
    metaTitle: 'Low-Calorie Drinks: Indian Beverages Ranked by Calories',
    metaDescription:
      'Indian drinks ranked from lowest to highest calories per 100 g: black coffee, green tea, chaas, nimbu pani, coconut water and more. See how much sugar each adds.',
    intro:
      'Liquid calories don’t fill you up, which makes drinks one of the easiest places to cut calories. These are everyday Indian drinks ranked from lowest to highest calories per 100 g (alcohol and protein shakes are excluded).',
    metric: 'kcal',
    metricLabel: 'Calories',
    unit: 'kcal',
    order: 'asc',
    filter: (f) => f.category === 'Beverages' && eatable(f) && !isAlcohol(f),
    limit: 25,
    coachNote:
      'Water, black coffee, plain black or green tea and lemon tea are close to zero calories, and chaas is light at about 80 kcal a glass. The calories hide in sugar and full-fat milk: two cups of sweet chai a day add up to about 130 kcal, and a glass of juice has nearly as much sugar as a cola.',
    needQuestion: 'Which drinks are best for weight loss?',
    needAnswer:
      'Water, black coffee, green or black tea without sugar and nimbu pani without sugar have almost no calories, and buttermilk (chaas) is light at about 80 kcal a glass. Swapping one sugary drink a day for one of these can save 100–200 kcal a day.',
  },
  {
    slug: 'low-calorie-vegetables',
    noun: 'vegetables and sabzis',
    name: 'Low-Calorie Vegetables & Sabzi',
    metaTitle: 'Low-Calorie Vegetables & Sabzi (Indian), Ranked',
    metaDescription:
      'Indian vegetables and sabzis ranked from lowest to highest calories per 100 g: lauki, tori, palak, cabbage, bhindi and more, with fibre for each.',
    intro:
      'Vegetables are the cheapest way to make a meal bigger without making it heavier. These are the Indian sabzis and cooked vegetables with the fewest calories per 100 g.',
    metric: 'kcal',
    metricLabel: 'Calories',
    unit: 'kcal',
    order: 'asc',
    filter: (f) => f.category === 'Vegetables & Sabzi' && eatable(f),
    limit: 25,
    coachNote:
      'Gourds (lauki, tori, tinda), leafy greens and cabbage-family vegetables are the lightest. How it’s cooked matters more than which vegetable it is: a spoon of oil adds about 45 kcal, so a dry sabzi with measured oil beats a rich gravy.',
    needQuestion: 'How much vegetables should I eat per day?',
    needAnswer:
      'ICMR-NIN suggests around 300–400 g of vegetables a day, including leafy greens. In practice, fill half your plate with sabzi or salad at lunch and dinner.',
  },
  {
    slug: 'low-calorie-fruits',
    noun: 'fruits',
    name: 'Low-Calorie Fruits',
    metaTitle: 'Low-Calorie Fruits (Indian), Ranked by Calories',
    metaDescription:
      'Fruits ranked from lowest to highest calories per 100 g: watermelon, papaya, strawberries, guava, orange and more, with fibre and vitamin C for each.',
    intro:
      'All whole fruits fit a healthy diet, but some are much lighter than others. These are the fruits with the fewest calories per 100 g, the easiest to eat in generous portions while losing weight.',
    metric: 'kcal',
    metricLabel: 'Calories',
    unit: 'kcal',
    order: 'asc',
    filter: (f) => f.category === 'Fruits' && eatable(f),
    limit: 25,
    coachNote:
      'Water-rich fruits like watermelon, papaya, muskmelon and berries give you volume for very few calories. Eat fruit whole rather than as juice to keep the fibre, and pair sweeter fruits like mango or chikoo with curd or nuts.',
    needQuestion: 'Can I eat fruit at night or while losing weight?',
    needAnswer:
      'Yes. The time of day doesn’t matter; your total daily calories do. Two to three servings of whole fruit a day fit comfortably into a weight-loss diet, especially the lower-calorie ones on this list.',
  },
];

/** "22 g protein" / "110 kcal" — avoids "110 kcal calories". */
export function metricPhrase(list: FoodList, value: number): string {
  return list.metric === 'kcal' ? `${value} kcal` : `${value} ${list.unit} ${list.metricLabel.toLowerCase()}`;
}

export function getAllListSlugs(): string[] {
  return FOOD_LISTS.map((l) => l.slug);
}

export function getListBySlug(slug: string): FoodList | undefined {
  return FOOD_LISTS.find((l) => l.slug === slug);
}

const rankCache = new Map<string, FoodItem[]>();

/** The ranked foods for a list (cached — every food page checks every list at build time). */
export function rankList(list: FoodList): FoodItem[] {
  const cached = rankCache.get(list.slug);
  if (cached) return cached;
  const ranked = FOODS.filter(list.filter)
    .filter((f) => list.order === 'asc' || f.per100g[list.metric] > 0)
    .sort((a, b) =>
      list.order === 'desc'
        ? b.per100g[list.metric] - a.per100g[list.metric] || a.name.localeCompare(b.name)
        : a.per100g[list.metric] - b.per100g[list.metric] || a.name.localeCompare(b.name)
    )
    .slice(0, list.limit);
  rankCache.set(list.slug, ranked);
  return ranked;
}

/** Lists a given food appears in — "Featured in" links on the food page. */
export function listsForFood(slug: string): FoodList[] {
  return FOOD_LISTS.filter((l) => rankList(l).some((f) => f.slug === slug));
}

export interface ListFaq { question: string; answer: string; }

/** FAQs: the data-derived "which is the top one" answer plus the list's own guidance. */
export function listFaqs(list: FoodList): ListFaq[] {
  const ranked = rankList(list);
  const top = ranked.slice(0, 5);
  const fmt = (f: FoodItem) => `${f.name} (${f.per100g[list.metric]} ${list.unit})`;
  const firstQ =
    list.order === 'desc'
      ? `Which ${list.noun} have the most ${list.metricLabel.toLowerCase()}?`
      : `Which ${list.noun} have the fewest calories?`;
  return [
    {
      question: firstQ,
      answer: `Per 100 g, the top five are ${top.map(fmt).join(', ')}. Values are from INDB, IFCT 2017 (NIN-ICMR) and USDA FoodData Central.`,
    },
    { question: list.needQuestion, answer: list.needAnswer },
  ];
}
