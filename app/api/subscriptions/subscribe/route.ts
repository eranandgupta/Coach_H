import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

// Plans are only created after a verified Razorpay payment (/api/payment/verify + webhook) or by
// an admin/coach (/api/admin/subscriptions, /api/admin/panel/subscriptions). This route used to
// let any logged-in user create an active plan for free; nothing in the app calls it.
export async function POST() {
  return NextResponse.json(
    { error: 'Subscriptions are activated after payment. Please purchase a plan to continue.' },
    { status: 403 }
  );
}
