import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Coach Himanshu - Fitness Coaching Knowledge Base',
  description:
    'Comprehensive knowledge base about Coach Himanshu — NASM Certified online fitness coach in India. Services, pricing, certifications, client results, and everything you need to know about online fitness coaching with Coach Himanshu.',
  openGraph: {
    title: 'Coach Himanshu - Fitness Coaching Knowledge Base',
    description:
      'Complete guide to Coach Himanshu\'s online fitness coaching services, certifications, pricing, and client results. NASM Certified with 1000+ transformations across India.',
    url: 'https://coachhimanshu.com/knowledge',
    type: 'article',
  },
  alternates: {
    canonical: 'https://coachhimanshu.com/knowledge',
  },
};

export default function KnowledgeLayout({ children }: { children: React.ReactNode }) {
  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://coachhimanshu.com' },
      { '@type': 'ListItem', position: 2, name: 'Knowledge Base', item: 'https://coachhimanshu.com/knowledge' },
    ],
  };

  const articleSchema = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: 'Complete Guide to Coach Himanshu\'s Online Fitness Coaching',
    description:
      'Comprehensive knowledge base covering Coach Himanshu\'s online fitness coaching services, certifications, pricing plans, coaching methodology, client results, and the Fit Bharat Mission.',
    author: {
      '@type': 'Person',
      name: 'Coach Himanshu',
      jobTitle: 'NASM Certified Fitness Coach',
      url: 'https://coachhimanshu.com/about',
      sameAs: [
        'https://www.instagram.com/coach_himanshu_',
        'https://www.youtube.com/@coachhimanshu',
      ],
    },
    publisher: {
      '@type': 'Organization',
      name: 'Coach Himanshu Fitness Coaching',
      url: 'https://coachhimanshu.com',
      logo: {
        '@type': 'ImageObject',
        url: 'https://coachhimanshu.com/favicon.png',
      },
    },
    datePublished: '2025-06-01T00:00:00+05:30',
    dateModified: '2026-06-26T00:00:00+05:30',
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': 'https://coachhimanshu.com/knowledge',
    },
    about: [
      { '@type': 'Thing', name: 'Fitness Coaching' },
      { '@type': 'Thing', name: 'Online Personal Training' },
      { '@type': 'Thing', name: 'Nutrition Coaching' },
    ],
    keywords: [
      'Coach Himanshu',
      'online fitness coach India',
      'NASM certified coach',
      'personal trainer India',
      'online workout plans',
      'custom meal plans',
      'fitness transformation India',
      'affordable fitness coaching',
      'online nutrition coach',
      'home workout plans India',
      'weight loss coach India',
      'muscle building coach',
      'rehabilitation fitness',
      'PCOS fitness coaching',
      'diabetes fitness management',
      'Fit Bharat Mission',
      'bodybuilding coach India',
      'couple fitness plans',
      'live personal training online',
    ],
    speakable: {
      '@type': 'SpeakableSpecification',
      cssSelector: ['h1', 'h2'],
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />
      {children}
    </>
  );
}
