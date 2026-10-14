import type { Metadata } from 'next';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import AnnouncementBar from '@/components/AnnouncementBar';
import ConsultationForm from '@/components/ConsultationForm';
import {
  BUDGET_PICKS,
  COACHING_ROWS,
  COST_FAQS,
  COST_GUIDE_URL,
  COUPLE_ROWS,
  IN_PERSON_METRO_RANGE,
  LIVE_ROWS,
  PRICES_UPDATED,
  PRICES_UPDATED_LABEL,
  SUMMARY,
  inr,
} from '@/lib/pricingGuide';

const WHATSAPP_CONSULT =
  'https://wa.me/917303484648?text=Hi%20Coach%20Himanshu!%20I%20read%20your%20pricing%20guide%20and%20want%20a%20free%20consultation.';

const title = 'Personal Trainer Cost in India (2026): Fees Compared';
const description = `Personal trainer cost in India, 2026: in-person ${IN_PERSON_METRO_RANGE}/month vs online coaching from ${inr(
  SUMMARY.coachingFrom,
)} and live 1:1 from ${inr(SUMMARY.sessionLow)}/session, every plan priced.`;

export const metadata: Metadata = {
  title,
  description,
  keywords: [
    'personal trainer cost in india',
    'personal trainer fees india',
    'online personal trainer price',
    'online fitness coach cost india',
    'online personal training cost per session',
    'fitness coaching price india',
    'online fitness coaching fees',
  ],
  openGraph: { title: `${title} | Coach Himanshu`, description, url: COST_GUIDE_URL, type: 'article', images: ['/opengraph-image'] },
  twitter: { card: 'summary_large_image', title: `${title} | Coach Himanshu`, description },
  alternates: { canonical: COST_GUIDE_URL },
};

const th = 'py-3 px-4 text-left text-xs font-semibold uppercase tracking-wide text-gray-400';
const td = 'py-3 px-4 text-sm text-gray-200';

export default function PersonalTrainerCostPage() {
  const articleSchema = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    '@id': `${COST_GUIDE_URL}#article`,
    headline: title,
    description,
    url: COST_GUIDE_URL,
    inLanguage: 'en',
    datePublished: PRICES_UPDATED,
    dateModified: PRICES_UPDATED,
    isPartOf: { '@id': 'https://coachhimanshu.com/#website' },
    author: { '@type': 'Person', '@id': 'https://coachhimanshu.com/#coach', name: 'Coach Himanshu' },
    publisher: { '@id': 'https://coachhimanshu.com/#organization' },
    about: { '@type': 'Thing', name: 'Personal trainer cost in India' },
    speakable: { '@type': 'SpeakableSpecification', cssSelector: ['#cost-answer'] },
    mentions: [...COACHING_ROWS, ...LIVE_ROWS].map((r) => ({
      '@type': 'Offer',
      name: r.name,
      price: String(r.price),
      priceCurrency: 'INR',
      url: r.sessions ? 'https://coachhimanshu.com/online-personal-trainer' : 'https://coachhimanshu.com/plans',
    })),
  };

  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: COST_FAQS.map((f) => ({
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
      { '@type': 'ListItem', position: 2, name: 'Plans & Pricing', item: 'https://coachhimanshu.com/plans' },
      { '@type': 'ListItem', position: 3, name: 'Personal Trainer Cost in India', item: COST_GUIDE_URL },
    ],
  };

  return (
    <div className="min-h-screen bg-brand-navy">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <AnnouncementBar />
      <Navbar />

      {/* Answer first */}
      <section className="relative pt-28 pb-8 md:pt-36 md:pb-10">
        <div className="max-w-4xl mx-auto px-4">
          <nav className="mb-4 text-xs text-gray-500" aria-label="Breadcrumb">
            <Link href="/" className="hover:text-gray-300">Home</Link>
            <span className="mx-1.5">/</span>
            <Link href="/plans" className="hover:text-gray-300">Plans &amp; Pricing</Link>
            <span className="mx-1.5">/</span>
            <span className="text-gray-400">Personal Trainer Cost</span>
          </nav>
          <h1 className="text-3xl md:text-5xl font-extrabold leading-tight text-white">
            How Much Does a{' '}
            <span className="bg-gradient-to-r from-brand-blue to-brand-gold bg-clip-text text-transparent">
              Personal Trainer Cost
            </span>{' '}
            in India?
          </h1>
          <p className="mt-3 text-sm text-gray-500">
            Prices current from <time dateTime={PRICES_UPDATED}>{PRICES_UPDATED_LABEL}</time> · By Coach Himanshu, NASM
            certified
          </p>
          <div id="cost-answer" className="mt-6 rounded-2xl border border-brand-gold/25 bg-brand-navy-light p-5 md:p-6">
            <p className="text-gray-200 md:text-lg leading-relaxed">
              An in-person personal trainer in Indian metros typically costs{' '}
              <strong className="text-white">{IN_PERSON_METRO_RANGE} a month</strong>. Online coaching costs much less.
              Personalised online coaching (custom workout and Indian diet plan, one-on-one consultations, WhatsApp
              support) costs <strong className="text-white">{inr(SUMMARY.coachingFrom)}–{inr(SUMMARY.coachingTo)}</strong>,
              about {inr(SUMMARY.coachingMonthLow)}–{inr(SUMMARY.coachingMonthHigh)} a month. Live 1-on-1 online personal
              training costs <strong className="text-white">{inr(SUMMARY.liveFrom)}–{inr(SUMMARY.liveTo)}</strong>, which is{' '}
              {inr(SUMMARY.sessionLow)}–{inr(SUMMARY.sessionHigh)} per 60-minute session.
            </p>
          </div>

          <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-3">
            {[
              { value: IN_PERSON_METRO_RANGE, label: 'In-person trainer, per month (metros)' },
              { value: `${inr(SUMMARY.coachingMonthLow)}–${inr(SUMMARY.coachingMonthHigh)}`, label: 'Online coaching, per month' },
              { value: `${inr(SUMMARY.sessionLow)}–${inr(SUMMARY.sessionHigh)}`, label: 'Live online 1:1, per session' },
            ].map((s) => (
              <div key={s.label} className="rounded-xl border border-white/10 bg-brand-navy-light p-4 text-center">
                <div className="text-xl md:text-2xl font-bold text-brand-gold">{s.value}</div>
                <div className="mt-1 text-xs text-gray-400">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Three ways to pay for a trainer */}
      <section className="pb-12">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-2xl md:text-3xl font-bold text-white">Three ways to work with a trainer, and what each costs</h2>
          <div className="mt-5 overflow-x-auto rounded-xl border border-white/10">
            <table className="w-full min-w-[640px]">
              <thead className="bg-white/[0.03]">
                <tr>
                  <th className={th}></th>
                  <th className={th}>In-person trainer</th>
                  <th className={th}>Personalised online coaching</th>
                  <th className={th}>Live online 1:1</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.05]">
                <tr>
                  <td className={`${td} font-medium text-white`}>Typical cost</td>
                  <td className={td}>{IN_PERSON_METRO_RANGE} / month in metros</td>
                  <td className={td}>{inr(SUMMARY.coachingMonthLow)}–{inr(SUMMARY.coachingMonthHigh)} / month</td>
                  <td className={td}>{inr(SUMMARY.sessionLow)}–{inr(SUMMARY.sessionHigh)} / session</td>
                </tr>
                <tr>
                  <td className={`${td} font-medium text-white`}>Trainer watches you train</td>
                  <td className={td}>Yes, at the gym</td>
                  <td className={td}>No, you follow video tutorials</td>
                  <td className={td}>Yes, live on video</td>
                </tr>
                <tr>
                  <td className={`${td} font-medium text-white`}>Diet plan</td>
                  <td className={td}>Often extra or generic</td>
                  <td className={td}>Personalised Indian diet included</td>
                  <td className={td}>Personalised Indian diet included</td>
                </tr>
                <tr>
                  <td className={`${td} font-medium text-white`}>Where you train</td>
                  <td className={td}>That one gym</td>
                  <td className={td}>Anywhere</td>
                  <td className={td}>Anywhere, scheduled in your time zone</td>
                </tr>
                <tr>
                  <td className={`${td} font-medium text-white`}>Support between sessions</td>
                  <td className={td}>Varies</td>
                  <td className={td}>WhatsApp + in-app chat</td>
                  <td className={td}>WhatsApp + in-app chat</td>
                </tr>
                <tr>
                  <td className={`${td} font-medium text-white`}>Best for</td>
                  <td className={td}>Bigger budgets near a good gym</td>
                  <td className={td}>Self-driven people who want a plan and a coach to answer to</td>
                  <td className={td}>Beginners, form problems, and anyone who needs accountability</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Personalised coaching prices */}
      <section className="pb-12">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-2xl md:text-3xl font-bold text-white">Online coaching prices, per month</h2>
          <p className="mt-2 text-gray-400">
            A custom workout and diet plan, video tutorials, one-on-one consultations and WhatsApp support. The longer the
            plan, the less it costs per month.
          </p>
          <div className="mt-5 overflow-x-auto rounded-xl border border-white/10">
            <table className="w-full min-w-[480px]">
              <thead className="bg-white/[0.03]">
                <tr>
                  <th className={th}>Plan</th>
                  <th className={th}>Length</th>
                  <th className={th}>Price</th>
                  <th className={th}>Per month</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.05]">
                {COACHING_ROWS.map((r) => (
                  <tr key={r.name}>
                    <td className={`${td} font-medium text-white`}>{r.name}</td>
                    <td className={td}>{r.durationLabel}</td>
                    <td className={`${td} font-semibold text-brand-gold`}>{inr(r.price)}</td>
                    <td className={td}>{inr(r.perMonth)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Live 1:1 prices */}
      <section className="pb-12">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-2xl md:text-3xl font-bold text-white">Live 1:1 online personal training, per session</h2>
          <p className="mt-2 text-gray-400">
            60-minute live video sessions where the coach watches and corrects every rep. Each package includes a
            personalised Indian diet plan, the full video library and WhatsApp support. Sessions are used within the
            package length.
          </p>
          <div className="mt-5 overflow-x-auto rounded-xl border border-white/10">
            <table className="w-full min-w-[560px]">
              <thead className="bg-white/[0.03]">
                <tr>
                  <th className={th}>Sessions</th>
                  <th className={th}>Valid for</th>
                  <th className={th}>Price</th>
                  <th className={th}>Per session</th>
                  <th className={th}>Pace</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.05]">
                {LIVE_ROWS.map((r) => (
                  <tr key={r.name}>
                    <td className={`${td} font-medium text-white`}>{r.sessions} sessions</td>
                    <td className={td}>{r.durationLabel}</td>
                    <td className={`${td} font-semibold text-brand-gold`}>{inr(r.price)}</td>
                    <td className={td}>{inr(r.perSession ?? 0)}</td>
                    <td className={td}>~{r.sessionsPerWeek} a week</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="mt-3 text-sm text-gray-400">
            Compare: {IN_PERSON_METRO_RANGE} a month is what in-person training typically costs in metros.{' '}
            <Link href="/online-personal-trainer" className="text-brand-blue hover:underline">
              See how live 1:1 online training works →
            </Link>
          </p>
        </div>
      </section>

      {/* Couples */}
      <section className="pb-12">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-2xl md:text-3xl font-bold text-white">
            Training as a couple: {SUMMARY.coupleSaveLow}–{SUMMARY.coupleSaveHigh}% less than two plans
          </h2>
          <p className="mt-2 text-gray-400">
            Each partner gets their own plan. On live 1:1 couple packages you both train together in one shared session slot.
          </p>
          <div className="mt-5 overflow-x-auto rounded-xl border border-white/10">
            <table className="w-full min-w-[560px]">
              <thead className="bg-white/[0.03]">
                <tr>
                  <th className={th}>Couple plan</th>
                  <th className={th}>Length</th>
                  <th className={th}>Price for 2</th>
                  <th className={th}>Two separate plans</th>
                  <th className={th}>You save</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.05]">
                {COUPLE_ROWS.map((r) => (
                  <tr key={r.name}>
                    <td className={`${td} font-medium text-white`}>{r.name}</td>
                    <td className={td}>{r.durationLabel}</td>
                    <td className={`${td} font-semibold text-brand-gold`}>{inr(r.price)}</td>
                    <td className={`${td} text-gray-400 line-through decoration-gray-600`}>{inr(r.twoSingles)}</td>
                    <td className={td}>{r.savePct}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="mt-3 text-sm text-gray-400">
            <Link href="/fitness-coaching-for/family" className="text-brand-blue hover:underline">
              More on couple and family coaching →
            </Link>
          </p>
        </div>
      </section>

      {/* Budget picks */}
      <section className="pb-12">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-2xl md:text-3xl font-bold text-white">Which plan fits your budget</h2>
          <div className="mt-5 grid gap-3 sm:grid-cols-2">
            {BUDGET_PICKS.map((b) => (
              <Link
                key={b.budget}
                href={b.href}
                className="rounded-xl border border-white/10 bg-brand-navy-light p-5 hover:border-brand-blue/50 transition-colors"
              >
                <div className="text-xs font-semibold uppercase tracking-wide text-brand-gold">{b.budget}</div>
                <h3 className="mt-1.5 text-lg font-semibold text-white">{b.pick}</h3>
                <p className="mt-1.5 text-sm text-gray-400">{b.why}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Before you pay */}
      <section className="pb-12">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-2xl md:text-3xl font-bold text-white">What to check before you pay any trainer</h2>
          <ul className="mt-4 space-y-3 text-gray-300">
            <li>
              <strong className="text-white">Certification.</strong> Ask which body certified them. Coach Himanshu is NASM
              certified with 1000+ client transformations.{' '}
              <Link href="/about" className="text-brand-blue hover:underline">About the coach</Link>
            </li>
            <li>
              <strong className="text-white">Is the diet plan included?</strong> Many trainers charge separately for
              nutrition or hand out a generic chart. Here a personalised Indian diet plan comes with every plan except the
              rehabilitation plans.
            </li>
            <li>
              <strong className="text-white">Session length and validity.</strong> Check how long each session is and how
              long you have to use them. Live 1:1 sessions here are 60 minutes and valid for 1 or 3 months depending on the
              package.
            </li>
            <li>
              <strong className="text-white">Refunds.</strong> All plans here are non-refundable once bought, so take the
              free consultation first and ask everything.{' '}
              <Link href="/refund-policy" className="text-brand-blue hover:underline">Refund policy</Link>
            </li>
            <li>
              <strong className="text-white">Try before you commit.</strong> Use the free{' '}
              <Link href="/assessment" className="text-brand-blue hover:underline">fitness assessment</Link> and{' '}
              <Link href="/tools" className="text-brand-blue hover:underline">fitness calculators</Link> to see where you
              stand before you spend anything.
            </li>
          </ul>
        </div>
      </section>

      {/* FAQ */}
      <section className="pb-12">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-2xl md:text-3xl font-bold text-white">Personal trainer cost: common questions</h2>
          <div className="mt-5 space-y-3">
            {COST_FAQS.map((f) => (
              <details key={f.question} className="group rounded-xl border border-white/10 bg-brand-navy-light p-5">
                <summary className="cursor-pointer list-none font-semibold text-white">
                  {f.question}
                </summary>
                <p className="mt-3 text-sm leading-relaxed text-gray-300">{f.answer}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* Convert */}
      <section className="pb-16">
        <div className="max-w-3xl mx-auto px-4">
          <div className="rounded-2xl border border-brand-blue/20 bg-gradient-to-r from-brand-blue/10 to-brand-navy-light p-6 text-center">
            <h2 className="text-xl md:text-2xl font-bold text-white">Not sure which plan is worth it for you?</h2>
            <p className="mx-auto mt-2 max-w-xl text-sm text-gray-300">
              Tell Coach Himanshu your goal and budget in a free consultation and get an honest recommendation, even if
              that is the cheapest plan.
            </p>
            <div className="mt-5 flex flex-wrap justify-center gap-3">
              <a
                href={WHATSAPP_CONSULT}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-xl bg-gradient-to-r from-brand-blue to-blue-500 px-6 py-3 font-semibold text-white shadow-lg shadow-brand-blue/25 hover:-translate-y-0.5 transition-transform"
              >
                Free consultation on WhatsApp
              </a>
              <Link href="/plans" className="rounded-xl border border-white/15 px-6 py-3 font-semibold text-white hover:bg-white/5 transition-colors">
                See all plans
              </Link>
            </div>
          </div>
          <div className="mt-8">
            <ConsultationForm source="Personal trainer cost guide" whatsappHref={WHATSAPP_CONSULT} />
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
