/**
 * "{Food A} vs {Food B}" comparison pages (/calories/compare/[pair]).
 *
 * Pairs are curated (the comparisons people actually search: roti vs rice, paneer vs tofu…),
 * but every number, verdict and FAQ answer is DERIVED from lib/foods.ts using the explicit
 * rules below, so the copy can never drift from the data. The rules are shown on the page.
 *
 *   Weight loss  → fewer kcal per 100 g (≥10% apart), else more protein + fibre per 100 kcal.
 *   Protein      → more protein per 100 kcal (protein you get for your calorie budget).
 *   Fibre        → more fibre per 100 kcal.
 */
import { FOODS, type FoodItem, type FoodNutrients, type FoodServing } from './foods';
import { caloriesFor } from './nutrition';
import { isAlcohol, isSugary, primaryServing, servingText } from './foodPages';

export const COMPARE_BASE = 'https://coachhimanshu.com/calories/compare';

export interface FoodPair {
  slug: string;
  a: string; // food slug
  b: string; // food slug
  nameA: string; // short display name, e.g. "Roti"
  nameB: string;
  /** Optional context the dataset can't show (fat types, why the numbers differ). Facts only. */
  note?: string;
}

const P = (slug: string, a: string, b: string, nameA: string, nameB: string, note?: string): FoodPair => ({ slug, a, b, nameA, nameB, note });

export const FOOD_PAIRS: FoodPair[] = [
  // Staples: rotis, rice & grains
  P('roti-vs-rice', 'roti-chapati', 'rice-white-cooked', 'Roti', 'Rice'),
  P('brown-rice-vs-white-rice', 'rice-brown-cooked', 'rice-white-cooked', 'Brown Rice', 'White Rice'),
  P('basmati-rice-vs-brown-rice', 'basmati-rice', 'rice-brown-cooked', 'Basmati Rice', 'Brown Rice'),
  P('quinoa-vs-brown-rice', 'quinoa-cooked', 'rice-brown-cooked', 'Quinoa', 'Brown Rice'),
  P('roti-vs-paratha', 'roti-chapati', 'plain-paratha', 'Roti', 'Paratha'),
  P('roti-vs-naan', 'roti-chapati', 'naan', 'Roti', 'Naan'),
  P('roti-vs-brown-bread', 'roti-chapati', 'bread-brown', 'Roti', 'Brown Bread'),
  P('brown-bread-vs-white-bread', 'bread-brown', 'bread-white', 'Brown Bread', 'White Bread'),
  P('ragi-roti-vs-wheat-roti', 'ragi-roti', 'roti-chapati', 'Ragi Roti', 'Wheat Roti'),
  P('jowar-roti-vs-wheat-roti', 'jowar-roti', 'roti-chapati', 'Jowar Roti', 'Wheat Roti'),
  P('bajra-roti-vs-jowar-roti', 'bajra-roti', 'jowar-roti', 'Bajra Roti', 'Jowar Roti'),
  P('khichdi-vs-dal-chawal', 'khichdi', 'dal-chawal', 'Khichdi', 'Dal Chawal'),
  // Breakfast
  P('idli-vs-dosa', 'idli', 'plain-dosa', 'Idli', 'Dosa'),
  P('poha-vs-upma', 'poha', 'upma', 'Poha', 'Upma'),
  P('oats-vs-poha', 'oats-cooked', 'poha', 'Oats', 'Poha'),
  P('oats-vs-cornflakes', 'oats-with-milk', 'cornflakes-with-milk', 'Oats with Milk', 'Cornflakes with Milk'),
  // Protein sources
  P('paneer-vs-tofu', 'paneer-raw', 'tofu', 'Paneer', 'Tofu'),
  P('paneer-vs-chicken', 'paneer-raw', 'chicken-breast-cooked', 'Paneer', 'Chicken Breast'),
  P('egg-vs-paneer', 'egg-boiled', 'paneer-raw', 'Egg', 'Paneer'),
  P('chicken-vs-egg', 'chicken-breast-cooked', 'egg-boiled', 'Chicken Breast', 'Egg'),
  P('egg-white-vs-whole-egg', 'egg-white', 'egg-boiled', 'Egg White', 'Whole Egg'),
  P('soya-chunks-vs-paneer', 'soy-chunks', 'paneer-raw', 'Soya Chunks', 'Paneer'),
  P('chicken-vs-mutton', 'chicken-breast-cooked', 'mutton-cooked', 'Chicken Breast', 'Mutton'),
  P('fish-vs-chicken', 'rohu-cooked', 'chicken-breast-cooked', 'Rohu Fish', 'Chicken Breast'),
  P('tandoori-chicken-vs-butter-chicken', 'chicken-tandoori', 'butter-chicken', 'Tandoori Chicken', 'Butter Chicken'),
  // Dals & legumes
  P('rajma-vs-chana', 'rajma-boiled', 'chana-boiled', 'Rajma', 'Chana'),
  P('moong-dal-vs-masoor-dal', 'moong-dal-cooked', 'masoor-dal-cooked', 'Moong Dal', 'Masoor Dal'),
  P('dal-tadka-vs-dal-makhani', 'dal-tadka', 'dal-makhani', 'Dal Tadka', 'Dal Makhani'),
  // Dairy & drinks
  P('curd-vs-greek-yogurt', 'curd-dahi', 'greek-yogurt', 'Curd', 'Greek Yogurt'),
  P('toned-milk-vs-full-cream-milk', 'milk-toned', 'milk-full', 'Toned Milk', 'Full Cream Milk'),
  P('cow-milk-vs-soy-milk', 'milk-toned', 'soy-milk', 'Toned Milk', 'Soy Milk'),
  P('chaas-vs-lassi', 'buttermilk', 'lassi-sweet', 'Chaas', 'Sweet Lassi'),
  P('tea-vs-coffee', 'chai', 'coffee-milk', 'Chai', 'Milk Coffee'),
  P('green-tea-vs-black-coffee', 'green-tea-plain', 'black-coffee', 'Green Tea', 'Black Coffee'),
  P('coconut-water-vs-sports-drink', 'coconut-water', 'sports-drink', 'Coconut Water', 'Sports Drink'),
  P('orange-vs-orange-juice', 'orange', 'orange-juice', 'Orange', 'Orange Juice', 'Juicing removes most of the fibre, and a glass of juice takes several oranges, so it is easy to drink far more calories than you would eat.'),
  // Fats & sweeteners
  P('ghee-vs-butter', 'ghee', 'butter', 'Ghee', 'Butter', 'Ghee is butter with the water and milk solids cooked off, which is why it has more calories per gram. Both are mostly saturated fat.'),
  P('ghee-vs-olive-oil', 'ghee', 'olive-oil', 'Ghee', 'Olive Oil', 'The calories are almost identical, but the type of fat is not. Ghee is mostly saturated fat, while olive oil is mostly monounsaturated fat. Most heart-health guidelines suggest keeping saturated fat limited.'),
  P('mustard-oil-vs-olive-oil', 'mustard-oil', 'olive-oil', 'Mustard Oil', 'Olive Oil', 'Both are mostly unsaturated fat, and mustard oil also provides some omega-3 (ALA). The calories are identical, so the amount you pour is what counts.'),
  P('jaggery-vs-sugar', 'sugar-jaggery', 'sugar', 'Jaggery', 'Sugar', 'The extra iron and calcium in jaggery are real but small at normal portions. Your body still handles jaggery as sugar.'),
  P('honey-vs-sugar', 'honey', 'sugar', 'Honey', 'Sugar', 'Honey has fewer calories per gram partly because it contains water. A teaspoon of honey also weighs more than a teaspoon of sugar, so per spoon the gap almost disappears.'),
  // Fruit, veg, nuts & snacks
  P('banana-vs-apple', 'banana', 'apple', 'Banana', 'Apple'),
  P('sweet-potato-vs-potato', 'sweet-potato', 'potato-boiled', 'Sweet Potato', 'Potato'),
  P('almonds-vs-walnuts', 'almonds', 'walnut', 'Almonds', 'Walnuts'),
  P('almonds-vs-peanuts', 'almonds', 'peanuts', 'Almonds', 'Peanuts'),
  P('peanut-butter-vs-almond-butter', 'peanut-butter', 'almond-butter', 'Peanut Butter', 'Almond Butter'),
  P('chia-seeds-vs-flax-seeds', 'chia-seeds', 'flax-seeds', 'Chia Seeds', 'Flax Seeds'),
  P('makhana-vs-popcorn', 'makhana', 'popcorn', 'Makhana', 'Popcorn'),
  P('makhana-vs-roasted-chana', 'makhana', 'roasted-chana', 'Makhana', 'Roasted Chana'),
  P('samosa-vs-kachori', 'samosa', 'kachori', 'Samosa', 'Kachori'),
  P('rasgulla-vs-gulab-jamun', 'rasgulla', 'gulab-jamun', 'Rasgulla', 'Gulab Jamun'),
  P('dark-chocolate-vs-milk-chocolate', 'dark-chocolate', 'milk-chocolate', 'Dark Chocolate', 'Milk Chocolate'),
];

/** Sections for the /calories/compare hub, in display order. */
export const PAIR_GROUPS: { title: string; slugs: string[] }[] = [
  { title: 'Rotis, rice & grains', slugs: ['roti-vs-rice', 'brown-rice-vs-white-rice', 'basmati-rice-vs-brown-rice', 'quinoa-vs-brown-rice', 'roti-vs-paratha', 'roti-vs-naan', 'roti-vs-brown-bread', 'brown-bread-vs-white-bread', 'ragi-roti-vs-wheat-roti', 'jowar-roti-vs-wheat-roti', 'bajra-roti-vs-jowar-roti', 'khichdi-vs-dal-chawal'] },
  { title: 'Breakfast', slugs: ['idli-vs-dosa', 'poha-vs-upma', 'oats-vs-poha', 'oats-vs-cornflakes'] },
  { title: 'Protein sources', slugs: ['paneer-vs-tofu', 'paneer-vs-chicken', 'egg-vs-paneer', 'chicken-vs-egg', 'egg-white-vs-whole-egg', 'soya-chunks-vs-paneer', 'chicken-vs-mutton', 'fish-vs-chicken', 'tandoori-chicken-vs-butter-chicken'] },
  { title: 'Dals & legumes', slugs: ['rajma-vs-chana', 'moong-dal-vs-masoor-dal', 'dal-tadka-vs-dal-makhani'] },
  { title: 'Dairy & drinks', slugs: ['curd-vs-greek-yogurt', 'toned-milk-vs-full-cream-milk', 'cow-milk-vs-soy-milk', 'chaas-vs-lassi', 'tea-vs-coffee', 'green-tea-vs-black-coffee', 'coconut-water-vs-sports-drink', 'orange-vs-orange-juice'] },
  { title: 'Fats & sweeteners', slugs: ['ghee-vs-butter', 'ghee-vs-olive-oil', 'mustard-oil-vs-olive-oil', 'jaggery-vs-sugar', 'honey-vs-sugar'] },
  { title: 'Fruit, veg, nuts & snacks', slugs: ['banana-vs-apple', 'sweet-potato-vs-potato', 'almonds-vs-walnuts', 'almonds-vs-peanuts', 'peanut-butter-vs-almond-butter', 'chia-seeds-vs-flax-seeds', 'makhana-vs-popcorn', 'makhana-vs-roasted-chana', 'samosa-vs-kachori', 'rasgulla-vs-gulab-jamun', 'dark-chocolate-vs-milk-chocolate'] },
];

const bySlug = new Map(FOODS.map((f) => [f.slug, f]));

export interface ResolvedPair extends FoodPair {
  foodA: FoodItem;
  foodB: FoodItem;
}

function resolve(pair: FoodPair): ResolvedPair {
  const foodA = bySlug.get(pair.a);
  const foodB = bySlug.get(pair.b);
  // Fail the build loudly rather than ship a broken page if the food sheet is re-imported.
  if (!foodA || !foodB) throw new Error(`foodCompare: unknown food in pair "${pair.slug}"`);
  return { ...pair, foodA, foodB };
}

export function getAllPairSlugs(): string[] {
  return FOOD_PAIRS.map((p) => p.slug);
}

export function getPairBySlug(slug: string): ResolvedPair | undefined {
  const pair = FOOD_PAIRS.find((p) => p.slug === slug);
  return pair ? resolve(pair) : undefined;
}

/** Comparisons a food appears in — "Compare:" links on /calories/[food]. */
export function pairsForFood(foodSlug: string): FoodPair[] {
  return FOOD_PAIRS.filter((p) => p.a === foodSlug || p.b === foodSlug);
}

export const pairTitle = (p: FoodPair) => `${p.nameA} vs ${p.nameB}`;

/** SEO title that stays under ~60 chars once the "| Coach Himanshu" template is appended. */
export function pairMetaTitle(p: FoodPair): string {
  const t = pairTitle(p);
  for (const suffix of [': Calories, Protein & Which Is Better', ': Calories & Which Is Better', ': Which Is Better?']) {
    if (t.length + suffix.length <= 44) return t + suffix;
  }
  return `${t}: Which Is Better?`;
}

const round1 = (n: number) => Math.round(n * 10) / 10;
/** Grams per 100 kcal-normalised nutrient: "protein per 100 kcal". */
const per100kcal = (f: FoodItem, k: keyof FoodNutrients) => (f.per100g.kcal > 0 ? (f.per100g[k] / f.per100g.kcal) * 100 : 0);
/** True when two values are within 10% of each other (or both tiny). */
const close = (x: number, y: number, floor = 0) => Math.max(x, y) <= floor || Math.abs(x - y) / Math.max(x, y) < 0.1;

const isFat = (f: FoodItem) => f.per100g.kcal >= 600 && f.per100g.fat >= 60;
const isSweetener = (f: FoodItem) => f.per100g.sugar >= 60;
const isTrivial = (f: FoodItem) => f.per100g.kcal < 20;
/** Meal staples, where "pair it with a protein" advice makes sense. */
const MEAL_BASES = new Set(['Rice & Grains', 'Rotis & Breads', 'South Indian', 'Vegetables & Sabzi', 'Staples & Basics', 'Dals & Legumes']);
const mealBase = (f: FoodItem) => MEAL_BASES.has(f.category);

/** Verb agreement for display names: "Almonds have", "Roti has". */
const plural = (name: string) => /s$/.test(name) && name !== 'Chaas';
const has = (n: string) => `${n} ${plural(n) ? 'have' : 'has'}`;
const gives = (n: string) => `${n} ${plural(n) ? 'give' : 'gives'}`;
const is = (n: string) => `${n} ${plural(n) ? 'are' : 'is'}`;

/** Serving used on comparison pages when the food's first serving is too small to compare (paneer "1 cube"). */
const COMPARE_SERVING: Record<string, string> = { 'paneer-raw': '1 katori (100 g)' };

export function compareServing(f: FoodItem): FoodServing {
  const label = COMPARE_SERVING[f.slug];
  return (label && f.servings.find((s) => s.label === label)) || primaryServing(f);
}

export type Winner = 'a' | 'b' | 'tie';
export interface Verdict {
  key: 'weight-loss' | 'protein' | 'fibre';
  label: string;
  winner: Winner;
  /** Weight loss only: one is lighter per gram, the other fills you up more per calorie. */
  tradeoff?: { lighter: Winner; fuller: Winner };
  /** Weight loss only: won on calories per gram, or on protein + fibre per calorie. */
  basis?: 'lighter' | 'fuller';
  text: string;
}

/** Pretty ratio: "2.4x the" / "about twice the" — only used when the gap is meaningful. */
function times(big: number, small: number): string {
  if (small <= 0) return 'far more';
  const r = big / small;
  if (r >= 1.9 && r < 2.15) return 'about twice the';
  if (r >= 2.85 && r < 3.15) return 'about three times the';
  return r >= 1.5 ? `${round1(r)}x the` : 'more';
}

/** Protein + fibre per 100 kcal: our fullness-per-calorie score. */
const fullness = (f: FoodItem) => per100kcal(f, 'protein') + per100kcal(f, 'fiber');

export function verdicts(p: ResolvedPair): Verdict[] {
  const { foodA: A, foodB: B, nameA, nameB } = p;
  const a = A.per100g;
  const b = B.per100g;
  const nm = (w: Winner) => (w === 'a' ? nameA : nameB);
  const other = (w: Winner): Winner => (w === 'a' ? 'b' : 'a');
  const bothTrivial = isTrivial(A) && isTrivial(B);
  const out: Verdict[] = [];

  // ── Weight loss ──
  {
    let winner: Winner;
    let tradeoff: Verdict['tradeoff'];
    let basis: Verdict['basis'];
    let text: string;
    const lighter: Winner = a.kcal <= b.kcal ? 'a' : 'b';
    const kL = lighter === 'a' ? a.kcal : b.kcal;
    const kH = lighter === 'a' ? b.kcal : a.kcal;
    const fa = fullness(A);
    const fb = fullness(B);
    const fL = lighter === 'a' ? fa : fb;
    const fH = lighter === 'a' ? fb : fa;
    if (bothTrivial) {
      winner = 'tie';
      text = `Both are practically calorie-free (${a.kcal} vs ${b.kcal} kcal per 100 g), so either fits a weight-loss diet as long as you skip the sugar.`;
    } else if (!close(a.kcal, b.kcal)) {
      if (fH >= fL * 1.5 && fH - fL >= 1) {
        // Lighter per gram, but the other fills you up far better per calorie (roti vs rice).
        winner = 'tie';
        tradeoff = { lighter, fuller: other(lighter) };
        text = `It depends on how you eat it. ${has(nm(lighter))} fewer calories per 100 g (${kL} vs ${kH} kcal), but ${gives(nm(other(lighter)))} about ${round1(fH / Math.max(fL, 0.1))}x the protein and fibre per calorie, which keeps you fuller. Measure the portion of whichever you pick.`;
      } else {
        winner = lighter;
        basis = 'lighter';
        text = `${has(nm(lighter))} ${kL} kcal per 100 g against ${kH} kcal for ${nm(other(lighter))}, so you get a bigger portion for the same calories.`;
      }
    } else if (close(fa, fb, 1)) {
      winner = 'tie';
      const kc = a.kcal === b.kcal ? `the same ${a.kcal} kcal per 100 g` : `${a.kcal} vs ${b.kcal} kcal per 100 g`;
      text = `They are close: ${kc}, with similar protein and fibre. Portion size matters more than the pick.`;
    } else {
      winner = fa > fb ? 'a' : 'b';
      basis = 'fuller';
      const W = winner === 'a' ? A : B;
      const O = winner === 'a' ? B : A;
      const moreP = per100kcal(W, 'protein') > per100kcal(O, 'protein') * 1.1;
      const moreF = per100kcal(W, 'fiber') - per100kcal(O, 'fiber') >= 0.3;
      const what = moreP && moreF ? 'protein and fibre' : moreP ? 'protein' : 'fibre';
      text = `Calories are close (${a.kcal} vs ${b.kcal} kcal per 100 g), but ${gives(nm(winner))} you more ${what} per calorie than ${nm(other(winner))}, which helps you stay full.`;
    }
    if (isFat(A) && isFat(B)) text += ' Both are almost pure fat, so measure by the teaspoon whichever you choose.';
    else if (isSweetener(A) && isSweetener(B)) text += ' Both are added sugar, so the amount you use matters far more than which one.';
    else if (isAlcohol(A) || isAlcohol(B)) text += ' Alcohol calories do not keep you full.';
    else if (isSugary(A) !== isSugary(B)) text += ` Most of the calories in ${nm(isSugary(A) ? 'a' : 'b')} come from sugar, which digests fast.`;
    out.push({ key: 'weight-loss', label: 'Better for weight loss', winner, tradeoff, basis, text });
  }

  // ── Protein ──
  {
    const pa = per100kcal(A, 'protein');
    const pb = per100kcal(B, 'protein');
    let winner: Winner = 'tie';
    let text: string;
    if (bothTrivial || Math.max(a.protein, b.protein) < 1) {
      text = `Neither contains meaningful protein (${a.protein} g vs ${b.protein} g per 100 g).`;
    } else if (close(pa, pb, 1)) {
      text = `Per calorie they are close: ${round1(pa)} g vs ${round1(pb)} g protein per 100 kcal (${a.protein} g vs ${b.protein} g per 100 g).`;
    } else {
      winner = pa > pb ? 'a' : 'b';
      const [W, O, pW, pO] = winner === 'a' ? [a, b, pa, pb] : [b, a, pb, pa];
      text = `${gives(nm(winner))} ${round1(pW)} g protein per 100 kcal against ${round1(pO)} g for ${nm(other(winner))} (${W.protein} g vs ${O.protein} g per 100 g).`;
    }
    if (!bothTrivial && Math.max(a.protein, b.protein) >= 1) {
      if (Math.max(pa, pb) < 5) text += mealBase(A) && mealBase(B) ? ' Neither is a major protein source, so pair them with dal, curd, paneer, eggs or chicken.' : ' Neither is a major protein source.';
      else if (Math.max(pa, pb) >= 10) text += ' That is a strong protein-to-calorie ratio for building or keeping muscle.';
    }
    out.push({ key: 'protein', label: 'More protein per calorie', winner, text });
  }

  // ── Fibre ──
  {
    const fa = per100kcal(A, 'fiber');
    const fb = per100kcal(B, 'fiber');
    let winner: Winner = 'tie';
    let text: string;
    if (Math.max(a.fiber, b.fiber) < 1) {
      const advice = mealBase(A) || mealBase(B) || [A, B].every((f) => (f.category === 'Chicken, Fish & Meat' || f.category === 'Paneer, Egg & Dairy') && f.per100g.kcal >= 100) ? ' Add vegetables or salad to the meal.' : '';
      text = `Both are low in fibre (${a.fiber} g vs ${b.fiber} g per 100 g).${advice}`;
    } else if (close(fa, fb, 0.3)) {
      text = `They are similar: ${round1(fa)} g vs ${round1(fb)} g fibre per 100 kcal (${a.fiber} g vs ${b.fiber} g per 100 g).`;
    } else {
      winner = fa > fb ? 'a' : 'b';
      const [W, O, fW, fO] = winner === 'a' ? [a, b, fa, fb] : [b, a, fb, fa];
      text = `${gives(nm(winner))} ${round1(fW)} g fibre per 100 kcal against ${round1(fO)} g for ${nm(other(winner))} (${W.fiber} g vs ${O.fiber} g per 100 g). Fibre slows digestion and helps fullness.`;
    }
    out.push({ key: 'fibre', label: 'More fibre per calorie', winner, text });
  }
  return out;
}

/** Micronutrient gaps worth mentioning: one food has ≥1.5x a meaningful amount. */
export function microHighlights(p: ResolvedPair): string[] {
  const { foodA: A, foodB: B, nameA, nameB } = p;
  const checks: { k: keyof FoodNutrients; label: string; unit: string; min: number }[] = [
    { k: 'iron', label: 'iron', unit: 'mg', min: 1 },
    { k: 'calcium', label: 'calcium', unit: 'mg', min: 50 },
    { k: 'potassium', label: 'potassium', unit: 'mg', min: 150 },
    { k: 'vitaminC', label: 'vitamin C', unit: 'mg', min: 5 },
  ];
  const out: string[] = [];
  for (const c of checks) {
    const va = A.per100g[c.k];
    const vb = B.per100g[c.k];
    const [hi, lo, nHi, nLo] = va >= vb ? [va, vb, nameA, nameB] : [vb, va, nameB, nameA];
    if (hi >= c.min && hi >= lo * 1.5) out.push(`${has(nHi)} ${times(hi, lo)} ${c.label} of ${nLo} (${hi} vs ${lo} ${c.unit} per 100 g).`);
  }
  const sa = A.per100g.sodium;
  const sb = B.per100g.sodium;
  const [hi, lo, nHi, nLo] = sa >= sb ? [sa, sb, nameA, nameB] : [sb, sa, nameB, nameA];
  if (hi >= 300 && hi >= lo * 1.5) out.push(`${is(nHi)} saltier: ${hi} mg sodium per 100 g against ${lo} mg for ${nLo}.`);
  return out;
}

/** Grams of each food that give 100 kcal — the "same calories, how much food?" view. */
export function gramsFor100kcal(f: FoodItem): number | null {
  return f.per100g.kcal >= 5 ? Math.round((100 / f.per100g.kcal) * 100) : null;
}

/** One-line answer for the lede, meta description and speakable block. */
export function answerSentence(p: ResolvedPair): string {
  const { foodA: A, foodB: B, nameA, nameB } = p;
  const per100 =
    A.per100g.kcal === B.per100g.kcal
      ? `Both have ${A.per100g.kcal} kcal per 100 g.`
      : `Per 100 g, ${has(nameA)} ${A.per100g.kcal} kcal and ${has(nameB)} ${B.per100g.kcal} kcal.`;
  return `${per100} ${servingSentence(p)}`;
}

/** "A typical serving of Roti (1 roti, 40 g) has 119 kcal and 3.6 g protein, …" */
export function servingSentence(p: ResolvedPair): string {
  const part = (f: FoodItem, name: string) => {
    const s = compareServing(f);
    const n = caloriesFor(f, s.grams);
    return `${name} (${servingText(s).replace(/\s*\((.+)\)$/, ', $1')}) has ${n.kcal} kcal and ${n.protein} g protein`;
  };
  return `A typical serving of ${part(p.foodA, p.nameA)}, and a typical serving of ${part(p.foodB, p.nameB)}.`;
}

/** Bottom line built from the verdicts. */
export function bottomLine(p: ResolvedPair): string {
  const [wl, pr] = verdicts(p);
  const name = (w: Winner) => (w === 'a' ? p.nameA : p.nameB);
  const parts: string[] = [];
  const { foodA: A, foodB: B } = p;
  if ((isFat(A) && isFat(B)) || (isSweetener(A) && isSweetener(B))) {
    return `For weight loss, how much ${p.nameA} or ${p.nameB} you use matters far more than which one you pick. Measure it by the teaspoon and count it in your daily calories.`;
  }
  if (wl.tradeoff) parts.push(`For weight loss, neither is a clear winner: ${is(name(wl.tradeoff.lighter))} lighter per gram, while ${name(wl.tradeoff.fuller)} keeps you fuller per calorie.`);
  else if (wl.winner === 'tie') parts.push(`For weight loss there is little to choose between ${p.nameA} and ${p.nameB}, so control the portion.`);
  else parts.push(`For weight loss, ${is(name(wl.winner))} the ${wl.basis === 'lighter' ? 'lighter' : 'more filling'} pick.`);
  if (pr.winner !== 'tie' && pr.winner !== wl.winner) parts.push(`For protein, ${name(pr.winner)} ${plural(name(pr.winner)) ? 'come' : 'comes'} out ahead.`);
  else if (pr.winner !== 'tie') parts.push(plural(name(pr.winner)) ? 'They also give more protein per calorie.' : 'It also gives more protein per calorie.');
  parts.push('Both can fit a healthy Indian diet in sensible portions. What matters most is your total daily calories and protein, not any single food.');
  return parts.join(' ');
}

export interface CompareFaq { question: string; answer: string; }

/** FAQs rendered on the page AND mirrored 1:1 into FAQPage JSON-LD. */
export function compareFaqs(p: ResolvedPair): CompareFaq[] {
  const { foodA: A, foodB: B, nameA, nameB } = p;
  const v = verdicts(p);
  const a = A.per100g;
  const b = B.per100g;
  const name = (w: Winner) => (w === 'a' ? nameA : nameB);
  const faqs: CompareFaq[] = [];

  faqs.push({
    question: `Which has more calories, ${nameA} or ${nameB}?`,
    answer:
      a.kcal === b.kcal
        ? `They have the same: ${a.kcal} kcal per 100 g. ${servingSentence(p)}`
        : `${has(a.kcal > b.kcal ? nameA : nameB)} more: ${Math.max(a.kcal, b.kcal)} kcal per 100 g against ${Math.min(a.kcal, b.kcal)} kcal. ${servingSentence(p)}`,
  });
  faqs.push({
    question: `Is ${nameA} or ${nameB} better for weight loss?`,
    answer: `${v[0].winner === 'tie' ? 'Neither has a clear edge.' : `${name(v[0].winner)}.`} ${v[0].text} Weight loss comes from your total daily calorie deficit, so either can fit in the right portion.`,
  });
  faqs.push({
    question: `Which has more protein, ${nameA} or ${nameB}?`,
    answer: v[1].text,
  });
  const gA = gramsFor100kcal(A);
  const gB = gramsFor100kcal(B);
  if (gA && gB) {
    faqs.push({
      question: `How much ${nameA} and ${nameB} equals 100 calories?`,
      answer: `About ${gA} g of ${nameA} or ${gB} g of ${nameB} gives you 100 kcal.`,
    });
  }
  return faqs;
}
