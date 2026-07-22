import type { Metadata } from 'next';
import Link from 'next/link';
import { COUNTRIES } from '@/lib/countries';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import AnnouncementBar from '@/components/AnnouncementBar';

export const metadata: Metadata = {
  title: 'Online Indian Fitness Coach Worldwide | Coach Himanshu',
  description: 'NASM certified online Indian fitness coach for NRIs worldwide — the USA, UK, Canada, UAE, Australia, Singapore and more. Custom Indian meal plans, timezone-friendly video coaching, 24/7 WhatsApp support. Plans from ₹799/month, international cards accepted.',
  alternates: { canonical: 'https://coachhimanshu.com/online-fitness-coach' },
  openGraph: {
    title: 'Online Indian Fitness Coach Worldwide | Coach Himanshu',
    description: 'NASM certified online Indian fitness coach serving NRIs across the world with custom Indian meal plans and timezone-friendly coaching.',
    url: 'https://coachhimanshu.com/online-fitness-coach',
    type: 'website',
  },
};

export default function OnlineFitnessCoachHub() {
  const byRegion = COUNTRIES.reduce<Record<string, typeof COUNTRIES>>((acc, c) => {
    (acc[c.region] ||= []).push(c);
    return acc;
  }, {});

  return (
    <div className="min-h-screen bg-brand-navy">
      <AnnouncementBar />
      <Navbar />

      <section className="relative pt-28 pb-16 md:pt-36 md:pb-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-brand-blue/10 via-transparent to-transparent" />
        <div className="max-w-5xl mx-auto px-4 text-center relative z-10">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
            Online Indian{' '}
            <span className="bg-gradient-to-r from-brand-blue to-brand-gold bg-clip-text text-transparent">Fitness Coach</span>{' '}
            Worldwide
          </h1>
          <p className="text-lg md:text-xl text-gray-300 max-w-3xl mx-auto mb-8 leading-relaxed">
            Wherever you are in the world, get NASM-certified online coaching with Indian meal plans you can
            actually cook, timezone-friendly video sessions, and 24/7 WhatsApp support. Plans from ₹799/month —
            international cards accepted.
          </p>
          <Link
            href="/assessment"
            className="inline-flex items-center justify-center px-8 py-4 bg-brand-blue hover:bg-brand-blue-dark text-white font-semibold rounded-xl transition-all duration-300 text-lg shadow-lg shadow-brand-blue/25 hover:shadow-brand-blue/40"
          >
            Start Free Assessment
          </Link>
        </div>
      </section>

      <section className="py-8 md:py-16">
        <div className="max-w-5xl mx-auto px-4">
          {Object.entries(byRegion).map(([region, countries]) => (
            <div key={region} className="mb-10">
              <h2 className="text-xl font-bold text-brand-gold mb-4">{region}</h2>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {countries.map((c) => (
                  <Link
                    key={c.slug}
                    href={`/online-fitness-coach/${c.slug}`}
                    className="flex items-center justify-between p-4 rounded-xl border border-white/[0.06] bg-white/[0.02] hover:bg-white/[0.04] hover:border-white/[0.12] transition-all"
                  >
                    <span className="text-white font-medium">Fitness Coach in {c.name}</span>
                    <span className="text-brand-blue">→</span>
                  </Link>
                ))}
              </div>
            </div>
          ))}

          <div className="mt-10 text-center">
            <p className="text-gray-400 text-sm">
              Based in India?{' '}
              <Link href="/fitness-coach" className="text-brand-blue hover:text-brand-gold transition-colors underline">
                See city-specific coaching across India →
              </Link>
            </p>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
