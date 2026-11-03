'use client';

import { useEffect, useState } from 'react';
import { AlertTriangle } from 'lucide-react';

interface Preview {
  currentPlanName: string | null;
  rollover: boolean;
  queuedAfterCoverage: boolean;
  carriedSessions: number;
  totalSessions: number | null;
  startDate: string;
  endDate: string;
}

function formatDate(value: string) {
  return new Date(value).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
}

/** Shows what submitting will do. Purely informational: a failed lookup never blocks the form. */
export default function RenewalPreview({
  clientId,
  planId,
  duration,
}: {
  clientId?: number;
  planId: string;
  duration?: string;
}) {
  const [preview, setPreview] = useState<Preview | null>(null);

  useEffect(() => {
    setPreview(null);
    if (!clientId || !planId) return;

    const controller = new AbortController();
    const params = new URLSearchParams({ clientId: String(clientId), planId });
    if (duration) params.set('duration', duration);

    fetch(`/api/admin/subscriptions/preview?${params}`, {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      signal: controller.signal,
    })
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => setPreview(data?.preview ?? null))
      .catch(() => {});

    return () => controller.abort();
  }, [clientId, planId, duration]);

  if (!preview) return null;

  const warn = preview.rollover || preview.queuedAfterCoverage;

  return (
    <div
      className={`rounded-lg border p-3 text-sm ${
        warn ? 'border-amber-500/40 bg-amber-500/10' : 'border-gray-500/30 bg-gray-500/10'
      }`}
    >
      {preview.rollover && (
        <div className="mb-2 flex gap-2">
          <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-amber-500" />
          <p>
            Client already has <strong>{preview.currentPlanName}</strong> running.{' '}
            {preview.carriedSessions} unused session(s) and the remaining days will carry over, and the
            current plan will be closed. If you are correcting a wrong plan, deactivate the current plan
            first so nothing carries over.
          </p>
        </div>
      )}
      {preview.queuedAfterCoverage && (
        <div className="mb-2 flex gap-2">
          <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-amber-500" />
          <p>
            Client already has coverage
            {preview.currentPlanName ? <> on <strong>{preview.currentPlanName}</strong></> : null}, so this
            plan will be queued and will not start until {formatDate(preview.startDate)}.
          </p>
        </div>
      )}
      <p>
        Result: {formatDate(preview.startDate)} to {formatDate(preview.endDate)}
        {preview.totalSessions !== null && <>, {preview.totalSessions} sessions</>}
      </p>
    </div>
  );
}
