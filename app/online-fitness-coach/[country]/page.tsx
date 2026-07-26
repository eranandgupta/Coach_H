import Link from 'next/link';
import { getCountryBySlug, getAllCountrySlugs } from '@/lib/countries';
import { notFound } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import AnnouncementBar from '@/components/AnnouncementBar';

export async function generateStaticParams() {
  return getAllCountrySlugs().map(country => ({ country }));
}

export default function CountryPage({ params }: { params: { country: string } }) {
  const c = getCountryBySlug(params.country);
  if (!c) notFound();

  const plans = [
    {
      name: 'Kickstart Plan',
      duration: '1 Month',
      price: '₹1,099',
      perMonth: `≈ ${c.approxStart}/month`,
      features: [
        'Customised workout plan',
        'Personalised Indian diet plan',
        'Exercise video tutorials',
        'Weekly one-on-one video consultation',
        'WhatsApp support across your timezone',
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
        'Personalised Indian diet plan',
        'Full video tutorials',
        'Weekly one-on-one video consultation',
        'Supplement guidance',
        'WhatsApp support',
        'Lifestyle coaching',
      ],
    },
    {
      name: 'Transformation Plan',
      duration: '6 Months',
      price: '₹4,299',
      perMonth: '₹716/month',
      features: [
        'Customised workout plan',
        'Personalised Indian diet plan',
        'Full video library access',
        'Weekly one-on-one video consultation',
        'Supplement guidance',
        'WhatsApp support',
        'Lifestyle coaching',
        'Pause option (7 days)',
      ],
    },
    {
      name: 'Elite 1:1 Coaching',
      duration: 'Premium',
      price: '₹9,999+',
      perMonth: 'Live video sessions',
      features: [
        'Real-time 1-on-1 video training',
        'Fully customised workout + diet',
        'Priority WhatsApp access',
        'Advanced progress tracking',
        'Timezone-matched scheduling',
      ],
    },
  ];

  const steps = [
    {
      number: '01',
      title: 'Take the Free Assessment',
      description: `Complete a quick online assessment so Coach Himanshu understands your goals, your lifestyle in ${c.name}, and the ingredients you can easily get there.`,
    },
    {
      number: '02',
      title: 'Get Your Custom Plan',
      description: 'Receive a personalized workout and Indian meal plan built around foods you can cook abroad, delivered straight to your phone.',
    },
    {
      number: '03',
      title: 'Train on Your Timezone',
      description: `Follow your plan with video tutorials and weekly one-on-one video check-ins scheduled for ${c.timezoneNote}.`,
    },
    {
      number: '04',
      title: 'Transform Your Body',
      description: 'Track progress with regular assessments and plan adjustments, backed by 24/7 WhatsApp accountability.',
    },
  ];

  const reasons = [
    {
      title: 'Coaching That Understands Indian Bodies & Food',
      description: `Most local trainers in ${c.name} don't build plans around dal, roti, paneer and sabzi. Coach Himanshu creates Indian meal plans using ingredients you can actually find and cook where you live.`,
    },
    {
      title: 'Timezone-Friendly Live Sessions',
      description: `Your weekly video consultations are scheduled for ${c.timezoneNote} — no awkward 3 a.m. calls, just coaching that fits your day.`,
    },
    {
      title: 'Exceptional Value',
      description: `Plans start at just ₹1,099/month (≈ ${c.approxStart}) — a fraction of what personal training costs in ${c.name}. World-class, certified coaching without the local price tag. International cards accepted.`,
    },
    {
      title: 'NASM Certified Expertise',
      description: 'Coach Himanshu holds 6+ professional diplomas including NASM certification. You get science-backed programming, not generic Instagram workouts.',
    },
    {
      title: 'Built for Busy NRI Life',
      description: c.angle,
    },
    {
      title: '1000+ Transformations Worldwide',
      description: `Join 1000+ clients across India and abroad — including many Indians and NRIs in ${c.name} — who transformed their health with Coach Himanshu.`,
    },
  ];

  const faqs = [
    {
      question: `Can I get online fitness coaching in ${c.name} from India?`,
      answer: `Yes. Coach Himanshu coaches clients across ${c.name} entirely online. After a free assessment you receive a personalized workout and Indian diet plan on WhatsApp, plus weekly one-on-one video consultations scheduled for ${c.timezoneNote}. Distance makes no difference — everything is delivered digitally.`,
    },
    {
      question: `How do I pay from ${c.name}, and how much does it cost?`,
      answer: `Plans start at ₹1,099/month, which is roughly ${c.approxStart}, going up to Elite 1:1 packages. Payment is handled through a secure checkout that accepts international debit and credit cards, so you can pay easily from ${c.name}. You get premium, NASM-certified coaching at a fraction of local personal-training prices.`,
    },
    {
      question: `Will the diet plan work with the food available in ${c.name}?`,
      answer: `Absolutely. Coach Himanshu builds Indian meal plans around ingredients you can find in ${c.name} — including options for local supermarkets and Indian grocery stores. Whether you're vegetarian or non-vegetarian, your plan is designed around foods you enjoy and can realistically cook, with the right portions for your goals.`,
    },
    {
      question: 'Do I need a gym, or can I train at home?',
      answer: `You can do either. There are home workout plans that need minimal equipment and gym-based plans if you have access to one, with plans starting from ₹1,099/month (≈ ${c.approxStart}). Many NRI clients start with home workouts and add gym training later — your coach adapts the plan to whatever equipment you have.`,
    },
    {
      question: 'What qualifications does Coach Himanshu have?',
      answer: 'Coach Himanshu is a NASM Certified Bodybuilding Coach with 6+ professional diplomas in fitness science, nutrition, and specialized training including Corrective Exercise Specialist (CES) and Sports Nutrition Specialist certifications — trusted by 1000+ clients in India and around the world.',
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
          <nav className="flex justify-center items-center gap-2 text-sm text-gray-400 mb-8">
            <Link href="/" className="hover:text-brand-blue transition-colors">Home</Link>
            <span>/</span>
            <Link href="/online-fitness-coach" className="hover:text-brand-blue transition-colors">Online Fitness Coach</Link>
            <span>/</span>
            <span className="text-brand-gold">{c.country}</span>
          </nav>

          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
            Online Indian{' '}
            <span className="bg-gradient-to-r from-brand-blue to-brand-gold bg-clip-text text-transparent">
              Fitness Coach
            </span>{' '}
            in {c.name}
          </h1>

          <p className="text-lg md:text-xl text-gray-300 max-w-3xl mx-auto mb-8 leading-relaxed">
            Home to {c.diaspora}, {c.name} is full of Indians and NRIs who want to get fit without giving up
            the food and culture they love. {c.angle} Coach Himanshu brings NASM-certified online coaching and
            Indian meal plans right to your phone — on your timezone.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-6">
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
          <p className="text-sm text-gray-500">
            Plans from ₹1,099/month (≈ {c.approxStart}) · International cards accepted · English &amp; Hindi
          </p>
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
            <div className="text-3xl md:text-4xl font-bold text-brand-gold mb-1">{c.approxStart}</div>
            <div className="text-sm text-gray-400">Plans Starting (≈)</div>
          </div>
          <div>
            <div className="text-3xl md:text-4xl font-bold text-brand-gold mb-1">6+</div>
            <div className="text-sm text-gray-400">Certifications</div>
          </div>
        </div>
      </section>

      {/* Why NRIs Choose Online Coaching */}
      <section className="py-16 md:py-24">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-white text-center mb-4">
            Why Indians in{' '}
            <span className="text-brand-gold">{c.name}</span>{' '}
            Choose Coach Himanshu
          </h2>
          <p className="text-gray-400 text-center max-w-2xl mx-auto mb-12">
            Coaching built for your body, your food, and your schedule abroad — not a generic local program.
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

      {/* Indian Meal Plans Abroad */}
      <section className="py-16 md:py-24 border-y border-white/[0.06]" style={{ background: 'linear-gradient(180deg, rgba(201,166,70,0.03) 0%, rgba(10,15,31,1) 100%)' }}>
        <div className="max-w-5xl mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Indian Meal Plans You Can Actually Cook in{' '}
            <span className="text-brand-gold">{c.name}</span>
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto mb-8">
            No bland "diet food" and no giving up home cooking. Your plan is built around dal, roti, sabzi,
            paneer, curd, eggs, chicken and fish — with the right portions for fat loss or muscle gain, using
            ingredients from your local and Indian grocery stores.
          </p>
          <Link
            href="/assessment"
            className="inline-flex items-center text-brand-blue hover:text-brand-gold transition-colors font-medium"
          >
            Get your custom Indian meal plan →
          </Link>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 md:py-24">
        <div className="max-w-5xl mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-white text-center mb-4">How It Works</h2>
          <p className="text-gray-400 text-center max-w-2xl mx-auto mb-12">
            Getting started from {c.name} takes just 4 simple steps — all online.
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
            Plans &amp; Pricing for{' '}
            <span className="text-brand-gold">{c.name}</span>
          </h2>
          <p className="text-gray-400 text-center max-w-2xl mx-auto mb-12">
            Priced in Indian Rupees for exceptional value — international debit and credit cards accepted at a
            secure checkout. Approximate {c.currencyCode} shown for reference.
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
            See all plans including Couple Plans and Rehabilitation Plans on the{' '}
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
              <div key={index} className="p-6 rounded-2xl border border-white/[0.06] bg-white/[0.02]">
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
            <span className="text-brand-gold">{c.name}</span>?
          </h2>
          <p className="text-gray-300 text-lg mb-8 leading-relaxed">
            Join 1000+ clients in India and abroad who reached their goals with Coach Himanshu.
            Start with a free assessment — no payment required.
          </p>

          <Link
            href="/assessment"
            className="inline-flex items-center justify-center px-10 py-4 bg-brand-blue hover:bg-brand-blue-dark text-white font-bold rounded-xl transition-all duration-300 text-lg shadow-lg shadow-brand-blue/25 hover:shadow-brand-blue/40"
          >
            Take Free Assessment Now
          </Link>

          <div className="flex flex-wrap justify-center gap-6 mt-10 text-sm text-gray-400">
            <Link href="/about" className="hover:text-brand-blue transition-colors">About Coach Himanshu</Link>
            <Link href="/online-fitness-coach" className="hover:text-brand-blue transition-colors">All Countries</Link>
            <Link href="/blog" className="hover:text-brand-blue transition-colors">Fitness Blog</Link>
            <Link href="/contact" className="hover:text-brand-blue transition-colors">Contact</Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
