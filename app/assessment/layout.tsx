import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Free Fitness Assessment - Evaluate Your Fitness Level',
  description:
    'Take a free fitness assessment with Coach Himanshu. Evaluate your current fitness level and get personalized recommendations for your transformation journey.',
  openGraph: {
    title: 'Free Fitness Assessment | Coach Himanshu',
    description:
      'Evaluate your fitness level and get personalized recommendations from a NASM Certified Coach.',
    url: 'https://coachhimanshu.com/assessment',
  },
  alternates: {
    canonical: 'https://coachhimanshu.com/assessment',
  },
};

export default function AssessmentLayout({ children }: { children: React.ReactNode }) {
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
              { '@type': 'ListItem', position: 2, name: 'Fitness Assessment', item: 'https://coachhimanshu.com/assessment' },
            ],
          }),
        }}
      />
      {children}
    </>
  );
}
