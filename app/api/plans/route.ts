import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getPlanPrice } from '@/lib/pricing';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const rows = await prisma.subscriptionPlan.findMany({
      where: { isActive: true },
      select: { id: true, name: true, price: true, duration: true },
      orderBy: { id: 'asc' },
    });
    // Price from lib/pricing.ts so a price change shows before the DB sync runs.
    const plans = rows.map((p) => ({ ...p, price: getPlanPrice(p.name) ?? Number(p.price) }));
    return NextResponse.json({ plans });
  } catch (error) {
    console.error('Plans fetch error:', error);
    return NextResponse.json({ error: 'Failed to fetch plans' }, { status: 500 });
  }
}
