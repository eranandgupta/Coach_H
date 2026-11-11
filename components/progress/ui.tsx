'use client';

import { ChevronLeft, ChevronRight, Loader2, TrendingDown, TrendingUp, Minus, type LucideIcon } from 'lucide-react';
import { addDays } from '@/lib/progressCalc';

export const inputCls =
  'w-full bg-white/[0.04] border border-white/10 rounded-lg px-3 py-2 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-brand-blue/60 focus:bg-white/[0.06] transition-colors';
export const btnPrimary =
  'inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold text-snow bg-brand-blue hover:bg-brand-blue-dark transition-colors disabled:opacity-50';
export const btnGhost =
  'inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold text-gray-300 bg-white/[0.04] border border-white/10 hover:bg-white/[0.08] transition-colors disabled:opacity-50';

export function Card({ title, icon: Icon, action, children, className = '' }: { title?: string; icon?: LucideIcon; action?: React.ReactNode; children: React.ReactNode; className?: string }) {
  return (
    <section className={`bg-white/[0.03] border border-white/[0.07] rounded-xl p-4 ${className}`}>
      {(title || action) && (
        <div className="flex items-center justify-between gap-2 mb-3">
          {title && (
            <h3 className="flex items-center gap-2 text-sm font-bold text-white">
              {Icon && <Icon className="w-4 h-4 text-brand-blue" />} {title}
            </h3>
          )}
          {action}
        </div>
      )}
      {children}
    </section>
  );
}

export function Stat({ label, value, sub, tone }: { label: string; value: React.ReactNode; sub?: React.ReactNode; tone?: 'good' | 'bad' }) {
  return (
    <div className="bg-white/[0.03] border border-white/[0.06] rounded-lg px-3 py-2.5 min-w-0">
      <p className={`font-bold text-base leading-tight truncate ${tone === 'good' ? 'text-emerald-400' : tone === 'bad' ? 'text-rose-400' : 'text-white'}`}>{value}</p>
      <p className="text-gray-500 text-[11px] mt-0.5 truncate">{label}</p>
      {sub && <div className="text-[11px] mt-0.5">{sub}</div>}
    </div>
  );
}

/** Progress bar towards a target. Over 110% turns rose (too much), 90%+ green. */
export function TargetBar({ label, value, target, unit, overIsBad = false }: { label: string; value: number; target: number | null; unit: string; overIsBad?: boolean }) {
  const ratio = target ? value / target : 0;
  const color = !target ? 'bg-brand-blue' : overIsBad && ratio > 1.1 ? 'bg-rose-500' : ratio >= 0.9 ? 'bg-emerald-500' : 'bg-brand-blue';
  return (
    <div>
      <div className="flex items-baseline justify-between text-xs mb-1">
        <span className="text-gray-400">{label}</span>
        <span className="text-white font-semibold tabular-nums">
          {fmtNum(value)}{unit}
          {target ? <span className="text-gray-500 font-normal"> / {fmtNum(target)}{unit}</span> : null}
        </span>
      </div>
      <div className="h-1.5 rounded-full bg-white/[0.07] overflow-hidden">
        <div className={`h-full rounded-full ${color} transition-all`} style={{ width: `${Math.min(100, target ? ratio * 100 : value > 0 ? 100 : 0)}%` }} />
      </div>
    </div>
  );
}

/**
 * Change vs a previous value. `higherIsBetter` decides the colour; e.g. pace and waist
 * shrinking is good, so pass false for those.
 */
export function Delta({ now, before, unit = '', higherIsBetter = true, digits = 1, format }: { now: number | null | undefined; before: number | null | undefined; unit?: string; higherIsBetter?: boolean; digits?: number; format?: (n: number) => string }) {
  if (now == null || before == null || !Number.isFinite(now) || !Number.isFinite(before)) return null;
  const d = now - before;
  if (Math.abs(d) < 1e-9) return <span className="inline-flex items-center gap-0.5 text-gray-500"><Minus className="w-3 h-3" /> same</span>;
  const good = higherIsBetter ? d > 0 : d < 0;
  const Icon = d > 0 ? TrendingUp : TrendingDown;
  const text = format ? format(Math.abs(d)) : `${Math.abs(d).toFixed(digits).replace(/\.0+$/, '')}${unit}`;
  return (
    <span className={`inline-flex items-center gap-0.5 ${good ? 'text-emerald-400' : 'text-rose-400'}`}>
      <Icon className="w-3 h-3" /> {text}
    </span>
  );
}

export function DayNav({ date, today, onChange }: { date: string; today: string; onChange: (d: string) => void }) {
  const label = date === today ? 'Today' : date === addDays(today, -1) ? 'Yesterday' : new Date(`${date}T00:00:00`).toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short' });
  return (
    <div className="flex items-center gap-1">
      <button onClick={() => onChange(addDays(date, -1))} className="p-1.5 rounded-lg hover:bg-white/5 text-gray-400" aria-label="Previous day"><ChevronLeft className="w-4 h-4" /></button>
      <label className="relative">
        <span className="text-sm font-semibold text-white px-2 min-w-[92px] inline-block text-center cursor-pointer">{label}</span>
        <input type="date" value={date} max={today} onChange={(e) => e.target.value && onChange(e.target.value)} className="absolute inset-0 opacity-0 cursor-pointer" aria-label="Pick a date" />
      </label>
      <button onClick={() => onChange(addDays(date, 1))} disabled={date >= today} className="p-1.5 rounded-lg hover:bg-white/5 text-gray-400 disabled:opacity-30" aria-label="Next day"><ChevronRight className="w-4 h-4" /></button>
    </div>
  );
}

export function Empty({ icon: Icon, text, children }: { icon: LucideIcon; text: string; children?: React.ReactNode }) {
  return (
    <div className="text-center py-8 bg-white/[0.02] rounded-xl border border-dashed border-white/10">
      <Icon className="w-8 h-8 text-gray-600 mx-auto mb-2" />
      <p className="text-gray-500 text-sm">{text}</p>
      {children && <div className="mt-3">{children}</div>}
    </div>
  );
}

export const Spinner = () => (
  <div className="flex justify-center py-10"><Loader2 className="w-6 h-6 text-brand-blue animate-spin" /></div>
);

export function Field({ label, children, hint }: { label: string; children: React.ReactNode; hint?: string }) {
  return (
    <label className="block min-w-0">
      <span className="block text-[11px] font-medium text-gray-400 mb-1">{label}</span>
      {children}
      {hint && <span className="block text-[10px] text-gray-600 mt-0.5">{hint}</span>}
    </label>
  );
}

export function fmtNum(n: number | null | undefined, digits = 0): string {
  if (n == null || !Number.isFinite(n)) return '—';
  const v = digits ? Number(n.toFixed(digits)) : Math.round(n);
  return v.toLocaleString('en-IN');
}

export const fmtDate = (d: string, opts: Intl.DateTimeFormatOptions = { day: 'numeric', month: 'short' }) =>
  new Date(`${d}T00:00:00`).toLocaleDateString('en-IN', opts);

/** Wraps recharts so axis text follows the theme (SVG uses currentColor). */
export const chartBox = 'text-gray-500 [&_.recharts-cartesian-grid_line]:stroke-white/[0.06]';
export const BRAND_BLUE = '#175FFF';
