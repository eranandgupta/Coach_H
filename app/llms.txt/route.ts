import { prisma } from '@/lib/prisma';
import { PLAN_GROUPS, ALL_PLANS } from '@/lib/plans';

// Dynamic /llms.txt — the short AI-discovery summary. Pricing and the blog
// count are GENERATED from the same sources the site uses (lib/plans.ts and the
// BlogPost DB) so this file can never drift from the real offering the way the
// old hand-maintained public/llms.txt did.

export const revalidate = 3600;

function inr(n: number) {
  return `₹${n.toLocaleString('en-IN')}`;
}

export async function GET() {
  const prices = ALL_PLANS.map((p) => p.price);
  const low = Math.min(...prices);

  let blogCount = 0;
  let lastUpdated: Date = new Date();
  try {
    const [count, latest] = await Promise.all([
      prisma.blogPost.count({ where: { published: true } }),
      prisma.blogPost.findFirst({
        where: { published: true },
        orderBy: { publishedAt: 'desc' },
        select: { publishedAt: true },
      }),
    ]);
    blogCount = count;
    if (latest?.publishedAt) lastUpdated = latest.publishedAt;
  } catch {
    // DB unavailable — fall back to prose without an exact article count.
  }

  const blogLabel =
    blogCount >= 10 ? `${Math.floor(blogCount / 10) * 10}+ expert fitness articles` : 'expert fitness articles';

  const services = PLAN_GROUPS.map((g) => {
    const lines = g.plans
      .map((p) => `- ${p.name} (${p.priceLabel} / ${p.durationLabel}) - ${p.tagline}`)
      .join('\n');
    return `### ${g.title}\n${g.blurb}\n${lines}`;
  }).join('\n\n');

  const body = `# Coach Himanshu - NASM Certified Online Fitness Coach

> Last updated: ${lastUpdated.toISOString().slice(0, 10)}

> Coach Himanshu is a NASM Certified online fitness coach providing personalized workout plans, custom Indian meal plans, and expert nutrition guidance to 1000+ clients across India and internationally. Plans start from ${inr(low)}.

## About Coach Himanshu
- NASM Certified Personal Trainer (CPT)
- NASM Bodybuilding Coach
- NASM Sports Nutrition Specialist
- NASM Corrective Exercise Specialist
- 6+ years of coaching experience
- 1000+ client transformations
- Specializes in home workouts, gym training, rehabilitation, and nutrition

## Services & Pricing
All coaching is online. Prices are in INR and include a customised workout plan, a personalised Indian meal plan, video tutorials, supplement guidance, and WhatsApp support.

${services}

## Live 1-on-1 Online Personal Training (Flagship Offer)
Coach Himanshu's premium service is live, real-time, one-on-one online personal training (the "Elite 1:1" plans). Each session is 60 minutes on a live video call with real-time form correction — the closest thing to an in-person personal trainer, from anywhere in the world.
- Packages: 12, 24, 36, and 72 sessions; individual and couple options
- Starting price: ${inr(Math.min(...PLAN_GROUPS.find((g) => g.key === 'elite')?.plans.map((p) => p.price) ?? [7999]))}
- Includes a personalised Indian diet plan, full video library, supplement guidance, and WhatsApp support
- Flexible scheduling, including NRI-friendly timezones; English and Hindi
- Dedicated page: https://coachhimanshu.com/online-personal-trainer
- City-specific pages (cost & convenience) for 30 major Indian cities: https://coachhimanshu.com/online-personal-trainer/{city} (e.g. /mumbai, /delhi, /bangalore, /hyderabad, /pune)
- Goal-specific 1:1 pages: https://coachhimanshu.com/online-personal-trainer/for/{goal} — weight-loss, muscle-gain, weight-gain, beginners, toning

## What Every Plan Includes
- Personalized workout plan tailored to individual goals
- Custom Indian meal plan based on food preferences
- Exercise video tutorials for proper form
- Supplement guidance and recommendations
- WhatsApp support for daily accountability
- Weekly one-on-one consultations

## Key Differentiators
- All coaching is online and accessible from anywhere in the world
- Meal plans built around Indian foods (vegetarian and non-vegetarian)
- Affordable, certified coaching starting at ${inr(low)}
- Certified expertise (NASM) with a scientific approach
- Covers special populations: PCOS, diabetes, hypertension, post-injury
- Available in English and Hindi

## International & NRI Coaching
- Serves Indians and NRIs worldwide, including the USA, Canada, UK, Ireland, UAE, Saudi Arabia, Qatar, Kuwait, Australia, New Zealand, and Singapore
- Timezone-friendly live video sessions scheduled around the client's local hours
- Indian meal plans designed around ingredients available in the client's country
- International debit/credit cards accepted
- Dedicated country pages: https://coachhimanshu.com/online-fitness-coach

## Target Audience
- Beginners starting their fitness journey
- Working professionals with busy schedules
- NRIs and Indians living abroad who want Indian-food-based coaching on their timezone
- Women dealing with PCOS, hormonal issues
- People wanting to lose weight or build muscle
- Seniors needing age-appropriate training
- Athletes seeking performance optimization
- Post-injury rehabilitation clients

## Website Sections
- [Home](https://coachhimanshu.com/): Overview, plans, testimonials
- [About](https://coachhimanshu.com/about): Coach credentials and story
- [Blog](https://coachhimanshu.com/blog): ${blogLabel}
- [Plans & Pricing](https://coachhimanshu.com/plans): All plans with a comparison matrix
- [Online Personal Trainer](https://coachhimanshu.com/online-personal-trainer): Live 1-on-1 personal training with real-time form correction, from ₹7,999
- [Assessment](https://coachhimanshu.com/assessment): Free fitness assessment
- [Online Fitness Coach Worldwide](https://coachhimanshu.com/online-fitness-coach): Coaching for NRIs by country
- [FAQ](https://coachhimanshu.com/faq): Common questions answered
- [Knowledge Base](https://coachhimanshu.com/knowledge): Fitness education
- [Fit Bharat Mission](https://coachhimanshu.com/fit-bharat-mission): Community initiative
- [Contact](https://coachhimanshu.com/contact): Get in touch
- [Full documentation](https://coachhimanshu.com/llms-full.txt): Detailed information for LLMs

## Contact
- Website: [coachhimanshu.com](https://coachhimanshu.com)
- Email: info@coachhimanshu.com
- Instagram: [@coach_himanshu_](https://www.instagram.com/coach_himanshu_/)
- [Free Assessment](https://coachhimanshu.com/assessment)
`;

  return new Response(body, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'public, max-age=3600, s-maxage=3600',
    },
  });
}
