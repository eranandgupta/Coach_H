'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, CreditCard, Calendar, CheckCircle, Loader2 } from 'lucide-react';

interface SubscriptionManagementModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  client: any;
}

export default function SubscriptionManagementModal({
  isOpen,
  onClose,
  onSuccess,
  client,
}: SubscriptionManagementModalProps) {
  const [plans, setPlans] = useState<any[]>([]);
  const [selectedPlanId, setSelectedPlanId] = useState('');
  const [customDuration, setCustomDuration] = useState('');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<any>({});

  useEffect(() => {
    if (isOpen) {
      fetchPlans();
    }
  }, [isOpen]);

  const fetchPlans = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/subscriptions/plans', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setPlans(data.plans);
        if (data.plans.length > 0) {
          setSelectedPlanId(data.plans[0].id.toString());
        }
      }
    } catch (error) {
      console.error('Error fetching plans:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedPlanId) {
      setErrors({ submit: 'Please select a plan' });
      return;
    }

    setLoading(true);
    setErrors({});

    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/admin/subscriptions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          clientId: client.id,
          planId: parseInt(selectedPlanId),
          duration: customDuration ? parseInt(customDuration) : undefined,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setErrors({ submit: data.error || 'Failed to create subscription' });
        return;
      }

      onSuccess();
      onClose();
    } catch (error) {
      console.error('Error creating subscription:', error);
      setErrors({ submit: 'An error occurred. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  const selectedPlan = plans.find((p) => p.id.toString() === selectedPlanId);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/70 z-50 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={onClose}
        >
          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-md bg-gradient-to-br from-brand-navy-light to-black border border-white/10 rounded-2xl shadow-2xl max-h-[85vh] flex flex-col overflow-hidden"
          >
            {/* Header */}
            <div className="flex-shrink-0 bg-brand-navy/90 backdrop-blur-md border-b border-white/10 p-6 flex items-center justify-between">
              <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                <CreditCard className="w-6 h-6 text-brand-blue" />
                Add Subscription
              </h2>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <X size={24} />
              </button>
            </div>

            {/* Form */}
            <div className="flex-1 overflow-y-auto">
              <form onSubmit={handleSubmit} className="p-6 space-y-5">
              {/* Client Info */}
              <div className="bg-white/5 border border-white/10 rounded-lg p-4">
                <p className="text-gray-400 text-sm mb-1">Creating subscription for:</p>
                <p className="text-white font-semibold">{client?.name}</p>
                <p className="text-gray-400 text-sm">{client?.email}</p>
              </div>

              {/* Select Plan */}
              <div>
                <label className="block text-gray-300 text-sm font-medium mb-3">
                  <CreditCard className="w-4 h-4 inline mr-2" />
                  Select Subscription Plan *
                </label>
                <div className="space-y-2">
                  {plans.map((plan) => (
                    <label
                      key={plan.id}
                      className={`block bg-white/5 border ${
                        selectedPlanId === plan.id.toString()
                          ? 'border-brand-blue'
                          : 'border-white/10'
                      } rounded-lg p-4 cursor-pointer hover:bg-white/10 transition-all`}
                    >
                      <input
                        type="radio"
                        name="plan"
                        value={plan.id}
                        checked={selectedPlanId === plan.id.toString()}
                        onChange={(e) => setSelectedPlanId(e.target.value)}
                        className="hidden"
                      />
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="text-white font-semibold">{plan.name}</h3>
                            {selectedPlanId === plan.id.toString() && (
                              <CheckCircle className="w-5 h-5 text-brand-blue" />
                            )}
                          </div>
                          <p className="text-gray-400 text-sm mb-2">
                            {plan.description}
                          </p>
                          <p className="text-gray-500 text-xs">
                            Duration: {plan.duration} days
                          </p>
                        </div>
                        <div className="text-right ml-4">
                          <p className="text-brand-gold font-bold text-xl">
                            ₹{Number(plan.price).toLocaleString()}
                          </p>
                        </div>
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              {/* Custom Duration */}
              <div>
                <label className="block text-gray-300 text-sm font-medium mb-2">
                  <Calendar className="w-4 h-4 inline mr-2" />
                  Custom Duration (Optional)
                </label>
                <input
                  type="number"
                  value={customDuration}
                  onChange={(e) => setCustomDuration(e.target.value)}
                  className="w-full bg-brand-navy/50 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-brand-blue"
                  placeholder={`Default: ${selectedPlan?.duration || 0} days`}
                  min="1"
                />
                <p className="text-gray-500 text-xs mt-1">
                  Leave blank to use the plan's default duration
                </p>
              </div>

              {/* Summary */}
              {selectedPlan && (
                <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-4">
                  <h4 className="text-green-400 font-semibold mb-2 flex items-center gap-2">
                    <CheckCircle className="w-4 h-4" />
                    Subscription Summary
                  </h4>
                  <div className="space-y-1 text-sm text-gray-300">
                    <p>
                      Plan:{' '}
                      <span className="text-white font-medium">
                        {selectedPlan.name}
                      </span>
                    </p>
                    <p>
                      Duration:{' '}
                      <span className="text-white font-medium">
                        {customDuration || selectedPlan.duration} days
                      </span>
                    </p>
                    <p>
                      Price:{' '}
                      <span className="text-white font-medium">
                        ₹{Number(selectedPlan.price).toLocaleString()}
                      </span>
                    </p>
                  </div>
                </div>
              )}

              {/* Error Message */}
              {errors.submit && (
                <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-3">
                  <p className="text-red-400 text-sm">{errors.submit}</p>
                </div>
              )}

              {/* Buttons */}
              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 bg-white/10 text-white py-3 rounded-lg hover:bg-white/20 transition-all font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading || !selectedPlanId}
                  className="flex-1 bg-gradient-to-r from-green-500 to-emerald-500 text-white py-3 rounded-lg hover:shadow-[0_0_30px_rgba(34,197,94,0.4)] transition-all font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {loading && <Loader2 className="w-4 h-4 animate-spin" />}
                  Create Subscription
                </button>
              </div>
            </form>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
