import { prisma } from './prisma';

export type PromoEvaluation =
  | {
      ok: true;
      promoCode: { code: string; discountType: string; discountValue: number; description: string | null };
      discountAmount: number;
      finalAmount: number;
    }
  | { ok: false; error: string; status: number };

const round2 = (n: number) => Math.round(n * 100) / 100;

/** Discount a promo gives on `amount`, capped at the amount itself. */
export function promoDiscount(discountType: string, discountValue: number, amount: number): number {
  let discount = 0;
  if (discountType === 'percentage') discount = (amount * discountValue) / 100;
  else if (discountType === 'fixed') discount = discountValue;
  return Math.min(discount, amount);
}

/**
 * Single source of truth for "is this promo code valid for this cart, and what does it take
 * off?". Used by /api/promo-codes/validate (to show the discount) and by
 * /api/payment/create-order (to verify the amount the browser asks us to charge).
 */
export async function evaluatePromoCode(params: {
  code: string;
  cartTotal: number;
  planName?: string | null;
  userId?: number | null;
}): Promise<PromoEvaluation> {
  const { code, cartTotal, planName, userId } = params;

  const promoCode = await prisma.promoCode.findUnique({
    where: { code: code.toUpperCase() },
  });

  if (!promoCode) return { ok: false, error: 'Invalid promo code', status: 404 };
  if (!promoCode.isActive) return { ok: false, error: 'This promo code is no longer active', status: 400 };
  if (promoCode.expiryDate && new Date(promoCode.expiryDate) < new Date()) {
    return { ok: false, error: 'This promo code has expired', status: 400 };
  }
  if (promoCode.maxUses && promoCode.currentUses >= promoCode.maxUses) {
    return { ok: false, error: 'This promo code has reached its usage limit', status: 400 };
  }
  if (promoCode.minPurchaseAmount && cartTotal < Number(promoCode.minPurchaseAmount)) {
    return { ok: false, error: `Minimum purchase amount of ₹${promoCode.minPurchaseAmount} required`, status: 400 };
  }
  if (promoCode.targetUserId && userId !== promoCode.targetUserId) {
    return { ok: false, error: 'This promo code is not available for your account', status: 400 };
  }

  if (promoCode.applicablePlans && planName) {
    try {
      const applicablePlans = JSON.parse(promoCode.applicablePlans);
      if (Array.isArray(applicablePlans) && applicablePlans.length > 0) {
        const isApplicable = applicablePlans.some(
          (plan: string) => plan.toLowerCase() === planName.toLowerCase()
        );
        if (!isApplicable) {
          return { ok: false, error: `This promo code is only valid for: ${applicablePlans.join(', ')}`, status: 400 };
        }
      }
    } catch (error) {
      console.error('Error parsing applicablePlans:', error);
      // If parsing fails, allow the promo code to be used
    }
  }

  const discountValue = Number(promoCode.discountValue);
  const discountAmount = promoDiscount(promoCode.discountType, discountValue, cartTotal);

  return {
    ok: true,
    promoCode: {
      code: promoCode.code,
      discountType: promoCode.discountType,
      discountValue,
      description: promoCode.description,
    },
    discountAmount: round2(discountAmount),
    finalAmount: round2(cartTotal - discountAmount),
  };
}
