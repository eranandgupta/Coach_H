// Single source of truth for the audience landing pages served at
// /fitness-coaching-for/[audience]. Adding an audience = adding one object here;
// the route, metadata, Service + FAQPage + Breadcrumb JSON-LD, static params and
// sitemap entry are all generated automatically (mirrors lib/cities.ts).

export interface AudiencePlan {
  name: string;
  duration: string;
  price: string;
  perMonth: string;
  popular?: boolean;
  features: string[];
}

export interface AudienceFAQ {
  question: string;
  answer: string;
}

export interface AudienceData {
  slug: string;              // lowercase-hyphenated, matches URL — e.g. 'women'
  audience: string;          // 'Women' — reads after "for" and "Coaching for ${audience}"
  metaTitle: string;         // < 60 chars, keyword-front-loaded
  metaDescription: string;   // 150–160 chars
  heroLead: string;          // gradient words in the H1
  heroTail: string;          // remainder of the H1 after the gradient words
  intro: string;             // hero paragraph
  goalChips: string[];       // focus areas shown as chips
  goalChipsHeading: string;  // heading above the chips
  goalChipsSub: string;      // sub-line above the chips
  reasons: { title: string; description: string }[];  // 6 differentiators
  steps: { number: string; title: string; description: string }[];
  plans: AudiencePlan[];
  faqs: AudienceFAQ[];
  relatedBlogs: { title: string; href: string }[];
  ctaTitle: string;
  ctaText: string;
}

export const AUDIENCES: AudienceData[] = [
  {
    slug: 'women',
    audience: 'Women',
    metaTitle: 'Online Fitness Coach for Women in India',
    metaDescription:
      'Personalised online fitness coaching for women in India — fat loss, toning, PCOS & thyroid-friendly diets, and postpartum plans. Train from home. Plans from ₹1,299/month.',
    heroLead: 'Fitness Coaching',
    heroTail: 'Built for Women',
    intro:
      "Most fitness plans are designed for men and simply handed to women. Coach Himanshu builds coaching around a woman's body, hormones, and routine — whether your goal is fat loss, toning, managing PCOS or thyroid, or getting back in shape after pregnancy. Train privately from home, eat food your family already cooks, and get guidance that actually fits your life.",
    goalChipsHeading: 'What We Help Women With',
    goalChipsSub:
      'Real goals for real Indian women — not a one-size-fits-all workout copied from a men’s program.',
    goalChips: [
      'Fat loss & inch loss',
      'Toning without bulking up',
      'PCOS & PCOD management',
      'Thyroid-friendly nutrition',
      'Postpartum recovery',
      'Strength & bone health',
      'Confidence & energy',
      'Home workouts, full privacy',
    ],
    reasons: [
      {
        title: 'Hormone-Aware Programming',
        description:
          'PCOS, thyroid, and monthly cycles change how your body responds to training and food. Your plan is adjusted around them — not fighting against them.',
      },
      {
        title: 'Toning, Not Bulking',
        description:
          "The #1 fear we hear is “I don’t want to look bulky.” You won’t. Your plan builds a lean, toned, strong shape — the look most women actually want.",
      },
      {
        title: 'Train From Home, Privately',
        description:
          'No crowded gyms, no unwanted stares, no commute. Effective home workouts you can do in your own space, with video tutorials for perfect form.',
      },
      {
        title: 'Postpartum & Every Life Stage',
        description:
          'Safe, gradual plans for new moms rebuilding strength, and sensible programming for women in their 30s, 40s, and beyond.',
      },
      {
        title: 'Indian Food, No Deprivation',
        description:
          'Roti, dal, sabzi, curd, paneer — your diet is built from foods you already eat, portioned for your goal. No boiled-chicken-and-broccoli misery.',
      },
      {
        title: '24/7 WhatsApp Support',
        description:
          'Busy with work and family? Message your coach anytime. Quick answers, weekly check-ins, and someone keeping you accountable when motivation dips.',
      },
    ],
    steps: [
      {
        number: '01',
        title: 'Take the Free Assessment',
        description:
          'Share your goals, cycle/PCOS/thyroid history, lifestyle, and food preferences so your plan is truly personalised — not generic.',
      },
      {
        number: '02',
        title: 'Get Your Custom Plan',
        description:
          'Receive a workout and diet plan designed for your body and goal, with home or gym options and Indian meals you enjoy.',
      },
      {
        number: '03',
        title: 'Train With Guidance',
        description:
          'Follow video tutorials, weekly check-ins, and 24/7 WhatsApp support. Your plan adapts as your body and schedule change.',
      },
      {
        number: '04',
        title: 'Transform With Confidence',
        description:
          'Track progress with regular reviews and see steady, sustainable results — more energy, a stronger body, and lasting habits.',
      },
    ],
    plans: [
      {
        name: 'Home Workout Plan',
        duration: '3 Months',
        price: '₹2,499',
        perMonth: '₹833/month',
        features: [
          'Home workout plan (minimal equipment)',
          'Personalised diet plan',
          'Exercise video tutorials',
          'Weekly one-on-one consultation',
          'WhatsApp support',
        ],
      },
      {
        name: 'Consistency Plan',
        duration: '3 Months',
        price: '₹2,899',
        perMonth: '₹966/month',
        popular: true,
        features: [
          'Customised workout plan (home or gym)',
          'PCOS / thyroid-friendly diet plan',
          'Video tutorials',
          'Weekly one-on-one consultation',
          'Supplement guidance',
          'WhatsApp support',
          'Lifestyle coaching',
        ],
      },
      {
        name: 'Strength Plan',
        duration: '6 Months',
        price: '₹4,999',
        perMonth: '₹833/month',
        features: [
          'Fully customised workout plan',
          'Personalised diet plan',
          'Full video library access',
          'Weekly one-on-one consultation',
          'Supplement guidance',
          'WhatsApp support',
          'Pause option (7 days)',
        ],
      },
      {
        name: 'Elite 1:1 Coaching',
        duration: '1 Month',
        price: '₹7,999',
        perMonth: '12 live sessions',
        features: [
          'Live 1-on-1 online personal training',
          'Real-time form correction',
          'Personalised workout & diet plan',
          'Habit & progress tracking',
          'Direct coach support',
        ],
      },
    ],
    faqs: [
      {
        question: 'Is online fitness coaching effective for women?',
        answer:
          'Yes. A structured, personalised plan with weekly check-ins and accountability works just as well as in-person training — and often better, because you can train privately at home on your own schedule. Coach Himanshu tailors your workouts and nutrition to your body, goals, and any conditions like PCOS or thyroid, so progress is safe and sustainable.',
      },
      {
        question: 'Will lifting weights make me look bulky?',
        answer:
          'No. Women do not have the testosterone levels needed to build large, bulky muscles easily. Strength training instead gives you a lean, toned, and defined shape while improving bone density and metabolism. Your plan is specifically designed to tone and strengthen, not bulk.',
      },
      {
        question: 'Can I get a plan for PCOS or thyroid weight loss?',
        answer:
          'Absolutely. Coach Himanshu builds hormone-aware plans for women with PCOS, PCOD, and thyroid issues, using training and Indian nutrition adjusted to how your body responds. See our detailed guides on PCOS weight loss and thyroid weight loss, and get a plan matched to your reports and lifestyle.',
      },
      {
        question: 'I just had a baby — is it safe to start?',
        answer:
          'Postpartum coaching is available and starts gently, rebuilding core strength and fitness at a pace that is safe for your recovery. With your doctor’s clearance, Coach Himanshu designs a gradual plan around your energy, sleep, and feeding schedule so you regain strength without overdoing it.',
      },
      {
        question: 'Do I need a gym or equipment?',
        answer:
          'No. Many women start with home workout plans that need little or no equipment and train entirely in private. If you prefer the gym, you can get a gym-based plan instead. Both come with video tutorials so your form is correct from day one.',
      },
    ],
    relatedBlogs: [
      { title: 'PCOS Weight Loss: Diet & Exercise Plan for Indian Women', href: '/blog/pcos-weight-loss-diet-exercise-plan-for-indian-women' },
      { title: 'Thyroid & Weight Loss: Complete Guide for Indian Women', href: '/blog/thyroid-and-weight-loss-complete-guide-for-indian-women' },
      { title: 'Postpartum Weight Loss: Safe Exercise & Diet for New Moms', href: '/blog/postpartum-weight-loss-safe-exercise-and-diet-plan-for-new-moms' },
    ],
    ctaTitle: 'Ready to Train Smarter, Not Harder?',
    ctaText:
      'Join the women across India transforming their health with a plan built for their body. Start with a free consultation — no payment required.',
  },

  {
    slug: 'men',
    audience: 'Men',
    metaTitle: 'Online Fitness Coach for Men in India',
    metaDescription:
      'Online fitness coaching for men in India — build muscle, lose belly fat, gain strength and stamina. Custom workout + Indian diet plans. NASM certified. From ₹1,299/month.',
    heroLead: 'Fitness Coaching',
    heroTail: 'Built for Men',
    intro:
      "Whether you want to build muscle, shed stubborn belly fat, get stronger, or finally look the way you train, random Instagram routines won't get you there. Coach Himanshu gives you a NASM-certified plan built for your body, your goal, and your schedule — with a diet based on real Indian food and the accountability to actually stay consistent.",
    goalChipsHeading: 'What We Help Men With',
    goalChipsSub: 'Clear goals, a real plan, and progressive training that keeps delivering results.',
    goalChips: [
      'Muscle building',
      'Belly & love-handle fat loss',
      'Strength & power',
      'Skinny to fit',
      'Weight gain for hardgainers',
      'Stamina & conditioning',
      'Body recomposition',
      'Busy-professional routines',
    ],
    reasons: [
      {
        title: 'Progressive, Not Random',
        description:
          'Real muscle and strength come from progressive overload and a structured plan — not a different workout every day. You get a system that keeps producing results month after month.',
      },
      {
        title: 'Lose the Belly Fat for Good',
        description:
          'Targeted fat-loss programming plus a sustainable Indian diet, so you lose the gut without crash dieting — and keep it off.',
      },
      {
        title: 'Home or Gym — Your Call',
        description:
          'Training at home with basic equipment or hitting a full gym, your plan is built around what you have access to, with video tutorials for every exercise.',
      },
      {
        title: 'Eat Big or Lean on Indian Food',
        description:
          'Bulking or cutting, your diet is built from roti, rice, dal, paneer, eggs, and chicken — portioned to your goal. No bland “diet food,” no imported supplements required.',
      },
      {
        title: 'NASM Certified Coaching',
        description:
          'Coach Himanshu holds NASM certification and 6+ professional diplomas. You get science-backed training and nutrition — not gym-bro myths.',
      },
      {
        title: 'Accountability That Sticks',
        description:
          'Weekly check-ins and 24/7 WhatsApp support keep you consistent even with a demanding job. Consistency is what actually builds the physique.',
      },
    ],
    steps: [
      {
        number: '01',
        title: 'Take the Free Assessment',
        description:
          'Tell us your goal — muscle, fat loss, strength, or weight gain — plus your training experience, schedule, and food preferences.',
      },
      {
        number: '02',
        title: 'Get Your Custom Plan',
        description:
          'Receive a progressive workout and a calorie/macro-matched Indian diet plan for home or gym, tailored to your goal.',
      },
      {
        number: '03',
        title: 'Train With Guidance',
        description:
          'Follow video tutorials, weekly consultations, and 24/7 WhatsApp support. Your program adjusts as you get stronger.',
      },
      {
        number: '04',
        title: 'Build the Body You Train For',
        description:
          'Track strength and measurements with regular reviews and see steady, visible change — muscle, definition, and performance.',
      },
    ],
    plans: [
      {
        name: 'Kickstart Plan',
        duration: '1 Month',
        price: '₹1,299',
        perMonth: '₹1,299/month',
        features: [
          'Customised workout plan',
          'Personalised diet plan',
          'Gym workout video tutorials',
          'Weekly one-on-one consultation',
          'Supplement guidance',
          'WhatsApp support',
        ],
      },
      {
        name: 'Consistency Plan',
        duration: '3 Months',
        price: '₹2,899',
        perMonth: '₹966/month',
        popular: true,
        features: [
          'Customised workout plan',
          'Personalised diet plan',
          'Video tutorials',
          'Weekly one-on-one consultation',
          'Supplement guidance',
          'WhatsApp support',
          'Lifestyle coaching',
        ],
      },
      {
        name: 'Mastery Plan',
        duration: '12 Months',
        price: '₹9,999',
        perMonth: '₹833/month',
        features: [
          'Fully customised workout plan',
          'Personalised diet plan',
          'Full video library access',
          'Weekly one-on-one consultation',
          'Supplement guidance',
          'WhatsApp support',
          'Lifestyle coaching',
          'Pause option',
        ],
      },
      {
        name: 'Elite 1:1 Coaching',
        duration: '1 Month',
        price: '₹7,999',
        perMonth: '12 live sessions',
        features: [
          'Live 1-on-1 online personal training',
          'Real-time form correction',
          'Personalised workout & diet plan',
          'Habit & progress tracking',
          'Direct coach support',
        ],
      },
    ],
    faqs: [
      {
        question: 'Can I build muscle with online coaching at home?',
        answer:
          'Yes. With a progressive plan, the right nutrition, and consistency, you can build real muscle at home using bodyweight exercises, resistance bands, or a basic set of dumbbells. Coach Himanshu designs your program around the equipment you have and applies progressive overload so you keep gaining. A gym makes it faster, but it is not required.',
      },
      {
        question: 'How do I lose belly fat specifically?',
        answer:
          'You cannot spot-reduce fat, but you can lose overall body fat — including the belly — with a sustainable calorie deficit, strength training, and enough protein. Coach Himanshu builds a fat-loss plan using real Indian food and a training routine that protects muscle while you lean out, so the results actually last.',
      },
      {
        question: 'I’m skinny and can’t gain weight. Can you help?',
        answer:
          'Yes. Hardgainers need a structured calorie surplus, enough protein, and heavy compound training. Coach Himanshu builds a weight-gain plan around calorie-dense Indian foods and progressive lifting so you add lean size, not just fat. See our full guide on gaining weight for skinny guys for the approach.',
      },
      {
        question: 'I have a busy job — how much time do I need?',
        answer:
          'Most plans are built around 3–5 focused sessions a week, and workouts can be kept to 45–60 minutes. Coach Himanshu designs your routine around your actual schedule, and weekly check-ins plus WhatsApp support keep you on track even during busy weeks.',
      },
      {
        question: 'What qualifications does Coach Himanshu have?',
        answer:
          'Coach Himanshu is a NASM Certified Bodybuilding Coach with 6+ professional diplomas in personal training, sports nutrition, TRX suspension training, and special-population training — so your program is genuinely science-backed.',
      },
    ],
    relatedBlogs: [
      { title: 'Best Diet Plan for Muscle Building in India', href: '/blog/best-diet-plan-for-muscle-building-in-india' },
      { title: 'How to Fix Belly Fat: Science-Based Guide for Indians', href: '/blog/how-to-fix-belly-fat-science-based-guide-for-indians' },
      { title: 'How to Gain Weight for Skinny Guys: Indian Diet Plan', href: '/blog/how-to-gain-weight-for-skinny-guys-indian-diet-plan' },
    ],
    ctaTitle: 'Ready to Build the Body You Train For?',
    ctaText:
      'Join 1000+ clients transforming with a plan built for their goal. Start with a free consultation — no payment required.',
  },

  {
    slug: 'family',
    audience: 'Families & Couples',
    metaTitle: 'Couple & Family Fitness Coaching Online',
    metaDescription:
      'Get fit together with online couple & family fitness coaching in India. Shared goals, paired workout + diet plans, and built-in accountability. Couple plans from ₹4,299.',
    heroLead: 'Get Fit',
    heroTail: 'Together',
    intro:
      'The people who train together, stay consistent together. Coach Himanshu’s couple and family coaching gives each of you your own personalised workout and diet plan, while you share the journey, the accountability, and the wins. It’s the easiest way to make health a family habit — and couple plans cost less per person than coaching individually.',
    goalChipsHeading: 'Why Train as a Couple or Family',
    goalChipsSub: 'Two people, two personalised plans, one shared goal — and each other to stay accountable to.',
    goalChips: [
      'Built-in accountability',
      'Individual plans for each person',
      'Better value per person',
      'Train together at home',
      'Shared healthy meals',
      'Weight loss as a team',
      'Post-wedding fitness',
      'A healthier family routine',
    ],
    reasons: [
      {
        title: 'Accountability That Actually Works',
        description:
          'The hardest part of fitness is showing up. When your partner or family is on the same plan, you keep each other going on the days motivation runs low.',
      },
      {
        title: 'A Personalised Plan for Each Person',
        description:
          'You are not squeezed into one shared routine. Each person gets their own workout and diet plan for their body and goal — you just travel the journey together.',
      },
      {
        title: 'Better Value Together',
        description:
          'Couple plans are priced lower per person than individual coaching, so getting fit as a pair costs less — while doubling your motivation.',
      },
      {
        title: 'Train at Home, Together',
        description:
          'Couple home-workout plans let you train in your own space with minimal equipment — no scheduling two separate gym trips around work and kids.',
      },
      {
        title: 'One Kitchen, Aligned Meals',
        description:
          'Your diet plans are designed to work from the same Indian kitchen, so cooking is simple and nobody feels like they are eating “different” food.',
      },
      {
        title: 'Guidance for Every Level',
        description:
          'Whether one of you trains regularly and the other is starting from zero, Coach Himanshu matches each plan to the right level — with video tutorials for both.',
      },
    ],
    steps: [
      {
        number: '01',
        title: 'Take the Free Assessment',
        description:
          'Each person shares their goals, fitness level, and food preferences so both plans are personalised — while staying easy to run from one home.',
      },
      {
        number: '02',
        title: 'Get Two Custom Plans',
        description:
          'Receive individual workout and diet plans for each person, aligned so you can train together and share meals from the same kitchen.',
      },
      {
        number: '03',
        title: 'Train Together',
        description:
          'Follow video tutorials, weekly check-ins, and 24/7 WhatsApp support — and keep each other accountable every single week.',
      },
      {
        number: '04',
        title: 'Transform as a Team',
        description:
          'Track both journeys with regular reviews and celebrate milestones together, turning fitness into a lasting family habit.',
      },
    ],
    plans: [
      {
        name: 'Couple Home Workout',
        duration: '3 Months',
        price: '₹4,299',
        perMonth: 'for two people',
        features: [
          'Individual home workout plan for each',
          'Personalised diet plan for each',
          'Exercise video tutorials',
          'Weekly consultations',
          'WhatsApp support',
        ],
      },
      {
        name: 'Couple Strength',
        duration: '6 Months',
        price: '₹8,999',
        perMonth: 'for two people',
        popular: true,
        features: [
          'Individual workout plan for each',
          'Personalised diet plan for each',
          'Full video library access',
          'Weekly consultations',
          'Supplement guidance',
          'WhatsApp support',
        ],
      },
      {
        name: 'Couple Mastery',
        duration: '12 Months',
        price: '₹17,999',
        perMonth: 'for two people',
        features: [
          'Individual workout & diet plans',
          'Full video library access',
          'Weekly consultations',
          'Supplement guidance',
          'WhatsApp support',
          'Lifestyle coaching',
          'Pause option',
        ],
      },
      {
        name: 'Elite 1:1 Couple',
        duration: '1 Month',
        price: '₹12,999',
        perMonth: '12 live sessions',
        features: [
          'Live 1-on-1 sessions for the couple',
          'Real-time form correction',
          'Individual workout & diet plans',
          'Habit & progress tracking',
          'Direct coach support',
        ],
      },
    ],
    faqs: [
      {
        question: 'How does couple fitness coaching work?',
        answer:
          'Each person completes their own assessment and receives an individual workout and diet plan built for their body and goal. The plans are aligned so you can train together and eat from the same kitchen, and you both get weekly check-ins and 24/7 WhatsApp support. You share the accountability and motivation while still following a plan that is right for you.',
      },
      {
        question: 'Do both people get separate plans?',
        answer:
          'Yes. A couple or family plan is not one shared routine — every person gets their own personalised workout and nutrition plan. What you share is the journey, the accountability, and a better price per person than coaching individually.',
      },
      {
        question: 'Is a couple plan cheaper than two individual plans?',
        answer:
          'Yes. Couple plans are priced lower per person than buying two separate individual plans, so training together costs less while keeping you both far more consistent. Couple plans start at ₹4,299 for two people.',
      },
      {
        question: 'What if we have different fitness levels or goals?',
        answer:
          'That is completely fine and very common. Coach Himanshu builds each plan to the right level and goal — one of you might be losing fat while the other builds muscle, or one is a beginner and the other advanced. You still train together and keep each other accountable.',
      },
      {
        question: 'Can we train at home instead of a gym?',
        answer:
          'Yes. Couple home-workout plans are designed to be done at home with minimal equipment, so you do not need to coordinate two gym trips around work and family. Video tutorials make sure both of you use correct form.',
      },
    ],
    relatedBlogs: [
      { title: 'Couple Workout Plan: Train Together in India', href: '/blog/couple-workout-plan-train-together-transform-together' },
      { title: 'Top 10 Home Workout Exercises for Beginners in India', href: '/blog/top-10-home-workout-exercises-for-beginners-in-india' },
      { title: 'How to Lose Weight Without Going to the Gym', href: '/blog/how-to-lose-weight-without-going-to-the-gym' },
    ],
    ctaTitle: 'Ready to Get Fit Together?',
    ctaText:
      'Start your transformation as a couple or family with a free consultation for each person — no payment required.',
  },
];

export function getAudienceBySlug(slug: string): AudienceData | undefined {
  return AUDIENCES.find((a) => a.slug === slug);
}

export function getAllAudienceSlugs(): string[] {
  return AUDIENCES.map((a) => a.slug);
}
