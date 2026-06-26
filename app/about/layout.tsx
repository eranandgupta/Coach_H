import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'About Coach Himanshu - NASM Certified Fitness Expert & Educator',
  description:
    'Learn about Coach Himanshu — NASM Certified Bodybuilding Coach with 6+ professional diplomas. Discover the journey, qualifications, and mission behind 1000+ fitness transformations in India.',
  openGraph: {
    title: 'About Coach Himanshu - NASM Certified Fitness Expert',
    description:
      'NASM Certified Coach with 6+ diplomas. Discover the story behind 1000+ fitness transformations across India.',
    url: 'https://coachhimanshu.com/about',
  },
  alternates: {
    canonical: 'https://coachhimanshu.com/about',
  },
};

export default function AboutLayout({ children }: { children: React.ReactNode }) {
  const profilePageSchema = {
    '@context': 'https://schema.org',
    '@type': 'ProfilePage',
    mainEntity: {
      '@type': 'Person',
      '@id': 'https://coachhimanshu.com/#coach',
      name: 'Coach Himanshu',
      alternateName: 'Coach Himanshu',
      url: 'https://coachhimanshu.com',
      image: {
        '@type': 'ImageObject',
        url: 'https://coachhimanshu.com/coach-himanshu.jpg',
        width: 800,
        height: 800,
      },
      jobTitle: 'NASM Certified Fitness Coach',
      description:
        'NASM Certified Bodybuilding Coach with 6+ professional diplomas in fitness science, nutrition, and specialized training. Over 1000+ client transformations across India and internationally.',
      knowsAbout: [
        'Personal Training',
        'Nutrition Planning',
        'Bodybuilding',
        'Weight Loss',
        'Muscle Building',
        'Sports Nutrition',
        'TRX Training',
        'Corrective Exercise',
        'Rehabilitation',
        'PCOS Management',
        'Diabetes Management',
      ],
      sameAs: [
        'https://www.instagram.com/coach_himanshu_',
        'https://www.youtube.com/@coachhimanshu',
      ],
      alumniOf: {
        '@type': 'Organization',
        name: 'National Academy of Sports Medicine (NASM)',
        url: 'https://www.nasm.org',
      },
      hasCredential: [
        {
          '@type': 'EducationalOccupationalCredential',
          credentialCategory: 'Certification',
          name: 'NASM Certified Bodybuilding Coach',
          recognizedBy: { '@type': 'Organization', name: 'National Academy of Sports Medicine' },
        },
        {
          '@type': 'EducationalOccupationalCredential',
          credentialCategory: 'Certification',
          name: 'Sports Nutrition Specialist',
        },
        {
          '@type': 'EducationalOccupationalCredential',
          credentialCategory: 'Certification',
          name: 'Corrective Exercise Specialist (CES)',
        },
        {
          '@type': 'EducationalOccupationalCredential',
          credentialCategory: 'Certification',
          name: 'TRX Suspension Training Certified',
        },
        {
          '@type': 'EducationalOccupationalCredential',
          credentialCategory: 'Diploma',
          name: 'Diploma in Personal Training',
        },
        {
          '@type': 'EducationalOccupationalCredential',
          credentialCategory: 'Diploma',
          name: 'Diploma in Sports Nutrition',
        },
      ],
      worksFor: {
        '@type': 'Organization',
        name: 'Coach Himanshu Fitness Coaching',
        url: 'https://coachhimanshu.com',
      },
      makesOffer: {
        '@type': 'Offer',
        itemOffered: {
          '@type': 'Service',
          name: 'Online Fitness Coaching',
          description:
            'Personalized workout plans, custom meal plans, rehabilitation programs, and live training sessions with 24/7 WhatsApp support.',
          areaServed: { '@type': 'Country', name: 'India' },
          serviceType: 'Online Personal Training',
        },
        priceSpecification: {
          '@type': 'PriceSpecification',
          priceCurrency: 'INR',
          minPrice: '799',
          maxPrice: '29999',
        },
      },
    },
  };

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
              { '@type': 'ListItem', position: 2, name: 'About', item: 'https://coachhimanshu.com/about' },
            ],
          }),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(profilePageSchema) }}
      />
      {children}
    </>
  );
}
