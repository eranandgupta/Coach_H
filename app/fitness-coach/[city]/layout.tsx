import type { Metadata } from 'next';
import { getCityBySlug, getAllCitySlugs } from '@/lib/cities';
import { notFound } from 'next/navigation';

interface Props {
  params: { city: string };
}

export async function generateStaticParams() {
  return getAllCitySlugs().map(city => ({ city }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const city = getCityBySlug(params.city);
  if (!city) return { title: 'City Not Found' };

  const title = `Best Online Fitness Coach in ${city.name} | Coach Himanshu`;
  const description = `Looking for a certified fitness coach in ${city.name}? Coach Himanshu provides NASM certified online personal training, custom ${city.name}-friendly meal plans, and 24/7 WhatsApp support. 1000+ transformations. Plans from ₹799/month.`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: `https://coachhimanshu.com/fitness-coach/${city.slug}`,
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
    },
    alternates: {
      canonical: `https://coachhimanshu.com/fitness-coach/${city.slug}`,
    },
  };
}

export default function CityLayout({ children, params }: { children: React.ReactNode; params: { city: string } }) {
  const city = getCityBySlug(params.city);
  if (!city) notFound();

  const localBusinessSchema = {
    '@context': 'https://schema.org',
    '@type': 'ProfessionalService',
    name: `Coach Himanshu - Online Fitness Coach in ${city.name}`,
    description: `NASM Certified online fitness coach serving ${city.name}, ${city.state}. Personalized workout plans, custom meal plans with ${city.localFoods.slice(0, 3).join(', ')} alternatives, and 24/7 WhatsApp support.`,
    url: `https://coachhimanshu.com/fitness-coach/${city.slug}`,
    areaServed: {
      '@type': 'City',
      name: city.name,
      containedInPlace: { '@type': 'State', name: city.state },
    },
    provider: {
      '@type': 'Person',
      name: 'Coach Himanshu',
      jobTitle: 'NASM Certified Fitness Coach',
      url: 'https://coachhimanshu.com/about',
    },
    serviceType: 'Online Personal Training',
    priceRange: '₹799 - ₹29,999',
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: '4.9',
      reviewCount: '1000',
      bestRating: '5',
    },
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
              { '@type': 'ListItem', position: 2, name: 'Fitness Coach', item: 'https://coachhimanshu.com/fitness-coach' },
              { '@type': 'ListItem', position: 3, name: city.name, item: `https://coachhimanshu.com/fitness-coach/${city.slug}` },
            ],
          }),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessSchema) }}
      />
      {children}
    </>
  );
}
