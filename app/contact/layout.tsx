import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Contact Coach Himanshu - Get in Touch for Fitness Coaching',
  description:
    'Contact Coach Himanshu for personalized fitness coaching, workout plans, and nutrition guidance. Reach out via WhatsApp, email, or social media.',
  openGraph: {
    title: 'Contact Coach Himanshu - Fitness Coaching Inquiries',
    description:
      'Get in touch with Coach Himanshu for personalized fitness coaching and nutrition plans.',
    url: 'https://coachhimanshu.com/contact',
  },
  alternates: {
    canonical: 'https://coachhimanshu.com/contact',
  },
};

export default function ContactLayout({ children }: { children: React.ReactNode }) {
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
              { '@type': 'ListItem', position: 2, name: 'Contact', item: 'https://coachhimanshu.com/contact' },
            ],
          }),
        }}
      />
      {children}
    </>
  );
}
