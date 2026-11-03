import type { Metadata } from 'next';
import { Check } from 'lucide-react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import AnnouncementBar from '@/components/AnnouncementBar';
import { getElitePlans, getEliteOfferRange } from '@/lib/personalTraining';
import { getGoalBySlug, getAllGoalSlugs, PT_GOALS } from '@/lib/ptGoals';
import { CONDITIONS_REVIEWED, PT_CONDITIONS } from '@/lib/ptConditions';
import { CITIES } from '@/lib/cities';
import { getToolBySlug } from '@/lib/fitnessTools';
import { LOWEST_ELITE_PRICE, formatINR } from '@/lib/pricing';

const WHATSAPP_1ON1 =
  'https://wa.me/917303484648?text=Hi%20Coach%20Himanshu!%20I%20want%20live%201-on-1%20personal%20training.%20Please%20help%20me%20pick%20a%20plan.';

// The free calculator most useful for each goal (falls back to the /tools hub).
const GOAL_TOOL: Record<string, string> = {
  'weight-loss': 'calorie-deficit-calculator',
  'muscle-gain': 'protein-calculator',
  'weight-gain': 'tdee-calculator',
  beginners: 'bmi-calculator',
  toning: 'body-fat-calculator',
  pcos: 'calorie-deficit-calculator',
  thyroid: 'tdee-calculator',
  'high-blood-pressure': 'bmi-calculator',
  'fatty-liver': 'bmi-calculator',
  'back-pain': 'bmi-calculator',
  'knee-pain': 'bmi-calculator',
  postpartum: 'tdee-calculator',
};

export function generateStaticParams() {
  return getAllGoalSlugs().map((goal) => ({ goal }));
}

export async function generateMetadata({ params }: { params: { goal: string } }): Promise<Metadata> {
  const goal = getGoalBySlug(params.goal);
  if (!goal) return { title: 'Not Found' };
  const url = `https://coachhimanshu.com/online-personal-trainer/for/${goal.slug}`;
  const inSentence = goal.sentenceName ?? goal.name.toLowerCase();
  return {
    title: goal.metaTitle,
    description: goal.metaDescription,
    keywords: [
      `online personal trainer for ${inSentence}`,
      `personal trainer for ${inSentence}`,
      `1 on 1 online training ${inSentence}`,
      `online fitness coach for ${inSentence}`,
    ],
    openGraph: { title: `${goal.metaTitle} | Coach Himanshu`, description: goal.metaDescription, url, type: 'website' },
    twitter: { card: 'summary_large_image', title: `${goal.metaTitle} | Coach Himanshu`, description: goal.metaDescription },
    alternates: { canonical: url },
  };
}

export default function GoalPersonalTrainerPage({ params }: { params: { goal: string } }) {
  const goal = getGoalBySlug(params.goal);
  if (!goal) notFound();

  const elitePlans = getElitePlans();
  const health = goal.health;
  const siblings = PT_GOALS.filter((g) => g.slug !== goal.slug);
  const conditionSiblings = PT_CONDITIONS.filter((g) => g.slug !== goal.slug);
  const goalTool = getToolBySlug(GOAL_TOOL[goal.slug] ?? '');
  const url = `https://coachhimanshu.com/online-personal-trainer/for/${goal.slug}`;
  const { low, high, count } = getEliteOfferRange();

  const serviceSchema: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: `${goal.metaTitle}`,
    description: goal.metaDescription,
    url,
    serviceType: 'Online Personal Training',
    provider: {
      '@type': 'Person',
      '@id': 'https://coachhimanshu.com/#coach',
      name: 'Coach Himanshu',
      jobTitle: 'NASM Certified Fitness Coach',
      url: 'https://coachhimanshu.com/about',
    },
    areaServed: { '@type': 'GeoShape', name: 'Worldwide' },
    availableChannel: { '@type': 'ServiceChannel', serviceUrl: url, availableLanguage: ['English', 'Hindi'] },
    ...(low && high
      ? { offers: { '@type': 'AggregateOffer', priceCurrency: 'INR', lowPrice: String(low), highPrice: String(high), offerCount: String(count), url } }
      : {}),
  };

  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: goal.faqs.map((f) => ({
      '@type': 'Question',
      name: f.question,
      acceptedAnswer: { '@type': 'Answer', text: f.answer },
    })),
  };

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://coachhimanshu.com' },
      { '@type': 'ListItem', position: 2, name: 'Online Personal Trainer', item: 'https://coachhimanshu.com/online-personal-trainer' },
      { '@type': 'ListItem', position: 3, name: `For ${goal.name}`, item: url },
    ],
  };

  const healthPageSchema = health && {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    url,
    name: goal.metaTitle,
    lastReviewed: CONDITIONS_REVIEWED,
    about: { '@type': health.aboutType ?? 'Thing', name: health.aboutName },
    citation: Array.from(new Set(health.evidence.map((e) => e.url))),
    speakable: { '@type': 'SpeakableSpecification', cssSelector: ['#goal-answer'] },
  };

  return (
    <div className="min-h-screen bg-brand-navy">
      {healthPageSchema && <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(healthPageSchema) }} />}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
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
            <Link href="/online-personal-trainer" className="hover:text-brand-blue transition-colors">Online Personal Trainer</Link>
            <span>/</span>
            <span className="text-brand-gold">For {goal.name}</span>
          </nav>

          <div className="inline-flex items-center gap-2 px-4 py-1.5 mb-6 rounded-full border border-brand-gold/30 bg-brand-gold/5 text-brand-gold text-xs font-semibold uppercase tracking-wider">
            {goal.name} · Live 1-on-1 Coaching
          </div>

          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
            <span className="bg-gradient-to-r from-brand-blue to-brand-gold bg-clip-text text-transparent">{goal.heroLead}</span>{' '}
            {goal.heroTail}
          </h1>

          <p id="goal-answer" className="text-lg md:text-xl text-gray-300 max-w-3xl mx-auto mb-8 leading-relaxed">{goal.intro}</p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href={WHATSAPP_1ON1} target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center px-8 py-4 bg-brand-blue hover:bg-brand-blue-dark text-white font-semibold rounded-xl transition-all duration-300 text-lg shadow-lg shadow-brand-blue/25 hover:shadow-brand-blue/40">
              Book a Free Consultation
            </a>
            <Link href="#packages" className="inline-flex items-center justify-center px-8 py-4 border border-white/20 hover:border-brand-gold text-white font-semibold rounded-xl transition-all duration-300 text-lg hover:bg-white/5">
              See 1:1 Packages
            </Link>
          </div>
        </div>
      </section>

      {/* Trust bar */}
      <section className="py-8 border-y border-white/[0.06]" style={{ background: 'linear-gradient(180deg, rgba(23,95,255,0.05) 0%, rgb(var(--c-navy) / 1) 100%)' }}>
        <div className="max-w-5xl mx-auto px-4 grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          <div><div className="text-3xl md:text-4xl font-bold text-brand-gold mb-1">1000+</div><div className="text-sm text-gray-400">Transformations</div></div>
          <div><div className="text-3xl md:text-4xl font-bold text-brand-gold mb-1">60 min</div><div className="text-sm text-gray-400">Per Live Session</div></div>
          <div><div className="text-3xl md:text-4xl font-bold text-brand-gold mb-1">{formatINR(LOWEST_ELITE_PRICE)}</div><div className="text-sm text-gray-400">1:1 Starting From</div></div>
          <div><div className="text-3xl md:text-4xl font-bold text-brand-gold mb-1">NASM</div><div className="text-sm text-gray-400">Certified Coach</div></div>
        </div>
      </section>

      {/* Focus chips */}
      <section className="py-16 md:py-24">
        <div className="max-w-5xl mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-white text-center mb-4">What We Focus On</h2>
          <p className="text-gray-400 text-center max-w-2xl mx-auto mb-12">Coaching built specifically around {goal.sentenceName ?? goal.name.toLowerCase()}.</p>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {goal.focusChips.map((chip, i) => (
              <div key={i} className="flex items-center gap-3 p-4 rounded-xl border border-white/[0.06] bg-white/[0.02]">
                <div className="w-8 h-8 rounded-lg bg-brand-gold/10 flex items-center justify-center text-brand-gold flex-shrink-0"><Check className="w-4 h-4" strokeWidth={2.75} aria-hidden /></div>
                <span className="text-white font-medium text-sm">{chip}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Approach */}
      <section className="py-16 md:py-24 border-y border-white/[0.06]" style={{ background: 'linear-gradient(180deg, rgba(201,166,70,0.03) 0%, rgb(var(--c-navy) / 1) 100%)' }}>
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-white text-center mb-4">{goal.approachHeading}</h2>
          <p className="text-gray-400 text-center max-w-2xl mx-auto mb-12">{health ? "Coached live, one-on-one, and adjusted to what your doctor has advised." : 'A method proven across 1000+ transformations — coached live, one-on-one.'}</p>
          <div className="grid md:grid-cols-2 gap-6">
            {goal.approach.map((item, i) => (
              <div key={i} className="p-6 rounded-2xl border border-white/[0.06] bg-white/[0.02] hover:bg-white/[0.04] transition-colors duration-300">
                <div className="w-10 h-10 rounded-xl bg-brand-blue/10 flex items-center justify-center text-brand-blue font-bold text-lg mb-4">{i + 1}</div>
                <h3 className="text-lg font-semibold text-white mb-2">{item.title}</h3>
                <p className="text-gray-400 text-sm leading-relaxed">{item.text}</p>
              </div>
            ))}
          </div>
          <div className="mt-10 p-6 rounded-2xl border border-brand-gold/20 bg-brand-gold/5 max-w-3xl mx-auto">
            <p className="text-gray-200 text-sm leading-relaxed"><strong className="text-brand-gold">{health ? 'What to expect:' : 'Realistic timeline:'}</strong> {goal.timeline}</p>
          </div>
        </div>
      </section>

      {health && (
        <section className="py-16 md:py-24">
          <div className="max-w-3xl mx-auto px-4">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Before You Start</h2>
            <p className="text-gray-300 leading-relaxed mb-6">{health.doctorNote}</p>
            {health.urgent && (
              <div className="p-6 rounded-2xl border border-red-500/30 bg-red-500/5 mb-10">
                <h3 className="text-lg font-semibold text-white mb-3">{health.urgent.heading}</h3>
                <ul className="list-disc pl-5 space-y-1 text-gray-300 text-sm leading-relaxed">
                  {health.urgent.items.map((item) => <li key={item}>{item}</li>)}
                </ul>
                <p className="text-xs text-gray-500 mt-3">
                  Source: <a href={health.urgent.url} target="_blank" rel="noopener noreferrer" className="underline hover:text-brand-blue">{health.urgent.source}</a>
                </p>
              </div>
            )}
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">What the Health Bodies Say</h2>
            <ul className="space-y-3 mb-6">
              {health.evidence.map((e) => (
                <li key={e.text} className="text-gray-300 text-sm leading-relaxed">
                  {e.text}{' '}
                  <a href={e.url} target="_blank" rel="noopener noreferrer" className="text-gray-500 underline hover:text-brand-blue whitespace-nowrap">{e.source}</a>
                </li>
              ))}
            </ul>
            <p className="text-xs text-gray-500 leading-relaxed mb-8">
              Sources last checked{' '}
              {new Date(CONDITIONS_REVIEWED).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' })}. Coach Himanshu is a fitness coach, not a doctor. This page is general information, not medical advice. See our{' '}
              <Link href="/disclaimer" className="underline hover:text-brand-blue">disclaimer</Link>.
            </p>
            <h3 className="text-lg font-semibold text-white mb-3">Read more</h3>
            <ul className="space-y-2 text-sm">
              {health.guides.map((g) => (
                <li key={g.href}><Link href={g.href} className="text-brand-blue hover:text-brand-gold transition-colors underline">{g.title}</Link></li>
              ))}
            </ul>
          </div>
        </section>
      )}

      {/* Packages */}
      <section id="packages" className="py-16 md:py-24 scroll-mt-24">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-white text-center mb-4">Live <span className="text-brand-gold">1:1 Packages</span></h2>
          <p className="text-gray-400 text-center max-w-2xl mx-auto mb-12">All sessions are 60 minutes, one-on-one, live on video. Bigger packages lower your per-session price.</p>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {elitePlans.map((plan, index) => (
              <div key={index} className={`relative p-6 rounded-2xl border transition-all duration-300 flex flex-col ${plan.popular ? 'border-brand-blue bg-brand-blue/5 shadow-lg shadow-brand-blue/10' : 'border-white/[0.06] bg-white/[0.02] hover:border-white/[0.12]'}`}>
                {plan.popular && (<div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 bg-brand-blue text-white text-xs font-bold rounded-full whitespace-nowrap">MOST POPULAR</div>)}
                <div className="text-sm text-gray-400 mb-1">{plan.durationLabel}</div>
                <h3 className="text-lg font-bold text-white mb-1">{plan.name}</h3>
                <div className="text-3xl font-black text-brand-gold mb-1">{plan.priceLabel}</div>
                <div className="text-xs text-gray-500 mb-4">{plan.tagline}</div>
                <ul className="space-y-2 mb-6 flex-1">
                  {plan.features.map((feature, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-gray-300"><span className="text-brand-blue mt-0.5 flex-shrink-0">&#10003;</span>{feature}</li>
                  ))}
                </ul>
                <a href={WHATSAPP_1ON1} target="_blank" rel="noopener noreferrer" className={`block text-center py-3 rounded-xl font-semibold transition-all duration-300 text-sm ${plan.popular ? 'bg-brand-blue text-white hover:bg-brand-blue-dark' : 'border border-white/20 text-white hover:border-brand-gold hover:bg-white/5'}`}>Book This Package</a>
              </div>
            ))}
          </div>
          <p className="text-center text-gray-500 text-sm mt-8">
            See the full comparison and couple options on the{' '}
            <Link href="/online-personal-trainer" className="text-brand-blue hover:text-brand-gold transition-colors underline">live 1:1 personal training page</Link>.
          </p>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-16 md:py-24 border-y border-white/[0.06]" style={{ background: 'linear-gradient(180deg, rgba(23,95,255,0.03) 0%, rgb(var(--c-navy) / 1) 100%)' }}>
        <div className="max-w-3xl mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-white text-center mb-12">Online Personal Trainer for {goal.name} — FAQs</h2>
          <div className="space-y-4">
            {goal.faqs.map((faq, index) => (
              <div key={index} className="p-6 rounded-2xl border border-white/[0.06] bg-white/[0.02]">
                <h3 className="text-lg font-semibold text-white mb-3">{faq.question}</h3>
                <p className="text-gray-400 text-sm leading-relaxed">{faq.answer}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA + sibling goals */}
      <section className="py-16 md:py-24 border-t border-white/[0.06]" style={{ background: 'linear-gradient(180deg, rgba(23,95,255,0.06) 0%, rgb(var(--c-navy) / 1) 100%)' }}>
        <div className="max-w-3xl mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">{health?.ctaHeading ?? `Start Your ${goal.name} Journey — Live 1-on-1`}</h2>
          <p className="text-gray-300 text-lg mb-8 leading-relaxed">Book a free consultation. Coach Himanshu will learn your goals and recommend the right 1:1 package — no payment required to start.</p>
          <a href={WHATSAPP_1ON1} target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center px-10 py-4 bg-brand-blue hover:bg-brand-blue-dark text-white font-bold rounded-xl transition-all duration-300 text-lg shadow-lg shadow-brand-blue/25 hover:shadow-brand-blue/40">Book a Free Consultation</a>

          <p className="text-gray-500 text-sm mt-12 mb-4">Live 1:1 coaching for other goals:</p>
          <div className="flex flex-wrap justify-center gap-x-5 gap-y-2 text-sm text-gray-400 mb-8">
            {siblings.map((s) => (
              <Link key={s.slug} href={`/online-personal-trainer/for/${s.slug}`} className="hover:text-brand-blue transition-colors">For {s.name}</Link>
            ))}
          </div>

          <p className="text-gray-500 text-sm mb-4">Training with a health condition:</p>
          <div className="flex flex-wrap justify-center gap-x-5 gap-y-2 text-sm text-gray-400 mb-8">
            {conditionSiblings.map((s) => (
              <Link key={s.slug} href={`/online-personal-trainer/for/${s.slug}`} className="hover:text-brand-blue transition-colors">For {s.name}</Link>
            ))}
          </div>

          <p className="text-gray-500 text-sm mb-4">Popular cities for live 1:1 training:</p>
          <div className="flex flex-wrap justify-center gap-x-5 gap-y-2 text-sm text-gray-400">
            {CITIES.slice(0, 8).map((c) => (
              <Link key={c.slug} href={`/online-personal-trainer/${c.slug}`} className="hover:text-brand-blue transition-colors">{c.name}</Link>
            ))}
            <Link href="/online-personal-trainer" className="text-brand-gold hover:text-white transition-colors">All 1:1 Coaching →</Link>
          </div>
          <p className="mt-4 text-sm text-gray-500">
            Free tool:{' '}
            <Link href={goalTool ? `/tools/${goalTool.slug}` : '/tools'} className="text-brand-blue hover:text-brand-gold transition-colors">
              {goalTool ? goalTool.name : 'Fitness Calculators'}
            </Link>
          </p>
        </div>
      </section>

      <Footer />

      {/* Sticky mobile CTA */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 p-3 bg-brand-navy/95 backdrop-blur border-t border-white/[0.08]">
        <a href={WHATSAPP_1ON1} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-2 w-full py-3.5 bg-brand-blue hover:bg-brand-blue-dark text-white font-bold rounded-xl transition-colors shadow-lg shadow-brand-blue/25">
          Book a Free 1:1 Consultation
        </a>
      </div>
    </div>
  );
}
