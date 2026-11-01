import type { Metadata } from 'next';
import Link from 'next/link';
import { COUNTRIES, FX_AS_OF, getCountryBySlug, localPrice, type CountryData } from '@/lib/countries';
import { PLAN_GROUPS, ALL_PLANS, type PlanItem } from '@/lib/plans';
import { lowestPerSession } from '@/lib/globalCities';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import AnnouncementBar from '@/components/AnnouncementBar';
import ActiveSaleNote from '@/components/ActiveSaleNote';

// World price list: every plan in every currency we have a country page for. Prices come
// from lib/pricing.ts (via lib/plans.ts) and rates from FX_INR_PER_UNIT in lib/countries.ts,
// so a price or rate change updates this page with no copy edits.

const URL = 'https://coachhimanshu.com/online-fitness-coach/prices';

function plan(name: string): PlanItem {
  const p = ALL_PLANS.find((x) => x.name === name);
  if (!p) throw new Error(`prices page: plan "${name}" not found in lib/plans.ts`);
  return p;
}
function country(slug: string): CountryData {
  const c = getCountryBySlug(slug);
  if (!c) throw new Error(`prices page: country "${slug}" not found`);
  return c;
}

const KICKSTART = plan('Kickstart Plan');
const CONSISTENCY = plan('Consistency Plan');
const MASTERY = plan('Mastery Plan');
const ELITE_12 = plan('Elite 1:1 — 12 Sessions');

const USA = country('usa');
const UK = country('uk');
const EURO = country('ireland');
const UAE = country('uae');
const CANADA = country('canada');
const AUSTRALIA = country('australia');
const HEADLINE = [USA, UK, EURO, UAE, CANADA, AUSTRALIA];

/** "$16, £12, €14 or AED 58" */
function inMajorCurrencies(inr: number, list = [USA, UK, EURO, UAE]): string {
  const parts = list.map((c) => localPrice(inr, c));
  return `${parts.slice(0, -1).join(', ')} or ${parts[parts.length - 1]}`;
}

const lede = `Coach Himanshu's online fitness coaching costs ${KICKSTART.priceLabel} a month (about ${inMajorCurrencies(KICKSTART.price)}), with a personalised workout and diet plan, weekly one-on-one video check-ins and WhatsApp support. Live 1-on-1 video personal training starts at ${ELITE_12.priceLabel} for 12 sessions (about ${localPrice(ELITE_12.price, USA)}) and falls to about ${lowestPerSession(USA)} a session on the largest package. The price is the same in every country and is charged in Indian rupees.`;

const faqs = [
  {
    question: 'How much does an online fitness coach cost per month in dollars, pounds or dirhams?',
    answer: `With Coach Himanshu, coaching starts at ${KICKSTART.priceLabel} for one month, about ${inMajorCurrencies(KICKSTART.price)} at ${FX_AS_OF} rates. Longer plans cost less per month: the 3-month ${CONSISTENCY.name} is ${CONSISTENCY.priceLabel} (about ${localPrice(CONSISTENCY.price, USA)}) and the 12-month ${MASTERY.name} is ${MASTERY.priceLabel} (about ${localPrice(MASTERY.price, USA)}).`,
  },
  {
    question: 'How much does live 1-on-1 online personal training cost per session?',
    answer: `Live 1-on-1 video sessions start at ${ELITE_12.priceLabel} for 12 sessions (about ${localPrice(ELITE_12.price, USA)} or ${localPrice(ELITE_12.price, UK)}). The 72-session package brings it down to about ${lowestPerSession(USA)}, ${lowestPerSession(UK)} or ${lowestPerSession(UAE)} a session. Every package includes a personalised diet plan and WhatsApp support.`,
  },
  {
    question: 'Which currency am I charged in?',
    answer: `Indian rupees (INR), by international debit or credit card. Your card issuer converts the amount at its own rate and may add a foreign transaction fee, so the local figures on this page are approximate (${FX_AS_OF} rates).`,
  },
  {
    question: 'Is the price different in my country?',
    answer: 'No. There is one price list for the whole world, set in Indian rupees. Only the approximate local amount changes with exchange rates.',
  },
  {
    question: 'Do sale discounts apply outside India?',
    answer: 'Yes. Seasonal sale discounts apply to every checkout, wherever you live. When a sale is running it is shown at the top of this page and on the plans page.',
  },
];

export const metadata: Metadata = {
  title: 'Online Fitness Coach Prices in Your Currency', // root template appends "| Coach Himanshu"
  description: `Online fitness coaching from ${KICKSTART.priceLabel}/month (about ${localPrice(KICKSTART.price, USA)}, ${localPrice(KICKSTART.price, UK)}, ${localPrice(KICKSTART.price, UAE)}). Every plan and live 1-on-1 package priced in ${COUNTRIES.length} countries' currencies.`,
  keywords: [
    'online fitness coach price',
    'online fitness coach cost per month',
    'online personal trainer cost usd',
    'indian online fitness coach price',
    'online fitness coaching price dubai',
    'online personal trainer price uk',
  ],
  openGraph: {
    title: 'Online Fitness Coach Prices in Your Currency | Coach Himanshu',
    description: `Every plan in USD, GBP, EUR, AED and ${COUNTRIES.length - 4}+ more currencies.`,
    url: URL,
    type: 'website',
    images: ['/opengraph-image'],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Online Fitness Coach Prices in Your Currency | Coach Himanshu',
    description: `Every plan in USD, GBP, EUR, AED and ${COUNTRIES.length - 4}+ more currencies.`,
  },
  alternates: { canonical: URL },
};

export default function WorldPricesPage() {
  const schema = [
    {
      '@context': 'https://schema.org',
      '@type': 'Service',
      name: 'Online Fitness Coaching and Live 1-on-1 Personal Training',
      serviceType: 'Online Personal Training',
      url: URL,
      areaServed: { '@type': 'Place', name: 'Worldwide' },
      provider: { '@type': 'Person', '@id': 'https://coachhimanshu.com/#coach', name: 'Coach Himanshu', url: 'https://coachhimanshu.com/about' },
      hasOfferCatalog: {
        '@type': 'OfferCatalog',
        name: 'Coach Himanshu plans',
        itemListElement: ALL_PLANS.map((p) => ({
          '@type': 'Offer',
          name: p.name,
          price: String(p.price),
          priceCurrency: 'INR',
          availability: 'https://schema.org/InStock',
          url: 'https://coachhimanshu.com/plans',
        })),
      },
    },
    {
      '@context': 'https://schema.org',
      '@type': 'WebPage',
      name: 'Online Fitness Coach Prices in Your Currency',
      url: URL,
      author: { '@id': 'https://coachhimanshu.com/#coach' },
      speakable: { '@type': 'SpeakableSpecification', cssSelector: ['#prices-answer'] },
    },
    {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: faqs.map((f) => ({ '@type': 'Question', name: f.question, acceptedAnswer: { '@type': 'Answer', text: f.answer } })),
    },
    {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://coachhimanshu.com' },
        { '@type': 'ListItem', position: 2, name: 'Online Fitness Coach', item: 'https://coachhimanshu.com/online-fitness-coach' },
        { '@type': 'ListItem', position: 3, name: 'Prices', item: URL },
      ],
    },
  ];

  const th = 'px-4 py-3 font-medium whitespace-nowrap';
  const td = 'px-4 py-3 whitespace-nowrap';

  return (
    <div className="min-h-screen bg-brand-navy">
      {schema.map((s, i) => (
        <script key={i} type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(s) }} />
      ))}
      <AnnouncementBar />
      <Navbar />

      {/* Hero */}
      <section className="relative pt-28 pb-12 md:pt-36 md:pb-16 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-brand-blue/10 via-transparent to-transparent" />
        <div className="max-w-4xl mx-auto px-4 text-center relative z-10">
          <nav className="flex flex-wrap justify-center items-center gap-2 text-sm text-gray-400 mb-8">
            <Link href="/" className="hover:text-brand-blue transition-colors">Home</Link>
            <span>/</span>
            <Link href="/online-fitness-coach" className="hover:text-brand-blue transition-colors">Online Fitness Coach</Link>
            <span>/</span>
            <span className="text-brand-gold">Prices</span>
          </nav>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
            Online fitness coach prices{' '}
            <span className="bg-gradient-to-r from-brand-blue to-brand-gold bg-clip-text text-transparent">in your currency</span>
          </h1>
          <p id="prices-answer" className="text-lg md:text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
            {lede}
          </p>
          <ActiveSaleNote />
        </div>
      </section>

      {/* By country */}
      <section className="py-12 md:py-16 border-y border-white/[0.06]" style={{ background: 'linear-gradient(180deg, rgba(23,95,255,0.03) 0%, rgb(var(--c-navy) / 1) 100%)' }}>
        <div className="max-w-5xl mx-auto px-4">
          <h2 className="text-2xl md:text-3xl font-bold text-white text-center mb-3">Prices by country</h2>
          <p className="text-gray-400 text-center mb-8">
            Approximate local amounts at {FX_AS_OF} rates. You are charged the rupee price; your bank converts it.
          </p>
          <div className="overflow-x-auto rounded-2xl border border-white/[0.08]">
            <table className="w-full text-sm">
              <thead className="bg-white/[0.03] text-gray-400">
                <tr>
                  <th className={`text-left ${th}`}>Country</th>
                  <th className={`text-right ${th}`}>1 month<br /><span className="text-xs text-gray-500">{KICKSTART.priceLabel}</span></th>
                  <th className={`text-right ${th}`}>3 months<br /><span className="text-xs text-gray-500">{CONSISTENCY.priceLabel}</span></th>
                  <th className={`text-right ${th}`}>12 months<br /><span className="text-xs text-gray-500">{MASTERY.priceLabel}</span></th>
                  <th className={`text-right ${th}`}>Live 1:1, 12 sessions<br /><span className="text-xs text-gray-500">{ELITE_12.priceLabel}</span></th>
                  <th className={`text-right ${th}`}>Lowest per live session</th>
                </tr>
              </thead>
              <tbody>
                {COUNTRIES.map((c) => (
                  <tr key={c.slug} className="border-t border-white/[0.06] text-gray-200">
                    <td className={`${td} font-medium`}>
                      <Link href={`/online-fitness-coach/${c.slug}`} className="hover:text-brand-gold">{c.country}</Link>
                      <span className="text-gray-500 ml-2 text-xs">{c.currencyCode}</span>
                    </td>
                    <td className={`${td} text-right`}>{localPrice(KICKSTART.price, c)}</td>
                    <td className={`${td} text-right`}>{localPrice(CONSISTENCY.price, c)}</td>
                    <td className={`${td} text-right`}>{localPrice(MASTERY.price, c)}</td>
                    <td className={`${td} text-right text-brand-gold`}>{localPrice(ELITE_12.price, c)}</td>
                    <td className={`${td} text-right`}>{lowestPerSession(c)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Every plan */}
      <section className="py-12 md:py-16">
        <div className="max-w-5xl mx-auto px-4">
          <h2 className="text-2xl md:text-3xl font-bold text-white text-center mb-3">Every plan, in six currencies</h2>
          <p className="text-gray-400 text-center mb-8">
            Couple plans give each partner their own workout and diet plan. Full details are on the{' '}
            <Link href="/plans" className="text-brand-blue hover:text-brand-gold underline">plans page</Link>.
          </p>
          {PLAN_GROUPS.map((g) => (
            <div key={g.key} className="mb-10">
              <h3 className="text-lg font-semibold text-white mb-3">{g.title}</h3>
              <div className="overflow-x-auto rounded-2xl border border-white/[0.08]">
                <table className="w-full text-sm">
                  <thead className="bg-white/[0.03] text-gray-400">
                    <tr>
                      <th className={`text-left ${th}`}>Plan</th>
                      <th className={`text-left ${th}`}>Duration</th>
                      <th className={`text-right ${th}`}>INR</th>
                      {HEADLINE.map((c) => (
                        <th key={c.slug} className={`text-right ${th}`}>≈ {c.currencyCode}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {g.plans.map((p) => (
                      <tr key={p.name} className="border-t border-white/[0.06] text-gray-200">
                        <td className={`${td} font-medium`}>{p.name}</td>
                        <td className={td}>{p.durationLabel}</td>
                        <td className={`${td} text-right text-brand-gold`}>{p.priceLabel}</td>
                        {HEADLINE.map((c) => (
                          <td key={c.slug} className={`${td} text-right`}>{localPrice(p.price, c)}</td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* FAQ */}
      <section className="py-12 md:py-16 border-t border-white/[0.06]">
        <div className="max-w-3xl mx-auto px-4">
          <h2 className="text-2xl md:text-3xl font-bold text-white text-center mb-10">Questions about price</h2>
          <div className="space-y-4">
            {faqs.map((f) => (
              <div key={f.question} className="p-6 rounded-2xl border border-white/[0.06] bg-white/[0.02]">
                <h3 className="text-lg font-semibold text-white mb-3">{f.question}</h3>
                <p className="text-gray-400 text-sm leading-relaxed">{f.answer}</p>
              </div>
            ))}
          </div>
          <div className="mt-12 flex flex-wrap justify-center gap-x-6 gap-y-2 text-sm">
            <Link href="/online-fitness-coach" className="text-brand-blue hover:text-brand-gold">Coaching in {COUNTRIES.length} countries</Link>
            <Link href="/online-personal-trainer" className="text-brand-blue hover:text-brand-gold">Live 1:1 personal training</Link>
            <Link href="/personal-trainer-cost-india" className="text-brand-blue hover:text-brand-gold">Personal trainer cost in India</Link>
            <Link href="/plans" className="text-brand-blue hover:text-brand-gold">Compare all plans</Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
