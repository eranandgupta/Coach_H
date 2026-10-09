import type { Metadata } from 'next';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import AnnouncementBar from '@/components/AnnouncementBar';
import { CALORIES_BASE } from '@/lib/foodPages';
import { COMPARE_BASE, FOOD_PAIRS, PAIR_GROUPS, getPairBySlug, pairTitle, verdicts } from '@/lib/foodCompare';

const description =
  `${FOOD_PAIRS.length} popular Indian food comparisons, from roti vs rice to paneer vs tofu. Calories, protein and fibre side by side, with a data-backed verdict for weight loss.`;

export const metadata: Metadata = {
  title: 'Food Comparisons: Roti vs Rice, Paneer vs Tofu & More',
  description,
  keywords: ['roti vs rice', 'paneer vs tofu', 'food comparison calories', 'which is better for weight loss', 'indian food comparison', 'brown rice vs white rice'],
  openGraph: { title: 'Indian Food Comparisons | Coach Himanshu', description, url: COMPARE_BASE, type: 'website', images: ['/opengraph-image'] },
  twitter: { card: 'summary_large_image', title: 'Indian Food Comparisons | Coach Himanshu', description },
  alternates: { canonical: COMPARE_BASE },
};

export default function CompareHubPage() {
  const groups = PAIR_GROUPS.map((g) => ({
    title: g.title,
    pairs: g.slugs.map((s) => getPairBySlug(s)!),
  }));

  const collectionSchema = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    '@id': `${COMPARE_BASE}#webpage`,
    url: COMPARE_BASE,
    name: 'Indian Food Comparisons',
    description,
    inLanguage: 'en',
    isPartOf: { '@id': 'https://coachhimanshu.com/#website' },
    author: { '@type': 'Person', '@id': 'https://coachhimanshu.com/#coach', name: 'Coach Himanshu' },
    publisher: { '@id': 'https://coachhimanshu.com/#organization' },
    mainEntity: {
      '@type': 'ItemList',
      numberOfItems: FOOD_PAIRS.length,
      itemListElement: FOOD_PAIRS.map((p, i) => ({
        '@type': 'ListItem',
        position: i + 1,
        name: pairTitle(p),
        url: `${COMPARE_BASE}/${p.slug}`,
      })),
    },
  };

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://coachhimanshu.com' },
      { '@type': 'ListItem', position: 2, name: 'Food Calories', item: CALORIES_BASE },
      { '@type': 'ListItem', position: 3, name: 'Food Comparisons', item: COMPARE_BASE },
    ],
  };

  return (
    <div className="min-h-screen bg-brand-navy">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <AnnouncementBar />
      <Navbar />

      <section className="relative pt-28 pb-8 md:pt-36 md:pb-10">
        <div className="max-w-5xl mx-auto px-4">
          <nav className="mb-4 flex flex-wrap items-center gap-1.5 text-xs text-gray-500" aria-label="Breadcrumb">
            <Link href="/" className="hover:text-gray-300">Home</Link>
            <span>/</span>
            <Link href="/calories" className="hover:text-gray-300">Food Calories</Link>
            <span>/</span>
            <span className="text-gray-400">Compare</span>
          </nav>
          <h1 className="text-3xl md:text-5xl font-extrabold leading-tight text-white">
            Which is better?{' '}
            <span className="bg-gradient-to-r from-brand-blue to-brand-gold bg-clip-text text-transparent">Indian food comparisons</span>
          </h1>
          <p className="mt-4 max-w-3xl text-gray-300 md:text-lg leading-relaxed">
            Roti or rice? Paneer or tofu? Ghee or olive oil? Each comparison puts calories, protein, fibre and minerals side by side,
            per 100 g and per typical serving, and gives a verdict for weight loss based on the numbers.
          </p>
        </div>
      </section>

      <section className="pb-16">
        <div className="max-w-5xl mx-auto px-4 space-y-10">
          {groups.map((g) => (
            <div key={g.title}>
              <h2 className="text-xl md:text-2xl font-bold text-white">{g.title}</h2>
              <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {g.pairs.map((p) => {
                  const wl = verdicts(p)[0];
                  const pick = wl.tradeoff ? 'It depends' : wl.winner === 'tie' ? 'Close call' : wl.winner === 'a' ? p.nameA : p.nameB;
                  return (
                    <Link
                      key={p.slug}
                      href={`/calories/compare/${p.slug}`}
                      className="rounded-xl border border-white/10 bg-brand-navy-light p-4 hover:border-brand-blue/50 transition-colors"
                    >
                      <p className="font-semibold text-white">{pairTitle(p)}</p>
                      <p className="mt-1 text-sm text-gray-400">
                        {p.foodA.per100g.kcal} vs {p.foodB.per100g.kcal} kcal per 100 g
                      </p>
                      <p className="mt-1 text-xs text-gray-500">
                        Weight loss: <span className="text-brand-gold">{pick}</span>
                      </p>
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="pb-16">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <p className="text-gray-400">
            Looking for a single food? Browse the <Link href="/calories" className="text-brand-blue hover:underline">food calorie chart</Link> or
            build a full meal in the <Link href="/calorie-calculator" className="text-brand-blue hover:underline">calorie calculator</Link>.
          </p>
        </div>
      </section>

      <Footer />
    </div>
  );
}
