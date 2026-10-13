'use client';

import { type LucideIcon } from 'lucide-react';

export type HeroStat = {
  label: string;
  /** Shorter label used on phones, where tiles are narrow. */
  short?: string;
  value: number | string;
  icon: LucideIcon;
  /** Optional 0–1 fill for a slim progress bar under the value. */
  progress?: number;
};

// The one bold surface on the staff dashboards: a slim brand-blue band holding the
// headline stats as frosted tiles. `theme-dark` pins the dark palette so
// text-white / bg-white/10 stay white-on-blue in light mode.
export default function DashboardHero({ stats, id = 'section-home' }: { stats: HeroStat[]; id?: string }) {
  return (
    <section
      id={id}
      className="dash-hero theme-dark relative overflow-hidden rounded-3xl p-3 md:p-4 mb-5 text-white"
    >
      {/* Decoration: soft light bloom + faint grid, masked toward the top-right */}
      <div aria-hidden className="dash-hero-bloom pointer-events-none absolute -top-24 -right-16 w-72 h-72 rounded-full blur-3xl" />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.12]"
        style={{
          backgroundImage:
            'linear-gradient(rgba(255,255,255,.6) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.6) 1px, transparent 1px)',
          backgroundSize: '32px 32px',
          maskImage: 'radial-gradient(ellipse at 90% 0%, black 0%, transparent 65%)',
          WebkitMaskImage: 'radial-gradient(ellipse at 90% 0%, black 0%, transparent 65%)',
        }}
      />

      <div className={`relative grid gap-2 md:gap-2.5 ${stats.length === 3 ? 'grid-cols-3' : `grid-cols-2 sm:grid-cols-3 ${stats.length > 4 ? 'lg:grid-cols-6' : 'lg:grid-cols-4'}`}`}>
        {stats.map(({ label, short, value, icon: Icon, progress }) => (
          <div
            key={label}
            className="dash-hero-tile rounded-2xl ring-1 ring-inset px-3 sm:px-3.5 py-2 sm:py-2.5 transition-colors"
          >
            <div className="flex items-center gap-1.5 text-white/70">
              <Icon className="w-3.5 h-3.5" />
              <span className="text-[11px] font-medium truncate">{short ? <><span className="sm:hidden">{short}</span><span className="hidden sm:inline">{label}</span></> : label}</span>
            </div>
            <p className="mt-0.5 text-xl sm:text-2xl font-bold tabular-nums leading-tight">{typeof value === 'number' ? value.toLocaleString('en-IN') : value}</p>
            {progress !== undefined && (
              <div className="mt-1.5 h-1 rounded-full bg-white/15 overflow-hidden">
                <div className="dash-hero-bar h-full rounded-full" style={{ width: `${Math.round(Math.min(1, Math.max(0, progress)) * 100)}%` }} />
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}
