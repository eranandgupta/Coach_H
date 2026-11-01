'use client';

import { useEffect, useState } from 'react';
import { getActiveSale, maxSalePercent, SALES } from '@/lib/pricing';
import Diya from './Diya';

// Shown while the festive sale in lib/pricing.ts runs (visitor's local date).
// Client-side so the note disappears on its own after the sale, without a rebuild.
function isVictoryToLightSale(d: Date): boolean {
  return getActiveSale(d)?.theme === 'festive';
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
        <strong className="text-white">Victory to Light Sale, until 10 November:</strong> up to {maxSalePercent(SALES.find((s) => s.theme === 'festive') ?? null)}% off coaching
        plans, so the week after Diwali starts with a plan, not a guilt trip.{' '}
        <span className="font-semibold text-amber-300">See the offers →</span>
      </span>
    </a>
  );
}
