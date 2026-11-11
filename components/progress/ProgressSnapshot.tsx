'use client';

import { useCallback, useEffect, useState } from 'react';
import { NotebookPen, Dumbbell, UtensilsCrossed, Droplet, Scale, Trophy, ChevronRight, MessageSquareQuote, Loader2, Lock } from 'lucide-react';
import { progressApi } from './api';
import { Delta, TargetBar, fmtDate, fmtNum } from './ui';
import { daysBetween, fmtKg } from '@/lib/progressCalc';

interface Props {
  /** Staff viewing a client's card. Omit on the client's own dashboard. */
  clientId?: number | null;
  onOpen: () => void;
  /** Bump to refetch (e.g. after the diary closes). */
  refreshKey?: number;
  locked?: boolean;
}

/**
 * Compact "today / this week / this month" progress card. Shown on the client dashboard
 * and inside the coach's client card, both opening the full ProgressDiary.
 */
export default function ProgressSnapshot({ clientId, onOpen, refreshKey = 0, locked = false }: Props) {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(!locked);
  const [error, setError] = useState('');

  const load = useCallback(async () => {
    if (locked) return;
    setError('');
    try {
      setData(await progressApi('summary', { userId: clientId }));
    } catch (e: any) {
      setError(e.message || 'Could not load progress');
    } finally {
      setLoading(false);
    }
  }, [clientId, locked]);
  useEffect(() => { load(); }, [load, refreshKey]);

  const header = (
    <div className="flex items-center justify-between gap-2 mb-3">
      <h3 className="flex items-center gap-2 text-base font-bold text-white"><NotebookPen className="w-5 h-5 text-brand-blue" /> Progress Diary</h3>
      <button onClick={onOpen} className="inline-flex items-center gap-1 text-xs font-semibold text-brand-blue hover:text-white transition-colors">
        {locked ? <><Lock className="w-3.5 h-3.5" /> Renew to unlock</> : <>{clientId ? 'Open diary' : 'Log today'} <ChevronRight className="w-3.5 h-3.5" /></>}
      </button>
    </div>
  );

  if (locked) {
    return (
      <section className="bg-brand-navy-light/60 border border-white/[0.08] rounded-2xl p-4 md:p-5">
        {header}
        <p className="text-sm text-gray-400">Log your workouts, sets, PRs, runs, meals and body measurements — and see your weekly and monthly progress. Available on an active plan.</p>
      </section>
    );
  }

  if (loading) {
    return <section className="bg-brand-navy-light/60 border border-white/[0.08] rounded-2xl p-4 md:p-5">{header}<div className="flex justify-center py-6"><Loader2 className="w-5 h-5 text-brand-blue animate-spin" /></div></section>;
  }
  if (error || !data) {
    return <section className="bg-brand-navy-light/60 border border-white/[0.08] rounded-2xl p-4 md:p-5">{header}<p className="text-sm text-gray-500">{error || 'No data'}</p></section>;
  }

  const t = data.today;
  const targets = t.targets;
  const since = data.lastLogDate ? daysBetween(data.lastLogDate, data.date) : null;
  const topPRs = (data.prs ?? []).filter((p: any) => p.sessions > 1 && p.maxWeight > 0).sort((a: any, b: any) => b.maxWeightDate.localeCompare(a.maxWeightDate)).slice(0, 3);
  const w = data.week;
  const m = data.month;

  return (
    <section className="bg-brand-navy-light/60 border border-white/[0.08] rounded-2xl p-4 md:p-5">
      {header}

      {clientId && (
        <p className={`text-xs mb-3 ${since == null ? 'text-gray-500' : since >= 3 ? 'text-rose-400' : since === 0 ? 'text-emerald-400' : 'text-gray-400'}`}>
          {since == null ? 'Has not logged anything yet' : since === 0 ? 'Logged today' : `Last logged ${since} day${since === 1 ? '' : 's'} ago (${fmtDate(data.lastLogDate)})`}
        </p>
      )}

      {/* Today */}
      <button onClick={onOpen} className="w-full text-left grid grid-cols-2 lg:grid-cols-4 gap-3 mb-4">
        <div className="bg-white/[0.03] border border-white/[0.06] rounded-xl p-3">
          <p className="flex items-center gap-1.5 text-[11px] text-gray-500 mb-1.5"><Dumbbell className="w-3.5 h-3.5 text-brand-blue" /> Workout today</p>
          {t.planned > 0 ? <TargetBar label="Plan" value={t.plannedDone} target={t.planned} unit="" /> : null}
          <p className="text-sm font-semibold text-white mt-1">{t.workout.totalSets ? `${t.workout.totalSets} sets · ${fmtNum(t.workout.totalVolume)} kg` : t.cardio.sessions ? `${t.cardio.distanceKm} km cardio` : 'Not logged'}</p>
        </div>
        <div className="bg-white/[0.03] border border-white/[0.06] rounded-xl p-3">
          <p className="flex items-center gap-1.5 text-[11px] text-gray-500 mb-1.5"><UtensilsCrossed className="w-3.5 h-3.5 text-brand-blue" /> Diet today</p>
          <TargetBar label="kcal" value={t.series?.[0]?.calories ?? Math.round(t.diet.avgCalories ?? 0)} target={targets.calories} unit="" overIsBad />
          <p className="text-[11px] text-gray-400 mt-1">Protein {fmtNum(t.diet.avgProtein ?? 0)}{targets.protein ? ` / ${targets.protein}` : ''} g</p>
        </div>
        <div className="bg-white/[0.03] border border-white/[0.06] rounded-xl p-3">
          <p className="flex items-center gap-1.5 text-[11px] text-gray-500 mb-1.5"><Droplet className="w-3.5 h-3.5 text-brand-blue" /> Water</p>
          <TargetBar label="Litres" value={t.waterL ?? 0} target={targets.waterL} unit="" />
        </div>
        <div className="bg-white/[0.03] border border-white/[0.06] rounded-xl p-3">
          <p className="flex items-center gap-1.5 text-[11px] text-gray-500 mb-1.5"><Scale className="w-3.5 h-3.5 text-brand-blue" /> Body weight</p>
          <p className="text-lg font-extrabold text-white leading-tight">{data.latestWeight != null ? `${Number(data.latestWeight)} kg` : '—'}</p>
          {m.body.change.weightKg != null && <p className="text-[11px]"><Delta now={m.body.change.weightKg} before={0} unit=" kg" higherIsBetter={false} /> <span className="text-gray-600">30 days</span></p>}
        </div>
      </button>

      {/* Week / month */}
      <div className="grid grid-cols-2 gap-3">
        {[{ label: 'This week', r: w }, { label: 'This month', r: m }].map(({ label, r }) => (
          <div key={label} className="rounded-xl border border-white/[0.06] p-3">
            <p className="text-[11px] font-semibold text-gray-400 mb-2">{label}</p>
            <dl className="grid grid-cols-2 gap-x-2 gap-y-1.5 text-xs">
              <dt className="text-gray-500">Workouts</dt><dd className="text-white font-semibold text-right">{r.workout.activeDays}/{r.workout.plannedSessions}</dd>
              <dt className="text-gray-500">Volume</dt><dd className="text-white font-semibold text-right">{fmtNum(r.workout.totalVolume)} kg</dd>
              <dt className="text-gray-500">Diet on target</dt><dd className="text-white font-semibold text-right">{r.diet.adherencePct != null ? `${r.diet.adherencePct}%` : '—'}</dd>
              <dt className="text-gray-500">Run</dt><dd className="text-white font-semibold text-right">{r.cardio.distanceKm} km</dd>
              <dt className="text-gray-500">Score</dt><dd className="text-white font-semibold text-right">{r.score}<span className="text-gray-600 font-normal">/100</span></dd>
            </dl>
          </div>
        ))}
      </div>

      {topPRs.length > 0 && (
        <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs">
          <span className="flex items-center gap-1 text-gray-400"><Trophy className="w-3.5 h-3.5 text-brand-gold" /> PRs</span>
          {topPRs.map((p: any) => <span key={p.exerciseKey} className="text-gray-300"><span className="text-white font-semibold">{p.exercise}</span> {fmtKg(p.maxWeight)} x {p.maxWeightReps}</span>)}
        </div>
      )}

      {!clientId && data.feedback && (
        <div className="mt-3 border-t border-white/[0.06] pt-3">
          <p className="flex items-center gap-1.5 text-[11px] text-gray-500 mb-1"><MessageSquareQuote className="w-3.5 h-3.5 text-brand-blue" /> {data.feedback.authorName} · {new Date(data.feedback.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}</p>
          <p className="text-sm text-gray-200 line-clamp-2">{data.feedback.message}</p>
        </div>
      )}
    </section>
  );
}
