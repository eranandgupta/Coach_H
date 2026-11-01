// Server-rendered catalog for the public /plans SEO page and its Offer schema.
// Prices come from lib/pricing.ts (single source of truth); keep features in sync
// with prisma/ensure-plans.ts. Grouped by the
// way a buyer shops: recorded coaching, live 1:1, and couple/family.

import { formatINR, LOWEST_ELITE_PRICE, LOWEST_PLAN_PRICE, planPrice, planPriceLabel } from '@/lib/pricing';

export interface PlanSpecs {
  video: string;          // exact video access, e.g. 'Gym workout tutorials'
  consultations?: string; // weekly video-call consults, e.g. '4 / month'
  liveSessions?: string;  // live 1:1 sessions, e.g. '12 sessions'
  pauseDays?: string;     // pause allowance, e.g. '7 days'
}

export interface PlanItem {
  name: string;
  price: number;          // INR, numeric — powers Offer schema
  priceLabel: string;     // '₹2,999'
  durationLabel: string;  // '3 Months'
  tagline: string;        // short "for whom / what" line
  popular?: boolean;
  features: string[];
  specs: PlanSpecs;       // structured attributes for the comparison matrix
}

export interface PlanGroup {
  key: string;
  title: string;
  blurb: string;
  plans: PlanItem[];
}

export const PLAN_GROUPS: PlanGroup[] = [
  {
    key: 'recorded',
    title: 'Personalised Coaching',
    blurb:
      'Your own customised workout + diet plan, weekly one-on-one consultations, video tutorials and WhatsApp support. The best value way to transform.',
    plans: [
      {
        name: 'Kickstart Plan',
        price: planPrice('Kickstart Plan'),
        priceLabel: planPriceLabel('Kickstart Plan'),
        durationLabel: '1 Month',
        tagline: 'Try it out — all inclusive',
        specs: { video: 'Gym workout tutorials', consultations: '4 / month' },
        features: [
          'Customised workout plan',
          'Personalised diet plan',
          'Gym workout video tutorials',
          'Weekly 1-on-1 consultation (4/month)',
          'Supplement & lifestyle guidance',
          'WhatsApp support',
          'In-App Chat Support',
          'Habit Tracker',
          'Transformation Log Book',
        ],
      },
      {
        name: 'Consistency Plan',
        price: planPrice('Consistency Plan'),
        priceLabel: planPriceLabel('Consistency Plan'),
        durationLabel: '3 Months',
        tagline: 'Most popular — build the habit',
        popular: true,
        specs: { video: 'Gym workout tutorials', consultations: '4 / month' },
        features: [
          'Customised workout plan',
          'Personalised diet plan',
          'Gym workout video tutorials',
          'Weekly 1-on-1 consultation (4/month)',
          'Supplement & lifestyle guidance',
          'WhatsApp support',
          'In-App Chat Support',
          'Habit Tracker',
          'Transformation Log Book',
        ],
      },
      {
        name: 'Strength Plan',
        price: planPrice('Strength Plan'),
        priceLabel: planPriceLabel('Strength Plan'),
        durationLabel: '6 Months',
        tagline: 'Serious, sustained progress',
        specs: { video: 'Gym workout tutorials', consultations: '6 / month', pauseDays: '7 days' },
        features: [
          'Customised workout plan',
          'Personalised diet plan',
          'Gym workout video tutorials',
          'Weekly 1-on-1 consultation (6/month)',
          'Supplement & lifestyle guidance',
          'WhatsApp support',
          'In-App Chat Support',
          'Pause option (7 days)',
          'FREE RhynoGrip fitness gear',
        ],
      },
      {
        name: 'Mastery Plan',
        price: planPrice('Mastery Plan'),
        priceLabel: planPriceLabel('Mastery Plan'),
        durationLabel: '12 Months',
        tagline: 'A full year, best value/month',
        specs: { video: 'Complete video library', consultations: '6 / month', pauseDays: '15 days' },
        features: [
          'Customised workout plan',
          'Personalised diet plan',
          'Full video library (gym, home, rehab)',
          'Weekly 1-on-1 consultation (6/month)',
          'Supplement & lifestyle guidance',
          'WhatsApp support',
          'In-App Chat Support',
          'Pause option (15 days)',
          'FREE RhynoGrip fitness gear',
        ],
      },
      {
        name: 'Home Workout Plan',
        price: planPrice('Home Workout'),
        priceLabel: planPriceLabel('Home Workout'),
        durationLabel: '3 Months',
        tagline: 'Train at home, minimal equipment',
        specs: { video: 'Home workout tutorials', consultations: '2 / month' },
        features: [
          'Customised home workout plan',
          'Personalised diet plan',
          'Home workout video tutorials',
          '1-on-1 consultation (twice a month)',
          'Supplement & lifestyle guidance',
          'WhatsApp support',
          'In-App Chat Support',
          'Habit Tracker',
          'Transformation Log Book',
        ],
      },
      {
        name: 'Rehabilitation Plan',
        price: planPrice('Rehabilitation Plan'),
        priceLabel: planPriceLabel('Rehabilitation Plan'),
        durationLabel: '3 Months',
        tagline: 'Recover & train around an injury',
        specs: { video: 'Rehab tutorials', consultations: '2 / month' },
        features: [
          'Customised rehabilitation workout',
          'Rehab workout video tutorials',
          '1-on-1 consultation (twice a month)',
          'Supplement & lifestyle guidance',
          'WhatsApp support',
          'In-App Chat Support',
          'Habit Tracker',
          'Transformation Log Book',
        ],
      },
    ],
  },
  {
    key: 'elite',
    title: 'Elite Live 1:1 Personal Training',
    blurb:
      'Real-time, one-on-one online sessions with live form correction — the closest thing to a personal trainer standing next to you, from anywhere in the world.',
    plans: [
      {
        name: 'Elite 1:1 — 12 Sessions',
        price: planPrice('Elite 1:1 - 1 Month (12 Sessions)'),
        priceLabel: planPriceLabel('Elite 1:1 - 1 Month (12 Sessions)'),
        durationLabel: '1 Month',
        tagline: '12 live sessions · 60 min each',
        specs: { video: 'Complete video library', liveSessions: '12 sessions' },
        features: [
          'Live 1:1 personal training',
          'Real-time form correction',
          'Personalised diet plan',
          'Supplement & lifestyle guidance',
          'WhatsApp support',
          'In-App Chat Support',
          'Full video library access',
        ],
      },
      {
        name: 'Elite 1:1 — 24 Sessions',
        price: planPrice('Elite 1:1 - 1 Month (24 Sessions)'),
        priceLabel: planPriceLabel('Elite 1:1 - 1 Month (24 Sessions)'),
        durationLabel: '1 Month',
        tagline: '24 live sessions · 60 min each',
        popular: true,
        specs: { video: 'Complete video library', liveSessions: '24 sessions' },
        features: [
          'Live 1:1 personal training',
          'Real-time form correction',
          'Personalised diet plan',
          'Supplement & lifestyle guidance',
          'WhatsApp support',
          'In-App Chat Support',
          'Full video library access',
        ],
      },
      {
        name: 'Elite 1:1 — 36 Sessions',
        price: planPrice('Elite 1:1 - 3 Months (36 Sessions)'),
        priceLabel: planPriceLabel('Elite 1:1 - 3 Months (36 Sessions)'),
        durationLabel: '3 Months',
        tagline: '36 live sessions · 60 min each',
        specs: { video: 'Complete video library', liveSessions: '36 sessions', pauseDays: '7 days' },
        features: [
          'Live 1:1 personal training',
          'Real-time form correction',
          'Personalised diet plan',
          'Supplement & lifestyle guidance',
          'WhatsApp support',
          'In-App Chat Support',
          'Full video library access',
          'Pause option (7 days)',
          'FREE RhynoGrip fitness gear',
        ],
      },
      {
        name: 'Elite 1:1 — 72 Sessions',
        price: planPrice('Elite 1:1 - 3 Months (72 Sessions)'),
        priceLabel: planPriceLabel('Elite 1:1 - 3 Months (72 Sessions)'),
        durationLabel: '3 Months',
        tagline: '72 live sessions · 60 min each',
        specs: { video: 'Complete video library', liveSessions: '72 sessions', pauseDays: '7 days' },
        features: [
          'Live 1:1 personal training',
          'Real-time form correction',
          'Personalised diet plan',
          'Supplement & lifestyle guidance',
          'WhatsApp support',
          'In-App Chat Support',
          'Full video library access',
          'Pause option (7 days)',
          'FREE RhynoGrip fitness gear',
        ],
      },
    ],
  },
  {
    key: 'couple',
    title: 'Couple & Family Coaching',
    blurb:
      'Two personalised plans, one shared journey. Train together, stay accountable, and pay less per person than coaching individually.',
    plans: [
      {
        name: 'Couple Home Workout',
        price: planPrice('Couple Home Workout Plan'),
        priceLabel: planPriceLabel('Couple Home Workout Plan'),
        durationLabel: '3 Months',
        tagline: 'For 2 · train at home together',
        specs: { video: 'Home workout tutorials', consultations: '2 / month' },
        features: [
          'Individual home workout plan for each',
          'Personalised diet plan for each',
          'Home workout video tutorials',
          '1-on-1 consultation (twice a month)',
          'Supplement & lifestyle guidance',
          'WhatsApp support',
          'In-App Chat Support',
        ],
      },
      {
        name: 'Couple Rehabilitation',
        price: planPrice('Couple Rehabilitation Plan'),
        priceLabel: planPriceLabel('Couple Rehabilitation Plan'),
        durationLabel: '3 Months',
        tagline: 'For 2 · recover together',
        specs: { video: 'Rehab tutorials', consultations: '2 / month' },
        features: [
          'Individual rehab workouts for each',
          'Rehab workout video tutorials',
          '1-on-1 consultation (twice a month)',
          'Supplement & lifestyle guidance',
          'WhatsApp support',
          'In-App Chat Support',
        ],
      },
      {
        name: 'Couple Strength',
        price: planPrice('Couple Strength'),
        priceLabel: planPriceLabel('Couple Strength'),
        durationLabel: '6 Months',
        tagline: 'For 2 · best-selling couple plan',
        popular: true,
        specs: { video: 'Gym workout tutorials', consultations: '6 / month', pauseDays: '7 days' },
        features: [
          'Individual workout plans for both',
          'Customised meal plans for both',
          'Gym workout video tutorials',
          'Weekly 1-on-1 consultation (6/month)',
          'Supplement & lifestyle guidance',
          'WhatsApp support',
          'In-App Chat Support',
          'FREE RhynoGrip fitness gear',
        ],
      },
      {
        name: 'Couple Mastery',
        price: planPrice('Couple Mastery'),
        priceLabel: planPriceLabel('Couple Mastery'),
        durationLabel: '12 Months',
        tagline: 'For 2 · a full year together',
        specs: { video: 'Complete video library', consultations: '6 / month', pauseDays: '15 days' },
        features: [
          'Individual workout & diet plans for both',
          'Full video library (gym, home, rehab)',
          'Weekly 1-on-1 consultation (6/month)',
          'Supplement & lifestyle guidance',
          'WhatsApp support',
          'In-App Chat Support',
          'Pause option (15 days)',
          'FREE RhynoGrip fitness gear',
        ],
      },
      {
        name: 'Elite 1:1 Couple — 12 Sessions',
        price: planPrice('Elite 1:1 Couple - 1 Month (12 Sessions)'),
        priceLabel: planPriceLabel('Elite 1:1 Couple - 1 Month (12 Sessions)'),
        durationLabel: '1 Month',
        tagline: 'For 2 · one shared live slot',
        specs: { video: 'Complete video library', liveSessions: '12 sessions' },
        features: [
          'Live 1:1 coaching for both partners',
          'One shared slot — both attend together',
          'Personalised diet plan for each',
          '60 min per session',
          'WhatsApp support',
          'In-App Chat Support',
          'Full video library access',
        ],
      },
      {
        name: 'Elite 1:1 Couple — 24 Sessions',
        price: planPrice('Elite 1:1 Couple - 1 Month (24 Sessions)'),
        priceLabel: planPriceLabel('Elite 1:1 Couple - 1 Month (24 Sessions)'),
        durationLabel: '1 Month',
        tagline: 'For 2 · one shared live slot',
        specs: { video: 'Complete video library', liveSessions: '24 sessions' },
        features: [
          'Live 1:1 coaching for both partners',
          'One shared slot — both attend together',
          'Personalised diet plan for each',
          '60 min per session',
          'WhatsApp support',
          'In-App Chat Support',
          'Full video library access',
        ],
      },
      {
        name: 'Elite 1:1 Couple — 36 Sessions',
        price: planPrice('Elite 1:1 Couple - 3 Months (36 Sessions)'),
        priceLabel: planPriceLabel('Elite 1:1 Couple - 3 Months (36 Sessions)'),
        durationLabel: '3 Months',
        tagline: 'For 2 · one shared live slot',
        specs: { video: 'Complete video library', liveSessions: '36 sessions', pauseDays: '7 days' },
        features: [
          'Live 1:1 coaching for both partners',
          'One shared slot — both attend together',
          'Personalised diet plan for each',
          '60 min per session',
          'WhatsApp support',
          'In-App Chat Support',
          'Full video library access',
          'Pause option (7 days)',
          'FREE RhynoGrip fitness gear',
        ],
      },
      {
        name: 'Elite 1:1 Couple — 72 Sessions',
        price: planPrice('Elite 1:1 Couple - 3 Months (72 Sessions)'),
        priceLabel: planPriceLabel('Elite 1:1 Couple - 3 Months (72 Sessions)'),
        durationLabel: '3 Months',
        tagline: 'For 2 · one shared live slot',
        specs: { video: 'Complete video library', liveSessions: '72 sessions', pauseDays: '7 days' },
        features: [
          'Live 1:1 coaching for both partners',
          'One shared slot — both attend together',
          'Personalised diet plan for each',
          '60 min per session',
          'WhatsApp support',
          'In-App Chat Support',
          'Full video library access',
          'Pause option (7 days)',
          'FREE RhynoGrip fitness gear',
        ],
      },
    ],
  },
];

// Every plan flattened — used for AggregateOffer low/high price + count.
export const ALL_PLANS: PlanItem[] = PLAN_GROUPS.flatMap((g) => g.plans);

// ─────────────────────────────────────────────────────────────────────────────
// Side-by-side comparison matrix. Text rows show a per-plan value (e.g. the exact
// video access, consultation count, or pause days); boolean rows show a tick or
// dash. Derived from each plan's structured specs + advertised features.
// ─────────────────────────────────────────────────────────────────────────────
export interface CompareRow {
  label: string;
  type: 'text' | 'bool';
  values: (string | boolean)[];
}

function planHas(plan: PlanItem, keywords: string[]): boolean {
  const hay = plan.features.join(' | ').toLowerCase();
  return keywords.some((k) => hay.includes(k));
}

function isCouplePlan(plan: PlanItem): boolean {
  return /couple/i.test(plan.name) || /for 2/i.test(plan.tagline);
}

export function comparePlans(plans: PlanItem[]): CompareRow[] {
  const boolRow = (label: string, keywords: string[]): CompareRow => ({
    label,
    type: 'bool',
    values: plans.map((p) => planHas(p, keywords)),
  });
  const textRow = (label: string, pick: (p: PlanItem) => string | undefined): CompareRow => ({
    label,
    type: 'text',
    values: plans.map((p) => pick(p) ?? ''),
  });

  return [
    textRow('Price', (p) => p.priceLabel),
    textRow('Duration', (p) => p.durationLabel),
    textRow('For', (p) => (isCouplePlan(p) ? '2 people' : '1 person')),
    boolRow('Personalised workout plan', ['workout plan', 'workout plans']),
    boolRow('Personalised diet plan', ['diet plan', 'diet plans', 'meal plan']),
    textRow('Exercise video tutorials / library', (p) => p.specs.video),
    textRow('Weekly 1-on-1 consultations', (p) => p.specs.consultations),
    textRow('Live 1:1 training sessions', (p) => p.specs.liveSessions),
    boolRow('Supplement guidance', ['supplement']),
    boolRow('WhatsApp support', ['whatsapp']),
    boolRow('In-app chat support', ['in-app chat']),
    boolRow('Habit tracker', ['habit tracker']),
    boolRow('Transformation log book', ['log book']),
    textRow('Pause option', (p) => p.specs.pauseDays),
    boolRow('Free RhynoGrip fitness gear', ['rhynogrip']),
  ];
}

export const PLAN_FAQS: { question: string; answer: string }[] = [
  {
    question: 'How much does online fitness coaching with Coach Himanshu cost?',
    answer:
      `Personalised recorded coaching starts at ${formatINR(LOWEST_PLAN_PRICE)} for the 1-month Kickstart Plan, with 3, 6, and 12-month plans offering better value per month. Live 1-on-1 Elite personal training starts at ${formatINR(LOWEST_ELITE_PRICE)} for 12 sessions, and couple plans start at ${planPriceLabel('Couple Home Workout Plan')} for two people. Every plan includes a customised workout and diet plan plus WhatsApp support.`,
  },
  {
    question: 'What is the difference between recorded coaching and Elite 1:1?',
    answer:
      'With personalised (recorded) coaching you follow your custom workout and diet plan on your own schedule with video tutorials, weekly one-on-one consultations, and WhatsApp support. Elite 1:1 adds live, real-time online personal training sessions where Coach Himanshu trains you directly and corrects your form as you go. Elite is ideal if you want maximum guidance and accountability.',
  },
  {
    question: 'Can my partner and I train together on one plan?',
    answer:
      `Yes. Couple and family plans give each person their own personalised workout and diet plan while you share the journey and accountability — and they cost less per person than two individual plans. Couple plans start at ${planPriceLabel('Couple Home Workout Plan')} for two people, with home, strength, mastery, rehabilitation, and live Elite 1:1 couple options available.`,
  },
  {
    question: 'Do I need a gym, or can I train at home?',
    answer:
      'Both options are available. Home Workout and Couple Home Workout plans are built for training at home with minimal equipment, while gym-based plans use whatever equipment you have access to. Every plan comes with video tutorials so your form is correct from day one.',
  },
  {
    question: 'Is there a free trial or free way to get started?',
    answer:
      'Yes. You can take the free fitness assessment or start a free consultation on WhatsApp with no payment required. It helps Coach Himanshu understand your goals, lifestyle, and preferences and recommend the right plan before you commit.',
  },
  {
    question: 'Can I get coaching if I live outside India?',
    answer:
      'Yes. Coaching is fully online and Coach Himanshu works with clients across the world, including NRIs and international clients in the USA, UK, Canada, UAE, Australia, Singapore, and more. Sessions and support are scheduled around your timezone.',
  },
];
