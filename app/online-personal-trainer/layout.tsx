import type { Metadata } from 'next';
import { PT_FAQS, getEliteOfferRange } from '@/lib/personalTraining';

const url = 'https://coachhimanshu.com/online-personal-trainer';

export const metadata: Metadata = {
  title: 'Online Personal Trainer — Live 1-on-1 Training | Coach Himanshu',
  description:
    'Train live 1-on-1 with Coach Himanshu, a NASM-certified online personal trainer. Real-time form correction, personalised Indian diet plan, sessions on your schedule from anywhere. Packages from ₹7,999.',
  keywords: [
    'online personal trainer',
    'live 1 on 1 personal training',
    'online personal trainer India',
    'live online fitness coach',
    'virtual personal trainer',
    '1 on 1 online personal training',
    'personal trainer online India',
    'online personal training for NRIs',
  ],
  openGraph: {
    title: 'Online Personal Trainer — Live 1-on-1 Training | Coach Himanshu',
    description:
      'Live one-on-one online personal training with real-time form correction, a personalised Indian diet plan, and flexible scheduling. Packages from ₹7,999.',
    url,
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Online Personal Trainer — Live 1-on-1 Training | Coach Himanshu',
    description:
      'Live one-on-one online personal training with a NASM-certified coach. Real-time form correction, personalised diet, flexible scheduling. From ₹7,999.',
  },
  alternates: {
    canonical: url,
  },
};

export default function OnlinePersonalTrainerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { low, high, count } = getEliteOfferRange();

  const serviceSchema: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: 'Live 1-on-1 Online Personal Training',
    description:
      'Real-time one-on-one online personal training with Coach Himanshu — live form correction, a personalised Indian diet plan, and flexible scheduling from anywhere in the world.',
    url,
    serviceType: 'Online Personal Training',
    provider: {
      '@type': 'Person',
      name: 'Coach Himanshu',
      jobTitle: 'NASM Certified Personal Trainer',
      url: 'https://coachhimanshu.com/about',
    },
    areaServed: { '@type': 'GeoShape', name: 'Worldwide' },
    availableChannel: {
      '@type': 'ServiceChannel',
      serviceUrl: url,
      availableLanguage: ['English', 'Hindi'],
    },
  };

  if (low && high) {
    serviceSchema.offers = {
      '@type': 'AggregateOffer',
      priceCurrency: 'INR',
      lowPrice: String(low),
      highPrice: String(high),
      offerCount: String(count),
      url,
    };
  }

  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: PT_FAQS.map((f) => ({
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
      { '@type': 'ListItem', position: 3, name: 'Online Personal Trainer', item: url },
    ],
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      {children}
    </>
  );
}
