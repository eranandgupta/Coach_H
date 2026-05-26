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
  return children;
}
