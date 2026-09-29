import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import AnnouncementBar from '@/components/AnnouncementBar';
import { caloriesFor } from '@/lib/nutrition';
import { CALORIES_BASE, primaryServing } from '@/lib/foodPages';
import { FOOD_LISTS, LISTS_BASE, getAllListSlugs, getListBySlug, listFaqs, metricPhrase, rankList } from '@/lib/foodLists';

const WHATSAPP_CONSULT =
  'https://wa.me/917303484648?text=Hi%20Coach%20Himanshu!%20I%20want%20a%20personalised%20diet%20plan.';

export function generateStaticParams() {
  return getAllListSlugs().map((list) => ({ list }));
}

export async function generateMetadata({ params }: { params: { list: string } }): Promise<Metadata> {
  const list = getListBySlug(params.list);
  if (!list) return { title: 'Not Found' };
  const url = `${LISTS_BASE}/${list.slug}`;
  const lower = list.name.toLowerCase();
  return {
    title: list.metaTitle,
    description: list.metaDescription,
    keywords: [lower, `${lower} india`, `${lower} list`, `best ${lower}`, `indian ${lower}`],
    openGraph: { title: `${list.metaTitle} | Coach Himanshu`, description: list.metaDescription, url, type: 'article' },
    twitter: { card: 'summary_large_image', title: `${list.metaTitle} | Coach Himanshu`, description: list.metaDescription },
    alternates: { canonical: url },
  };
}

export default function FoodListPage({ params }: { params: { list: string } }) {
  const list = getListBySlug(params.list);
  if (!list) notFound();

  const url = `${LISTS_BASE}/${list.slug}`;
  const ranked = rankList(list);
  const faqs = listFaqs(list);
  const others = FOOD_LISTS.filter((l) => l.slug !== list.slug);
  const showKcalColumn = list.metric !== 'kcal';

  const pageSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    '@id': `${url}#webpage`,
    url,
    name: list.metaTitle,
    description: list.metaDescription,
    inLanguage: 'en',
    isPartOf: { '@id': 'https://coachhimanshu.com/#website' },
    author: { '@type': 'Person', '@id': 'https://coachhimanshu.com/#coach', name: 'Coach Himanshu' },
    publisher: { '@id': 'https://coachhimanshu.com/#organization' },
    citation: ['Indian Nutrient Databank (INDB)', 'Indian Food Composition Tables 2017 (NIN, ICMR)', 'USDA FoodData Central'],
    speakable: { '@type': 'SpeakableSpecification', cssSelector: ['#list-intro', '#coach-note'] },
    mainEntity: {
      '@type': 'ItemList',
      name: list.name,
      itemListOrder: list.order === 'desc' ? 'https://schema.org/ItemListOrderDescending' : 'https://schema.org/ItemListOrderAscending',
      numberOfItems: ranked.length,
      itemListElement: ranked.map((f, i) => ({
        '@type': 'ListItem',
        position: i + 1,
        name: `${f.name}: ${metricPhrase(list, f.per100g[list.metric])} per 100 g`,
        url: `${CALORIES_BASE}/${f.slug}`,
      })),
    },
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
      { '@type': 'ListItem', position: 2, name: 'Food Calories', item: CALORIES_BASE },
      { '@type': 'ListItem', position: 3, name: list.name, item: url },
    ],
  };

  return (
    <div className="min-h-screen bg-brand-navy">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(pageSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <AnnouncementBar />
      <Navbar />

      <section className="relative pt-28 pb-8 md:pt-36 md:pb-10">
        <div className="max-w-4xl mx-auto px-4">
          <nav className="mb-4 flex flex-wrap items-center gap-1.5 text-xs text-gray-500" aria-label="Breadcrumb">
            <Link href="/" className="hover:text-gray-300">Home</Link>
            <span>/</span>
            <Link href="/calories" className="hover:text-gray-300">Food Calories</Link>
            <span>/</span>
            <span className="text-gray-400">{list.name}</span>
          </nav>
          <h1 className="text-3xl md:text-5xl font-extrabold leading-tight text-white">
            <span className="bg-gradient-to-r from-brand-blue to-brand-gold bg-clip-text text-transparent">{list.name}</span>
          </h1>
          <p id="list-intro" className="mt-4 max-w-3xl text-gray-300 md:text-lg leading-relaxed">
            {list.intro} Top pick: <strong className="text-white">{ranked[0].name}</strong>, with{' '}
            {metricPhrase(list, ranked[0].per100g[list.metric])} per 100 g.
          </p>
        </div>
      </section>

      {/* Ranked table */}
      <section className="pb-12">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-2xl md:text-3xl font-bold text-white">
            {ranked.length} {list.noun} ranked by {list.metricLabel.toLowerCase()}
          </h2>
          <div className="mt-5 overflow-x-auto rounded-xl border border-white/10">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-white/5 text-left text-gray-300">
                  <th className="px-3 py-3 font-semibold">#</th>
                  <th className="px-3 py-3 font-semibold">Food</th>
                  <th className="px-3 py-3 font-semibold text-right">{list.metricLabel} / 100 g</th>
                  {showKcalColumn && <th className="px-3 py-3 font-semibold text-right">Calories / 100 g</th>}
                  <th className="px-3 py-3 font-semibold">Typical serving</th>
                </tr>
              </thead>
              <tbody>
                {ranked.map((f, i) => {
                  const s = primaryServing(f);
                  const m = caloriesFor(f, s.grams);
                  return (
                    <tr key={f.slug} className="border-t border-white/5 text-gray-300">
                      <td className="px-3 py-2.5 text-gray-500">{i + 1}</td>
                      <td className="px-3 py-2.5">
                        <Link href={`/calories/${f.slug}`} className="font-medium text-white hover:text-brand-blue">{f.name}</Link>
                      </td>
                      <td className="px-3 py-2.5 text-right font-semibold text-brand-gold">{f.per100g[list.metric]} {list.unit}</td>
                      {showKcalColumn && <td className="px-3 py-2.5 text-right">{f.per100g.kcal} kcal</td>}
                      <td className="px-3 py-2.5 text-gray-400">
                        {s.label}: {m[list.metric]} {list.unit}{showKcalColumn ? `, ${m.kcal} kcal` : ''}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          <p className="mt-3 text-xs text-gray-500">
            Per 100 g of the ready-to-eat form. Sources: INDB, IFCT 2017 (NIN-ICMR) and USDA FoodData Central. Values vary with recipe and portion.
          </p>
        </div>
      </section>

      {/* Coach's note */}
      <section className="pb-12">
        <div className="max-w-4xl mx-auto px-4">
          <div className="rounded-2xl border border-brand-blue/20 bg-brand-navy-light p-6 md:p-8">
            <h2 className="text-2xl font-bold text-white">How to use this list</h2>
            <p id="coach-note" className="mt-4 text-gray-300 leading-relaxed">{list.coachNote}</p>
          </div>
        </div>
      </section>

      {/* FAQ — mirrors FAQPage schema exactly */}
      <section className="pb-12">
        <div className="max-w-3xl mx-auto px-4">
          <h2 className="text-2xl md:text-3xl font-bold text-white">Frequently asked questions</h2>
          <div className="mt-5 space-y-3">
            {faqs.map((f) => (
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

      {/* Other lists */}
      <section className="pb-12">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-xl font-bold text-white">More food lists</h2>
          <div className="mt-4 grid gap-2 sm:grid-cols-2">
            {others.map((l) => (
              <Link key={l.slug} href={`/calories/lists/${l.slug}`} className="rounded-lg border border-white/10 px-4 py-2.5 text-sm text-gray-300 hover:border-brand-blue/50 hover:text-white">
                {l.name}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="pb-16">
        <div className="max-w-3xl mx-auto px-4">
          <div className="rounded-2xl border border-brand-blue/20 bg-gradient-to-r from-brand-blue/10 to-brand-navy-light p-6 text-center">
            <h2 className="text-xl md:text-2xl font-bold text-white">Turn this list into a plan</h2>
            <p className="mx-auto mt-2 max-w-xl text-sm text-gray-300">
              Knowing the right foods is step one. Get an Indian diet plan with your exact portions and targets, built by NASM-certified Coach Himanshu.
            </p>
            <div className="mt-5 flex flex-wrap justify-center gap-3">
              <a href={WHATSAPP_CONSULT} target="_blank" rel="noopener noreferrer" className="rounded-xl bg-gradient-to-r from-brand-blue to-blue-500 px-6 py-3 font-semibold text-white shadow-lg shadow-brand-blue/25 hover:-translate-y-0.5 transition-transform">
                Get a free consultation
              </a>
              <Link href="/calorie-calculator" className="rounded-xl border border-white/15 px-6 py-3 font-semibold text-white hover:bg-white/5 transition-colors">
                Try the calorie calculator
              </Link>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
