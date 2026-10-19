'use client';

import { useState } from 'react';
import Link from 'next/link';
import { COUNTDOWN_WEEKS, LOSS_RATE, TAPER_WEEKS, planPicks, weddingTimeline, type WeddingWho } from '@/lib/weddingFitness';

// "Weeks until your wedding" planner. All numbers come from weddingTimeline() and
// planPicks(), the same functions the static tables and FAQs on the page use.

const WHO: { key: WeddingWho; label: string }[] = [
  { key: 'bride', label: 'Bride' },
  { key: 'groom', label: 'Groom' },
  { key: 'couple', label: 'Couple' },
];

const WEEK_MS = 7 * 24 * 60 * 60 * 1000;

export default function WeddingCountdown({ who: fixedWho }: { who?: WeddingWho }) {
  const [who, setWho] = useState<WeddingWho>(fixedWho ?? 'bride');
  const [weeks, setWeeks] = useState(12);
  const [date, setDate] = useState('');

  function onDate(value: string) {
    setDate(value);
    const ms = new Date(`${value}T00:00:00`).getTime() - Date.now();
    if (Number.isFinite(ms) && ms > 0) setWeeks(Math.max(1, Math.ceil(ms / WEEK_MS)));
  }

  const t = weddingTimeline(weeks);
  const picks = planPicks(who, t.weeks);
  const chip = (active: boolean) =>
    `px-3.5 py-2 rounded-lg text-sm font-medium border transition-colors ${
      active ? 'border-brand-blue bg-brand-blue/10 text-white' : 'border-white/[0.08] text-gray-400 hover:text-white'
    }`;

  return (
    <div className="rounded-2xl border border-white/[0.08] bg-brand-navy-light/60 p-5 md:p-7">
      <div className="grid gap-5 md:grid-cols-2">
        {!fixedWho && (
          <div>
            <div className="mb-2 text-xs font-semibold uppercase tracking-wide text-gray-500">Who is training</div>
            <div className="flex flex-wrap gap-2">
              {WHO.map((w) => (
                <button key={w.key} type="button" onClick={() => setWho(w.key)} className={chip(who === w.key)} aria-pressed={who === w.key}>
                  {w.label}
                </button>
              ))}
            </div>
          </div>
        )}
        <div>
          <label htmlFor="wedding-date" className="mb-2 block text-xs font-semibold uppercase tracking-wide text-gray-500">
            Wedding date
          </label>
          <input
            id="wedding-date"
            type="date"
            value={date}
            onChange={(e) => onDate(e.target.value)}
            className="w-full rounded-lg border border-white/10 bg-brand-navy px-3 py-2 text-sm text-white outline-none focus:border-brand-blue/60"
          />
        </div>
        <div className={fixedWho ? '' : 'md:col-span-2'}>
          <div className="mb-2 text-xs font-semibold uppercase tracking-wide text-gray-500">Or weeks to go</div>
          <div className="flex flex-wrap gap-2">
            {COUNTDOWN_WEEKS.map((w) => (
              <button
                key={w}
                type="button"
                onClick={() => {
                  setWeeks(w);
                  setDate('');
                }}
                className={chip(weeks === w)}
                aria-pressed={weeks === w}
              >
                {w} weeks
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-6 border-t border-white/[0.08] pt-6" aria-live="polite">
        <div className="text-sm text-gray-400">
          {t.weeks} {t.weeks === 1 ? 'week' : 'weeks'} to go{who === 'couple' ? ', per partner' : ''}
        </div>
        {t.lossWeeks > 0 ? (
          <>
            <div className="mt-1 text-3xl md:text-4xl font-bold text-white">
              {t.lowKg}–{t.highKg} kg
            </div>
            <p className="mt-2 text-sm text-gray-400">
              Realistic fat loss at {LOSS_RATE.low}–{LOSS_RATE.high} kg a week over {t.lossWeeks}{' '}
              {t.lossWeeks === 1 ? 'week' : 'weeks'}, with the final {TAPER_WEEKS} weeks at maintenance. The higher end is
              realistic if you have more to lose.
            </p>
          </>
        ) : (
          <p className="mt-2 text-white">
            Too close to diet. Use these weeks to sleep well, keep meals steady and train lightly, so you look fresh, not
            flat.
          </p>
        )}

        <ol className="mt-6 space-y-3">
          {t.phases.map((p) => (
            <li key={p.name} className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-4">
              <div className="flex flex-wrap items-baseline justify-between gap-2">
                <span className="font-semibold text-white">{p.name}</span>
                <span className="text-xs text-brand-blue">{p.weeks}</span>
              </div>
              <p className="mt-1 text-sm leading-relaxed text-gray-400">{p.text}</p>
            </li>
          ))}
        </ol>

        <div className="mt-6 text-xs font-semibold uppercase tracking-wide text-gray-500">Plans that fit this timeline</div>
        <div className="mt-3 grid gap-3 sm:grid-cols-2">
          {picks.map((p) => (
            <Link
              key={p.label}
              href={p.href}
              className="block rounded-xl border border-white/[0.08] p-4 transition-colors hover:border-brand-blue/50"
            >
              <div className="text-xs text-gray-500">{p.label}</div>
              <div className="mt-0.5 font-semibold text-white">
                {p.plan.name} · {p.plan.priceLabel}
              </div>
              <p className="mt-1 text-sm leading-relaxed text-gray-400">{p.why}</p>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
