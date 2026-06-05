import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Fit Bharat Mission - Free Workout & Diet Plans for Everyone',
  description:
    'Join the Fit Bharat Mission by Coach Himanshu. Get FREE science-based general workout plans and diet plans. Beginner-friendly fitness programs for all Indians.',
  openGraph: {
    title: 'Fit Bharat Mission - Free Workout & Diet Plans | Coach Himanshu',
    description:
      'FREE science-based workout and diet plans for everyone. Start your fitness journey with beginner-friendly programs.',
    url: 'https://coachhimanshu.com/fit-bharat-mission',
  },
  alternates: {
    canonical: 'https://coachhimanshu.com/fit-bharat-mission',
  },
};

export default function FitBharatLayout({ children }: { children: React.ReactNode }) {
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
              { '@type': 'ListItem', position: 2, name: 'Fit Bharat Mission', item: 'https://coachhimanshu.com/fit-bharat-mission' },
            ],
          }),
        }}
      />
      {children}
    </>
  );
}
