import type { Metadata } from 'next';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import AnnouncementBar from '@/components/AnnouncementBar';
import ConsultationForm from '@/components/ConsultationForm';
import WeddingCountdown from '@/components/WeddingCountdown';
import { CountdownTable, FlyingHomeSection, WeddingFaqList } from '@/components/WeddingFitnessSections';
import { WEDDING_AUDIENCES, WEDDING_HUB_FAQS, WEDDING_HUB_URL, weddingTimeline } from '@/lib/weddingFitness';

const WHATSAPP_WEDDING =
  'https://wa.me/917303484648?text=Hi%20Coach%20Himanshu!%20I%20want%20a%20wedding%20fitness%20plan.%20My%20wedding%20is%20on%20';

const t12 = weddingTimeline(12);
const title = 'Wedding Fitness Plan: Week-by-Week Countdown';
const description = `A wedding fitness plan built backwards from your date, with an Indian diet. Realistic loss: ${t12.lowKg}–${t12.highKg} kg in 12 weeks. For brides, grooms and couples, worldwide.`;

export const metadata: Metadata = {
  title,
  description,
  keywords: [
    'wedding fitness plan',
    'pre wedding weight loss plan',
    'how much weight can i lose before my wedding',
    'wedding workout plan',
    'wedding diet plan indian',
    'pre wedding fitness program online',
    'nri wedding fitness',
  ],
  openGraph: { title: `${title} | Coach Himanshu`, description, url: WEDDING_HUB_URL, type: 'article', images: ['/opengraph-image'] },
  twitter: { card: 'summary_large_image', title: `${title} | Coach Himanshu`, description },
  alternates: { canonical: WEDDING_HUB_URL },
};

export default function WeddingFitnessPlanPage() {
  const t16 = weddingTimeline(16);

  const serviceSchema = {
    '@context': 'https://schema.org',
    '@type': 'Service',
    '@id': `${WEDDING_HUB_URL}#service`,
    name: 'Online Wedding Fitness Coaching',
    description,
    url: WEDDING_HUB_URL,
    serviceType: 'Online Fitness Coaching',
    provider: { '@type': 'Person', '@id': 'https://coachhimanshu.com/#coach', name: 'Coach Himanshu' },
    areaServed: { '@type': 'Place', name: 'Worldwide' },
    audience: WEDDING_AUDIENCES.map((a) => ({ '@type': 'Audience', audienceType: a.name })),
    availableChannel: { '@type': 'ServiceChannel', serviceUrl: WEDDING_HUB_URL, availableLanguage: ['English', 'Hindi'] },
  };

  const howToSchema = {
    '@context': 'https://schema.org',
    '@type': 'HowTo',
    name: 'How to get in shape for your wedding in 16 weeks',
    description: `A 16-week wedding countdown: about ${t16.lowKg}–${t16.highKg} kg of fat loss, with the final 2 weeks at maintenance.`,
    totalTime: 'P16W',
    step: t16.phases.map((p, i) => ({ '@type': 'HowToStep', position: i + 1, name: `${p.name} (${p.weeks})`, text: p.text })),
  };

  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: WEDDING_HUB_FAQS.map((f) => ({
      '@type': 'Question',
      name: f.question,
      acceptedAnswer: { '@type': 'Answer', text: f.answer },
    })),
  };

  const pageSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    '@id': `${WEDDING_HUB_URL}#webpage`,
    url: WEDDING_HUB_URL,
    name: title,
    description,
    isPartOf: { '@id': 'https://coachhimanshu.com/#website' },
    author: { '@id': 'https://coachhimanshu.com/#coach' },
    speakable: { '@type': 'SpeakableSpecification', cssSelector: ['#wedding-answer'] },
  };

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://coachhimanshu.com' },
      { '@type': 'ListItem', position: 2, name: 'Wedding Fitness Plan', item: WEDDING_HUB_URL },
    ],
  };

  return (
    <div className="min-h-screen bg-brand-navy">
      {[serviceSchema, howToSchema, faqSchema, pageSchema, breadcrumbSchema].map((s, i) => (
        <script key={i} type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(s) }} />
      ))}
      <AnnouncementBar />
      <Navbar />

      {/* Answer first */}
      <section className="pt-28 pb-10 md:pt-36">
        <div className="mx-auto max-w-4xl px-4">
          <nav className="mb-4 text-xs text-gray-500" aria-label="Breadcrumb">
            <Link href="/" className="hover:text-gray-300">Home</Link>
            <span className="mx-1.5">/</span>
            <span className="text-gray-400">Wedding Fitness Plan</span>
          </nav>
          <h1 className="text-3xl md:text-5xl font-extrabold leading-tight text-white">
            Wedding Fitness Plan, <span className="text-brand-blue">Counted Down From Your Date</span>
          </h1>
          <p className="mt-3 text-sm text-gray-500">By Coach Himanshu, NASM certified · Online coaching for brides, grooms and couples worldwide</p>
          <div id="wedding-answer" className="mt-6 rounded-2xl border border-white/[0.08] bg-brand-navy-light/60 p-5 md:p-6">
            <p className="text-gray-200 md:text-lg leading-relaxed">{WEDDING_HUB_FAQS[0].answer}</p>
          </div>
        </div>
      </section>

      {/* Planner */}
      <section className="pb-16">
        <div className="mx-auto max-w-4xl px-4">
          <h2 className="mb-2 text-2xl md:text-3xl font-bold text-white">Plan Your Countdown</h2>
          <p className="mb-6 text-gray-400">Pick your wedding date or how many weeks you have. You get a realistic target, a phase plan and the plans that fit.</p>
          <WeddingCountdown />
        </div>
      </section>

      {/* By who */}
      <section className="border-y border-white/[0.06] py-16">
        <div className="mx-auto max-w-5xl px-4">
          <h2 className="mb-8 text-center text-2xl md:text-3xl font-bold text-white">Plans for the Bride, the Groom, or Both</h2>
          <div className="grid gap-4 md:grid-cols-3">
            {WEDDING_AUDIENCES.map((a) => (
              <Link
                key={a.slug}
                href={`/wedding-fitness-plan/${a.slug}`}
                className="block rounded-2xl border border-white/[0.08] bg-white/[0.02] p-6 transition-colors hover:border-brand-blue/50"
              >
                <h3 className="mb-2 text-lg font-semibold text-white">{a.navLabel}</h3>
                <p className="text-sm leading-relaxed text-gray-400">{a.focus.map((f) => f.title).join(' · ')}</p>
                <span className="mt-4 inline-block text-sm text-brand-blue">See the plan →</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Countdown table */}
      <section className="py-16">
        <div className="mx-auto max-w-5xl px-4">
          <h2 className="mb-2 text-2xl md:text-3xl font-bold text-white">How Much You Can Lose by Your Wedding</h2>
          <p className="mb-6 text-gray-400">
            Fat loss at 0.5–1 kg a week, with the final 2 weeks at maintenance so you look fresh on the day. Plans shown for one person;
            couples see the{' '}
            <Link href="/wedding-fitness-plan/couple" className="text-brand-blue hover:underline">couple wedding plan</Link>.
          </p>
          <CountdownTable who="bride" />
        </div>
      </section>

      {/* Flying home */}
      <section className="border-y border-white/[0.06] py-16">
        <div className="mx-auto max-w-5xl px-4">
          <h2 className="mb-2 text-center text-2xl md:text-3xl font-bold text-white">Flying Home for the Wedding?</h2>
          <p className="mx-auto mb-8 max-w-2xl text-center text-gray-400">
            Peak Indian wedding season runs from November to February, and many couples and families fly in from abroad for it. Your coaching
            moves with you.
          </p>
          <FlyingHomeSection />
        </div>
      </section>

      {/* FAQ */}
      <section className="py-16">
        <div className="mx-auto max-w-3xl px-4">
          <h2 className="mb-8 text-center text-2xl md:text-3xl font-bold text-white">Wedding Fitness FAQs</h2>
          <WeddingFaqList faqs={WEDDING_HUB_FAQS} />
          <p className="mt-6 text-center text-sm text-gray-400">
            Related:{' '}
            <Link href="/diet-plans" className="text-brand-blue hover:underline">Indian diet plans by calorie</Link>
            {' · '}
            <Link href="/tools/calorie-deficit-calculator" className="text-brand-blue hover:underline">Calorie deficit calculator</Link>
            {' · '}
            <Link href="/personal-trainer-cost-india" className="text-brand-blue hover:underline">What coaching costs</Link>
          </p>
        </div>
      </section>

      {/* Enquiry */}
      <section id="consultation" className="border-t border-white/[0.06] py-16 scroll-mt-24">
        <div className="mx-auto max-w-2xl px-4">
          <h2 className="mb-2 text-center text-2xl md:text-3xl font-bold text-white">Tell Us Your Wedding Date</h2>
          <p className="mb-8 text-center text-gray-400">
            Free consultation. Coach Himanshu will look at your timeline and recommend a plan. No payment needed to talk.
          </p>
          <ConsultationForm source="Wedding fitness plan" whatsappHref={WHATSAPP_WEDDING} />
        </div>
      </section>

      <Footer />

      <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 border-t border-white/[0.08] bg-brand-navy/95 p-3 backdrop-blur">
        <a href="#consultation" className="flex w-full items-center justify-center rounded-xl bg-brand-blue py-3.5 font-bold text-white hover:bg-brand-blue-dark">
          Plan My Wedding Countdown
        </a>
      </div>
    </div>
  );
}
