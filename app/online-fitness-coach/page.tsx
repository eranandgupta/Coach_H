import type { Metadata } from 'next';
import Link from 'next/link';
import { COUNTRIES, NRI_FAQS, NRI_HUB_URL, countryHreflangs } from '@/lib/countries';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import AnnouncementBar from '@/components/AnnouncementBar';
import ConsultationForm from '@/components/ConsultationForm';

const WHATSAPP_NRI =
  'https://wa.me/917303484648?text=Hi%20Coach%20Himanshu!%20I%20live%20outside%20India%20and%20want%20a%20free%20consultation%20for%20online%20coaching.';

const description =
  'NASM-certified online Indian fitness coach for NRIs in 20+ countries. Indian meal plans you can cook abroad, live sessions in your time zone, WhatsApp support. From ₹1,299/month, international cards accepted.';

export const metadata: Metadata = {
  title: 'Online Indian Fitness Coach Worldwide',
  description,
  keywords: [
    'online indian fitness coach',
    'indian fitness coach for nri',
    'online personal trainer for nri',
    'indian diet plan abroad',
    'online fitness coach worldwide',
    'indian nutritionist online for nri',
  ],
  alternates: { canonical: NRI_HUB_URL, languages: countryHreflangs() },
  openGraph: {
    title: 'Online Indian Fitness Coach Worldwide | Coach Himanshu',
    description,
    url: NRI_HUB_URL,
    type: 'website',
    images: ['/opengraph-image'],
  },
  twitter: { card: 'summary_large_image', title: 'Online Indian Fitness Coach Worldwide | Coach Himanshu', description },
};

const STEPS = [
  { title: 'Free consultation', text: 'Tell us your goal, schedule and where you live. Coach Himanshu recommends the right plan — recorded coaching or live 1-on-1.' },
  { title: 'Assessment & plan in 24 hours', text: 'Complete the fitness assessment and get your personalised workout and Indian meal plan, built around food available in your country.' },
  { title: 'Train on your time zone', text: 'Follow the plan in the app at home or your gym. Live sessions and weekly check-ins are booked in your local time.' },
  { title: 'Adjust every week', text: 'Send progress photos and measurements on WhatsApp; the plan is updated as your body and schedule change.' },
];

export default function OnlineFitnessCoachHub() {
  const byRegion = COUNTRIES.reduce<Record<string, typeof COUNTRIES>>((acc, c) => {
    (acc[c.region] ||= []).push(c);
    return acc;
  }, {});

  const serviceSchema = {
    '@context': 'https://schema.org',
    '@type': 'Service',
    '@id': `${NRI_HUB_URL}#service`,
    name: 'Online Fitness Coaching for Indians Abroad (NRIs)',
    description,
    url: NRI_HUB_URL,
    serviceType: 'Online Personal Training & Nutrition Coaching',
    provider: { '@type': 'Person', '@id': 'https://coachhimanshu.com/#coach', name: 'Coach Himanshu' },
    areaServed: [
      { '@type': 'Place', name: 'Worldwide' },
      ...COUNTRIES.map((c) => ({ '@type': 'Country', name: c.country })),
    ],
    availableChannel: {
      '@type': 'ServiceChannel',
      serviceUrl: NRI_HUB_URL,
      availableLanguage: ['English', 'Hindi'],
    },
    offers: {
      '@type': 'AggregateOffer',
      priceCurrency: 'INR',
      lowPrice: '1299',
      highPrice: '31999',
      url: 'https://coachhimanshu.com/plans',
    },
  };

  const pageSchema = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    '@id': `${NRI_HUB_URL}#webpage`,
    url: NRI_HUB_URL,
    name: 'Online Indian Fitness Coach Worldwide',
    description,
    inLanguage: 'en',
    isPartOf: { '@id': 'https://coachhimanshu.com/#website' },
    author: { '@type': 'Person', '@id': 'https://coachhimanshu.com/#coach', name: 'Coach Himanshu' },
    publisher: { '@id': 'https://coachhimanshu.com/#organization' },
    speakable: { '@type': 'SpeakableSpecification', cssSelector: ['#nri-intro'] },
    mainEntity: {
      '@type': 'ItemList',
      name: 'Online Indian fitness coaching by country',
      numberOfItems: COUNTRIES.length,
      itemListElement: COUNTRIES.map((c, i) => ({
        '@type': 'ListItem',
        position: i + 1,
        name: `Online Indian Fitness Coach in ${c.name}`,
        url: `${NRI_HUB_URL}/${c.slug}`,
      })),
    },
  };

  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: NRI_FAQS.map((f) => ({
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
      { '@type': 'ListItem', position: 2, name: 'Online Fitness Coach Worldwide', item: NRI_HUB_URL },
    ],
  };

  return (
    <div className="min-h-screen bg-brand-navy">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(pageSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <AnnouncementBar />
      <Navbar />

      {/* Hero */}
      <section className="relative pt-28 pb-12 md:pt-36 md:pb-16 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-brand-blue/10 via-transparent to-transparent" />
        <div className="max-w-5xl mx-auto px-4 text-center relative z-10">
          <nav className="mb-4 text-xs text-gray-500" aria-label="Breadcrumb">
            <Link href="/" className="hover:text-gray-300">Home</Link>
            <span className="mx-1.5">/</span>
            <span className="text-gray-400">Online Fitness Coach Worldwide</span>
          </nav>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
            Online Indian{' '}
            <span className="bg-gradient-to-r from-brand-blue to-brand-gold bg-clip-text text-transparent">Fitness Coach</span>{' '}
            Worldwide
          </h1>
          <p id="nri-intro" className="text-lg md:text-xl text-gray-300 max-w-3xl mx-auto mb-8 leading-relaxed">
            Coach Himanshu is a NASM-certified fitness coach who trains Indians and NRIs in {COUNTRIES.length}+ countries
            entirely online: a personalised workout plan, an Indian meal plan built around food you can buy where you live,
            live video sessions in your own time zone, and daily WhatsApp support. Plans start at ₹1,299 a month and
            international cards are accepted.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <a
              href="#enquiry"
              className="inline-flex items-center justify-center px-8 py-4 bg-brand-blue hover:bg-brand-blue-dark text-white font-semibold rounded-xl transition-all duration-300 text-lg shadow-lg shadow-brand-blue/25 hover:shadow-brand-blue/40"
            >
              Request a Free Consultation
            </a>
            <Link
              href="/online-personal-trainer"
              className="inline-flex items-center justify-center px-8 py-4 border border-white/20 hover:border-brand-gold text-white font-semibold rounded-xl transition-all duration-300 text-lg hover:bg-white/5"
            >
              Live 1:1 Training
            </Link>
          </div>
        </div>
      </section>

      {/* Proof strip */}
      <section className="py-8 border-y border-white/[0.06]">
        <div className="max-w-5xl mx-auto px-4 grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          {[
            { value: `${COUNTRIES.length}+`, label: 'Countries with clients' },
            { value: '1000+', label: 'Transformations' },
            { value: 'NASM', label: 'Certified coach' },
            { value: '24 hrs', label: 'Plan delivery' },
          ].map((s) => (
            <div key={s.label}>
              <div className="text-2xl md:text-3xl font-extrabold text-brand-gold">{s.value}</div>
              <div className="mt-1 text-sm text-gray-400">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Country grid */}
      <section className="py-12 md:py-16">
        <div className="max-w-5xl mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-white text-center mb-3">Coaching for Indians in every region</h2>
          <p className="text-gray-400 text-center max-w-2xl mx-auto mb-10">
            Each page covers local pricing, how sessions fit your time zone, and the food and lifestyle realities of Indians living there.
          </p>
          {Object.entries(byRegion).map(([region, countries]) => (
            <div key={region} className="mb-10">
              <h3 className="text-xl font-bold text-brand-gold mb-4">{region}</h3>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {countries.map((c) => (
                  <Link
                    key={c.slug}
                    href={`/online-fitness-coach/${c.slug}`}
                    className="flex items-center justify-between p-4 rounded-xl border border-white/[0.06] bg-white/[0.02] hover:bg-white/[0.04] hover:border-white/[0.12] transition-all"
                  >
                    <span>
                      <span className="block text-white font-medium">Fitness Coach in {c.name}</span>
                      <span className="block text-xs text-gray-500 mt-0.5">from ≈ {c.approxStart}/month</span>
                    </span>
                    <span className="text-brand-blue">→</span>
                  </Link>
                ))}
              </div>
            </div>
          ))}
          <p className="text-gray-400 text-sm text-center">
            Not listed? Coaching works the same way in any country.{' '}
            <a href="#enquiry" className="text-brand-blue hover:text-brand-gold underline">Send an enquiry</a>. Based in India?{' '}
            <Link href="/fitness-coach" className="text-brand-blue hover:text-brand-gold transition-colors underline">
              See city pages →
            </Link>
          </p>
        </div>
      </section>

      {/* How it works */}
      <section className="py-12 md:py-16 border-y border-white/[0.06]" style={{ background: 'linear-gradient(180deg, rgba(23,95,255,0.04) 0%, rgba(10,15,31,1) 100%)' }}>
        <div className="max-w-5xl mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-white text-center mb-10">How online coaching works from abroad</h2>
          <ol className="grid md:grid-cols-4 gap-5">
            {STEPS.map((s, i) => (
              <li key={s.title} className="rounded-2xl border border-white/10 bg-brand-navy-light p-5">
                <div className="text-brand-gold font-extrabold text-2xl">{i + 1}</div>
                <h3 className="mt-2 text-lg font-semibold text-white">{s.title}</h3>
                <p className="mt-2 text-sm text-gray-400 leading-relaxed">{s.text}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* FAQ — mirrors FAQPage schema exactly */}
      <section className="py-12 md:py-16">
        <div className="max-w-3xl mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-white text-center mb-8">Questions NRIs ask before starting</h2>
          <div className="space-y-3">
            {NRI_FAQS.map((f) => (
              <details key={f.question} className="group rounded-xl border border-white/10 bg-brand-navy-light p-4" open>
                <summary className="cursor-pointer list-none font-semibold text-white marker:hidden flex items-center justify-between gap-4">
                  <h3 className="text-base">{f.question}</h3>
                  <span className="text-brand-blue transition-transform group-open:rotate-45">+</span>
                </summary>
                <p className="mt-3 text-sm leading-relaxed text-gray-300">{f.answer}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* Enquiry */}
      <section id="enquiry" className="py-12 md:py-20 border-t border-white/[0.06]" style={{ background: 'linear-gradient(180deg, rgba(23,95,255,0.06) 0%, rgba(10,15,31,1) 100%)' }}>
        <div className="max-w-3xl mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Start from wherever you are</h2>
          <p className="text-gray-300 text-lg mb-8 leading-relaxed">
            Leave your details and Coach Himanshu will reply within 24 hours with the right plan for your goal, budget and time zone.
          </p>
          <ConsultationForm source="Online fitness coach — worldwide hub" dialCode="+" placeName="your country" whatsappHref={WHATSAPP_NRI} />
          <p className="text-gray-400 text-base mt-8">
            Prefer to start on your own?{' '}
            <Link href="/assessment" className="text-brand-gold hover:text-white font-semibold underline underline-offset-4 transition-colors">
              Take the free fitness assessment →
            </Link>
          </p>
        </div>
      </section>

      <Footer />
    </div>
  );
}
