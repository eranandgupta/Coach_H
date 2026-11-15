import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import AnnouncementBar from '@/components/AnnouncementBar';
import SessionsCta from '@/components/SessionsCta';
import { MUSCLE_LABEL, WORKOUT_PLANS, ex, type ExerciseKey, type Muscle } from '@/lib/workoutPlans';
import {
  EQUIPMENT_LABEL,
  EXERCISES_BASE,
  EXERCISES_UPDATED,
  MUSCLE_PAGES,
  MUSCLE_SLUG,
  atHome,
  exerciseSlug,
  forMuscle,
  muscleBySlug,
  muscleTitle,
  plansUsing,
  shortName,
} from '@/lib/exerciseGuides';

export function generateStaticParams() {
  return MUSCLE_PAGES.map((m) => ({ muscle: MUSCLE_SLUG[m] }));
}

function counts(m: Muscle) {
  const f = forMuscle(m);
  const all = [...f.primary, ...f.secondary];
  return { f, all, home: all.filter(atHome), gym: all.filter((k) => !atHome(k)) };
}

export function generateMetadata({ params }: { params: { muscle: string } }): Metadata {
  const m = muscleBySlug(params.muscle);
  if (!m) return {};
  const t = muscleTitle(m);
  const { f, home } = counts(m);
  const title = `${t} Exercises: ${f.primary.length + f.secondary.length} Gym and Home Exercises`;
  const description = `The best ${t.toLowerCase()} exercises with step-by-step form: ${f.primary.slice(0, 4).map(shortName).join(', ')} and more. ${home.length} can be done at home. Free guide by a NASM-certified coach.`;
  const url = `${EXERCISES_BASE}/muscle/${MUSCLE_SLUG[m]}`;
  return {
    title,
    description,
    keywords: [`${t.toLowerCase()} exercises`, `${t.toLowerCase()} workout`, `${t.toLowerCase()} exercises at home`, `${t.toLowerCase()} exercises gym`, `best ${t.toLowerCase()} exercises`],
    openGraph: { title: `${title} | Coach Himanshu`, description, url, type: 'article', images: ['/opengraph-image'] },
    twitter: { card: 'summary_large_image', title: `${title} | Coach Himanshu`, description },
    alternates: { canonical: url },
  };
}

function Card({ k, role }: { k: ExerciseKey; role: string }) {
  const e = ex(k);
  return (
    <Link href={`/exercises/${exerciseSlug(k)}`} className="block rounded-xl border border-white/10 p-4 hover:border-brand-blue/50 transition-colors">
      <div className="flex items-baseline justify-between gap-2">
        <span className="font-semibold text-white">{shortName(k)}</span>
        <span className="shrink-0 text-xs text-gray-500">{EQUIPMENT_LABEL[e.equipment]}</span>
      </div>
      <div className="mt-1 text-xs text-brand-gold">{role}</div>
      <div className="mt-2 text-sm text-gray-400">{e.cue}</div>
    </Link>
  );
}

export default function MusclePage({ params }: { params: { muscle: string } }) {
  const m = muscleBySlug(params.muscle);
  if (!m) notFound();

  const t = muscleTitle(m);
  const url = `${EXERCISES_BASE}/muscle/${MUSCLE_SLUG[m]}`;
  const { f, all, home, gym } = counts(m);
  const role = (k: ExerciseKey) => (ex(k).primary.includes(m) ? 'Main work' : 'Helps');
  const plans = WORKOUT_PLANS.filter((p) => all.some((k) => plansUsing(k).some((u) => u.plan.slug === p.slug)));
  const others = MUSCLE_PAGES.filter((x) => x !== m);

  const faqs = [
    {
      question: `What are the best ${t.toLowerCase()} exercises?`,
      answer: `Exercises where the ${t.toLowerCase()} do the main work: ${f.primary.map(shortName).join(', ')}. Pick one or two you can load and progress steadily rather than doing all of them.`,
    },
    {
      question: `Can I train ${t.toLowerCase()} at home?`,
      answer: home.length
        ? `Yes. ${home.length} of the ${all.length} exercises here need only bodyweight or dumbbells: ${home.slice(0, 5).map(shortName).join(', ')}.`
        : `Most ${t.toLowerCase()} exercises here need gym equipment.`,
    },
    {
      question: `How often should I train ${t.toLowerCase()}?`,
      answer: 'Twice a week suits most people. The NHS advises strengthening activities that work all the major muscle groups on at least 2 days a week, and every free workout plan on this site trains each one at least that often.',
    },
  ];

  const itemList = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    '@id': `${url}#list`,
    name: `${t} exercises`,
    numberOfItems: all.length,
    itemListElement: all.map((k, i) => ({ '@type': 'ListItem', position: i + 1, name: shortName(k), url: `${EXERCISES_BASE}/${exerciseSlug(k)}` })),
  };
  const page = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    '@id': `${url}#page`,
    url,
    name: `${t} exercises`,
    dateModified: EXERCISES_UPDATED,
    isPartOf: { '@id': 'https://coachhimanshu.com/#website' },
    mainEntity: { '@id': `${url}#list` },
    speakable: { '@type': 'SpeakableSpecification', cssSelector: ['#muscle-answer'] },
  };
  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((q) => ({ '@type': 'Question', name: q.question, acceptedAnswer: { '@type': 'Answer', text: q.answer } })),
  };
  const breadcrumb = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://coachhimanshu.com' },
      { '@type': 'ListItem', position: 2, name: 'Exercise Library', item: EXERCISES_BASE },
      { '@type': 'ListItem', position: 3, name: `${t} exercises`, item: url },
    ],
  };

  return (
    <div className="min-h-screen bg-brand-navy">
      {[page, itemList, faqSchema, breadcrumb].map((s, i) => (
        <script key={i} type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(s) }} />
      ))}
      <AnnouncementBar />
      <Navbar />

      <section className="relative pt-28 pb-8 md:pt-36">
        <div className="max-w-4xl mx-auto px-4">
          <nav className="mb-4 text-xs text-gray-500" aria-label="Breadcrumb">
            <Link href="/" className="hover:text-gray-300">Home</Link>
            <span className="mx-1.5">/</span>
            <Link href="/exercises" className="hover:text-gray-300">Exercise Library</Link>
            <span className="mx-1.5">/</span>
            <span className="text-gray-400">{t}</span>
          </nav>
          <h1 className="text-3xl md:text-5xl font-extrabold leading-tight text-white">{t} Exercises for Gym and Home</h1>
          <p id="muscle-answer" className="mt-6 text-gray-200 md:text-lg leading-relaxed">
            {all.length} exercises that train the {t.toLowerCase()}: {f.primary.length} where they do the main work
            {f.secondary.length ? <> and {f.secondary.length} where they help</> : null}. {home.length} need only bodyweight or dumbbells, so you can do them
            at home. Each links to step-by-step form and common mistakes.
          </p>
        </div>
      </section>

      {[
        { h: 'At the gym', list: gym },
        { h: 'At home (bodyweight or dumbbells)', list: home },
      ].filter((s) => s.list.length).map((s) => (
        <section key={s.h} className="pb-10">
          <div className="max-w-4xl mx-auto px-4">
            <h2 className="text-2xl md:text-3xl font-bold text-white">{s.h}</h2>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              {[...s.list].sort((a, b) => Number(!ex(a).primary.includes(m)) - Number(!ex(b).primary.includes(m))).map((k) => <Card key={k} k={k} role={role(k)} />)}
            </div>
          </div>
        </section>
      ))}

      <section className="pb-10">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-2xl md:text-3xl font-bold text-white">Put them into a plan</h2>
          <p className="mt-2 text-sm text-gray-400">These free weekly plans use {t.toLowerCase()} exercises from this page, with sets, reps and rest times.</p>
          <div className="mt-4 flex flex-wrap gap-2">
            {plans.map((p) => (
              <Link key={p.slug} href={`/workout-plans/${p.slug}`} className="rounded-full border border-white/15 px-4 py-2 text-sm text-gray-200 hover:bg-white/5">{p.name}</Link>
            ))}
          </div>
          <h2 className="mt-10 text-2xl md:text-3xl font-bold text-white">Other muscle groups</h2>
          <div className="mt-4 flex flex-wrap gap-2">
            {others.map((x) => (
              <Link key={x} href={`/exercises/muscle/${MUSCLE_SLUG[x]}`} className="rounded-full border border-white/15 px-4 py-2 text-sm text-gray-200 hover:bg-white/5">
                {muscleTitle(x)} exercises
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="pb-12">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-2xl md:text-3xl font-bold text-white">Questions about {t.toLowerCase()} training</h2>
          <div className="mt-5 space-y-3">
            {faqs.map((q) => (
              <details key={q.question} className="rounded-xl border border-white/10 bg-brand-navy-light p-5">
                <summary className="cursor-pointer list-none font-semibold text-white">{q.question}</summary>
                <p className="mt-3 text-sm leading-relaxed text-gray-300">{q.answer}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      <SessionsCta kind="training" goal="muscle-gain" topic={`${MUSCLE_LABEL[m].toLowerCase()} training`} source={`Exercise muscle page: ${t}`} />

      <Footer />
    </div>
  );
}
