'use client';

import { useEffect, useState } from 'react';
import { Dumbbell, UtensilsCrossed, Droplet, Scale, Activity, MessageSquareQuote, ChevronRight, Trophy } from 'lucide-react';
import { progressApi, type DayBundle } from './api';
import { Card, Stat, TargetBar, fmtDate, fmtNum } from './ui';
import { foodTotals, fmtKg, workoutTotals, type ExercisePR } from '@/lib/progressCalc';

export type DiaryTab = 'overview' | 'workout' | 'cardio' | 'diet' | 'body' | 'reports' | 'coach';

export interface FeedbackItem { id: number; message: string; createdAt: string; authorName: string; authorRole: string; authorId?: number }

export function useFeedback(userId: number | null | undefined, refreshKey: number, enabled = true) {
  const [items, setItems] = useState<FeedbackItem[]>([]);
  useEffect(() => {
    if (!enabled) return;
    progressApi<{ feedback: FeedbackItem[] }>('feedback', { userId }).then((r) => setItems(r.feedback)).catch(() => setItems([]));
  }, [userId, refreshKey, enabled]);
  return items;
}

export function FeedbackList({ items, limit, onDelete }: { items: FeedbackItem[]; limit?: number; onDelete?: (id: number) => void }) {
  const shown = limit ? items.slice(0, limit) : items;
  if (!shown.length) return <p className="text-xs text-gray-500">No feedback yet.</p>;
  return (
    <ul className="space-y-3">
      {shown.map((f) => (
        <li key={f.id} className="border-l-2 border-brand-blue/50 pl-3">
          <p className="text-sm text-gray-200 whitespace-pre-line">{f.message}</p>
          <p className="text-[11px] text-gray-500 mt-1 flex items-center gap-2">
            {f.authorName} · {new Date(f.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
            {onDelete && <button onClick={() => onDelete(f.id)} className="text-gray-600 hover:text-rose-400">Delete</button>}
          </p>
        </li>
      ))}
    </ul>
  );
}

function Jump({ icon: Icon, title, children, onClick }: { icon: any; title: string; children: React.ReactNode; onClick: () => void }) {
  return (
    <button onClick={onClick} className="text-left w-full bg-white/[0.03] border border-white/[0.07] rounded-xl p-4 hover:border-brand-blue/40 transition-colors group">
      <div className="flex items-center justify-between mb-2">
        <span className="flex items-center gap-2 text-sm font-bold text-white"><Icon className="w-4 h-4 text-brand-blue" /> {title}</span>
        <ChevronRight className="w-4 h-4 text-gray-600 group-hover:text-brand-blue" />
      </div>
      {children}
    </button>
  );
}

export default function OverviewTab({ bundle, week, prs, feedback, onJump }: { bundle: DayBundle; week: any; prs: ExercisePR[]; feedback: FeedbackItem[]; onJump: (t: DiaryTab) => void }) {
  const wt = workoutTotals(bundle.workouts.flatMap((w) => w.sets));
  const planned = bundle.planned?.exercises ?? [];
  const loggedNames = new Set(bundle.workouts.flatMap((w) => w.sets.map((s) => s.exercise.toLowerCase().trim())));
  const plannedDone = planned.filter((e) => loggedNames.has(e.name.toLowerCase().trim())).length;
  const ft = foodTotals(bundle.food);
  const t = bundle.targets;
  const km = bundle.cardio.reduce((a, c) => a + (c.distanceKm ?? 0), 0);
  const weight = bundle.body?.weightKg ?? bundle.latestBody?.weightKg ?? null;
  const recentPRs = [...prs].sort((a, b) => b.maxWeightDate.localeCompare(a.maxWeightDate)).filter((p) => p.sessions > 1).slice(0, 4);

  return (
    <div className="space-y-4">
      <div className="grid sm:grid-cols-2 gap-3">
        <Jump icon={Dumbbell} title="Workout" onClick={() => onJump('workout')}>
          {planned.length > 0 ? (
            <TargetBar label={`Planned exercises done`} value={plannedDone} target={planned.length} unit="" />
          ) : null}
          <p className="text-xs text-gray-400 mt-2">
            {wt.sets ? `${wt.sets} sets · ${fmtNum(wt.reps)} reps · ${fmtNum(wt.volume)} kg volume` : 'Nothing logged yet'}
          </p>
        </Jump>
        <Jump icon={UtensilsCrossed} title="Diet" onClick={() => onJump('diet')}>
          <div className="space-y-2">
            <TargetBar label="Calories" value={ft.calories} target={t.calories} unit=" kcal" overIsBad />
            <TargetBar label="Protein" value={ft.protein} target={t.protein} unit=" g" />
          </div>
        </Jump>
        <Jump icon={Droplet} title="Water" onClick={() => onJump('diet')}>
          <TargetBar label="Today" value={bundle.waterL ?? 0} target={t.waterL} unit=" L" />
        </Jump>
        <Jump icon={Scale} title="Body weight" onClick={() => onJump('body')}>
          <p className="text-2xl font-extrabold text-white">{weight != null ? `${weight} kg` : '—'}</p>
          <p className="text-[11px] text-gray-500">{bundle.body?.weightKg != null ? 'Logged today' : bundle.latestBody ? `Last check-in ${fmtDate(bundle.latestBody.date)}` : 'Add your first check-in'}</p>
        </Jump>
      </div>

      {bundle.cardio.length > 0 && (
        <Jump icon={Activity} title="Cardio" onClick={() => onJump('cardio')}>
          <p className="text-xs text-gray-400">{bundle.cardio.length} session{bundle.cardio.length > 1 ? 's' : ''} · {Math.round(km * 10) / 10} km</p>
        </Jump>
      )}

      {week && (
        <Card title="Last 7 days">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            <Stat label="Workouts" value={`${week.workout.activeDays}/${week.workout.plannedSessions}`} />
            <Stat label="Volume" value={`${fmtNum(week.workout.totalVolume)} kg`} />
            <Stat label="Diet on target" value={week.diet.adherencePct != null ? `${week.diet.adherencePct}%` : '—'} />
            <Stat label="Run distance" value={`${week.cardio.distanceKm} km`} />
          </div>
          <button onClick={() => onJump('reports')} className="text-xs text-brand-blue font-semibold mt-3">Full reports</button>
        </Card>
      )}

      {recentPRs.length > 0 && (
        <Card title="Personal records" icon={Trophy}>
          <ul className="grid sm:grid-cols-2 gap-2">
            {recentPRs.map((p) => (
              <li key={p.exerciseKey} className="text-sm flex justify-between gap-2">
                <span className="text-gray-300 truncate">{p.exercise}</span>
                <span className="text-white font-semibold flex-shrink-0">{fmtKg(p.maxWeight)} x {p.maxWeightReps}</span>
              </li>
            ))}
          </ul>
        </Card>
      )}

      <Card title="From your coach" icon={MessageSquareQuote}>
        <FeedbackList items={feedback} limit={3} />
      </Card>
    </div>
  );
}
