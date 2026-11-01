'use client';

import { useEffect, useState } from 'react';
import { getActiveSale, maxSalePercent, type SaleDefinition } from '@/lib/pricing';

// Shows the running sale from lib/pricing.ts on statically built pages. Client-side, so it
// appears and disappears on the visitor's own date without a rebuild.
export default function ActiveSaleNote() {
  const [sale, setSale] = useState<SaleDefinition | null>(null);
  useEffect(() => setSale(getActiveSale()), []);
  if (!sale) return null;

  const upTo = maxSalePercent(sale);
  return (
    <a
      href="/#sale"
      className="mx-auto mt-6 block max-w-2xl rounded-2xl border border-brand-gold/25 bg-brand-gold/[0.06] p-4 text-sm text-gray-300 transition-colors hover:border-brand-gold/50 md:text-base"
    >
      <strong className="text-white">{sale.title.charAt(0) + sale.title.slice(1).toLowerCase()}:</strong>{' '}
      {upTo ? `up to ${upTo}% off these prices` : 'special offers on every plan'}, worldwide ({sale.subtitle.replace(/^Valid /, '').toLowerCase()}).{' '}
      <span className="font-semibold text-brand-gold">See the offers →</span>
    </a>
  );
}
