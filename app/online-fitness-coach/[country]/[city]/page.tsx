import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getCountryBySlug, approxStart, FX_AS_OF } from '@/lib/countries';
import {
  GLOBAL_CITIES,
  getGlobalCity,
  citiesInCountry,
  globalCityUrl,
  plainName,
  timeGap,
  slotTable,
  localPlanRows,
  lowestPerSession,
} from '@/lib/globalCities';
import { getEliteOfferRange } from '@/lib/personalTraining';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import AnnouncementBar from '@/components/AnnouncementBar';
import ConsultationForm from '@/components/ConsultationForm';

interface Props {
  params: { country: string; city: string };
}

export function generateStaticParams() {
  return GLOBAL_CITIES.map((city) => ({ country: city.country, city: city.slug }));
}

function load(params: Props['params']) {
  const city = getGlobalCity(params.country, params.city);
  const country = getCountryBySlug(params.country);
  if (!city || !country) return null;
  return { city, country, place: plainName(city) };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const data = load(params);
  if (!data) return { title: 'City Not Found' };
  const { city, country, place } = data;

  const pageTitle = `Online Indian Fitness Coach in ${place}`; // root template appends "| Coach Himanshu"
  const title = `${pageTitle} | Coach Himanshu`;
  const description = `NASM-certified Indian fitness coach for ${place}: live 1-on-1 video training from about ${lowestPerSession(country)} a session, Indian meal plans from local groceries, sessions in your time zone. From ≈ ${approxStart(country)}/month.`;
  const url = globalCityUrl(city);

  return {
    title: pageTitle,
    description,
    keywords: [
      `indian fitness coach ${place}`,
      `online personal trainer ${place}`,
      `indian personal trainer ${place}`,
      `indian diet plan ${place}`,
      `nri fitness coach ${place}`,
      `online fitness coach ${country.country}`,
    ],
    // og:image comes from the opengraph-image.tsx file convention in this segment.
    openGraph: { title, description, url, type: 'website' },
    twitter: { card: 'summary_large_image', title, description },
    alternates: { canonical: url },
  };
}

export default function GlobalCityPage({ params }: Props) {
  const data = load(params);
  if (!data) notFound();
  const { city, country, place } = data;

  const url = globalCityUrl(city);
  const gap = timeGap(city);
  const slots = slotTable(city);
  const rows = localPlanRows(country);
  const perSession = lowestPerSession(country);
  const start = approxStart(country);
  const elite = getEliteOfferRange();
  const siblings = citiesInCountry(country.slug).filter((c) => c.slug !== city.slug);
  const areasText = city.areas.length
    ? `${city.areas.slice(0, -1).join(', ')}${city.areas.length > 1 ? ' and ' : ''}${city.areas[city.areas.length - 1]}`
    : '';

  const lede = `Yes. Coach Himanshu, a NASM-certified Indian fitness coach, trains clients in ${city.name} entirely online: live 1-on-1 video sessions from about ${perSession} a session, or a personalised workout and Indian meal plan with weekly video check-ins from about ${start} a month. ${gap.sentence} Sessions are booked in your local time.`;

  const faqs = [
    {
      question: `How much does an online personal trainer cost in ${place}?`,
      answer: `With Coach Himanshu, live 1-on-1 video training costs from ${rows.find((r) => r.perSession)?.inr} for 12 sessions (about ${rows.find((r) => r.perSession)?.local}) down to about ${perSession} a session on the 72-session package. Recorded coaching, with a personalised workout and Indian diet plan plus weekly one-on-one video check-ins, starts at ₹1,499 a month (about ${start}). Prices are charged in Indian rupees by international card; local amounts are approximate at ${FX_AS_OF} rates.`,
    },
    {
      question: `What is the time difference between ${place} and India for live sessions?`,
      answer: `${gap.sentence} You choose your slots in local time: for example, ${slots[1].local} in ${place} is ${slots[1].ist} in India${slots[1].istSummer ? ` (${slots[1].istSummer} during daylight saving)` : ''}, and ${slots[4].local} is ${slots[4].ist}${slots[4].istSummer ? ` (${slots[4].istSummer} during daylight saving)` : ''}.`,
    },
    {
      question: `Will my Indian diet plan work with food I can buy in ${place}?`,
      answer: `Yes. Plans are built around dal, roti, rice, sabzi, paneer, curd, eggs, chicken and fish, with portions set for your goal and swaps for what your local supermarket stocks${areasText ? `, as well as the Indian grocers in areas like ${areasText}` : ''}. Vegetarian, eggetarian, non-vegetarian and vegan versions are available, with eating-out guidance for ${place}.`,
    },
    {
      question: 'Can I train at home or in my building gym?',
      answer: 'Yes. Your coach writes the plan for whatever you have: a full gym, a small apartment or building gym, a pair of dumbbells or just bodyweight. In live sessions the coach watches every rep on video and corrects your form in real time.',
    },
    {
      question: `Is online coaching as good as an in-person trainer in ${place}?`,
      answer: `For fat loss, muscle gain and general fitness, online coaching works as well for most people and usually costs a fraction of in-person training in ${place}. You get a personalised plan, live form correction in 1-on-1 sessions, weekly plan changes and daily WhatsApp accountability, and you keep the same coach if you travel or move.`,
    },
  ];

  const schema = [
    {
      '@context': 'https://schema.org',
      '@type': 'Service',
      name: `Online Indian Fitness Coach in ${place}`,
      serviceType: 'Online Personal Training',
      url,
      description: `Online fitness coaching and live 1-on-1 video personal training for Indians and NRIs in ${place}, ${country.country}, with Indian meal plans and sessions in the local time zone.`,
      areaServed: {
        '@type': 'City',
        name: place,
        containedInPlace: { '@type': 'Country', name: country.country },
      },
      provider: {
        '@type': 'Person',
        '@id': 'https://coachhimanshu.com/#coach',
        name: 'Coach Himanshu',
        url: 'https://coachhimanshu.com/about',
      },
      availableLanguage: ['English', 'Hindi'],
      offers: {
        '@type': 'AggregateOffer',
        priceCurrency: 'INR',
        lowPrice: elite.low,
        highPrice: elite.high,
        offerCount: elite.count,
        url: 'https://coachhimanshu.com/online-personal-trainer',
      },
    },
    {
      '@context': 'https://schema.org',
      '@type': 'WebPage',
      name: `Online Indian Fitness Coach in ${place}`,
      url,
      author: { '@id': 'https://coachhimanshu.com/#coach' },
      speakable: { '@type': 'SpeakableSpecification', cssSelector: ['#city-answer'] },
    },
    {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: faqs.map((f) => ({
        '@type': 'Question',
        name: f.question,
        acceptedAnswer: { '@type': 'Answer', text: f.answer },
      })),
    },
    {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://coachhimanshu.com' },
        { '@type': 'ListItem', position: 2, name: 'Online Fitness Coach', item: 'https://coachhimanshu.com/online-fitness-coach' },
        { '@type': 'ListItem', position: 3, name: country.country, item: `https://coachhimanshu.com/online-fitness-coach/${country.slug}` },
        { '@type': 'ListItem', position: 4, name: place, item: url },
      ],
    },
  ];

  const whatsappHref = `https://wa.me/917303484648?text=${encodeURIComponent(`Hi Coach Himanshu! I'm in ${place} and want a free consultation for online coaching.`)}`;

  return (
    <div className="min-h-screen bg-brand-navy">
      {schema.map((s, i) => (
        <script key={i} type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(s) }} />
      ))}
      <AnnouncementBar />
      <Navbar />

      {/* Hero */}
      <section className="relative pt-28 pb-14 md:pt-36 md:pb-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-brand-blue/10 via-transparent to-transparent" />
        <div className="max-w-4xl mx-auto px-4 text-center relative z-10">
          <nav className="flex flex-wrap justify-center items-center gap-2 text-sm text-gray-400 mb-8">
            <Link href="/" className="hover:text-brand-blue transition-colors">Home</Link>
            <span>/</span>
            <Link href="/online-fitness-coach" className="hover:text-brand-blue transition-colors">Online Fitness Coach</Link>
            <span>/</span>
            <Link href={`/online-fitness-coach/${country.slug}`} className="hover:text-brand-blue transition-colors">{country.country}</Link>
            <span>/</span>
            <span className="text-brand-gold">{place}</span>
          </nav>

          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
            Online Indian Fitness Coach in{' '}
            <span className="bg-gradient-to-r from-brand-blue to-brand-gold bg-clip-text text-transparent">{place}</span>
          </h1>

          <p id="city-answer" className="text-lg md:text-xl text-gray-300 max-w-3xl mx-auto mb-8 leading-relaxed">
            {lede}
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-6">
            <a
              href="#enquiry"
              className="inline-flex items-center justify-center px-8 py-4 bg-brand-blue hover:bg-brand-blue-dark text-white font-semibold rounded-xl transition-all duration-300 text-lg shadow-lg shadow-brand-blue/25"
            >
              Get a Free Consultation
            </a>
            <a
              href={whatsappHref}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center px-8 py-4 border border-white/20 hover:border-brand-gold text-white font-semibold rounded-xl transition-all duration-300 text-lg hover:bg-white/5"
            >
              Chat on WhatsApp
            </a>
          </div>
          <p className="text-sm text-gray-500">
            Live 1:1 from ≈ {perSession}/session · Coaching from ≈ {start}/month · International cards accepted
          </p>
        </div>
      </section>

      {/* Local angle */}
      <section className="py-14 md:py-20 border-y border-white/[0.06]" style={{ background: 'linear-gradient(180deg, rgba(201,166,70,0.03) 0%, rgb(var(--c-navy) / 1) 100%)' }}>
        <div className="max-w-5xl mx-auto px-4 grid md:grid-cols-2 gap-10">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">Built for Indian life in {place}</h2>
            <p className="text-gray-300 leading-relaxed mb-4">{city.angle}</p>
            <p className="text-gray-400 leading-relaxed">
              Your plan keeps the food you grew up with (dal, roti, rice, sabzi, paneer, eggs, chicken, fish) and sets the
              portions for your goal, using what your local supermarket and Indian grocer actually stock.
            </p>
          </div>
          <div>
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">What you get</h2>
            <ul className="space-y-3 text-gray-300">
              {[
                'A personalised workout plan for home, a building gym or a full gym',
                'A personalised Indian meal plan (veg, egg, non-veg or vegan)',
                'Live 1-on-1 video sessions with real-time form correction (Elite plans)',
                'Weekly plan changes based on your progress',
                'WhatsApp and in-app chat support',
              ].map((item) => (
                <li key={item} className="flex gap-2">
                  <span className="text-brand-blue flex-shrink-0">&#10003;</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
            {areasText && (
              <p className="text-sm text-gray-500 mt-5">Available across {place}, including {areasText}.</p>
            )}
          </div>
        </div>
      </section>

      {/* Time zone */}
      <section className="py-14 md:py-20">
        <div className="max-w-3xl mx-auto px-4">
          <h2 className="text-2xl md:text-3xl font-bold text-white text-center mb-3">Live sessions on {place} time</h2>
          <p className="text-gray-400 text-center mb-8">{gap.sentence} You book slots in your local time; here is what common training times are in India.</p>
          <div className="overflow-x-auto rounded-2xl border border-white/[0.08]">
            <table className="w-full text-sm">
              <thead className="bg-white/[0.03] text-gray-400">
                <tr>
                  <th className="text-left px-4 py-3 font-medium">Your time in {place}</th>
                  <th className="text-left px-4 py-3 font-medium">{gap.summer !== null ? 'India time (winter)' : 'India time (IST)'}</th>
                  {gap.summer !== null && <th className="text-left px-4 py-3 font-medium">India time (daylight saving)</th>}
                </tr>
              </thead>
              <tbody>
                {slots.map((s) => (
                  <tr key={s.local} className="border-t border-white/[0.06] text-gray-200">
                    <td className="px-4 py-3 font-medium">{s.local}</td>
                    <td className="px-4 py-3">{s.ist}</td>
                    {gap.summer !== null && <td className="px-4 py-3">{s.istSummer}</td>}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Prices */}
      <section className="py-14 md:py-20 border-y border-white/[0.06]" style={{ background: 'linear-gradient(180deg, rgba(23,95,255,0.03) 0%, rgb(var(--c-navy) / 1) 100%)' }}>
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-2xl md:text-3xl font-bold text-white text-center mb-3">Prices in {country.currencyCode}</h2>
          <p className="text-gray-400 text-center mb-8">
            Charged in Indian rupees by international card. Local amounts are approximate at {FX_AS_OF} rates; your bank
            converts at its own rate.
          </p>
          <div className="overflow-x-auto rounded-2xl border border-white/[0.08]">
            <table className="w-full text-sm">
              <thead className="bg-white/[0.03] text-gray-400">
                <tr>
                  <th className="text-left px-4 py-3 font-medium">Plan</th>
                  <th className="text-left px-4 py-3 font-medium">Duration</th>
                  <th className="text-right px-4 py-3 font-medium">Price</th>
                  <th className="text-right px-4 py-3 font-medium">≈ {country.currencyCode}</th>
                  <th className="text-right px-4 py-3 font-medium">Per live session</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((r) => (
                  <tr key={r.name} className="border-t border-white/[0.06] text-gray-200">
                    <td className="px-4 py-3 font-medium whitespace-nowrap">{r.name}</td>
                    <td className="px-4 py-3 whitespace-nowrap">{r.durationLabel}</td>
                    <td className="px-4 py-3 text-right whitespace-nowrap">{r.inr}</td>
                    <td className="px-4 py-3 text-right whitespace-nowrap text-brand-gold">{r.local}</td>
                    <td className="px-4 py-3 text-right whitespace-nowrap">{r.perSession ?? '—'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="text-center text-sm text-gray-500 mt-6">
            Couple and rehabilitation plans are on the{' '}
            <Link href="/plans" className="text-brand-blue hover:text-brand-gold underline">plans page</Link>. Live 1:1 details:{' '}
            <Link href="/online-personal-trainer" className="text-brand-blue hover:text-brand-gold underline">online personal training</Link>.
          </p>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-14 md:py-20">
        <div className="max-w-3xl mx-auto px-4">
          <h2 className="text-2xl md:text-3xl font-bold text-white text-center mb-10">Questions from {place}</h2>
          <div className="space-y-4">
            {faqs.map((f) => (
              <div key={f.question} className="p-6 rounded-2xl border border-white/[0.06] bg-white/[0.02]">
                <h3 className="text-lg font-semibold text-white mb-3">{f.question}</h3>
                <p className="text-gray-400 text-sm leading-relaxed">{f.answer}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Enquiry */}
      <section id="enquiry" className="py-14 md:py-20 border-t border-white/[0.06]" style={{ background: 'linear-gradient(180deg, rgba(23,95,255,0.06) 0%, rgb(var(--c-navy) / 1) 100%)' }}>
        <div className="max-w-3xl mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Free consultation from {place}</h2>
          <p className="text-gray-300 mb-8">Tell us your goal and the times that suit you. No payment needed.</p>
          <ConsultationForm source={`Online fitness coach — ${place}, ${country.country}`} dialCode={country.dialCode} placeName={city.name} whatsappHref={whatsappHref} />

          <div className="mt-12 text-left">
            {siblings.length > 0 && (
              <>
                <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-3">Other cities in {country.country}</h3>
                <div className="flex flex-wrap gap-3 mb-8">
                  {siblings.map((s) => (
                    <Link key={s.slug} href={`/online-fitness-coach/${country.slug}/${s.slug}`} className="px-4 py-2 rounded-full border border-white/10 text-sm text-gray-300 hover:border-brand-gold hover:text-white transition-colors">
                      {plainName(s)}
                    </Link>
                  ))}
                </div>
              </>
            )}
            <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-3">Keep reading</h3>
            <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm">
              <Link href={`/online-fitness-coach/${country.slug}`} className="text-brand-blue hover:text-brand-gold">Coaching in {country.name}</Link>
              <Link href="/online-personal-trainer" className="text-brand-blue hover:text-brand-gold">Live 1:1 personal training</Link>
              <Link href="/wedding-fitness-plan" className="text-brand-blue hover:text-brand-gold">Flying home for a wedding?</Link>
              <Link href="/diet-plans" className="text-brand-blue hover:text-brand-gold">Indian diet plans by calorie</Link>
              <Link href="/online-fitness-coach" className="text-brand-blue hover:text-brand-gold">All countries</Link>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
