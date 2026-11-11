'use client';

import { useEffect, useState } from 'react';
import { BarChart3, Dumbbell, Activity, UtensilsCrossed, Scale, Trophy, Gauge } from 'lucide-react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, ReferenceLine, LineChart, Line } from 'recharts';
import { progressApi } from './api';
import { BRAND_BLUE, Card, Delta, Empty, Spinner, Stat, chartBox, fmtDate, fmtNum } from './ui';
import { MEASUREMENTS, fmtDuration, fmtPace } from '@/lib/progressCalc';

type Period = 'day' | 'week' | 'month';
const PERIODS: { key: Period; label: string }[] = [
  { key: 'day', label: 'Daily' },
  { key: 'week', label: 'Weekly' },
  { key: 'month', label: 'Monthly' },
];

export default function ReportsTab({ date, userId, refreshKey }: { date: string; userId?: number | null; refreshKey: number }) {
  const [period, setPeriod] = useState<Period>('week');
  const [report, setReport] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let alive = true;
    setLoading(true);
    setError('');
    progressApi<{ report: any }>('report', { query: { period, date }, userId })
      .then((r) => alive && setReport(r.report))
      .catch((e) => alive && setError(e.message))
      .finally(() => alive && setLoading(false));
    return () => { alive = false; };
  }, [period, date, userId, refreshKey]);

  const r = report;
  const prevLabel = period === 'day' ? 'vs previous day' : period === 'week' ? 'vs previous 7 days' : 'vs previous 30 days';
  const series = (r?.series ?? []).map((s: any) => ({ ...s, label: fmtDate(s.date) }));
  const hasDiet = series.some((s: any) => s.calories > 0);
  const hasVolume = series.some((s: any) => s.volume > 0);
  const hasWeight = series.some((s: any) => s.weightKg != null);

  return (
    <div className="space-y-4">
      <div className="flex gap-1.5">
        {PERIODS.map((p) => (
          <button key={p.key} onClick={() => setPeriod(p.key)} className={`flex-1 py-2 rounded-lg text-xs font-semibold border transition-colors ${period === p.key ? 'bg-brand-blue/15 border-brand-blue/40 text-brand-blue' : 'bg-white/[0.03] border-white/10 text-gray-400 hover:text-white'}`}>
            {p.label}
          </button>
        ))}
      </div>

      {loading ? <Spinner /> : error ? <Empty icon={BarChart3} text={error} /> : r && (
        <>
          <p className="text-xs text-gray-500 text-center">
            {r.range.from === r.range.to ? fmtDate(r.range.to, { weekday: 'long', day: 'numeric', month: 'long' }) : `${fmtDate(r.range.from)} – ${fmtDate(r.range.to, { day: 'numeric', month: 'short', year: 'numeric' })}`}
          </p>

          <Card title="Overall progress" icon={BarChart3}>
            <div className="flex items-center gap-4">
              <div className="relative w-20 h-20 flex-shrink-0">
                <svg viewBox="0 0 36 36" className="w-20 h-20 -rotate-90">
                  <circle cx="18" cy="18" r="15.9" fill="none" className="stroke-white/[0.08]" strokeWidth="3" />
                  <circle cx="18" cy="18" r="15.9" fill="none" stroke={BRAND_BLUE} strokeWidth="3" strokeDasharray={`${r.score} 100`} strokeLinecap="round" />
                </svg>
                <span className="absolute inset-0 flex items-center justify-center text-lg font-extrabold text-white">{r.score}</span>
              </div>
              <div className="text-xs text-gray-400 space-y-1">
                <p>Consistency score out of 100 — workouts done vs planned, days logged{r.diet.adherencePct != null ? ' and diet on target' : ''}.</p>
                <p><Delta now={r.score} before={r.previous.score} digits={0} /> <span className="text-gray-600">{prevLabel}</span></p>
                <p>Logged on {r.logging.daysLogged} of {r.range.days} day{r.range.days === 1 ? '' : 's'}</p>
              </div>
            </div>
          </Card>

          <Card title="Workout" icon={Dumbbell}>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              <Stat label="Consistency" value={`${r.workout.consistencyPct}%`} sub={<span className="text-gray-500">{r.workout.activeDays} of {r.workout.plannedSessions} planned</span>} />
              <Stat label="Sessions" value={r.workout.sessions} sub={<Delta now={r.workout.sessions} before={r.previous.workoutSessions} digits={0} />} />
              <Stat label="Sets / reps" value={`${r.workout.totalSets} / ${fmtNum(r.workout.totalReps)}`} />
              <Stat label="Volume" value={`${fmtNum(r.workout.totalVolume)} kg`} sub={<Delta now={r.workout.totalVolume} before={r.previous.workoutVolume} digits={0} unit=" kg" />} />
            </div>
            {r.workout.totalMinutes > 0 && <p className="text-xs text-gray-500 mt-2">{r.workout.totalMinutes} minutes trained</p>}
            {hasVolume && series.length > 1 && (
              <div className={`h-40 mt-3 ${chartBox}`}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={series} margin={{ top: 5, right: 4, left: -18, bottom: 0 }}>
                    <CartesianGrid vertical={false} />
                    <XAxis dataKey="label" tick={{ fill: 'currentColor', fontSize: 10 }} tickLine={false} axisLine={false} interval="preserveStartEnd" />
                    <YAxis tick={{ fill: 'currentColor', fontSize: 10 }} tickLine={false} axisLine={false} />
                    <Tooltip formatter={(v: any) => [`${fmtNum(Number(v))} kg`, 'Volume']} labelClassName="text-ink" />
                    <Bar dataKey="volume" fill={BRAND_BLUE} radius={[3, 3, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            )}
          </Card>

          {(r.workout.byExercise.length > 0 || r.prsInRange.length > 0) && (
            <Card title="Exercise performance" icon={Trophy}>
              {r.prsInRange.length > 0 && (
                <div className="mb-3 rounded-lg border border-brand-gold/30 bg-brand-gold/[0.06] p-3">
                  <p className="text-xs font-bold text-white mb-1">Records set in this period</p>
                  <ul className="space-y-0.5">
                    {r.prsInRange.map((p: any, i: number) => (
                      <li key={i} className="text-xs text-gray-300"><span className="font-semibold text-white">{p.exercise}</span> — {p.detail} <span className="text-gray-500">({fmtDate(p.date)})</span></li>
                    ))}
                  </ul>
                </div>
              )}
              {r.workout.byExercise.length > 0 && (
                <div className="overflow-x-auto">
                  <table className="w-full text-xs min-w-[360px]">
                    <thead><tr className="text-gray-500 text-left"><th className="py-1 font-medium">Exercise</th><th className="py-1 font-medium">Sets</th><th className="py-1 font-medium">Reps</th><th className="py-1 font-medium">Best</th><th className="py-1 font-medium text-right">Volume</th></tr></thead>
                    <tbody>
                      {r.workout.byExercise.map((e: any) => (
                        <tr key={e.exercise} className="border-t border-white/5">
                          <td className="py-1.5 text-white font-medium">{e.exercise}</td>
                          <td className="py-1.5 text-gray-300">{e.sets}</td>
                          <td className="py-1.5 text-gray-300">{e.reps}</td>
                          <td className="py-1.5 text-gray-300">{e.bestWeight ? `${e.bestWeight} kg` : '—'}</td>
                          <td className="py-1.5 text-gray-300 text-right">{fmtNum(e.volume)} kg</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </Card>
          )}

          <Card title="Running & cardio" icon={Activity}>
            {r.cardio.sessions === 0 ? <p className="text-xs text-gray-500">No cardio in this period.</p> : (
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                <Stat label="Distance" value={`${r.cardio.distanceKm} km`} sub={<Delta now={r.cardio.distanceKm} before={r.previous.cardioKm} unit=" km" />} />
                <Stat label="Avg pace" value={fmtPace(r.cardio.avgPace)} sub={<Delta now={r.cardio.avgPace} before={r.previous.cardioAvgPace} higherIsBetter={false} format={(n) => `${Math.round(n * 60)}s/km`} />} />
                <Stat label="Best pace" value={fmtPace(r.cardio.bestPace)} />
                <Stat label="Time / kcal" value={`${fmtDuration(r.cardio.durationSec)}`} sub={<span className="text-gray-500">{fmtNum(r.cardio.calories)} kcal · {r.cardio.sessions} sessions</span>} />
              </div>
            )}
          </Card>

          <Card title="Diet" icon={UtensilsCrossed}>
            {r.diet.daysLogged === 0 ? <p className="text-xs text-gray-500">No meals logged in this period.</p> : (
              <>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  <Stat label="On-target days" value={r.diet.adherencePct != null ? `${r.diet.adherencePct}%` : '—'} tone={r.diet.adherencePct == null ? undefined : r.diet.adherencePct >= 70 ? 'good' : r.diet.adherencePct < 40 ? 'bad' : undefined} sub={<span className="text-gray-500">{r.diet.adherentDays} of {r.diet.judgedDays} days</span>} />
                  <Stat label={`Avg calories${r.targets.calories ? ` / ${r.targets.calories}` : ''}`} value={fmtNum(r.diet.avgCalories)} sub={<Delta now={r.diet.avgCalories} before={r.previous.avgCalories} digits={0} unit=" kcal" higherIsBetter={false} />} />
                  <Stat label={`Avg protein${r.targets.protein ? ` / ${r.targets.protein}g` : ''}`} value={`${fmtNum(r.diet.avgProtein)} g`} sub={<Delta now={r.diet.avgProtein} before={r.previous.avgProtein} digits={0} unit=" g" />} />
                  <Stat label="Avg water" value={r.diet.avgWaterL != null ? `${fmtNum(r.diet.avgWaterL, 1)} L` : '—'} />
                </div>
                <p className="text-xs text-gray-500 mt-2">Avg carbs {fmtNum(r.diet.avgCarbs)} g · fats {fmtNum(r.diet.avgFats)} g. On target = calories within 10% and protein at least 90% of target.</p>
                {hasDiet && series.length > 1 && (
                  <div className={`h-40 mt-3 ${chartBox}`}>
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={series} margin={{ top: 5, right: 4, left: -14, bottom: 0 }}>
                        <CartesianGrid vertical={false} />
                        <XAxis dataKey="label" tick={{ fill: 'currentColor', fontSize: 10 }} tickLine={false} axisLine={false} interval="preserveStartEnd" />
                        <YAxis tick={{ fill: 'currentColor', fontSize: 10 }} tickLine={false} axisLine={false} />
                        <Tooltip formatter={(v: any, n: any) => [`${fmtNum(Number(v))}${n === 'protein' ? ' g' : ' kcal'}`, n === 'protein' ? 'Protein' : 'Calories']} labelClassName="text-ink" />
                        {r.targets.calories && <ReferenceLine y={r.targets.calories} stroke="currentColor" strokeDasharray="4 4" />}
                        <Bar dataKey="calories" fill={BRAND_BLUE} radius={[3, 3, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                )}
              </>
            )}
          </Card>

          <Card title="Weight & measurements" icon={Scale}>
            {!r.body.first ? <p className="text-xs text-gray-500">No check-ins in this period.</p> : (
              <>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  <Stat label="Latest weight" value={r.body.latestWeight != null ? `${r.body.latestWeight} kg` : '—'} sub={r.body.change.weightKg != null && <Delta now={r.body.change.weightKg} before={0} unit=" kg" higherIsBetter={false} />} />
                  <Stat label="Body fat" value={r.body.last?.bodyFatPct != null ? `${r.body.last.bodyFatPct}%` : '—'} sub={r.body.change.bodyFatPct != null && <Delta now={r.body.change.bodyFatPct} before={0} unit="%" higherIsBetter={false} />} />
                  {MEASUREMENTS.filter((m) => r.body.change[m.key] != null).slice(0, 2).map((m) => (
                    <Stat key={m.key} label={m.label} value={`${r.body.last?.[m.key] ?? '—'} cm`} sub={<Delta now={r.body.change[m.key]} before={0} unit=" cm" higherIsBetter={!['waistCm', 'hipsCm'].includes(m.key)} />} />
                  ))}
                </div>
                {hasWeight && series.filter((s: any) => s.weightKg != null).length > 1 && (
                  <div className={`h-36 mt-3 ${chartBox}`}>
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={series.filter((s: any) => s.weightKg != null)} margin={{ top: 5, right: 8, left: -20, bottom: 0 }}>
                        <CartesianGrid vertical={false} />
                        <XAxis dataKey="label" tick={{ fill: 'currentColor', fontSize: 10 }} tickLine={false} axisLine={false} />
                        <YAxis domain={['dataMin - 1', 'dataMax + 1']} tick={{ fill: 'currentColor', fontSize: 10 }} tickLine={false} axisLine={false} />
                        <Tooltip formatter={(v: any) => `${v} kg`} labelClassName="text-ink" />
                        <Line type="monotone" dataKey="weightKg" stroke={BRAND_BLUE} strokeWidth={2} dot={{ r: 2.5 }} />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                )}
              </>
            )}
          </Card>

          {period !== 'day' && (
            <Card title="Daily log" icon={Gauge}>
              <div className="overflow-x-auto">
                <table className="w-full text-xs min-w-[420px]">
                  <thead><tr className="text-gray-500 text-left"><th className="py-1 font-medium">Day</th><th className="py-1 font-medium">Sets</th><th className="py-1 font-medium">Volume</th><th className="py-1 font-medium">Km</th><th className="py-1 font-medium">kcal</th><th className="py-1 font-medium">Protein</th><th className="py-1 font-medium">Water</th><th className="py-1 font-medium">Weight</th></tr></thead>
                  <tbody>
                    {[...series].reverse().map((s: any) => (
                      <tr key={s.date} className={`border-t border-white/5 ${s.logged ? '' : 'opacity-40'}`}>
                        <td className="py-1.5 text-gray-300">{fmtDate(s.date, { weekday: 'short', day: 'numeric' })}</td>
                        <td className="py-1.5 text-gray-300">{s.sets || '—'}</td>
                        <td className="py-1.5 text-gray-300">{s.volume ? fmtNum(s.volume) : '—'}</td>
                        <td className="py-1.5 text-gray-300">{s.km || '—'}</td>
                        <td className="py-1.5 text-gray-300">{s.calories || '—'}</td>
                        <td className="py-1.5 text-gray-300">{s.protein ? `${fmtNum(s.protein)}g` : '—'}</td>
                        <td className="py-1.5 text-gray-300">{s.waterL != null ? `${s.waterL}L` : '—'}</td>
                        <td className="py-1.5 text-gray-300">{s.weightKg ?? '—'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>
          )}
        </>
      )}
    </div>
  );
}
