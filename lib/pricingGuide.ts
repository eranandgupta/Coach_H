// Data for the /personal-trainer-cost-india pricing guide. Every rupee figure on that
// page (per month, per session, couple savings, ranges) is computed here from
// lib/plans.ts, so a price change there flows through automatically and the copy can
// never quote a stale number. The only market figure not from our own catalog is the
// in-person metro range, which matches the one already used across the 1:1 cluster.

import { PLAN_GROUPS, type PlanItem } from '@/lib/plans';

export const COST_GUIDE_URL = 'https://coachhimanshu.com/personal-trainer-cost-india';
// Date the current price list took effect — shown on the page and used as dateModified.
export const PRICES_UPDATED = '2026-10-15';
export const PRICES_UPDATED_LABEL = '15 October 2026';
export const IN_PERSON_METRO_RANGE = '₹15,000–₹40,000+';

export const inr = (n: number) => `₹${Math.round(n).toLocaleString('en-IN')}`;

function months(p: PlanItem): number {
  return parseInt(p.durationLabel, 10) || 1;
}
function sessions(p: PlanItem): number | null {
  const n = p.specs.liveSessions ? parseInt(p.specs.liveSessions, 10) : NaN;
  return Number.isFinite(n) ? n : null;
}
function isCouple(p: PlanItem): boolean {
  return /couple/i.test(p.name);
}

export interface CostRow {
  name: string;
  price: number;
  durationLabel: string;
  perMonth: number;
  sessions: number | null;
  perSession: number | null;
  sessionsPerWeek: number | null;
  popular?: boolean;
}

function toRow(p: PlanItem): CostRow {
  const m = months(p);
  const s = sessions(p);
  return {
    name: p.name,
    price: p.price,
    durationLabel: p.durationLabel,
    perMonth: p.price / m,
    sessions: s,
    perSession: s ? p.price / s : null,
    // ~4.33 weeks per month
    sessionsPerWeek: s ? Math.round(s / (m * 4.33)) : null,
    popular: p.popular,
  };
}

const group = (key: string) => PLAN_GROUPS.find((g) => g.key === key)?.plans ?? [];

export const COACHING_ROWS: CostRow[] = group('recorded').filter((p) => !isCouple(p)).map(toRow);
export const LIVE_ROWS: CostRow[] = group('elite').filter((p) => !isCouple(p)).map(toRow);

// Couple plans next to what two separate individual plans would cost.
export interface CoupleRow {
  name: string;
  price: number;
  durationLabel: string;
  perPerson: number;
  twoSingles: number;
  savePct: number;
  shared: boolean; // live couple plans share one session slot
}

const allPlans = PLAN_GROUPS.flatMap((g) => g.plans);
// 'Couple Strength' → 'Strength Plan'; 'Elite 1:1 Couple — 24 Sessions' → 'Elite 1:1 — 24 Sessions'
function singleFor(couple: PlanItem): PlanItem | undefined {
  const base = couple.name.replace(/Couple\s*/i, '').replace(/\s+—/, ' —').trim();
  return allPlans.find(
    (p) => !isCouple(p) && (p.name === base || p.name === `${base} Plan` || p.name.replace(/ Plan$/, '') === base),
  );
}

export const COUPLE_ROWS: CoupleRow[] = allPlans
  .filter(isCouple)
  .map((c) => {
    const single = singleFor(c);
    if (!single) return null;
    const twoSingles = single.price * 2;
    return {
      name: c.name,
      price: c.price,
      durationLabel: c.durationLabel,
      perPerson: c.price / 2,
      twoSingles,
      savePct: Math.round(((twoSingles - c.price) / twoSingles) * 100),
      shared: /elite/i.test(c.name),
    };
  })
  .filter((r): r is CoupleRow => r !== null);

const min = (xs: number[]) => Math.min(...xs);
const max = (xs: number[]) => Math.max(...xs);

export const SUMMARY = {
  coachingFrom: min(COACHING_ROWS.map((r) => r.price)),
  coachingTo: max(COACHING_ROWS.map((r) => r.price)),
  coachingMonthLow: min(COACHING_ROWS.map((r) => r.perMonth)),
  coachingMonthHigh: max(COACHING_ROWS.map((r) => r.perMonth)),
  liveFrom: min(LIVE_ROWS.map((r) => r.price)),
  liveTo: max(LIVE_ROWS.map((r) => r.price)),
  sessionLow: min(LIVE_ROWS.map((r) => r.perSession ?? Infinity)),
  sessionHigh: max(LIVE_ROWS.map((r) => r.perSession ?? 0)),
  coupleFrom: min(COUPLE_ROWS.map((r) => r.price)),
  coupleSaveLow: min(COUPLE_ROWS.map((r) => r.savePct)),
  coupleSaveHigh: max(COUPLE_ROWS.map((r) => r.savePct)),
};

const by = (rows: CostRow[], n: number | null) => rows.find((r) => r.sessions === n);
const live12 = by(LIVE_ROWS, 12);
const live72 = by(LIVE_ROWS, 72);
const kick = COACHING_ROWS.find((r) => r.name.startsWith('Kickstart'));
const mastery = COACHING_ROWS.find((r) => r.name.startsWith('Mastery'));

// "Which plan fits my budget" — each pick is reasoned from the computed numbers.
export const BUDGET_PICKS: { budget: string; pick: string; href: string; why: string }[] = [
  {
    budget: `About ${inr(SUMMARY.coachingMonthLow)} a month`,
    pick: 'Strength, Mastery or Home Workout plan',
    href: '/plans',
    why: `Custom workout and Indian diet plan, one-on-one consultations (weekly on gym plans) and WhatsApp support. The 6-month, 12-month and home plans each work out to about ${inr(SUMMARY.coachingMonthLow)} a month.`,
  },
  {
    budget: 'Want to try it first',
    pick: kick ? `Kickstart Plan (${inr(kick.price)}, 1 month)` : 'Kickstart Plan',
    href: '/plans',
    why: 'The shortest commitment. Everything in personalised coaching for one month, so you can see how you like being coached before signing up for longer.',
  },
  {
    budget: 'Best value for a full year',
    pick: mastery ? `Mastery Plan (${inr(mastery.price)}, 12 months)` : 'Mastery Plan',
    href: '/plans',
    why: mastery
      ? `Works out to ${inr(mastery.perMonth)} a month, adds the full video library (gym, home and rehab) and a 15-day pause.`
      : 'Lowest cost per month with the full video library.',
  },
  {
    budget: 'Want a trainer watching every rep',
    pick: live12 ? `Live 1:1, 12 sessions (${inr(live12.price)})` : 'Live 1:1, 12 sessions',
    href: '/online-personal-trainer',
    why: live12
      ? `About ${live12.sessionsPerWeek} live 60-minute sessions a week for a month, at ${inr(live12.perSession ?? 0)} a session, with real-time form correction and a diet plan.`
      : 'Live 60-minute sessions with real-time form correction.',
  },
  {
    budget: 'Lowest price per live session',
    pick: live72 ? `Live 1:1, 72 sessions (${inr(live72.price)})` : 'Live 1:1, 72 sessions',
    href: '/online-personal-trainer',
    why: live72
      ? `${inr(live72.perSession ?? 0)} a session, about ${live72.sessionsPerWeek} sessions a week over 3 months. Built for serious transformations.`
      : 'The lowest per-session price.',
  },
];

export interface CostFaq {
  question: string;
  answer: string;
}

export const COST_FAQS: CostFaq[] = [
  {
    question: 'How much does a personal trainer cost in India in 2026?',
    answer: `An in-person personal trainer in Indian metros typically costs ${IN_PERSON_METRO_RANGE} a month. Online coaching costs far less: with Coach Himanshu, personalised online coaching (custom workout and diet plan, one-on-one consultations, WhatsApp support) costs ${inr(SUMMARY.coachingFrom)} to ${inr(SUMMARY.coachingTo)}, about ${inr(SUMMARY.coachingMonthLow)}–${inr(SUMMARY.coachingMonthHigh)} a month, and live 1-on-1 online personal training costs ${inr(SUMMARY.liveFrom)} to ${inr(SUMMARY.liveTo)}.`,
  },
  {
    question: 'How much does online personal training cost per session in India?',
    answer: `Live 1-on-1 online sessions with Coach Himanshu cost between ${inr(SUMMARY.sessionLow)} and ${inr(SUMMARY.sessionHigh)} per 60-minute session, depending on the package. The 12-session package works out to ${inr(SUMMARY.sessionHigh)} a session and the 72-session package to ${inr(SUMMARY.sessionLow)} a session. Every package also includes a personalised Indian diet plan, the full video library and WhatsApp support.`,
  },
  {
    question: 'Is online coaching cheaper than a gym personal trainer?',
    answer: `Yes. Live online 1:1 training starts at ${inr(SUMMARY.liveFrom)} for 12 sessions, compared with ${IN_PERSON_METRO_RANGE} a month for in-person training in metros, and you save the commute. If you do not need a trainer on every session, personalised online coaching costs about ${inr(SUMMARY.coachingMonthLow)}–${inr(SUMMARY.coachingMonthHigh)} a month and still gives you a custom workout and diet plan with regular one-on-one check-ins.`,
  },
  {
    question: 'What is the cheapest plan with Coach Himanshu?',
    answer: `The Kickstart Plan at ${inr(SUMMARY.coachingFrom)} for one month is the lowest entry price. For the lowest cost per month, the 6-month Strength Plan, 12-month Mastery Plan and 3-month Home Workout Plan each work out to about ${inr(SUMMARY.coachingMonthLow)} a month. You can also start with a free consultation and the free fitness assessment before paying anything.`,
  },
  {
    question: 'Do couples get a discount?',
    answer: `Yes. Couple plans cost ${SUMMARY.coupleSaveLow}–${SUMMARY.coupleSaveHigh}% less than buying two individual plans, starting at ${inr(SUMMARY.coupleFrom)} for two people. Each partner gets their own diet plan. On live 1:1 couple plans you both train together in one shared session slot.`,
  },
  {
    question: 'Does the price include a diet plan?',
    answer: 'Yes. Every plan except the rehabilitation plans includes a personalised Indian diet plan built around the food you actually eat, along with supplement guidance and WhatsApp support. There is no separate charge for nutrition coaching.',
  },
  {
    question: 'Do NRIs and international clients pay a different price?',
    answer: 'No. Prices are the same everywhere and charged in Indian rupees. International Visa and Mastercard credit and debit cards are accepted at checkout, and live sessions are scheduled in your time zone.',
  },
  {
    question: 'Can I get a refund if I change my mind?',
    answer: 'No. All plans are non-refundable once purchased, which is why the free consultation exists: talk to Coach Himanshu first, ask every question, and only pay when you are sure the plan fits. Live 1:1 sessions must be used within the package validity (1 or 3 months).',
  },
];
