'use client';

import { Suspense, useEffect, useState } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Loader2 } from 'lucide-react';

/**
 * Cashfree sends clients here when its popup can't open (Instagram / WhatsApp in-app browsers).
 * The order's tags hold the plan and email, so /api/payment/verify can activate it from the ID alone.
 */
function PaymentReturn() {
  const orderId = useSearchParams().get('order_id') || '';
  const [state, setState] = useState<'checking' | 'success' | 'pending' | 'failed'>('checking');
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (!orderId) {
      setState('failed');
      setMessage('No order was found in this link.');
      return;
    }
    fetch('/api/payment/verify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ orderId }),
    })
      .then(async (res) => {
        const data = await res.json().catch(() => ({}));
        if (res.ok) {
          setState('success');
          setMessage(data.message || 'Payment successful. Your plan is active.');
        } else if (data.pending) {
          setState('pending');
          setMessage(data.error);
        } else {
          setState('failed');
          setMessage(data.error || 'We could not confirm this payment.');
        }
      })
      .catch(() => {
        setState('failed');
        setMessage('We could not reach the server. If money was taken, your plan will still be activated and emailed to you.');
      });
  }, [orderId]);

  const title = {
    checking: 'Confirming your payment',
    success: 'Payment successful',
    pending: 'Payment being confirmed',
    failed: 'Payment not completed',
  }[state];

  return (
    <div className="min-h-screen bg-brand-navy flex items-center justify-center px-4">
      <div className="text-center max-w-lg">
        {state === 'checking' && <Loader2 className="mx-auto mb-6 animate-spin text-brand-blue" size={40} />}
        <h1 className="text-2xl md:text-3xl font-semibold text-white mb-4">{title}</h1>
        {message && <p className="text-gray-400 mb-3 text-lg">{message}</p>}
        {orderId && <p className="text-gray-500 text-xs font-mono mb-8">Order ID: {orderId}</p>}
        {state !== 'checking' && (
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href={state === 'failed' ? '/#plans' : '/dashboard'}
              className="inline-flex items-center justify-center px-6 py-3 bg-brand-blue text-white font-semibold rounded-xl hover:bg-blue-600 transition-colors"
            >
              {state === 'failed' ? 'Try again' : 'Go to dashboard'}
            </Link>
            <Link
              href="/contact"
              className="inline-flex items-center justify-center px-6 py-3 border border-white/20 text-white font-semibold rounded-xl hover:bg-white/5 transition-colors"
            >
              Contact us
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}

export default function PaymentReturnPage() {
  return (
    <Suspense>
      <PaymentReturn />
    </Suspense>
  );
}
