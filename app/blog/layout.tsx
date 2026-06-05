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
      {children}
    </>
  );
}
