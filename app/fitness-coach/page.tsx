import type { Metadata } from 'next';
import Link from 'next/link';
import { CITIES } from '@/lib/cities';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import AnnouncementBar from '@/components/AnnouncementBar';

const baseUrl = 'https://coachhimanshu.com';

export const metadata: Metadata = {
  title: 'Online Fitness Coach in India | City-by-City Personal Training',
  description:
    'Find a NASM certified online fitness coach in your city. Coach Himanshu offers personalized workout plans, custom regional meal plans & 24/7 WhatsApp support across major Indian cities. 1000+ transformations. Plans from ₹1,299/month.',
  alternates: {
    canonical: `${baseUrl}/fitness-coach`,
  },
  openGraph: {
    title: 'Online Fitness Coach in India | City-by-City Personal Training',
    description:
      'NASM certified online fitness coaching across major Indian cities. Personalized workout & meal plans, 24/7 support. 1000+ transformations.',
    url: `${baseUrl}/fitness-coach`,
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Online Fitness Coach in India | City-by-City Personal Training',
    description:
      'NASM certified online fitness coaching across major Indian cities. 1000+ transformations.',
  },
};

const breadcrumbSchema = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Home', item: baseUrl },
    { '@type': 'ListItem', position: 2, name: 'Fitness Coach', item: `${baseUrl}/fitness-coach` },
  ],
};

const collectionSchema = {
  '@context': 'https://schema.org',
  '@type': 'CollectionPage',
  name: 'Online Fitness Coach in India — City by City',
  url: `${baseUrl}/fitness-coach`,
  description:
    'Directory of city-specific online fitness coaching pages by NASM Certified Coach Himanshu across major Indian cities.',
  mainEntity: {
    '@type': 'ItemList',
    itemListElement: CITIES.map((city, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: `Fitness Coach in ${city.name}`,
      url: `${baseUrl}/fitness-coach/${city.slug}`,
    })),
  },
};

export default function FitnessCoachHubPage() {
  return (
    <div className="min-h-screen bg-brand-navy">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionSchema) }}
      />

      <AnnouncementBar />
      <Navbar />

      {/* Hero Section */}
      <section className="relative pt-28 pb-16 md:pt-36 md:pb-24 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-brand-blue/10 via-transparent to-transparent" />
        <div className="absolute top-20 left-1/4 w-72 h-72 bg-brand-blue/5 rounded-full blur-3xl" />
        <div className="absolute bottom-10 right-1/4 w-96 h-96 bg-brand-gold/5 rounded-full blur-3xl" />

        <div className="max-w-5xl mx-auto px-4 text-center relative z-10">
          {/* Breadcrumbs */}
          <nav className="flex justify-center items-center gap-2 text-sm text-gray-400 mb-8">
            <Link href="/" className="hover:text-brand-blue transition-colors">Home</Link>
            <span>/</span>
            <span className="text-brand-gold">Fitness Coach</span>
          </nav>

          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
            Online{' '}
            <span className="bg-gradient-to-r from-brand-blue to-brand-gold bg-clip-text text-transparent">
              Fitness Coach
            </span>{' '}
            in India
          </h1>

          <p className="text-gray-300 text-lg md:text-xl max-w-3xl mx-auto leading-relaxed">
            NASM Certified Coach Himanshu delivers personalized online training and nutrition
            wherever you are. Choose your city for coaching built around local food, lifestyle,
            and goals — or start with a free assessment today.
          </p>

          <div className="flex flex-wrap justify-center gap-4 mt-8">
            <Link
              href="/assessment"
              className="inline-flex items-center justify-center px-8 py-4 bg-brand-blue hover:bg-brand-blue-dark text-white font-bold rounded-xl transition-all duration-300 text-lg shadow-lg shadow-brand-blue/25 hover:shadow-brand-blue/40"
            >
              Take Free Assessment
            </Link>
            <Link
              href="/#plans"
              className="inline-flex items-center justify-center px-8 py-4 border border-white/15 text-white font-semibold rounded-xl transition-all duration-300 text-lg hover:border-white/30"
            >
              View Plans
            </Link>
          </div>
        </div>
      </section>

      {/* Cities Grid */}
      <section className="py-12 md:py-16" aria-label="Fitness coaching by city">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-2xl md:text-3xl font-bold text-white text-center mb-3">
            Choose Your City
          </h2>
          <p className="text-gray-400 text-center mb-10 max-w-2xl mx-auto">
            Every plan is 100% online — coaching from anywhere in India, tailored to your city.
          </p>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {CITIES.map((city) => (
              <Link
                key={city.slug}
                href={`/fitness-coach/${city.slug}`}
                className="group block rounded-2xl border border-white/10 bg-white/[0.03] p-5 md:p-6 transition-all duration-300 hover:border-brand-blue/40 hover:bg-white/[0.06]"
              >
                <span className="block text-lg md:text-xl font-bold text-white group-hover:text-brand-blue transition-colors">
                  {city.name}
                </span>
                <span className="block text-sm text-gray-400 mt-1">{city.state}</span>
                <span className="mt-3 inline-flex items-center gap-1 text-sm font-medium text-brand-gold">
                  Fitness Coach in {city.name}
                  <span aria-hidden className="transition-transform duration-300 group-hover:translate-x-1">→</span>
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 md:py-24" aria-label="Get started">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Don&apos;t See Your City?
          </h2>
          <p className="text-gray-300 text-lg mb-8 leading-relaxed">
            Coaching is fully online, so Coach Himanshu works with clients across India and
            worldwide. Start with a free assessment — no payment required.
          </p>

          <Link
            href="/assessment"
            className="inline-flex items-center justify-center px-10 py-4 bg-brand-blue hover:bg-brand-blue-dark text-white font-bold rounded-xl transition-all duration-300 text-lg shadow-lg shadow-brand-blue/25 hover:shadow-brand-blue/40"
          >
            Take Free Assessment Now
          </Link>

          <div className="flex flex-wrap justify-center gap-6 mt-10 text-sm text-gray-400">
            <Link href="/about" className="hover:text-brand-blue transition-colors">About Coach Himanshu</Link>
            <Link href="/blog" className="hover:text-brand-blue transition-colors">Fitness Blog</Link>
            <Link href="/faq" className="hover:text-brand-blue transition-colors">All FAQs</Link>
            <Link href="/contact" className="hover:text-brand-blue transition-colors">Contact</Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
