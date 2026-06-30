import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Fitness Blog - Expert Tips, Workouts & Nutrition Advice',
  description:
    'Read expert fitness articles by Coach Himanshu. Science-backed workout tips, nutrition advice, diet plans, and inspiring transformation stories to fuel your fitness journey.',
  openGraph: {
    title: 'Fitness Blog - Expert Tips & Nutrition Advice | Coach Himanshu',
    description:
      'Science-backed workout tips, nutrition advice, and inspiring transformation stories from NASM Certified Coach Himanshu.',
    url: 'https://coachhimanshu.com/blog',
  },
  alternates: {
    canonical: 'https://coachhimanshu.com/blog',
  },
};

export default function BlogLayout({ children }: { children: React.ReactNode }) {
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
              { '@type': 'ListItem', position: 2, name: 'Blog', item: 'https://coachhimanshu.com/blog' },
            ],
          }),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'Blog',
            name: 'Coach Himanshu Fitness Blog',
            description: 'Expert fitness articles covering workouts, nutrition, diet plans, injury prevention, and transformation stories by NASM Certified Coach Himanshu.',
            url: 'https://coachhimanshu.com/blog',
            publisher: {
              '@type': 'Organization',
              name: 'Coach Himanshu',
              url: 'https://coachhimanshu.com',
              logo: { '@type': 'ImageObject', url: 'https://coachhimanshu.com/favicon.png' },
            },
            author: {
              '@type': 'Person',
              name: 'Coach Himanshu',
              url: 'https://coachhimanshu.com/about',
              jobTitle: 'NASM Certified Fitness Coach',
            },
            about: [
              { '@type': 'Thing', name: 'Fitness Training' },
              { '@type': 'Thing', name: 'Nutrition' },
              { '@type': 'Thing', name: 'Weight Loss' },
              { '@type': 'Thing', name: 'Muscle Building' },
              { '@type': 'Thing', name: 'Home Workouts' },
              { '@type': 'Thing', name: 'Indian Diet Plans' },
              { '@type': 'Thing', name: 'Rehabilitation' },
            ],
            inLanguage: 'en',
            isAccessibleForFree: true,
          }),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'CollectionPage',
            name: 'Fitness Blog - Expert Tips, Workouts & Nutrition Advice',
            description:
              'Read expert fitness articles by Coach Himanshu. Science-backed workout tips, nutrition advice, diet plans, and inspiring transformation stories.',
            url: 'https://coachhimanshu.com/blog',
            isPartOf: {
              '@type': 'WebSite',
              name: 'Coach Himanshu',
              url: 'https://coachhimanshu.com',
            },
            about: {
              '@type': 'Thing',
              name: 'Fitness & Health Education',
            },
            audience: {
              '@type': 'Audience',
              audienceType: 'Fitness enthusiasts, beginners, athletes, health-conscious individuals',
            },
            creator: {
              '@type': 'Person',
              name: 'Coach Himanshu',
              url: 'https://coachhimanshu.com/about',
            },
            inLanguage: 'en',
            numberOfItems: 54,
          }),
        }}
      />
      {children}
    </>
  );
}
