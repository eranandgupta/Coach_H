import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import AnnouncementBar from '@/components/AnnouncementBar';
import type { FoodNutrients } from '@/lib/foods';
import { caloriesFor } from '@/lib/nutrition';
import { CALORIES_BASE, servingText } from '@/lib/foodPages';
import {
  COMPARE_BASE,
  FOOD_PAIRS,
  answerSentence,
  bottomLine,
  compareFaqs,
  compareServing,
  getAllPairSlugs,
  getPairBySlug,
  gramsFor100kcal,
  microHighlights,
  pairMetaTitle,
  pairTitle,
  pairsForFood,
  verdicts,
  type Winner,
} from '@/lib/foodCompare';

const WHATSAPP_CONSULT =
  'https://wa.me/917303484648?text=Hi%20Coach%20Himanshu!%20I%20want%20a%20personalised%20diet%20plan.';

export function generateStaticParams() {
  return getAllPairSlugs().map((pair) => ({ pair }));
}

export async function generateMetadata({ params }: { params: { pair: string } }): Promise<Metadata> {
  const pair = getPairBySlug(params.pair);
  if (!pair) return { title: 'Not Found' };
  const url = `${COMPARE_BASE}/${pair.slug}`;
  const title = pairMetaTitle(pair);
  const a = pair.foodA.per100g;
  const b = pair.foodB.per100g;
  const description = `${pairTitle(pair)} compared per 100 g and per serving: ${a.kcal} vs ${b.kcal} kcal, ${a.protein} vs ${b.protein} g protein, fibre and more, plus which is better for weight loss.`;
  const lowerA = pair.nameA.toLowerCase();
  const lowerB = pair.nameB.toLowerCase();
  return {
    title,
    description,
    keywords: [
      `${lowerA} vs ${lowerB}`,
      `${lowerB} vs ${lowerA}`,
      `${lowerA} or ${lowerB} for weight loss`,
      `${lowerA} vs ${lowerB} calories`,
      `${lowerA} vs ${lowerB} protein`,
      `which is better ${lowerA} or ${lowerB}`,
    ],
    openGraph: { title: `${title} | Coach Himanshu`, description, url, type: 'article' },
    twitter: { card: 'summary_large_image', title: `${title} | Coach Himanshu`, description },
    alternates: { canonical: url },
  };
}

const ROWS: { key: keyof FoodNutrients; label: string; unit: string; lowerIsBetter?: boolean }[] = [
  { key: 'kcal', label: 'Calories', unit: 'kcal', lowerIsBetter: true },
  { key: 'protein', label: 'Protein', unit: 'g' },
  { key: 'carbs', label: 'Carbohydrates', unit: 'g' },
  { key: 'fat', label: 'Fat', unit: 'g' },
  { key: 'fiber', label: 'Fibre', unit: 'g' },
  { key: 'sugar', label: 'Sugar', unit: 'g', lowerIsBetter: true },
  { key: 'sodium', label: 'Sodium', unit: 'mg', lowerIsBetter: true },
  { key: 'calcium', label: 'Calcium', unit: 'mg' },
  { key: 'iron', label: 'Iron', unit: 'mg' },
  { key: 'potassium', label: 'Potassium', unit: 'mg' },
  { key: 'vitaminC', label: 'Vitamin C', unit: 'mg' },
];

export default function FoodComparePage({ params }: { params: { pair: string } }) {
  const pair = getPairBySlug(params.pair);
  if (!pair) notFound();

  const { foodA, foodB, nameA, nameB } = pair;
  const url = `${COMPARE_BASE}/${pair.slug}`;
  const title = pairTitle(pair);
  const answer = answerSentence(pair);
  const vs = verdicts(pair);
  const micros = microHighlights(pair);
  const summary = bottomLine(pair);
  const faqs = compareFaqs(pair);
  const sA = compareServing(foodA);
  const sB = compareServing(foodB);
  const servA = caloriesFor(foodA, sA.grams);
  const servB = caloriesFor(foodB, sB.grams);
  const g100A = gramsFor100kcal(foodA);
  const g100B = gramsFor100kcal(foodB);
  const winnerName = (w: Winner) => (w === 'a' ? nameA : w === 'b' ? nameB : 'Tie');

  // Related comparisons: others featuring either food first, then the rest of the catalogue.
  const related = [
    ...pairsForFood(foodA.slug),
    ...pairsForFood(foodB.slug),
    ...FOOD_PAIRS,
  ].filter((p, i, arr) => p.slug !== pair.slug && arr.findIndex((x) => x.slug === p.slug) === i).slice(0, 8);

  const pageSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    '@id': `${url}#webpage`,
    url,
    name: pairMetaTitle(pair),
    description: answer,
    inLanguage: 'en',
    isPartOf: { '@id': 'https://coachhimanshu.com/#website' },
    author: { '@type': 'Person', '@id': 'https://coachhimanshu.com/#coach', name: 'Coach Himanshu' },
    publisher: { '@id': 'https://coachhimanshu.com/#organization' },
    citation: ['Indian Nutrient Databank (INDB)', 'Indian Food Composition Tables 2017 (NIN, ICMR)', 'USDA FoodData Central'],
    speakable: { '@type': 'SpeakableSpecification', cssSelector: ['#compare-answer', '#compare-bottom-line'] },
    about: [foodA, foodB].map((f) => ({
      '@type': 'Thing',
      name: f.name,
      url: `${CALORIES_BASE}/${f.slug}`,
    })),
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
      { '@type': 'ListItem', position: 3, name: 'Food Comparisons', item: COMPARE_BASE },
      { '@type': 'ListItem', position: 4, name: title, item: url },
    ],
  };

  const cell = (value: number, other: number, lowerIsBetter?: boolean) => {
    if (value === other) return 'text-gray-200';
    const better = lowerIsBetter ? value < other : value > other;
    return better ? 'font-semibold text-brand-gold' : 'text-gray-300';
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
            <Link href="/calories/compare" className="hover:text-gray-300">Compare</Link>
            <span>/</span>
            <span className="text-gray-400">{title}</span>
          </nav>
          <h1 className="text-3xl md:text-5xl font-extrabold leading-tight text-white">
            <span className="bg-gradient-to-r from-brand-blue to-brand-gold bg-clip-text text-transparent">{nameA}</span>
            {' vs '}
            <span className="bg-gradient-to-r from-brand-blue to-brand-gold bg-clip-text text-transparent">{nameB}</span>
          </h1>
          <p id="compare-answer" className="mt-4 max-w-3xl text-gray-300 md:text-lg leading-relaxed">{answer}</p>
        </div>
      </section>

      {/* Verdict cards */}
      <section className="pb-10">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-2xl md:text-3xl font-bold text-white">The verdict</h2>
          <div className="mt-5 grid gap-4 md:grid-cols-3">
            {vs.map((v) => (
              <div key={v.key} className="rounded-2xl border border-white/10 bg-brand-navy-light p-5">
                <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">{v.label}</p>
                <p className={`mt-2 text-xl font-bold ${v.winner === 'tie' ? 'text-gray-200' : 'text-brand-gold'}`}>
                  {v.tradeoff ? 'It depends' : winnerName(v.winner)}
                </p>
                <p className="mt-2 text-sm leading-relaxed text-gray-300">{v.text}</p>
              </div>
            ))}
          </div>
          <div className="mt-5 rounded-2xl border border-brand-blue/20 bg-brand-blue/5 p-5">
            <h3 className="font-bold text-white">Bottom line</h3>
            <p id="compare-bottom-line" className="mt-2 text-gray-300 leading-relaxed">{summary}</p>
          </div>
          {pair.note && (
            <div className="mt-4 rounded-2xl border border-brand-gold/20 bg-brand-gold/5 p-5">
              <h3 className="font-bold text-white">Good to know</h3>
              <p className="mt-2 text-gray-300 leading-relaxed">{pair.note}</p>
            </div>
          )}
        </div>
      </section>

      {/* Side-by-side table */}
      <section className="pb-10">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-2xl md:text-3xl font-bold text-white">Nutrition side by side</h2>
          <div className="mt-5 overflow-x-auto rounded-xl border border-white/10">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-white/5 text-left text-gray-300">
                  <th className="px-3 py-3 font-semibold">Per 100 g</th>
                  <th className="px-3 py-3 font-semibold text-right">
                    <Link href={`/calories/${foodA.slug}`} className="text-white hover:text-brand-blue">{nameA}</Link>
                  </th>
                  <th className="px-3 py-3 font-semibold text-right">
                    <Link href={`/calories/${foodB.slug}`} className="text-white hover:text-brand-blue">{nameB}</Link>
                  </th>
                </tr>
              </thead>
              <tbody>
                {ROWS.map((r) => {
                  const va = foodA.per100g[r.key];
                  const vb = foodB.per100g[r.key];
                  return (
                    <tr key={r.key} className="border-t border-white/5">
                      <td className="px-3 py-2.5 text-gray-400">{r.label}</td>
                      <td className={`px-3 py-2.5 text-right ${cell(va, vb, r.lowerIsBetter)}`}>{va} {r.unit}</td>
                      <td className={`px-3 py-2.5 text-right ${cell(vb, va, r.lowerIsBetter)}`}>{vb} {r.unit}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          <p className="mt-3 text-xs text-gray-500">
            Gold marks the better value for a typical fat-loss or general-health goal. Per 100 g of the ready-to-eat form.
            Sources: INDB, IFCT 2017 (NIN-ICMR) and USDA FoodData Central. Values vary with recipe and portion.
          </p>

          {/* Per serving */}
          <h3 className="mt-8 text-xl font-bold text-white">Per typical serving</h3>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            {[
              { f: foodA, name: nameA, s: sA, n: servA, g: g100A },
              { f: foodB, name: nameB, s: sB, n: servB, g: g100B },
            ].map(({ f, name, s, n, g }) => (
              <div key={f.slug} className="rounded-xl border border-white/10 bg-brand-navy-light p-5">
                <p className="text-sm text-gray-400">{name}, {servingText(s)}</p>
                <p className="mt-1 text-3xl font-extrabold text-white">{n.kcal} <span className="text-base font-semibold text-gray-400">kcal</span></p>
                <p className="mt-2 text-sm text-gray-300">
                  {n.protein} g protein · {n.carbs} g carbs · {n.fat} g fat · {n.fiber} g fibre
                </p>
                {g && <p className="mt-2 text-xs text-gray-500">100 kcal = about {g} g</p>}
                <Link href={`/calories/${f.slug}`} className="mt-3 inline-block text-sm text-brand-blue hover:underline">
                  Full nutrition for {name} →
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {micros.length > 0 && (
        <section className="pb-10">
          <div className="max-w-4xl mx-auto px-4">
            <h2 className="text-2xl font-bold text-white">Vitamins and minerals</h2>
            <ul className="mt-4 space-y-2">
              {micros.map((m) => (
                <li key={m} className="flex gap-3 text-gray-300">
                  <span className="mt-2 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-brand-blue" />
                  <span>{m}</span>
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}

      {/* How we decide */}
      <section className="pb-10">
        <div className="max-w-4xl mx-auto px-4">
          <div className="rounded-2xl border border-white/10 bg-brand-navy-light p-6">
            <h2 className="text-lg font-bold text-white">How we pick a winner</h2>
            <ul className="mt-3 space-y-1.5 text-sm text-gray-400">
              <li><strong className="text-gray-200">Weight loss:</strong> fewer calories per 100 g wins when the gap is 10% or more, unless the other food gives at least 1.5x the protein and fibre per calorie. When calories are close, more protein and fibre per calorie wins.</li>
              <li><strong className="text-gray-200">Protein:</strong> more protein per 100 kcal, which is what counts when you are on a calorie budget.</li>
              <li><strong className="text-gray-200">Fibre:</strong> more fibre per 100 kcal.</li>
            </ul>
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

      {/* Related comparisons */}
      <section className="pb-12">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-xl font-bold text-white">More food comparisons</h2>
          <div className="mt-4 grid gap-2 sm:grid-cols-2">
            {related.map((p) => (
              <Link key={p.slug} href={`/calories/compare/${p.slug}`} className="rounded-lg border border-white/10 px-4 py-2.5 text-sm text-gray-300 hover:border-brand-blue/50 hover:text-white">
                {pairTitle(p)}
              </Link>
            ))}
          </div>
          <Link href="/calories/compare" className="mt-4 inline-block text-sm text-brand-blue hover:underline">See all comparisons →</Link>
        </div>
      </section>

      {/* CTA */}
      <section className="pb-16">
        <div className="max-w-3xl mx-auto px-4">
          <div className="rounded-2xl border border-brand-blue/20 bg-gradient-to-r from-brand-blue/10 to-brand-navy-light p-6 text-center">
            <h2 className="text-xl md:text-2xl font-bold text-white">Stop guessing which food is better</h2>
            <p className="mx-auto mt-2 max-w-xl text-sm text-gray-300">
              Get an Indian diet plan with your exact portions of {nameA.toLowerCase()}, {nameB.toLowerCase()} and everything else you eat, built around your goal by NASM-certified Coach Himanshu.
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
