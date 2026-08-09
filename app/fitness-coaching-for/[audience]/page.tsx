import Link from 'next/link';
import { getAudienceBySlug, getAllAudienceSlugs, AUDIENCES } from '@/lib/audiences';
import { notFound } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import AnnouncementBar from '@/components/AnnouncementBar';

// Direct WhatsApp chat for "Start Consultation" CTAs.
const WHATSAPP_CONSULT =
  'https://wa.me/917303484648?text=Hi%20Coach%20Himanshu!%20I%20want%20to%20start%20a%20free%20consultation.';

export async function generateStaticParams() {
  return getAllAudienceSlugs().map((audience) => ({ audience }));
}

export default function AudiencePage({ params }: { params: { audience: string } }) {
  const data = getAudienceBySlug(params.audience);
  if (!data) notFound();

  const siblings = AUDIENCES.filter((a) => a.slug !== data.slug);

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
            <Link href="/plans" className="hover:text-brand-blue transition-colors">Coaching</Link>
            <span>/</span>
            <span className="text-brand-gold">For {data.audience}</span>
          </nav>

          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
            <span className="bg-gradient-to-r from-brand-blue to-brand-gold bg-clip-text text-transparent">
              {data.heroLead}
            </span>{' '}
            {data.heroTail}
          </h1>

          <p className="text-lg md:text-xl text-gray-300 max-w-3xl mx-auto mb-8 leading-relaxed">
            {data.intro}
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-4">
            <Link
              href="/assessment"
              className="inline-flex items-center justify-center px-8 py-4 bg-brand-blue hover:bg-brand-blue-dark text-white font-semibold rounded-xl transition-all duration-300 text-lg shadow-lg shadow-brand-blue/25 hover:shadow-brand-blue/40"
            >
              Start Free Assessment
            </Link>
            <Link
              href="/plans"
              className="inline-flex items-center justify-center px-8 py-4 border border-white/20 hover:border-brand-gold text-white font-semibold rounded-xl transition-all duration-300 text-lg hover:bg-white/5"
            >
              View All Plans
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
            <div className="text-3xl md:text-4xl font-bold text-brand-gold mb-1">100%</div>
            <div className="text-sm text-gray-400">Personalised Plans</div>
          </div>
          <div>
            <div className="text-3xl md:text-4xl font-bold text-brand-gold mb-1">₹1,299</div>
            <div className="text-sm text-gray-400">Plans Starting From</div>
          </div>
          <div>
            <div className="text-3xl md:text-4xl font-bold text-brand-gold mb-1">6+</div>
            <div className="text-sm text-gray-400">Certifications</div>
          </div>
        </div>
      </section>

      {/* Focus areas / goal chips */}
      <section className="py-16 md:py-24 border-b border-white/[0.06]" style={{ background: 'linear-gradient(180deg, rgba(201,166,70,0.03) 0%, rgba(10,15,31,1) 100%)' }}>
        <div className="max-w-5xl mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-white text-center mb-4">
            {data.goalChipsHeading}
          </h2>
          <p className="text-gray-400 text-center max-w-2xl mx-auto mb-12">
            {data.goalChipsSub}
          </p>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {data.goalChips.map((chip, index) => (
              <div
                key={index}
                className="flex items-center gap-3 p-4 rounded-xl border border-white/[0.06] bg-white/[0.02]"
              >
                <div className="w-8 h-8 rounded-lg bg-brand-gold/10 flex items-center justify-center text-brand-gold text-sm font-bold flex-shrink-0">
                  ✓
                </div>
                <span className="text-white font-medium text-sm">{chip}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why choose */}
      <section className="py-16 md:py-24">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-white text-center mb-4">
            Why {data.audience} Choose{' '}
            <span className="text-brand-gold">Coach Himanshu</span>
          </h2>
          <p className="text-gray-400 text-center max-w-2xl mx-auto mb-12">
            Coaching designed around your body, your goals, and your real life — not a generic template.
          </p>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {data.reasons.map((reason, index) => (
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

      {/* How It Works */}
      <section className="py-16 md:py-24 border-y border-white/[0.06]" style={{ background: 'linear-gradient(180deg, rgba(23,95,255,0.03) 0%, rgba(10,15,31,1) 100%)' }}>
        <div className="max-w-5xl mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-white text-center mb-4">
            How It Works
          </h2>
          <p className="text-gray-400 text-center max-w-2xl mx-auto mb-12">
            Getting started takes just 4 simple steps.
          </p>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {data.steps.map((step) => (
              <div key={step.number} className="relative">
                <div className="text-5xl font-black text-brand-blue/10 mb-2">{step.number}</div>
                <h3 className="text-lg font-semibold text-white mb-2">{step.title}</h3>
                <p className="text-gray-400 text-sm leading-relaxed">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="py-16 md:py-24">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-white text-center mb-4">
            Plans for{' '}
            <span className="text-brand-gold">{data.audience}</span>
          </h2>
          <p className="text-gray-400 text-center max-w-2xl mx-auto mb-12">
            Personalised workout + diet plans and WhatsApp support in every plan. Start free, upgrade when you&apos;re ready.
          </p>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {data.plans.map((plan, index) => (
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
                  href="/plans"
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
            See every plan, including all durations and Elite 1:1 options, on the{' '}
            <Link href="/plans" className="text-brand-blue hover:text-brand-gold transition-colors underline">
              full plans &amp; pricing page
            </Link>.
          </p>
        </div>
      </section>

      {/* Related reading */}
      <section className="py-16 md:py-24 border-y border-white/[0.06]" style={{ background: 'linear-gradient(180deg, rgba(201,166,70,0.03) 0%, rgba(10,15,31,1) 100%)' }}>
        <div className="max-w-5xl mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-white text-center mb-12">
            Helpful Reading
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            {data.relatedBlogs.map((post, index) => (
              <Link
                key={index}
                href={post.href}
                className="block p-6 rounded-2xl border border-white/[0.06] bg-white/[0.02] hover:bg-white/[0.04] hover:border-brand-blue/30 transition-all duration-300"
              >
                <span className="text-brand-blue text-xs font-semibold uppercase tracking-wider">Guide</span>
                <h3 className="text-white font-semibold mt-2 leading-snug">{post.title}</h3>
                <span className="inline-block mt-4 text-brand-gold text-sm">Read →</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-16 md:py-24">
        <div className="max-w-3xl mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-white text-center mb-12">
            Frequently Asked Questions
          </h2>

          <div className="space-y-4">
            {data.faqs.map((faq, index) => (
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
            {data.ctaTitle}
          </h2>
          <p className="text-gray-300 text-lg mb-8 leading-relaxed">
            {data.ctaText}
          </p>

          <a
            href={WHATSAPP_CONSULT}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center px-10 py-4 bg-brand-blue hover:bg-brand-blue-dark text-white font-bold rounded-xl transition-all duration-300 text-lg shadow-lg shadow-brand-blue/25 hover:shadow-brand-blue/40"
          >
            Start Consultation
          </a>

          {/* Cross-links to sibling audience pages */}
          <div className="flex flex-wrap justify-center gap-6 mt-10 text-sm text-gray-400">
            {siblings.map((s) => (
              <Link
                key={s.slug}
                href={`/fitness-coaching-for/${s.slug}`}
                className="hover:text-brand-blue transition-colors"
              >
                Coaching for {s.audience}
              </Link>
            ))}
            <Link href="/about" className="hover:text-brand-blue transition-colors">About Coach Himanshu</Link>
            <Link href="/blog" className="hover:text-brand-blue transition-colors">Fitness Blog</Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
