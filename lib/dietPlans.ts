// Indian diet plans by calorie target (/diet-plans). Each plan is a list of real foods
// from lib/foods.ts with a number of servings; every calorie, protein, carb, fat and
// fibre figure shown on the page is COMPUTED from the food database, never typed in.
// Cooked dishes in the database are home-style values that already include typical
// cooking oil. Plans must land within ±5% of their target: planIssues() lists any
// that do not, and generateStaticParams throws on them so a bad edit fails the build.

import { FOODS, type FoodItem } from '@/lib/foods';
import { ACTIVITY_LEVELS, CALORIE_FLOOR, KCAL_PER_KG_FAT, type Sex } from '@/lib/fitnessTools';

export const DIET_PLANS_BASE = 'https://coachhimanshu.com/diet-plans';

export type DietType = 'veg' | 'nonveg';
export const DIET_LABEL: Record<DietType, string> = { veg: 'Vegetarian', nonveg: 'Non-Vegetarian' };

interface ItemSpec {
  slug: string;
  n: number;       // number of servings
  s?: number;      // index into the food's servings (default 0)
}
interface MealSpec {
  meal: string;
  time: string;
  items: ItemSpec[];
}
interface PlanSpec {
  kcal: number;
  diet: DietType;
  goal: string;    // one-line "best for"
  meals: MealSpec[];
}

const i = (slug: string, n = 1, s = 0): ItemSpec => ({ slug, n, s });

// ─────────────────────────────────────────────────────────────────────────────
// The plans. Portions are everyday Indian units (roti, katori, glass). Edit here and
// re-check totals with planIssues() — the page shows exactly what this adds up to.
// ─────────────────────────────────────────────────────────────────────────────
const SPECS: PlanSpec[] = [
  {
    kcal: 1200,
    diet: 'veg',
    goal: 'Steady fat loss for smaller, less active women',
    meals: [
      { meal: 'Early morning', time: '7:00 am', items: [i('almonds')] },
      { meal: 'Breakfast', time: '8:30 am', items: [i('besan-chilla', 2), i('curd-dahi', 0.7)] },
      { meal: 'Mid-morning', time: '11:00 am', items: [i('papaya')] },
      { meal: 'Lunch', time: '1:30 pm', items: [i('roti-chapati', 1), i('moong-dal-cooked'), i('lauki-sabzi'), i('green-salad')] },
      { meal: 'Evening', time: '5:00 pm', items: [i('chai-no-sugar'), i('roasted-chana', 1, 1)] },
      { meal: 'Dinner', time: '8:00 pm', items: [i('tofu-bhurji'), i('palak-sabzi', 0.7)] },
    ],
  },
  {
    kcal: 1200,
    diet: 'nonveg',
    goal: 'Steady fat loss for smaller, less active women',
    meals: [
      { meal: 'Early morning', time: '7:00 am', items: [i('almonds')] },
      { meal: 'Breakfast', time: '8:30 am', items: [i('egg-boiled', 2), i('roti-chapati', 0.5)] },
      { meal: 'Mid-morning', time: '11:00 am', items: [i('papaya')] },
      { meal: 'Lunch', time: '1:30 pm', items: [i('roti-chapati', 1), i('moong-dal-cooked'), i('lauki-sabzi'), i('green-salad')] },
      { meal: 'Evening', time: '5:00 pm', items: [i('chai-no-sugar'), i('roasted-chana', 1, 1)] },
      { meal: 'Dinner', time: '8:00 pm', items: [i('chicken-home-style-cooked'), i('palak-sabzi', 0.7)] },
    ],
  },
  {
    kcal: 1500,
    diet: 'veg',
    goal: 'Fat loss for most women and lighter, less active men',
    meals: [
      { meal: 'Early morning', time: '7:00 am', items: [i('almonds')] },
      { meal: 'Breakfast', time: '8:30 am', items: [i('besan-chilla', 2), i('curd-dahi')] },
      { meal: 'Mid-morning', time: '11:00 am', items: [i('apple')] },
      { meal: 'Lunch', time: '1:30 pm', items: [i('roti-chapati', 2), i('moong-dal-cooked'), i('mixed-veg'), i('green-salad')] },
      { meal: 'Evening', time: '5:00 pm', items: [i('chai-no-sugar'), i('roasted-chana', 1, 1)] },
      { meal: 'Dinner', time: '8:00 pm', items: [i('tofu-bhurji'), i('palak-sabzi')] },
    ],
  },
  {
    kcal: 1500,
    diet: 'nonveg',
    goal: 'Fat loss for most women and lighter, less active men',
    meals: [
      { meal: 'Early morning', time: '7:00 am', items: [i('almonds')] },
      { meal: 'Breakfast', time: '8:30 am', items: [i('egg-boiled', 2), i('roti-chapati', 1)] },
      { meal: 'Mid-morning', time: '11:00 am', items: [i('apple')] },
      { meal: 'Lunch', time: '1:30 pm', items: [i('roti-chapati', 2), i('moong-dal-cooked'), i('mixed-veg'), i('green-salad')] },
      { meal: 'Evening', time: '5:00 pm', items: [i('chai-no-sugar'), i('roasted-chana', 1, 1)] },
      { meal: 'Dinner', time: '8:00 pm', items: [i('chicken-home-style-cooked'), i('palak-sabzi')] },
    ],
  },
  {
    kcal: 1800,
    diet: 'veg',
    goal: 'Fat loss for most men, or maintenance for many women',
    meals: [
      { meal: 'Early morning', time: '7:00 am', items: [i('almonds')] },
      { meal: 'Breakfast', time: '8:30 am', items: [i('besan-chilla', 2), i('curd-dahi'), i('banana')] },
      { meal: 'Mid-morning', time: '11:00 am', items: [i('buttermilk'), i('roasted-chana', 1, 1)] },
      { meal: 'Lunch', time: '1:30 pm', items: [i('roti-chapati', 2), i('rajma-cooked'), i('mixed-veg'), i('green-salad')] },
      { meal: 'Evening', time: '5:00 pm', items: [i('chai-no-sugar'), i('sprouts-salad')] },
      { meal: 'Dinner', time: '8:00 pm', items: [i('paneer-raw', 0.8, 1), i('palak-sabzi')] },
    ],
  },
  {
    kcal: 1800,
    diet: 'nonveg',
    goal: 'Fat loss for most men, or maintenance for many women',
    meals: [
      { meal: 'Early morning', time: '7:00 am', items: [i('almonds')] },
      { meal: 'Breakfast', time: '8:30 am', items: [i('egg-omelette', 2), i('roti-chapati', 1), i('banana')] },
      { meal: 'Mid-morning', time: '11:00 am', items: [i('buttermilk'), i('roasted-chana', 1, 1)] },
      { meal: 'Lunch', time: '1:30 pm', items: [i('roti-chapati', 2), i('moong-dal-cooked'), i('mixed-veg'), i('green-salad')] },
      { meal: 'Evening', time: '5:00 pm', items: [i('chai-no-sugar'), i('sprouts-salad')] },
      { meal: 'Dinner', time: '8:00 pm', items: [i('chicken-home-style-cooked'), i('palak-sabzi')] },
    ],
  },
  {
    kcal: 2000,
    diet: 'veg',
    goal: 'Fat loss for active men, or maintenance for active women',
    meals: [
      { meal: 'Early morning', time: '7:00 am', items: [i('almonds')] },
      { meal: 'Breakfast', time: '8:30 am', items: [i('besan-chilla', 3), i('curd-dahi'), i('banana')] },
      { meal: 'Mid-morning', time: '11:00 am', items: [i('buttermilk'), i('roasted-chana', 1, 1)] },
      { meal: 'Lunch', time: '1:30 pm', items: [i('roti-chapati', 2), i('basmati-rice', 0.5), i('rajma-cooked'), i('mixed-veg'), i('green-salad')] },
      { meal: 'Evening', time: '5:00 pm', items: [i('chai-no-sugar'), i('sprouts-salad')] },
      { meal: 'Dinner', time: '8:00 pm', items: [i('paneer-raw', 1, 1), i('palak-sabzi')] },
    ],
  },
  {
    kcal: 2000,
    diet: 'nonveg',
    goal: 'Fat loss for active men, or maintenance for active women',
    meals: [
      { meal: 'Early morning', time: '7:00 am', items: [i('almonds')] },
      { meal: 'Breakfast', time: '8:30 am', items: [i('egg-omelette', 2), i('roti-chapati', 1), i('banana')] },
      { meal: 'Mid-morning', time: '11:00 am', items: [i('buttermilk'), i('roasted-chana', 1, 1)] },
      { meal: 'Lunch', time: '1:30 pm', items: [i('roti-chapati', 2), i('basmati-rice', 0.5), i('moong-dal-cooked'), i('mixed-veg'), i('green-salad')] },
      { meal: 'Evening', time: '5:00 pm', items: [i('chai-no-sugar'), i('sprouts-salad')] },
      { meal: 'Dinner', time: '8:00 pm', items: [i('chicken-home-style-cooked', 1.3), i('palak-sabzi')] },
    ],
  },
  {
    kcal: 2500,
    diet: 'veg',
    goal: 'Muscle gain or maintenance for active men',
    meals: [
      { meal: 'Early morning', time: '7:00 am', items: [i('almonds'), i('banana')] },
      { meal: 'Breakfast', time: '8:30 am', items: [i('besan-chilla', 3), i('curd-dahi'), i('peanut-butter', 1)] },
      { meal: 'Mid-morning', time: '11:00 am', items: [i('whey-shake-milk')] },
      { meal: 'Lunch', time: '1:30 pm', items: [i('roti-chapati', 3), i('basmati-rice', 0.5), i('rajma-cooked'), i('mixed-veg'), i('green-salad')] },
      { meal: 'Evening', time: '5:00 pm', items: [i('chai-no-sugar'), i('sprouts-salad')] },
      { meal: 'Dinner', time: '8:00 pm', items: [i('paneer-raw', 1.2, 1), i('palak-sabzi'), i('roti-chapati', 1)] },
    ],
  },
  {
    kcal: 2500,
    diet: 'nonveg',
    goal: 'Muscle gain or maintenance for active men',
    meals: [
      { meal: 'Early morning', time: '7:00 am', items: [i('almonds'), i('banana')] },
      { meal: 'Breakfast', time: '8:30 am', items: [i('egg-omelette', 3), i('roti-chapati', 2), i('peanut-butter', 1)] },
      { meal: 'Mid-morning', time: '11:00 am', items: [i('whey-shake-milk')] },
      { meal: 'Lunch', time: '1:30 pm', items: [i('roti-chapati', 3), i('basmati-rice', 0.5), i('moong-dal-cooked'), i('mixed-veg'), i('green-salad')] },
      { meal: 'Evening', time: '5:00 pm', items: [i('chai-no-sugar'), i('sprouts-salad')] },
      { meal: 'Dinner', time: '8:00 pm', items: [i('chicken-breast-cooked', 1.5), i('palak-sabzi'), i('roti-chapati', 1)] },
    ],
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// Resolution: foods → grams → nutrients
// ─────────────────────────────────────────────────────────────────────────────
export interface Totals {
  kcal: number;
  protein: number;
  carbs: number;
  fat: number;
  fiber: number;
}

export interface PlanItem {
  food: FoodItem;
  label: string; // "2 roti (80 g)"
  grams: number;
  totals: Totals;
}

export interface PlanMeal {
  meal: string;
  time: string;
  items: PlanItem[];
  totals: Totals;
}

export interface DietPlan {
  slug: string;
  kcal: number;
  diet: DietType;
  goal: string;
  meals: PlanMeal[];
  totals: Totals;
}

const ZERO: Totals = { kcal: 0, protein: 0, carbs: 0, fat: 0, fiber: 0 };
const add = (a: Totals, b: Totals): Totals => ({
  kcal: a.kcal + b.kcal,
  protein: a.protein + b.protein,
  carbs: a.carbs + b.carbs,
  fat: a.fat + b.fat,
  fiber: a.fiber + b.fiber,
});

const fmtNum = (n: number) => (Number.isInteger(n) ? String(n) : String(Math.round(n * 10) / 10));

const PLURAL: Record<string, string> = { egg: 'eggs', banana: 'bananas', apple: 'apples', guava: 'guavas', piece: 'pieces', chilla: 'chillas', breast: 'breasts' };

// "1 roti (40 g)" × 2 → "2 roti (80 g)"; "10 pieces (12 g)" × 0.5 → "5 pieces (6 g)".
function scaleLabel(label: string, n: number, grams: number): string {
  const m = label.match(/^(\d+(?:\.\d+)?)\s+(.*?)\s*\((\d+)\s*(g|ml)\)$/);
  if (!m) return `${fmtNum(n)} × ${label}`;
  const count = parseFloat(m[1]) * n;
  const unit = count !== 1 && PLURAL[m[2]] ? PLURAL[m[2]] : m[2];
  return `${fmtNum(count)} ${unit} (${Math.round(grams)} ${m[4]})`;
}

function resolveItem(spec: ItemSpec): PlanItem {
  const food = FOODS.find((f) => f.slug === spec.slug);
  if (!food) throw new Error(`dietPlans: unknown food slug "${spec.slug}"`);
  const serving = food.servings[spec.s ?? 0];
  const grams = serving.grams * spec.n;
  const k = grams / 100;
  const p = food.per100g;
  return {
    food,
    grams,
    label: scaleLabel(serving.label, spec.n, grams),
    totals: { kcal: p.kcal * k, protein: p.protein * k, carbs: p.carbs * k, fat: p.fat * k, fiber: p.fiber * k },
  };
}

export const planSlug = (kcal: number, diet: DietType) =>
  `${kcal}-calorie-${diet === 'veg' ? 'vegetarian' : 'non-veg'}-indian-diet-plan`;

export const DIET_PLANS: DietPlan[] = SPECS.map((spec) => {
  const meals = spec.meals.map((m) => {
    const items = m.items.map(resolveItem);
    return { meal: m.meal, time: m.time, items, totals: items.reduce((t, it) => add(t, it.totals), ZERO) };
  });
  return {
    slug: planSlug(spec.kcal, spec.diet),
    kcal: spec.kcal,
    diet: spec.diet,
    goal: spec.goal,
    meals,
    totals: meals.reduce((t, m) => add(t, m.totals), ZERO),
  };
});

export const CALORIE_TARGETS = Array.from(new Set(DIET_PLANS.map((p) => p.kcal)));

export function getDietPlan(slug: string): DietPlan | undefined {
  return DIET_PLANS.find((p) => p.slug === slug);
}
export function sibling(plan: DietPlan): DietPlan | undefined {
  return DIET_PLANS.find((p) => p.kcal === plan.kcal && p.diet !== plan.diet);
}

/** Plans whose computed total is more than 5% off the advertised target. */
export function planIssues(): string[] {
  return DIET_PLANS.filter((p) => Math.abs(p.totals.kcal - p.kcal) / p.kcal > 0.05).map(
    (p) => `${p.slug}: ${Math.round(p.totals.kcal)} kcal vs target ${p.kcal}`,
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Copy helpers — every number is derived from the plan or the TDEE formulas.
// ─────────────────────────────────────────────────────────────────────────────
export const r0 = (n: number) => Math.round(n);
export const kcalLabel = (n: number) => Math.round(n).toLocaleString('en-IN');

export function planTitle(p: DietPlan): string {
  return `${p.kcal.toLocaleString('en-IN')} Calorie ${DIET_LABEL[p.diet]} Indian Diet Plan`;
}

export function macroShare(t: Totals): { protein: number; carbs: number; fat: number } {
  const pk = t.protein * 4;
  const ck = t.carbs * 4;
  const fk = t.fat * 9;
  const sum = pk + ck + fk || 1;
  return { protein: r0((pk / sum) * 100), carbs: r0((ck / sum) * 100), fat: 100 - r0((pk / sum) * 100) - r0((ck / sum) * 100) };
}

// Example people (age 30) for whom this target is a ~0.5 kg/week deficit or plain
// maintenance. Mifflin-St Jeor solved for weight. Deficit examples must be at least
// Asian-Indian overweight (BMI 23+) and above the sex's calorie floor; maintenance
// examples must sit in a healthy BMI band (18.5–24.9), trying higher activity levels
// until one fits — so a page never tells an underweight person to diet.
const EXAMPLE = { age: 30, height: { female: 158, male: 172 } as Record<Sex, number> };
const WEEKLY_LOSS = 0.5;
const MAINT_ACTIVITY = ['light', 'moderate', 'very'];

function weightForTdee(sex: Sex, tdee: number, activity: string): number {
  const factor = ACTIVITY_LEVELS.find((a) => a.key === activity)!.factor;
  const s = sex === 'male' ? 5 : -161;
  return (tdee / factor - 6.25 * EXAMPLE.height[sex] + 5 * EXAMPLE.age - s) / 10;
}
const bmiOf = (w: number, h: number) => w / (h / 100) ** 2;

export interface ExamplePerson {
  sex: Sex;
  heightCm: number;
  weightKg: number;
  maintenance: number;
  activity: string; // label, e.g. 'lightly active'
  kind: 'deficit' | 'maintenance';
}

const activityLabel = (key: string) => ACTIVITY_LEVELS.find((a) => a.key === key)!.label.toLowerCase();

export function examplePeople(p: DietPlan): ExamplePerson[] {
  const deficit = r0((WEEKLY_LOSS * KCAL_PER_KG_FAT) / 7);
  const out: ExamplePerson[] = [];
  for (const sex of ['female', 'male'] as Sex[]) {
    const h = EXAMPLE.height[sex];
    if (p.kcal >= CALORIE_FLOOR[sex]) {
      const maintenance = p.kcal + deficit;
      const w = weightForTdee(sex, maintenance, 'light');
      if (w <= 120 && bmiOf(w, h) >= 23)
        out.push({ sex, heightCm: h, weightKg: r0(w), maintenance, activity: activityLabel('light'), kind: 'deficit' });
    }
    for (const act of MAINT_ACTIVITY) {
      const w = weightForTdee(sex, p.kcal, act);
      const b = bmiOf(w, h);
      if (b >= 18.5 && b < 25) {
        out.push({ sex, heightCm: h, weightKg: r0(w), maintenance: p.kcal, activity: activityLabel(act), kind: 'maintenance' });
        break;
      }
    }
  }
  return out;
}

/** The plan's main protein foods, read from what is actually in it. */
export function proteinFoods(p: DietPlan): string[] {
  const has = (re: RegExp) => p.meals.some((m) => m.items.some((it) => re.test(it.food.slug)));
  const out: string[] = [];
  if (has(/^paneer/)) out.push('paneer');
  if (has(/^tofu/)) out.push('tofu');
  if (has(/^egg/)) out.push('eggs');
  if (has(/^chicken/)) out.push('chicken');
  if (has(/dal|rajma/)) out.push(has(/rajma/) ? 'rajma' : 'dal');
  if (has(/^curd/)) out.push('curd');
  if (has(/whey/)) out.push('a whey shake');
  return out;
}
export const listJoin = (xs: string[]) => (xs.length < 2 ? xs.join('') : `${xs.slice(0, -1).join(', ')} and ${xs[xs.length - 1]}`);

export const EXAMPLE_AGE = EXAMPLE.age;
export const WEEKLY_DEFICIT_KG = WEEKLY_LOSS;
export const DAILY_DEFICIT = r0((WEEKLY_LOSS * KCAL_PER_KG_FAT) / 7);

export interface DietFaq {
  question: string;
  answer: string;
}

export function planFaqs(p: DietPlan): DietFaq[] {
  const t = p.totals;
  const other = sibling(p);
  const people = examplePeople(p);
  const deficitPeople = people.filter((x) => x.kind === 'deficit');
  const who = deficitPeople.length
    ? deficitPeople
        .map((x) => `a ${x.activity} ${EXAMPLE.age}-year-old ${x.sex === 'female' ? 'woman' : 'man'} of ${x.heightCm} cm weighing about ${x.weightKg} kg`)
        .join(', or ')
    : '';
  const faqs: DietFaq[] = [
    {
      question: `Is ${p.kcal} calories a day enough to lose weight?`,
      answer: who
        ? `It depends on how many calories your body burns. A ${DAILY_DEFICIT} kcal daily deficit loses about ${WEEKLY_DEFICIT_KG} kg a week, and ${p.kcal} kcal gives that deficit to ${who}. If you burn more than that, you will lose faster; if you burn less, slower. Check your own number with the free calorie deficit calculator.`
        : `${p.kcal} calories is closer to maintenance or a muscle-gain intake for most people than a fat-loss target. Whether you lose, maintain or gain depends on how much you burn. Check your own number with the free TDEE calculator.`,
    },
    {
      question: `How much protein is in this ${p.kcal} calorie diet plan?`,
      answer: `This ${DIET_LABEL[p.diet].toLowerCase()} plan gives about ${r0(t.protein)} g of protein, ${r0(t.carbs)} g of carbs, ${r0(t.fat)} g of fat and ${r0(t.fiber)} g of fibre a day, computed from the Indian food database used across this site.`,
    },
    {
      question: 'Do the calories include cooking oil?',
      answer: 'Yes. Dal, sabzi, bhurji and the other cooked dishes use home-style values that already include typical cooking oil. If you cook with much more oil or ghee than usual, the day will run higher than the total shown.',
    },
    {
      question: 'Can I swap foods in this plan?',
      answer: 'Yes. Swap like for like: one roti for about three-quarters of a katori of cooked rice, moong dal for masoor dal, or apple for guava. Use the food calorie chart to check the numbers of any swap, and keep the protein foods in place, because they are what keep you full and protect muscle while dieting.',
    },
  ];
  if (other) {
    faqs.push({
      question: `Is there a ${DIET_LABEL[other.diet].toLowerCase()} version of this plan?`,
      answer: `Yes. The ${planTitle(other)} has the same calorie target with ${listJoin(proteinFoods(other))} as the main protein foods, giving about ${r0(other.totals.protein)} g of protein a day.`,
    });
  }
  faqs.push({
    question: 'Should I follow a fixed diet chart or get a personalised plan?',
    answer: 'A fixed chart is a good starting point, but your calories, protein, food preferences, work hours and any medical conditions such as PCOS, thyroid or diabetes change what you should eat. A personalised plan from a coach is built around those details and adjusted every week based on your progress.',
  });
  return faqs;
}
