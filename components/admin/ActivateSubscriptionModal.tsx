'use client';

import { useState, useEffect } from 'react';
import { Loader2, CheckCircle2, XCircle, Power, AlertTriangle } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface ActivateSubscriptionModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
  subscription: {
    id: number;
    endDate: string;
    startDate?: string;
    plan: { name: string };
    user: { id: number; name: string | null; email: string };
  } | null;
}

function toDateInput(date: Date) {
  // yyyy-mm-dd in local time for <input type="date">
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

export default function ActivateSubscriptionModal({
  open,
  onOpenChange,
  onSuccess,
  subscription,
}: ActivateSubscriptionModalProps) {
  const [status, setStatus] = useState<'active' | 'inactive'>('active');
  const [endDate, setEndDate] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Default the end date: current endDate if it's in the future, else 30 days from today.
  useEffect(() => {
    if (open && subscription) {
      const current = new Date(subscription.endDate);
      const base = current > new Date() ? current : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
      setEndDate(toDateInput(base));
      setStatus('active');
      setError('');
    }
  }, [open, subscription]);

  const newEndInPast = !!endDate && new Date(`${endDate}T23:59:59`) < new Date();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!subscription) return;

    if (status === 'active' && (!endDate || newEndInPast)) {
      setError('Please choose an end date in the future to activate the subscription.');
      return;
    }

    setError('');
    setLoading(true);

    try {
      const token = localStorage.getItem('token');
      const res = await fetch('/api/admin/subscriptions', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          id: subscription.id,
          // Deactivate uses 'cancelled', NOT 'expired'. checkSubscription() self-heals an
          // Elite (session-based) plan with sessions remaining back to 'active' whenever its
          // status is 'expired' — so an 'expired' deactivation silently reverts on the client's
          // next login / /me poll. 'cancelled' is the one status that self-heal never resurrects.
          status: status === 'active' ? 'active' : 'cancelled',
          // Set end date to end-of-day so an "activate until DD" reads inclusively.
          ...(status === 'active' ? { endDate: `${endDate}T23:59:59` } : {}),
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Failed to update subscription');
        return;
      }

      onSuccess();
      onOpenChange(false);
    } catch {
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[460px] bg-[#0d1117] border border-white/10 text-white">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-white">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-600 flex items-center justify-center">
              <Power className="w-4 h-4 text-white" />
            </div>
            <div>
              <span className="block">Activate / Deactivate</span>
              {subscription && (
                <span className="block text-sm font-normal text-gray-400 mt-0.5">
                  {subscription.user.name || subscription.user.email} &mdash; {subscription.plan.name}
                </span>
              )}
            </div>
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Status Toggle */}
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => setStatus('active')}
              className={`flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 border ${
                status === 'active'
                  ? 'bg-gradient-to-r from-emerald-500/20 to-green-500/10 border-emerald-500/40 text-emerald-400 shadow-lg shadow-emerald-500/10'
                  : 'bg-white/5 border-white/10 text-gray-400 hover:bg-white/10 hover:text-white'
              }`}
            >
              <CheckCircle2 className="w-4 h-4" />
              Active
            </button>
            <button
              type="button"
              onClick={() => setStatus('inactive')}
              className={`flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 border ${
                status === 'inactive'
                  ? 'bg-gradient-to-r from-red-500/20 to-orange-500/10 border-red-500/40 text-red-400 shadow-lg shadow-red-500/10'
                  : 'bg-white/5 border-white/10 text-gray-400 hover:bg-white/10 hover:text-white'
              }`}
            >
              <XCircle className="w-4 h-4" />
              Inactive
            </button>
          </div>

          {/* End Date (only when activating) */}
          {status === 'active' && (
            <div className="space-y-2">
              <Label htmlFor="endDate" className="text-gray-300">Active Until (End Date)</Label>
              <Input
                id="endDate"
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="bg-white/5 border-white/10 text-white placeholder:text-gray-500 focus:border-blue-500/50 focus:ring-blue-500/20 [color-scheme:dark]"
                required
              />
              <p className="text-xs text-gray-500">
                For session-based (Elite 1:1) plans the client also stays active while sessions remain.
              </p>
              {newEndInPast && (
                <div className="flex items-center gap-1.5 text-xs text-red-400">
                  <AlertTriangle className="w-3.5 h-3.5" />
                  End date must be in the future to keep the subscription active.
                </div>
              )}
            </div>
          )}

          {status === 'inactive' && (
            <div className="rounded-xl p-3 border bg-red-500/10 border-red-500/20 text-sm text-red-300">
              This will <span className="font-semibold">deactivate</span> the subscription. The client loses access
              immediately and stays deactivated — even for Elite 1:1 plans with sessions remaining — until you
              reactivate it here.
            </div>
          )}

          {error && (
            <p className="text-sm text-red-400 bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2">{error}</p>
          )}

          <DialogFooter className="gap-2 sm:gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="bg-white/5 border-white/10 text-gray-300 hover:bg-white/10 hover:text-white"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={loading}
              className={`text-white font-semibold ${
                status === 'active'
                  ? 'bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-500 hover:to-green-500 shadow-lg shadow-emerald-500/20'
                  : 'bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-500 hover:to-orange-500 shadow-lg shadow-red-500/20'
              }`}
            >
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {loading ? 'Saving...' : status === 'active' ? 'Activate' : 'Deactivate'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
