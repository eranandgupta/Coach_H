'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import PreAssessmentForm from '@/components/PreAssessmentForm';

interface CoupleAssessmentFlowProps {
  userId: number;
  planName?: string;
  /** Partner 1's existing assessment (edit mode) */
  initialData?: any;
  /** Partner 2's existing assessment block (edit mode) */
  initialPartner2?: any;
  isEditMode?: boolean;
  onSuccess?: () => void;
  onCancel?: () => void;
}

/**
 * Couple plans share ONE account/login/dashboard, but the coach needs a full
 * assessment for BOTH partners. This wrapper runs the exact same PreAssessmentForm
 * twice — Partner 1, then Partner 2 — and submits them together as
 * { userId, ...partner1, partner2: {...} } to /api/assessment. Partner 2 is stored
 * as a single JSON block on the shared ClientAssessment row.
 */
export default function CoupleAssessmentFlow({
  userId,
  planName = '',
  initialData,
  initialPartner2,
  isEditMode = false,
  onSuccess,
  onCancel,
}: CoupleAssessmentFlowProps) {
  const router = useRouter();
  const [stage, setStage] = useState<'p1' | 'p2'>('p1');
  const [partner1Payload, setPartner1Payload] = useState<Record<string, any> | null>(null);

  const submitBoth = async (partner1: Record<string, any>, partner2: Record<string, any>) => {
    const response = await fetch('/api/assessment', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId, ...partner1, partner2 }),
    });

    if (!response.ok) {
      alert('Failed to submit the couple assessment. Please try again.');
      return; // stay on Partner 2 so the user can retry (form shows no second alert)
    }

    if (typeof window !== 'undefined' && typeof (window as any).gtag === 'function') {
      (window as any).gtag('event', 'assessment_submit', {
        event_category: 'conversion',
        event_label: 'Couple Fitness Assessment Completed',
        value: 1,
      });
    }

    if (isEditMode && onSuccess) {
      onSuccess();
    } else {
      router.push('/dashboard');
      router.refresh();
    }
  };

  if (stage === 'p1') {
    return (
      <PreAssessmentForm
        key="partner-1"
        userId={userId}
        planName={planName}
        isEditMode={isEditMode}
        initialData={initialData}
        partnerLabel="Partner 1 of 2 (Account holder)"
        submitButtonLabel="Continue to Partner 2 →"
        onCancel={onCancel}
        onComplete={(payload) => {
          setPartner1Payload(payload);
          setStage('p2');
          if (typeof window !== 'undefined') window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
      />
    );
  }

  return (
    <PreAssessmentForm
      key="partner-2"
      userId={userId}
      planName={planName}
      isEditMode={isEditMode}
      initialData={initialPartner2}
      partnerLabel="Partner 2 of 2"
      submitButtonLabel={isEditMode ? 'Save Both Partners' : 'Submit Couple Assessment'}
      onCancel={() => {
        setStage('p1');
        if (typeof window !== 'undefined') window.scrollTo({ top: 0, behavior: 'smooth' });
      }}
      onComplete={async (payload) => {
        await submitBoth(partner1Payload || {}, payload);
      }}
    />
  );
}
