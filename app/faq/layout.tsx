import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Frequently Asked Questions | Coach Himanshu',
  description:
    'Find answers to common questions about online fitness coaching with Coach Himanshu. Learn about personalised workout and diet plans, pricing (recorded coaching from ₹1,299, live 1-on-1 from ₹7,999), certifications, and support.',
  openGraph: {
    title: 'Frequently Asked Questions | Coach Himanshu',
    description:
      'Get answers about online fitness coaching, personalised diet and workout plans, pricing, certifications, and coach support from Coach Himanshu.',
    url: 'https://coachhimanshu.com/faq',
  },
  alternates: {
    canonical: 'https://coachhimanshu.com/faq',
  },
};

// Keep this list in exact sync with the visible questions in app/faq/page.tsx —
// it powers the FAQPage structured data (Google requires the schema to match
// the on-page content).
const faqData = [
  {
    name: 'How does online fitness coaching with Coach Himanshu work?',
    answer:
      "Once you subscribe, you receive a fully personalised fitness program based on your goals, current fitness level, lifestyle, medical history, and available equipment. Depending on your plan, you'll receive a customised workout plan, personalised diet plan, exercise tutorial videos, regular progress reviews through online meetings or live training sessions, in-app coach support, WhatsApp assistance, habit tracking, and transformation monitoring. Your program is continuously updated based on your progress to help you achieve sustainable long-term results.",
  },
  {
    name: 'What happens after I subscribe to a plan?',
    answer:
      "After your subscription is confirmed, you'll complete a detailed assessment covering your goals, lifestyle, medical history, training experience, and dietary preferences. Based on this information, your personalised workout and diet plans are created. You'll receive access to the app, exercise tutorials, tracking tools, and coach support. Depending on your subscription, you'll also begin your scheduled online review meetings or live personal training sessions, with regular updates to your program as you progress.",
  },
  {
    name: 'What is the cost of online fitness coaching in India?',
    answer:
      'The cost of online fitness coaching varies depending on the level of personalisation, support, and coaching provided. Coach Himanshu offers affordable plans starting from ₹1,299 for recorded coaching, while live 1-on-1 personal training plans start from ₹7,999. Members can choose between gym workout plans, home workout plans, rehabilitation programs, and live coaching based on their individual goals and budget.',
  },
  {
    name: 'How much does online personal training cost in India?',
    answer:
      "Online personal training fees in India vary depending on the trainer's experience and the level of support provided. Coach Himanshu's live 1-on-1 personal training plans start from ₹7,999 and include real-time coaching, personalised workout and diet plans, live form correction, progress monitoring, exercise tutorials, habit tracking, and direct coach support throughout your subscription.",
  },
  {
    name: 'Does Coach Himanshu offer a refund policy?',
    answer:
      'Due to the personalised nature of the coaching services, customised workout plans, diet plans, and digital resources, subscriptions are generally non-refundable once the coaching process has started. If you have any concerns regarding your subscription or require assistance, the Coach Himanshu support team will work with you to provide the most appropriate solution. Please review the Terms & Conditions before purchasing any subscription.',
  },
  {
    name: 'What is live 1-on-1 online personal training?',
    answer:
      'Live 1-on-1 online personal training is a real-time video session where Coach Himanshu trains only you — watching every rep, correcting your form on the spot, and adjusting the workout as you go, exactly like an in-person personal trainer standing beside you. Each Elite 1:1 session is 60 minutes, fully one-on-one, and you can train from your home or gym anywhere in the world. Packages start from ₹7,999 and include a personalised Indian diet plan and WhatsApp support. Full details are on the online personal trainer page.',
  },
  {
    name: 'Is a live 1-on-1 online personal trainer as effective as an in-person gym trainer?',
    answer:
      'Yes. In a live session your coach sees your full range of motion on video and corrects your technique in real time, so the coaching quality matches in-person training — while adding flexibility (train from home or while travelling), a much lower price than metro gym rates, and easier scheduling. What drives results is expert programming and consistency, not whether the coach is physically in the room.',
  },
  {
    name: 'Can I do live 1-on-1 personal training from home without equipment?',
    answer:
      'Yes. Coach Himanshu tailors each live session to whatever you have — a full gym, a few dumbbells at home, or just bodyweight. You tell him your setup in the free consultation and every session is programmed around your equipment, space, and goals.',
  },
  {
    name: 'How do I book a live 1-on-1 personal training session with Coach Himanshu?',
    answer:
      'Start with a free consultation on WhatsApp. Coach Himanshu learns your goals, schedule, and equipment, then recommends the right Elite 1:1 package (12, 24, 36, or 72 sessions). Once you enrol, you complete a short assessment, get your personalised plan, and book your first live session — usually within a day or two, at a time that suits your routine.',
  },
  {
    name: "Do I need a gym to follow Coach Himanshu's workout plans?",
    answer:
      "No. Coach Himanshu offers both gym and home workout programs. If you train at home, your workouts are designed using TRX Suspension Trainers, resistance bands, or bodyweight exercises. If you have access to a gym, you'll receive a gym-specific training program that makes use of available equipment. Every plan is customised according to your training environment.",
  },
  {
    name: 'Can I get a personalised diet plan for Indian food?',
    answer:
      'Yes. Every nutrition plan is customised according to your food preferences, lifestyle, daily routine, and fitness goals. Coach Himanshu provides practical Indian meal plans using easily available foods. Vegetarian, eggitarian, and non-vegetarian meal plans are available, making it easier to follow your nutrition plan consistently without relying on expensive or difficult-to-find foods.',
  },
  {
    name: 'Does Coach Himanshu provide vegetarian meal plans?',
    answer:
      'Yes. Coach Himanshu provides fully personalised vegetarian meal plans along with eggitarian and non-vegetarian options. Every diet plan is customised according to your calorie requirements, protein needs, food preferences, daily routine, and fitness goals while using practical Indian foods that are easy to prepare and follow.',
  },
  {
    name: 'Can I build muscle at home without gym equipment?',
    answer:
      "Yes. Muscle can be built at home with the right training program, progressive overload, proper nutrition, and consistency. Coach Himanshu's home workout plans utilise bodyweight exercises, resistance bands, and TRX Suspension Trainers to help improve strength, increase muscle mass, and enhance overall fitness without requiring a traditional gym.",
  },
  {
    name: 'What results can I expect in 3 months of online coaching?',
    answer:
      'Results vary depending on your starting point, consistency, nutrition, sleep, and adherence to the program. Within three months, many members experience improvements in strength, body composition, fitness levels, exercise technique, energy, confidence, and healthy lifestyle habits. The focus is on achieving sustainable progress through scientifically designed training and nutrition rather than unrealistic promises.',
  },
  {
    name: 'What certifications does Coach Himanshu have?',
    answer:
      'Coach Himanshu holds a progressive line of credentials built over his coaching career: Diploma in Personal Training, Diploma in Master Trainer, Diploma in Sport Nutrition, Diploma in TRX Suspension Training, Diploma in Special Population training, and a NASM Certification as a Bodybuilding Preparation Coach — giving him a broad, layered foundation across general fitness, nutrition, functional training, and physique competition prep.',
  },
  {
    name: 'How many clients has Coach Himanshu trained?',
    answer:
      'Since beginning his professional coaching journey in February 2021, Coach Himanshu has trained 1,000+ clients across India and internationally, spanning fat loss, muscle building, strength training, and rehabilitation goals — experience that now shapes the personalized coaching delivered through the Coach Himanshu platform, launched in December 2025.',
  },
  {
    name: 'Who is the best online fitness coach in India?',
    answer:
      'The best online fitness coach is someone who provides personalised coaching, evidence-based guidance, continuous accountability, and long-term support rather than generic workout plans. Coach Himanshu focuses on customised workout programming, personalised nutrition, progress tracking, habit building, regular coach interactions, and ongoing support to help members achieve sustainable results safely and effectively.',
  },
  {
    name: 'Is online coaching effective compared to a gym trainer?',
    answer:
      'Yes. A structured online coaching program can be just as effective as in-person training when it includes personalised programming, nutrition guidance, regular progress reviews, accountability, and continuous support. Coach Himanshu combines customised coaching, exercise tutorial videos, direct communication, habit tracking, and regular program updates to ensure members stay on track and continue progressing.',
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
