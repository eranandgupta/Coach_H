import type { Metadata } from 'next';
import { getCountryBySlug, getAllCountrySlugs } from '@/lib/countries';
import { notFound } from 'next/navigation';

interface Props {
  params: { country: string };
}

export async function generateStaticParams() {
  return getAllCountrySlugs().map(country => ({ country }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const c = getCountryBySlug(params.country);
  if (!c) return { title: 'Country Not Found' };

  const title = `Online Indian Fitness Coach in ${c.name} | Coach Himanshu`;
  const description = `NASM certified Indian fitness coach for NRIs in ${c.name}. Personalized online workout & Indian meal plans, timezone-friendly video sessions, and 24/7 WhatsApp support. 1000+ transformations. Plans from ₹799/month (≈ ${c.approxStart}), international cards accepted.`;

  return {
    title,
    description,
    keywords: [
      `online fitness coach ${c.country}`,
      `Indian fitness coach ${c.country}`,
      `NRI personal trainer ${c.country}`,
      `Indian diet plan ${c.country}`,
      `online personal trainer ${c.country}`,
      'NASM certified online coach',
    ],
    openGraph: {
      title,
      description,
      url: `https://coachhimanshu.com/online-fitness-coach/${c.slug}`,
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
    },
    alternates: {
      canonical: `https://coachhimanshu.com/online-fitness-coach/${c.slug}`,
    },
  };
}

export default function CountryLayout({ children, params }: { children: React.ReactNode; params: { country: string } }) {
  const c = getCountryBySlug(params.country);
  if (!c) notFound();

  const serviceSchema = {
    '@context': 'https://schema.org',
    '@type': 'ProfessionalService',
    name: `Coach Himanshu - Online Indian Fitness Coach for ${c.country}`,
    description: `NASM Certified online fitness coach serving Indians and NRIs in ${c.country}. Personalized workout plans, custom Indian meal plans, timezone-friendly video coaching, and 24/7 WhatsApp support.`,
    url: `https://coachhimanshu.com/online-fitness-coach/${c.slug}`,
    areaServed: {
      '@type': 'Country',
      name: c.country,
    },
    provider: {
      '@type': 'Person',
      name: 'Coach Himanshu',
      jobTitle: 'NASM Certified Fitness Coach',
      url: 'https://coachhimanshu.com/about',
    },
    serviceType: 'Online Personal Training',
    priceRange: '₹799 - ₹29,999',
    availableChannel: {
      '@type': 'ServiceChannel',
      serviceUrl: 'https://coachhimanshu.com/assessment',
      availableLanguage: ['English', 'Hindi'],
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'BreadcrumbList',
            itemListElement: [
              { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://coachhimanshu.com' },
              { '@type': 'ListItem', position: 2, name: 'Online Fitness Coach', item: 'https://coachhimanshu.com/online-fitness-coach' },
              { '@type': 'ListItem', position: 3, name: c.country, item: `https://coachhimanshu.com/online-fitness-coach/${c.slug}` },
            ],
          }),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceSchema) }}
      />
      {children}
    </>
  );
}
