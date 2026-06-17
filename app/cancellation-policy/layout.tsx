import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Cancellation Policy',
  description: 'Cancellation Policy for Coach Himanshu fitness coaching subscriptions. Understand our cancellation process and terms.',
  alternates: {
    canonical: 'https://coachhimanshu.com/cancellation-policy',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function CancellationPolicyLayout({ children }: { children: React.ReactNode }) {
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
              { '@type': 'ListItem', position: 2, name: 'Cancellation Policy', item: 'https://coachhimanshu.com/cancellation-policy' },
            ],
          }),
        }}
      />
      {children}
    </>
  );
}
