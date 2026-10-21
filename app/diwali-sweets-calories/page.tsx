import type { Metadata } from 'next';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import AnnouncementBar from '@/components/AnnouncementBar';
import ConsultationForm from '@/components/ConsultationForm';
import Diya from '@/components/diwali/Diya';
import DiwaliSaleNote from '@/components/diwali/DiwaliSaleNote';
import {
  BOWL_SWEETS,
  BOX,
  BOX_GRAMS,
  DIWALI_FAQS,
  DIWALI_UPDATED,
  DIWALI_UPDATED_LABEL,
  DIWALI_URL,
  FACTS,
  SNACKS,
  SWAPS,
  SWEETS,
  WALK_KG,
  WHO_SUGAR_IDEAL_G,
  type DiwaliRow,
} from '@/lib/diwaliGuide';

const WHATSAPP_CONSULT =
  'https://wa.me/917303484648?text=Hi%20Coach%20Himanshu!%20I%20read%20your%20Diwali%20calories%20guide%20and%20want%20a%20free%20consultation.';

const title = 'Diwali Sweets Calories: Kaju Katli, Gulab Jamun & More';
const description = `Calories in Diwali sweets and snacks: kaju katli ${FACTS.kajuKatli.kcal} kcal a piece, gulab jamun ${FACTS.gulabJamun.kcal}, a ${BOX_GRAMS} g mithai box ${BOX.kcal.toLocaleString('en-IN')}. Lighter swaps and a festive-week plan.`;

export const metadata: Metadata = {
  title,
  description,
  keywords: [
    'diwali sweets calories',
    'calories in kaju katli',
    'gulab jamun calories',
    'soan papdi calories',
    'how to avoid weight gain during diwali',
    'healthy diwali sweets',
    'diwali diet tips',
    'mithai calories',
  ],
  openGraph: { title: `${title} | Coach Himanshu`, description, url: DIWALI_URL, type: 'article', images: ['/opengraph-image'] },
  twitter: { card: 'summary_large_image', title: `${title} | Coach Himanshu`, description },
  alternates: { canonical: DIWALI_URL },
};

const th = 'py-3 px-4 text-left text-xs font-semibold uppercase tracking-wide text-gray-400';
const td = 'py-3 px-4 text-sm text-gray-200';

function FoodTable({ rows, caption }: { rows: DiwaliRow[]; caption: string }) {
  return (
    <div className="mt-4 overflow-x-auto rounded-xl border border-white/10">
      <table className="w-full min-w-[560px]">
        <caption className="sr-only">{caption}</caption>
        <thead className="bg-white/[0.03]">
          <tr>
            <th className={th}>Food</th>
            <th className={th}>Serving</th>
            <th className={th}>Calories</th>
            <th className={th}>Sugar</th>
            <th className={th}>Per 100 g</th>
            <th className={th}>Brisk walk to burn</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-white/5">
          {rows.map((r) => (
            <tr key={r.slug}>
              <td className={td}>
                <Link href={`/calories/${r.slug}`} className="font-medium text-white hover:text-brand-blue">
                  {r.name}
                </Link>
              </td>
              <td className={`${td} text-gray-400`}>{r.serving}</td>
              <td className={`${td} font-semibold text-white`}>{r.kcal} kcal</td>
              <td className={td}>{r.sugar} g</td>
              <td className={`${td} text-gray-400`}>{r.per100} kcal</td>
              <td className={td}>~{r.walkMin} min</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default function DiwaliSweetsCaloriesPage() {
  const articleSchema = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    '@id': `${DIWALI_URL}#article`,
    headline: title,
    description,
    url: DIWALI_URL,
    inLanguage: 'en',
    datePublished: DIWALI_UPDATED,
    dateModified: DIWALI_UPDATED,
    isPartOf: { '@id': 'https://coachhimanshu.com/#website' },
    author: { '@type': 'Person', '@id': 'https://coachhimanshu.com/#coach', name: 'Coach Himanshu' },
    publisher: { '@id': 'https://coachhimanshu.com/#organization' },
    about: [
      { '@type': 'Thing', name: 'Diwali sweets' },
      { '@type': 'Thing', name: 'Calories' },
    ],
    speakable: { '@type': 'SpeakableSpecification', cssSelector: ['#diwali-answer'] },
    mainEntity: {
      '@type': 'ItemList',
      name: 'Calories per piece of common Diwali sweets',
      itemListElement: SWEETS.map((r, i) => ({
        '@type': 'ListItem',
        position: i + 1,
        name: `${r.name}: ${r.kcal} kcal per ${r.serving}`,
        url: `https://coachhimanshu.com/calories/${r.slug}`,
      })),
    },
  };

  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: DIWALI_FAQS.map((f) => ({
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
      { '@type': 'ListItem', position: 2, name: 'Food Calories', item: 'https://coachhimanshu.com/calories' },
      { '@type': 'ListItem', position: 3, name: 'Diwali Sweets Calories', item: DIWALI_URL },
    ],
  };

  return (
    <div className="min-h-screen bg-brand-navy">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <AnnouncementBar />
      <Navbar />

      {/* Answer first */}
      <section className="relative pt-28 pb-8 md:pt-36 md:pb-10">
        <div className="max-w-4xl mx-auto px-4">
          <nav className="mb-4 text-xs text-gray-500" aria-label="Breadcrumb">
            <Link href="/" className="hover:text-gray-300">Home</Link>
            <span className="mx-1.5">/</span>
            <Link href="/calories" className="hover:text-gray-300">Food Calories</Link>
            <span className="mx-1.5">/</span>
            <span className="text-gray-400">Diwali Sweets</span>
          </nav>
          <div className="flex items-start gap-4">
            <h1 className="flex-1 text-3xl md:text-5xl font-extrabold leading-tight text-white">
              Calories in <span className="text-amber-300">Diwali Sweets</span> &amp; Snacks
            </h1>
            <Diya size={64} className="hidden shrink-0 sm:block" />
          </div>
          <p className="mt-3 text-sm text-gray-500">
            Updated <time dateTime={DIWALI_UPDATED}>{DIWALI_UPDATED_LABEL}</time> · By Coach Himanshu, NASM certified ·
            Figures from Indian food composition data
          </p>

          <div id="diwali-answer" className="mt-6 rounded-2xl border border-amber-400/25 bg-brand-navy-light p-5 md:p-6">
            <p className="text-gray-200 md:text-lg leading-relaxed">
              A single piece of Diwali mithai has{' '}
              <strong className="text-white">
                {FACTS.pieceRange[0]}–{FACTS.pieceRange[1]} kcal
              </strong>
              , and a typical piece is about {FACTS.typicalPiece} kcal. One kaju katli is about{' '}
              <strong className="text-white">{FACTS.kajuKatli.kcal} kcal</strong>, a gulab jamun about{' '}
              <strong className="text-white">{FACTS.gulabJamun.kcal} kcal</strong> and a besan laddoo about{' '}
              <strong className="text-white">{FACTS.besanLaddu.kcal} kcal</strong>. A whole {BOX_GRAMS} g box of mixed
              mithai is roughly <strong className="text-white">{BOX.kcal.toLocaleString('en-IN')} kcal</strong>, more than
              a day&apos;s calories for many adults.
            </p>
          </div>

          <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-3">
            {[
              { value: `${FACTS.lightestPiece.kcal} kcal`, label: `${FACTS.lightestPiece.name}: lightest piece` },
              { value: `${FACTS.heaviestPiece.kcal} kcal`, label: `${FACTS.heaviestPiece.name}: heaviest piece` },
              { value: `${BOX.sugar} g sugar`, label: `In a ${BOX_GRAMS} g mithai box` },
            ].map((s) => (
              <div key={s.label} className="rounded-xl border border-white/10 bg-brand-navy-light p-4">
                <div className="text-xl font-bold text-white">{s.value}</div>
                <div className="mt-1 text-xs text-gray-400">{s.label}</div>
              </div>
            ))}
          </div>

          <DiwaliSaleNote />
        </div>
      </section>

      {/* Sweets */}
      <section className="pb-12">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-2xl md:text-3xl font-bold text-white">Diwali sweets: calories per piece</h2>
          <p className="mt-2 text-gray-400">
            Sorted from lightest to heaviest piece. Brisk-walk minutes are for a {WALK_KG} kg adult at about 4.3 kcal a
            minute; lighter people take longer, heavier people less.
          </p>
          <FoodTable rows={SWEETS} caption="Calories per piece of Diwali sweets" />
          <p className="mt-4 text-sm text-gray-400">
            <strong className="text-gray-200">Per piece vs per 100 g.</strong> {FACTS.kajuKatli.name} is the lightest piece
            only because pieces are thin: per 100 g it has {FACTS.kajuKatli.per100} kcal. {FACTS.lightestPer100.name} is the
            lightest per gram ({FACTS.lightestPer100.per100} kcal per 100 g), and {FACTS.densestPer100.name} the densest (
            {FACTS.densestPer100.per100} kcal).
          </p>

          <h3 className="mt-8 text-xl font-semibold text-white">Halwa and kheer, by the katori</h3>
          <FoodTable rows={BOWL_SWEETS} caption="Calories per katori of halwa and kheer" />
        </div>
      </section>

      {/* Snacks */}
      <section className="pb-12">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-2xl md:text-3xl font-bold text-white">Namkeen, fried snacks and dry fruits</h2>
          <p className="mt-2 text-gray-400">
            Savoury snacks carry little sugar but a lot of fat and salt, and they are easy to eat by the handful while
            visiting. A katori of namkeen ({FACTS.namkeen.kcal} kcal) is more than most single sweets.
          </p>
          <FoodTable rows={SNACKS} caption="Calories in Diwali snacks and dry fruits" />
        </div>
      </section>

      {/* Sugar */}
      <section className="pb-12">
        <div className="max-w-4xl mx-auto px-4">
          <div className="rounded-2xl border border-white/10 bg-brand-navy-light p-5 md:p-6">
            <h2 className="text-xl md:text-2xl font-bold text-white">The sugar side</h2>
            <p className="mt-2 text-gray-300 leading-relaxed">
              The WHO advises keeping free (added) sugars under 10% of daily calories, and ideally under 5%, about{' '}
              {WHO_SUGAR_IDEAL_G} g a day. One gulab jamun has {FACTS.gulabJamun.sugar} g and one besan laddoo{' '}
              {FACTS.besanLaddu.sugar} g, so a single sweet can use most of that ideal limit. If you have diabetes or
              prediabetes, plan sweets with your doctor and pair them with a meal rather than eating them alone.
            </p>
          </div>
        </div>
      </section>

      {/* Swaps */}
      <section className="pb-12">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-2xl md:text-3xl font-bold text-white">Lighter swaps that still feel festive</h2>
          <p className="mt-2 text-gray-400">
            Every swap here is lighter per serving and no denser per 100 g, so you are not just eating a smaller piece of
            something heavier.
          </p>
          <div className="mt-5 grid grid-cols-1 gap-3 md:grid-cols-2">
            {SWAPS.map((s) => (
              <div key={s.from.slug} className="rounded-xl border border-white/10 bg-brand-navy-light p-5">
                <div className="flex flex-wrap items-baseline gap-x-2 text-white">
                  <Link href={`/calories/${s.from.slug}`} className="font-semibold hover:text-brand-blue">{s.from.name}</Link>
                  <span className="text-gray-500">→</span>
                  <Link href={`/calories/${s.to.slug}`} className="font-semibold hover:text-brand-blue">{s.to.name}</Link>
                </div>
                <div className="mt-1 text-sm text-gray-400">
                  {s.from.kcal} → {s.to.kcal} kcal per serving ·{' '}
                  <span className="font-semibold text-emerald-400">saves {s.saves} kcal ({s.savesPct}%)</span>
                </div>
                <p className="mt-2 text-sm text-gray-300">{s.why}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Festive week */}
      <section className="pb-12">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-2xl md:text-3xl font-bold text-white">How to enjoy Diwali without gaining weight</h2>
          <ol className="mt-4 space-y-3 text-gray-300">
            <li>
              <strong className="text-white">Pick your sweets, then enjoy them.</strong> One or two pieces a day (about{' '}
              {FACTS.typicalPiece}–{FACTS.typicalPiece * 2} kcal) fits most fat-loss plans. Choose the ones you really
              love; skip the ones you eat only because the box is open.
            </li>
            <li>
              <strong className="text-white">Eat protein before you visit.</strong> Paneer, dal, eggs, curd or chicken at
              home makes it much easier to stop at one sweet. Check your needs with the{' '}
              <Link href="/tools/protein-calculator" className="text-brand-blue hover:underline">protein calculator</Link>.
            </li>
            <li>
              <strong className="text-white">Namkeen goes in a katori.</strong> Never eat from the packet. One katori is
              about {FACTS.namkeen.kcal} kcal; the packet can be several times that.
            </li>
            <li>
              <strong className="text-white">Walk after the big meals.</strong> A 15–20 minute walk after lunch and dinner
              helps with blood sugar and makes up for a sweet or two.
            </li>
            <li>
              <strong className="text-white">Keep training, even shorter.</strong> Two or three 30-minute sessions in the
              festival week keep the habit alive. Skipping the whole week is what makes restarting hard.
            </li>
            <li>
              <strong className="text-white">Give the box away.</strong> Share gift boxes instead of keeping them all at
              home. A {BOX_GRAMS} g box is about {BOX.kcal.toLocaleString('en-IN')} kcal sitting on your table.
            </li>
            <li>
              <strong className="text-white">Back to normal after Bhai Dooj.</strong> Weight that jumps after the festival
              is often largely water and salt from heavier food. Your normal routine for a week usually brings it back down.
            </li>
          </ol>
          <p className="mt-5 text-sm text-gray-400">
            Want exact numbers for your day? Find your maintenance calories with the{' '}
            <Link href="/tools/tdee-calculator" className="text-brand-blue hover:underline">TDEE calculator</Link>, look up anything
            else in the <Link href="/calories" className="text-brand-blue hover:underline">food calorie library</Link>, or
            follow a full <Link href="/diet-plans" className="text-brand-blue hover:underline">Indian diet plan</Link>.
          </p>
        </div>
      </section>

      {/* FAQ */}
      <section className="pb-12">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-2xl md:text-3xl font-bold text-white">Diwali calories: common questions</h2>
          <div className="mt-5 space-y-3">
            {DIWALI_FAQS.map((f) => (
              <details key={f.question} className="group rounded-xl border border-white/10 bg-brand-navy-light p-5">
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
            <h2 className="text-xl md:text-2xl font-bold text-white">Want a plan that already includes Diwali?</h2>
            <p className="mx-auto mt-2 max-w-xl text-sm text-gray-300">
              Coach Himanshu builds Indian diet plans around festivals, not against them. Tell him your goal in a free
              consultation.
            </p>
            <div className="mt-5 flex flex-wrap justify-center gap-3">
              <a
                href={WHATSAPP_CONSULT}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-xl bg-gradient-to-r from-brand-blue to-blue-500 px-6 py-3 font-semibold text-white shadow-lg shadow-brand-blue/25 hover:-translate-y-0.5 transition-transform"
              >
                Free consultation on WhatsApp
              </a>
              <Link href="/plans" className="rounded-xl border border-white/15 px-6 py-3 font-semibold text-white hover:bg-white/5 transition-colors">
                See all plans
              </Link>
            </div>
          </div>
          <div className="mt-8">
            <ConsultationForm source="Diwali calories guide" whatsappHref={WHATSAPP_CONSULT} />
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
