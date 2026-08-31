import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import AnnouncementBar from '@/components/AnnouncementBar';
import { getElitePlans } from '@/lib/personalTraining';
import { PT_COMPARISON, PT_FAQS } from '@/lib/personalTraining';

// Direct WhatsApp chat for "Book a free consultation" CTAs — pre-filled for 1:1.
const WHATSAPP_1ON1 =
  'https://wa.me/917303484648?text=Hi%20Coach%20Himanshu!%20I%20want%20to%20start%20live%201-on-1%20personal%20training.%20Please%20help%20me%20pick%20a%20plan.';

const HERO_POINTS = [
  'Real-time form correction on every rep',
  'Train from home or gym — anywhere in the world',
  'Personalised Indian diet plan included',
  'Sessions on your schedule & timezone',
];

const INCLUDED = [
  { title: 'Live 1-on-1 coaching', text: 'Sixty focused minutes, just you and Coach Himanshu on a live video call — no group classes, no recordings.' },
  { title: 'Real-time form correction', text: 'Your coach watches every rep and fixes your technique on the spot, so you train safely and get results faster.' },
  { title: 'Personalised Indian diet plan', text: 'A custom meal plan built around your food preferences, goals, and what’s available where you live.' },
  { title: 'Full exercise video library', text: 'Complete access to gym, home, and rehab tutorials to reference between your live sessions.' },
  { title: 'WhatsApp & in-app support', text: 'Direct line to your coach for accountability, questions, and quick adjustments any day of the week.' },
  { title: 'Supplement & lifestyle guidance', text: 'Clear, no-nonsense advice on supplements, sleep, and recovery — only what you actually need.' },
];

const STEPS = [
  { number: '01', title: 'Free consultation', description: 'Message on WhatsApp. Coach Himanshu learns your goals, schedule, and equipment, then recommends the right 1:1 package.' },
  { number: '02', title: 'Assessment & plan', description: 'Complete a short assessment. Your personalised workout and Indian diet plan are built around your body and lifestyle.' },
  { number: '03', title: 'Book your live sessions', description: 'Pick times that suit you — early mornings, late evenings, NRI-friendly timezones. Each session is 60 minutes, one-on-one.' },
  { number: '04', title: 'Train, correct, progress', description: 'Train live with real-time coaching and form correction. Your program adapts every week as you get stronger.' },
];

export default function OnlinePersonalTrainerPage() {
  const elitePlans = getElitePlans();

  return (
    <div className="min-h-screen bg-brand-navy">
      <AnnouncementBar />
      <Navbar />

      {/* Hero */}
      <section className="relative pt-28 pb-16 md:pt-36 md:pb-24 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-brand-blue/10 via-transparent to-transparent" />
        <div className="absolute top-20 left-1/4 w-72 h-72 bg-brand-blue/5 rounded-full blur-3xl" />
        <div className="absolute bottom-10 right-1/4 w-96 h-96 bg-brand-gold/5 rounded-full blur-3xl" />

        <div className="max-w-5xl mx-auto px-4 text-center relative z-10">
          <nav className="flex justify-center items-center gap-2 text-sm text-gray-400 mb-8">
            <Link href="/" className="hover:text-brand-blue transition-colors">Home</Link>
            <span>/</span>
            <Link href="/plans" className="hover:text-brand-blue transition-colors">Coaching</Link>
            <span>/</span>
            <span className="text-brand-gold">Online Personal Trainer</span>
          </nav>

          <div className="inline-flex items-center gap-2 px-4 py-1.5 mb-6 rounded-full border border-brand-gold/30 bg-brand-gold/5 text-brand-gold text-xs font-semibold uppercase tracking-wider">
            Live 1-on-1 · Real-time coaching
          </div>

          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
            Your Own{' '}
            <span className="bg-gradient-to-r from-brand-blue to-brand-gold bg-clip-text text-transparent">
              Online Personal Trainer
            </span>
            <br className="hidden md:block" /> Live, 1-on-1, From Anywhere
          </h1>

          <p className="text-lg md:text-xl text-gray-300 max-w-3xl mx-auto mb-8 leading-relaxed">
            Train live with Coach Himanshu — a NASM-certified personal trainer — over one-on-one video
            sessions with real-time form correction. The closest thing to a trainer standing next to you,
            at a fraction of in-person gym rates. Book from India or anywhere in the world.
          </p>

          <ul className="flex flex-wrap justify-center gap-x-6 gap-y-2 max-w-3xl mx-auto mb-8">
            {HERO_POINTS.map((p) => (
              <li key={p} className="flex items-center gap-2 text-sm text-gray-300">
                <span className="text-brand-gold">&#10003;</span>
                {p}
              </li>
            ))}
          </ul>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href={WHATSAPP_1ON1}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center px-8 py-4 bg-brand-blue hover:bg-brand-blue-dark text-white font-semibold rounded-xl transition-all duration-300 text-lg shadow-lg shadow-brand-blue/25 hover:shadow-brand-blue/40"
            >
              Book a Free Consultation
            </a>
            <Link
              href="#packages"
              className="inline-flex items-center justify-center px-8 py-4 border border-white/20 hover:border-brand-gold text-white font-semibold rounded-xl transition-all duration-300 text-lg hover:bg-white/5"
            >
              See 1:1 Packages
            </Link>
          </div>
        </div>
      </section>

      {/* Trust bar */}
      <section className="py-8 border-y border-white/[0.06]" style={{ background: 'linear-gradient(180deg, rgba(23,95,255,0.05) 0%, rgba(10,15,31,1) 100%)' }}>
        <div className="max-w-5xl mx-auto px-4 grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          <div>
            <div className="text-3xl md:text-4xl font-bold text-brand-gold mb-1">1000+</div>
            <div className="text-sm text-gray-400">Transformations</div>
          </div>
          <div>
            <div className="text-3xl md:text-4xl font-bold text-brand-gold mb-1">60 min</div>
            <div className="text-sm text-gray-400">Per Live Session</div>
          </div>
          <div>
            <div className="text-3xl md:text-4xl font-bold text-brand-gold mb-1">₹7,999</div>
            <div className="text-sm text-gray-400">1:1 Starting From</div>
          </div>
          <div>
            <div className="text-3xl md:text-4xl font-bold text-brand-gold mb-1">NASM</div>
            <div className="text-sm text-gray-400">Certified Coach</div>
          </div>
        </div>
      </section>

      {/* What is live 1:1 — AEO definition block */}
      <section className="py-16 md:py-24">
        <div className="max-w-3xl mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-white text-center mb-6">
            What Is Live 1-on-1 Online Personal Training?
          </h2>
          <p className="text-gray-300 text-lg leading-relaxed mb-4">
            Live 1-on-1 online personal training is a real-time video session where your coach trains
            only you — watching every rep, correcting your form on the spot, and adjusting the workout
            as you go, exactly like an in-person personal trainer standing beside you.
          </p>
          <p className="text-gray-400 leading-relaxed">
            With Coach Himanshu, each Elite 1:1 session is <strong className="text-white">60 minutes, fully
            one-on-one</strong>, over a live video call. You can train from your home, your gym, or on the
            road — anywhere in the world — while getting expert, NASM-certified coaching, a personalised
            Indian diet plan, and week-by-week program updates. It delivers the quality of in-person
            personal training with the flexibility and affordability of online coaching.
          </p>
        </div>
      </section>

      {/* What's included */}
      <section className="py-16 md:py-24 border-y border-white/[0.06]" style={{ background: 'linear-gradient(180deg, rgba(201,166,70,0.03) 0%, rgba(10,15,31,1) 100%)' }}>
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-white text-center mb-4">
            What&apos;s Included in Every 1:1 Plan
          </h2>
          <p className="text-gray-400 text-center max-w-2xl mx-auto mb-12">
            Everything you need to train safely, eat right, and keep progressing — with a real coach in your corner.
          </p>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {INCLUDED.map((item, i) => (
              <div key={i} className="p-6 rounded-2xl border border-white/[0.06] bg-white/[0.02] hover:bg-white/[0.04] transition-colors duration-300">
                <div className="w-10 h-10 rounded-xl bg-brand-blue/10 flex items-center justify-center text-brand-blue font-bold text-lg mb-4">
                  {i + 1}
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">{item.title}</h3>
                <p className="text-gray-400 text-sm leading-relaxed">{item.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-16 md:py-24">
        <div className="max-w-5xl mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-white text-center mb-4">
            How Your Live Sessions Work
          </h2>
          <p className="text-gray-400 text-center max-w-2xl mx-auto mb-12">
            From first message to first workout in just four steps.
          </p>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {STEPS.map((step) => (
              <div key={step.number} className="relative">
                <div className="text-5xl font-black text-brand-blue/10 mb-2">{step.number}</div>
                <h3 className="text-lg font-semibold text-white mb-2">{step.title}</h3>
                <p className="text-gray-400 text-sm leading-relaxed">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Comparison table — GEO/AEO extractable */}
      <section className="py-16 md:py-24 border-y border-white/[0.06]" style={{ background: 'linear-gradient(180deg, rgba(23,95,255,0.03) 0%, rgba(10,15,31,1) 100%)' }}>
        <div className="max-w-5xl mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-white text-center mb-4">
            Live 1:1 vs App Coaching vs a Local Gym Trainer
          </h2>
          <p className="text-gray-400 text-center max-w-2xl mx-auto mb-12">
            Why live online 1-on-1 training gives you the best of both worlds.
          </p>
          <div className="overflow-x-auto rounded-2xl border border-white/[0.08]">
            <table className="w-full min-w-[720px] text-left text-sm">
              <thead>
                <tr className="bg-white/[0.03]">
                  <th className="p-4 font-semibold text-gray-400"> </th>
                  <th className="p-4 font-bold text-brand-gold">Live 1:1 (Coach Himanshu)</th>
                  <th className="p-4 font-semibold text-gray-300">App / Recorded Coaching</th>
                  <th className="p-4 font-semibold text-gray-300">Local Gym Trainer</th>
                </tr>
              </thead>
              <tbody>
                {PT_COMPARISON.map((row, i) => (
                  <tr key={i} className="border-t border-white/[0.06]">
                    <td className="p-4 font-medium text-white align-top">{row.dimension}</td>
                    <td className="p-4 text-gray-200 align-top bg-brand-blue/[0.04]">{row.live}</td>
                    <td className="p-4 text-gray-400 align-top">{row.recorded}</td>
                    <td className="p-4 text-gray-400 align-top">{row.gym}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Packages — pulled live from lib/plans.ts */}
      <section id="packages" className="py-16 md:py-24 scroll-mt-24">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-white text-center mb-4">
            Elite <span className="text-brand-gold">1:1 Personal Training</span> Packages
          </h2>
          <p className="text-gray-400 text-center max-w-2xl mx-auto mb-12">
            All sessions are 60 minutes, one-on-one, live on video. Bigger packages lower your per-session
            price. Not sure which to pick? Book a free consultation and we&apos;ll recommend one.
          </p>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {elitePlans.map((plan, index) => (
              <div
                key={index}
                className={`relative p-6 rounded-2xl border transition-all duration-300 flex flex-col ${
                  plan.popular
                    ? 'border-brand-blue bg-brand-blue/5 shadow-lg shadow-brand-blue/10'
                    : 'border-white/[0.06] bg-white/[0.02] hover:border-white/[0.12]'
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 bg-brand-blue text-white text-xs font-bold rounded-full whitespace-nowrap">
                    MOST POPULAR
                  </div>
                )}
                <div className="text-sm text-gray-400 mb-1">{plan.durationLabel}</div>
                <h3 className="text-lg font-bold text-white mb-1">{plan.name}</h3>
                <div className="text-3xl font-black text-brand-gold mb-1">{plan.priceLabel}</div>
                <div className="text-xs text-gray-500 mb-4">{plan.tagline}</div>

                <ul className="space-y-2 mb-6 flex-1">
                  {plan.features.map((feature, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-gray-300">
                      <span className="text-brand-blue mt-0.5 flex-shrink-0">&#10003;</span>
                      {feature}
                    </li>
                  ))}
                </ul>

                <a
                  href={WHATSAPP_1ON1}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`block text-center py-3 rounded-xl font-semibold transition-all duration-300 text-sm ${
                    plan.popular
                      ? 'bg-brand-blue text-white hover:bg-brand-blue-dark'
                      : 'border border-white/20 text-white hover:border-brand-gold hover:bg-white/5'
                  }`}
                >
                  Book This Package
                </a>
              </div>
            ))}
          </div>

          <p className="text-center text-gray-500 text-sm mt-8">
            Training as a couple? Ask about{' '}
            <Link href="/plans" className="text-brand-blue hover:text-brand-gold transition-colors underline">
              Elite 1:1 Couple packages
            </Link>{' '}
            — one shared live slot, two personalised plans. See all options on the{' '}
            <Link href="/plans" className="text-brand-blue hover:text-brand-gold transition-colors underline">
              full plans &amp; pricing page
            </Link>.
          </p>
        </div>
      </section>

      {/* Who it's for */}
      <section className="py-16 md:py-24 border-y border-white/[0.06]" style={{ background: 'linear-gradient(180deg, rgba(201,166,70,0.03) 0%, rgba(10,15,31,1) 100%)' }}>
        <div className="max-w-5xl mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-white text-center mb-4">
            Who Live 1:1 Training Is For
          </h2>
          <p className="text-gray-400 text-center max-w-2xl mx-auto mb-12">
            If you want a real coach&apos;s eyes on your training, this is for you.
          </p>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              'Beginners who want to learn correct form from day one',
              'Busy professionals who value a fixed, accountable session',
              'NRIs wanting Indian-food coaching on their own timezone',
              'Anyone recovering from or training around an injury',
              'People who tried app plans but need live accountability',
              'Couples who want to train together, live',
            ].map((chip, i) => (
              <div key={i} className="flex items-center gap-3 p-4 rounded-xl border border-white/[0.06] bg-white/[0.02]">
                <div className="w-8 h-8 rounded-lg bg-brand-gold/10 flex items-center justify-center text-brand-gold text-sm font-bold flex-shrink-0">✓</div>
                <span className="text-white font-medium text-sm">{chip}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ — AEO */}
      <section className="py-16 md:py-24">
        <div className="max-w-3xl mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-white text-center mb-12">
            Live 1:1 Personal Training — FAQs
          </h2>
          <div className="space-y-4">
            {PT_FAQS.map((faq, index) => (
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
            Ready for a Coach in Your Corner — Live?
          </h2>
          <p className="text-gray-300 text-lg mb-8 leading-relaxed">
            Book a free consultation. Coach Himanshu will learn your goals and recommend the right
            1:1 package — no payment required to start.
          </p>
          <a
            href={WHATSAPP_1ON1}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center px-10 py-4 bg-brand-blue hover:bg-brand-blue-dark text-white font-bold rounded-xl transition-all duration-300 text-lg shadow-lg shadow-brand-blue/25 hover:shadow-brand-blue/40"
          >
            Book a Free Consultation
          </a>
          <div className="flex flex-wrap justify-center gap-6 mt-10 text-sm text-gray-400">
            <Link href="/plans" className="hover:text-brand-blue transition-colors">All Plans &amp; Pricing</Link>
            <Link href="/online-fitness-coach" className="hover:text-brand-blue transition-colors">Coaching for NRIs</Link>
            <Link href="/about" className="hover:text-brand-blue transition-colors">About Coach Himanshu</Link>
            <Link href="/blog" className="hover:text-brand-blue transition-colors">Fitness Blog</Link>
          </div>
        </div>
      </section>

      <Footer />

      {/* Sticky mobile CTA — keeps the primary action in reach as users scroll */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 p-3 bg-brand-navy/95 backdrop-blur border-t border-white/[0.08]">
        <a
          href={WHATSAPP_1ON1}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-2 w-full py-3.5 bg-brand-blue hover:bg-brand-blue-dark text-white font-bold rounded-xl transition-colors shadow-lg shadow-brand-blue/25"
        >
          Book a Free 1:1 Consultation
        </a>
      </div>
    </div>
  );
}
