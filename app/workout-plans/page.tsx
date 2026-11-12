import type { Metadata } from 'next';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import AnnouncementBar from '@/components/AnnouncementBar';
import ConsultationForm from '@/components/ConsultationForm';
import {
  NHS_URL,
  PLANS_UPDATED,
  WHO_URL,
  WORKOUT_PLANS,
  WORKOUT_PLANS_BASE,
  cardioDays,
  equipmentLabel,
  hubFaqs,
  sessionRange,
  strengthDays,
} from '@/lib/workoutPlans';

const WHATSAPP =
  'https://wa.me/917303484648?text=Hi%20Coach%20Himanshu!%20I%20want%20a%20workout%20plan%20built%20for%20me.';

const description =
  'Free workout plans with every exercise, set, rep and rest time: beginner gym, upper/lower, push pull legs, 5-day split, home with no equipment, dumbbells only, women and fat loss.';

export const metadata: Metadata = {
  title: 'Free Workout Plans: Gym and Home Schedules',
  description,
  keywords: ['workout plan', 'gym workout plan', 'free workout plan', 'weekly workout schedule', 'workout plan for beginners', 'home workout plan'],
  openGraph: { title: 'Free Workout Plans: Gym and Home Schedules | Coach Himanshu', description, url: WORKOUT_PLANS_BASE, type: 'website', images: ['/opengraph-image'] },
  twitter: { card: 'summary_large_image', title: 'Free Workout Plans: Gym and Home Schedules | Coach Himanshu', description },
  alternates: { canonical: WORKOUT_PLANS_BASE },
};

export default function WorkoutPlansHub() {
  const faqs = hubFaqs();
  const collection = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    '@id': `${WORKOUT_PLANS_BASE}#page`,
    name: 'Free Workout Plans',
    url: WORKOUT_PLANS_BASE,
    description,
    dateModified: PLANS_UPDATED,
    isPartOf: { '@id': 'https://coachhimanshu.com/#website' },
    author: { '@type': 'Person', '@id': 'https://coachhimanshu.com/#coach', name: 'Coach Himanshu' },
    citation: [NHS_URL, WHO_URL],
    speakable: { '@type': 'SpeakableSpecification', cssSelector: ['#hub-answer'] },
    mainEntity: {
      '@type': 'ItemList',
      itemListElement: WORKOUT_PLANS.map((p, i) => ({ '@type': 'ListItem', position: i + 1, name: p.h1, url: `${WORKOUT_PLANS_BASE}/${p.slug}` })),
    },
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
      { '@type': 'ListItem', position: 2, name: 'Workout Plans', item: WORKOUT_PLANS_BASE },
    ],
  };

  return (
    <div className="min-h-screen bg-brand-navy">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(collection) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }} />
      <AnnouncementBar />
      <Navbar />

      <section className="pt-28 pb-10 md:pt-36">
        <div className="max-w-5xl mx-auto px-4">
          <nav className="mb-4 text-xs text-gray-500" aria-label="Breadcrumb">
            <Link href="/" className="hover:text-gray-300">Home</Link>
            <span className="mx-1.5">/</span>
            <span className="text-gray-400">Workout Plans</span>
          </nav>
          <h1 className="text-3xl md:text-5xl font-extrabold leading-tight text-white">
            Free Workout Plans, <span className="text-brand-blue">Set by Set</span>
          </h1>
          <p className="mt-3 text-sm text-gray-500">By Coach Himanshu, NASM certified</p>
          <p id="hub-answer" className="mt-6 max-w-3xl text-gray-200 md:text-lg leading-relaxed">
            {WORKOUT_PLANS.length} complete weekly plans for the gym and for home, from 3 to 6 days a week. Each lists every exercise with sets, reps
            and rest, and each works every major muscle group on at least 2 days a week, in line with NHS guidance. Pick the plan that matches how many
            days you can really train.
          </p>
        </div>
      </section>

      <section className="pb-12">
        <div className="max-w-5xl mx-auto px-4 grid gap-4 sm:grid-cols-2">
          {WORKOUT_PLANS.map((p) => {
            const s = sessionRange(p);
            const c = cardioDays(p).length;
            return (
              <Link key={p.slug} href={`/workout-plans/${p.slug}`} className="group rounded-2xl border border-white/10 bg-brand-navy-light p-5 hover:border-brand-blue/50 transition-colors">
                <div className="flex items-center gap-2 text-xs text-gray-500">
                  <span className="rounded-full border border-white/10 px-2 py-0.5">{p.where}</span>
                  <span>{p.level}</span>
                </div>
                <h2 className="mt-3 text-lg font-bold text-white group-hover:text-brand-blue transition-colors">{p.h1.split(':')[0]}</h2>
                <p className="mt-1 text-sm text-gray-400">{p.goal}.</p>
                <p className="mt-3 text-xs text-gray-500">
                  {strengthDays(p).length} days{c ? ` + ${c} cardio` : ''} · {s.min}–{s.max} min · {equipmentLabel(p)}
                </p>
              </Link>
            );
          })}
        </div>
      </section>

      <section className="pb-12">
        <div className="max-w-5xl mx-auto px-4">
          <h2 className="text-2xl md:text-3xl font-bold text-white">How much exercise do you need?</h2>
          <div className="mt-4 grid gap-3 md:grid-cols-3">
            <div className="rounded-xl border border-white/10 p-5">
              <div className="text-2xl font-bold text-brand-gold">2+ days</div>
              <p className="mt-1 text-sm text-gray-300">of strengthening activities that work all the major muscle groups: legs, hips, back, abdomen, chest, shoulders and arms.</p>
            </div>
            <div className="rounded-xl border border-white/10 p-5">
              <div className="text-2xl font-bold text-brand-gold">150 min</div>
              <p className="mt-1 text-sm text-gray-300">of moderate intensity activity a week, or 75 minutes of vigorous intensity activity.</p>
            </div>
            <div className="rounded-xl border border-white/10 p-5">
              <div className="text-2xl font-bold text-brand-gold">Sit less</div>
              <p className="mt-1 text-sm text-gray-300">Break up long periods of sitting; WHO says all age groups should limit the time they spend sedentary.</p>
            </div>
          </div>
          <p className="mt-3 text-xs text-gray-500">
            Sources:{' '}
            <a href={NHS_URL} target="_blank" rel="noopener noreferrer" className="text-brand-blue hover:underline">NHS physical activity guidelines for adults aged 19 to 64</a>
            {' · '}
            <a href={WHO_URL} target="_blank" rel="noopener noreferrer" className="text-brand-blue hover:underline">WHO physical activity fact sheet</a>
          </p>
        </div>
      </section>

      <section className="pb-12">
        <div className="max-w-5xl mx-auto px-4">
          <h2 className="text-2xl md:text-3xl font-bold text-white">Questions</h2>
          <div className="mt-5 space-y-3">
            {faqs.map((f) => (
              <details key={f.question} className="rounded-xl border border-white/10 bg-brand-navy-light p-5">
                <summary className="cursor-pointer list-none font-semibold text-white">{f.question}</summary>
                <p className="mt-3 text-sm leading-relaxed text-gray-300">{f.answer}</p>
              </details>
            ))}
          </div>
          <div className="mt-6 flex flex-wrap gap-2 text-sm">
            <Link href="/diet-plans" className="rounded-full border border-white/15 px-4 py-2 text-gray-200 hover:bg-white/5">Indian diet plans</Link>
            <Link href="/tools" className="rounded-full border border-white/15 px-4 py-2 text-gray-200 hover:bg-white/5">Fitness calculators</Link>
            <Link href="/online-personal-trainer" className="rounded-full border border-white/15 px-4 py-2 text-gray-200 hover:bg-white/5">Live 1-on-1 training</Link>
          </div>
        </div>
      </section>

      <section className="pb-16">
        <div className="max-w-3xl mx-auto px-4">
          <ConsultationForm source="Workout plans hub" whatsappHref={WHATSAPP} />
        </div>
      </section>

      <Footer />
    </div>
  );
}
