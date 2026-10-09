import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import AnnouncementBar from '@/components/AnnouncementBar';
import { getFoodBySlug } from '@/lib/foods';
import { caloriesFor } from '@/lib/nutrition';
import {
  CALORIES_BASE,
  SOURCE_LABEL,
  answerSentence,
  burnMinutes,
  isAlcohol,
  categoryAnchor,
  coachTake,
  foodFaqs,
  foodTags,
  getAllFoodSlugs,
  lighterSwaps,
  macroSplit,
  primaryServing,
  similarFoods,
} from '@/lib/foodPages';
import { listsForFood } from '@/lib/foodLists';
import { pairTitle, pairsForFood } from '@/lib/foodCompare';

const WHATSAPP_CONSULT =
  'https://wa.me/917303484648?text=Hi%20Coach%20Himanshu!%20I%20want%20a%20personalised%20diet%20plan.';

export function generateStaticParams() {
  return getAllFoodSlugs().map((food) => ({ food }));
}

export async function generateMetadata({ params }: { params: { food: string } }): Promise<Metadata> {
  const food = getFoodBySlug(params.food);
  if (!food) return { title: 'Not Found' };
  const s = primaryServing(food);
  const kcal = caloriesFor(food, s.grams).kcal;
  const url = `${CALORIES_BASE}/${food.slug}`;
  const title = `Calories in ${food.name}: ${kcal} kcal per ${s.label}`;
  const description = `${answerSentence(food)} Full macros, vitamins & minerals, and how it fits weight loss or muscle gain.`;
  const lower = food.name.toLowerCase();
  return {
    title,
    description,
    keywords: [
      `calories in ${lower}`,
      `${lower} calories`,
      `${lower} protein`,
      `${lower} nutrition`,
      `is ${lower} good for weight loss`,
      ...(food.aliases ?? []).slice(0, 3).map((a) => `${a} calories`),
    ],
    openGraph: { title: `${title} | Coach Himanshu`, description, url, type: 'article', images: ['/opengraph-image'] },
    twitter: { card: 'summary_large_image', title: `${title} | Coach Himanshu`, description },
    alternates: { canonical: url },
  };
}

const toneClass = {
  good: 'border-emerald-400/30 bg-emerald-400/10 text-emerald-300',
  watch: 'border-amber-400/30 bg-amber-400/10 text-amber-300',
  neutral: 'border-white/15 bg-white/5 text-gray-300',
} as const;

export default function FoodCaloriesPage({ params }: { params: { food: string } }) {
  const food = getFoodBySlug(params.food);
  if (!food) notFound();

  const url = `${CALORIES_BASE}/${food.slug}`;
  const s = primaryServing(food);
  const serving = caloriesFor(food, s.grams);
  const n = food.per100g;
  const split = macroSplit(food);
  const tags = foodTags(food);
  const take = coachTake(food);
  const faqs = foodFaqs(food);
  const similar = similarFoods(food);
  const swaps = lighterSwaps(food);
  const burn = burnMinutes(serving.kcal);
  const answer = answerSentence(food);
  const featuredIn = listsForFood(food.slug);
  const comparisons = pairsForFood(food.slug);

  const nutrientRows: { label: string; unit: string; key: keyof typeof n }[] = [
    { label: 'Calories', unit: 'kcal', key: 'kcal' },
    { label: 'Protein', unit: 'g', key: 'protein' },
    { label: 'Carbohydrates', unit: 'g', key: 'carbs' },
    { label: 'Fat', unit: 'g', key: 'fat' },
    { label: 'Fibre', unit: 'g', key: 'fiber' },
    { label: 'Sugar', unit: 'g', key: 'sugar' },
    { label: 'Sodium', unit: 'mg', key: 'sodium' },
    { label: 'Calcium', unit: 'mg', key: 'calcium' },
    { label: 'Iron', unit: 'mg', key: 'iron' },
    { label: 'Potassium', unit: 'mg', key: 'potassium' },
    { label: 'Vitamin C', unit: 'mg', key: 'vitaminC' },
  ];

  const pageSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    '@id': `${url}#webpage`,
    url,
    name: `Calories in ${food.name}`,
    description: answer,
    inLanguage: 'en',
    isPartOf: { '@id': 'https://coachhimanshu.com/#website' },
    about: { '@type': 'Thing', name: food.name, alternateName: food.aliases?.length ? food.aliases : undefined },
    author: { '@type': 'Person', '@id': 'https://coachhimanshu.com/#coach', name: 'Coach Himanshu' },
    publisher: { '@id': 'https://coachhimanshu.com/#organization' },
    citation: SOURCE_LABEL[food.source],
    speakable: { '@type': 'SpeakableSpecification', cssSelector: ['#food-answer', '#coach-take'] },
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
      { '@type': 'ListItem', position: 3, name: food.category, item: `${CALORIES_BASE}#${categoryAnchor(food.category)}` },
      { '@type': 'ListItem', position: 4, name: food.name, item: url },
    ],
  };

  return (
    <div className="min-h-screen bg-brand-navy">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(pageSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <AnnouncementBar />
      <Navbar />

      {/* Hero — answer first (AEO) */}
      <section className="relative pt-28 pb-10 md:pt-36 md:pb-12 overflow-hidden">
        <div className="max-w-4xl mx-auto px-4">
          <nav className="mb-4 flex flex-wrap items-center gap-1.5 text-xs text-gray-500" aria-label="Breadcrumb">
            <Link href="/" className="hover:text-gray-300">Home</Link>
            <span>/</span>
            <Link href="/calories" className="hover:text-gray-300">Food Calories</Link>
            <span>/</span>
            <Link href={`/calories#${categoryAnchor(food.category)}`} className="hover:text-gray-300">{food.category}</Link>
            <span>/</span>
            <span className="text-gray-400">{food.name}</span>
          </nav>

          <h1 className="text-3xl md:text-5xl font-extrabold leading-tight text-white">
            Calories in{' '}
            <span className="bg-gradient-to-r from-brand-blue to-brand-gold bg-clip-text text-transparent">{food.name}</span>
          </h1>

          <p id="food-answer" className="mt-4 max-w-3xl text-gray-300 md:text-lg leading-relaxed">{answer}</p>

          {featuredIn.length > 0 && (
            <p className="mt-4 text-sm text-gray-400">
              Featured in:{' '}
              {featuredIn.map((l, i) => (
                <span key={l.slug}>
                  {i > 0 && ', '}
                  <Link href={`/calories/lists/${l.slug}`} className="text-brand-blue hover:underline">{l.name}</Link>
                </span>
              ))}
            </p>
          )}

          {comparisons.length > 0 && (
            <p className="mt-2 text-sm text-gray-400">
              Compare:{' '}
              {comparisons.map((c, i) => (
                <span key={c.slug}>
                  {i > 0 && ', '}
                  <Link href={`/calories/compare/${c.slug}`} className="text-brand-blue hover:underline">{pairTitle(c)}</Link>
                </span>
              ))}
            </p>
          )}

          {tags.length > 0 && (
            <div className="mt-5 flex flex-wrap gap-2">
              {tags.map((t) => (
                <span key={t.label} className={`rounded-full border px-3 py-1 text-xs font-semibold ${toneClass[t.tone]}`}>{t.label}</span>
              ))}
            </div>
          )}

          {/* Key numbers for the household serving */}
          <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-3">
            {[
              { v: `${serving.kcal}`, u: 'kcal', l: 'Calories' },
              { v: `${serving.protein}`, u: 'g', l: 'Protein' },
              { v: `${serving.carbs}`, u: 'g', l: 'Carbs' },
              { v: `${serving.fat}`, u: 'g', l: 'Fat' },
            ].map((k) => (
              <div key={k.l} className="rounded-xl border border-white/10 bg-white/[0.03] p-4 text-center">
                <div className="text-2xl md:text-3xl font-bold text-brand-gold">{k.v}<span className="ml-1 text-sm font-medium text-gray-400">{k.u}</span></div>
                <div className="mt-1 text-xs text-gray-400">{k.l} · {s.label}</div>
              </div>
            ))}
          </div>

          {/* Macro split — meaningless for near-zero-calorie foods (black coffee) and alcohol (calories come from ethanol) */}
          {n.kcal >= 20 && !isAlcohol(food) && (
          <div className="mt-6">
            <div className="flex h-3 overflow-hidden rounded-full bg-white/5" role="img" aria-label={`Calories from carbs ${split.carbs}%, protein ${split.protein}%, fat ${split.fat}%`}>
              <div className="bg-brand-blue" style={{ width: `${split.carbs}%` }} />
              <div className="bg-emerald-400" style={{ width: `${split.protein}%` }} />
              <div className="bg-brand-gold" style={{ width: `${split.fat}%` }} />
            </div>
            <div className="mt-2 flex flex-wrap gap-4 text-xs text-gray-400">
              <span><span className="mr-1 inline-block h-2 w-2 rounded-full bg-brand-blue" />Carbs {split.carbs}%</span>
              <span><span className="mr-1 inline-block h-2 w-2 rounded-full bg-emerald-400" />Protein {split.protein}%</span>
              <span><span className="mr-1 inline-block h-2 w-2 rounded-full bg-brand-gold" />Fat {split.fat}%</span>
              <span className="text-gray-500">share of calories</span>
            </div>
          </div>
          )}
        </div>
      </section>

      {/* Calories by serving */}
      <section className="pb-12">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-2xl md:text-3xl font-bold text-white">{food.name} calories by serving size</h2>
          <div className="mt-5 overflow-x-auto rounded-xl border border-white/10">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-white/5 text-left text-gray-300">
                  <th className="px-4 py-3 font-semibold">Serving</th>
                  <th className="px-4 py-3 font-semibold text-right">Calories</th>
                  <th className="px-4 py-3 font-semibold text-right">Protein</th>
                  <th className="px-4 py-3 font-semibold text-right">Carbs</th>
                  <th className="px-4 py-3 font-semibold text-right">Fat</th>
                </tr>
              </thead>
              <tbody>
                {food.servings.map((sv) => {
                  const m = caloriesFor(food, sv.grams);
                  return (
                    <tr key={sv.label} className="border-t border-white/5 text-gray-300">
                      <td className="px-4 py-2.5 font-medium text-white">{sv.label}</td>
                      <td className="px-4 py-2.5 text-right font-semibold text-brand-gold">{m.kcal} kcal</td>
                      <td className="px-4 py-2.5 text-right">{m.protein} g</td>
                      <td className="px-4 py-2.5 text-right">{m.carbs} g</td>
                      <td className="px-4 py-2.5 text-right">{m.fat} g</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          <p className="mt-3 text-sm text-gray-400">
            Different quantity or a full meal?{' '}
            <Link href="/calorie-calculator" className="text-brand-blue hover:underline">Use the calorie calculator</Link>{' '}
            to add {food.name} alongside other foods. To see how it fits your day, find your{' '}
            <Link href="/tools/tdee-calculator" className="text-brand-blue hover:underline">maintenance calories</Link> and{' '}
            <Link href="/tools/protein-calculator" className="text-brand-blue hover:underline">protein target</Link>.
          </p>
        </div>
      </section>

      {/* Full nutrition facts */}
      <section className="pb-12">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-2xl md:text-3xl font-bold text-white">{food.name} nutrition facts</h2>
          <div className="mt-5 overflow-x-auto rounded-xl border border-white/10">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-white/5 text-left text-gray-300">
                  <th className="px-4 py-3 font-semibold">Nutrient</th>
                  <th className="px-4 py-3 font-semibold text-right">Per 100 g</th>
                  {s.grams !== 100 && <th className="px-4 py-3 font-semibold text-right">Per {s.label}</th>}
                </tr>
              </thead>
              <tbody>
                {nutrientRows.map((r) => (
                  <tr key={r.key} className="border-t border-white/5 text-gray-300">
                    <td className="px-4 py-2.5 font-medium text-white">{r.label}</td>
                    <td className="px-4 py-2.5 text-right">{n[r.key]} {r.unit}</td>
                    {s.grams !== 100 && <td className="px-4 py-2.5 text-right">{serving[r.key]} {r.unit}</td>}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="mt-3 text-xs text-gray-500">Source: {SOURCE_LABEL[food.source]}. Values are for the ready-to-eat form unless the name says raw or dry, and vary with recipe, oil and portion.</p>
        </div>
      </section>

      {/* Coach's take */}
      <section className="pb-12">
        <div className="max-w-4xl mx-auto px-4">
          <div className="rounded-2xl border border-brand-blue/20 bg-brand-navy-light p-6 md:p-8">
            <h2 className="text-2xl font-bold text-white">Coach&apos;s take: is {food.name} healthy?</h2>
            <ul id="coach-take" className="mt-4 space-y-3 text-gray-300 leading-relaxed">
              {take.map((t, i) => (
                <li key={i} className="flex gap-3"><span className="mt-1 text-brand-gold">●</span><span>{t}</span></li>
              ))}
            </ul>
            {serving.kcal >= 20 && (
              <p className="mt-5 text-sm text-gray-400">
                <span className="font-semibold text-white">To burn it off:</span> {s.label} ({serving.kcal} kcal) takes about {burn.walk} min of brisk walking or {burn.run} min of running for a 70 kg adult.
              </p>
            )}
          </div>
        </div>
      </section>

      {/* Lighter swaps + similar foods (internal linking) */}
      <section className="pb-12">
        <div className="max-w-4xl mx-auto px-4 grid gap-8 md:grid-cols-2">
          {swaps.length > 0 && (
            <div>
              <h2 className="text-xl font-bold text-white">Lighter swaps in {food.category}</h2>
              <ul className="mt-4 space-y-2">
                {swaps.map((f) => (
                  <li key={f.slug}>
                    <Link href={`/calories/${f.slug}`} className="flex items-center justify-between rounded-lg border border-white/10 px-4 py-2.5 text-sm text-gray-300 hover:border-brand-blue/50 hover:text-white">
                      <span>{f.name}</span><span className="text-brand-gold">{f.per100g.kcal} kcal/100 g</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}
          <div className={swaps.length > 0 ? '' : 'md:col-span-2'}>
            <h2 className="text-xl font-bold text-white">Compare with similar foods</h2>
            <ul className="mt-4 space-y-2">
              {similar.map((f) => (
                <li key={f.slug}>
                  <Link href={`/calories/${f.slug}`} className="flex items-center justify-between rounded-lg border border-white/10 px-4 py-2.5 text-sm text-gray-300 hover:border-brand-blue/50 hover:text-white">
                    <span>Calories in {f.name}</span><span className="text-brand-gold">{f.per100g.kcal} kcal/100 g</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* FAQ — mirrors FAQPage schema exactly */}
      <section className="pb-12">
        <div className="max-w-3xl mx-auto px-4">
          <h2 className="text-2xl md:text-3xl font-bold text-white">{food.name}: frequently asked questions</h2>
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

      {/* CTA */}
      <section className="pb-16">
        <div className="max-w-3xl mx-auto px-4">
          <div className="rounded-2xl border border-brand-blue/20 bg-gradient-to-r from-brand-blue/10 to-brand-navy-light p-6 text-center">
            <h2 className="text-xl md:text-2xl font-bold text-white">Want to know how much {food.name} fits your goal?</h2>
            <p className="mx-auto mt-2 max-w-xl text-sm text-gray-300">
              Calories tell you what you eat. A plan tells you what to eat. Get an Indian diet + workout plan built around your body, routine and goal by NASM-certified Coach Himanshu.
            </p>
            <div className="mt-5 flex flex-wrap justify-center gap-3">
              <a href={WHATSAPP_CONSULT} target="_blank" rel="noopener noreferrer" className="rounded-xl bg-gradient-to-r from-brand-blue to-blue-500 px-6 py-3 font-semibold text-white shadow-lg shadow-brand-blue/25 hover:-translate-y-0.5 transition-transform">
                Get a free consultation
              </a>
              <Link href="/plans" className="rounded-xl border border-white/15 px-6 py-3 font-semibold text-white hover:bg-white/5 transition-colors">
                View coaching plans
              </Link>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
