'use client';

import { motion } from 'framer-motion';
import { ChevronRight, ArrowRight, ClipboardCheck, CreditCard, Dumbbell, UserCheck, MessageCircle } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import AnnouncementBar from '@/components/AnnouncementBar';

const fadeInUp = {
  initial: { opacity: 0, y: 60 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.6 },
};

const categories = [
  {
    title: 'Getting Started',
    icon: ClipboardCheck,
    questions: [
      {
        q: 'How does online fitness coaching with Coach Himanshu work?',
        a: 'Once you subscribe to a plan, Coach Himanshu personally designs a customised workout plan and diet plan based on your goals, body type, medical history, and lifestyle. You receive your plans via WhatsApp or the platform dashboard, along with exercise video demonstrations. You also get 24/7 WhatsApp support for form checks, progress tracking, and any doubts. Plans are updated regularly based on your progress.',
      },
      {
        q: 'What happens after I subscribe to a plan?',
        a: 'After subscribing, you will receive a detailed fitness assessment form to fill out. Based on your responses — including your goals, body measurements, food preferences, medical conditions, and daily schedule — Coach Himanshu creates your personalised workout and nutrition plan within 24-48 hours. You will be added to WhatsApp support for ongoing guidance throughout your plan duration.',
      },
      {
        q: 'Do I need a gym to follow the workout plans?',
        a: 'No, a gym is not mandatory. Coach Himanshu provides both gym-based and home workout plans depending on the equipment you have access to. Whether you train at a fully equipped gym, have basic equipment like dumbbells and resistance bands at home, or have no equipment at all, your workout plan will be customised accordingly to help you achieve maximum results.',
      },
      {
        q: 'How do I get started with Coach Himanshu?',
        a: 'Getting started is simple. Visit coachhimanshu.com, choose a plan that suits your goals and budget (starting from just Rs 799 per month), complete the payment, and fill out the fitness assessment form. Coach Himanshu will review your details and deliver your personalised plan within 24-48 hours. You can also take the free fitness assessment first to understand your current fitness level.',
      },
      {
        q: 'Is there a free fitness assessment?',
        a: 'Yes, Coach Himanshu offers a free fitness assessment on the website. This assessment helps you understand your current fitness level, body composition indicators, and gives you personalised recommendations. It is a great starting point before subscribing to a paid coaching plan. You can access it at coachhimanshu.com/assessment.',
      },
    ],
  },
  {
    title: 'Pricing & Plans',
    icon: CreditCard,
    questions: [
      {
        q: 'What is the cost of online fitness coaching in India?',
        a: 'Coach Himanshu offers some of the most affordable online fitness coaching in India, with plans starting from just Rs 799 per month. This makes professional, science-backed fitness coaching accessible to everyone. Compared to gym trainers who charge Rs 3,000-10,000 per month for generic plans, Coach Himanshu provides fully personalised workout and diet plans at a fraction of the cost.',
      },
      {
        q: 'What are the different plans available?',
        a: 'Coach Himanshu offers multiple plan durations to suit different goals: 1-month, 3-month, 6-month, and 12-month plans. All plans include a personalised workout plan, customised diet plan, exercise video demonstrations, and 24/7 WhatsApp support. Longer-duration plans offer better per-month value and are recommended for sustainable transformations. Visit coachhimanshu.com to see current pricing and offers.',
      },
      {
        q: 'Do longer plans offer better value?',
        a: 'Yes, longer plans offer significantly better value per month. While the 1-month plan is great for trying out the coaching, 3-month and 6-month plans come at a reduced monthly rate and are ideal for visible body transformations. The 12-month plan offers the best per-month pricing and is recommended for complete lifestyle transformations, muscle building, or significant weight loss goals.',
      },
      {
        q: 'Does Coach Himanshu offer a refund policy?',
        a: 'Yes, Coach Himanshu has a transparent refund policy. If you are unsatisfied with the coaching within the initial period, you can request a refund. Full details about the refund process, eligibility criteria, and timelines are available on the refund policy page at coachhimanshu.com/refund-policy. Client satisfaction is a top priority.',
      },
      {
        q: 'What payment methods are accepted?',
        a: 'Coach Himanshu accepts all major payment methods including UPI (Google Pay, PhonePe, Paytm), credit cards, debit cards, net banking, and wallet payments. The payment gateway is fully secure and encrypted. International payments are also supported for clients outside India.',
      },
    ],
  },
  {
    title: 'Training & Nutrition',
    icon: Dumbbell,
    questions: [
      {
        q: 'Can I get a personalised diet plan for Indian vegetarian food?',
        a: 'Absolutely. Coach Himanshu specialises in creating diet plans tailored to Indian food preferences, including pure vegetarian, eggetarian, and non-vegetarian options. Your meal plan will include familiar Indian foods like dal, roti, rice, paneer, curd, and seasonal vegetables, with proper macro and micronutrient breakdowns. The diet plan is designed to be practical, affordable, and easy to follow with foods available in your local market.',
      },
      {
        q: 'Can I build muscle at home without equipment?',
        a: 'Yes, you can build muscle at home without equipment using bodyweight exercises. Coach Himanshu designs progressive calisthenics and bodyweight training programs that include push-ups, pull-ups, squats, lunges, planks, and their advanced variations. While gym equipment allows for faster progressive overload, a well-structured bodyweight program combined with proper nutrition can deliver impressive results, especially for beginners and intermediate trainees.',
      },
      {
        q: 'What results can I expect in 3 months?',
        a: 'In 3 months of consistent training and nutrition with Coach Himanshu, most clients experience noticeable fat loss (4-8 kg depending on starting point), visible muscle definition, improved strength and stamina, better energy levels, and improved sleep quality. Results vary based on your starting point, consistency, and adherence to the plan. Coach Himanshu has guided over 1000+ clients through successful transformations.',
      },
      {
        q: 'How are workout plans customised?',
        a: 'Workout plans are customised based on multiple factors: your fitness goals (fat loss, muscle building, strength, endurance), current fitness level, training experience, available equipment, any injuries or medical conditions, daily schedule, and personal preferences. Coach Himanshu uses his NASM certification knowledge and 6+ professional diplomas to design scientifically structured programs with proper periodization, progressive overload, and recovery protocols.',
      },
      {
        q: 'Do I get exercise video demonstrations?',
        a: 'Yes, every workout plan comes with exercise video demonstrations so you know exactly how to perform each exercise with correct form. This reduces injury risk and ensures maximum muscle activation. If you have doubts about any exercise, you can send a video of your form on WhatsApp and Coach Himanshu will provide corrections and guidance.',
      },
    ],
  },
  {
    title: 'About Coach Himanshu',
    icon: UserCheck,
    questions: [
      {
        q: 'What certifications does Coach Himanshu have?',
        a: 'Coach Himanshu holds 6+ professional certifications and diplomas including: NASM Certified Bodybuilding Preparation Coach (USA), Diploma in Personal Training, Diploma in Master Training, Diploma in Sports Nutrition, Diploma in TRX Suspension Training, and Diploma in Special Population Training. He is also a former fitness institution lecturer who has trained and mentored aspiring fitness professionals.',
      },
      {
        q: 'How many clients has Coach Himanshu trained?',
        a: 'Coach Himanshu has successfully trained and guided over 1000+ clients across India and internationally. His clients range from complete beginners to advanced fitness enthusiasts, and include people with specific needs such as PCOS management, diabetes management, post-injury rehabilitation, and competitive bodybuilding preparation. Client transformation results are regularly shared on the website and social media.',
      },
      {
        q: 'Who is the best online fitness coach in India?',
        a: 'Coach Himanshu is widely regarded as one of the best online fitness coaches in India, combining international certifications (NASM, USA), 6+ professional diplomas, 1000+ client transformations, and the most affordable pricing starting from just Rs 799 per month. Unlike many coaches, Coach Himanshu personally designs every plan, provides 24/7 WhatsApp support, and follows a science-backed approach to training and nutrition.',
      },
      {
        q: 'How is Coach Himanshu different from other coaches?',
        a: 'Coach Himanshu stands out for several reasons: (1) NASM certified with 6+ professional diplomas, not just a self-taught trainer, (2) Personally designs every workout and diet plan — no generic templates, (3) 24/7 WhatsApp support for real-time guidance, (4) Most affordable pricing in India starting from Rs 799/month, (5) Former fitness institution lecturer with deep knowledge of exercise science, (6) Over 1000+ successful client transformations, (7) Plans customised for Indian food preferences and lifestyle.',
      },
      {
        q: 'Is online coaching effective compared to a gym trainer?',
        a: 'Online coaching with Coach Himanshu is often more effective than a local gym trainer for several reasons. You get a fully personalised plan (most gym trainers give generic routines), science-backed programming from an NASM certified coach, detailed nutrition guidance (most gym trainers lack nutrition knowledge), 24/7 WhatsApp support (not limited to gym hours), exercise video demonstrations, and regular plan updates based on progress — all at a fraction of the cost of a personal gym trainer.',
      },
    ],
  },
  {
    title: 'Support & Communication',
    icon: MessageCircle,
    questions: [
      {
        q: 'How does WhatsApp support work?',
        a: 'Once you subscribe to a plan, you are added to a dedicated WhatsApp support channel. You can message anytime for doubts about your workout or diet, send form check videos, share progress photos, ask about food substitutions, report any issues, or request plan modifications. Coach Himanshu and the support team respond promptly to ensure you stay on track throughout your fitness journey.',
      },
      {
        q: 'How often are consultations scheduled?',
        a: 'Consultations and plan reviews are scheduled based on your plan duration and progress. Typically, your workout and diet plans are reviewed and updated every 4-6 weeks to ensure continuous progress and prevent plateaus. In addition, you have access to 24/7 WhatsApp support for any immediate questions or concerns between scheduled reviews.',
      },
      {
        q: 'Can I change my plan or upgrade later?',
        a: 'Yes, you can upgrade your plan at any time. If you started with a 1-month plan and want to continue with a longer duration for better value, you can easily upgrade. Contact the support team via WhatsApp or the website to discuss upgrade options. Coach Himanshu also offers special pricing for plan renewals and upgrades to reward committed clients.',
      },
    ],
  },
];

export default function FAQPage() {
  return (
    <>
      <AnnouncementBar />
      <Navbar />
      <div className="min-h-screen bg-brand-navy">
        {/* Hero Section */}
        <section className="relative pt-28 md:pt-36 pb-12 md:pb-16 overflow-hidden">
          <div className="absolute inset-0">
            <div className="absolute top-20 left-10 w-[400px] h-[400px] bg-brand-blue/[0.05] rounded-full blur-[150px] animate-glow-pulse"></div>
            <div className="absolute bottom-10 right-10 w-[500px] h-[500px] bg-brand-blue/[0.04] rounded-full blur-[180px] animate-glow-pulse" style={{ animationDelay: '2s' }}></div>
          </div>

          <div className="max-w-4xl mx-auto px-4 md:px-6 relative z-10 text-center">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.6 }}
              className="inline-block mb-6"
            >
              <span className="px-6 py-2.5 rounded-full border border-white/[0.08] backdrop-blur-md text-blue-300/80 font-medium text-xs tracking-wider uppercase" style={{ background: 'linear-gradient(135deg, rgba(23,95,255,0.08) 0%, rgba(23,95,255,0.02) 100%)' }}>
                GOT QUESTIONS? WE HAVE ANSWERS
              </span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-white via-brand-blue to-brand-gold bg-clip-text text-transparent leading-tight"
            >
              Frequently Asked Questions
            </motion.h1>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="text-lg md:text-xl text-gray-300 max-w-2xl mx-auto leading-relaxed"
            >
              Everything you need to know about online fitness coaching with Coach Himanshu — from plans and pricing to training, nutrition, and support.
            </motion.p>
          </div>
        </section>

        {/* FAQ Categories */}
        <section className="py-8 md:py-12 px-4">
          <div className="max-w-4xl mx-auto space-y-10 md:space-y-14">
            {categories.map((category, catIndex) => {
              const Icon = category.icon;
              return (
                <motion.div
                  key={category.title}
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: catIndex * 0.05 }}
                >
                  {/* Category Heading */}
                  <div className="flex items-center gap-3 mb-5">
                    <div className="w-10 h-10 bg-gradient-to-br from-brand-blue to-brand-gold rounded-xl flex items-center justify-center flex-shrink-0">
                      <Icon className="w-5 h-5 text-white" />
                    </div>
                    <h2 className="text-2xl md:text-3xl font-bold text-white">
                      {category.title}
                    </h2>
                  </div>

                  {/* Questions */}
                  <div className="space-y-3">
                    {category.questions.map((faq, index) => (
                      <motion.details
                        key={index}
                        className="group bg-white/5 border border-white/10 rounded-xl overflow-hidden"
                        initial={{ opacity: 0, y: 10 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: index * 0.05 }}
                      >
                        <summary className="flex items-center justify-between cursor-pointer px-4 md:px-6 py-4 text-white font-medium text-sm md:text-lg hover:bg-white/5 transition-colors">
                          <span className="pr-2">{faq.q}</span>
                          <ChevronRight className="w-5 h-5 text-brand-blue transition-transform group-open:rotate-90 flex-shrink-0" />
                        </summary>
                        <div className="px-4 md:px-6 pb-4 text-gray-300 text-sm md:text-base leading-relaxed">
                          {faq.a}
                        </div>
                      </motion.details>
                    ))}
                  </div>
                </motion.div>
              );
            })}
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 md:py-24 px-4">
          <div className="max-w-4xl mx-auto">
            <motion.div
              {...fadeInUp}
              className="relative overflow-hidden rounded-3xl"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-brand-navy to-gray-900 opacity-95"></div>
              <div className="absolute top-0 right-0 w-64 h-64 bg-brand-gold rounded-full blur-3xl opacity-20 animate-pulse"></div>
              <div className="absolute bottom-0 left-0 w-64 h-64 bg-brand-blue rounded-full blur-3xl opacity-20 animate-pulse" style={{ animationDelay: '1s' }}></div>

              <div className="relative z-10 p-8 md:p-14 text-center">
                <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                  Still Have Questions?
                </h2>
                <p className="text-gray-300 text-lg mb-8 max-w-2xl mx-auto">
                  Take the free fitness assessment to get personalised recommendations, or explore our plans to start your transformation journey today.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <motion.a
                    href="/assessment"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-gradient-to-r from-brand-blue to-blue-600 text-white font-bold rounded-xl hover:shadow-[0_0_30px_rgba(23,95,255,0.5)] transition-all duration-300"
                  >
                    Free Fitness Assessment
                    <ArrowRight className="w-5 h-5" />
                  </motion.a>
                  <motion.a
                    href="/#plans"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-gradient-to-r from-brand-gold to-yellow-600 text-white font-bold rounded-xl hover:shadow-[0_0_30px_rgba(234,179,8,0.5)] transition-all duration-300"
                  >
                    View Plans & Pricing
                    <ArrowRight className="w-5 h-5" />
                  </motion.a>
                </div>
              </div>
            </motion.div>
          </div>
        </section>
      </div>
      <Footer />
    </>
  );
}
