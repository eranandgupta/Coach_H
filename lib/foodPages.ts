/**
 * Content helpers for the programmatic "Calories in {food}" pages (/calories/[food]).
 *
 * Every sentence here is DERIVED from the food's own numbers in lib/foods.ts — no
 * hand-written per-food copy — so 850+ pages stay accurate when the sheet is re-imported,
 * and each page still says something specific (verdicts, comparisons, FAQs) about its food.
 */
import { FOODS, type FoodItem, type FoodServing } from './foods';
import { caloriesFor } from './nutrition';

export const CALORIES_BASE = 'https://coachhimanshu.com/calories';

export const SOURCE_LABEL: Record<FoodItem['source'], string> = {
  INDB: 'Indian Nutrient Databank (INDB)',
  IFCT: 'Indian Food Composition Tables 2017 (NIN, ICMR)',
  USDA: 'USDA FoodData Central',
};

export function getAllFoodSlugs(): string[] {
  return FOODS.map((f) => f.slug);
}

/** URL-safe anchor id for a category heading on the /calories index. */
export function categoryAnchor(category: string): string {
  return category.toLowerCase().replace(/&/g, 'and').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
}

/** The household serving (first listed) — what people actually search for ("1 roti", "1 katori"). */
export function primaryServing(food: FoodItem): FoodServing {
  return food.servings[0];
}

/** True when a serving is just the "100 g" fallback, so we don't repeat per-100 g figures. */
const is100g = (s: FoodServing) => s.grams === 100 && /^100\s*g$/i.test(s.label.trim());

/** Serving label with its weight, without doubling it: "1 roti (40 g)" stays; "1 bowl" -> "1 bowl (150 g)". */
export function servingText(s: FoodServing): string {
  return /\d\s*(g|ml)\b/i.test(s.label) ? s.label : `${s.label} (${s.grams} g)`;
}

/** Lower-cased serving label for use mid-sentence: "1 Katori (150 g)" -> "1 katori (150 g)". */
const lc = (label: string) => label.charAt(0).toLowerCase() + label.slice(1);

const ALCOHOL = /\b(beer|wine|gin|rum|vodka|whisk(e)?y|tequila|brandy|cocktail|sangria|champagne)\b/i;
/** Alcoholic drinks get their own advice — "low calorie for its volume" would be misleading. */
export const isAlcohol = (food: FoodItem) => ALCOHOL.test(food.name);

/** Most of the calories are sugar (cola, juice, sweets). Fruits are exempt — whole-fruit sugar comes with fibre. */
const isSugary = (food: FoodItem) =>
  food.category !== 'Fruits' && food.per100g.kcal >= 20 &&
  (food.per100g.sugar >= 15 || (food.per100g.sugar * 4) / food.per100g.kcal >= 0.5);

/** Too few calories for a macro split to mean anything (black coffee, plain tea, water). */
const isTrivial = (food: FoodItem) => food.per100g.kcal < 20;

/** Share of calories from protein / carbs / fat (Atwater 4-4-9), rounded to whole %. */
export function macroSplit(food: FoodItem): { protein: number; carbs: number; fat: number } {
  const p = food.per100g.protein * 4;
  const c = food.per100g.carbs * 4;
  const f = food.per100g.fat * 9;
  const total = p + c + f;
  if (total <= 0) return { protein: 0, carbs: 0, fat: 0 };
  const protein = Math.round((p / total) * 100);
  const fat = Math.round((f / total) * 100);
  return { protein, carbs: Math.max(0, 100 - protein - fat), fat };
}

/** Calorie density band per 100 g (the lever that matters most for satiety / fat loss). */
export function densityBand(kcalPer100: number): { label: string; note: string } {
  if (kcalPer100 < 60) return { label: 'Very low', note: 'very low in calories for its volume' };
  if (kcalPer100 < 150) return { label: 'Low', note: 'low in calories for its volume' };
  if (kcalPer100 < 300) return { label: 'Moderate', note: 'moderately calorie-dense' };
  return { label: 'High', note: 'calorie-dense, so portions add up fast' };
}

export interface FoodTag { label: string; tone: 'good' | 'watch' | 'neutral'; }

/** Short, data-derived nutrition tags (e.g. "High protein", "High sodium"). */
export function foodTags(food: FoodItem): FoodTag[] {
  const n = food.per100g;
  const split = macroSplit(food);
  const tags: FoodTag[] = [];
  if (n.kcal >= 40 && split.protein >= 25) tags.push({ label: 'High protein', tone: 'good' });
  else if (n.protein >= 10) tags.push({ label: 'Good protein source', tone: 'good' });
  if (n.fiber >= 6) tags.push({ label: 'High fibre', tone: 'good' });
  else if (n.fiber >= 3) tags.push({ label: 'Good fibre source', tone: 'good' });
  if (n.kcal < 60 && !isSugary(food) && !isAlcohol(food)) tags.push({ label: 'Very low calorie', tone: 'good' });
  if (n.kcal >= 400) tags.push({ label: 'Energy-dense', tone: 'watch' });
  if (isSugary(food)) tags.push({ label: 'High sugar', tone: 'watch' });
  else if (food.category === 'Fruits' && n.sugar >= 15) tags.push({ label: 'Natural sugars', tone: 'neutral' });
  if (isAlcohol(food)) tags.push({ label: 'Alcohol', tone: 'watch' });
  if (n.sodium >= 600) tags.push({ label: 'High sodium', tone: 'watch' });
  if (n.kcal >= 40 && split.fat >= 55) tags.push({ label: 'Mostly fat', tone: 'neutral' });
  if (n.kcal >= 40 && split.carbs >= 75 && !isAlcohol(food)) tags.push({ label: 'Mostly carbs', tone: 'neutral' });
  if (n.vitaminC >= 20) tags.push({ label: 'Rich in vitamin C', tone: 'good' });
  if (n.iron >= 3) tags.push({ label: 'Good iron source', tone: 'good' });
  if (n.calcium >= 200) tags.push({ label: 'Rich in calcium', tone: 'good' });
  return tags;
}

/** One-line answer used as the page lede, meta description and speakable summary. */
export function answerSentence(food: FoodItem): string {
  const s = primaryServing(food);
  const n = caloriesFor(food, s.grams);
  const per100 = food.per100g;
  if (is100g(s)) {
    return `100 g of ${food.name} has ${per100.kcal} calories, with ${per100.protein} g protein, ${per100.carbs} g carbs and ${per100.fat} g fat.`;
  }
  return `${food.name} has about ${n.kcal} calories per ${lc(servingText(s))}, with ${n.protein} g protein, ${n.carbs} g carbs and ${n.fat} g fat. Per 100 g it has ${per100.kcal} kcal.`;
}

/** Minutes to burn `kcal` — assumes a ~70 kg adult: brisk walk ≈ 5 kcal/min, running ≈ 11 kcal/min. */
export function burnMinutes(kcal: number): { walk: number; run: number } {
  return { walk: Math.max(1, Math.round(kcal / 5)), run: Math.max(1, Math.round(kcal / 11)) };
}

/** Coach's take: a few plain-English, goal-oriented points derived from the numbers. */
export function coachTake(food: FoodItem): string[] {
  const n = food.per100g;
  const s = primaryServing(food);
  const serving = caloriesFor(food, s.grams);
  const split = macroSplit(food);
  const band = densityBand(n.kcal);
  const points: string[] = [];

  const st = lc(servingText(s));
  if (isAlcohol(food)) {
    points.push(`Most of the calories in ${food.name} come from the alcohol itself (about 7 kcal per gram), not from protein, carbs or fat. It has ${n.kcal} kcal per 100 g.`);
  } else if (isTrivial(food)) {
    points.push(`${food.name} has almost no calories (${n.kcal} kcal per 100 g), so it won't move the needle on your daily total.`);
  } else {
    points.push(
      `${food.name} is ${band.note} at ${n.kcal} kcal per 100 g. About ${split.carbs}% of its calories come from carbs, ${split.protein}% from protein and ${split.fat}% from fat.`
    );
  }

  // Weight loss
  if (isAlcohol(food)) {
    points.push(`Alcohol calories don't fill you up, and your body burns alcohol before fat. On a fat-loss diet, keep drinks occasional and count every one. ${servingText(s)} adds ${serving.kcal} kcal.`);
  } else if (isSugary(food)) {
    points.push(`Most of its calories come from sugar, which digests fast and won't keep you full. On a fat-loss diet, keep it occasional and count it. ${servingText(s)} adds ${serving.kcal} kcal.`);
  } else if (isTrivial(food) || (n.kcal < 150 && n.sugar < 15)) {
    points.push(`For fat loss it's an easy fit: you get a satisfying portion for relatively few calories.`);
  } else if (split.protein >= 25 && n.kcal < 300) {
    points.push(`For fat loss the protein helps keep you full and protects muscle while you're in a calorie deficit. Just watch the cooking oil.`);
  } else if (n.kcal >= 300) {
    points.push(`On a fat-loss diet, measure your portion. ${servingText(s)} already adds ${serving.kcal} kcal, and it's easy to eat more than you meant to.`);
  } else {
    points.push(
      n.protein >= 10
        ? `It can fit a fat-loss diet in a measured portion. Add vegetables or a salad and go easy on the oil or butter.`
        : `It can fit a fat-loss diet in a measured portion. Pair it with a protein source and vegetables so the meal keeps you full.`
    );
  }

  // Muscle gain / protein
  if (serving.protein >= 15) {
    points.push(`With ${serving.protein} g protein in ${st}, it makes a solid contribution to a muscle-building day. Most active adults aim for about 1.6 g protein per kg of body weight.`);
  } else if (serving.protein < 5 && n.kcal >= 100) {
    points.push(`It's low in protein (${serving.protein} g in ${st}), so if you're building muscle, pair it with dal, paneer, curd, eggs or chicken.`);
  }

  if (n.sodium >= 600) points.push(`It's high in sodium (${n.sodium} mg per 100 g). Keep portions in check if you're watching your blood pressure.`);
  if (isSugary(food) && !isAlcohol(food) && n.sugar >= 15 && n.kcal >= 150) points.push(`Much of its carbohydrate is sugar (${n.sugar} g per 100 g), so treat it as an occasional food rather than a daily staple.`);
  if (n.fiber >= 6) points.push(`It's high in fibre (${n.fiber} g per 100 g), which helps digestion, fullness and steadier blood sugar.`);

  return points;
}

/** Same-category foods closest in calories — for "compare with" links (internal linking + context). */
export function similarFoods(food: FoodItem, limit = 8): FoodItem[] {
  return FOODS.filter((f) => f.category === food.category && f.slug !== food.slug)
    .sort((a, b) => Math.abs(a.per100g.kcal - food.per100g.kcal) - Math.abs(b.per100g.kcal - food.per100g.kcal))
    .slice(0, limit);
}

/** Same-category foods with meaningfully fewer calories per 100 g — "lighter swaps". */
export function lighterSwaps(food: FoodItem, limit = 4): FoodItem[] {
  return FOODS.filter((f) => f.category === food.category && f.slug !== food.slug && f.per100g.kcal <= food.per100g.kcal * 0.75)
    .sort((a, b) => b.per100g.protein - a.per100g.protein)
    .slice(0, limit);
}

export interface FoodFaq { question: string; answer: string; }

/** Data-derived FAQs — rendered on the page AND mirrored 1:1 into FAQPage JSON-LD. */
export function foodFaqs(food: FoodItem): FoodFaq[] {
  const s = primaryServing(food);
  const serving = caloriesFor(food, s.grams);
  const n = food.per100g;
  const split = macroSplit(food);
  const burn = burnMinutes(serving.kcal);
  const faqs: FoodFaq[] = [];

  if (!is100g(s)) {
    faqs.push({
      question: `How many calories are in one serving of ${food.name}?`,
      answer: `One serving of ${food.name}, ${lc(servingText(s))}, has roughly ${serving.kcal} calories, with ${serving.protein} g protein, ${serving.carbs} g carbohydrates, ${serving.fat} g fat and ${serving.fiber} g fibre.`,
    });
  }
  faqs.push({
    question: `How many calories are in 100 g of ${food.name}?`,
    answer: `100 g of ${food.name} has ${n.kcal} kcal, with ${n.protein} g protein, ${n.carbs} g carbs, ${n.fat} g fat, ${n.fiber} g fibre and ${n.sugar} g sugar.`,
  });
  faqs.push({
    question: `How much protein is in ${food.name}?`,
    answer: `${food.name} has ${n.protein} g protein per 100 g${is100g(s) ? '' : ` (${serving.protein} g in ${lc(servingText(s))})`}.${isTrivial(food) || isAlcohol(food) ? '' : ` Protein provides about ${split.protein}% of its calories.`}`,
  });

  let wl: string;
  if (isAlcohol(food)) wl = `Not really. Alcohol calories don't fill you up, and your body burns alcohol before fat. ${servingText(s)} adds ${serving.kcal} kcal. If you drink, keep it occasional and count it in your daily target.`;
  else if (isSugary(food)) wl = `Not ideal. Most of its ${n.kcal} kcal per 100 g come from sugar, which won't keep you full. ${servingText(s)} adds ${serving.kcal} kcal, so keep it occasional.`;
  else if (isTrivial(food) || (n.kcal < 150 && n.sugar < 15)) wl = `Yes. At ${n.kcal} kcal per 100 g it is ${densityBand(n.kcal).note}, so it fits a weight-loss diet well.`;
  else if (split.protein >= 25 && n.kcal < 300) wl = `It can be. It gets ${split.protein}% of its calories from protein, which keeps you full and protects muscle in a calorie deficit. Keep the added oil low.`;
  else if (n.kcal >= 300) wl = `Only in measured portions. At ${n.kcal} kcal per 100 g it is ${densityBand(n.kcal).note}. ${servingText(s)} adds ${serving.kcal} kcal, so count it within your daily target.`;
  else wl = `In moderation. At ${n.kcal} kcal per 100 g it can fit a weight-loss diet if your total daily calories stay in a deficit and the meal includes protein and vegetables.`;
  faqs.push({ question: `Is ${food.name} good for weight loss?`, answer: wl });

  if (serving.kcal >= 20) {
    faqs.push({
      question: `How long does it take to burn off one serving of ${food.name}?`,
      answer: `Burning roughly ${serving.kcal} kcal takes about ${burn.walk} minutes of brisk walking or ${burn.run} minutes of running for a 70 kg adult. It takes longer if you're lighter and less time if you're heavier.`,
    });
  }
  return faqs;
}
