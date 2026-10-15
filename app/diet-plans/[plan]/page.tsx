import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import AnnouncementBar from '@/components/AnnouncementBar';
import ConsultationForm from '@/components/ConsultationForm';
import {
  DIET_LABEL,
  DIET_PLANS,
  DIET_PLANS_BASE,
  EXAMPLE_AGE,
  getDietPlan,
  kcalLabel,
  macroShare,
  planFaqs,
  planIssues,
  planTitle,
  r0,
  sibling,
  examplePeople,
  listJoin,
  proteinFoods,
} from '@/lib/dietPlans';

const WHATSAPP_DIET =
  'https://wa.me/917303484648?text=Hi%20Coach%20Himanshu!%20I%20saw%20your%20diet%20plan%20and%20want%20a%20personalised%20one.';

export function generateStaticParams() {
  const issues = planIssues();
  if (issues.length) throw new Error(`Diet plans off target:\n${issues.join('\n')}`);
  return DIET_PLANS.map((p) => ({ plan: p.slug }));
}

export function generateMetadata({ params }: { params: { plan: string } }): Metadata {
  const p = getDietPlan(params.plan);
  if (!p) return {};
  const title = `${planTitle(p)} (Full Day Chart)`;
  const description = `A ${p.kcal} calorie ${DIET_LABEL[p.diet].toLowerCase()} Indian diet chart: 6 meals with exact portions, about ${r0(
    p.totals.protein,
  )} g protein a day. Every number computed from Indian food data.`;
  const url = `${DIET_PLANS_BASE}/${p.slug}`;
  return {
    title,
    description,
    keywords: [
      `${p.kcal} calorie diet plan`,
      `${p.kcal} calorie indian diet plan`,
      `${p.kcal} calorie ${p.diet === 'veg' ? 'vegetarian' : 'non veg'} diet plan`,
      `${p.kcal} kcal diet chart`,
      'indian diet plan for weight loss',
    ],
    openGraph: { title: `${title} | Coach Himanshu`, description, url, type: 'article', images: ['/opengraph-image'] },
    twitter: { card: 'summary_large_image', title: `${title} | Coach Himanshu`, description },
    alternates: { canonical: url },
  };
}

const th = 'py-2.5 px-4 text-left text-xs font-semibold uppercase tracking-wide text-gray-400';
const td = 'py-2.5 px-4 text-sm text-gray-200 align-top';

export default function DietPlanPage({ params }: { params: { plan: string } }) {
  const p = getDietPlan(params.plan);
  if (!p) notFound();

  const url = `${DIET_PLANS_BASE}/${p.slug}`;
  const title = planTitle(p);
  const t = p.totals;
  const share = macroShare(t);
  const faqs = planFaqs(p);
  const other = sibling(p);
  const people = examplePeople(p).slice(0, 3);
  const nearby = DIET_PLANS.filter((x) => x.diet === p.diet && x.kcal !== p.kcal);

  const articleSchema = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    '@id': `${url}#article`,
    headline: title,
    url,
    inLanguage: 'en',
    isPartOf: { '@id': 'https://coachhimanshu.com/#website' },
    author: { '@type': 'Person', '@id': 'https://coachhimanshu.com/#coach', name: 'Coach Himanshu' },
    publisher: { '@id': 'https://coachhimanshu.com/#organization' },
    about: [
      { '@type': 'Thing', name: `${p.kcal} calorie diet` },
      { '@type': 'Thing', name: `${DIET_LABEL[p.diet]} Indian diet` },
    ],
    speakable: { '@type': 'SpeakableSpecification', cssSelector: ['#plan-answer'] },
  };
  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((f) => ({ '@type': 'Question', name: f.question, acceptedAnswer: { '@type': 'Answer', text: f.answer } })),
  };
  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://coachhimanshu.com' },
      { '@type': 'ListItem', position: 2, name: 'Indian Diet Plans', item: DIET_PLANS_BASE },
      { '@type': 'ListItem', position: 3, name: title, item: url },
    ],
  };

  return (
    <div className="min-h-screen bg-brand-navy">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <AnnouncementBar />
      <Navbar />

      <section className="relative pt-28 pb-8 md:pt-36">
        <div className="max-w-4xl mx-auto px-4">
          <nav className="mb-4 text-xs text-gray-500" aria-label="Breadcrumb">
            <Link href="/" className="hover:text-gray-300">Home</Link>
            <span className="mx-1.5">/</span>
            <Link href="/diet-plans" className="hover:text-gray-300">Indian Diet Plans</Link>
            <span className="mx-1.5">/</span>
            <span className="text-gray-400">{p.kcal} kcal {p.diet === 'veg' ? 'veg' : 'non-veg'}</span>
          </nav>
          <h1 className="text-3xl md:text-5xl font-extrabold leading-tight text-white">
            {kcalLabel(p.kcal)} Calorie{' '}
            <span className="bg-gradient-to-r from-brand-blue to-brand-gold bg-clip-text text-transparent">
              {DIET_LABEL[p.diet]}
            </span>{' '}
            Indian Diet Plan
          </h1>
          <p className="mt-3 text-sm text-gray-500">By Coach Himanshu, NASM certified · Best for: {p.goal.toLowerCase()}</p>

          <p id="plan-answer" className="mt-6 text-gray-200 md:text-lg leading-relaxed">
            This one-day {DIET_LABEL[p.diet].toLowerCase()} Indian diet chart adds up to{' '}
            <strong className="text-white">{kcalLabel(t.kcal)} calories</strong> across 6 meals, with about{' '}
            <strong className="text-white">{r0(t.protein)} g protein</strong>, {r0(t.carbs)} g carbs, {r0(t.fat)} g fat and{' '}
            {r0(t.fiber)} g fibre. Protein comes from {listJoin(proteinFoods(p))}, with roti, sabzi and fruit, in portions
            you can measure with a katori.
          </p>

          <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
            {[
              { v: kcalLabel(t.kcal), l: 'Calories' },
              { v: `${r0(t.protein)} g`, l: `Protein (${share.protein}%)` },
              { v: `${r0(t.carbs)} g`, l: `Carbs (${share.carbs}%)` },
              { v: `${r0(t.fat)} g`, l: `Fat (${share.fat}%)` },
            ].map((s) => (
              <div key={s.l} className="rounded-xl border border-white/10 bg-brand-navy-light p-4 text-center">
                <div className="text-xl md:text-2xl font-bold text-brand-gold">{s.v}</div>
                <div className="mt-1 text-xs text-gray-400">{s.l}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* The chart */}
      <section className="pb-12">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-2xl md:text-3xl font-bold text-white">The full-day diet chart</h2>
          <div className="mt-5 space-y-4">
            {p.meals.map((m) => (
              <div key={m.meal} className="overflow-x-auto rounded-xl border border-white/10">
                <div className="flex flex-wrap items-baseline justify-between gap-2 bg-white/[0.03] px-4 py-3">
                  <h3 className="font-semibold text-white">
                    {m.meal} <span className="ml-1 text-sm font-normal text-gray-500">{m.time}</span>
                  </h3>
                  <span className="text-sm text-brand-gold">
                    {r0(m.totals.kcal)} kcal · {r0(m.totals.protein)} g protein
                  </span>
                </div>
                <table className="w-full min-w-[420px]">
                  <thead>
                    <tr>
                      <th className={th}>Food</th>
                      <th className={th}>Portion</th>
                      <th className={th}>Calories</th>
                      <th className={th}>Protein</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/[0.05]">
                    {m.items.map((it) => (
                      <tr key={it.food.slug}>
                        <td className={td}>
                          <Link href={`/calories/${it.food.slug}`} className="text-white hover:text-brand-blue">
                            {it.food.name}
                          </Link>
                        </td>
                        <td className={td}>{it.label}</td>
                        <td className={td}>{r0(it.totals.kcal)}</td>
                        <td className={td}>{Math.round(it.totals.protein * 10) / 10} g</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ))}
          </div>
          <p className="mt-3 text-sm text-gray-400">
            Calories for cooked dishes are home-style values that include typical cooking oil. Tap any food for its full
            nutrition.
          </p>
        </div>
      </section>

      {/* Who it suits */}
      {people.length > 0 && (
        <section className="pb-12">
          <div className="max-w-4xl mx-auto px-4">
            <h2 className="text-2xl md:text-3xl font-bold text-white">Who {kcalLabel(p.kcal)} calories a day suits</h2>
            <p className="mt-2 text-gray-400">
              Worked out with the Mifflin-St Jeor formula for a {EXAMPLE_AGE}-year-old. Your own number depends on your
              height, weight, age and activity.
            </p>
            <ul className="mt-4 space-y-2 text-gray-300">
              {people.map((x) => (
                <li key={`${x.sex}-${x.kind}`} className="rounded-xl border border-white/10 bg-brand-navy-light p-4 text-sm">
                  A {x.activity} {x.sex === 'female' ? 'woman' : 'man'} of {x.heightCm} cm and about {x.weightKg} kg burns roughly{' '}
                  {kcalLabel(x.maintenance)} kcal a day.{' '}
                  {x.kind === 'deficit'
                    ? `For them, ${kcalLabel(p.kcal)} kcal is a ${kcalLabel(x.maintenance - p.kcal)} kcal deficit, about 0.5 kg of fat loss a week.`
                    : `For them, ${kcalLabel(p.kcal)} kcal is maintenance: weight stays steady.`}
                </li>
              ))}
            </ul>
            <p className="mt-4 text-sm">
              <Link href="/tools/calorie-deficit-calculator" className="text-brand-blue hover:underline">
                Work out your own calorie target →
              </Link>
            </p>
          </div>
        </section>
      )}

      {/* Other plans */}
      <section className="pb-12">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-2xl md:text-3xl font-bold text-white">Other calorie targets</h2>
          <div className="mt-4 flex flex-wrap gap-2">
            {other && (
              <Link
                href={`/diet-plans/${other.slug}`}
                className="rounded-full border border-brand-gold/40 px-4 py-2 text-sm text-brand-gold hover:bg-brand-gold/10"
              >
                {p.kcal} kcal {DIET_LABEL[other.diet].toLowerCase()} version
              </Link>
            )}
            {nearby.map((x) => (
              <Link
                key={x.slug}
                href={`/diet-plans/${x.slug}`}
                className="rounded-full border border-white/15 px-4 py-2 text-sm text-gray-200 hover:bg-white/5"
              >
                {x.kcal} kcal {x.diet === 'veg' ? 'veg' : 'non-veg'}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="pb-12">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-2xl md:text-3xl font-bold text-white">Questions about this plan</h2>
          <div className="mt-5 space-y-3">
            {faqs.map((f) => (
              <details key={f.question} className="rounded-xl border border-white/10 bg-brand-navy-light p-5">
                <summary className="cursor-pointer list-none font-semibold text-white">{f.question}</summary>
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
            <h2 className="text-xl md:text-2xl font-bold text-white">Want a plan built for your body?</h2>
            <p className="mx-auto mt-2 max-w-xl text-sm text-gray-300">
              This chart is a starting point. Coach Himanshu builds your diet around your own calorie target, the food you
              actually eat, your work hours and any conditions like PCOS or thyroid, then adjusts it every week.
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
          <div className="mt-8">
            <ConsultationForm source={`Diet plan page: ${title}`} whatsappHref={WHATSAPP_DIET} />
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
