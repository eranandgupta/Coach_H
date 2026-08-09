import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

/**
 * Azaadi (Independence Day) "Spin & Win" endpoint.
 *
 * One spin per device: the browser sends a stable `deviceId` (also gated client-side
 * via localStorage). The winning prize is chosen SERVER-SIDE from a weighted table so
 * it can't be tampered with, then persisted as a real one-time-use PromoCode
 * (maxUses = 1) that plugs straight into the existing checkout validate/apply flow.
 *
 * Prizes are strictly 10 / 20 / 25 / 30 % — never 50, never above 30. The captured
 * email/phone lead + device id are stored on the coupon's `applicablePlans` field as
 * a JSON object (NOT the client-visible `description`, so the lead never leaks through
 * the validate endpoint). A non-array value there is ignored by the validate route, so
 * the coupon still applies to all plans. AZS-prefixed codes are also excluded from the
 * public marquee — see app/api/promo-codes/active/route.ts.
 */

// Weighted prize table. Higher discounts are rarer. Sums to 100.
const PRIZE_TABLE: { prize: number; weight: number }[] = [
  { prize: 10, weight: 40 },
  { prize: 20, weight: 30 },
  { prize: 25, weight: 20 },
  { prize: 30, weight: 10 },
];

// Sale window end — Aug 20, 2026, 23:59:59 IST.
const EXPIRY = new Date('2026-08-20T23:59:59+05:30');

// Unambiguous alphabet (no O/0, I/1) for readable codes.
const CODE_CHARS = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';

function pickPrize(): number {
  const total = PRIZE_TABLE.reduce((s, p) => s + p.weight, 0);
  let r = Math.random() * total;
  for (const { prize, weight } of PRIZE_TABLE) {
    if (r < weight) return prize;
    r -= weight;
  }
  return PRIZE_TABLE[0].prize;
}

function randomSuffix(len = 4): string {
  let out = '';
  for (let i = 0; i < len; i++) {
    out += CODE_CHARS[Math.floor(Math.random() * CODE_CHARS.length)];
  }
  return out;
}

async function generateUniqueCode(prize: number): Promise<string> {
  for (let attempt = 0; attempt < 8; attempt++) {
    const code = `AZS${prize}${randomSuffix()}`;
    const existing = await prisma.promoCode.findUnique({ where: { code } });
    if (!existing) return code;
  }
  // Extremely unlikely fallback with a longer suffix.
  return `AZS${prize}${randomSuffix(6)}`;
}

function isValidContact(raw: string): boolean {
  const v = raw.trim();
  const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
  const digits = v.replace(/\D/g, '');
  const phoneOk = /^[0-9+\-\s]{7,20}$/.test(v) && digits.length >= 7 && digits.length <= 15;
  return emailOk || phoneOk;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const deviceId: string = (body?.deviceId || '').toString().trim();
    const contact: string = (body?.contact || '').toString().trim();

    if (!deviceId || deviceId.length < 6 || deviceId.length > 100) {
      return NextResponse.json({ error: 'Invalid device' }, { status: 400 });
    }
    if (!contact || !isValidContact(contact)) {
      return NextResponse.json(
        { error: 'Please enter a valid email or phone number' },
        { status: 400 }
      );
    }

    // Sale window guard.
    if (new Date() > EXPIRY) {
      return NextResponse.json(
        { error: 'The Azaadi Sale has ended.' },
        { status: 400 }
      );
    }

    // One spin per device — if this device already spun, return the same prize/code.
    // The device id lives in applicablePlans JSON (see below), not description.
    const prior = await prisma.promoCode.findFirst({
      where: {
        code: { startsWith: 'AZS' },
        applicablePlans: { contains: `"deviceId":"${deviceId}"` },
      },
    });
    if (prior) {
      return NextResponse.json({
        code: prior.code,
        prize: Number(prior.discountValue),
        alreadyClaimed: true,
      });
    }

    // Fresh spin — decide the prize server-side and mint a one-time coupon.
    const prize = pickPrize();
    const code = await generateUniqueCode(prize);

    // Sanitize contact for storage (strip pipe so our marker parsing stays clean).
    const safeContact = contact.replace(/\|/g, '/').slice(0, 120);

    await prisma.promoCode.create({
      data: {
        code,
        discountType: 'percentage',
        discountValue: prize,
        maxUses: 1,
        currentUses: 0,
        isActive: true,
        expiryDate: EXPIRY,
        // Client-visible (validate endpoint / checkout) — no PII here.
        description: `🇮🇳 Azaadi Spin — ${prize}% OFF`,
        // Lead + device id captured here as a JSON OBJECT (not an array), so the
        // validate route ignores it (coupon still applies to all plans) and never
        // returns it to the client. Admin promo listing can read the lead from here.
        applicablePlans: JSON.stringify({ spin: true, prize, contact: safeContact, deviceId }),
        targetUserId: null,
      },
    });

    return NextResponse.json({ code, prize, alreadyClaimed: false });
  } catch (error) {
    console.error('Spin error:', error);
    return NextResponse.json({ error: 'Something went wrong. Please try again.' }, { status: 500 });
  }
}
