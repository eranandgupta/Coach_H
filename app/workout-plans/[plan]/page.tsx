import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import AnnouncementBar from '@/components/AnnouncementBar';
import ConsultationForm from '@/components/ConsultationForm';
import {
  BLOG_TITLES,
  MUSCLES,
  MUSCLE_LABEL,
  NHS_URL,
  PLANS_UPDATED,
  WEEKDAYS,
  WORKOUT_PLANS,
  WORKOUT_PLANS_BASE,
  cardioDays,
  equipmentLabel,
  ex,
  getWorkoutPlan,
  nhsGroupDays,
  planFaqs,
  planIssues,
  sessionMinutes,
  sessionRange,
  strengthDays,
  totalWeeklySets,
  weeklySets,
} from '@/lib/workoutPlans';

const WHATSAPP =
  'https://wa.me/917303484648?text=Hi%20Coach%20Himanshu!%20I%20saw%20your%20workout%20plan%20and%20want%20one%20built%20for%20me.';

export function generateStaticParams() {
  const issues = planIssues();
  if (issues.length) throw new Error(`Workout plans failed checks:\n${issues.join('\n')}`);
  return WORKOUT_PLANS.map((p) => ({ plan: p.slug }));
}

export function generateMetadata({ params }: { params: { plan: string } }): Metadata {
  const p = getWorkoutPlan(params.plan);
  if (!p) return {};
  const s = sessionRange(p);
  const description = `${p.h1.split(':')[0]}: ${strengthDays(p).length} days a week, ${s.min}–${s.max} min sessions, every exercise with sets, reps and rest. Free, by a NASM-certified coach.`;
  const url = `${WORKOUT_PLANS_BASE}/${p.slug}`;
  return {
    title: p.metaTitle,
    description,
    keywords: p.keywords,
    openGraph: { title: `${p.metaTitle} | Coach Himanshu`, description, url, type: 'article', images: ['/opengraph-image'] },
    twitter: { card: 'summary_large_image', title: `${p.metaTitle} | Coach Himanshu`, description },
    alternates: { canonical: url },
  };
}

const th = 'py-2.5 px-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-400';
const td = 'py-2.5 px-3 text-sm text-gray-200 align-top';
const fmtRest = (sec: number) => (sec >= 60 ? `${sec % 60 ? (sec / 60).toFixed(1) : sec / 60} min` : `${sec} s`);

export default function WorkoutPlanPage({ params }: { params: { plan: string } }) {
  const p = getWorkoutPlan(params.plan);
  if (!p) notFound();

  const url = `${WORKOUT_PLANS_BASE}/${p.slug}`;
  const days = strengthDays(p);
  const cardio = cardioDays(p);
  const s = sessionRange(p);
  const sets = weeklySets(p);
  const nhs = nhsGroupDays(p);
  const faqs = planFaqs(p);
  const others = WORKOUT_PLANS.filter((x) => x.slug !== p.slug);
  const byWeekday = new Map(p.days.map((d) => [d.weekday, d]));
  const title = p.h1.split(':')[0];

  const articleSchema = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    '@id': `${url}#article`,
    headline: p.h1,
    url,
    inLanguage: 'en',
    dateModified: PLANS_UPDATED,
    isPartOf: { '@id': 'https://coachhimanshu.com/#website' },
    author: { '@type': 'Person', '@id': 'https://coachhimanshu.com/#coach', name: 'Coach Himanshu' },
    publisher: { '@id': 'https://coachhimanshu.com/#organization' },
    about: {
      '@type': 'ExercisePlan',
      name: title,
      exerciseType: p.where === 'Home' ? 'Home strength training' : 'Gym strength training',
      activityFrequency: `${days.length} days per week${cardio.length ? ` plus ${cardio.length} cardio sessions` : ''}`,
      activityDuration: `PT${s.max}M`,
      description: p.goal,
    },
    citation: NHS_URL,
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
      { '@type': 'ListItem', position: 2, name: 'Workout Plans', item: WORKOUT_PLANS_BASE },
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
            <Link href="/workout-plans" className="hover:text-gray-300">Workout Plans</Link>
            <span className="mx-1.5">/</span>
            <span className="text-gray-400">{p.name}</span>
          </nav>
          <h1 className="text-3xl md:text-5xl font-extrabold leading-tight text-white">{p.h1}</h1>
          <p className="mt-3 text-sm text-gray-500">By Coach Himanshu, NASM certified · Level: {p.level} · Updated {new Date(PLANS_UPDATED).toLocaleDateString('en-IN', { month: 'long', year: 'numeric' })}</p>

          <p id="plan-answer" className="mt-6 text-gray-200 md:text-lg leading-relaxed">
            This {p.where.toLowerCase()} plan trains <strong className="text-white">{days.length} days a week</strong>
            {cardio.length ? <> plus <strong className="text-white">{cardio.length} cardio sessions</strong></> : null}, with sessions of about{' '}
            <strong className="text-white">{s.min === s.max ? s.min : `${s.min}–${s.max}`} minutes</strong> including warm-up. It adds up to{' '}
            {totalWeeklySets(p)} hard sets a week and works every major muscle group on at least 2 days, as the NHS recommends. Goal:{' '}
            {p.goal.toLowerCase()}.
          </p>

          <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
            {[
              { v: `${days.length}${cardio.length ? ` + ${cardio.length}` : ''}`, l: cardio.length ? 'Strength + cardio days' : 'Days a week' },
              { v: `${s.min === s.max ? s.min : `${s.min}–${s.max}`} min`, l: 'Per session' },
              { v: p.level.replace('Beginner to intermediate', 'Beg–Int'), l: 'Level' },
              { v: p.where, l: equipmentLabel(p) },
            ].map((x) => (
              <div key={x.l} className="rounded-xl border border-white/10 bg-brand-navy-light p-4 text-center">
                <div className="text-xl md:text-2xl font-bold text-brand-gold">{x.v}</div>
                <div className="mt-1 text-xs text-gray-400 capitalize">{x.l}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Week at a glance */}
      <section className="pb-10">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-2xl md:text-3xl font-bold text-white">Your week</h2>
          <div className="mt-4 grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2">
            {WEEKDAYS.map((w) => {
              const d = byWeekday.get(w);
              return (
                <div key={w} className={`rounded-xl border p-3 ${d ? 'border-brand-blue/30 bg-brand-blue/[0.06]' : 'border-white/10 bg-white/[0.02]'}`}>
                  <div className="text-xs text-gray-500">{w}</div>
                  <div className={`mt-1 text-sm font-semibold ${d ? 'text-white' : 'text-gray-500'}`}>{d ? d.focus : 'Rest'}</div>
                </div>
              );
            })}
          </div>
          <p className="mt-3 text-sm text-gray-400">Different days work too. Keep the order, and avoid putting the two hardest leg days back to back.</p>
        </div>
      </section>

      {/* The sessions */}
      <section className="pb-12">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-2xl md:text-3xl font-bold text-white">The workouts</h2>
          <p className="mt-2 text-sm text-gray-400">
            Start every session with an 8-minute warm-up: 3 to 4 minutes of easy cardio, then 1 or 2 light sets of the first exercise.
            Reps like 8–12 mean pick a weight you can lift at least 8 times and stop when you have 1 or 2 good reps left.
          </p>
          <div className="mt-5 space-y-4">
            {p.days.map((d) => (
              <div key={d.weekday} className="overflow-x-auto rounded-xl border border-white/10">
                <div className="flex flex-wrap items-baseline justify-between gap-2 bg-white/[0.03] px-4 py-3">
                  <h3 className="font-semibold text-white">
                    {d.label}: {d.focus} <span className="ml-1 text-sm font-normal text-gray-500">{d.weekday}</span>
                  </h3>
                  {d.items && <span className="text-sm text-brand-gold">about {sessionMinutes(d)} min</span>}
                </div>
                {d.cardio ? (
                  <p className="px-4 py-3 text-sm text-gray-300">{d.cardio}.</p>
                ) : (
                  <table className="w-full min-w-[480px]">
                    <thead>
                      <tr>
                        <th className={th}>Exercise</th>
                        <th className={th}>Sets</th>
                        <th className={th}>Reps</th>
                        <th className={th}>Rest</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/[0.05]">
                      {d.items!.map((it, i) => (
                        <tr key={i}>
                          <td className={td}>
                            <span className="font-medium text-white">{ex(it.ex).name}</span>
                            <span className="mt-0.5 block text-xs text-gray-500">{ex(it.ex).cue}</span>
                          </td>
                          <td className={td}>{it.sets}</td>
                          <td className={td}>{it.reps}</td>
                          <td className={td}>{fmtRest(it.restSec)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why + progression */}
      <section className="pb-12">
        <div className="max-w-4xl mx-auto px-4 grid gap-4 md:grid-cols-2">
          <div className="rounded-xl border border-white/10 bg-brand-navy-light p-5">
            <h2 className="text-lg font-bold text-white">Who it is for</h2>
            <p className="mt-2 text-sm leading-relaxed text-gray-300">{p.forWho}</p>
            <h2 className="mt-5 text-lg font-bold text-white">Why it is built this way</h2>
            <p className="mt-2 text-sm leading-relaxed text-gray-300">{p.why}</p>
          </div>
          <div className="rounded-xl border border-white/10 bg-brand-navy-light p-5">
            <h2 className="text-lg font-bold text-white">How to progress</h2>
            <p className="mt-2 text-sm leading-relaxed text-gray-300">{faqs[1].answer}</p>
            <p className="mt-3 text-sm leading-relaxed text-gray-300">
              Write every set down. Progress you can see is what keeps people training: if the weight or reps on your main lifts have not moved for 3 weeks,
              sleep, food or recovery usually needs fixing before the plan does.
            </p>
          </div>
        </div>
      </section>

      {/* Weekly volume */}
      <section className="pb-12">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-2xl md:text-3xl font-bold text-white">Weekly sets per muscle</h2>
          <p className="mt-2 text-sm text-gray-400">
            Counted from the plan: a muscle doing the main work gets the full set, a muscle helping gets half.
          </p>
          <div className="mt-4 grid grid-cols-2 sm:grid-cols-5 gap-2">
            {MUSCLES.filter((m) => sets[m] > 0).map((m) => (
              <div key={m} className="rounded-xl border border-white/10 bg-white/[0.02] p-3">
                <div className="text-xs text-gray-500">{MUSCLE_LABEL[m]}</div>
                <div className="text-lg font-bold text-white">{sets[m]}</div>
              </div>
            ))}
          </div>
          <p className="mt-4 text-sm text-gray-400">
            Days a week each NHS major muscle group is worked: {nhs.map((g) => `${g.label.toLowerCase()} ${g.days}`).join(', ')}. The NHS asks for{' '}
            <a href={NHS_URL} target="_blank" rel="noopener noreferrer" className="text-brand-blue hover:underline">
              strengthening activities that work all the major muscle groups on at least 2 days a week
            </a>
            .
          </p>
        </div>
      </section>

      {/* Pair with food + tracking */}
      <section className="pb-12">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-2xl md:text-3xl font-bold text-white">Pair it with the right food</h2>
          <div className="mt-4 grid gap-3 sm:grid-cols-3">
            {[
              { href: '/tools/protein-calculator', t: 'Protein calculator', d: 'How much protein your body weight needs.' },
              { href: '/tools/calorie-deficit-calculator', t: 'Calorie target', d: 'Calories for fat loss, or add a surplus for muscle.' },
              { href: '/diet-plans', t: 'Indian diet plans', d: 'Veg and non-veg charts from 1200 to 2500 kcal.' },
            ].map((x) => (
              <Link key={x.href} href={x.href} className="rounded-xl border border-white/10 p-4 hover:border-brand-blue/50 transition-colors">
                <div className="font-semibold text-white">{x.t}</div>
                <div className="mt-1 text-sm text-gray-400">{x.d}</div>
              </Link>
            ))}
          </div>
          <div className="mt-4 rounded-xl border border-brand-blue/20 bg-brand-blue/[0.06] p-5">
            <h3 className="font-semibold text-white">Coached members log this inside their dashboard</h3>
            <p className="mt-1 text-sm text-gray-300">
              With a Coach Himanshu plan you get a Progress Diary: log every set, rep and kilo, your runs, meals and body measurements. Personal
              records are picked up automatically, and your coach sees the same numbers and adjusts your plan each week.
            </p>
            <Link href="/plans" className="mt-3 inline-block text-sm font-semibold text-brand-blue hover:underline">See coaching plans →</Link>
          </div>
        </div>
      </section>

      {/* Related reading + other plans */}
      <section className="pb-12">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-2xl md:text-3xl font-bold text-white">Read next</h2>
          <ul className="mt-4 space-y-2">
            {p.blogs.map((b) => (
              <li key={b}>
                <Link href={`/blog/${b}`} className="text-brand-blue hover:underline">{BLOG_TITLES[b]}</Link>
              </li>
            ))}
            {p.coachingGoal && (
              <li>
                <Link href={`/online-personal-trainer/for/${p.coachingGoal}`} className="text-brand-blue hover:underline">
                  Prefer to train live with a coach? 1-on-1 online personal training
                </Link>
              </li>
            )}
          </ul>
          <h2 className="mt-10 text-2xl md:text-3xl font-bold text-white">Other workout plans</h2>
          <div className="mt-4 flex flex-wrap gap-2">
            {others.map((x) => (
              <Link key={x.slug} href={`/workout-plans/${x.slug}`} className="rounded-full border border-white/15 px-4 py-2 text-sm text-gray-200 hover:bg-white/5">
                {x.name}
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
          <p className="mt-4 text-xs text-gray-500">
            General guidance for healthy adults. If you have a heart condition, high blood pressure, an injury, are pregnant or have not exercised in a
            long time, check with your doctor first, and stop any exercise that causes sharp pain.
          </p>
        </div>
      </section>

      {/* Convert */}
      <section className="pb-16">
        <div className="max-w-3xl mx-auto px-4">
          <div className="rounded-2xl border border-brand-blue/20 bg-gradient-to-r from-brand-blue/10 to-brand-navy-light p-6 text-center">
            <h2 className="text-xl md:text-2xl font-bold text-white">Want a plan built around you?</h2>
            <p className="mx-auto mt-2 max-w-xl text-sm text-gray-300">
              This plan is a solid template. Coach Himanshu builds yours around your goal, the equipment you have, injuries, schedule and food, then
              adjusts it every week from what you log.
            </p>
            <div className="mt-5 flex flex-wrap justify-center gap-3">
              <a
                href={WHATSAPP}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-xl bg-gradient-to-r from-brand-blue to-blue-500 px-6 py-3 font-semibold text-white shadow-lg shadow-brand-blue/25 hover:-translate-y-0.5 transition-transform"
              >
                Get my personal plan
              </a>
              <Link href="/plans" className="rounded-xl border border-white/15 px-6 py-3 font-semibold text-white hover:bg-white/5 transition-colors">
                See coaching plans
              </Link>
            </div>
          </div>
          <div className="mt-8">
            <ConsultationForm source={`Workout plan page: ${title}`} whatsappHref={WHATSAPP} />
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
