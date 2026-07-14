import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Share Your Feedback | Coach Himanshu',
  description:
    'Share your experience with Coach Himanshu. Your feedback helps improve the coaching experience for everyone.',
  // Utility form page — keep it out of the search index (but crawlable so
  // Google can see this directive instead of guessing from a robots.txt block).
  robots: {
    index: false,
    follow: true,
  },
  alternates: {
    canonical: 'https://coachhimanshu.com/feedback',
  },
};

export default function FeedbackLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
