/**
 * Reads a meal's free-text ingredients ("Rolled oats (40g), Low-fat milk (150 ml), Whey protein
 * (1 scoop), Chia seeds – 5 g") and works out calories and macros from the food database.
 * Pure: no React, so it can be unit-tested and reused.
 */
import { FOODS, getFoodBySlug, searchFoods, type FoodItem } from './foods';
import { caloriesFor } from './nutrition';

export interface IngredientLine {
  /** The text as the coach typed it. */
  text: string;
  food: FoodItem | null;
  grams: number | null;
  /** Why it couldn't be counted, when food or grams is missing. */
  issue?: 'no-food' | 'no-amount';
  kcal: number;
  protein: number;
  carbs: number;
  fat: number;
}

export interface IngredientTotals {
  lines: IngredientLine[];
  kcal: number;
  protein: number;
  carbs: number;
  fat: number;
  /** Lines that were matched and counted. */
  counted: number;
}

const round1 = (n: number) => Math.round(n * 10) / 10;

/** Split at commas, semicolons, "+", " and " and new lines, but never inside brackets. */
function splitItems(text: string): string[] {
  const out: string[] = [];
  let depth = 0;
  let cur = '';
  for (let i = 0; i < text.length; i++) {
    const ch = text[i];
    if (ch === '(' || ch === '[') depth++;
    if ((ch === ')' || ch === ']') && depth > 0) depth--;
    if (depth === 0 && (ch === ',' || ch === ';' || ch === '\n' || ch === '+')) {
      out.push(cur);
      cur = '';
      continue;
    }
    cur += ch;
  }
  out.push(cur);
  return out
    .flatMap((s) => s.split(/\s+and\s+(?![^(]*\))/i))
    .map((s) => s.replace(/^[\s\-–—•*·\d.)]*(?=[a-z])/i, (m) => (/\d/.test(m) && !/[.)]\s*$/.test(m.trim()) ? m : '')).trim())
    .filter(Boolean);
}

// Weight / volume units, in grams (ml treated as g — close enough for milk, curd, oil, juice).
const MASS_UNITS: [RegExp, number][] = [
  [/^(kg|kgs|kilo|kilos|kilograms?)$/, 1000],
  [/^(g|gm|gms|gr|grams?|gram)$/, 1],
  [/^(mg)$/, 0.001],
  [/^(l|ltr|litres?|liters?)$/, 1000],
  [/^(ml|mls|millilitres?|milliliters?)$/, 1],
];

// Count words that pick a serving from the food's own list ("1 scoop (33 g)", "1 katori (150 g)").
const SERVING_WORDS: Record<string, string[]> = {
  scoop: ['scoop'],
  slice: ['slice'],
  cup: ['cup'],
  glass: ['glass'],
  katori: ['katori', 'bowl'],
  bowl: ['bowl', 'katori'],
  plate: ['plate'],
  tbsp: ['tbsp', 'tablespoon'],
  tablespoon: ['tbsp', 'tablespoon'],
  tsp: ['tsp', 'teaspoon'],
  teaspoon: ['tsp', 'teaspoon'],
  piece: ['piece', 'pc', '1 '],
  pc: ['piece', 'pc', '1 '],
  pcs: ['piece', 'pc', '1 '],
  medium: ['medium', '1 '],
  small: ['small'],
  large: ['large'],
  whole: ['1 '],
  roti: ['roti', '1 '],
  chapati: ['roti', 'chapati', '1 '],
  egg: ['egg', '1 '],
  handful: ['handful'],
};

// Fallback grams for count words the food has no serving for.
const DEFAULT_SERVING_G: Record<string, number> = {
  tbsp: 15, tablespoon: 15, tsp: 5, teaspoon: 5, cup: 240, glass: 250, katori: 150, bowl: 150, scoop: 30, handful: 30,
};

// Count words that are also the food itself ("4 eggs", "2 roti"): they stay in the food name.
const FOOD_UNIT_WORDS = new Set(['egg', 'roti', 'chapati']);

const UNIT_WORDS = new Set([
  ...Object.keys(SERVING_WORDS),
  'slices', 'cups', 'glasses', 'katoris', 'bowls', 'plates', 'scoops', 'pieces', 'tbsps', 'tsps', 'handfuls',
]);

const singular = (w: string) => (w.endsWith('es') && /(glasses|katoris)$/.test(w) ? w.slice(0, -2) : w.endsWith('s') && w.length > 3 ? w.slice(0, -1) : w);

const NUM = String.raw`(\d+(?:\.\d+)?|\d+\s*\/\s*\d+|½|¼|¾)`;

function toNumber(s: string): number {
  const t = s.replace(/\s+/g, '');
  if (t === '½') return 0.5;
  if (t === '¼') return 0.25;
  if (t === '¾') return 0.75;
  if (t.includes('/')) {
    const [a, b] = t.split('/').map(Number);
    return b ? a / b : 0;
  }
  return parseFloat(t);
}

interface Amount { qty: number; unit: string | null; }

/** Every number+unit in the text: "(40g)", "150 ml", "– 5 g", "2 slices", "(1 scoop)", "4 eggs". */
function findAmounts(text: string): { amount: Amount; index: number; length: number }[] {
  const re = new RegExp(`${NUM}\\s*([a-zA-Z]+)?`, 'g');
  const found: { amount: Amount; index: number; length: number }[] = [];
  let m: RegExpExecArray | null;
  while ((m = re.exec(text))) {
    const qty = toNumber(m[1]);
    if (!(qty > 0)) continue;
    const unitRaw = (m[2] || '').toLowerCase();
    const isMass = MASS_UNITS.some(([r]) => r.test(unitRaw));
    const isCount = UNIT_WORDS.has(unitRaw) || UNIT_WORDS.has(singular(unitRaw));
    const isFoodWord = FOOD_UNIT_WORDS.has(singular(unitRaw));
    if (isFoodWord) {
      found.push({ amount: { qty, unit: singular(unitRaw) }, index: m.index, length: m[1].length });
    } else if (isMass || isCount) {
      found.push({ amount: { qty, unit: singular(unitRaw) === unitRaw ? unitRaw : isMass ? unitRaw : singular(unitRaw) }, index: m.index, length: m[0].length });
    } else {
      // A bare count ("4 eggs", "2 rotis"): the number only; the word stays part of the food name.
      found.push({ amount: { qty, unit: null }, index: m.index, length: m[1].length });
    }
  }
  return found;
}

function gramsForAmount(food: FoodItem, amount: Amount): number | null {
  const { qty, unit } = amount;
  if (unit) {
    const mass = MASS_UNITS.find(([r]) => r.test(unit));
    if (mass) return qty * mass[1];
    const keys = SERVING_WORDS[unit] || [unit];
    const serving = food.servings.find((s) => keys.some((k) => s.label.toLowerCase().includes(k)));
    if (serving) return qty * serving.grams;
    if (DEFAULT_SERVING_G[unit]) return qty * DEFAULT_SERVING_G[unit];
  }
  // A plain count: one of the food's first non-100 g serving ("1 egg (50 g)", "1 medium (118 g)").
  const unitServing = food.servings.find((s) => /^1\s/.test(s.label) && s.label !== '100 g');
  return unitServing ? qty * unitServing.grams : null;
}

// Words that describe a food but are rarely in its database name.
const FILLER = new Set([
  'of', 'the', 'a', 'an', 'fresh', 'raw', 'cooked', 'boiled', 'plain', 'homemade', 'home', 'made', 'mixed',
  'rolled', 'organic', 'chopped', 'sliced', 'whole', 'medium', 'small', 'large', 'approx', 'about', 'some',
]);

const words = (s: string) => s.toLowerCase().split(/[^a-z0-9]+/).filter(Boolean);
const stem = (w: string) => (w.length > 3 && w.endsWith('es') && !w.endsWith('ses') ? w.slice(0, -2) : w.length > 3 && w.endsWith('s') && !w.endsWith('ss') ? w.slice(0, -1) : w);

/** True if every query word appears (as a word prefix) in the food's name or one alias. */
function confidentMatch(food: FoodItem, query: string): boolean {
  const q = words(query).map(stem);
  const texts = [food.name, ...(food.aliases ?? [])].map((t) => words(t).map(stem));
  return texts.some((tw) => q.every((w) => tw.some((t) => t === w || t.startsWith(w))));
}

// What a coach usually means by a bare generic word.
const GENERIC: Record<string, string> = {
  dal: 'toor-dal-cooked',
  daal: 'toor-dal-cooked',
  rice: 'basmati-rice',
  chawal: 'basmati-rice',
  egg: 'egg-boiled',
  roti: 'roti-chapati',
  chapati: 'roti-chapati',
  phulka: 'roti-chapati',
};

const MATCH_CACHE = new Map<string, FoodItem | null>();

/**
 * The database food for a name. Tries the whole name, then without filler words, then shorter
 * tails ("low fat paneer" -> "fat paneer" -> "paneer"), taking the best search hit that really
 * contains the words.
 */
export function matchFood(name: string): FoodItem | null {
  const key = name.toLowerCase().trim();
  if (MATCH_CACHE.has(key)) return MATCH_CACHE.get(key)!;
  const all = words(key);
  const meaningful = all.filter((w) => !FILLER.has(w));
  const tries: string[] = [all.join(' ')];
  if (meaningful.length && meaningful.length !== all.length) tries.push(meaningful.join(' '));
  for (let i = 1; i < meaningful.length; i++) tries.push(meaningful.slice(i).join(' '));
  let result: FoodItem | null = null;
  const generic = meaningful.length === 1 ? GENERIC[stem(meaningful[0])] || GENERIC[meaningful[0]] : undefined;
  if (generic) result = getFoodBySlug(generic) ?? null;
  for (const t of result ? [] : tries) {
    if (!t) continue;
    const hit = searchFoods(t).slice(0, 8).find((f) => confidentMatch(f, t));
    if (hit) { result = hit; break; }
  }
  MATCH_CACHE.set(key, result);
  return result;
}

export function parseIngredient(text: string): IngredientLine {
  const amounts = findAmounts(text);
  // Prefer a weight/volume, then a named serving, then a bare count.
  const pick =
    amounts.find((a) => a.amount.unit && MASS_UNITS.some(([r]) => r.test(a.amount.unit!))) ||
    amounts.find((a) => a.amount.unit) ||
    amounts[0] ||
    null;

  // Food name: the text before any bracket, minus amounts and separators.
  let name = text.replace(/\(.*?\)|\[.*?\]/g, ' ');
  for (const a of [...amounts].sort((x, y) => y.index - x.index)) {
    if (a.index < name.length) name = name.slice(0, a.index) + ' ' + name.slice(a.index + a.length);
  }
  name = name.replace(/[–—\-:=x×@]/g, ' ').replace(/\s+/g, ' ').trim();

  const food = name ? matchFood(name) : null;
  const empty = { text, kcal: 0, protein: 0, carbs: 0, fat: 0 };
  if (!food) return { ...empty, food: null, grams: null, issue: 'no-food' };
  const grams = pick ? gramsForAmount(food, pick.amount) : null;
  if (!grams) return { ...empty, food, grams: null, issue: 'no-amount' };
  const n = caloriesFor(food, grams);
  return { text, food, grams: Math.round(grams), kcal: n.kcal, protein: n.protein, carbs: n.carbs, fat: n.fat };
}

export function ingredientTotals(text: string): IngredientTotals {
  const lines = splitItems(text || '').map(parseIngredient);
  const counted = lines.filter((l) => !l.issue);
  return {
    lines,
    kcal: Math.round(counted.reduce((s, l) => s + l.kcal, 0)),
    protein: round1(counted.reduce((s, l) => s + l.protein, 0)),
    carbs: round1(counted.reduce((s, l) => s + l.carbs, 0)),
    fat: round1(counted.reduce((s, l) => s + l.fat, 0)),
    counted: counted.length,
  };
}

export const FOOD_COUNT = FOODS.length;
