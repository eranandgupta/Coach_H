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
import { Checkbox } from '@/components/ui/checkbox';

interface Client {
  id: number;
  name: string;
  email: string;
}

interface CreatePromoCodeModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
  clients: Client[];
}

const APPLICABLE_PLANS = [
  'Kickstart Plan',
  'Consistency Plan',
  'Strength Plan',
  'Mastery Plan',
  'Rehabilitation Plan',
];

export default function CreatePromoCodeModal({
  open,
  onOpenChange,
  onSuccess,
  clients,
}: CreatePromoCodeModalProps) {
  const [code, setCode] = useState('');
  const [discountType, setDiscountType] = useState('');
  const [discountValue, setDiscountValue] = useState('');
  const [maxUses, setMaxUses] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [description, setDescription] = useState('');
  const [targetClient, setTargetClient] = useState('');
  const [applicablePlans, setApplicablePlans] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  function generateCode() {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let result = '';
    for (let i = 0; i < 8; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setCode(result);
  }

  function handlePlanToggle(plan: string) {
    setApplicablePlans((prev) =>
      prev.includes(plan)
        ? prev.filter((p) => p !== plan)
        : [...prev, plan]
    );
  }

  function resetForm() {
    setCode('');
    setDiscountType('');
    setDiscountValue('');
    setMaxUses('');
    setExpiryDate('');
    setDescription('');
    setTargetClient('');
    setApplicablePlans([]);
    setError('');
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const token = localStorage.getItem('token');

      const body: Record<string, unknown> = {
        code,
        discountType,
        discountValue: Number(discountValue),
        applicablePlans,
      };

      if (maxUses) body.maxUses = Number(maxUses);
      if (expiryDate) body.expiryDate = expiryDate;
      if (description) body.description = description;
      if (targetClient) body.targetUserId = Number(targetClient);

      const res = await fetch('/api/admin/promo-codes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(body),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || data.error || 'Failed to create promo code');
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
      <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create Promo Code</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="code">Code *</Label>
            <div className="flex gap-2">
              <Input
                id="code"
                value={code}
                onChange={(e) => setCode(e.target.value.toUpperCase())}
                placeholder="Enter promo code"
                required
              />
              <Button
                type="button"
                variant="outline"
                onClick={generateCode}
                className="shrink-0"
              >
                Auto-generate
              </Button>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="discountType">Discount Type</Label>
            <Select value={discountType} onValueChange={setDiscountType} required>
              <SelectTrigger id="discountType">
                <SelectValue placeholder="Select discount type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="percentage">Percentage</SelectItem>
                <SelectItem value="fixed">Fixed</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="discountValue">Discount Value *</Label>
            <Input
              id="discountValue"
              type="number"
              value={discountValue}
              onChange={(e) => setDiscountValue(e.target.value)}
              placeholder={discountType === 'percentage' ? 'e.g. 20' : 'e.g. 500'}
              required
              min={0}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="maxUses">Max Uses</Label>
            <Input
              id="maxUses"
              type="number"
              value={maxUses}
              onChange={(e) => setMaxUses(e.target.value)}
              placeholder="Leave empty for unlimited"
              min={1}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="expiryDate">Expiry Date</Label>
            <Input
              id="expiryDate"
              type="date"
              value={expiryDate}
              onChange={(e) => setExpiryDate(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Input
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Optional description"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="targetClient">Target Client</Label>
            <Select value={targetClient} onValueChange={setTargetClient}>
              <SelectTrigger id="targetClient">
                <SelectValue placeholder="All Clients" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Clients</SelectItem>
                {clients.map((client) => (
                  <SelectItem key={client.id} value={String(client.id)}>
                    {client.name} ({client.email})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Applicable Plans</Label>
            <div className="space-y-2">
              {APPLICABLE_PLANS.map((plan) => (
                <div key={plan} className="flex items-center space-x-2">
                  <Checkbox
                    id={`plan-${plan}`}
                    checked={applicablePlans.includes(plan)}
                    onCheckedChange={() => handlePlanToggle(plan)}
                  />
                  <Label
                    htmlFor={`plan-${plan}`}
                    className="text-sm font-normal cursor-pointer"
                  >
                    {plan}
                  </Label>
                </div>
              ))}
            </div>
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
              disabled={loading || !code || !discountType || !discountValue}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {loading ? 'Creating...' : 'Create Promo Code'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
