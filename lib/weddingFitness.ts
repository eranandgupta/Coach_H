// Wedding fitness plans — /wedding-fitness-plan hub + /wedding-fitness-plan/[who]
//
// Targets wedding-season queries ("wedding fitness plan", "bridal fitness plan",
// "how much weight can I lose before my wedding") from India and the diaspora
// flying home for Nov–Feb weddings. Every kg figure comes from weddingTimeline()
// and every price from lib/plans.ts, so the copy cannot drift from the widget or
// the catalog. The loss rate is the same 0.5–1 kg/week the rest of the site uses.

import { PLAN_GROUPS, type PlanItem } from '@/lib/plans';
import { SUMMARY } from '@/lib/pricingGuide';

export const WEDDING_HUB_URL = 'https://coachhimanshu.com/wedding-fitness-plan';
export const WEDDING_BASE = WEDDING_HUB_URL;

export const LOSS_RATE = { low: 0.5, high: 1 }; // kg per week
// The last 2 weeks are held at maintenance: no new deficit, no new foods, so you
// look and feel your best on the day instead of flat and tired.
export const TAPER_WEEKS = 2;

export const inr = (n: number) => `₹${Math.round(n).toLocaleString('en-IN')}`;

export interface WeddingPhase {
  name: string;
  weeks: string; // "Weeks 12–9 out"
  text: string;
}

export interface WeddingTimeline {
  weeks: number;
  lossWeeks: number;
  lowKg: number;
  highKg: number;
  phases: WeddingPhase[];
}

const span = (from: number, to: number) =>
  from === to ? `Week ${from} out` : `Weeks ${from}–${to} out`;

export function weddingTimeline(weeksOut: number): WeddingTimeline {
  const weeks = Math.max(1, Math.floor(weeksOut));
  const lossWeeks = Math.max(0, weeks - TAPER_WEEKS);
  const phases: WeddingPhase[] = [];

  if (lossWeeks > 0) {
    // First quarter (at least 1 week, only when there are 4+ loss weeks) builds the base.
    const foundation = lossWeeks >= 4 ? Math.max(1, Math.round(lossWeeks / 4)) : 0;
    const define = lossWeeks >= 12 ? 4 : lossWeeks >= 8 ? 2 : 0;
    const fatLoss = lossWeeks - foundation - define;
    let w = weeks;
    if (foundation) {
      phases.push({
        name: 'Foundation',
        weeks: span(w, w - foundation + 1),
        text: 'Learn the lifts with live form checks, set daily steps, and move to a protein-first Indian diet. A small calorie deficit starts here.',
      });
      w -= foundation;
    }
    if (fatLoss > 0) {
      phases.push({
        name: 'Fat loss',
        weeks: span(w, w - fatLoss + 1),
        text: 'A steady calorie deficit with progressive strength training, so the weight that comes off is fat, not muscle. Plan adjusted every week from your check-ins.',
      });
      w -= fatLoss;
    }
    if (define) {
      phases.push({
        name: 'Define',
        weeks: span(w, w - define + 1),
        text: 'Keep the deficit, add conditioning and posture work. Outfit fittings usually fall in this window, so measurements are tracked weekly.',
      });
      w -= define;
    }
  }

  const taper = Math.min(weeks, TAPER_WEEKS);
  phases.push({
    name: 'Wedding fortnight',
    weeks: span(taper, 1),
    text: 'Eat at maintenance, keep meals, water and salt the same every day, train lighter, and sleep. No detox teas, no new foods, no crash cuts.',
  });

  return {
    weeks,
    lossWeeks,
    lowKg: Math.round(lossWeeks * LOSS_RATE.low * 10) / 10,
    highKg: Math.round(lossWeeks * LOSS_RATE.high * 10) / 10,
    phases,
  };
}

// Rows for the static countdown table (hub + every audience page).
export const COUNTDOWN_WEEKS = [4, 8, 12, 16, 24];

// ---------- Plan picks (prices from lib/plans.ts) ----------

export type WeddingWho = 'bride' | 'groom' | 'couple';

const allPlans = PLAN_GROUPS.flatMap((g) => g.plans);
function plan(name: string): PlanItem {
  const p = allPlans.find((x) => x.name === name);
  // Fails the build if a plan is renamed in lib/plans.ts.
  if (!p) throw new Error(`weddingFitness: plan "${name}" not found in lib/plans.ts`);
  return p;
}

export interface PlanPick {
  label: string; // "Personalised coaching" / "Live 1:1"
  plan: PlanItem;
  href: string;
  why: string;
}

export function planPicks(who: WeddingWho, weeks: number): PlanPick[] {
  const short = weeks <= 5;
  if (who === 'couple') {
    const coaching = weeks <= 13 ? plan('Couple Home Workout') : plan('Couple Strength');
    const live = short ? plan('Elite 1:1 Couple — 12 Sessions') : plan('Elite 1:1 Couple — 36 Sessions');
    return [
      {
        label: 'Couple coaching',
        plan: coaching,
        href: '/fitness-coaching-for/family',
        why: `${inr(coaching.price)} for both of you (${coaching.durationLabel}), ${inr(coaching.price / 2)} each. Your own workout and diet plan each${/home/i.test(coaching.name) ? ', built for training at home' : ''}.`,
      },
      {
        label: 'Live 1:1 as a couple',
        plan: live,
        href: '/online-personal-trainer',
        why: `${inr(live.price)} for ${live.specs.liveSessions} of live training together, over ${live.durationLabel.toLowerCase()}.`,
      },
    ];
  }
  const coaching =
    weeks <= 5
      ? plan('Kickstart Plan')
      : weeks <= 13
        ? plan('Consistency Plan')
        : weeks <= 26
          ? plan('Strength Plan')
          : plan('Mastery Plan');
  const live = short ? plan('Elite 1:1 — 12 Sessions') : plan('Elite 1:1 — 36 Sessions');
  return [
    {
      label: 'Personalised coaching',
      plan: coaching,
      href: '/plans',
      why: `${inr(coaching.price)} for ${coaching.durationLabel.toLowerCase()}: custom workout and Indian diet plan, weekly one-on-one consultation, WhatsApp support.`,
    },
    {
      label: 'Live 1:1 training',
      plan: live,
      href: '/online-personal-trainer',
      why: `${inr(live.price)} for ${parseInt(live.specs.liveSessions ?? '', 10)} live 60-minute sessions over ${live.durationLabel.toLowerCase()}, with every rep watched and corrected.`,
    },
  ];
}

// ---------- Audience pages ----------

export interface WeddingFaq {
  question: string;
  answer: string;
}

export interface WeddingAudience {
  slug: WeddingWho;
  name: string; // "Bride"
  navLabel: string; // "Bridal fitness plan"
  metaTitle: string;
  metaDescription: string;
  h1: string;
  h1Accent: string;
  intro: string;
  focusHeading: string;
  focus: { title: string; text: string }[];
  outfitNote: string;
  keywords: string[];
  faqs: WeddingFaq[];
}

const t12 = weddingTimeline(12);
const t16 = weddingTimeline(16);
const t8 = weddingTimeline(8);
const t4 = weddingTimeline(4);

const range = (t: WeddingTimeline) => `${t.lowKg}–${t.highKg} kg`;

export const WEDDING_AUDIENCES: WeddingAudience[] = [
  {
    slug: 'bride',
    name: 'Bride',
    navLabel: 'Bridal fitness plan',
    metaTitle: 'Bridal Fitness Plan: Get Wedding-Ready Online',
    metaDescription: `A bridal fitness plan with an Indian diet, built around your wedding date. Realistic loss: ${range(t12)} in 12 weeks. Online coaching worldwide, free consultation.`,
    h1: 'Bridal Fitness Plan,',
    h1Accent: 'Built Around Your Wedding Date',
    intro:
      'Most brides want the same three things: to feel confident in the lehenga, to have energy for every function, and not to spend the months before the wedding starving. Coach Himanshu plans backwards from your date, with an Indian diet you can follow through the shopping, the parties and the stress.',
    focusHeading: 'What a Bridal Plan Focuses On',
    focus: [
      { title: 'Arms, back and posture', text: 'Blouse and lehenga styles show the upper back, shoulders and arms. Rows, presses and posture work make the biggest visible difference in photos.' },
      { title: 'Energy for every function', text: 'Mehndi, sangeet, haldi and the wedding can run back to back. The diet keeps enough carbohydrate and iron in so you are not running on empty.' },
      { title: 'PCOS and thyroid aware', text: 'If you manage PCOS or thyroid, the training and diet are set around it, with realistic targets instead of crash cuts.' },
      { title: 'Calm, not crash', text: 'Sleep, stress and a steady routine matter as much as calories in the final weeks. No detox teas, no liquid diets.' },
    ],
    outfitNote:
      'Bridal outfits are often measured months ahead and given a final fitting a few weeks before the day. Tell your designer you are training, track measurements weekly, and plan your final fitting after the fat-loss phase ends.',
    keywords: ['bridal fitness plan', 'bride weight loss plan before wedding', 'bridal diet plan indian', 'wedding weight loss for bride', 'pre wedding fitness for bride'],
    faqs: [
      { question: 'How much weight can a bride lose before the wedding?', answer: `At a safe 0.5–1 kg a week, with the final ${TAPER_WEEKS} weeks held at maintenance: about ${range(t8)} in 8 weeks, ${range(t12)} in 12 weeks and ${range(t16)} in 16 weeks. Brides with more to lose usually lose faster at the start.` },
      { question: 'When should a bride start a wedding fitness plan?', answer: 'Ideally 4–6 months before the wedding. That leaves time for a steady fat-loss phase, outfit fittings and a calm final fortnight. Even 8 weeks is enough to see a clear change.' },
      { question: 'What should a bride eat before the wedding?', answer: 'A protein-first Indian diet: dal, paneer, curd, eggs or chicken at each meal, plenty of vegetables, and roti or rice in measured portions. In the last two weeks, eat at maintenance and do not try new foods.' },
      { question: 'Can I do a bridal fitness plan at home?', answer: 'Yes. Coach Himanshu can programme the full plan for home with dumbbells or resistance bands, or bodyweight only. Live 1:1 sessions run on video, so the coach watches your form wherever you are.' },
      { question: 'I live abroad and am flying to India for my wedding. Can I still train?', answer: 'Yes. Coaching is fully online, sessions are scheduled in your time zone, and your plan includes a travel week and the wedding week in India, so nothing breaks when you land.' },
    ],
  },
  {
    slug: 'groom',
    name: 'Groom',
    navLabel: 'Groom fitness plan',
    metaTitle: 'Groom Fitness Plan: Look Sharp on Your Wedding Day',
    metaDescription: `A groom fitness plan for a fitted sherwani: lose fat, build shoulders and chest, with an Indian diet. Realistic loss: ${range(t12)} in 12 weeks. Online, worldwide.`,
    h1: 'Groom Fitness Plan,',
    h1Accent: 'Sharp in Every Photo',
    intro:
      'A well-fitted sherwani or suit looks best on broad shoulders, a flatter stomach and a leaner face. Coach Himanshu builds a strength-first plan that does all three, with an Indian diet that survives the bachelor party and the family dinners.',
    focusHeading: 'What a Groom Plan Focuses On',
    focus: [
      { title: 'Shoulders, chest and back', text: 'Progressive pressing and rowing build the V-shape a sherwani is cut for. Strength goes up every week, not just the scale going down.' },
      { title: 'Belly fat', text: 'A steady deficit with high protein takes fat off the waist first for most men. No spot-reduction myths, just consistent numbers.' },
      { title: 'A leaner face', text: 'Lower body fat, fewer late-night drinks and consistent salt and water in the final fortnight make the face look sharper in photos.' },
      { title: 'Alcohol and events', text: 'Bachelor parties and functions are planned into the week, with a realistic drinks strategy instead of a ban you will break.' },
    ],
    outfitNote:
      'Sherwanis and suits are usually tailored in the final weeks. Book the final fitting after the fat-loss phase, and ask for a little room in the shoulders if you are still building.',
    keywords: ['groom fitness plan', 'groom workout plan before wedding', 'wedding weight loss for men', 'pre wedding fitness for groom', 'sherwani body workout'],
    faqs: [
      { question: 'How much weight can a groom lose before the wedding?', answer: `At a safe 0.5–1 kg a week, with the final ${TAPER_WEEKS} weeks held at maintenance: about ${range(t8)} in 8 weeks, ${range(t12)} in 12 weeks and ${range(t16)} in 16 weeks. The higher end is realistic if you have more body fat to lose.` },
      { question: 'Can I build muscle and lose fat before my wedding?', answer: 'If you are new to strength training or returning after a break, yes: high protein and progressive lifting build muscle while a moderate deficit takes fat off. Experienced lifters usually focus on keeping muscle while they lean out.' },
      { question: 'How do I lose face fat before my wedding?', answer: 'Face fat goes down with overall body fat; there is no exercise that targets it. Lower body fat, less alcohol and steady salt and water intake in the last two weeks make the most visible difference.' },
      { question: 'How many days a week should a groom train?', answer: 'Three to four strength sessions a week plus daily steps is enough for most grooms. Live 1:1 plans run about three 60-minute sessions a week.' },
      { question: 'I work long hours. Will this fit my schedule?', answer: 'Yes. Sessions are 45–60 minutes, scheduled when you are free, and the diet is built around office meals and eating out.' },
    ],
  },
  {
    slug: 'couple',
    name: 'Couple',
    navLabel: 'Couple wedding fitness plan',
    metaTitle: 'Couple Wedding Fitness Plan: Train Together Online',
    metaDescription: 'A couple wedding fitness plan: train together online, separate Indian diet plans, one price for both. Couple plans cost less than two singles. Free consultation.',
    h1: 'Couple Wedding Fitness Plan,',
    h1Accent: 'Train Together, Arrive Together',
    intro:
      'Training together is the easiest way to stay consistent through wedding planning. On a couple plan you pay one price, train side by side, and each of you gets your own workout and diet plan, because a bride and a groom rarely need the same training or the same calories.',
    focusHeading: 'Why Couples Train Better Together',
    focus: [
      { title: 'Built-in accountability', text: 'It is much harder to skip a session when your partner is already ready and waiting.' },
      { title: 'Two diets, one kitchen', text: 'Separate calorie targets, but meals built from the same Indian dishes, so you are not cooking twice.' },
      { title: 'One price for both', text: 'Couple plans cost less than two individual plans, and live couple sessions share one slot.' },
      { title: 'Different goals, same schedule', text: 'One partner can focus on fat loss while the other builds muscle. Your plans are separate, your training time does not have to be.' },
    ],
    outfitNote:
      'Coordinate both final fittings for after the fat-loss phase. If one of you is losing faster, their outfit should be fitted last.',
    keywords: ['couple wedding fitness plan', 'couple workout before wedding', 'pre wedding fitness couple', 'couple fitness coaching online', 'bride and groom workout plan'],
    faqs: [
      { question: 'How much can we lose before our wedding?', answer: `Each partner can expect about 0.5–1 kg a week, with the final ${TAPER_WEEKS} weeks at maintenance: roughly ${range(t8)} in 8 weeks and ${range(t12)} in 12 weeks each. Men often lose a little faster at the start.` },
      { question: 'Can a bride and groom do one fitness plan together?', answer: 'Yes. On a couple plan you pay one price and can train together, and each of you gets your own workout plan, diet plan and calorie target.' },
      { question: 'Is a couple plan cheaper than two separate plans?', answer: `Yes. Couple plans cost ${SUMMARY.coupleSaveLow}–${SUMMARY.coupleSaveHigh}% less than buying two individual plans, starting at ${inr(SUMMARY.coupleFrom)} for both of you. On live 1:1 couple plans you train together in one shared session slot.` },
      { question: 'We live in different cities before the wedding. Does it still work?', answer: 'Yes. Everything is online, so each partner trains wherever they are and checks in on WhatsApp. You can join live sessions from two different places.' },
    ],
  },
];

export const getWeddingAudience = (slug: string) => WEDDING_AUDIENCES.find((a) => a.slug === slug);

// ---------- Hub ----------

export const WEDDING_HUB_FAQS: WeddingFaq[] = [
  {
    question: 'How much weight can I lose before my wedding?',
    answer: `At a safe rate of 0.5–1 kg a week, with the final ${TAPER_WEEKS} weeks held at maintenance: about ${range(t4)} with 4 weeks to go, ${range(t8)} with 8 weeks, ${range(t12)} with 12 weeks and ${range(t16)} with 16 weeks. People with more to lose usually lose faster at the start.`,
  },
  {
    question: 'When should I start a wedding fitness plan?',
    answer: 'Four to six months before the wedding is ideal. It leaves time for steady fat loss, outfit fittings and a relaxed final fortnight. Starting 8–12 weeks out still gives a visible change.',
  },
  {
    question: 'Is crash dieting before a wedding a good idea?',
    answer: 'No. Very low calorie diets mostly drop water and muscle, leave you tired for the functions, and the weight comes back on the honeymoon. A moderate deficit with strength training keeps the result.',
  },
  {
    question: 'What should I eat in the week of my wedding?',
    answer: 'The same meals you have been eating, at maintenance calories. Keep water and salt steady, avoid new foods and heavy fried snacks between functions, and do not try detox teas or fasting.',
  },
  {
    question: 'Can I train online if I am flying to India for my wedding?',
    answer: 'Yes. Coaching is online, sessions are scheduled in your time zone, and the plan includes your travel week and the wedding week in India. International Visa and Mastercard cards are accepted at checkout.',
  },
  {
    question: 'Do couples get a discount on a wedding fitness plan?',
    answer: `Yes. Couple plans cost ${SUMMARY.coupleSaveLow}–${SUMMARY.coupleSaveHigh}% less than two individual plans, each partner gets their own diet plan, and live couple sessions share one slot.`,
  },
];
