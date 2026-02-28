'use client';

import { useState } from 'react';
import { Loader2 } from 'lucide-react';
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface Plan {
  id: number;
  name: string;
  price: number;
  duration: number;
}

interface Client {
  id: number;
  name: string;
  email: string;
}

interface RenewSubscriptionModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
  client: Client | null;
  plans: Plan[];
  mode: 'renew' | 'extend';
}

export default function RenewSubscriptionModal({
  open,
  onOpenChange,
  onSuccess,
  client,
  plans,
  mode,
}: RenewSubscriptionModalProps) {
  const [planId, setPlanId] = useState('');
  const [transactionId, setTransactionId] = useState('');
  const [paymentMode, setPaymentMode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const isExtend = mode === 'extend';
  const title = isExtend ? 'Extend Plan' : 'Renew Subscription';
  const submitLabel = isExtend ? 'Extend Plan' : 'Renew Subscription';
  const loadingLabel = isExtend ? 'Extending...' : 'Renewing...';

  function resetForm() {
    setPlanId('');
    setTransactionId('');
    setPaymentMode('');
    setError('');
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!client) return;

    setError('');
    setLoading(true);

    try {
      const token = localStorage.getItem('token');
      const res = await fetch('/api/admin/panel/subscriptions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          clientId: client.id,
          planId: Number(planId),
          transactionId,
          paymentMode,
          mode,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || data.error || `Failed to ${isExtend ? 'extend' : 'renew'} subscription`);
        return;
      }

      resetForm();
      onSuccess();
      onOpenChange(false);
    } catch (err) {
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
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            {title}
            {client && (
              <span className="block text-sm font-normal text-muted-foreground mt-1">
                {client.name}
              </span>
            )}
          </DialogTitle>
        </DialogHeader>

        {isExtend && (
          <p className="text-sm text-muted-foreground -mt-2">
            The selected plan duration will be added to the current subscription&apos;s end date.
          </p>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="plan">Plan</Label>
            <Select value={planId} onValueChange={setPlanId} required>
              <SelectTrigger id="plan">
                <SelectValue placeholder="Select a plan" />
              </SelectTrigger>
              <SelectContent>
                {plans.map((plan) => (
                  <SelectItem key={plan.id} value={String(plan.id)}>
                    {plan.name} - ₹{plan.price} ({plan.duration} days)
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="transactionId">Transaction ID</Label>
            <Input
              id="transactionId"
              value={transactionId}
              onChange={(e) => setTransactionId(e.target.value)}
              placeholder="Enter transaction ID"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="paymentMode">Payment Mode</Label>
            <Select value={paymentMode} onValueChange={setPaymentMode} required>
              <SelectTrigger id="paymentMode">
                <SelectValue placeholder="Select payment mode" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="cash">Cash</SelectItem>
                <SelectItem value="online">Online</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {error && (
            <p className="text-sm text-red-600">{error}</p>
          )}

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                resetForm();
                onOpenChange(false);
              }}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={loading || !planId || !paymentMode}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {loading ? loadingLabel : submitLabel}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
