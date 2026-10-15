import type { Metadata } from 'next';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import AnnouncementBar from '@/components/AnnouncementBar';
import { CALORIE_TARGETS, DIET_LABEL, DIET_PLANS, DIET_PLANS_BASE, kcalLabel, planTitle, r0 } from '@/lib/dietPlans';

const WHATSAPP_DIET =
  'https://wa.me/917303484648?text=Hi%20Coach%20Himanshu!%20I%20want%20a%20personalised%20Indian%20diet%20plan.';

const title = 'Indian Diet Plans by Calorie: 1200 to 2500 kcal';
const description = `Free Indian diet charts at ${CALORIE_TARGETS.join(', ')} calories, vegetarian and non-veg. Six meals with exact portions, protein and calories for every food.`;

export const metadata: Metadata = {
  title,
  description,
  keywords: [
    'indian diet plan',
    'indian diet chart',
    'calorie diet plan indian',
    'vegetarian indian diet plan',
    'non veg indian diet plan',
    'indian diet plan for weight loss',
  ],
  openGraph: { title: `${title} | Coach Himanshu`, description, url: DIET_PLANS_BASE, type: 'website', images: ['/opengraph-image'] },
  twitter: { card: 'summary_large_image', title: `${title} | Coach Himanshu`, description },
  alternates: { canonical: DIET_PLANS_BASE },
};

export default function DietPlansHubPage() {
  const collectionSchema = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    '@id': `${DIET_PLANS_BASE}#webpage`,
    url: DIET_PLANS_BASE,
    name: title,
    description,
    inLanguage: 'en',
    isPartOf: { '@id': 'https://coachhimanshu.com/#website' },
    author: { '@type': 'Person', '@id': 'https://coachhimanshu.com/#coach', name: 'Coach Himanshu' },
    publisher: { '@id': 'https://coachhimanshu.com/#organization' },
    mainEntity: {
      '@type': 'ItemList',
      numberOfItems: DIET_PLANS.length,
      itemListElement: DIET_PLANS.map((p, idx) => ({
        '@type': 'ListItem',
        position: idx + 1,
        name: planTitle(p),
        url: `${DIET_PLANS_BASE}/${p.slug}`,
      })),
    },
  };
  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://coachhimanshu.com' },
      { '@type': 'ListItem', position: 2, name: 'Indian Diet Plans', item: DIET_PLANS_BASE },
    ],
  };

  return (
    <div className="min-h-screen bg-brand-navy">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <AnnouncementBar />
      <Navbar />

      <section className="relative pt-28 pb-8 md:pt-36">
        <div className="max-w-5xl mx-auto px-4">
          <nav className="mb-4 text-xs text-gray-500" aria-label="Breadcrumb">
            <Link href="/" className="hover:text-gray-300">Home</Link>
            <span className="mx-1.5">/</span>
            <span className="text-gray-400">Indian Diet Plans</span>
          </nav>
          <h1 className="text-3xl md:text-5xl font-extrabold leading-tight text-white">
            Indian Diet Plans{' '}
            <span className="bg-gradient-to-r from-brand-blue to-brand-gold bg-clip-text text-transparent">by Calorie Target</span>
          </h1>
          <p className="mt-4 max-w-3xl text-gray-300 md:text-lg leading-relaxed">
            Pick the calorie target that fits you and follow a full day of Indian meals: roti, dal, sabzi, curd and{' '}
            {DIET_LABEL.veg.toLowerCase()} or non-veg protein, in portions you can measure with a katori. Every calorie and
            protein figure is added up from Indian food data, not guessed.
          </p>
          <p className="mt-3 text-sm">
            <Link href="/tools/calorie-deficit-calculator" className="text-brand-blue hover:underline">
              Not sure of your target? Use the free calorie deficit calculator →
            </Link>
          </p>
        </div>
      </section>

      <section className="pb-12">
        <div className="max-w-5xl mx-auto px-4">
          <div className="overflow-x-auto rounded-xl border border-white/10">
            <table className="w-full min-w-[640px]">
              <thead className="bg-white/[0.03]">
                <tr>
                  <th className="py-3 px-4 text-left text-xs font-semibold uppercase tracking-wide text-gray-400">Target</th>
                  <th className="py-3 px-4 text-left text-xs font-semibold uppercase tracking-wide text-gray-400">Best for</th>
                  <th className="py-3 px-4 text-left text-xs font-semibold uppercase tracking-wide text-gray-400">Vegetarian</th>
                  <th className="py-3 px-4 text-left text-xs font-semibold uppercase tracking-wide text-gray-400">Non-veg</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.05]">
                {CALORIE_TARGETS.map((kcal) => {
                  const veg = DIET_PLANS.find((p) => p.kcal === kcal && p.diet === 'veg');
                  const non = DIET_PLANS.find((p) => p.kcal === kcal && p.diet === 'nonveg');
                  return (
                    <tr key={kcal}>
                      <td className="py-3 px-4 text-lg font-bold text-brand-gold">{kcalLabel(kcal)} kcal</td>
                      <td className="py-3 px-4 text-sm text-gray-300">{veg?.goal ?? non?.goal}</td>
                      {[veg, non].map((p, idx) => (
                        <td key={idx} className="py-3 px-4 text-sm">
                          {p && (
                            <Link href={`/diet-plans/${p.slug}`} className="text-white hover:text-brand-blue">
                              View chart
                              <span className="block text-xs text-gray-500">{r0(p.totals.protein)} g protein</span>
                            </Link>
                          )}
                        </td>
                      ))}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      <section className="pb-12">
        <div className="max-w-5xl mx-auto px-4">
          <h2 className="text-xl md:text-2xl font-bold text-white">How to use these plans</h2>
          <ul className="mt-4 space-y-2 text-gray-300">
            <li>Find your calorie target with the calculator, then pick the plan closest to that number.</li>
            <li>Weigh portions for the first week. After that a katori and your eye are usually close enough.</li>
            <li>
              Swap like for like using the{' '}
              <Link href="/calories" className="text-brand-blue hover:underline">food calorie chart</Link> and{' '}
              <Link href="/calories/compare" className="text-brand-blue hover:underline">food comparisons</Link>, and keep the
              protein foods in place.
            </li>
            <li>Weigh yourself weekly. If nothing changes after 2–3 weeks, move to the next plan down.</li>
          </ul>
        </div>
      </section>

      <section className="pb-16">
        <div className="max-w-3xl mx-auto px-4">
          <div className="rounded-2xl border border-brand-blue/20 bg-gradient-to-r from-brand-blue/10 to-brand-navy-light p-6 text-center">
            <h2 className="text-xl md:text-2xl font-bold text-white">A chart is a start. A coach gets results.</h2>
            <p className="mx-auto mt-2 max-w-xl text-sm text-gray-300">
              Get a diet built around your own calories, food, schedule and health, adjusted every week by Coach Himanshu.
            </p>
            <div className="mt-5 flex flex-wrap justify-center gap-3">
              <a
                href={WHATSAPP_DIET}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-xl bg-gradient-to-r from-brand-blue to-blue-500 px-6 py-3 font-semibold text-white shadow-lg shadow-brand-blue/25 hover:-translate-y-0.5 transition-transform"
              >
                Get my personalised plan
              </a>
              <Link href="/plans" className="rounded-xl border border-white/15 px-6 py-3 font-semibold text-white hover:bg-white/5 transition-colors">
                See coaching plans
              </Link>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
