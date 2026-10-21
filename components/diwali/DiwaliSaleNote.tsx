'use client';

import { useEffect, useState } from 'react';
import { SALES_ENABLED } from '@/lib/sale';
import Diya from './Diya';

// Same window as the homepage `activeSale` festive branch (Oct 20 – Nov 10, visitor's local date).
// Client-side so the note disappears on its own after the sale, without a rebuild.
function isVictoryToLightSale(d: Date): boolean {
  const m = d.getMonth();
  const day = d.getDate();
  return SALES_ENABLED && ((m === 9 && day >= 20) || (m === 10 && day <= 10));
}

export default function DiwaliSaleNote() {
  const [show, setShow] = useState(false);
  useEffect(() => setShow(isVictoryToLightSale(new Date())), []);
  if (!show) return null;

  return (
    <a
      href="/#sale"
      className="mt-6 flex items-center gap-4 rounded-2xl border border-amber-400/25 bg-amber-500/[0.06] p-4 transition-colors hover:border-amber-400/50 md:p-5"
    >
      <Diya size={40} />
      <span className="text-sm text-gray-300 md:text-base">
        <strong className="text-white">Victory to Light Sale, until 10 November:</strong> up to 25% off coaching
        plans, so the week after Diwali starts with a plan, not a guilt trip.{' '}
        <span className="font-semibold text-amber-300">See the offers →</span>
      </span>
    </a>
  );
}
