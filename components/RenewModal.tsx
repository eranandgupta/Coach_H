'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Check, Loader2, RefreshCw, ShieldCheck } from 'lucide-react';

interface RenewUser {
  name?: string;
  email?: string;
  phone?: string;
}

interface PlanOption {
  id: number;
  name: string;
  price: number | string;
}

interface RenewModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: RenewUser | null;
  /** Called after a successful renewal so the dashboard can refresh. */
  onRenewed: () => void;
}

export default function RenewModal({ isOpen, onClose, user, onRenewed }: RenewModalProps) {
  const [plans, setPlans] = useState<PlanOption[]>([]);
  const [loadingPlans, setLoadingPlans] = useState(false);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [processing, setProcessing] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState('');

  // Load the Razorpay checkout script once.
  useEffect(() => {
    if (document.getElementById('razorpay-checkout-js')) return;
    const script = document.createElement('script');
    script.id = 'razorpay-checkout-js';
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    document.body.appendChild(script);
  }, []);

  // Fetch active plans when the modal opens; reset transient state.
  useEffect(() => {
    if (!isOpen) return;
    setDone(false);
    setError('');
    setSelectedId(null);
    setLoadingPlans(true);
    fetch('/api/plans')
      .then((r) => r.json())
      .then((data) => setPlans(Array.isArray(data.plans) ? data.plans : []))
      .catch(() => setError('Could not load plans. Please try again.'))
      .finally(() => setLoadingPlans(false));
  }, [isOpen]);

  const onKey = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === 'Escape' && !processing) onClose();
    },
    [processing, onClose]
  );
  useEffect(() => {
    if (!isOpen) return;
    document.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [isOpen, onKey]);

  const selectedPlan = plans.find((p) => p.id === selectedId) || null;
  const priceOf = (p: PlanOption) => Number(p.price) || 0;

  const handlePay = async () => {
    if (!selectedPlan || !user?.email) return;
    setError('');
    setProcessing(true);
    try {
      const orderRes = await fetch('/api/payment/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: priceOf(selectedPlan),
          planId: selectedPlan.id,
          planName: selectedPlan.name,
          name: user.name || '',
          email: user.email,
        }),
      });
      if (!orderRes.ok) throw new Error('Failed to start payment. Please try again.');
      const orderData = await orderRes.json();

      const options = {
        key: orderData.keyId,
        amount: orderData.amount,
        currency: orderData.currency,
        name: 'Coach H',
        description: `Renew — ${selectedPlan.name}`,
        order_id: orderData.orderId,
        prefill: {
          name: user.name || '',
          email: user.email,
          contact: (user.phone || '').replace(/[^0-9]/g, ''),
        },
        theme: { color: '#175FFF' },
        handler: async (response: any) => {
          try {
            const verifyRes = await fetch('/api/payment/verify', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                planId: selectedPlan.id,
                name: user.name || '',
                email: user.email,
              }),
            });
            if (!verifyRes.ok) {
              const errData = await verifyRes.json().catch(() => ({}));
              throw new Error(errData.error || 'Verification failed');
            }
            setDone(true);
            setProcessing(false);
            onRenewed();
          } catch (err: any) {
            setProcessing(false);
            setError(
              `Payment received but activation failed. Please contact support with Payment ID: ${response.razorpay_payment_id}`
            );
          }
        },
        modal: { ondismiss: () => setProcessing(false) },
      };

      const rzp = new (window as any).Razorpay(options);
      rzp.on('payment.failed', () => {
        setError('Payment failed. Please try again.');
        setProcessing(false);
      });
      rzp.open();
    } catch (err: any) {
      setError(err.message || 'Something went wrong. Please try again.');
      setProcessing(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[60] flex items-center justify-center bg-black/70 backdrop-blur-sm p-3 md:p-6"
          onClick={() => !processing && onClose()}
        >
          <motion.div
            initial={{ scale: 0.96, y: 20, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            exit={{ scale: 0.96, y: 20, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 300, damping: 28 }}
            className="relative w-full max-w-md max-h-[90vh] overflow-y-auto rounded-2xl border border-white/10 bg-[#0b1120] shadow-2xl"
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
            aria-label="Renew subscription"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-white/10">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <RefreshCw size={18} className="text-brand-blue" /> Renew Subscription
              </h3>
              <button
                type="button"
                onClick={onClose}
                disabled={processing}
                aria-label="Close"
                className="w-9 h-9 flex items-center justify-center rounded-lg border border-white/10 text-gray-400 hover:text-white hover:bg-white/5 disabled:opacity-40"
              >
                <X size={18} />
              </button>
            </div>

            {done ? (
              /* Success state */
              <div className="p-8 text-center">
                <div className="w-16 h-16 mx-auto rounded-full bg-green-500/15 border border-green-500/30 flex items-center justify-center mb-4">
                  <Check size={30} className="text-green-400" />
                </div>
                <h4 className="text-xl font-bold text-white mb-2">You&apos;re active again! 🎉</h4>
                <p className="text-gray-400 text-sm mb-6">
                  Your {selectedPlan?.name} is now active. Welcome back — let&apos;s get to work.
                </p>
                <button
                  type="button"
                  onClick={onClose}
                  className="w-full py-3 rounded-xl bg-brand-blue text-white font-semibold hover:bg-blue-600 transition-colors"
                >
                  Go to Dashboard
                </button>
              </div>
            ) : (
              <div className="p-5">
                <p className="text-sm text-gray-400 mb-4">
                  Pick a plan to reactivate your coaching. Your new plan starts today.
                </p>

                {loadingPlans ? (
                  <div className="flex items-center justify-center py-10 text-gray-400">
                    <Loader2 className="animate-spin mr-2" size={18} /> Loading plans…
                  </div>
                ) : (
                  <div className="space-y-2 mb-5">
                    {plans.map((p) => {
                      const active = p.id === selectedId;
                      return (
                        <button
                          key={p.id}
                          type="button"
                          onClick={() => setSelectedId(p.id)}
                          aria-pressed={active}
                          className={`w-full flex items-center justify-between px-4 py-3 rounded-xl border text-left transition-all ${
                            active
                              ? 'border-brand-blue bg-brand-blue/10'
                              : 'border-white/10 bg-white/[0.02] hover:border-white/20'
                          }`}
                        >
                          <span className="flex items-center gap-3">
                            <span
                              className={`w-4 h-4 rounded-full border flex items-center justify-center flex-shrink-0 ${
                                active ? 'border-brand-blue bg-brand-blue' : 'border-white/30'
                              }`}
                            >
                              {active && <Check size={11} className="text-white" />}
                            </span>
                            <span className="text-sm font-medium text-white">{p.name}</span>
                          </span>
                          <span className="text-brand-gold font-bold">
                            ₹{priceOf(p).toLocaleString('en-IN')}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                )}

                {error && (
                  <p className="text-red-400 text-xs mb-3 leading-relaxed">{error}</p>
                )}

                <button
                  type="button"
                  onClick={handlePay}
                  disabled={!selectedPlan || processing}
                  className={`w-full py-3 rounded-xl font-bold transition-all flex items-center justify-center gap-2 ${
                    !selectedPlan || processing
                      ? 'bg-white/[0.06] text-gray-500 cursor-not-allowed'
                      : 'bg-brand-blue text-white hover:bg-blue-600 shadow-lg shadow-brand-blue/25'
                  }`}
                >
                  {processing ? (
                    <>
                      <Loader2 className="animate-spin" size={18} /> Processing…
                    </>
                  ) : selectedPlan ? (
                    `Pay ₹${priceOf(selectedPlan).toLocaleString('en-IN')} & Renew`
                  ) : (
                    'Select a plan'
                  )}
                </button>

                <p className="flex items-center justify-center gap-1.5 text-[11px] text-gray-500 mt-3">
                  <ShieldCheck size={13} /> Secure payment via Razorpay
                </p>
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
