import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import AnnouncementBar from '@/components/AnnouncementBar';
import { getCityBySlug, getAllCitySlugs, CITIES } from '@/lib/cities';
import {
  getElitePlans,
  getEliteOfferRange,
  ptCityAngle,
  ptCityFaqs,
  ptCityMeta,
} from '@/lib/personalTraining';
import { PT_GOALS } from '@/lib/ptGoals';

const WHATSAPP_1ON1 =
  'https://wa.me/917303484648?text=Hi%20Coach%20Himanshu!%20I%20want%20live%201-on-1%20personal%20training.%20Please%20help%20me%20pick%20a%20plan.';

export function generateStaticParams() {
  return getAllCitySlugs().map((city) => ({ city }));
}

export async function generateMetadata({ params }: { params: { city: string } }): Promise<Metadata> {
  const city = getCityBySlug(params.city);
  if (!city) return { title: 'Not Found' };
  const url = `https://coachhimanshu.com/online-personal-trainer/${city.slug}`;
  const { title, description } = ptCityMeta(city);
  return {
    title,
    description,
    keywords: [
      `online personal trainer in ${city.name}`,
      `personal trainer ${city.name}`,
      `1 on 1 personal training ${city.name}`,
      `online fitness coach ${city.name}`,
      `personal trainer cost ${city.name}`,
    ],
    openGraph: { title: `${title} | Coach Himanshu`, description, url, type: 'website' },
    twitter: { card: 'summary_large_image', title: `${title} | Coach Himanshu`, description },
    alternates: { canonical: url },
  };
}

export default function CityPersonalTrainerPage({ params }: { params: { city: string } }) {
  const city = getCityBySlug(params.city);
  if (!city) notFound();

  const elitePlans = getElitePlans();
  const angle = ptCityAngle(city);
  const faqs = ptCityFaqs(city);
  const nearbyCities = CITIES.filter((c) => c.slug !== city.slug).slice(0, 8);

  const url = `https://coachhimanshu.com/online-personal-trainer/${city.slug}`;
  const { low, high, count } = getEliteOfferRange();

  const serviceSchema: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: `Online Personal Trainer in ${city.name} — Live 1-on-1 Training`,
    description: ptCityMeta(city).description,
    url,
    serviceType: 'Online Personal Training',
    provider: {
      '@type': 'Person',
      name: 'Coach Himanshu',
      jobTitle: 'NASM Certified Personal Trainer',
      url: 'https://coachhimanshu.com/about',
    },
    areaServed: { '@type': 'City', name: city.name, containedInPlace: { '@type': 'AdministrativeArea', name: city.state } },
    availableChannel: {
      '@type': 'ServiceChannel',
      serviceUrl: url,
      availableLanguage: ['English', 'Hindi'],
    },
    ...(low && high
      ? {
          offers: {
            '@type': 'AggregateOffer',
            priceCurrency: 'INR',
            lowPrice: String(low),
            highPrice: String(high),
            offerCount: String(count),
            url,
          },
        }
      : {}),
  };

  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((f) => ({
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
      { '@type': 'ListItem', position: 3, name: city.name, item: url },
    ],
  };

  return (
    <div className="min-h-screen bg-brand-navy">
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
            <span className="text-brand-gold">{city.name}</span>
          </nav>

          <div className="inline-flex items-center gap-2 px-4 py-1.5 mb-6 rounded-full border border-brand-gold/30 bg-brand-gold/5 text-brand-gold text-xs font-semibold uppercase tracking-wider">
            {city.name} · Live 1-on-1 · Real-time coaching
          </div>

          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
            Online Personal Trainer in{' '}
            <span className="bg-gradient-to-r from-brand-blue to-brand-gold bg-clip-text text-transparent">
              {city.name}
            </span>
          </h1>

          <p className="text-lg md:text-xl text-gray-300 max-w-3xl mx-auto mb-8 leading-relaxed">
            Train live, one-on-one, with Coach Himanshu — a NASM-certified personal trainer — over video
            sessions with real-time form correction. Get the results of an in-person trainer in {city.name}
            without the commute or the gym premium. Book from anywhere in {city.name}, {city.state}.
          </p>

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

      {/* Why live 1:1 works in this city */}
      <section className="py-16 md:py-24">
        <div className="max-w-5xl mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-white text-center mb-4">
            Why Live 1:1 Beats a Gym Trainer in {city.name}
          </h2>
          <p className="text-gray-400 text-center max-w-2xl mx-auto mb-12">
            {city.description ? `In ${city.name}, ${city.description}, ` : ''}the same expert coaching — without the downsides of in-person.
          </p>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { title: 'No commute, no traffic', text: angle.commute },
              { title: `${city.name} foods in your diet`, text: angle.diet },
              { title: 'A fraction of the cost', text: angle.cost },
            ].map((card, i) => (
              <div key={i} className="p-6 rounded-2xl border border-white/[0.06] bg-white/[0.02] hover:bg-white/[0.04] transition-colors duration-300">
                <div className="w-10 h-10 rounded-xl bg-brand-blue/10 flex items-center justify-center text-brand-blue font-bold text-lg mb-4">{i + 1}</div>
                <h3 className="text-lg font-semibold text-white mb-2">{card.title}</h3>
                <p className="text-gray-400 text-sm leading-relaxed">{card.text}</p>
              </div>
            ))}
          </div>
          {city.fitnessStats ? (
            <p className="text-center text-gray-500 text-sm mt-10 max-w-2xl mx-auto">
              {city.fitnessStats} — a live coach who keeps you accountable is the fastest way to change that.
            </p>
          ) : null}
        </div>
      </section>

      {/* How it works */}
      <section className="py-16 md:py-24 border-y border-white/[0.06]" style={{ background: 'linear-gradient(180deg, rgba(23,95,255,0.03) 0%, rgba(10,15,31,1) 100%)' }}>
        <div className="max-w-5xl mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-white text-center mb-4">
            How Your Live Sessions Work
          </h2>
          <p className="text-gray-400 text-center max-w-2xl mx-auto mb-12">
            From first message to first workout in four simple steps.
          </p>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { number: '01', title: 'Free consultation', description: `Message on WhatsApp. Coach Himanshu learns your goals, ${city.name} schedule, and equipment, then recommends the right 1:1 package.` },
              { number: '02', title: 'Assessment & plan', description: `Complete a short assessment. Your workout and Indian diet plan are built around your body and ${city.name} lifestyle.` },
              { number: '03', title: 'Book your sessions', description: 'Pick times that suit you — early mornings, late evenings, weekends. Each session is 60 minutes, one-on-one.' },
              { number: '04', title: 'Train & progress', description: 'Train live with real-time coaching and form correction. Your program adapts every week as you get stronger.' },
            ].map((step) => (
              <div key={step.number} className="relative">
                <div className="text-5xl font-black text-brand-blue/10 mb-2">{step.number}</div>
                <h3 className="text-lg font-semibold text-white mb-2">{step.title}</h3>
                <p className="text-gray-400 text-sm leading-relaxed">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Packages */}
      <section id="packages" className="py-16 md:py-24 scroll-mt-24">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-white text-center mb-4">
            Live <span className="text-brand-gold">1:1 Packages</span> for {city.name}
          </h2>
          <p className="text-gray-400 text-center max-w-2xl mx-auto mb-12">
            All sessions are 60 minutes, one-on-one, live on video. Bigger packages lower your per-session price.
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
            See the full comparison and couple options on the{' '}
            <Link href="/online-personal-trainer" className="text-brand-blue hover:text-brand-gold transition-colors underline">
              live 1:1 personal training page
            </Link>{' '}or the{' '}
            <Link href="/plans" className="text-brand-blue hover:text-brand-gold transition-colors underline">
              full plans &amp; pricing page
            </Link>.
          </p>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-16 md:py-24 border-y border-white/[0.06]" style={{ background: 'linear-gradient(180deg, rgba(201,166,70,0.03) 0%, rgba(10,15,31,1) 100%)' }}>
        <div className="max-w-3xl mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-white text-center mb-12">
            Online Personal Training in {city.name} — FAQs
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

      {/* Final CTA + nearby cities */}
      <section className="py-16 md:py-24 border-t border-white/[0.06]" style={{ background: 'linear-gradient(180deg, rgba(23,95,255,0.06) 0%, rgba(10,15,31,1) 100%)' }}>
        <div className="max-w-3xl mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Start Live 1:1 Training in {city.name}
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

          <p className="text-gray-500 text-sm mt-12 mb-4">Live 1:1 training in {city.name} for your goal:</p>
          <div className="flex flex-wrap justify-center gap-x-5 gap-y-2 text-sm text-gray-400 mb-8">
            {PT_GOALS.map((g) => (
              <Link key={g.slug} href={`/online-personal-trainer/for/${g.slug}`} className="hover:text-brand-blue transition-colors">
                For {g.name}
              </Link>
            ))}
          </div>

          <p className="text-gray-500 text-sm mb-4">Live 1:1 personal training in other cities:</p>
          <div className="flex flex-wrap justify-center gap-x-5 gap-y-2 text-sm text-gray-400">
            {nearbyCities.map((c) => (
              <Link key={c.slug} href={`/online-personal-trainer/${c.slug}`} className="hover:text-brand-blue transition-colors">
                {c.name}
              </Link>
            ))}
            <Link href="/online-personal-trainer" className="text-brand-gold hover:text-white transition-colors">All 1:1 Coaching →</Link>
          </div>
        </div>
      </section>

      <Footer />

      {/* Sticky mobile CTA */}
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
