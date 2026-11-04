'use client';

import { HelpCircle } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';

/**
 * Small "?" that explains something in plain language. A popover rather than a hover tooltip,
 * because hover doesn't exist on phones: this opens on tap and on click alike.
 */
export default function InfoTip({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <Popover>
      <PopoverTrigger
        aria-label={`What is ${label}?`}
        className="inline-flex items-center justify-center w-7 h-7 -my-1 rounded-full text-gray-500 hover:text-white transition-colors"
      >
        <HelpCircle className="w-4 h-4" aria-hidden />
      </PopoverTrigger>
      <PopoverContent
        collisionPadding={12}
        className="w-64 rounded-xl bg-brand-navy-light border-white/[0.1] p-3 text-xs leading-relaxed text-gray-300"
      >
        {children}
      </PopoverContent>
    </Popover>
  );
}
