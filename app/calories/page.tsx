import type { Metadata } from 'next';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import AnnouncementBar from '@/components/AnnouncementBar';
import { FOODS, FOOD_CATEGORIES } from '@/lib/foods';
import { caloriesFor } from '@/lib/nutrition';
import { CALORIES_BASE, categoryAnchor, primaryServing } from '@/lib/foodPages';
import { FOOD_LISTS } from '@/lib/foodLists';

const title = 'Food Calorie Chart: Calories in Indian Food';
const description = `Calories, protein, carbs and fat for ${FOODS.length}+ Indian and everyday foods: dal, roti, rice, paneer, chicken, sweets, street food, fruits and drinks. Per katori, roti, cup and 100 g.`;

export const metadata: Metadata = {
  title,
  description,
  keywords: [
    'indian food calorie chart',
    'calories in indian food',
    'food calorie list',
    'calorie chart india',
    'indian food nutrition chart',
    'protein in indian food',
  ],
  openGraph: { title: `${title} | Coach Himanshu`, description, url: CALORIES_BASE, type: 'website' },
  twitter: { card: 'summary_large_image', title: `${title} | Coach Himanshu`, description },
  alternates: { canonical: CALORIES_BASE },
};

export default function CaloriesIndexPage() {
  const groups = FOOD_CATEGORIES.map((category) => ({
    category,
    foods: FOODS.filter((f) => f.category === category).sort((a, b) => a.name.localeCompare(b.name)),
  }));

  const pageSchema = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    '@id': `${CALORIES_BASE}#webpage`,
    url: CALORIES_BASE,
    name: title,
    description,
    isPartOf: { '@id': 'https://coachhimanshu.com/#website' },
    author: { '@type': 'Person', '@id': 'https://coachhimanshu.com/#coach', name: 'Coach Himanshu' },
    publisher: { '@id': 'https://coachhimanshu.com/#organization' },
    mainEntity: {
      '@type': 'ItemList',
      numberOfItems: FOODS.length,
      itemListElement: FOODS.map((f, i) => ({
        '@type': 'ListItem',
        position: i + 1,
        name: `Calories in ${f.name}`,
        url: `${CALORIES_BASE}/${f.slug}`,
      })),
    },
  };

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://coachhimanshu.com' },
      { '@type': 'ListItem', position: 2, name: 'Food Calories', item: CALORIES_BASE },
    ],
  };

  return (
    <div className="min-h-screen bg-brand-navy">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(pageSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <AnnouncementBar />
      <Navbar />

      <section className="relative pt-28 pb-8 md:pt-36 md:pb-10">
        <div className="max-w-5xl mx-auto px-4">
          <nav className="mb-4 text-xs text-gray-500" aria-label="Breadcrumb">
            <Link href="/" className="hover:text-gray-300">Home</Link>
            <span className="mx-1.5">/</span>
            <span className="text-gray-400">Food Calories</span>
          </nav>
          <h1 className="text-3xl md:text-5xl font-extrabold leading-tight text-white">
            Food Calorie Chart:{' '}
            <span className="bg-gradient-to-r from-brand-blue to-brand-gold bg-clip-text text-transparent">Calories in Indian Food</span>
          </h1>
          <p className="mt-4 max-w-3xl text-gray-300 md:text-lg">
            Calories and macros for {FOODS.length} foods, measured per household serving (katori, roti, cup or glass) and
            per 100 g. Tap any food for its full nutrition facts, lighter swaps and a coach&apos;s take on weight loss and
            muscle gain. To total a whole meal, use the{' '}
            <Link href="/calorie-calculator" className="text-brand-blue hover:underline">calorie calculator</Link>. To find
            your own daily calorie and protein targets, use the{' '}
            <Link href="/tools" className="text-brand-blue hover:underline">free fitness calculators</Link>.
          </p>

          {/* Ranked lists — "high protein vegetarian foods" style queries */}
          <h2 className="mt-8 text-lg font-bold text-white">Popular food lists</h2>
          <div className="mt-3 grid gap-2 sm:grid-cols-2 md:grid-cols-3">
            {FOOD_LISTS.map((l) => (
              <Link key={l.slug} href={`/calories/lists/${l.slug}`} className="rounded-lg border border-brand-blue/20 bg-brand-blue/5 px-4 py-2.5 text-sm font-medium text-white hover:border-brand-blue/60">
                {l.name}
              </Link>
            ))}
          </div>

          {/* Category jump links */}
          <h2 className="mt-8 text-lg font-bold text-white">Browse by category</h2>
          <div className="mt-6 flex flex-wrap gap-2">
            {groups.map((g) => (
              <a key={g.category} href={`#${categoryAnchor(g.category)}`} className="rounded-full border border-white/10 bg-white/[0.03] px-3 py-1.5 text-xs text-gray-300 hover:border-brand-blue/50 hover:text-white">
                {g.category} <span className="text-gray-500">({g.foods.length})</span>
              </a>
            ))}
          </div>
        </div>
      </section>

      {groups.map((g) => (
        <section key={g.category} id={categoryAnchor(g.category)} className="pb-10 scroll-mt-24">
          <div className="max-w-5xl mx-auto px-4">
            <h2 className="text-2xl font-bold text-white">Calories in {g.category}</h2>
            <div className="mt-4 overflow-x-auto rounded-xl border border-white/10">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-white/5 text-left text-gray-300">
                    <th className="px-4 py-3 font-semibold">Food</th>
                    <th className="px-4 py-3 font-semibold">Serving</th>
                    <th className="px-4 py-3 font-semibold text-right">Calories</th>
                    <th className="px-4 py-3 font-semibold text-right">Protein</th>
                    <th className="px-4 py-3 font-semibold text-right">Per 100 g</th>
                  </tr>
                </thead>
                <tbody>
                  {g.foods.map((f) => {
                    const s = primaryServing(f);
                    const m = caloriesFor(f, s.grams);
                    return (
                      <tr key={f.slug} className="border-t border-white/5 text-gray-300">
                        <td className="px-4 py-2.5">
                          <Link href={`/calories/${f.slug}`} className="font-medium text-white hover:text-brand-blue">{f.name}</Link>
                        </td>
                        <td className="px-4 py-2.5 text-gray-400">{s.label}</td>
                        <td className="px-4 py-2.5 text-right font-semibold text-brand-gold">{m.kcal} kcal</td>
                        <td className="px-4 py-2.5 text-right">{m.protein} g</td>
                        <td className="px-4 py-2.5 text-right text-gray-400">{f.per100g.kcal} kcal</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </section>
      ))}

      <section className="pb-16">
        <div className="max-w-5xl mx-auto px-4">
          <p className="text-[11px] leading-relaxed text-gray-500">
            Nutrition data: Indian Nutrient Databank (INDB, CC BY), Indian Food Composition Tables 2017 (National Institute of
            Nutrition, ICMR) and USDA FoodData Central (public domain). Values are approximate and for general information, not
            medical advice.
          </p>
        </div>
      </section>

      <Footer />
    </div>
  );
}
