import type { Metadata } from 'next';
import { CALCULATOR_FAQS } from './content';

const url = 'https://coachhimanshu.com/calorie-calculator';
const title = 'Indian Food Calorie Calculator';
const brandedTitle = 'Indian Food Calorie Calculator | Coach Himanshu';
const description =
  'Free calorie calculator for Indian food. Search dal, roti, rice, paneer and 130+ foods, pick a katori/roti/cup or grams, and get exact calories + protein, carbs & fat — for a single item or a full meal.';

export const metadata: Metadata = {
  title,
  description,
  keywords: [
    'calorie calculator',
    'indian food calorie calculator',
    'dal calories',
    'roti calories',
    'rice calories',
    'calorie counter india',
    'food calorie chart india',
  ],
  openGraph: { title: brandedTitle, description, url, type: 'website' },
  twitter: { card: 'summary_large_image', title: brandedTitle, description },
  alternates: { canonical: url },
};

export default function CalorieCalculatorLayout({ children }: { children: React.ReactNode }) {
  const appSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: 'Indian Food Calorie Calculator',
    description,
    url,
    applicationCategory: 'HealthApplication',
    operatingSystem: 'Web',
    offers: { '@type': 'Offer', price: '0', priceCurrency: 'INR' },
    provider: {
      '@type': 'Person',
      name: 'Coach Himanshu',
      jobTitle: 'NASM Certified Fitness Coach',
      url: 'https://coachhimanshu.com/about',
    },
  };

  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: CALCULATOR_FAQS.map((f) => ({
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
      { '@type': 'ListItem', position: 2, name: 'Calorie Calculator', item: url },
    ],
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(appSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      {children}
    </>
  );
}
