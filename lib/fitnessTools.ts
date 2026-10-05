// Free fitness calculators (/tools + /tools/[tool]).
//
// The calculator maths lives here as pure functions so the interactive widget
// (components/FitnessToolWidget.tsx) and the server-rendered copy — worked
// examples, reference tables, FAQ answers — use the SAME code. Every number
// quoted in the copy below is computed, never typed by hand, so the text can
// never disagree with what the calculator shows.

export const TOOLS_BASE = 'https://coachhimanshu.com/tools';

export type Sex = 'male' | 'female';

const fmt = (n: number) => Math.round(n).toLocaleString('en-IN');
const round1 = (n: number) => Math.round(n * 10) / 10;

// ─────────────────────────────────────────────────────────────────────────────
// BMI — WHO global cut-offs and the lower Asian Indian cut-offs
// (WHO Asia-Pacific 2000; Misra et al. 2009 consensus statement for Asian Indians)
// ─────────────────────────────────────────────────────────────────────────────
export type BmiStandard = 'indian' | 'who';

export interface BmiBand {
  label: string;
  /** Lower bound, inclusive. */
  min: number;
  tone: 'low' | 'good' | 'watch' | 'high';
}

export const BMI_BANDS: Record<BmiStandard, BmiBand[]> = {
  indian: [
    { label: 'Underweight', min: 0, tone: 'low' },
    { label: 'Normal', min: 18.5, tone: 'good' },
    { label: 'Overweight', min: 23, tone: 'watch' },
    { label: 'Obese', min: 25, tone: 'high' },
  ],
  who: [
    { label: 'Underweight', min: 0, tone: 'low' },
    { label: 'Normal', min: 18.5, tone: 'good' },
    { label: 'Overweight', min: 25, tone: 'watch' },
    { label: 'Obese', min: 30, tone: 'high' },
  ],
};

/** Upper edge of the "Normal" band for each standard. */
export const BMI_NORMAL_MAX: Record<BmiStandard, number> = { indian: 22.9, who: 24.9 };
export const BMI_NORMAL_MIN = 18.5;

export function bmi(weightKg: number, heightCm: number): number {
  const m = heightCm / 100;
  return round1(weightKg / (m * m));
}

export function bmiBand(value: number, standard: BmiStandard): BmiBand {
  const bands = BMI_BANDS[standard];
  return [...bands].reverse().find((b) => value >= b.min) ?? bands[0];
}

/** Healthy weight range (kg) for a height — the weights that give a "Normal" BMI. */
export function healthyWeightRange(heightCm: number, standard: BmiStandard): { min: number; max: number } {
  const m2 = (heightCm / 100) ** 2;
  return { min: round1(BMI_NORMAL_MIN * m2), max: round1(BMI_NORMAL_MAX[standard] * m2) };
}

export function feetInchesToCm(feet: number, inches: number): number {
  return round1((feet * 12 + inches) * 2.54);
}

// ─────────────────────────────────────────────────────────────────────────────
// BMR / TDEE — Mifflin-St Jeor (1990) × standard activity multipliers
// ─────────────────────────────────────────────────────────────────────────────
export function bmr(sex: Sex, weightKg: number, heightCm: number, age: number): number {
  const base = 10 * weightKg + 6.25 * heightCm - 5 * age;
  return Math.round(sex === 'male' ? base + 5 : base - 161);
}

export interface ActivityLevel {
  key: string;
  label: string;
  detail: string;
  factor: number;
}

export const ACTIVITY_LEVELS: ActivityLevel[] = [
  { key: 'sedentary', label: 'Sedentary', detail: 'Desk job, little or no exercise', factor: 1.2 },
  { key: 'light', label: 'Lightly active', detail: 'Light exercise or walking 1–3 days a week', factor: 1.375 },
  { key: 'moderate', label: 'Moderately active', detail: 'Training 3–5 days a week', factor: 1.55 },
  { key: 'very', label: 'Very active', detail: 'Hard training 6–7 days a week', factor: 1.725 },
  { key: 'extra', label: 'Extra active', detail: 'Physical job plus daily hard training', factor: 1.9 },
];

export function activityFactor(key: string): number {
  return ACTIVITY_LEVELS.find((a) => a.key === key)?.factor ?? 1.2;
}

export function tdee(sex: Sex, weightKg: number, heightCm: number, age: number, activityKey: string): number {
  return Math.round(bmr(sex, weightKg, heightCm, age) * activityFactor(activityKey));
}

// ─────────────────────────────────────────────────────────────────────────────
// Calorie deficit — ~7,700 kcal per kg of body fat, with a safety floor
// ─────────────────────────────────────────────────────────────────────────────
export const KCAL_PER_KG_FAT = 7700;
export const DEFICIT_RATES = [0.25, 0.5, 0.75, 1];
/** Commonly used minimum daily intakes for unsupervised dieting. */
export const CALORIE_FLOOR: Record<Sex, number> = { male: 1500, female: 1200 };

export function dailyDeficit(kgPerWeek: number): number {
  return Math.round((kgPerWeek * KCAL_PER_KG_FAT) / 7);
}

export function deficitTarget(maintenance: number, kgPerWeek: number, sex: Sex) {
  const wanted = maintenance - dailyDeficit(kgPerWeek);
  const floor = CALORIE_FLOOR[sex];
  const target = Math.max(wanted, floor);
  const actualDeficit = Math.max(0, maintenance - target);
  return {
    target,
    floored: wanted < floor,
    deficit: actualDeficit,
    /** Expected loss at the target actually set (lower than asked if the floor kicked in). */
    kgPerWeek: Math.round(((actualDeficit * 7) / KCAL_PER_KG_FAT) * 100) / 100,
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// Protein — grams per kg of body weight by goal
// ─────────────────────────────────────────────────────────────────────────────
export interface ProteinGoal {
  key: string;
  label: string;
  min: number;
  max: number;
  basis: string;
}

export const PROTEIN_RDA_PER_KG = 0.83; // ICMR-NIN 2020 RDA for adults

export const PROTEIN_GOALS: ProteinGoal[] = [
  { key: 'sedentary', label: 'Not exercising (basic health)', min: PROTEIN_RDA_PER_KG, max: 1.0, basis: 'ICMR-NIN 2020 RDA of 0.83 g/kg is the minimum' },
  { key: 'active', label: 'General fitness / regular exercise', min: 1.2, max: 1.6, basis: 'Supports recovery from regular training' },
  { key: 'muscle', label: 'Building muscle', min: 1.6, max: 2.2, basis: 'Range supported by strength-training research (ISSN; Morton et al. 2018)' },
  { key: 'fatloss', label: 'Losing fat, keeping muscle', min: 1.6, max: 2.2, basis: 'Higher protein protects muscle and controls hunger in a deficit' },
  { key: 'older', label: 'Older adults (65+)', min: 1.0, max: 1.2, basis: 'PROT-AGE recommendation to slow age-related muscle loss' },
];

export function proteinRange(weightKg: number, goalKey: string): { min: number; max: number } {
  const g = PROTEIN_GOALS.find((p) => p.key === goalKey) ?? PROTEIN_GOALS[0];
  return { min: Math.round(weightKg * g.min), max: Math.round(weightKg * g.max) };
}

// ─────────────────────────────────────────────────────────────────────────────
// Macros — calories from goal, protein per kg, fat 25% of calories, carbs the rest
// ─────────────────────────────────────────────────────────────────────────────
export interface MacroGoal {
  key: string;
  label: string;
  calorieDelta: number;
  proteinPerKg: number;
}

export const MACRO_GOALS: MacroGoal[] = [
  { key: 'lose', label: 'Lose fat', calorieDelta: -500, proteinPerKg: 2.0 },
  { key: 'maintain', label: 'Maintain weight', calorieDelta: 0, proteinPerKg: 1.6 },
  { key: 'gain', label: 'Build muscle', calorieDelta: 300, proteinPerKg: 1.8 },
];
export const MACRO_FAT_SHARE = 0.25;

export function macroTargets(maintenance: number, weightKg: number, goalKey: string, sex: Sex) {
  const goal = MACRO_GOALS.find((g) => g.key === goalKey) ?? MACRO_GOALS[1];
  const calories = Math.max(maintenance + goal.calorieDelta, goal.calorieDelta < 0 ? CALORIE_FLOOR[sex] : 0);
  const protein = Math.round(weightKg * goal.proteinPerKg);
  const fat = Math.round((calories * MACRO_FAT_SHARE) / 9);
  const carbs = Math.max(0, Math.round((calories - protein * 4 - fat * 9) / 4));
  return { calories, protein, fat, carbs };
}

// ─────────────────────────────────────────────────────────────────────────────
// Body fat — US Navy circumference method (Hodgdon & Beckett 1984), metric form
// ─────────────────────────────────────────────────────────────────────────────
export function navyBodyFat(sex: Sex, heightCm: number, neckCm: number, waistCm: number, hipCm = 0): number | null {
  const girth = sex === 'male' ? waistCm - neckCm : waistCm + hipCm - neckCm;
  if (girth <= 0 || heightCm <= 0) return null;
  const density =
    sex === 'male'
      ? 1.0324 - 0.19077 * Math.log10(girth) + 0.15456 * Math.log10(heightCm)
      : 1.29579 - 0.35004 * Math.log10(girth) + 0.221 * Math.log10(heightCm);
  const pct = round1(495 / density - 450);
  return pct > 0 && pct < 70 ? pct : null;
}

export interface BodyFatBand {
  label: string;
  /** Lower bound, inclusive (%). */
  male: number;
  female: number;
  tone: 'low' | 'good' | 'watch' | 'high';
}

// American Council on Exercise (ACE) body-fat categories.
export const BODY_FAT_BANDS: BodyFatBand[] = [
  { label: 'Essential fat', male: 2, female: 10, tone: 'low' },
  { label: 'Athletes', male: 6, female: 14, tone: 'good' },
  { label: 'Fitness', male: 14, female: 21, tone: 'good' },
  { label: 'Average', male: 18, female: 25, tone: 'watch' },
  { label: 'Obese', male: 25, female: 32, tone: 'high' },
];

export function bodyFatBand(pct: number, sex: Sex): BodyFatBand | null {
  return [...BODY_FAT_BANDS].reverse().find((b) => pct >= b[sex]) ?? null;
}

// ─────────────────────────────────────────────────────────────────────────────
// Tool pages — copy, worked examples and reference tables
// ─────────────────────────────────────────────────────────────────────────────
export type ToolSlug =
  | 'bmi-calculator'
  | 'tdee-calculator'
  | 'calorie-deficit-calculator'
  | 'protein-calculator'
  | 'macro-calculator'
  | 'ideal-weight-calculator'
  | 'body-fat-calculator';

export interface ToolFaq { question: string; answer: string; }

export interface ToolTable {
  caption: string;
  headers: string[];
  rows: string[][];
  note?: string;
}

export interface FitnessTool {
  slug: ToolSlug;
  name: string;
  /** One-line description for hub cards and related-tool links. */
  tagline: string;
  metaTitle: string;
  metaDescription: string;
  keywords: string[];
  /** Answer-first paragraph under the H1 (speakable). */
  answer: string;
  /** The formula, one line per row, shown in a monospace block. */
  formulaLines: string[];
  /** Plain-English explanation of the formula. */
  method: string;
  /** A worked example whose numbers come from the functions above. */
  example: string;
  table: ToolTable;
  coachNote: string;
  faqs: ToolFaq[];
  sources: string[];
  related: ToolSlug[];
}

// Reference people used in worked examples.
const MAN = { sex: 'male' as Sex, age: 30, weight: 70, height: 170 };
const WOMAN = { sex: 'female' as Sex, age: 30, weight: 60, height: 160 };
const manBmr = bmr(MAN.sex, MAN.weight, MAN.height, MAN.age);
const manTdee = tdee(MAN.sex, MAN.weight, MAN.height, MAN.age, 'moderate');
const womanBmr = bmr(WOMAN.sex, WOMAN.weight, WOMAN.height, WOMAN.age);
const womanTdee = tdee(WOMAN.sex, WOMAN.weight, WOMAN.height, WOMAN.age, 'light');

const range = (r: { min: number; max: number }) => `${r.min}–${r.max}`;
const kg = (n: number) => n.toFixed(1);
/** Weight range with one decimal on both ends ("53.5–72.0"). */
const kgRange = (r: { min: number; max: number }) => `${kg(r.min)}–${kg(r.max)}`;

/** Height chart rows: 4'10" to 6'2" in 2-inch steps. */
const HEIGHT_CHART = Array.from({ length: 9 }, (_, i) => {
  const totalInches = 58 + i * 2;
  const feet = Math.floor(totalInches / 12);
  const inches = totalInches % 12;
  return { label: `${feet} ft ${inches} in`, cm: feetInchesToCm(feet, inches) };
});

const exampleBmi = bmi(MAN.weight, MAN.height);
const h170Indian = healthyWeightRange(170, 'indian');
const h170Who = healthyWeightRange(170, 'who');
const h5ft6 = feetInchesToCm(5, 6);
const exampleDeficit = deficitTarget(manTdee, 0.5, 'male');
const exampleMacros = macroTargets(manTdee, MAN.weight, 'lose', 'male');
const exampleBodyFatMan = navyBodyFat('male', 170, 38, 85);
const exampleBodyFatWoman = navyBodyFat('female', 160, 32, 75, 96);

export const FITNESS_TOOLS: FitnessTool[] = [
  {
    slug: 'bmi-calculator',
    name: 'BMI Calculator',
    tagline: 'Check your BMI against Indian and WHO cut-offs.',
    metaTitle: 'BMI Calculator for Indians (Asian & WHO Cut-offs)',
    metaDescription:
      'Free BMI calculator for Indian adults. Get your BMI, your category under Asian Indian (23/25) and WHO cut-offs, and your healthy weight range in kg.',
    keywords: ['bmi calculator', 'bmi calculator india', 'bmi calculator for indians', 'bmi chart india', 'normal bmi for indians', 'asian bmi calculator', 'bmi calculator kg cm'],
    answer:
      'BMI (body mass index) is your weight in kilograms divided by your height in metres squared. For Indian adults a normal BMI is 18.5–22.9, overweight starts at 23 and obesity at 25. These cut-offs are lower than the WHO global ones (25 and 30) because Asian Indians carry more body fat, and face diabetes and heart-disease risk, at a lower BMI.',
    formulaLines: ['BMI = weight (kg) ÷ height (m)²'],
    method:
      'The formula is the same for everyone; what differs is how the result is read. This calculator shows your category under both standards: the Asian Indian cut-offs from the WHO Asia-Pacific guidelines and the 2009 Indian consensus statement, and the WHO global cut-offs used in most international charts.',
    example: `A person who weighs ${MAN.weight} kg and is ${MAN.height} cm tall has a BMI of ${MAN.weight} ÷ (1.70 × 1.70) = ${exampleBmi}. That is ${bmiBand(exampleBmi, 'who').label.toLowerCase()} on the WHO scale but ${bmiBand(exampleBmi, 'indian').label.toLowerCase()} on the Asian Indian scale. At ${MAN.height} cm the healthy range is ${kgRange(h170Indian)} kg by Indian cut-offs and ${kgRange(h170Who)} kg by WHO cut-offs.`,
    table: {
      caption: 'BMI categories: Asian Indian vs WHO cut-offs',
      headers: ['Category', 'Asian Indian BMI', 'WHO global BMI'],
      rows: [
        ['Underweight', 'Below 18.5', 'Below 18.5'],
        ['Normal', '18.5–22.9', '18.5–24.9'],
        ['Overweight', '23.0–24.9', '25.0–29.9'],
        ['Obese', '25.0 and above', '30.0 and above'],
      ],
      note: 'For adults aged 18+. Not for children, teenagers or pregnancy.',
    },
    coachNote:
      'BMI is a screening number, not a verdict. It cannot tell muscle from fat, so a lifter can read "overweight" while lean, and a slim person with a soft belly can read "normal" while carrying risky abdominal fat. Pair it with your waist: for Indians, 90 cm or more in men and 80 cm or more in women signals abdominal obesity. If your BMI is 23 or above and your waist is over the line, a modest calorie deficit plus strength training is the fix that works.',
    faqs: [
      {
        question: 'What is a normal BMI for Indians?',
        answer:
          'A normal BMI for Indian adults is 18.5 to 22.9. A BMI of 23 to 24.9 is overweight and 25 or above is obese. These Asian Indian cut-offs are lower than the WHO global cut-offs of 25 (overweight) and 30 (obese) because Indians tend to have more body fat and higher diabetes and heart-disease risk at the same BMI.',
      },
      {
        question: 'How do I calculate my BMI?',
        answer: `Divide your weight in kilograms by your height in metres squared. For example, ${MAN.weight} kg at ${MAN.height} cm is ${MAN.weight} ÷ (1.70 × 1.70) = ${exampleBmi}. If you know your height in feet and inches, convert it to centimetres first: multiply total inches by 2.54.`,
      },
      {
        question: 'Is BMI accurate for people who lift weights?',
        answer:
          'Not always. BMI only uses height and weight, so it cannot separate muscle from fat. Muscular people can land in the overweight band while having low body fat. If you train seriously, check your waist measurement and body-fat percentage alongside BMI.',
      },
      {
        question: 'Is BMI calculated differently for men and women?',
        answer:
          'No. The formula and the adult cut-offs are the same for men and women. Women naturally carry more body fat than men at the same BMI, which is why body-fat percentage charts are sex-specific. BMI charts for adults do not apply to children, teenagers or pregnant women.',
      },
      {
        question: 'My BMI is above 23. What should I do?',
        answer:
          'Start with three things: eat in a small calorie deficit of about 300–500 kcal a day, do strength training two to four times a week, and keep protein high so the weight you lose is fat rather than muscle. Measure your waist as well; for Indians, 90 cm or more in men and 80 cm or more in women adds to the health risk.',
      },
    ],
    sources: [
      'WHO Expert Consultation. Appropriate body-mass index for Asian populations. The Lancet, 2004',
      'Misra A. et al. Consensus statement for diagnosis of obesity, abdominal obesity and the metabolic syndrome for Asian Indians. JAPI, 2009',
      'WHO Western Pacific Region. The Asia-Pacific perspective: redefining obesity and its treatment, 2000',
    ],
    related: ['ideal-weight-calculator', 'body-fat-calculator', 'calorie-deficit-calculator'],
  },
  {
    slug: 'tdee-calculator',
    name: 'TDEE Calculator',
    tagline: 'Find your maintenance calories and BMR.',
    metaTitle: 'TDEE Calculator: Maintenance Calories & BMR',
    metaDescription:
      'Free TDEE calculator. Enter age, sex, height, weight and activity level to get your BMR and maintenance calories with the Mifflin-St Jeor equation.',
    keywords: ['tdee calculator', 'maintenance calorie calculator', 'bmr calculator', 'tdee calculator india', 'how many calories should i eat', 'daily calorie requirement calculator', 'mifflin st jeor calculator'],
    answer:
      'TDEE (total daily energy expenditure) is the number of calories you burn in a day, so eating at your TDEE keeps your weight steady. It is your BMR, the calories your body uses at complete rest, multiplied by an activity factor between 1.2 and 1.9. This calculator uses the Mifflin-St Jeor equation, which comparison studies have found to be the most accurate BMR formula for most adults.',
    formulaLines: [
      'BMR (men)   = 10 × weight (kg) + 6.25 × height (cm) − 5 × age + 5',
      'BMR (women) = 10 × weight (kg) + 6.25 × height (cm) − 5 × age − 161',
      'TDEE = BMR × activity factor',
    ],
    method:
      'BMR covers breathing, circulation and keeping your organs running. The activity factor adds everything else: walking, work, training and digestion. Eat below your TDEE to lose weight and above it to gain.',
    example: `A ${MAN.age}-year-old man, ${MAN.weight} kg and ${MAN.height} cm, has a BMR of ${fmt(manBmr)} kcal. Training 3–5 days a week (factor 1.55), his TDEE is ${fmt(manTdee)} kcal a day. A ${WOMAN.age}-year-old woman, ${WOMAN.weight} kg and ${WOMAN.height} cm, has a BMR of ${fmt(womanBmr)} kcal; lightly active (factor 1.375), her TDEE is ${fmt(womanTdee)} kcal a day.`,
    table: {
      caption: `Activity factors, with TDEE for a ${MAN.age}-year-old man (${MAN.weight} kg, ${MAN.height} cm)`,
      headers: ['Activity level', 'What it means', 'Factor', 'TDEE'],
      rows: ACTIVITY_LEVELS.map((a) => [
        a.label,
        a.detail,
        `× ${a.factor}`,
        `${fmt(tdee(MAN.sex, MAN.weight, MAN.height, MAN.age, a.key))} kcal`,
      ]),
    },
    coachNote:
      'Most people overestimate their activity. If you have a desk job and train three or four times a week, "lightly active" is usually closer to the truth than "moderately active". Treat the result as a starting estimate: eat at that number for two to three weeks, watch your average weight, and adjust by 100–200 kcal if the scale drifts.',
    faqs: [
      {
        question: 'What is TDEE?',
        answer:
          'TDEE stands for total daily energy expenditure: all the calories you burn in 24 hours, including resting metabolism, daily movement, exercise and digesting food. Eating the same number of calories as your TDEE maintains your weight, which is why it is also called your maintenance calories.',
      },
      {
        question: 'How do I calculate my maintenance calories?',
        answer: `Work out your BMR with the Mifflin-St Jeor equation, then multiply by an activity factor. For a ${MAN.age}-year-old man who weighs ${MAN.weight} kg and is ${MAN.height} cm tall, BMR is ${fmt(manBmr)} kcal. If he trains 3–5 days a week, multiply by 1.55 to get maintenance calories of ${fmt(manTdee)} kcal a day.`,
      },
      {
        question: 'What is the difference between BMR and TDEE?',
        answer:
          'BMR (basal metabolic rate) is the energy your body needs at complete rest just to stay alive. TDEE is BMR plus everything you do on top of that: walking, working, exercise and digestion. TDEE is always higher than BMR, typically by 20% to 90% depending on how active you are.',
      },
      {
        question: 'Which activity level should I choose?',
        answer:
          'Pick the level that matches your whole week, not your best day. A desk job with little exercise is sedentary. A desk job with three or four workouts is lightly to moderately active. Very active and extra active suit people who train hard almost daily or do physical work. If you are unsure between two levels, choose the lower one.',
      },
      {
        question: 'How accurate is a TDEE calculator?',
        answer:
          'For most adults the Mifflin-St Jeor equation estimates resting metabolism to within about 10%, and the activity factor adds more uncertainty. Use the number as a starting point, track your average body weight for two to three weeks, and adjust your intake by 100–200 kcal based on what actually happens.',
      },
    ],
    sources: [
      'Mifflin M.D., St Jeor S.T. et al. A new predictive equation for resting energy expenditure in healthy individuals. American Journal of Clinical Nutrition, 1990',
      'Frankenfield D. et al. Comparison of predictive equations for resting metabolic rate in healthy nonobese and obese adults. Journal of the American Dietetic Association, 2005',
    ],
    related: ['calorie-deficit-calculator', 'macro-calculator', 'protein-calculator'],
  },
  {
    slug: 'calorie-deficit-calculator',
    name: 'Calorie Deficit Calculator',
    tagline: 'Daily calories to lose weight at a safe pace.',
    metaTitle: 'Calorie Deficit Calculator for Weight Loss',
    metaDescription:
      'Free calorie deficit calculator. See the daily calories you need to lose 0.25–1 kg a week, with a safety floor and how long your goal will take.',
    keywords: ['calorie deficit calculator', 'weight loss calorie calculator', 'calories to lose weight', 'how many calories to lose 1 kg', 'calorie deficit calculator india', 'weight loss calculator kg'],
    answer: `A calorie deficit means eating fewer calories than you burn. One kilogram of body fat stores roughly ${fmt(KCAL_PER_KG_FAT)} kcal, so a daily deficit of about ${fmt(dailyDeficit(0.5))} kcal loses around 0.5 kg a week. For most people a deficit of 300–500 kcal a day is the sustainable range; this calculator works out your number from your maintenance calories.`,
    formulaLines: [
      'Daily deficit = weekly loss (kg) × 7,700 ÷ 7',
      'Target calories = maintenance calories (TDEE) − daily deficit',
    ],
    method: `Maintenance calories come from the Mifflin-St Jeor equation and your activity level. The calculator will not set a target below ${fmt(CALORIE_FLOOR.female)} kcal for women or ${fmt(CALORIE_FLOOR.male)} kcal for men, the minimums commonly used for dieting without medical supervision. If your chosen pace would go below that, it shows the floor and the slower pace you can expect instead.`,
    example: `A ${MAN.age}-year-old man, ${MAN.weight} kg and ${MAN.height} cm, training 3–5 days a week maintains on ${fmt(manTdee)} kcal. To lose 0.5 kg a week he needs a deficit of ${fmt(dailyDeficit(0.5))} kcal, so his target is ${fmt(exampleDeficit.target)} kcal a day. Losing 5 kg at that pace takes about ${Math.ceil(5 / 0.5)} weeks.`,
    table: {
      caption: `Deficit needed for each rate of loss, with the target for someone who maintains on ${fmt(manTdee)} kcal`,
      headers: ['Weekly loss', 'Daily deficit', 'Target calories', 'Time to lose 5 kg'],
      rows: DEFICIT_RATES.map((r) => {
        const t = deficitTarget(manTdee, r, 'male');
        return [
          `${r} kg`,
          `${fmt(dailyDeficit(r))} kcal`,
          t.floored ? `${fmt(t.target)} kcal (floor)` : `${fmt(t.target)} kcal`,
          `${Math.ceil(5 / t.kgPerWeek)} weeks`,
        ];
      }),
      note: `"(floor)" means the full deficit would go below the ${fmt(CALORIE_FLOOR.male)} kcal minimum for men, so the target is held there and loss is slower. Real-world loss is rarely this linear: water shifts mask fat loss week to week, and maintenance calories fall as you get lighter.`,
    },
    coachNote:
      'Choose the smallest deficit that still gives you progress you can see. A pace of 0.5–1% of your body weight a week keeps energy, training and muscle intact; faster than that and most people rebound. Keep protein at 1.6–2.2 g per kg and lift weights, so the weight you lose is fat. Recalculate after every 4–5 kg lost, because a lighter body burns less.',
    faqs: [
      {
        question: 'How many calories should I eat to lose weight?',
        answer:
          'Eat 300–500 kcal below your maintenance calories. For most people that gives a loss of roughly 0.25–0.5 kg a week, a pace that is easy to sustain and protects muscle. Work out your maintenance calories first, then subtract the deficit.',
      },
      {
        question: 'How big a calorie deficit do I need to lose 1 kg a week?',
        answer: `About ${fmt(dailyDeficit(1))} kcal a day, because 1 kg of body fat stores roughly ${fmt(KCAL_PER_KG_FAT)} kcal. That is an aggressive deficit and only realistic for people with high maintenance calories. For most people 0.5 kg a week, a deficit of about ${fmt(dailyDeficit(0.5))} kcal a day, is the better target.`,
      },
      {
        question: 'Is 1,200 calories a day enough?',
        answer: `${fmt(CALORIE_FLOOR.female)} kcal is the minimum commonly advised for women, and ${fmt(CALORIE_FLOOR.male)} kcal for men, when dieting without medical supervision. Below that it becomes very hard to get enough protein, vitamins and minerals, and muscle loss and fatigue become likely. Most people lose weight well above these floors.`,
      },
      {
        question: 'Why has my weight loss stalled even in a deficit?',
        answer:
          'The common reasons are that your maintenance calories have dropped as you lost weight, portions have crept up without you noticing, or water retention is hiding fat loss on the scale. Recalculate your target after every 4–5 kg lost, weigh food for a week to check your intake, and judge progress on a two-week average rather than a single day.',
      },
      {
        question: 'Will I lose muscle in a calorie deficit?',
        answer:
          'Not much, if you do three things: keep the deficit moderate, eat 1.6–2.2 g of protein per kg of body weight, and keep doing strength training. Crash diets with low protein and no lifting are what cause muscle loss.',
      },
    ],
    sources: [
      'Mifflin M.D., St Jeor S.T. et al. A new predictive equation for resting energy expenditure in healthy individuals. American Journal of Clinical Nutrition, 1990',
      'Hall K.D. et al. Quantification of the effect of energy imbalance on bodyweight. The Lancet, 2011',
      'Harvard Health Publishing, Harvard Medical School. Calorie counting made easy',
    ],
    related: ['tdee-calculator', 'macro-calculator', 'protein-calculator'],
  },
  {
    slug: 'protein-calculator',
    name: 'Protein Calculator',
    tagline: 'Your daily protein target by weight and goal.',
    metaTitle: 'Protein Calculator: Daily Protein Intake by Weight',
    metaDescription:
      'Free protein calculator. Enter your weight and goal to get your daily protein in grams for health, muscle gain or fat loss, based on ICMR-NIN guidelines.',
    keywords: ['protein calculator', 'protein intake calculator', 'how much protein per day', 'protein requirement per kg', 'protein calculator india', 'protein for muscle gain', 'daily protein intake calculator'],
    answer: `Your daily protein need depends on your body weight and goal. The Indian RDA (ICMR-NIN 2020) is ${PROTEIN_RDA_PER_KG} g per kg of body weight, the minimum for a sedentary adult. If you exercise regularly, aim for 1.2–1.6 g per kg; to build muscle or lose fat while keeping muscle, 1.6–2.2 g per kg. For a ${MAN.weight} kg person that is ${Math.round(MAN.weight * PROTEIN_RDA_PER_KG)} g at the minimum and ${range(proteinRange(MAN.weight, 'muscle'))} g for muscle gain.`,
    formulaLines: ['Daily protein (g) = body weight (kg) × grams per kg for your goal'],
    method:
      'Protein targets scale with body weight, not calories. The RDA prevents deficiency; it is not the amount that supports training. Research on people who lift weights shows the benefit for muscle growth levelling off at around 1.6 g per kg on average, with intakes up to 2.2 g per kg useful for some. If you are significantly overweight, use your target weight rather than your current weight, or the number will be inflated.',
    example: `A ${MAN.weight} kg person who trains and wants to build muscle needs ${MAN.weight} × 1.6 to ${MAN.weight} × 2.2 = ${range(proteinRange(MAN.weight, 'muscle'))} g of protein a day. Spread over four meals that is roughly ${Math.round(proteinRange(MAN.weight, 'muscle').min / 4)}–${Math.round(proteinRange(MAN.weight, 'muscle').max / 4)} g per meal. The same person not exercising needs at least ${proteinRange(MAN.weight, 'sedentary').min} g.`,
    table: {
      caption: 'Daily protein (grams) by body weight and goal',
      headers: ['Body weight', 'Minimum (RDA)', 'General fitness', 'Muscle gain / fat loss'],
      rows: [50, 60, 70, 80, 90, 100].map((w) => [
        `${w} kg`,
        `${proteinRange(w, 'sedentary').min} g`,
        `${range(proteinRange(w, 'active'))} g`,
        `${range(proteinRange(w, 'muscle'))} g`,
      ]),
      note: `Minimum = ${PROTEIN_RDA_PER_KG} g/kg (ICMR-NIN 2020). General fitness = 1.2–1.6 g/kg. Muscle gain / fat loss = 1.6–2.2 g/kg.`,
    },
    coachNote:
      'Most Indian diets fall short on protein because meals are built around roti, rice and sabzi, with dal as a side. The fix is to put a protein source at the centre of every meal: paneer, curd, eggs, chicken, fish, soya chunks, tofu, sprouts or a thicker dal. Hit your target from food first; whey is a convenient top-up, not a requirement.',
    faqs: [
      {
        question: 'How much protein do I need per day?',
        answer: `At minimum, ${PROTEIN_RDA_PER_KG} g per kg of body weight, the ICMR-NIN 2020 RDA for Indian adults. That is ${Math.round(60 * PROTEIN_RDA_PER_KG)} g for a 60 kg person and ${Math.round(70 * PROTEIN_RDA_PER_KG)} g for a 70 kg person. If you exercise regularly, 1.2–1.6 g per kg is a better target, and 1.6–2.2 g per kg if you are building muscle or dieting.`,
      },
      {
        question: 'How much protein do I need to build muscle?',
        answer: `Aim for 1.6–2.2 g of protein per kg of body weight each day, alongside progressive strength training. For a ${MAN.weight} kg person that is ${range(proteinRange(MAN.weight, 'muscle'))} g a day. A 2018 meta-analysis found the muscle-building benefit levels off at about 1.6 g per kg on average, so going far beyond 2.2 g per kg adds little.`,
      },
      {
        question: 'Can vegetarians get enough protein from Indian food?',
        answer:
          'Yes. Paneer, curd, milk, soya chunks, tofu, dals, chana, rajma, sprouts and peanuts all contribute, and combining dals with grains gives a complete amino-acid profile. Vegetarians usually need to plan for it, with a protein source in every meal, and many find whey or a plant protein powder a practical top-up.',
      },
      {
        question: 'Is a high-protein diet bad for the kidneys?',
        answer:
          'In healthy adults, intakes in the 1.2–2.2 g per kg range have not been shown to harm the kidneys. People with existing kidney disease are different: they are often advised to limit protein and should follow their doctor’s guidance rather than a calculator.',
      },
      {
        question: 'How should I spread protein across the day?',
        answer:
          'Split it over three or four meals with roughly 20–40 g of protein in each. That is easier to digest and eat than one very large serving, and it keeps muscle repair supplied through the day. Total daily protein matters more than exact timing.',
      },
    ],
    sources: [
      'ICMR-National Institute of Nutrition. Nutrient Requirements for Indians: Recommended Dietary Allowances, 2020',
      'Jäger R. et al. International Society of Sports Nutrition position stand: protein and exercise. JISSN, 2017',
      'Morton R.W. et al. A systematic review, meta-analysis and meta-regression of the effect of protein supplementation on resistance training-induced gains in muscle mass and strength. British Journal of Sports Medicine, 2018',
      'Bauer J. et al. Evidence-based recommendations for optimal dietary protein intake in older people (PROT-AGE). JAMDA, 2013',
    ],
    related: ['macro-calculator', 'tdee-calculator', 'calorie-deficit-calculator'],
  },
  {
    slug: 'macro-calculator',
    name: 'Macro Calculator',
    tagline: 'Protein, carbs and fat targets for your goal.',
    metaTitle: 'Macro Calculator: Protein, Carbs & Fat for Your Goal',
    metaDescription:
      'Free macro calculator. Get your daily calories plus protein, carbs and fat in grams for fat loss, maintenance or muscle gain, from your weight and activity.',
    keywords: ['macro calculator', 'macronutrient calculator', 'macro calculator for weight loss', 'macro calculator india', 'protein carbs fat calculator', 'macros for muscle gain'],
    answer:
      'Macros are the three nutrients that supply calories: protein and carbohydrate at 4 kcal per gram, and fat at 9 kcal per gram. This calculator sets your calories from your maintenance level and goal, fixes protein by body weight, gives fat 25% of calories, and fills the rest with carbs.',
    formulaLines: [
      'Calories = maintenance − 500 (fat loss) · maintenance (maintain) · maintenance + 300 (muscle gain)',
      'Protein (g) = body weight (kg) × 2.0 (fat loss) · 1.6 (maintain) · 1.8 (muscle gain)',
      'Fat (g) = 25% of calories ÷ 9',
      'Carbs (g) = remaining calories ÷ 4',
    ],
    method:
      'There is no single correct macro ratio. Calories decide whether your weight goes up or down, and protein decides how much of that change is muscle. Fat is kept at a quarter of calories to support hormones and vitamin absorption, and carbs take what is left because they fuel training. The fat-loss target never drops below the same safety floor used in the calorie deficit calculator.',
    example: `A ${MAN.age}-year-old man, ${MAN.weight} kg and ${MAN.height} cm, training 3–5 days a week maintains on ${fmt(manTdee)} kcal. For fat loss his target is ${fmt(exampleMacros.calories)} kcal: ${exampleMacros.protein} g protein, ${exampleMacros.fat} g fat and ${exampleMacros.carbs} g carbs.`,
    table: {
      caption: `Macros by goal for a ${MAN.age}-year-old man (${MAN.weight} kg, ${MAN.height} cm, moderately active)`,
      headers: ['Goal', 'Calories', 'Protein', 'Fat', 'Carbs'],
      rows: MACRO_GOALS.map((g) => {
        const m = macroTargets(manTdee, MAN.weight, g.key, 'male');
        return [g.label, `${fmt(m.calories)} kcal`, `${m.protein} g`, `${m.fat} g`, `${m.carbs} g`];
      }),
    },
    coachNote:
      'Hit calories and protein first; those two do most of the work. Carbs and fat can flex by 10–20 g either way to suit how you like to eat, whether that is more rice and roti or more ghee and nuts. If your BMI is above 30, set protein from your target weight rather than your current weight.',
    faqs: [
      {
        question: 'What are macros?',
        answer:
          'Macros, short for macronutrients, are protein, carbohydrate and fat: the nutrients that provide calories. Protein and carbohydrate each provide 4 kcal per gram and fat provides 9 kcal per gram. Counting macros means tracking grams of each rather than calories alone.',
      },
      {
        question: 'What is the best macro split for weight loss?',
        answer:
          'There is no magic ratio. What matters most is a calorie deficit and enough protein, around 1.6–2.2 g per kg of body weight, to protect muscle. After that, keep fat at roughly 20–30% of calories and let carbs fill the remainder. Diets with different carb-to-fat ratios produce similar fat loss when calories and protein are matched.',
      },
      {
        question: 'How does this macro calculator work?',
        answer:
          'It estimates your maintenance calories with the Mifflin-St Jeor equation and your activity level, then adjusts for your goal: 500 kcal less for fat loss, 300 kcal more for muscle gain. Protein is set per kg of body weight, fat at 25% of calories, and carbohydrate takes the remaining calories.',
      },
      {
        question: 'Do I need to hit my macros exactly?',
        answer:
          'No. Landing within about 5–10 g of each target is close enough, and weekly consistency matters more than any single day. Prioritise total calories and protein; carbs and fat can trade off against each other.',
      },
      {
        question: 'Can I hit these macros on a vegetarian Indian diet?',
        answer:
          'Yes, though protein takes planning because many vegetarian protein foods also carry carbs or fat. Build meals around paneer, curd, soya chunks, tofu and thicker dals, and use milk or whey to close the gap. Carbs and fat are easy to reach with roti, rice, fruit, ghee and nuts.',
      },
    ],
    sources: [
      'Mifflin M.D., St Jeor S.T. et al. A new predictive equation for resting energy expenditure in healthy individuals. American Journal of Clinical Nutrition, 1990',
      'Jäger R. et al. International Society of Sports Nutrition position stand: protein and exercise. JISSN, 2017',
      'Institute of Medicine. Dietary Reference Intakes for Energy, Carbohydrate, Fiber, Fat, Fatty Acids, Cholesterol, Protein and Amino Acids, 2005',
    ],
    related: ['tdee-calculator', 'protein-calculator', 'calorie-deficit-calculator'],
  },
  {
    slug: 'ideal-weight-calculator',
    name: 'Ideal Weight Calculator',
    tagline: 'Healthy weight range for your height.',
    metaTitle: 'Ideal Weight Calculator: Healthy Weight for Height (kg)',
    metaDescription:
      'Free ideal weight calculator. Enter your height in cm or feet to see your healthy weight range in kg under Asian Indian and WHO cut-offs, with a full chart.',
    keywords: ['ideal weight calculator', 'ideal weight for height', 'height weight chart', 'height weight chart india', 'ideal body weight calculator', 'healthy weight for height in kg', 'ideal weight for 5 feet 6 inches'],
    answer: `Your ideal weight is a range, not a single number: the weights that give a normal BMI at your height. For Indian adults that means a BMI of ${BMI_NORMAL_MIN}–${BMI_NORMAL_MAX.indian}. At 5 ft 6 in (${h5ft6} cm) the healthy range is ${kgRange(healthyWeightRange(h5ft6, 'indian'))} kg by Asian Indian cut-offs, or ${kgRange(healthyWeightRange(h5ft6, 'who'))} kg by the WHO global cut-offs.`,
    formulaLines: [
      'Lowest healthy weight (kg) = 18.5 × height (m)²',
      'Highest healthy weight (kg) = 22.9 × height (m)²  (Asian Indian)  or  24.9 × height (m)²  (WHO)',
    ],
    method:
      'The range is the BMI formula run in reverse. The Asian Indian upper limit is lower than the WHO one because health risks such as type 2 diabetes begin at a lower BMI in Indians. Where you should sit inside the range depends on your frame and how much muscle you carry.',
    example: `At ${MAN.height} cm, the lowest healthy weight is 18.5 × 1.70 × 1.70 = ${kg(h170Indian.min)} kg. The highest is 22.9 × 1.70 × 1.70 = ${kg(h170Indian.max)} kg by Asian Indian cut-offs, or ${kg(h170Who.max)} kg by WHO cut-offs.`,
    table: {
      caption: 'Height-weight chart: healthy weight range in kg for adults',
      headers: ['Height', 'Height (cm)', 'Asian Indian range', 'WHO range'],
      rows: HEIGHT_CHART.map((h) => [
        h.label,
        `${h.cm.toFixed(1)} cm`,
        `${kgRange(healthyWeightRange(h.cm, 'indian'))} kg`,
        `${kgRange(healthyWeightRange(h.cm, 'who'))} kg`,
      ]),
      note: 'The same range applies to adult men and women. Not for children, teenagers or pregnancy.',
    },
    coachNote:
      'Treat the range as a guide for where the scale should roughly be, then judge by what the weight is made of. Two people of the same height and weight can look and feel completely different depending on muscle. If you lift and sit a little above the range with a lean waist, you do not need to diet down to hit a chart number.',
    faqs: [
      {
        question: 'What is the ideal weight for my height?',
        answer: `It is the range of weights that give a normal BMI at your height. For example, at 5 ft 6 in (${h5ft6} cm) the healthy range is ${kgRange(healthyWeightRange(h5ft6, 'indian'))} kg using Asian Indian cut-offs and ${kgRange(healthyWeightRange(h5ft6, 'who'))} kg using WHO cut-offs. Enter your own height in the calculator for your range.`,
      },
      {
        question: 'Is ideal weight different for men and women?',
        answer:
          'The BMI-based healthy range is the same for adult men and women of the same height. Where you sit within it differs from person to person, depending on frame size and muscle mass rather than sex alone.',
      },
      {
        question: 'Why is the Indian healthy weight range lower than the WHO range?',
        answer:
          'Because Indians tend to carry more body fat, especially around the abdomen, at the same BMI as people of European descent, and risks like type 2 diabetes and heart disease begin at a lower BMI. Indian and Asia-Pacific guidelines therefore set the top of the normal range at a BMI of 22.9 instead of 24.9.',
      },
      {
        question: 'I am muscular and weigh more than the range. Am I overweight?',
        answer:
          'Not necessarily. The range comes from BMI, which cannot tell muscle from fat. If you train with weights, check your waist and body-fat percentage instead. A waist under 90 cm for men or 80 cm for women with a healthy body-fat percentage means the extra weight is likely muscle.',
      },
      {
        question: 'How quickly should I try to reach my ideal weight?',
        answer:
          'A loss of about 0.5–1% of your body weight a week is a safe, sustainable pace for most people. For someone who weighs 80 kg that is 0.4–0.8 kg a week. Faster loss tends to cost muscle and usually rebounds.',
      },
    ],
    sources: [
      'WHO Expert Consultation. Appropriate body-mass index for Asian populations. The Lancet, 2004',
      'Misra A. et al. Consensus statement for diagnosis of obesity, abdominal obesity and the metabolic syndrome for Asian Indians. JAPI, 2009',
    ],
    related: ['bmi-calculator', 'body-fat-calculator', 'calorie-deficit-calculator'],
  },
  {
    slug: 'body-fat-calculator',
    name: 'Body Fat Calculator',
    tagline: 'Estimate body-fat % with a tape measure.',
    metaTitle: 'Body Fat Calculator (US Navy Method, cm)',
    metaDescription:
      'Free body fat calculator using the US Navy tape-measure method. Enter height, neck, waist and hips in cm to estimate your body-fat % and see your category.',
    keywords: ['body fat calculator', 'body fat percentage calculator', 'us navy body fat calculator', 'body fat calculator cm', 'body fat calculator india', 'how to calculate body fat percentage'],
    answer:
      'You can estimate your body-fat percentage with nothing more than a tape measure. The US Navy method uses your height, neck and waist, plus hips for women. A body-fat level of 14–24% for men and 21–31% for women covers the fitness and average categories; 25% or more in men and 32% or more in women is classed as obese.',
    formulaLines: [
      'Men:   495 ÷ (1.0324 − 0.19077 × log10(waist − neck) + 0.15456 × log10(height)) − 450',
      'Women: 495 ÷ (1.29579 − 0.35004 × log10(waist + hip − neck) + 0.22100 × log10(height)) − 450',
      'All measurements in centimetres',
    ],
    method:
      'The method works because waist size tracks body fat while neck size and height track lean frame. Measure the neck just below the Adam’s apple. Men measure the waist at the navel; women at the narrowest point, and the hips at the widest point. Keep the tape level and snug without compressing the skin, and measure relaxed, not sucked in.',
    example: `A man who is 170 cm tall with a 38 cm neck and an 85 cm waist comes out at ${exampleBodyFatMan}% body fat. A woman who is 160 cm tall with a 32 cm neck, 75 cm waist and 96 cm hips comes out at ${exampleBodyFatWoman}%.`,
    table: {
      caption: 'Body-fat percentage categories for men and women',
      headers: ['Category', 'Men', 'Women'],
      rows: BODY_FAT_BANDS.map((b, i) => {
        const next = BODY_FAT_BANDS[i + 1];
        return [
          b.label,
          next ? `${b.male}–${next.male - 1}%` : `${b.male}% and above`,
          next ? `${b.female}–${next.female - 1}%` : `${b.female}% and above`,
        ];
      }),
      note: 'Categories from the American Council on Exercise (ACE).',
    },
    coachNote:
      'A tape-measure estimate can be off by a few percentage points for any one person, so the trend matters more than the number. Measure at the same time of day, in the same way, every two to four weeks. If your weight is steady but your waist is shrinking, you are losing fat and gaining muscle, which the scale alone would never show you.',
    faqs: [
      {
        question: 'What is a healthy body-fat percentage?',
        answer:
          'For men, 14–17% is the fitness range and 18–24% is average; for women, 21–24% is the fitness range and 25–31% is average. Athletes often sit lower. Body fat of 25% or more in men and 32% or more in women is classed as obese on the American Council on Exercise scale.',
      },
      {
        question: 'How does the US Navy body fat method work?',
        answer:
          'It estimates body fat from circumference measurements. For men it uses height, neck and waist; for women, height, neck, waist and hips. A larger waist relative to the neck and height indicates more body fat. The equations were developed by Hodgdon and Beckett at the US Naval Health Research Center in 1984.',
      },
      {
        question: 'How accurate is the tape-measure method?',
        answer:
          'It is a reasonable estimate rather than a precise measurement, and for an individual it can differ from a DEXA scan by a few percentage points. Its strength is repeatability: measured the same way each time, it tracks change reliably, and it needs no equipment beyond a tape.',
      },
      {
        question: 'How do I measure my neck, waist and hips correctly?',
        answer:
          'Measure the neck just below the Adam’s apple with the tape sloping slightly down at the front. Men measure the waist at navel level; women at the narrowest point of the torso. Women measure hips at the widest point of the buttocks. Stand relaxed, keep the tape level and snug but not tight, and take each measurement twice.',
      },
      {
        question: 'Which is better, BMI or body-fat percentage?',
        answer:
          'Body-fat percentage tells you more, because it separates fat from muscle, which BMI cannot. BMI is quicker and good for a first screen. Use both: BMI and waist to check health risk, and body-fat percentage to track whether the weight you gain or lose is fat or muscle.',
      },
    ],
    sources: [
      'Hodgdon J.A., Beckett M.B. Prediction of percent body fat for U.S. Navy men and women from body circumferences and height. Naval Health Research Center, 1984',
      'American Council on Exercise (ACE). Percent body fat norms for men and women',
    ],
    related: ['bmi-calculator', 'ideal-weight-calculator', 'macro-calculator'],
  },
];

export function getAllToolSlugs(): string[] {
  return FITNESS_TOOLS.map((t) => t.slug);
}

export function getToolBySlug(slug: string): FitnessTool | undefined {
  return FITNESS_TOOLS.find((t) => t.slug === slug);
}
