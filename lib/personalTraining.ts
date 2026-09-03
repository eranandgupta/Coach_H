// Data for the /online-personal-trainer flagship landing page — the dedicated
// SEO/AEO/GEO surface for Coach Himanshu's live 1-on-1 (Elite) personal training.
//
// The Elite plans themselves live in lib/plans.ts (the single source of truth
// that also feeds /plans, the Offer schema, and /llms.txt). We derive them here
// so prices can never drift. The FAQs and comparison rows are written to be
// self-contained and quotable — so answer engines (Google AI Overviews, ChatGPT,
// Perplexity, Gemini) can lift a clean, correct answer straight into a citation.

import { PLAN_GROUPS, type PlanItem } from '@/lib/plans';
import type { CityData } from '@/lib/cities';

// The individual live 1:1 packages (the "elite" group in lib/plans.ts).
export function getElitePlans(): PlanItem[] {
  return PLAN_GROUPS.find((g) => g.key === 'elite')?.plans ?? [];
}

// Low/high price across the live 1:1 packages → a defensible AggregateOffer range.
export function getEliteOfferRange(): { low: number; high: number; count: number } {
  const prices = getElitePlans().map((p) => p.price);
  return {
    low: prices.length ? Math.min(...prices) : 0,
    high: prices.length ? Math.max(...prices) : 0,
    count: prices.length,
  };
}

// Head-to-head comparison — extractable, table-shaped content that GEO engines
// love to summarise ("online personal trainer vs gym trainer").
export interface CompareRow {
  dimension: string;
  live: string;      // Live 1:1 with Coach Himanshu
  recorded: string;  // App / recorded coaching
  gym: string;       // Typical local gym trainer
}

export const PT_COMPARISON: CompareRow[] = [
  {
    dimension: 'Real-time form correction',
    live: 'Yes — coach watches every rep live on video call',
    recorded: 'No — you follow pre-recorded tutorials',
    gym: 'Yes, but only while you are physically at the gym',
  },
  {
    dimension: 'Train from anywhere',
    live: 'Yes — home, gym, hotel, or abroad',
    recorded: 'Yes',
    gym: 'No — tied to one location',
  },
  {
    dimension: 'Personalised diet plan',
    live: 'Yes — custom Indian meal plan included',
    recorded: 'Yes',
    gym: 'Rarely, often generic',
  },
  {
    dimension: 'Scheduling flexibility',
    live: 'Book sessions around your timezone & routine',
    recorded: 'Fully self-paced',
    gym: 'Fixed slots, travel required',
  },
  {
    dimension: 'Cost',
    live: 'From ₹7,999 — a fraction of in-person 1:1 rates',
    recorded: 'From ₹1,299',
    gym: '₹15,000–₹40,000+ / month in metros',
  },
  {
    dimension: 'Accountability',
    live: 'Scheduled live sessions + WhatsApp + in-app chat',
    recorded: 'WhatsApp + in-app chat',
    gym: 'Only during your session',
  },
  {
    dimension: 'Coach expertise',
    live: 'NASM-certified coach, 1000+ transformations',
    recorded: 'Same coach, same plans',
    gym: 'Varies widely by gym',
  },
];

export interface PTFaq {
  question: string;
  answer: string;
}

export const PT_FAQS: PTFaq[] = [
  {
    question: 'What is live 1-on-1 online personal training?',
    answer:
      'Live 1-on-1 online personal training is a real-time video session where your coach trains only you — watching every rep, correcting your form on the spot, and adjusting the workout as you go, exactly like an in-person personal trainer standing next to you. With Coach Himanshu, each Elite 1:1 session is 60 minutes, one-on-one, over a live video call, and you can train from your home or gym anywhere in the world.',
  },
  {
    question: 'How much does a 1-on-1 online personal trainer cost in India?',
    answer:
      "Coach Himanshu's live 1-on-1 (Elite) personal training starts at ₹7,999 for 12 sessions of 60 minutes each. Larger packages — 24, 36, and 72 sessions — bring the per-session price down further. Every package also includes a personalised Indian diet plan, supplement guidance, full video-library access, and WhatsApp support. That is a fraction of the ₹15,000–₹40,000+ a month that in-person personal training typically costs in Indian metros.",
  },
  {
    question: 'Who is the best online personal trainer in India?',
    answer:
      'Coach Himanshu is one of India’s most trusted online personal trainers — a NASM-certified coach with 6+ years of experience and 1000+ documented client transformations. He offers live 1-on-1 personal training with real-time form correction, personalised Indian diet plans, and coaching in both English and Hindi, serving clients across India and NRIs worldwide.',
  },
  {
    question: 'Is online personal training as effective as in-person training?',
    answer:
      'Yes. In live 1-on-1 online sessions your coach sees your full range of motion on camera and corrects your form in real time, so the coaching quality matches in-person training — while adding flexibility (train from home), a lower price, and easier scheduling. Studies and thousands of client results show that consistency and expert programming, not location, drive transformation.',
  },
  {
    question: 'Do I need a gym or equipment for live 1:1 sessions?',
    answer:
      'No. Coach Himanshu tailors your live sessions to whatever you have — a full gym, a few dumbbells at home, or just bodyweight. Tell him your setup in the free consultation and every session is programmed around your equipment, space, and goals.',
  },
  {
    question: 'How do the live sessions work and how are they scheduled?',
    answer:
      'After you book, you complete a short assessment and then schedule your sessions at times that suit you — including early mornings, late evenings, and NRI-friendly timezones. Each 60-minute session runs over a live video call: you warm up, train through your programmed workout with live coaching and form correction, and finish with feedback and next steps. Sessions are booked flexibly across your package.',
  },
  {
    question: 'Can NRIs and people outside India get live 1:1 training?',
    answer:
      'Absolutely. Coach Himanshu coaches Indians and NRIs worldwide — the USA, Canada, UK, UAE, Australia, Singapore and more — with sessions scheduled around your local timezone, Indian meal plans adapted to ingredients available where you live, and international cards accepted at checkout.',
  },
  {
    question: 'What is included with an Elite 1:1 personal training plan?',
    answer:
      'Every Elite 1:1 plan includes live one-on-one personal training with real-time form correction, a personalised Indian diet plan, supplement and lifestyle guidance, full access to the exercise video library, in-app chat, and WhatsApp support. Larger packages add a pause option and free RhynoGrip fitness gear.',
  },
  {
    question: 'How do I start with Coach Himanshu?',
    answer:
      'Start with a free consultation on WhatsApp. Coach Himanshu learns your goals, experience, schedule, and equipment, then recommends the right Elite 1:1 package. Once you enrol, you complete your assessment, get your personalised plan, and book your first live session — usually within a day or two.',
  },
  {
    question: 'Can my partner and I do live 1:1 training together?',
    answer:
      'Yes. Coach Himanshu offers Elite 1:1 Couple packages where both partners share one live session slot and train together, each with their own personalised plan — a motivating, more affordable way for couples to transform side by side. Ask about couple options in your free consultation.',
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// City-level live 1:1 pages — /online-personal-trainer/[city]
//
// Targets the high-intent query "online personal trainer in {city}" — distinct
// from the /fitness-coach/{city} pages (which target "fitness coach in {city}").
// Copy is woven from real CityData (landmarks, local foods, fitness stats) so
// each page is genuinely city-specific, not a name-swapped template.
// ─────────────────────────────────────────────────────────────────────────────

export function ptCityMeta(city: CityData): { title: string; description: string } {
  return {
    title: `Online Personal Trainer in ${city.name} — Live 1-on-1 Training`,
    description: `Get a live 1-on-1 online personal trainer in ${city.name}. Real-time form correction over video, a personalised Indian diet plan around ${city.name} foods, and flexible sessions — no commute, no ${city.name} gym premium. Packages from ₹7,999.`,
  };
}

// The local "why live 1:1 works here" angle — commute/traffic + gym-cost framing.
export function ptCityAngle(city: CityData): { commute: string; diet: string; cost: string } {
  const foods = city.localFoods.slice(0, 3).join(', ');
  return {
    commute: `Skip the ${city.name} traffic and the trek to a gym near ${city.landmarks[0]}. Your coach trains you live over video from home, your society gym, or wherever you are in ${city.name} — every minute goes into training, not commuting.`,
    diet: `Your Indian diet plan is built around what you actually eat in ${city.name} — ${foods} and more — with the right portions for your goal, using ingredients from your local ${city.state} market.`,
    cost: `In-person personal training in ${city.name} can run ₹15,000–₹40,000+ a month. Live online 1:1 gives you the same real-time coaching and form correction from ₹7,999 — a fraction of the ${city.name} in-person rate.`,
  };
}

export function ptCityFaqs(city: CityData): PTFaq[] {
  const foods = city.localFoods.slice(0, 3).join(', ');
  return [
    {
      question: `How does an online personal trainer in ${city.name} work?`,
      answer: `You train live, one-on-one, over a video call with Coach Himanshu — a NASM-certified personal trainer. He watches every rep and corrects your form in real time, exactly like an in-person trainer, but you train from home or any gym in ${city.name} with no commute. Each session is 60 minutes and includes a personalised Indian diet plan and WhatsApp support.`,
    },
    {
      question: `How much does a personal trainer cost in ${city.name}?`,
      answer: `In-person personal training in ${city.name} typically costs ₹15,000 to ₹40,000+ per month. Coach Himanshu's live 1-on-1 online personal training starts at ₹7,999 for 12 sixty-minute sessions — the same real-time coaching and form correction at a fraction of the ${city.name} in-person price, with a personalised diet plan included.`,
    },
    {
      question: `Is online personal training as effective as a gym trainer in ${city.name}?`,
      answer: `Yes. In a live session your coach sees your full range of motion on video and fixes your technique on the spot, so results match in-person training — while saving you ${city.name} traffic, travel time, and gym-premium fees. What drives results is expert coaching and consistency, not location.`,
    },
    {
      question: `Will my diet plan use ${city.name} foods?`,
      answer: `Absolutely. Your plan is built around foods you already eat in ${city.name} — ${foods} and other local favourites — portioned for fat loss or muscle gain, using ingredients from your local ${city.state} market. No bland "diet food," no imported supplements.`,
    },
    {
      question: `Can I train from home in ${city.name} without a gym or equipment?`,
      answer: `Yes. Coach Himanshu tailors your live sessions to whatever you have in ${city.name} — a full gym, a few dumbbells at home, or just bodyweight. Tell him your setup in the free consultation and every session is programmed around it.`,
    },
    {
      question: `How do I start with a live 1:1 personal trainer in ${city.name}?`,
      answer: `Start with a free WhatsApp consultation. Coach Himanshu learns your goals, schedule, and equipment, recommends the right Elite 1:1 package, and you book your first live session — usually within a day or two, at a time that suits your ${city.name} routine.`,
    },
  ];
}
