import type { Metadata } from 'next';
import { ALL_PLANS, PLAN_FAQS } from '@/lib/plans';

const url = 'https://coachhimanshu.com/plans';
const title = 'Fitness Coaching Plans & Pricing';
const brandedTitle = 'Fitness Coaching Plans & Pricing | Coach Himanshu';
const description =
  'Online fitness coaching plans & pricing. Personalised coaching from ₹1,299, live 1-on-1 Elite training from ₹7,999, and couple plans from ₹4,299. Custom workout + Indian diet plans.';

export const metadata: Metadata = {
  title,
  description,
  openGraph: { title: brandedTitle, description, url, type: 'website' },
  twitter: { card: 'summary_large_image', title: brandedTitle, description },
  alternates: { canonical: url },
};

export default function PlansLayout({ children }: { children: React.ReactNode }) {
  const prices = ALL_PLANS.map((p) => p.price);
  const lowPrice = Math.min(...prices);
  const highPrice = Math.max(...prices);

  const offerCatalogSchema = {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: 'Online Fitness Coaching by Coach Himanshu',
    description,
    url,
    serviceType: 'Online Personal Training and Nutrition Coaching',
    provider: {
      '@type': 'Person',
      name: 'Coach Himanshu',
      jobTitle: 'NASM Certified Fitness Coach',
      url: 'https://coachhimanshu.com/about',
    },
    areaServed: { '@type': 'Country', name: 'India' },
    offers: {
      '@type': 'AggregateOffer',
      priceCurrency: 'INR',
      lowPrice: String(lowPrice),
      highPrice: String(highPrice),
      offerCount: String(ALL_PLANS.length),
      offers: ALL_PLANS.map((p) => ({
        '@type': 'Offer',
        name: p.name,
        price: String(p.price),
        priceCurrency: 'INR',
        url,
        availability: 'https://schema.org/InStock',
      })),
    },
  };

  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: PLAN_FAQS.map((f) => ({
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
      { '@type': 'ListItem', position: 2, name: 'Plans & Pricing', item: url },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(offerCatalogSchema) }}
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
