import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Disclaimer',
  description: 'Medical and fitness disclaimer for Coach Himanshu coaching services. Important health and safety information.',
  alternates: {
    canonical: 'https://coachhimanshu.com/disclaimer',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function DisclaimerLayout({ children }: { children: React.ReactNode }) {
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
              { '@type': 'ListItem', position: 2, name: 'Disclaimer', item: 'https://coachhimanshu.com/disclaimer' },
            ],
          }),
        }}
      />
      {children}
    </>
  );
}
