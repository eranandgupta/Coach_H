'use client';

import { useState } from 'react';
import { Loader2, CalendarPlus, CalendarMinus, Sparkles, AlertTriangle } from 'lucide-react';
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

interface AdjustDaysModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
  subscription: {
    id: number;
    endDate: string;
    startDate: string;
    plan: { name: string };
    user: { id: number; name: string | null; email: string };
  } | null;
}

export default function AdjustDaysModal({
  open,
  onOpenChange,
  onSuccess,
  subscription,
}: AdjustDaysModalProps) {
  const [days, setDays] = useState('');
  const [mode, setMode] = useState<'add' | 'remove'>('add');
  const [reason, setReason] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  function resetForm() {
    setDays('');
    setMode('add');
    setReason('');
    setError('');
  }

  const currentEndDate = subscription ? new Date(subscription.endDate) : new Date();
  const adjustValue = parseInt(days) || 0;
  const adjustedDays = mode === 'add' ? adjustValue : -adjustValue;
  const newEndDate = new Date(currentEndDate.getTime() + adjustedDays * 24 * 60 * 60 * 1000);
  const isNewDateInPast = newEndDate < new Date();

  function formatDate(date: Date) {
    return date.toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!subscription || !adjustValue) return;

    setError('');
    setLoading(true);

    try {
      const token = localStorage.getItem('token');
      const res = await fetch('/api/admin/subscriptions/adjust-days', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          subscriptionId: subscription.id,
          adjustDays: adjustedDays,
          reason,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Failed to adjust subscription days');
        return;
      }

      resetForm();
      onSuccess();
      onOpenChange(false);
    } catch {
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(value) => {
        if (!value) resetForm();
        onOpenChange(value);
      }}
    >
      <DialogContent className="sm:max-w-[460px] bg-[#0d1117] border border-white/10 text-white">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-white">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <div>
              <span className="block">Adjust Days</span>
              {subscription && (
                <span className="block text-sm font-normal text-gray-400 mt-0.5">
                  {subscription.user.name || subscription.user.email} &mdash; {subscription.plan.name}
                </span>
              )}
            </div>
          </DialogTitle>
        </DialogHeader>

        {/* Current End Date Display */}
        <div className="bg-white/5 border border-white/10 rounded-xl p-3 -mt-1">
          <p className="text-xs text-gray-400 mb-1">Current End Date</p>
          <p className="text-sm font-semibold text-white">{formatDate(currentEndDate)}</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Add / Remove Toggle */}
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => setMode('add')}
              className={`flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 border ${
                mode === 'add'
                  ? 'bg-gradient-to-r from-emerald-500/20 to-green-500/10 border-emerald-500/40 text-emerald-400 shadow-lg shadow-emerald-500/10'
                  : 'bg-white/5 border-white/10 text-gray-400 hover:bg-white/10 hover:text-white'
              }`}
            >
              <CalendarPlus className="w-4 h-4" />
              Add Days
            </button>
            <button
              type="button"
              onClick={() => setMode('remove')}
              className={`flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 border ${
                mode === 'remove'
                  ? 'bg-gradient-to-r from-red-500/20 to-orange-500/10 border-red-500/40 text-red-400 shadow-lg shadow-red-500/10'
                  : 'bg-white/5 border-white/10 text-gray-400 hover:bg-white/10 hover:text-white'
              }`}
            >
              <CalendarMinus className="w-4 h-4" />
              Remove Days
            </button>
          </div>

          {/* Days Input */}
          <div className="space-y-2">
            <Label htmlFor="days" className="text-gray-300">Number of Days</Label>
            <Input
              id="days"
              type="number"
              min="1"
              max="365"
              value={days}
              onChange={(e) => setDays(e.target.value)}
              placeholder="e.g. 7"
              required
              className="bg-white/5 border-white/10 text-white placeholder:text-gray-500 focus:border-violet-500/50 focus:ring-violet-500/20"
            />
          </div>

          {/* Reason (Optional) */}
          <div className="space-y-2">
            <Label htmlFor="reason" className="text-gray-300">
              Reason <span className="text-gray-500 text-xs">(optional)</span>
            </Label>
            <Input
              id="reason"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="e.g. Special adjustment, compensatory days..."
              className="bg-white/5 border-white/10 text-white placeholder:text-gray-500 focus:border-violet-500/50 focus:ring-violet-500/20"
            />
          </div>

          {/* Preview */}
          {adjustValue > 0 && (
            <div className={`rounded-xl p-3 border ${
              mode === 'add'
                ? 'bg-emerald-500/10 border-emerald-500/20'
                : isNewDateInPast
                ? 'bg-red-500/10 border-red-500/20'
                : 'bg-orange-500/10 border-orange-500/20'
            }`}>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-gray-400 mb-1">New End Date</p>
                  <p className={`text-sm font-bold ${
                    mode === 'add' ? 'text-emerald-400' : isNewDateInPast ? 'text-red-400' : 'text-orange-400'
                  }`}>
                    {formatDate(newEndDate)}
                  </p>
                </div>
                <div className={`text-right px-3 py-1.5 rounded-lg text-xs font-semibold ${
                  mode === 'add'
                    ? 'bg-emerald-500/20 text-emerald-400'
                    : 'bg-red-500/20 text-red-400'
                }`}>
                  {mode === 'add' ? '+' : '-'}{adjustValue} day{adjustValue !== 1 ? 's' : ''}
                </div>
              </div>
              {isNewDateInPast && mode === 'remove' && (
                <div className="flex items-center gap-1.5 mt-2 text-xs text-red-400">
                  <AlertTriangle className="w-3.5 h-3.5" />
                  Subscription will be marked as expired
                </div>
              )}
            </div>
          )}

          {error && (
            <p className="text-sm text-red-400 bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2">{error}</p>
          )}

          <DialogFooter className="gap-2 sm:gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                resetForm();
                onOpenChange(false);
              }}
              className="bg-white/5 border-white/10 text-gray-300 hover:bg-white/10 hover:text-white"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={loading || !adjustValue}
              className={`text-white font-semibold ${
                mode === 'add'
                  ? 'bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-500 hover:to-green-500 shadow-lg shadow-emerald-500/20'
                  : 'bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-500 hover:to-orange-500 shadow-lg shadow-red-500/20'
              }`}
            >
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {loading
                ? 'Applying...'
                : mode === 'add'
                ? `Add ${adjustValue || ''} Day${adjustValue !== 1 ? 's' : ''}`
                : `Remove ${adjustValue || ''} Day${adjustValue !== 1 ? 's' : ''}`
              }
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
