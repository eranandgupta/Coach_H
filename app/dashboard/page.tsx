'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { loadSession } from '@/lib/session';

export default function DashboardRedirect() {
  const router = useRouter();
  const [error, setError] = useState('');

  useEffect(() => {
    const redirectUser = async () => {
      try {
        // Restores from the session cookie if localStorage was wiped; only a real
        // 401 means "not logged in". Transient errors retry instead of logging out.
        const session = await loadSession();
        if (session.status === 'unauthenticated') {
          router.push('/');
          return;
        }
        if (session.status === 'error') {
          setError('Connection problem. Retrying…');
          setTimeout(redirectUser, 3000);
          return;
        }
        const data = session;
        const userRole = data.user?.role;
        const assessmentCompleted = data.user?.assessmentCompleted;
        console.log('User role:', userRole);
        console.log('Assessment completed:', assessmentCompleted);

        // Redirect based on role
        if (userRole === 'admin') {
          console.log('Redirecting to admin dashboard');
          router.push('/admin/dashboard');
        } else if (userRole === 'coach') {
          console.log('Redirecting to coach dashboard');
          router.push('/dashboard/coach');
        } else if (userRole === 'trainer') {
          console.log('Redirecting to trainer dashboard');
          router.push('/dashboard/trainer');
        } else {
          // Check if client has completed assessment
          if (!assessmentCompleted) {
            console.log('Client needs to complete assessment, redirecting...');
            router.push('/assessment');
          } else {
            console.log('Redirecting to client dashboard');
            router.push('/dashboard/client');
          }
        }
      } catch (error) {
        console.error('Error redirecting user:', error);
        setError('Failed to load dashboard. Retrying…');
        setTimeout(redirectUser, 3000);
      }
    };

    redirectUser();
  }, [router]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-brand-navy via-brand-navy-light to-brand-navy flex items-center justify-center">
      <div className="text-center">
        {error ? (
          <div className="text-red-400 text-xl">{error}</div>
        ) : (
          <>
            <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-brand-blue mx-auto mb-4"></div>
            <p className="text-white text-xl">Loading your dashboard...</p>
          </>
        )}
      </div>
    </div>
  );
}
