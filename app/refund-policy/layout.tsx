import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Refund Policy',
  description: 'Refund Policy for Coach Himanshu fitness coaching services. Learn about our refund process and eligibility criteria.',
  alternates: {
    canonical: 'https://coachhimanshu.com/refund-policy',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RefundPolicyLayout({ children }: { children: React.ReactNode }) {
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
              { '@type': 'ListItem', position: 2, name: 'Refund Policy', item: 'https://coachhimanshu.com/refund-policy' },
            ],
          }),
        }}
      />
      {children}
    </>
  );
}
