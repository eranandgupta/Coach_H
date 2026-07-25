// Server-rendered catalog for the public /plans SEO page and its Offer schema.
// Mirrors the active plans seeded in prisma/ensure-plans.ts — keep prices and
// features in sync with that file (it is the DB source of truth). Grouped by the
// way a buyer shops: recorded coaching, live 1:1, and couple/family.

export interface PlanItem {
  name: string;
  price: number;          // INR, numeric — powers Offer schema
  priceLabel: string;     // '₹2,499'
  durationLabel: string;  // '3 Months'
  tagline: string;        // short "for whom / what" line
  popular?: boolean;
  features: string[];
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
        price: 1099,
        priceLabel: '₹1,099',
        durationLabel: '1 Month',
        tagline: 'Try it out — all inclusive',
        features: [
          'Customised workout plan',
          'Personalised diet plan',
          'Gym workout video tutorials',
          'Weekly 1-on-1 consultation (4/month)',
          'Supplement & lifestyle guidance',
          'WhatsApp support',
          'Free Habit Tracker',
        ],
      },
      {
        name: 'Consistency Plan',
        price: 2499,
        priceLabel: '₹2,499',
        durationLabel: '3 Months',
        tagline: 'Most popular — build the habit',
        popular: true,
        features: [
          'Customised workout plan',
          'Personalised diet plan',
          'Gym workout video tutorials',
          'Weekly 1-on-1 consultation (4/month)',
          'Supplement & lifestyle guidance',
          'WhatsApp support',
          'Free Habit Tracker',
        ],
      },
      {
        name: 'Strength Plan',
        price: 4299,
        priceLabel: '₹4,299',
        durationLabel: '6 Months',
        tagline: 'Serious, sustained progress',
        features: [
          'Customised workout plan',
          'Personalised diet plan',
          'Gym workout video tutorials',
          'Weekly 1-on-1 consultation (6/month)',
          'Supplement & lifestyle guidance',
          'WhatsApp support',
          'Pause option (7 days)',
          'FREE RhynoGrip fitness gear',
        ],
      },
      {
        name: 'Mastery Plan',
        price: 8999,
        priceLabel: '₹8,999',
        durationLabel: '12 Months',
        tagline: 'A full year, best value/month',
        features: [
          'Customised workout plan',
          'Personalised diet plan',
          'Full video library (gym, home, rehab)',
          'Weekly 1-on-1 consultation (6/month)',
          'Supplement & lifestyle guidance',
          'WhatsApp support',
          'Pause option (15 days)',
          'FREE RhynoGrip fitness gear',
        ],
      },
      {
        name: 'Home Workout Plan',
        price: 2199,
        priceLabel: '₹2,199',
        durationLabel: '3 Months',
        tagline: 'Train at home, minimal equipment',
        features: [
          'Customised home workout plan',
          'Personalised diet plan',
          'Home workout video tutorials',
          '1-on-1 consultation (twice a month)',
          'Supplement & lifestyle guidance',
          'WhatsApp support',
          'Free Habit Tracker',
        ],
      },
      {
        name: 'Rehabilitation Plan',
        price: 2999,
        priceLabel: '₹2,999',
        durationLabel: '3 Months',
        tagline: 'Recover & train around an injury',
        features: [
          'Customised rehabilitation workout',
          'Rehab workout video tutorials',
          '1-on-1 consultation (twice a month)',
          'Supplement & lifestyle guidance',
          'WhatsApp support',
          'Free Habit Tracker',
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
        price: 7499,
        priceLabel: '₹7,499',
        durationLabel: '1 Month',
        tagline: '12 live sessions · 60 min each',
        features: [
          'Live 1:1 personal training',
          'Real-time form correction',
          'Personalised diet plan',
          'Supplement & lifestyle guidance',
          'WhatsApp support',
          'Full video library access',
        ],
      },
      {
        name: 'Elite 1:1 — 24 Sessions',
        price: 11999,
        priceLabel: '₹11,999',
        durationLabel: '1 Month',
        tagline: '24 live sessions · 60 min each',
        popular: true,
        features: [
          'Live 1:1 personal training',
          'Real-time form correction',
          'Personalised diet plan',
          'Supplement & lifestyle guidance',
          'WhatsApp support',
          'Full video library access',
        ],
      },
      {
        name: 'Elite 1:1 — 36 Sessions',
        price: 18999,
        priceLabel: '₹18,999',
        durationLabel: '3 Months',
        tagline: '36 live sessions · 60 min each',
        features: [
          'Live 1:1 personal training',
          'Real-time form correction',
          'Personalised diet plan',
          'Supplement & lifestyle guidance',
          'WhatsApp support',
          'Full video library access',
          'Pause option (7 days)',
          'FREE RhynoGrip fitness gear',
        ],
      },
      {
        name: 'Elite 1:1 — 72 Sessions',
        price: 29999,
        priceLabel: '₹29,999',
        durationLabel: '3 Months',
        tagline: '72 live sessions · 60 min each',
        features: [
          'Live 1:1 personal training',
          'Real-time form correction',
          'Personalised diet plan',
          'Supplement & lifestyle guidance',
          'WhatsApp support',
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
        price: 3799,
        priceLabel: '₹3,799',
        durationLabel: '3 Months',
        tagline: 'For 2 · train at home together',
        features: [
          'Individual home workout plan for each',
          'Personalised diet plan for each',
          'Home workout video tutorials',
          '1-on-1 consultation (twice a month)',
          'Supplement & lifestyle guidance',
          'WhatsApp support',
        ],
      },
      {
        name: 'Couple Rehabilitation',
        price: 5299,
        priceLabel: '₹5,299',
        durationLabel: '3 Months',
        tagline: 'For 2 · recover together',
        features: [
          'Individual rehab workouts for each',
          'Rehab workout video tutorials',
          '1-on-1 consultation (twice a month)',
          'Supplement & lifestyle guidance',
          'WhatsApp support',
        ],
      },
      {
        name: 'Couple Strength',
        price: 7999,
        priceLabel: '₹7,999',
        durationLabel: '6 Months',
        tagline: 'For 2 · best-selling couple plan',
        popular: true,
        features: [
          'Individual workout plans for both',
          'Customised meal plans for both',
          'Gym workout video tutorials',
          'Weekly 1-on-1 consultation (6/month)',
          'Supplement & lifestyle guidance',
          'WhatsApp support',
          'FREE RhynoGrip fitness gear',
        ],
      },
      {
        name: 'Couple Mastery',
        price: 15999,
        priceLabel: '₹15,999',
        durationLabel: '12 Months',
        tagline: 'For 2 · a full year together',
        features: [
          'Individual workout & diet plans for both',
          'Full video library (gym, home, rehab)',
          'Weekly 1-on-1 consultation (6/month)',
          'Supplement & lifestyle guidance',
          'WhatsApp support',
          'Pause option (15 days)',
          'FREE RhynoGrip fitness gear',
        ],
      },
      {
        name: 'Elite 1:1 Couple — 12 Sessions',
        price: 11999,
        priceLabel: '₹11,999',
        durationLabel: '1 Month',
        tagline: 'For 2 · one shared live slot',
        features: [
          'Live 1:1 coaching for both partners',
          'One shared slot — both attend together',
          'Personalised diet plan for each',
          '60 min per session',
          'WhatsApp support',
          'Full video library access',
        ],
      },
      {
        name: 'Elite 1:1 Couple — 36 Sessions',
        price: 28999,
        priceLabel: '₹28,999',
        durationLabel: '3 Months',
        tagline: 'For 2 · one shared live slot',
        features: [
          'Live 1:1 coaching for both partners',
          'One shared slot — both attend together',
          'Personalised diet plan for each',
          '60 min per session',
          'WhatsApp support',
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
// Side-by-side comparison matrix. Each row is one comparable attribute; text
// rows (price/duration/people) show a value, boolean rows show a tick or dash.
// Derived from each plan's advertised features so the matrix stays in sync with
// what the cards show.
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

  return [
    { label: 'Price', type: 'text', values: plans.map((p) => p.priceLabel) },
    { label: 'Duration', type: 'text', values: plans.map((p) => p.durationLabel) },
    { label: 'For', type: 'text', values: plans.map((p) => (isCouplePlan(p) ? '2 people' : '1 person')) },
    boolRow('Personalised workout plan', ['workout plan', 'workout plans']),
    boolRow('Personalised diet plan', ['diet plan', 'diet plans', 'meal plan']),
    boolRow('Exercise video tutorials / library', ['video']),
    boolRow('Weekly 1-on-1 consultations', ['consultation']),
    boolRow('Live 1:1 training sessions', ['live 1:1', 'live 1-on-1', 'personal training', 'per session']),
    boolRow('Supplement guidance', ['supplement']),
    boolRow('WhatsApp support', ['whatsapp']),
    boolRow('Pause option', ['pause']),
    boolRow('Free RhynoGrip fitness gear', ['rhynogrip']),
  ];
}

export const PLAN_FAQS: { question: string; answer: string }[] = [
  {
    question: 'How much does online fitness coaching with Coach Himanshu cost?',
    answer:
      'Personalised recorded coaching starts at ₹1,099 for the 1-month Kickstart Plan, with 3, 6, and 12-month plans offering better value per month. Live 1-on-1 Elite personal training starts at ₹7,499 for 12 sessions, and couple plans start at ₹3,799 for two people. Every plan includes a customised workout and diet plan plus WhatsApp support.',
  },
  {
    question: 'What is the difference between recorded coaching and Elite 1:1?',
    answer:
      'With personalised (recorded) coaching you follow your custom workout and diet plan on your own schedule with video tutorials, weekly one-on-one consultations, and WhatsApp support. Elite 1:1 adds live, real-time online personal training sessions where Coach Himanshu trains you directly and corrects your form as you go. Elite is ideal if you want maximum guidance and accountability.',
  },
  {
    question: 'Can my partner and I train together on one plan?',
    answer:
      'Yes. Couple and family plans give each person their own personalised workout and diet plan while you share the journey and accountability — and they cost less per person than two individual plans. Couple plans start at ₹3,799 for two people, with home, strength, mastery, rehabilitation, and live Elite 1:1 couple options available.',
  },
  {
    question: 'Do I need a gym, or can I train at home?',
    answer:
      'Both options are available. Home Workout and Couple Home Workout plans are built for training at home with minimal equipment, while gym-based plans use whatever equipment you have access to. Every plan comes with video tutorials so your form is correct from day one.',
  },
  {
    question: 'Is there a free trial or free way to get started?',
    answer:
      'Yes. You can take the free fitness assessment with no payment required. It helps Coach Himanshu understand your goals, lifestyle, and preferences and recommend the right plan before you commit.',
  },
  {
    question: 'Can I get coaching if I live outside India?',
    answer:
      'Yes. Coaching is fully online and Coach Himanshu works with clients across the world, including NRIs and international clients in the USA, UK, Canada, UAE, Australia, Singapore, and more. Sessions and support are scheduled around your timezone.',
  },
];
