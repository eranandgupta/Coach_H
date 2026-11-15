import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import AnnouncementBar from '@/components/AnnouncementBar';
import SessionsCta from '@/components/SessionsCta';
import { BLOG_TITLES, MUSCLE_LABEL, ex, type ExerciseKey } from '@/lib/workoutPlans';
import {
  EQUIPMENT_LABEL,
  EXERCISES_BASE,
  EXERCISES_UPDATED,
  EXERCISE_KEYS,
  MUSCLE_PAGES,
  MUSCLE_SLUG,
  alternatives,
  atHome,
  coachingGoalForExercise,
  exerciseBySlug,
  exerciseFaqs,
  exerciseIssues,
  exerciseSlug,
  guide,
  muscleTitle,
  plansUsing,
  shortName,
} from '@/lib/exerciseGuides';

export function generateStaticParams() {
  const issues = exerciseIssues();
  if (issues.length) throw new Error(`Exercise guides failed checks:\n${issues.join('\n')}`);
  return EXERCISE_KEYS.map((k) => ({ exercise: exerciseSlug(k) }));
}

const muscleList = (k: ExerciseKey) => ex(k).primary.map((m) => MUSCLE_LABEL[m].toLowerCase()).join(', ');

export function generateMetadata({ params }: { params: { exercise: string } }): Metadata {
  const k = exerciseBySlug(params.exercise);
  if (!k) return {};
  const name = shortName(k);
  const title = name.length > 24 ? `How to Do the ${name}: Form and Muscles Worked` : `How to Do the ${name}: Form, Muscles Worked, Mistakes`;
  const description = `How to do the ${name.toLowerCase()} with good form in ${guide(k).steps.length} steps. Works the ${muscleList(k)}. Common mistakes, sets and reps, and ${atHome(k) ? 'home-friendly' : 'home'} alternatives, by a NASM-certified coach.`;
  const url = `${EXERCISES_BASE}/${guide(k).slug}`;
  return {
    title,
    description,
    keywords: [`how to do ${name.toLowerCase()}`, `${name.toLowerCase()} form`, `${name.toLowerCase()} muscles worked`, `${name.toLowerCase()} alternative`, `${name.toLowerCase()} benefits`],
    openGraph: { title: `${title} | Coach Himanshu`, description, url, type: 'article', images: ['/opengraph-image'] },
    twitter: { card: 'summary_large_image', title: `${title} | Coach Himanshu`, description },
    alternates: { canonical: url },
  };
}

export default function ExercisePage({ params }: { params: { exercise: string } }) {
  const k = exerciseBySlug(params.exercise);
  if (!k) notFound();

  const e = ex(k);
  const g = guide(k);
  const name = shortName(k);
  const url = `${EXERCISES_BASE}/${g.slug}`;
  const used = plansUsing(k);
  const alts = alternatives(k);
  const homeAlts = atHome(k) ? [] : alternatives(k, 12).filter(atHome).slice(0, 3);
  const faqs = exerciseFaqs(k);
  const variations = [
    g.easier && { k: g.easier, label: 'Easier version' },
    g.harder && { k: g.harder, label: 'Harder version' },
  ].filter(Boolean) as { k: ExerciseKey; label: string }[];
  const musclePages = [...e.primary, ...(e.secondary ?? [])].filter((m) => MUSCLE_PAGES.includes(m));

  const howTo = {
    '@context': 'https://schema.org',
    '@type': 'HowTo',
    '@id': `${url}#howto`,
    name: `How to do the ${name.toLowerCase()}`,
    url,
    inLanguage: 'en',
    dateModified: EXERCISES_UPDATED,
    author: { '@type': 'Person', '@id': 'https://coachhimanshu.com/#coach', name: 'Coach Himanshu' },
    publisher: { '@id': 'https://coachhimanshu.com/#organization' },
    isPartOf: { '@id': 'https://coachhimanshu.com/#website' },
    tool: e.equipment === 'bodyweight' ? undefined : [{ '@type': 'HowToTool', name: EQUIPMENT_LABEL[e.equipment] }],
    step: g.steps.map((s, i) => ({ '@type': 'HowToStep', position: i + 1, text: s })),
    about: { '@type': 'Thing', name: `${name} (strength exercise for the ${muscleList(k)})` },
    speakable: { '@type': 'SpeakableSpecification', cssSelector: ['#exercise-answer'] },
  };
  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((f) => ({ '@type': 'Question', name: f.question, acceptedAnswer: { '@type': 'Answer', text: f.answer } })),
  };
  const breadcrumb = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://coachhimanshu.com' },
      { '@type': 'ListItem', position: 2, name: 'Exercise Library', item: EXERCISES_BASE },
      { '@type': 'ListItem', position: 3, name, item: url },
    ],
  };

  return (
    <div className="min-h-screen bg-brand-navy">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(howTo) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }} />
      <AnnouncementBar />
      <Navbar />

      <section className="relative pt-28 pb-8 md:pt-36">
        <div className="max-w-4xl mx-auto px-4">
          <nav className="mb-4 text-xs text-gray-500" aria-label="Breadcrumb">
            <Link href="/" className="hover:text-gray-300">Home</Link>
            <span className="mx-1.5">/</span>
            <Link href="/exercises" className="hover:text-gray-300">Exercise Library</Link>
            <span className="mx-1.5">/</span>
            <span className="text-gray-400">{name}</span>
          </nav>
          <h1 className="text-3xl md:text-5xl font-extrabold leading-tight text-white">How to Do the {name}</h1>
          <p className="mt-3 text-sm text-gray-500">
            By Coach Himanshu, NASM certified · Updated {new Date(EXERCISES_UPDATED).toLocaleDateString('en-IN', { month: 'long', year: 'numeric' })}
          </p>

          <p id="exercise-answer" className="mt-6 text-gray-200 md:text-lg leading-relaxed">
            The {name.toLowerCase()} is a {e.equipment === 'dumbbell' ? 'dumbbell' : EQUIPMENT_LABEL[e.equipment].toLowerCase()} exercise that mainly works the{' '}
            <strong className="text-white">{muscleList(k)}</strong>
            {e.secondary?.length ? <>, with the {e.secondary.map((m) => MUSCLE_LABEL[m].toLowerCase()).join(', ')} helping</> : null}. Key cue: {e.cue}
          </p>

          <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
            {[
              { v: e.primary.map((m) => MUSCLE_LABEL[m]).join(', '), l: 'Main muscles' },
              { v: EQUIPMENT_LABEL[e.equipment], l: 'Equipment' },
              { v: atHome(k) ? 'Yes' : 'Gym', l: 'Doable at home' },
              { v: used.length ? `${used.length}` : 'None', l: used.length === 1 ? 'Free plan uses it' : 'Free plans use it' },
            ].map((x) => (
              <div key={x.l} className="rounded-xl border border-white/10 bg-brand-navy-light p-4 text-center">
                <div className="text-lg md:text-xl font-bold text-brand-gold">{x.v}</div>
                <div className="mt-1 text-xs text-gray-400">{x.l}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="pb-10">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-2xl md:text-3xl font-bold text-white">Step by step</h2>
          <ol className="mt-5 space-y-3">
            {g.steps.map((s, i) => (
              <li key={i} className="flex gap-4 rounded-xl border border-white/10 bg-white/[0.02] p-4">
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-brand-blue/20 text-sm font-bold text-brand-blue">{i + 1}</span>
                <span className="text-sm md:text-base leading-relaxed text-gray-200">{s}</span>
              </li>
            ))}
          </ol>
          <p className="mt-4 text-sm text-gray-400">
            Warm up first with a few minutes of easy cardio and one or two light sets. Breathe out on the hard part of each rep and stop any exercise that
            causes sharp pain.
          </p>
        </div>
      </section>

      <section className="pb-10">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-2xl md:text-3xl font-bold text-white">Common mistakes</h2>
          <ul className="mt-4 space-y-2">
            {g.mistakes.map((m) => (
              <li key={m} className="rounded-xl border border-white/10 bg-brand-navy-light p-4 text-sm leading-relaxed text-gray-300">{m}</li>
            ))}
          </ul>
          {g.blog && BLOG_TITLES[g.blog] && (
            <p className="mt-4 text-sm text-gray-400">
              Go deeper: <Link href={`/blog/${g.blog}`} className="text-brand-blue hover:underline">{BLOG_TITLES[g.blog]}</Link>
            </p>
          )}
        </div>
      </section>

      {used.length > 0 && (
        <section className="pb-10">
          <div className="max-w-4xl mx-auto px-4">
            <h2 className="text-2xl md:text-3xl font-bold text-white">Sets and reps in the free plans</h2>
            <p className="mt-2 text-sm text-gray-400">Where the {name.toLowerCase()} appears in the free workout plans, and how it is programmed there.</p>
            <div className="mt-4 overflow-x-auto rounded-xl border border-white/10">
              <table className="w-full min-w-[480px]">
                <thead>
                  <tr>
                    {['Plan', 'Day', 'Sets × reps'].map((h) => (
                      <th key={h} className="py-2.5 px-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-400">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/[0.05]">
                  {used.flatMap(({ plan, uses }) =>
                    uses.map((u) => (
                      <tr key={`${plan.slug}-${u.day}`}>
                        <td className="py-2.5 px-3 text-sm align-top">
                          <Link href={`/workout-plans/${plan.slug}`} className="text-brand-blue hover:underline">{plan.name}</Link>
                        </td>
                        <td className="py-2.5 px-3 text-sm text-gray-300 align-top">{u.day}</td>
                        <td className="py-2.5 px-3 text-sm text-gray-200 align-top">{u.sets} × {u.reps}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </section>
      )}

      <section className="pb-10">
        <div className="max-w-4xl mx-auto px-4">
          {variations.length > 0 && (
            <>
              <h2 className="text-2xl md:text-3xl font-bold text-white">Make it easier or harder</h2>
              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                {variations.map((v) => (
                  <Link key={v.k} href={`/exercises/${exerciseSlug(v.k)}`} className="rounded-xl border border-white/10 p-4 hover:border-brand-blue/50 transition-colors">
                    <div className="text-xs text-gray-500">{v.label}</div>
                    <div className="mt-1 font-semibold text-white">{shortName(v.k)}</div>
                    <div className="mt-1 text-sm text-gray-400">{ex(v.k).cue}</div>
                  </Link>
                ))}
              </div>
            </>
          )}

          <h2 className={`${variations.length ? 'mt-10' : ''} text-2xl md:text-3xl font-bold text-white`}>Alternatives to the {name.toLowerCase()}</h2>
          <p className="mt-2 text-sm text-gray-400">Exercises that train the same main muscles, for when the equipment is taken or you train somewhere else.</p>
          <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {alts.map((a) => (
              <Link key={a} href={`/exercises/${exerciseSlug(a)}`} className="rounded-xl border border-white/10 p-4 hover:border-brand-blue/50 transition-colors">
                <div className="font-semibold text-white">{shortName(a)}</div>
                <div className="mt-1 text-xs text-gray-500">
                  {EQUIPMENT_LABEL[ex(a).equipment]} · {ex(a).primary.map((m) => MUSCLE_LABEL[m]).join(', ')}
                </div>
              </Link>
            ))}
          </div>
          {homeAlts.length > 0 && (
            <p className="mt-4 text-sm text-gray-400">
              Training at home? Try{' '}
              {homeAlts.map((a, i) => (
                <span key={a}>
                  {i > 0 && (i === homeAlts.length - 1 ? ' or ' : ', ')}
                  <Link href={`/exercises/${exerciseSlug(a)}`} className="text-brand-blue hover:underline">{shortName(a).toLowerCase()}</Link>
                </span>
              ))}
              .
            </p>
          )}
          {musclePages.length > 0 && (
            <p className="mt-4 text-sm text-gray-400">
              More exercises for:{' '}
              {musclePages.map((m, i) => (
                <span key={m}>
                  {i > 0 && ', '}
                  <Link href={`/exercises/muscle/${MUSCLE_SLUG[m]}`} className="text-brand-blue hover:underline">{muscleTitle(m).toLowerCase()}</Link>
                </span>
              ))}
            </p>
          )}
        </div>
      </section>

      <section className="pb-12">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-2xl md:text-3xl font-bold text-white">Questions about the {name.toLowerCase()}</h2>
          <div className="mt-5 space-y-3">
            {faqs.map((f) => (
              <details key={f.question} className="rounded-xl border border-white/10 bg-brand-navy-light p-5">
                <summary className="cursor-pointer list-none font-semibold text-white">{f.question}</summary>
                <p className="mt-3 text-sm leading-relaxed text-gray-300">{f.answer}</p>
              </details>
            ))}
          </div>
          <p className="mt-4 text-xs text-gray-500">
            General guidance for healthy adults. If you have an injury, a heart condition, high blood pressure, are pregnant or have not exercised in a long
            time, check with your doctor first.
          </p>
        </div>
      </section>

      <SessionsCta kind="training" goal={coachingGoalForExercise(k)} topic={name.toLowerCase()} source={`Exercise page: ${name}`} />

      <Footer />
    </div>
  );
}
