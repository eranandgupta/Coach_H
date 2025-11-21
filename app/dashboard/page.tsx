'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function DashboardRedirect() {
  const router = useRouter();
  const [error, setError] = useState('');

  useEffect(() => {
    const redirectUser = async () => {
      try {
        console.log('Dashboard redirect: Checking for token...');
        const token = localStorage.getItem('token');

        if (!token) {
          console.log('No token found, redirecting to home');
          router.push('/');
          return;
        }

        console.log('Token found, fetching user data...');
        // Fetch user data to determine role
        const res = await fetch('/api/auth/me', {
          headers: { Authorization: `Bearer ${token}` },
        });

        console.log('API response status:', res.status);

        if (!res.ok) {
          console.log('Invalid token, removing and redirecting');
          localStorage.removeItem('token');
          router.push('/');
          return;
        }

        const data = await res.json();
        const userRole = data.user?.role;
        const assessmentCompleted = data.user?.assessmentCompleted;
        console.log('User role:', userRole);
        console.log('Assessment completed:', assessmentCompleted);

        // Redirect based on role
        if (userRole === 'coach') {
          console.log('Redirecting to coach dashboard');
          router.push('/dashboard/coach');
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
        setError('Failed to load dashboard. Please try again.');
        setTimeout(() => router.push('/'), 2000);
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
