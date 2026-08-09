import Link from 'next/link';
import { PLAN_FAQS } from '@/lib/plans';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import AnnouncementBar from '@/components/AnnouncementBar';
import PlanCompare from '@/components/PlanCompare';

// Direct WhatsApp chat for "Start Consultation" CTAs.
const WHATSAPP_CONSULT =
  'https://wa.me/917303484648?text=Hi%20Coach%20Himanshu!%20I%20want%20to%20start%20a%20free%20consultation.';

export default function PlansPage() {
  return (
    <div className="min-h-screen bg-brand-navy">
      <AnnouncementBar />
      <Navbar />

      {/* Hero */}
      <section className="relative pt-28 pb-14 md:pt-36 md:pb-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-brand-blue/10 via-transparent to-transparent" />
        <div className="absolute top-20 left-1/4 w-72 h-72 bg-brand-blue/5 rounded-full blur-3xl" />
        <div className="absolute bottom-10 right-1/4 w-96 h-96 bg-brand-gold/5 rounded-full blur-3xl" />

        <div className="max-w-5xl mx-auto px-4 text-center relative z-10">
          <nav className="flex justify-center items-center gap-2 text-sm text-gray-400 mb-8">
            <Link href="/" className="hover:text-brand-blue transition-colors">Home</Link>
            <span>/</span>
            <span className="text-brand-gold">Plans &amp; Pricing</span>
          </nav>

          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
            Coaching{' '}
            <span className="bg-gradient-to-r from-brand-blue to-brand-gold bg-clip-text text-transparent">
              Plans &amp; Pricing
            </span>
          </h1>

          <p className="text-lg md:text-xl text-gray-300 max-w-3xl mx-auto mb-8 leading-relaxed">
            One coach, one goal — the fittest version of you. Every plan includes a personalised
            workout plan, a custom Indian diet plan, and WhatsApp support. Start with a free
            assessment, then choose the plan that fits your goal and budget.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href={WHATSAPP_CONSULT}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center px-8 py-4 bg-brand-blue hover:bg-brand-blue-dark text-white font-semibold rounded-xl transition-all duration-300 text-lg shadow-lg shadow-brand-blue/25 hover:shadow-brand-blue/40"
            >
              Start Consultation
            </a>
            <Link
              href="#plans-list"
              className="inline-flex items-center justify-center px-8 py-4 border border-white/20 hover:border-brand-gold text-white font-semibold rounded-xl transition-all duration-300 text-lg hover:bg-white/5"
            >
              Compare Plans
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
            <div className="text-3xl md:text-4xl font-bold text-brand-gold mb-1">₹1,299</div>
            <div className="text-sm text-gray-400">Plans Starting From</div>
          </div>
          <div>
            <div className="text-3xl md:text-4xl font-bold text-brand-gold mb-1">6+</div>
            <div className="text-sm text-gray-400">Certifications</div>
          </div>
          <div>
            <div className="text-3xl md:text-4xl font-bold text-brand-gold mb-1">24/7</div>
            <div className="text-sm text-gray-400">WhatsApp Support</div>
          </div>
        </div>
      </section>

      {/* Plan groups + interactive side-by-side comparison (client island) */}
      <PlanCompare />

      {/* Who is it for — audience cross-links */}
      <section className="py-16 md:py-24 border-y border-white/[0.06]" style={{ background: 'linear-gradient(180deg, rgba(23,95,255,0.03) 0%, rgba(10,15,31,1) 100%)' }}>
        <div className="max-w-5xl mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-white text-center mb-4">
            Coaching for Every Goal
          </h2>
          <p className="text-gray-400 text-center max-w-2xl mx-auto mb-12">
            Not sure which plan fits? Explore coaching tailored to you.
          </p>
          <div className="grid sm:grid-cols-3 gap-6">
            {[
              { href: '/fitness-coaching-for/women', title: 'For Women', text: 'Fat loss, toning, PCOS/thyroid & postpartum — hormone-aware plans.' },
              { href: '/fitness-coaching-for/men', title: 'For Men', text: 'Muscle, fat loss, strength & weight gain with progressive training.' },
              { href: '/fitness-coaching-for/family', title: 'Couples & Family', text: 'Two plans, one journey — get fit together and stay accountable.' },
            ].map((c) => (
              <Link
                key={c.href}
                href={c.href}
                className="block p-6 rounded-2xl border border-white/[0.06] bg-white/[0.02] hover:bg-white/[0.04] hover:border-brand-blue/30 transition-all duration-300"
              >
                <h3 className="text-xl font-bold text-white mb-2">{c.title}</h3>
                <p className="text-gray-400 text-sm leading-relaxed mb-4">{c.text}</p>
                <span className="text-brand-gold text-sm">Explore →</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-16 md:py-24">
        <div className="max-w-3xl mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-white text-center mb-12">
            Pricing FAQs
          </h2>
          <div className="space-y-4">
            {PLAN_FAQS.map((faq, index) => (
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
            Still Deciding? Talk to Us First.
          </h2>
          <p className="text-gray-300 text-lg mb-8 leading-relaxed">
            Start a free consultation and get a personalised plan recommendation — no payment required.
          </p>
          <a
            href={WHATSAPP_CONSULT}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center px-10 py-4 bg-brand-blue hover:bg-brand-blue-dark text-white font-bold rounded-xl transition-all duration-300 text-lg shadow-lg shadow-brand-blue/25 hover:shadow-brand-blue/40"
          >
            Start Consultation
          </a>
          <div className="flex flex-wrap justify-center gap-6 mt-10 text-sm text-gray-400">
            <Link href="/about" className="hover:text-brand-blue transition-colors">About Coach Himanshu</Link>
            <Link href="/faq" className="hover:text-brand-blue transition-colors">All FAQs</Link>
            <Link href="/blog" className="hover:text-brand-blue transition-colors">Fitness Blog</Link>
            <Link href="/contact" className="hover:text-brand-blue transition-colors">Contact</Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
