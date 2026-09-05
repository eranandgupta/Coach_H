import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

// GET - Fetch active, non-targeted promo codes for public display
export async function GET() {
  try {
    const now = new Date();

    const promoCodes = await prisma.promoCode.findMany({
      where: {
        isActive: true,
        // Coach can opt a code out of the public announcement bar at creation time.
        broadcast: true,
        targetUserId: null,
        // Exclude personal one-time "Azaadi Spin" codes (prefix AZS) — these are
        // issued per-device by the spin wheel and must never be advertised publicly.
        NOT: { code: { startsWith: 'AZS' } },
        OR: [
          { expiryDate: null },
          { expiryDate: { gte: now } },
        ],
      },
      select: {
        code: true,
        discountType: true,
        discountValue: true,
        description: true,
        applicablePlans: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({ promoCodes }, { status: 200 });
  } catch (error) {
    console.error('Fetch active promo codes error:', error);
    return NextResponse.json({ promoCodes: [] }, { status: 200 });
  }
}
