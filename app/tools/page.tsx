import type { Metadata } from 'next';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import AnnouncementBar from '@/components/AnnouncementBar';
import { FITNESS_TOOLS, TOOLS_BASE } from '@/lib/fitnessTools';

const WHATSAPP_CONSULT =
  'https://wa.me/917303484648?text=Hi%20Coach%20Himanshu!%20I%20want%20to%20start%20a%20free%20consultation.';

const title = 'Free Fitness Calculators: BMI, TDEE, Protein & Macros';
const description =
  'Free fitness calculators for Indians: BMI with Asian Indian cut-offs, TDEE, calorie deficit, protein, macros, ideal weight and body fat. No sign-up.';

export const metadata: Metadata = {
  title,
  description,
  keywords: [
    'fitness calculators',
    'free fitness calculator',
    'bmi calculator india',
    'tdee calculator',
    'calorie deficit calculator',
    'protein calculator',
    'macro calculator',
    'ideal weight calculator',
    'body fat calculator',
  ],
  openGraph: { title: `${title} | Coach Himanshu`, description, url: TOOLS_BASE, type: 'website' },
  twitter: { card: 'summary_large_image', title: `${title} | Coach Himanshu`, description },
  alternates: { canonical: TOOLS_BASE },
};

// The order someone starting out would actually use them in.
const STEPS = [
  { step: 'Check where you are', slugs: ['bmi-calculator', 'body-fat-calculator', 'ideal-weight-calculator'] },
  { step: 'Set your calories', slugs: ['tdee-calculator', 'calorie-deficit-calculator'] },
  { step: 'Set your protein and macros', slugs: ['protein-calculator', 'macro-calculator'] },
];

export default function FitnessToolsHubPage() {
  const collectionSchema = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    '@id': `${TOOLS_BASE}#webpage`,
    url: TOOLS_BASE,
    name: title,
    description,
    inLanguage: 'en',
    isPartOf: { '@id': 'https://coachhimanshu.com/#website' },
    author: { '@type': 'Person', '@id': 'https://coachhimanshu.com/#coach', name: 'Coach Himanshu' },
    publisher: { '@id': 'https://coachhimanshu.com/#organization' },
    speakable: { '@type': 'SpeakableSpecification', cssSelector: ['#tools-intro'] },
    mainEntity: {
      '@type': 'ItemList',
      name: 'Free fitness calculators',
      numberOfItems: FITNESS_TOOLS.length,
      itemListElement: FITNESS_TOOLS.map((t, i) => ({
        '@type': 'ListItem',
        position: i + 1,
        name: t.name,
        description: t.tagline,
        url: `${TOOLS_BASE}/${t.slug}`,
      })),
    },
  };

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://coachhimanshu.com' },
      { '@type': 'ListItem', position: 2, name: 'Fitness Calculators', item: TOOLS_BASE },
    ],
  };

  return (
    <div className="min-h-screen bg-brand-navy">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <AnnouncementBar />
      <Navbar />

      <section className="relative pt-28 pb-8 md:pt-36 md:pb-10">
        <div className="max-w-5xl mx-auto px-4">
          <nav className="mb-4 text-xs text-gray-500" aria-label="Breadcrumb">
            <Link href="/" className="hover:text-gray-300">Home</Link>
            <span className="mx-1.5">/</span>
            <span className="text-gray-400">Fitness Calculators</span>
          </nav>
          <h1 className="text-3xl md:text-5xl font-extrabold leading-tight text-white">
            Free{' '}
            <span className="bg-gradient-to-r from-brand-blue to-brand-gold bg-clip-text text-transparent">
              Fitness Calculators
            </span>
          </h1>
          <p id="tools-intro" className="mt-4 max-w-3xl text-gray-300 md:text-lg leading-relaxed">
            {FITNESS_TOOLS.length} free calculators that answer the questions every fitness plan starts with: is my weight
            healthy, how many calories should I eat, and how much protein do I need. Each one uses a published formula, shows
            its working and sources, and reads your BMI against Asian Indian cut-offs as well as the WHO ones.
          </p>
        </div>
      </section>

      {STEPS.map((group, i) => (
        <section key={group.step} className="pb-10">
          <div className="max-w-5xl mx-auto px-4">
            <h2 className="text-xl md:text-2xl font-bold text-white">
              <span className="text-brand-gold">{i + 1}.</span> {group.step}
            </h2>
            <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {FITNESS_TOOLS.filter((t) => group.slugs.includes(t.slug)).map((t) => (
                <Link
                  key={t.slug}
                  href={`/tools/${t.slug}`}
                  className="rounded-xl border border-white/10 bg-brand-navy-light p-5 hover:border-brand-blue/50 transition-colors"
                >
                  <h3 className="text-lg font-semibold text-white">{t.name}</h3>
                  <p className="mt-1.5 text-sm text-gray-400">{t.tagline}</p>
                  <span className="mt-3 inline-block text-sm font-medium text-brand-blue">Open calculator →</span>
                </Link>
              ))}
            </div>
          </div>
        </section>
      ))}

      <section className="pb-12">
        <div className="max-w-5xl mx-auto px-4">
          <h2 className="text-xl md:text-2xl font-bold text-white">
            <span className="text-brand-gold">{STEPS.length + 1}.</span> Track what you eat
          </h2>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            <Link href="/calorie-calculator" className="rounded-xl border border-white/10 bg-brand-navy-light p-5 hover:border-brand-blue/50 transition-colors">
              <h3 className="text-lg font-semibold text-white">Indian Food Calorie Calculator</h3>
              <p className="mt-1.5 text-sm text-gray-400">Add up the calories and macros in dal, roti, rice, sabzi and full meals.</p>
            </Link>
            <Link href="/calories" className="rounded-xl border border-white/10 bg-brand-navy-light p-5 hover:border-brand-blue/50 transition-colors">
              <h3 className="text-lg font-semibold text-white">Food Calorie Chart</h3>
              <p className="mt-1.5 text-sm text-gray-400">Calories, protein, carbs and fat for hundreds of Indian and everyday foods.</p>
            </Link>
          </div>
        </div>
      </section>

      <section className="pb-16">
        <div className="max-w-3xl mx-auto px-4">
          <div className="rounded-2xl border border-brand-blue/20 bg-gradient-to-r from-brand-blue/10 to-brand-navy-light p-6 text-center">
            <h2 className="text-xl md:text-2xl font-bold text-white">Numbers are the easy part</h2>
            <p className="mx-auto mt-2 max-w-xl text-sm text-gray-300">
              Knowing your calories and protein is step one. Coach Himanshu turns them into a workout and Indian diet plan you
              can follow, and adjusts it as you progress.
            </p>
            <div className="mt-5 flex flex-wrap justify-center gap-3">
              <a href={WHATSAPP_CONSULT} target="_blank" rel="noopener noreferrer" className="rounded-xl bg-gradient-to-r from-brand-blue to-blue-500 px-6 py-3 font-semibold text-white shadow-lg shadow-brand-blue/25 hover:-translate-y-0.5 transition-transform">
                Get a free consultation
              </a>
              <Link href="/online-personal-trainer" className="rounded-xl border border-white/15 px-6 py-3 font-semibold text-white hover:bg-white/5 transition-colors">
                See live 1:1 coaching
              </Link>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
