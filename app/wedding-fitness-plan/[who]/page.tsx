import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import AnnouncementBar from '@/components/AnnouncementBar';
import ConsultationForm from '@/components/ConsultationForm';
import WeddingCountdown from '@/components/WeddingCountdown';
import { CountdownTable, FlyingHomeSection, WeddingFaqList } from '@/components/WeddingFitnessSections';
import { WEDDING_AUDIENCES, WEDDING_HUB_URL, getWeddingAudience } from '@/lib/weddingFitness';

const whatsapp = (label: string) =>
  `https://wa.me/917303484648?text=${encodeURIComponent(`Hi Coach Himanshu! I want a ${label.toLowerCase()}. My wedding is on `)}`;

// The audience page each wedding plan cross-links to.
const AUDIENCE_LINK: Record<string, { href: string; label: string }> = {
  bride: { href: '/fitness-coaching-for/women', label: 'Fitness coaching for women' },
  groom: { href: '/fitness-coaching-for/men', label: 'Fitness coaching for men' },
  couple: { href: '/fitness-coaching-for/family', label: 'Couple and family coaching' },
};

export function generateStaticParams() {
  return WEDDING_AUDIENCES.map((a) => ({ who: a.slug }));
}

export async function generateMetadata({ params }: { params: { who: string } }): Promise<Metadata> {
  const a = getWeddingAudience(params.who);
  if (!a) return { title: 'Not Found' };
  const url = `${WEDDING_HUB_URL}/${a.slug}`;
  return {
    title: a.metaTitle,
    description: a.metaDescription,
    keywords: a.keywords,
    openGraph: { title: `${a.metaTitle} | Coach Himanshu`, description: a.metaDescription, url, type: 'article', images: ['/opengraph-image'] },
    twitter: { card: 'summary_large_image', title: `${a.metaTitle} | Coach Himanshu`, description: a.metaDescription },
    alternates: { canonical: url },
  };
}

export default function WeddingAudiencePage({ params }: { params: { who: string } }) {
  const a = getWeddingAudience(params.who);
  if (!a) notFound();
  const url = `${WEDDING_HUB_URL}/${a.slug}`;
  const siblings = WEDDING_AUDIENCES.filter((x) => x.slug !== a.slug);
  const related = AUDIENCE_LINK[a.slug];
  const wa = whatsapp(a.navLabel);

  const serviceSchema = {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: a.metaTitle,
    description: a.metaDescription,
    url,
    serviceType: 'Online Fitness Coaching',
    provider: { '@type': 'Person', '@id': 'https://coachhimanshu.com/#coach', name: 'Coach Himanshu' },
    areaServed: { '@type': 'Place', name: 'Worldwide' },
    audience: { '@type': 'Audience', audienceType: a.name },
    isRelatedTo: { '@id': `${WEDDING_HUB_URL}#service` },
  };

  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: a.faqs.map((f) => ({
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
      { '@type': 'ListItem', position: 2, name: 'Wedding Fitness Plan', item: WEDDING_HUB_URL },
      { '@type': 'ListItem', position: 3, name: a.navLabel, item: url },
    ],
  };

  return (
    <div className="min-h-screen bg-brand-navy">
      {[serviceSchema, faqSchema, breadcrumbSchema].map((s, i) => (
        <script key={i} type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(s) }} />
      ))}
      <AnnouncementBar />
      <Navbar />

      <section className="pt-28 pb-10 md:pt-36">
        <div className="mx-auto max-w-4xl px-4">
          <nav className="mb-4 text-xs text-gray-500" aria-label="Breadcrumb">
            <Link href="/" className="hover:text-gray-300">Home</Link>
            <span className="mx-1.5">/</span>
            <Link href="/wedding-fitness-plan" className="hover:text-gray-300">Wedding Fitness Plan</Link>
            <span className="mx-1.5">/</span>
            <span className="text-gray-400">{a.name}</span>
          </nav>
          <h1 className="text-3xl md:text-5xl font-extrabold leading-tight text-white">
            {a.h1} <span className="text-brand-blue">{a.h1Accent}</span>
          </h1>
          <p className="mt-3 text-sm text-gray-500">By Coach Himanshu, NASM certified · Online, worldwide</p>
          <p className="mt-6 text-gray-300 md:text-lg leading-relaxed">{a.intro}</p>
          <div id="wedding-answer" className="mt-6 rounded-2xl border border-white/[0.08] bg-brand-navy-light/60 p-5 md:p-6">
            <p className="font-semibold text-white">{a.faqs[0].question}</p>
            <p className="mt-2 text-gray-300 leading-relaxed">{a.faqs[0].answer}</p>
          </div>
        </div>
      </section>

      <section className="pb-16">
        <div className="mx-auto max-w-4xl px-4">
          <h2 className="mb-2 text-2xl md:text-3xl font-bold text-white">Plan Your Countdown</h2>
          <p className="mb-6 text-gray-400">Enter your wedding date or pick the weeks you have left.</p>
          <WeddingCountdown who={a.slug} />
        </div>
      </section>

      <section className="border-y border-white/[0.06] py-16">
        <div className="mx-auto max-w-5xl px-4">
          <h2 className="mb-8 text-center text-2xl md:text-3xl font-bold text-white">{a.focusHeading}</h2>
          <div className="grid gap-4 md:grid-cols-2">
            {a.focus.map((f) => (
              <div key={f.title} className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-6">
                <h3 className="mb-2 font-semibold text-white">{f.title}</h3>
                <p className="text-sm leading-relaxed text-gray-400">{f.text}</p>
              </div>
            ))}
          </div>
          <div className="mx-auto mt-8 max-w-3xl rounded-2xl border border-white/[0.08] bg-brand-navy-light/60 p-5">
            <p className="text-sm leading-relaxed text-gray-300">
              <strong className="text-white">Outfit fittings:</strong> {a.outfitNote}
            </p>
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="mx-auto max-w-5xl px-4">
          <h2 className="mb-6 text-2xl md:text-3xl font-bold text-white">Countdown at a Glance</h2>
          <CountdownTable who={a.slug} />
        </div>
      </section>

      <section className="border-y border-white/[0.06] py-16">
        <div className="mx-auto max-w-5xl px-4">
          <h2 className="mb-8 text-center text-2xl md:text-3xl font-bold text-white">Flying Home for the Wedding?</h2>
          <FlyingHomeSection />
        </div>
      </section>

      <section className="py-16">
        <div className="mx-auto max-w-3xl px-4">
          <h2 className="mb-8 text-center text-2xl md:text-3xl font-bold text-white">{a.navLabel}: FAQs</h2>
          <WeddingFaqList faqs={a.faqs} />
          <p className="mt-8 text-center text-sm text-gray-400">
            {siblings.map((s) => (
              <span key={s.slug}>
                <Link href={`/wedding-fitness-plan/${s.slug}`} className="text-brand-blue hover:underline">{s.navLabel}</Link>
                {' · '}
              </span>
            ))}
            <Link href={related.href} className="text-brand-blue hover:underline">{related.label}</Link>
            {' · '}
            <Link href="/online-personal-trainer" className="text-brand-blue hover:underline">Live 1:1 training</Link>
            {' · '}
            <Link href="/diet-plans" className="text-brand-blue hover:underline">Indian diet plans</Link>
          </p>
        </div>
      </section>

      <section id="consultation" className="border-t border-white/[0.06] py-16 scroll-mt-24">
        <div className="mx-auto max-w-2xl px-4">
          <h2 className="mb-2 text-center text-2xl md:text-3xl font-bold text-white">Tell Us Your Wedding Date</h2>
          <p className="mb-8 text-center text-gray-400">Free consultation. Get a countdown plan for your date before you pay anything.</p>
          <ConsultationForm source={`Wedding fitness: ${a.navLabel}`} whatsappHref={wa} />
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
