import type { Metadata } from 'next';
import { getAudienceBySlug, getAllAudienceSlugs } from '@/lib/audiences';
import { notFound } from 'next/navigation';

interface Props {
  params: { audience: string };
}

export async function generateStaticParams() {
  return getAllAudienceSlugs().map((audience) => ({ audience }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const data = getAudienceBySlug(params.audience);
  if (!data) return { title: 'Not Found' };

  const url = `https://coachhimanshu.com/fitness-coaching-for/${data.slug}`;
  const brandedTitle = `${data.metaTitle} | Coach Himanshu`;
  return {
    title: data.metaTitle,
    description: data.metaDescription,
    openGraph: {
      title: brandedTitle,
      description: data.metaDescription,
      url,
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: brandedTitle,
      description: data.metaDescription,
    },
    alternates: {
      canonical: url,
    },
  };
}

export default function AudienceLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { audience: string };
}) {
  const data = getAudienceBySlug(params.audience);
  if (!data) notFound();

  const url = `https://coachhimanshu.com/fitness-coaching-for/${data.slug}`;

  // Cheapest and priciest plan on the page → a defensible AggregateOffer range.
  const priceNumbers = data.plans
    .map((p) => Number(p.price.replace(/[^0-9]/g, '')))
    .filter((n) => !Number.isNaN(n) && n > 0);
  const lowPrice = priceNumbers.length ? Math.min(...priceNumbers) : undefined;
  const highPrice = priceNumbers.length ? Math.max(...priceNumbers) : undefined;

  const serviceSchema: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: `Online Fitness Coaching for ${data.audience}`,
    description: data.metaDescription,
    url,
    serviceType: 'Online Personal Training and Nutrition Coaching',
    provider: {
      '@type': 'Person',
      name: 'Coach Himanshu',
      jobTitle: 'NASM Certified Fitness Coach',
      url: 'https://coachhimanshu.com/about',
    },
    areaServed: { '@type': 'Country', name: 'India' },
    audience: {
      '@type': 'Audience',
      audienceType: data.audience,
    },
    availableChannel: {
      '@type': 'ServiceChannel',
      serviceUrl: 'https://coachhimanshu.com/assessment',
      availableLanguage: ['English', 'Hindi'],
    },
  };

  if (lowPrice && highPrice) {
    serviceSchema.offers = {
      '@type': 'AggregateOffer',
      priceCurrency: 'INR',
      lowPrice: String(lowPrice),
      highPrice: String(highPrice),
      offerCount: String(data.plans.length),
      url: 'https://coachhimanshu.com/plans',
    };
  }

  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: data.faqs.map((f) => ({
      '@type': 'Question',
      name: f.question,
      acceptedAnswer: { '@type': 'Answer', text: f.answer },
    })),
  };

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://coachhimanshu.com' },
      { '@type': 'ListItem', position: 2, name: 'Coaching', item: 'https://coachhimanshu.com/plans' },
      { '@type': 'ListItem', position: 3, name: `For ${data.audience}`, item: url },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      {children}
    </>
  );
}
