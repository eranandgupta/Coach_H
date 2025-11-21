'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import PreAssessmentForm from '@/components/PreAssessmentForm';
import { Loader2 } from 'lucide-react';

export default function AssessmentPage() {
  const router = useRouter();
  const [userId, setUserId] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get user from session/localStorage
    const userStr = localStorage.getItem('user');
    if (!userStr) {
      router.push('/');
      return;
    }

    const user = JSON.parse(userStr);

    // If user is a coach, redirect to dashboard (coaches don't need assessment)
    if (user.role === 'coach') {
      router.push('/dashboard');
      return;
    }

    // If assessment already completed, redirect to dashboard
    if (user.assessmentCompleted) {
      router.push('/dashboard');
      return;
    }

    setUserId(user.id);
    setLoading(false);
  }, [router]);

  if (loading || !userId) {
    return (
      <div className="min-h-screen bg-brand-navy flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-brand-blue animate-spin mx-auto mb-4" />
          <p className="text-gray-400">Loading assessment form...</p>
        </div>
      </div>
    );
  }

  return <PreAssessmentForm userId={userId} />;
}
