'use client';

import { motion } from 'framer-motion';
import { ChevronRight, ArrowRight, ClipboardCheck, CreditCard, Dumbbell, UserCheck } from 'lucide-react';
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
        a: "Once you subscribe, you receive a fully personalised fitness program based on your goals, current fitness level, lifestyle, medical history, and available equipment. Depending on your plan, you'll receive a customised workout plan, personalised diet plan, exercise tutorial videos, regular progress reviews through online meetings or live training sessions, in-app coach support, WhatsApp assistance, habit tracking, and transformation monitoring. Your program is continuously updated based on your progress to help you achieve sustainable long-term results.",
      },
      {
        q: 'What happens after I subscribe to a plan?',
        a: "After your subscription is confirmed, you'll complete a detailed assessment covering your goals, lifestyle, medical history, training experience, and dietary preferences. Based on this information, your personalised workout and diet plans are created. You'll receive access to the app, exercise tutorials, tracking tools, and coach support. Depending on your subscription, you'll also begin your scheduled online review meetings or live personal training sessions, with regular updates to your program as you progress.",
      },
    ],
  },
  {
    title: 'Pricing & Plans',
    icon: CreditCard,
    questions: [
      {
        q: 'What is the cost of online fitness coaching in India?',
        a: 'The cost of online fitness coaching varies depending on the level of personalisation, support, and coaching provided. Coach Himanshu offers affordable plans starting from ₹1,299 for recorded coaching, while live 1-on-1 personal training plans start from ₹7,999. Members can choose between gym workout plans, home workout plans, rehabilitation programs, and live coaching based on their individual goals and budget.',
      },
      {
        q: 'How much does online personal training cost in India?',
        a: "Online personal training fees in India vary depending on the trainer's experience and the level of support provided. Coach Himanshu's live 1-on-1 personal training plans start from ₹7,999 and include real-time coaching, personalised workout and diet plans, live form correction, progress monitoring, exercise tutorials, habit tracking, and direct coach support throughout your subscription.",
      },
      {
        q: 'Does Coach Himanshu offer a refund policy?',
        a: 'Due to the personalised nature of the coaching services, customised workout plans, diet plans, and digital resources, subscriptions are generally non-refundable once the coaching process has started. If you have any concerns regarding your subscription or require assistance, the Coach Himanshu support team will work with you to provide the most appropriate solution. Please review the Terms & Conditions before purchasing any subscription.',
      },
    ],
  },
  {
    title: 'Training & Nutrition',
    icon: Dumbbell,
    questions: [
      {
        q: "Do I need a gym to follow Coach Himanshu's workout plans?",
        a: "No. Coach Himanshu offers both gym and home workout programs. If you train at home, your workouts are designed using TRX Suspension Trainers, resistance bands, or bodyweight exercises. If you have access to a gym, you'll receive a gym-specific training program that makes use of available equipment. Every plan is customised according to your training environment.",
      },
      {
        q: 'Can I get a personalised diet plan for Indian food?',
        a: 'Yes. Every nutrition plan is customised according to your food preferences, lifestyle, daily routine, and fitness goals. Coach Himanshu provides practical Indian meal plans using easily available foods. Vegetarian, eggitarian, and non-vegetarian meal plans are available, making it easier to follow your nutrition plan consistently without relying on expensive or difficult-to-find foods.',
      },
      {
        q: 'Does Coach Himanshu provide vegetarian meal plans?',
        a: 'Yes. Coach Himanshu provides fully personalised vegetarian meal plans along with eggitarian and non-vegetarian options. Every diet plan is customised according to your calorie requirements, protein needs, food preferences, daily routine, and fitness goals while using practical Indian foods that are easy to prepare and follow.',
      },
      {
        q: 'Can I build muscle at home without gym equipment?',
        a: "Yes. Muscle can be built at home with the right training program, progressive overload, proper nutrition, and consistency. Coach Himanshu's home workout plans utilise bodyweight exercises, resistance bands, and TRX Suspension Trainers to help improve strength, increase muscle mass, and enhance overall fitness without requiring a traditional gym.",
      },
      {
        q: 'What results can I expect in 3 months of online coaching?',
        a: 'Results vary depending on your starting point, consistency, nutrition, sleep, and adherence to the program. Within three months, many members experience improvements in strength, body composition, fitness levels, exercise technique, energy, confidence, and healthy lifestyle habits. The focus is on achieving sustainable progress through scientifically designed training and nutrition rather than unrealistic promises.',
      },
    ],
  },
  {
    title: 'About Coach Himanshu',
    icon: UserCheck,
    questions: [
      {
        q: 'What certifications does Coach Himanshu have?',
        a: 'Coach Himanshu holds a progressive line of credentials built over his coaching career: Diploma in Personal Training, Diploma in Master Trainer, Diploma in Sport Nutrition, Diploma in TRX Suspension Training, Diploma in Special Population training, and a NASM Certification as a Bodybuilding Preparation Coach — giving him a broad, layered foundation across general fitness, nutrition, functional training, and physique competition prep.',
      },
      {
        q: 'How many clients has Coach Himanshu trained?',
        a: 'Since beginning his professional coaching journey in February 2021, Coach Himanshu has trained 1,000+ clients across India and internationally, spanning fat loss, muscle building, strength training, and rehabilitation goals — experience that now shapes the personalized coaching delivered through the Coach Himanshu platform, launched in December 2025.',
      },
      {
        q: 'Who is the best online fitness coach in India?',
        a: 'The best online fitness coach is someone who provides personalised coaching, evidence-based guidance, continuous accountability, and long-term support rather than generic workout plans. Coach Himanshu focuses on customised workout programming, personalised nutrition, progress tracking, habit building, regular coach interactions, and ongoing support to help members achieve sustainable results safely and effectively.',
      },
      {
        q: 'Is online coaching effective compared to a gym trainer?',
        a: 'Yes. A structured online coaching program can be just as effective as in-person training when it includes personalised programming, nutrition guidance, regular progress reviews, accountability, and continuous support. Coach Himanshu combines customised coaching, exercise tutorial videos, direct communication, habit tracking, and regular program updates to ensure members stay on track and continue progressing.',
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
            <div className="absolute top-20 left-10 w-[400px] h-[400px] rounded-full" style={{ background: 'radial-gradient(circle, rgba(23,95,255,0.05) 0%, transparent 70%)' }}></div>
            <div className="absolute bottom-10 right-10 w-[500px] h-[500px] rounded-full" style={{ background: 'radial-gradient(circle, rgba(23,95,255,0.04) 0%, transparent 70%)' }}></div>
          </div>

          <div className="max-w-4xl mx-auto px-4 md:px-6 relative z-10 text-center">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.6 }}
              className="inline-block mb-6"
            >
              <span className="px-6 py-2.5 rounded-full border border-white/[0.08] text-blue-300/80 font-medium text-xs tracking-wider uppercase" style={{ background: 'linear-gradient(135deg, rgba(23,95,255,0.08) 0%, rgba(23,95,255,0.02) 100%)' }}>
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
