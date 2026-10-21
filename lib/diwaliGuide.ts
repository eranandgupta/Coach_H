// Diwali sweets & snacks calorie guide (/diwali-sweets-calories).
// Every number on the page is computed here from lib/foods.ts — no hand-typed calorie figures.
// The swap list is validated at import time, so a swap that stops being genuinely lighter
// (per serving AND per 100 g) after a data edit fails the build instead of shipping bad advice.

import { getFoodBySlug, type FoodItem } from './foods';

export const DIWALI_URL = 'https://coachhimanshu.com/diwali-sweets-calories';
export const DIWALI_UPDATED = '2026-10-20';
export const DIWALI_UPDATED_LABEL = '20 October 2026';

/** Brisk walking ≈ 3.5 MET. kcal/min = MET × 3.5 × kg / 200 (ACSM), for a 70 kg adult. */
export const WALK_KG = 70;
export const WALK_KCAL_PER_MIN = (3.5 * 3.5 * WALK_KG) / 200;

/** WHO: free sugars under 10% of energy, ideally under 5% — about 25 g a day on 2,000 kcal. */
export const WHO_SUGAR_IDEAL_G = 25;

export interface DiwaliRow {
  slug: string;
  name: string;
  serving: string;
  grams: number;
  kcal: number;
  sugar: number;
  fat: number;
  protein: number;
  per100: number;
  walkMin: number;
}

function food(slug: string): FoodItem {
  const f = getFoodBySlug(slug);
  if (!f) throw new Error(`diwaliGuide: unknown food slug "${slug}"`);
  return f;
}

function row(slug: string): DiwaliRow {
  const f = food(slug);
  const sv = f.servings[0];
  const k = (n: number) => (n * sv.grams) / 100;
  const kcal = Math.round(k(f.per100g.kcal));
  return {
    slug,
    name: f.name,
    serving: sv.label,
    grams: sv.grams,
    kcal,
    sugar: Math.round(k(f.per100g.sugar) * 10) / 10,
    fat: Math.round(k(f.per100g.fat) * 10) / 10,
    protein: Math.round(k(f.per100g.protein) * 10) / 10,
    per100: f.per100g.kcal,
    walkMin: Math.round(kcal / WALK_KCAL_PER_MIN),
  };
}

const byKcal = (a: DiwaliRow, b: DiwaliRow) => a.kcal - b.kcal;

/** Mithai people actually give and eat over Dhanteras–Bhai Dooj. */
export const SWEETS: DiwaliRow[] = [
  'kaju-katli', 'soan-papdi', 'motichoor-ladoo', 'laddu-besan', 'gulab-jamun', 'rasgulla', 'rasmalai',
  'jalebi', 'imarti', 'barfi-milk', 'peda', 'milk-cake', 'mysore-pak', 'coconut-barfi', 'anjeer-barfi',
  'date-nut-ladoo', 'gujiya', 'shakarpara',
].map(row).sort(byKcal);

/** Served by the katori, not the piece. */
export const BOWL_SWEETS: DiwaliRow[] = ['kheer', 'gajar-halwa', 'moong-dal-halwa', 'halwa-suji'].map(row).sort(byKcal);

export const SNACKS: DiwaliRow[] = [
  'poha-chivda', 'bhujia-sev', 'chakli-murukku', 'mathri', 'samosa', 'pakora', 'cashew', 'almonds',
].map(row).sort(byKcal);

const DIWALI_SLUGS = new Set([...SWEETS, ...BOWL_SWEETS, ...SNACKS].map((r) => r.slug));
/** Food pages for these link back to the Diwali guide. */
export function isDiwaliFood(slug: string): boolean {
  return DIWALI_SLUGS.has(slug);
}

export function getRow(slug: string): DiwaliRow {
  const r = [...SWEETS, ...BOWL_SWEETS, ...SNACKS].find((x) => x.slug === slug);
  return r ?? row(slug);
}

// ── Headline facts ─────────────────────────────────────────────────────────────

const minBy = <T,>(xs: T[], f: (x: T) => number) => xs.reduce((a, b) => (f(b) < f(a) ? b : a));
const maxBy = <T,>(xs: T[], f: (x: T) => number) => xs.reduce((a, b) => (f(b) > f(a) ? b : a));

export const FACTS = {
  lightestPiece: minBy(SWEETS, (r) => r.kcal),
  heaviestPiece: maxBy(SWEETS, (r) => r.kcal),
  lightestPer100: minBy(SWEETS, (r) => r.per100),
  densestPer100: maxBy(SWEETS, (r) => r.per100),
  heaviestBowl: maxBy(BOWL_SWEETS, (r) => r.kcal),
  pieceRange: [Math.min(...SWEETS.map((r) => r.kcal)), Math.max(...SWEETS.map((r) => r.kcal))] as const,
  /** Median piece (SWEETS is sorted by kcal). */
  typicalPiece: SWEETS[Math.floor(SWEETS.length / 2)].kcal,
  kajuKatli: row('kaju-katli'),
  gulabJamun: row('gulab-jamun'),
  soanPapdi: row('soan-papdi'),
  besanLaddu: row('laddu-besan'),
  namkeen: row('poha-chivda'),
};

/** Most-sold boxed mithai; averaged per 100 g for "what's in a 500 g box". */
const BOX_SLUGS = ['kaju-katli', 'soan-papdi', 'motichoor-ladoo', 'laddu-besan', 'barfi-milk', 'peda', 'milk-cake', 'mysore-pak', 'coconut-barfi', 'anjeer-barfi'];
export const BOX_GRAMS = 500;
export const BOX = (() => {
  const foods = BOX_SLUGS.map(food);
  const avg = (key: 'kcal' | 'sugar') => foods.reduce((s, f) => s + f.per100g[key], 0) / foods.length;
  return {
    kcal: Math.round((avg('kcal') * BOX_GRAMS) / 100),
    sugar: Math.round((avg('sugar') * BOX_GRAMS) / 100),
    names: foods.map((f) => f.name),
  };
})();

// ── Swaps ──────────────────────────────────────────────────────────────────────

export interface Swap {
  from: DiwaliRow;
  to: DiwaliRow;
  saves: number;
  savesPct: number;
  why: string;
}

const SWAP_SPECS: { from: string; to: string; why: string }[] = [
  { from: 'gulab-jamun', to: 'rasgulla', why: 'Both are soaked in syrup, but rasgulla is chhena that is boiled, not fried.' },
  { from: 'imarti', to: 'jalebi', why: 'Same fried-and-soaked idea in a lighter piece.' },
  { from: 'soan-papdi', to: 'kaju-katli', why: 'Smaller piece, and the cashew base gives a little protein.' },
  { from: 'gujiya', to: 'date-nut-ladoo', why: 'Half the size, with no frying, and the dates and nuts bring fibre.' },
  { from: 'halwa-suji', to: 'kheer', why: 'Milk-based, much less ghee, and a katori fills you up for fewer calories.' },
  { from: 'poha-chivda', to: 'makhana', why: 'Roasted, not fried — snack by the katori for half the calories.' },
  { from: 'bhujia-sev', to: 'roasted-chana', why: 'Roasted, not fried, and about seven grams of protein per katori.' },
  { from: 'mathri', to: 'popcorn', why: 'A big bowl of air-popped popcorn instead of four fried mathris.' },
];

/** A swap must save ≥25% per serving AND not be denser per 100 g — otherwise it's just a smaller piece. */
export const SWAPS: Swap[] = SWAP_SPECS.map(({ from, to, why }) => {
  const a = getRow(from);
  const b = getRow(to);
  const saves = a.kcal - b.kcal;
  const savesPct = Math.round((100 * saves) / a.kcal);
  if (savesPct < 25 || b.per100 > a.per100) {
    throw new Error(`diwaliGuide: swap ${from} → ${to} is not genuinely lighter (${savesPct}% per serving, ${a.per100} → ${b.per100} kcal/100 g)`);
  }
  return { from: a, to: b, saves, savesPct, why };
});

// ── FAQ (answers built from the same numbers the page shows) ───────────────────

const kcal = (n: number) => `${n.toLocaleString('en-IN')} kcal`;
const walk = (r: DiwaliRow) => `about ${r.walkMin} minutes of brisk walking`;

export const DIWALI_FAQS: { question: string; answer: string }[] = [
  {
    question: 'How many calories are in one kaju katli?',
    answer: `One piece of kaju katli (${FACTS.kajuKatli.grams} g) has about ${kcal(FACTS.kajuKatli.kcal)}. It looks light because the pieces are thin, but per 100 g it has ${kcal(FACTS.kajuKatli.per100)}, among the most calorie-dense sweets on this list.`,
  },
  {
    question: 'How many calories are in a gulab jamun?',
    answer: `One gulab jamun (${FACTS.gulabJamun.grams} g) has about ${kcal(FACTS.gulabJamun.kcal)} and ${FACTS.gulabJamun.sugar} g of sugar. Burning it off takes ${walk(FACTS.gulabJamun)} for a ${WALK_KG} kg adult.`,
  },
  {
    question: 'Which Diwali sweet has the fewest calories?',
    answer: `Per piece, ${FACTS.lightestPiece.name} is the lightest here at about ${kcal(FACTS.lightestPiece.kcal)}. Per 100 g, ${FACTS.lightestPer100.name} is lightest (${kcal(FACTS.lightestPer100.per100)}), because it is milk and syrup rather than ghee, sugar and nuts. Single pieces here range from ${kcal(FACTS.pieceRange[0])} to ${kcal(FACTS.pieceRange[1])}, and a typical piece is about ${kcal(FACTS.typicalPiece)}.`,
  },
  {
    question: 'Which Diwali sweet has the most calories?',
    answer: `Per piece, ${FACTS.heaviestPiece.name} is the heaviest here at about ${kcal(FACTS.heaviestPiece.kcal)}. Per 100 g, ${FACTS.densestPer100.name} is the most calorie-dense (${kcal(FACTS.densestPer100.per100)}). A katori of ${FACTS.heaviestBowl.name.toLowerCase()} is about ${kcal(FACTS.heaviestBowl.kcal)}, as much as a light meal.`,
  },
  {
    question: 'How many calories are in a box of Diwali sweets?',
    answer: `A ${BOX_GRAMS} g box of mixed mithai has roughly ${kcal(BOX.kcal)} and ${BOX.sugar} g of sugar, averaging ${BOX.names.length} common boxed sweets. That is more than a full day's calories for many adults, so it is a box to share over a week, not a day.`,
  },
  {
    question: 'Is soan papdi high in calories?',
    answer: `Yes. Soan papdi has about ${kcal(FACTS.soanPapdi.per100)} per 100 g, ${FACTS.densestPer100.slug === 'soan-papdi' ? 'the highest' : 'one of the highest'} of the sweets on this list, because it is mostly sugar, ghee and flour spun into flakes. One ${FACTS.soanPapdi.grams} g piece is about ${kcal(FACTS.soanPapdi.kcal)}.`,
  },
  {
    question: 'Can I eat sweets during Diwali and still lose weight?',
    answer: `Yes, if the sweets fit inside your daily calories. A typical piece is about ${kcal(FACTS.typicalPiece)}, so one or two pieces a day is easy to budget for. What adds up is grazing: a katori of namkeen (${kcal(FACTS.namkeen.kcal)}) here, a laddoo (${kcal(FACTS.besanLaddu.kcal)}) there, every day of the festival.`,
  },
  {
    question: 'How do I avoid gaining weight during Diwali?',
    answer: `Decide your sweets in advance (one or two pieces a day), eat a protein-rich meal before parties, keep namkeen in a katori instead of eating from the packet, walk after big meals, and get back to your normal routine the day after Bhai Dooj. One heavy day does not undo weeks of progress; a heavy fortnight can.`,
  },
];
