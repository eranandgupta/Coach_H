'use client';

import { Lock, type LucideIcon } from 'lucide-react';

export type QuickAction = {
  id: string;
  label: string;
  hint: string;
  icon: LucideIcon;
  onSelect: () => void;
  /** Needs an active plan. Stays tappable, so tapping can explain how to unlock it. */
  locked?: boolean;
  badge?: number;
};

/** One tap to every tool, so nothing important sits behind an unlabelled icon or the More tray. */
export default function QuickActions({ actions }: { actions: QuickAction[] }) {
  return (
    <section data-tour="quick-actions" aria-label="Quick actions" className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-6 gap-2.5 md:gap-3 mb-5 md:mb-8">
      {actions.map(({ id, label, hint, icon: Icon, onSelect, locked, badge }) => (
        <button
          key={id}
          onClick={onSelect}
          aria-disabled={locked}
          className="relative flex flex-col items-start gap-2 min-h-[104px] p-3.5 rounded-2xl text-left bg-brand-navy-light/60 border border-white/[0.08] hover:border-brand-blue/35 transition-colors"
        >
          <span className={`w-9 h-9 rounded-xl flex items-center justify-center ${locked ? 'bg-white/[0.05] text-gray-500' : 'bg-brand-blue/10 text-brand-blue'}`}>
            <Icon className="w-[18px] h-[18px]" aria-hidden />
          </span>
          <span className="min-w-0">
            <span className={`block text-sm font-semibold leading-snug ${locked ? 'text-gray-400' : 'text-white'}`}>{label}</span>
            <span className="block mt-0.5 text-xs leading-snug text-gray-500">{locked ? 'Renew to unlock' : hint}</span>
          </span>
          {locked && <Lock className="absolute top-3.5 right-3.5 w-3.5 h-3.5 text-gray-500" aria-hidden />}
          {!!badge && (
            <span className="absolute top-3 right-3 min-w-[20px] px-1.5 py-0.5 rounded-full bg-brand-blue text-white text-[11px] font-semibold leading-none text-center tabular-nums">
              {badge > 9 ? '9+' : badge}
              <span className="sr-only"> unread</span>
            </span>
          )}
        </button>
      ))}
    </section>
  );
}
