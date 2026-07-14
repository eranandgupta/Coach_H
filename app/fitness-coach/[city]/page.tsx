import Link from 'next/link';
import { getCityBySlug, getAllCitySlugs } from '@/lib/cities';
import { notFound } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import AnnouncementBar from '@/components/AnnouncementBar';

export async function generateStaticParams() {
  return getAllCitySlugs().map(city => ({ city }));
}

export default function CityPage({ params }: { params: { city: string } }) {
  const city = getCityBySlug(params.city);
  if (!city) notFound();

  const plans = [
    {
      name: 'Kickstart Plan',
      duration: '1 Month',
      price: '₹1,099',
      perMonth: '₹1,099/month',
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
      price: '₹2,499',
      perMonth: '₹833/month',
      popular: true,
      features: [
        'Customised workout plan',
        'Personalised diet plan',
        'Gym workout video tutorials',
        'Weekly one-on-one consultation',
        'Supplement guidance',
        'WhatsApp support',
        'Lifestyle coaching',
      ],
    },
    {
      name: 'Home Workout Plan',
      duration: '1 Month',
      price: '₹799',
      perMonth: '₹799/month',
      features: [
        'Home workout plan (no equipment)',
        'Personalised diet plan',
        'Video tutorials',
        'Weekly one-on-one consultation',
        'WhatsApp support',
      ],
    },
    {
      name: 'Transformation Plan',
      duration: '6 Months',
      price: '₹4,299',
      perMonth: '₹716/month',
      features: [
        'Customised workout plan',
        'Personalised diet plan',
        'Full video library access',
        'Weekly one-on-one consultation',
        'Supplement guidance',
        'WhatsApp support',
        'Lifestyle coaching',
        'Pause option (7 days)',
      ],
    },
  ];

  const steps = [
    {
      number: '01',
      title: 'Take the Free Assessment',
      description: `Fill out a quick fitness assessment so Coach Himanshu understands your goals, lifestyle in ${city.name}, and dietary preferences.`,
    },
    {
      number: '02',
      title: 'Get Your Custom Plan',
      description: `Receive a personalized workout and meal plan tailored for ${city.name} residents, incorporating local foods like ${city.localFoods.slice(0, 3).join(', ')}.`,
    },
    {
      number: '03',
      title: 'Train with Expert Guidance',
      description: 'Follow your plan with video tutorials, weekly check-ins, and 24/7 WhatsApp support from Coach Himanshu.',
    },
    {
      number: '04',
      title: 'Transform Your Body',
      description: 'Track your progress with regular assessments and plan adjustments to ensure consistent results.',
    },
  ];

  const reasons = [
    {
      title: 'No Commute, No Excuses',
      description: `Skip ${city.name}'s traffic and crowded gyms. Train from your home near ${city.landmarks[0]} or your office with online coaching that fits your schedule.`,
    },
    {
      title: `${city.name}-Friendly Meal Plans`,
      description: `Your diet plan works with foods you already eat -- ${city.localFoods.slice(0, 3).join(', ')} and more. No bland "diet food" or expensive supplements required.`,
    },
    {
      title: 'NASM Certified Coach',
      description: 'Coach Himanshu holds 6+ professional diplomas including NASM certification. You get science-backed training, not random Instagram advice.',
    },
    {
      title: 'Affordable for Everyone',
      description: `Plans start at just ₹799/month -- less than what most ${city.name} residents spend on one restaurant meal. Professional coaching shouldn't break the bank.`,
    },
    {
      title: '24/7 WhatsApp Support',
      description: `Whether you're near ${city.landmarks[1]} or anywhere in ${city.state}, get instant answers to your fitness and diet questions via WhatsApp.`,
    },
    {
      title: '1000+ Transformations',
      description: `Join 1000+ clients across India, including many from ${city.name}, who have transformed their bodies and health with Coach Himanshu's guidance.`,
    },
  ];

  const faqs = [
    {
      question: `How does online fitness coaching work in ${city.name}?`,
      answer: `Online coaching with Coach Himanshu works the same whether you're in ${city.name} or anywhere in India. After completing a free assessment, you receive a personalized workout and diet plan on WhatsApp. You get weekly video consultations, exercise video tutorials, and 24/7 chat support. Everything is customized for your lifestyle in ${city.name}, including meal plans featuring local foods.`,
    },
    {
      question: `Can I follow the diet plan with ${city.name} local foods?`,
      answer: `Absolutely! Coach Himanshu creates meal plans using foods available in ${city.name} -- including ${city.localFoods.join(', ')}. The plans are designed to fit your food preferences and local cuisine while meeting your fitness goals. No expensive imported supplements or exotic ingredients required.`,
    },
    {
      question: `Do I need a gym membership in ${city.name}?`,
      answer: `Not necessarily! Coach Himanshu offers both gym-based plans (₹1,099/month) and home workout plans (₹799/month) that require zero equipment. Many clients in ${city.name} start with home workouts and transition to gym plans later.`,
    },
    {
      question: 'What qualifications does Coach Himanshu have?',
      answer: 'Coach Himanshu is a NASM Certified Bodybuilding Coach with 6+ professional diplomas in fitness science, nutrition, and specialized training including Corrective Exercise Specialist (CES), Sports Nutrition Specialist, and TRX Suspension Training certifications.',
    },
  ];

  return (
    <div className="min-h-screen bg-brand-navy">
      <AnnouncementBar />
      <Navbar />

      {/* Hero Section */}
      <section className="relative pt-28 pb-16 md:pt-36 md:pb-24 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-brand-blue/10 via-transparent to-transparent" />
        <div className="absolute top-20 left-1/4 w-72 h-72 bg-brand-blue/5 rounded-full blur-3xl" />
        <div className="absolute bottom-10 right-1/4 w-96 h-96 bg-brand-gold/5 rounded-full blur-3xl" />

        <div className="max-w-5xl mx-auto px-4 text-center relative z-10">
          {/* Breadcrumbs */}
          <nav className="flex justify-center items-center gap-2 text-sm text-gray-400 mb-8">
            <Link href="/" className="hover:text-brand-blue transition-colors">Home</Link>
            <span>/</span>
            <Link href="/fitness-coach" className="hover:text-brand-blue transition-colors">Fitness Coach</Link>
            <span>/</span>
            <span className="text-brand-gold">{city.name}</span>
          </nav>

          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
            Best Online{' '}
            <span className="bg-gradient-to-r from-brand-blue to-brand-gold bg-clip-text text-transparent">
              Fitness Coach
            </span>{' '}
            in {city.name}
          </h1>

          <p className="text-lg md:text-xl text-gray-300 max-w-3xl mx-auto mb-8 leading-relaxed">
            {city.name}, {city.description} with a population of {city.population}, deserves
            world-class fitness coaching. {city.fitnessStats}. Coach Himanshu brings NASM-certified
            online personal training right to your phone -- no matter where you are in {city.state}.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Link
              href="/assessment"
              className="inline-flex items-center justify-center px-8 py-4 bg-brand-blue hover:bg-brand-blue-dark text-white font-semibold rounded-xl transition-all duration-300 text-lg shadow-lg shadow-brand-blue/25 hover:shadow-brand-blue/40"
            >
              Start Free Assessment
            </Link>
            <Link
              href="/#plans"
              className="inline-flex items-center justify-center px-8 py-4 border border-white/20 hover:border-brand-gold text-white font-semibold rounded-xl transition-all duration-300 text-lg hover:bg-white/5"
            >
              View Plans
            </Link>
          </div>
        </div>
      </section>

      {/* Stats Bar */}
      <section className="py-8 border-y border-white/[0.06]" style={{ background: 'linear-gradient(180deg, rgba(23,95,255,0.05) 0%, rgba(10,15,31,1) 100%)' }}>
        <div className="max-w-5xl mx-auto px-4 grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          <div>
            <div className="text-3xl md:text-4xl font-bold text-brand-gold mb-1">1000+</div>
            <div className="text-sm text-gray-400">Transformations</div>
          </div>
          <div>
            <div className="text-3xl md:text-4xl font-bold text-brand-gold mb-1">4.9/5</div>
            <div className="text-sm text-gray-400">Client Rating</div>
          </div>
          <div>
            <div className="text-3xl md:text-4xl font-bold text-brand-gold mb-1">₹799</div>
            <div className="text-sm text-gray-400">Plans Starting From</div>
          </div>
          <div>
            <div className="text-3xl md:text-4xl font-bold text-brand-gold mb-1">6+</div>
            <div className="text-sm text-gray-400">Certifications</div>
          </div>
        </div>
      </section>

      {/* Why City Residents Choose Online Coaching */}
      <section className="py-16 md:py-24">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-white text-center mb-4">
            Why{' '}
            <span className="text-brand-gold">{city.name}</span>{' '}
            Residents Choose Online Coaching
          </h2>
          <p className="text-gray-400 text-center max-w-2xl mx-auto mb-12">
            {city.fitnessStats}. Here&apos;s why online coaching with Coach Himanshu is the smarter choice.
          </p>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {reasons.map((reason, index) => (
              <div
                key={index}
                className="p-6 rounded-2xl border border-white/[0.06] bg-white/[0.02] hover:bg-white/[0.04] transition-colors duration-300"
              >
                <div className="w-10 h-10 rounded-xl bg-brand-blue/10 flex items-center justify-center text-brand-blue font-bold text-lg mb-4">
                  {index + 1}
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">{reason.title}</h3>
                <p className="text-gray-400 text-sm leading-relaxed">{reason.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Custom Meal Plans Section */}
      <section className="py-16 md:py-24 border-y border-white/[0.06]" style={{ background: 'linear-gradient(180deg, rgba(201,166,70,0.03) 0%, rgba(10,15,31,1) 100%)' }}>
        <div className="max-w-5xl mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-white text-center mb-4">
            Custom Meal Plans Using{' '}
            <span className="text-brand-gold">{city.name} Foods</span>
          </h2>
          <p className="text-gray-400 text-center max-w-2xl mx-auto mb-12">
            No generic diet charts. Your meal plan is built around foods you already love and can easily find in {city.name}.
          </p>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-10">
            {city.localFoods.map((food, index) => (
              <div
                key={index}
                className="flex items-center gap-3 p-4 rounded-xl border border-white/[0.06] bg-white/[0.02]"
              >
                <div className="w-8 h-8 rounded-lg bg-brand-gold/10 flex items-center justify-center text-brand-gold text-sm font-bold flex-shrink-0">
                  ✓
                </div>
                <div>
                  <span className="text-white font-medium capitalize">{food}</span>
                  <p className="text-gray-500 text-xs mt-0.5">Macro-balanced portion included</p>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center">
            <p className="text-gray-300 text-sm mb-4">
              Coach Himanshu calculates the right portions of your favourite {city.name} foods to match your
              calorie and macro targets -- whether your goal is fat loss, muscle gain, or overall health.
            </p>
            <Link
              href="/assessment"
              className="inline-flex items-center text-brand-blue hover:text-brand-gold transition-colors font-medium"
            >
              Get your custom {city.name} meal plan →
            </Link>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 md:py-24">
        <div className="max-w-5xl mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-white text-center mb-4">
            How It Works
          </h2>
          <p className="text-gray-400 text-center max-w-2xl mx-auto mb-12">
            Getting started with online fitness coaching in {city.name} takes just 4 simple steps.
          </p>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {steps.map((step) => (
              <div key={step.number} className="relative">
                <div className="text-5xl font-black text-brand-blue/10 mb-2">{step.number}</div>
                <h3 className="text-lg font-semibold text-white mb-2">{step.title}</h3>
                <p className="text-gray-400 text-sm leading-relaxed">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-16 md:py-24 border-y border-white/[0.06]" style={{ background: 'linear-gradient(180deg, rgba(23,95,255,0.03) 0%, rgba(10,15,31,1) 100%)' }}>
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-white text-center mb-4">
            Affordable Plans for{' '}
            <span className="text-brand-gold">{city.name}</span>
          </h2>
          <p className="text-gray-400 text-center max-w-2xl mx-auto mb-12">
            Professional fitness coaching that costs less than your monthly {city.localFoods[0]} budget.
            All plans include personalized workout + diet plans and WhatsApp support.
          </p>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {plans.map((plan, index) => (
              <div
                key={index}
                className={`relative p-6 rounded-2xl border transition-all duration-300 ${
                  plan.popular
                    ? 'border-brand-blue bg-brand-blue/5 shadow-lg shadow-brand-blue/10'
                    : 'border-white/[0.06] bg-white/[0.02] hover:border-white/[0.12]'
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 bg-brand-blue text-white text-xs font-bold rounded-full">
                    MOST POPULAR
                  </div>
                )}
                <div className="text-sm text-gray-400 mb-1">{plan.duration}</div>
                <h3 className="text-lg font-bold text-white mb-1">{plan.name}</h3>
                <div className="text-3xl font-black text-brand-gold mb-1">{plan.price}</div>
                <div className="text-xs text-gray-500 mb-4">{plan.perMonth}</div>

                <ul className="space-y-2 mb-6">
                  {plan.features.map((feature, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-gray-300">
                      <span className="text-brand-blue mt-0.5 flex-shrink-0">&#10003;</span>
                      {feature}
                    </li>
                  ))}
                </ul>

                <Link
                  href="/#plans"
                  className={`block text-center py-3 rounded-xl font-semibold transition-all duration-300 text-sm ${
                    plan.popular
                      ? 'bg-brand-blue text-white hover:bg-brand-blue-dark'
                      : 'border border-white/20 text-white hover:border-brand-gold hover:bg-white/5'
                  }`}
                >
                  Choose Plan
                </Link>
              </div>
            ))}
          </div>

          <p className="text-center text-gray-500 text-sm mt-8">
            View all plans including Couple Plans, Rehabilitation Plans, and Elite 1:1 Sessions on the{' '}
            <Link href="/#plans" className="text-brand-blue hover:text-brand-gold transition-colors underline">
              main plans page
            </Link>.
          </p>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 md:py-24">
        <div className="max-w-3xl mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-white text-center mb-12">
            Frequently Asked Questions
          </h2>

          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <div
                key={index}
                className="p-6 rounded-2xl border border-white/[0.06] bg-white/[0.02]"
              >
                <h3 className="text-lg font-semibold text-white mb-3">{faq.question}</h3>
                <p className="text-gray-400 text-sm leading-relaxed">{faq.answer}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-16 md:py-24 border-t border-white/[0.06]" style={{ background: 'linear-gradient(180deg, rgba(23,95,255,0.06) 0%, rgba(10,15,31,1) 100%)' }}>
        <div className="max-w-3xl mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Ready to Transform Your Fitness in{' '}
            <span className="text-brand-gold">{city.name}</span>?
          </h2>
          <p className="text-gray-300 text-lg mb-8 leading-relaxed">
            Join 1000+ clients who have achieved their fitness goals with Coach Himanshu.
            Start with a free assessment -- no payment required.
          </p>

          <Link
            href="/assessment"
            className="inline-flex items-center justify-center px-10 py-4 bg-brand-blue hover:bg-brand-blue-dark text-white font-bold rounded-xl transition-all duration-300 text-lg shadow-lg shadow-brand-blue/25 hover:shadow-brand-blue/40"
          >
            Take Free Assessment Now
          </Link>

          <div className="flex flex-wrap justify-center gap-6 mt-10 text-sm text-gray-400">
            <Link href="/about" className="hover:text-brand-blue transition-colors">About Coach Himanshu</Link>
            <Link href="/blog" className="hover:text-brand-blue transition-colors">Fitness Blog</Link>
            <Link href="/faq" className="hover:text-brand-blue transition-colors">All FAQs</Link>
            <Link href="/contact" className="hover:text-brand-blue transition-colors">Contact</Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
