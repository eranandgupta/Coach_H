import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import AnnouncementBar from '@/components/AnnouncementBar';
import FitnessToolWidget from '@/components/FitnessToolWidget';
import { FITNESS_TOOLS, TOOLS_BASE, getAllToolSlugs, getToolBySlug } from '@/lib/fitnessTools';

const WHATSAPP_CONSULT =
  'https://wa.me/917303484648?text=Hi%20Coach%20Himanshu!%20I%20used%20your%20fitness%20calculator%20and%20want%20a%20personalised%20plan.';

export function generateStaticParams() {
  return getAllToolSlugs().map((tool) => ({ tool }));
}

export async function generateMetadata({ params }: { params: { tool: string } }): Promise<Metadata> {
  const tool = getToolBySlug(params.tool);
  if (!tool) return { title: 'Not Found' };
  const url = `${TOOLS_BASE}/${tool.slug}`;
  return {
    title: tool.metaTitle,
    description: tool.metaDescription,
    keywords: tool.keywords,
    openGraph: { title: `${tool.metaTitle} | Coach Himanshu`, description: tool.metaDescription, url, type: 'website', images: ['/opengraph-image'] },
    twitter: { card: 'summary_large_image', title: `${tool.metaTitle} | Coach Himanshu`, description: tool.metaDescription },
    alternates: { canonical: url },
  };
}

export default function FitnessToolPage({ params }: { params: { tool: string } }) {
  const tool = getToolBySlug(params.tool);
  if (!tool) notFound();

  const url = `${TOOLS_BASE}/${tool.slug}`;
  const related = tool.related
    .map((slug) => FITNESS_TOOLS.find((t) => t.slug === slug))
    .filter((t): t is NonNullable<typeof t> => Boolean(t));

  const pageSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    '@id': `${url}#webpage`,
    url,
    name: tool.metaTitle,
    description: tool.metaDescription,
    inLanguage: 'en',
    isPartOf: { '@id': 'https://coachhimanshu.com/#website' },
    author: { '@type': 'Person', '@id': 'https://coachhimanshu.com/#coach', name: 'Coach Himanshu' },
    publisher: { '@id': 'https://coachhimanshu.com/#organization' },
    citation: tool.sources,
    speakable: { '@type': 'SpeakableSpecification', cssSelector: ['#tool-answer', '#coach-note'] },
    mainEntity: { '@id': `${url}#app` },
  };

  const appSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    '@id': `${url}#app`,
    name: tool.name,
    description: tool.metaDescription,
    url,
    applicationCategory: 'HealthApplication',
    operatingSystem: 'Web',
    isAccessibleForFree: true,
    offers: { '@type': 'Offer', price: '0', priceCurrency: 'INR' },
    provider: { '@type': 'Person', '@id': 'https://coachhimanshu.com/#coach', name: 'Coach Himanshu' },
  };

  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: tool.faqs.map((f) => ({
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
      { '@type': 'ListItem', position: 2, name: 'Fitness Calculators', item: TOOLS_BASE },
      { '@type': 'ListItem', position: 3, name: tool.name, item: url },
    ],
  };

  return (
    <div className="min-h-screen bg-brand-navy">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(pageSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(appSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <AnnouncementBar />
      <Navbar />

      <section className="relative pt-28 pb-8 md:pt-36 md:pb-10">
        <div className="max-w-4xl mx-auto px-4">
          <nav className="mb-4 flex flex-wrap items-center gap-1.5 text-xs text-gray-500" aria-label="Breadcrumb">
            <Link href="/" className="hover:text-gray-300">Home</Link>
            <span>/</span>
            <Link href="/tools" className="hover:text-gray-300">Fitness Calculators</Link>
            <span>/</span>
            <span className="text-gray-400">{tool.name}</span>
          </nav>
          <h1 className="text-3xl md:text-5xl font-extrabold leading-tight text-white">
            <span className="bg-gradient-to-r from-brand-blue to-brand-gold bg-clip-text text-transparent">{tool.name}</span>
          </h1>
          <p id="tool-answer" className="mt-4 max-w-3xl text-gray-300 md:text-lg leading-relaxed">{tool.answer}</p>
        </div>
      </section>

      {/* Calculator */}
      <section className="pb-12">
        <div className="max-w-4xl mx-auto px-4">
          <FitnessToolWidget slug={tool.slug} />
          <p className="mt-3 text-xs text-gray-500">
            For adults aged 18 and over. An estimate for general guidance, not medical advice. Free to use, no sign-up, and
            nothing you enter leaves your device.
          </p>
        </div>
      </section>

      {/* Formula + worked example */}
      <section className="pb-12">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-2xl md:text-3xl font-bold text-white">How the {tool.name} works</h2>
          <div className="mt-5 rounded-xl border border-white/10 bg-brand-navy-light p-4">
            {tool.formulaLines.map((line) => (
              <p key={line} className="whitespace-pre-wrap break-words font-mono text-sm leading-7 text-brand-gold">{line}</p>
            ))}
          </div>
          <p className="mt-5 text-gray-300 leading-relaxed">{tool.method}</p>
          <h3 className="mt-6 text-lg font-semibold text-white">Worked example</h3>
          <p className="mt-2 text-gray-300 leading-relaxed">{tool.example}</p>
        </div>
      </section>

      {/* Reference table */}
      <section className="pb-12">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-2xl md:text-3xl font-bold text-white">{tool.table.caption}</h2>
          <div className="mt-5 overflow-x-auto rounded-xl border border-white/10">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-white/5 text-left text-gray-300">
                  {tool.table.headers.map((h) => (
                    <th key={h} className="px-3 py-3 font-semibold">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {tool.table.rows.map((row) => (
                  <tr key={row[0]} className="border-t border-white/5 text-gray-300">
                    {row.map((cell, i) => (
                      <td key={i} className={`px-3 py-2.5 ${i === 0 ? 'font-medium text-white' : ''}`}>{cell}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {tool.table.note && <p className="mt-3 text-xs text-gray-500">{tool.table.note}</p>}
        </div>
      </section>

      {/* Coach's note */}
      <section className="pb-12">
        <div className="max-w-4xl mx-auto px-4">
          <div className="rounded-2xl border border-brand-blue/20 bg-brand-navy-light p-6 md:p-8">
            <h2 className="text-2xl font-bold text-white">Coach&apos;s take</h2>
            <p id="coach-note" className="mt-4 text-gray-300 leading-relaxed">{tool.coachNote}</p>
            <p className="mt-4 text-sm text-gray-400">
              Coach Himanshu is a NASM-certified fitness coach.{' '}
              <Link href="/about" className="text-brand-blue hover:underline">About the coach</Link>
            </p>
          </div>
        </div>
      </section>

      {/* FAQ — mirrors FAQPage schema exactly */}
      <section className="pb-12">
        <div className="max-w-3xl mx-auto px-4">
          <h2 className="text-2xl md:text-3xl font-bold text-white">Frequently asked questions</h2>
          <div className="mt-5 space-y-3">
            {tool.faqs.map((f) => (
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

      {/* Related tools */}
      <section className="pb-12">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-xl font-bold text-white">Use these next</h2>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            {related.map((t) => (
              <Link key={t.slug} href={`/tools/${t.slug}`} className="rounded-xl border border-white/10 p-4 hover:border-brand-blue/50 transition-colors">
                <div className="font-semibold text-white">{t.name}</div>
                <div className="mt-1 text-sm text-gray-400">{t.tagline}</div>
              </Link>
            ))}
            <Link href="/calorie-calculator" className="rounded-xl border border-white/10 p-4 hover:border-brand-blue/50 transition-colors">
              <div className="font-semibold text-white">Indian Food Calorie Calculator</div>
              <div className="mt-1 text-sm text-gray-400">Count the calories and macros in dal, roti, rice and full meals.</div>
            </Link>
          </div>
        </div>
      </section>

      {/* Sources */}
      <section className="pb-12">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-xl font-bold text-white">Sources</h2>
          <ul className="mt-3 list-disc space-y-1.5 pl-5 text-sm text-gray-400">
            {tool.sources.map((s) => (
              <li key={s}>{s}</li>
            ))}
          </ul>
        </div>
      </section>

      {/* CTA */}
      <section className="pb-16">
        <div className="max-w-3xl mx-auto px-4">
          <div className="rounded-2xl border border-brand-blue/20 bg-gradient-to-r from-brand-blue/10 to-brand-navy-light p-6 text-center">
            <h2 className="text-xl md:text-2xl font-bold text-white">Turn your number into a plan</h2>
            <p className="mx-auto mt-2 max-w-xl text-sm text-gray-300">
              A calculator gives you a target. Coach Himanshu builds the workout and Indian diet plan that gets you there, and
              adjusts it as your body changes.
            </p>
            <div className="mt-5 flex flex-wrap justify-center gap-3">
              <a href={WHATSAPP_CONSULT} target="_blank" rel="noopener noreferrer" className="rounded-xl bg-gradient-to-r from-brand-blue to-blue-500 px-6 py-3 font-semibold text-white shadow-lg shadow-brand-blue/25 hover:-translate-y-0.5 transition-transform">
                Get a free consultation
              </a>
              <Link href="/online-personal-trainer" className="rounded-xl border border-white/15 px-6 py-3 font-semibold text-white hover:bg-white/5 transition-colors">
                See live 1:1 coaching
              </Link>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
