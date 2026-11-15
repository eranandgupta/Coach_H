import type { Metadata } from 'next';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import AnnouncementBar from '@/components/AnnouncementBar';
import SessionsCta from '@/components/SessionsCta';
import { MUSCLES, MUSCLE_LABEL, WORKOUT_PLANS, ex, strengthDays } from '@/lib/workoutPlans';
import {
  EQUIPMENT_LABEL,
  EXERCISES_BASE,
  EXERCISES_UPDATED,
  EXERCISE_KEYS,
  MUSCLE_PAGES,
  MUSCLE_SLUG,
  atHome,
  exerciseSlug,
  forMuscle,
  muscleTitle,
  shortName,
} from '@/lib/exerciseGuides';

const homeCount = EXERCISE_KEYS.filter(atHome).length;
const perSession = WORKOUT_PLANS.flatMap((p) => strengthDays(p).map((d) => d.items!.length));
const description = `Free exercise library: step-by-step form for ${EXERCISE_KEYS.length} gym and home exercises, from squats and bench press to push-ups and planks, with muscles worked, common mistakes and alternatives.`;

export const metadata: Metadata = {
  title: `Exercise Library: How to Do ${EXERCISE_KEYS.length} Gym and Home Exercises`,
  description,
  keywords: ['exercise library', 'how to do exercises', 'exercise form guide', 'gym exercises list', 'home exercises', 'exercises by muscle group'],
  openGraph: { title: 'Exercise Library | Coach Himanshu', description, url: EXERCISES_BASE, type: 'website', images: ['/opengraph-image'] },
  twitter: { card: 'summary_large_image', title: 'Exercise Library | Coach Himanshu', description },
  alternates: { canonical: EXERCISES_BASE },
};

export default function ExercisesHub() {
  const faqs = [
    {
      question: 'How do I learn good exercise form?',
      answer: 'Start light, follow the steps one at a time and film a set from the side to compare. Learn the movement with an easier version first (goblet squat before back squat, incline push-up before floor push-up), and add weight only when every rep looks the same.',
    },
    {
      question: 'Which exercises can I do at home?',
      answer: `${homeCount} of the ${EXERCISE_KEYS.length} exercises here need only bodyweight or a pair of dumbbells, including ${EXERCISE_KEYS.filter(atHome).slice(0, 6).map(shortName).join(', ')}.`,
    },
    {
      question: 'How many exercises should I do per workout?',
      answer: `Four to seven is plenty for most people: one or two big movements first, then smaller ones. The free workout plans on this site use ${Math.min(...perSession)} to ${Math.max(...perSession)} per session.`,
    },
  ];

  const itemList = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    '@id': `${EXERCISES_BASE}#list`,
    name: 'Exercise library',
    numberOfItems: EXERCISE_KEYS.length,
    itemListElement: EXERCISE_KEYS.map((k, i) => ({ '@type': 'ListItem', position: i + 1, name: shortName(k), url: `${EXERCISES_BASE}/${exerciseSlug(k)}` })),
  };
  const page = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    '@id': `${EXERCISES_BASE}#page`,
    url: EXERCISES_BASE,
    name: 'Exercise Library',
    description,
    dateModified: EXERCISES_UPDATED,
    isPartOf: { '@id': 'https://coachhimanshu.com/#website' },
    mainEntity: { '@id': `${EXERCISES_BASE}#list` },
    speakable: { '@type': 'SpeakableSpecification', cssSelector: ['#exercises-answer'] },
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
            <span className="text-gray-400">Exercise Library</span>
          </nav>
          <h1 className="text-3xl md:text-5xl font-extrabold leading-tight text-white">Exercise Library</h1>
          <p id="exercises-answer" className="mt-6 text-gray-200 md:text-lg leading-relaxed">
            Step-by-step form for {EXERCISE_KEYS.length} exercises, grouped by the muscle they mainly work. {homeCount} need only bodyweight or dumbbells.
            Every page lists the muscles worked, common mistakes, alternatives and how the exercise is programmed in the{' '}
            <Link href="/workout-plans" className="text-brand-blue hover:underline">free workout plans</Link>.
          </p>
          <div className="mt-6 flex flex-wrap gap-2">
            {MUSCLE_PAGES.map((m) => (
              <Link key={m} href={`/exercises/muscle/${MUSCLE_SLUG[m]}`} className="rounded-full border border-white/15 px-4 py-2 text-sm text-gray-200 hover:bg-white/5">
                {muscleTitle(m)}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {MUSCLES.map((m) => {
        const list = forMuscle(m).primary;
        if (!list.length) return null;
        return (
          <section key={m} id={MUSCLE_SLUG[m]} className="pb-10">
            <div className="max-w-4xl mx-auto px-4">
              <div className="flex items-baseline justify-between gap-3">
                <h2 className="text-2xl font-bold text-white">{muscleTitle(m)}</h2>
                {MUSCLE_PAGES.includes(m) && (
                  <Link href={`/exercises/muscle/${MUSCLE_SLUG[m]}`} className="text-sm text-brand-blue hover:underline">
                    All {MUSCLE_LABEL[m].toLowerCase()} exercises →
                  </Link>
                )}
              </div>
              <div className="mt-4 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
                {list.map((k) => (
                  <Link key={k} href={`/exercises/${exerciseSlug(k)}`} className="rounded-xl border border-white/10 px-4 py-3 hover:border-brand-blue/50 transition-colors">
                    <div className="font-medium text-white">{shortName(k)}</div>
                    <div className="mt-0.5 text-xs text-gray-500">
                      {EQUIPMENT_LABEL[ex(k).equipment]}
                      {atHome(k) ? ' · home' : ''}
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </section>
        );
      })}

      <section className="pb-12">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-2xl md:text-3xl font-bold text-white">Questions</h2>
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

      <SessionsCta kind="training" goal="beginners" topic="form" source="Exercise library hub" />

      <Footer />
    </div>
  );
}
