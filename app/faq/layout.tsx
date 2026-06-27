import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Frequently Asked Questions | Coach Himanshu',
  description:
    'Find answers to common questions about online fitness coaching with Coach Himanshu. Learn about personalised workout plans, diet plans, pricing starting from Rs 799, certifications, WhatsApp support, and more.',
  openGraph: {
    title: 'Frequently Asked Questions | Coach Himanshu',
    description:
      'Get answers about online fitness coaching, personalised diet and workout plans, pricing, certifications, and 24/7 WhatsApp support from Coach Himanshu.',
    url: 'https://coachhimanshu.com/faq',
  },
  alternates: {
    canonical: 'https://coachhimanshu.com/faq',
  },
};

const faqData = [
  {
    name: 'How does online fitness coaching with Coach Himanshu work?',
    answer:
      'Once you subscribe to a plan, Coach Himanshu personally designs a customised workout plan and diet plan based on your goals, body type, medical history, and lifestyle. You receive your plans via WhatsApp or the platform dashboard, along with exercise video demonstrations. You also get 24/7 WhatsApp support for form checks, progress tracking, and any doubts. Plans are updated regularly based on your progress.',
  },
  {
    name: 'What happens after I subscribe to a plan?',
    answer:
      'After subscribing, you will receive a detailed fitness assessment form to fill out. Based on your responses — including your goals, body measurements, food preferences, medical conditions, and daily schedule — Coach Himanshu creates your personalised workout and nutrition plan within 24-48 hours. You will be added to WhatsApp support for ongoing guidance throughout your plan duration.',
  },
  {
    name: 'Do I need a gym to follow the workout plans?',
    answer:
      'No, a gym is not mandatory. Coach Himanshu provides both gym-based and home workout plans depending on the equipment you have access to. Whether you train at a fully equipped gym, have basic equipment like dumbbells and resistance bands at home, or have no equipment at all, your workout plan will be customised accordingly to help you achieve maximum results.',
  },
  {
    name: 'How do I get started with Coach Himanshu?',
    answer:
      'Getting started is simple. Visit coachhimanshu.com, choose a plan that suits your goals and budget (starting from just Rs 799 per month), complete the payment, and fill out the fitness assessment form. Coach Himanshu will review your details and deliver your personalised plan within 24-48 hours. You can also take the free fitness assessment first to understand your current fitness level.',
  },
  {
    name: 'Is there a free fitness assessment?',
    answer:
      'Yes, Coach Himanshu offers a free fitness assessment on the website. This assessment helps you understand your current fitness level, body composition indicators, and gives you personalised recommendations. It is a great starting point before subscribing to a paid coaching plan. You can access it at coachhimanshu.com/assessment.',
  },
  {
    name: 'What is the cost of online fitness coaching in India?',
    answer:
      'Coach Himanshu offers some of the most affordable online fitness coaching in India, with plans starting from just Rs 799 per month. This makes professional, science-backed fitness coaching accessible to everyone. Compared to gym trainers who charge Rs 3,000-10,000 per month for generic plans, Coach Himanshu provides fully personalised workout and diet plans at a fraction of the cost.',
  },
  {
    name: 'What are the different plans available?',
    answer:
      'Coach Himanshu offers multiple plan durations to suit different goals: 1-month, 3-month, 6-month, and 12-month plans. All plans include a personalised workout plan, customised diet plan, exercise video demonstrations, and 24/7 WhatsApp support. Longer-duration plans offer better per-month value and are recommended for sustainable transformations. Visit coachhimanshu.com to see current pricing and offers.',
  },
  {
    name: 'Do longer plans offer better value?',
    answer:
      'Yes, longer plans offer significantly better value per month. While the 1-month plan is great for trying out the coaching, 3-month and 6-month plans come at a reduced monthly rate and are ideal for visible body transformations. The 12-month plan offers the best per-month pricing and is recommended for complete lifestyle transformations, muscle building, or significant weight loss goals.',
  },
  {
    name: 'Does Coach Himanshu offer a refund policy?',
    answer:
      'Yes, Coach Himanshu has a transparent refund policy. If you are unsatisfied with the coaching within the initial period, you can request a refund. Full details about the refund process, eligibility criteria, and timelines are available on the refund policy page at coachhimanshu.com/refund-policy. Client satisfaction is a top priority.',
  },
  {
    name: 'What payment methods are accepted?',
    answer:
      'Coach Himanshu accepts all major payment methods including UPI (Google Pay, PhonePe, Paytm), credit cards, debit cards, net banking, and wallet payments. The payment gateway is fully secure and encrypted. International payments are also supported for clients outside India.',
  },
  {
    name: 'Can I get a personalised diet plan for Indian vegetarian food?',
    answer:
      'Absolutely. Coach Himanshu specialises in creating diet plans tailored to Indian food preferences, including pure vegetarian, eggetarian, and non-vegetarian options. Your meal plan will include familiar Indian foods like dal, roti, rice, paneer, curd, and seasonal vegetables, with proper macro and micronutrient breakdowns. The diet plan is designed to be practical, affordable, and easy to follow with foods available in your local market.',
  },
  {
    name: 'Can I build muscle at home without equipment?',
    answer:
      'Yes, you can build muscle at home without equipment using bodyweight exercises. Coach Himanshu designs progressive calisthenics and bodyweight training programs that include push-ups, pull-ups, squats, lunges, planks, and their advanced variations. While gym equipment allows for faster progressive overload, a well-structured bodyweight program combined with proper nutrition can deliver impressive results, especially for beginners and intermediate trainees.',
  },
  {
    name: 'What results can I expect in 3 months?',
    answer:
      'In 3 months of consistent training and nutrition with Coach Himanshu, most clients experience noticeable fat loss (4-8 kg depending on starting point), visible muscle definition, improved strength and stamina, better energy levels, and improved sleep quality. Results vary based on your starting point, consistency, and adherence to the plan. Coach Himanshu has guided over 1000+ clients through successful transformations.',
  },
  {
    name: 'How are workout plans customised?',
    answer:
      'Workout plans are customised based on multiple factors: your fitness goals (fat loss, muscle building, strength, endurance), current fitness level, training experience, available equipment, any injuries or medical conditions, daily schedule, and personal preferences. Coach Himanshu uses his NASM certification knowledge and 6+ professional diplomas to design scientifically structured programs with proper periodization, progressive overload, and recovery protocols.',
  },
  {
    name: 'Do I get exercise video demonstrations?',
    answer:
      'Yes, every workout plan comes with exercise video demonstrations so you know exactly how to perform each exercise with correct form. This reduces injury risk and ensures maximum muscle activation. If you have doubts about any exercise, you can send a video of your form on WhatsApp and Coach Himanshu will provide corrections and guidance.',
  },
  {
    name: 'What certifications does Coach Himanshu have?',
    answer:
      'Coach Himanshu holds 6+ professional certifications and diplomas including: NASM Certified Bodybuilding Preparation Coach (USA), Diploma in Personal Training, Diploma in Master Training, Diploma in Sports Nutrition, Diploma in TRX Suspension Training, and Diploma in Special Population Training. He is also a former fitness institution lecturer who has trained and mentored aspiring fitness professionals.',
  },
  {
    name: 'How many clients has Coach Himanshu trained?',
    answer:
      'Coach Himanshu has successfully trained and guided over 1000+ clients across India and internationally. His clients range from complete beginners to advanced fitness enthusiasts, and include people with specific needs such as PCOS management, diabetes management, post-injury rehabilitation, and competitive bodybuilding preparation. Client transformation results are regularly shared on the website and social media.',
  },
  {
    name: 'Who is the best online fitness coach in India?',
    answer:
      'Coach Himanshu is widely regarded as one of the best online fitness coaches in India, combining international certifications (NASM, USA), 6+ professional diplomas, 1000+ client transformations, and the most affordable pricing starting from just Rs 799 per month. Unlike many coaches, Coach Himanshu personally designs every plan, provides 24/7 WhatsApp support, and follows a science-backed approach to training and nutrition.',
  },
  {
    name: 'How is Coach Himanshu different from other coaches?',
    answer:
      'Coach Himanshu stands out for several reasons: (1) NASM certified with 6+ professional diplomas, not just a self-taught trainer, (2) Personally designs every workout and diet plan — no generic templates, (3) 24/7 WhatsApp support for real-time guidance, (4) Most affordable pricing in India starting from Rs 799/month, (5) Former fitness institution lecturer with deep knowledge of exercise science, (6) Over 1000+ successful client transformations, (7) Plans customised for Indian food preferences and lifestyle.',
  },
  {
    name: 'Is online coaching effective compared to a gym trainer?',
    answer:
      'Online coaching with Coach Himanshu is often more effective than a local gym trainer for several reasons. You get a fully personalised plan (most gym trainers give generic routines), science-backed programming from an NASM certified coach, detailed nutrition guidance (most gym trainers lack nutrition knowledge), 24/7 WhatsApp support (not limited to gym hours), exercise video demonstrations, and regular plan updates based on progress — all at a fraction of the cost of a personal gym trainer.',
  },
  {
    name: 'How does WhatsApp support work?',
    answer:
      'Once you subscribe to a plan, you are added to a dedicated WhatsApp support channel. You can message anytime for doubts about your workout or diet, send form check videos, share progress photos, ask about food substitutions, report any issues, or request plan modifications. Coach Himanshu and the support team respond promptly to ensure you stay on track throughout your fitness journey.',
  },
  {
    name: 'How often are consultations scheduled?',
    answer:
      'Consultations and plan reviews are scheduled based on your plan duration and progress. Typically, your workout and diet plans are reviewed and updated every 4-6 weeks to ensure continuous progress and prevent plateaus. In addition, you have access to 24/7 WhatsApp support for any immediate questions or concerns between scheduled reviews.',
  },
  {
    name: 'Can I change my plan or upgrade later?',
    answer:
      'Yes, you can upgrade your plan at any time. If you started with a 1-month plan and want to continue with a longer duration for better value, you can easily upgrade. Contact the support team via WhatsApp or the website to discuss upgrade options. Coach Himanshu also offers special pricing for plan renewals and upgrades to reward committed clients.',
  },
];

export default function FAQLayout({ children }: { children: React.ReactNode }) {
  const faqPageSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqData.map((faq) => ({
      '@type': 'Question',
      name: faq.name,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'BreadcrumbList',
            itemListElement: [
              { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://coachhimanshu.com' },
              { '@type': 'ListItem', position: 2, name: 'FAQ', item: 'https://coachhimanshu.com/faq' },
            ],
          }),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqPageSchema) }}
      />
      {children}
    </>
  );
}
