'use client';

import { useEffect, useMemo, useState } from 'react';
import { Dumbbell, Plus, Trash2, Pencil, Copy, Trophy, ListChecks, Loader2, X, Clock } from 'lucide-react';
import { toast } from 'sonner';
import { progressApi, type DayBundle, type NewPR, type WorkoutRow } from './api';
import { Card, Empty, Field, Stat, btnGhost, btnPrimary, fmtDate, fmtNum, inputCls } from './ui';
import { fmtKg, workoutTotals, type ExercisePR } from '@/lib/progressCalc';

interface SetDraft { reps: string; weightKg: string }
interface ExerciseDraft { name: string; note: string; sets: SetDraft[] }
interface Draft { id?: number; title: string; durationMin: string; notes: string; exercises: ExerciseDraft[] }

const blankExercise = (name = ''): ExerciseDraft => ({ name, note: '', sets: [{ reps: '', weightKg: '' }] });
const blankDraft = (): Draft => ({ title: '', durationMin: '', notes: '', exercises: [blankExercise()] });

function toDraft(w: WorkoutRow): Draft {
  const groups: ExerciseDraft[] = [];
  for (const s of w.sets) {
    let g = groups[groups.length - 1];
    if (!g || g.name.toLowerCase() !== s.exercise.toLowerCase()) {
      g = { name: s.exercise, note: s.exerciseNote ?? '', sets: [] };
      groups.push(g);
    }
    g.sets.push({ reps: String(s.reps), weightKg: s.weightKg ? String(s.weightKg) : '' });
  }
  return { id: w.id, title: w.title ?? '', durationMin: w.durationMin ? String(w.durationMin) : '', notes: w.notes ?? '', exercises: groups.length ? groups : [blankExercise()] };
}

function flatten(d: Draft) {
  return d.exercises.flatMap((e) =>
    e.sets.map((s) => ({ exercise: e.name.trim(), exerciseNote: e.note.trim() || null, reps: Number(s.reps) || 0, weightKg: Number(s.weightKg) || 0 }))
  ).filter((s) => s.exercise && s.reps > 0);
}

/** Group a saved session's sets by exercise for display. */
function groupSets(w: WorkoutRow) {
  const out: { name: string; note: string | null; sets: { reps: number; weightKg: number }[] }[] = [];
  for (const s of w.sets) {
    const last = out[out.length - 1];
    if (last && last.name.toLowerCase() === s.exercise.toLowerCase()) last.sets.push(s);
    else out.push({ name: s.exercise, note: s.exerciseNote ?? null, sets: [s] });
  }
  return out;
}

export default function WorkoutTab({ bundle, userId, onChanged, prs }: { bundle: DayBundle; userId?: number | null; onChanged: () => void; prs: ExercisePR[] }) {
  const [draft, setDraft] = useState<Draft | null>(null);
  const [saving, setSaving] = useState(false);
  const [lastPRs, setLastPRs] = useState<NewPR[]>([]);

  useEffect(() => { setDraft(null); setLastPRs([]); }, [bundle.date]);

  const suggestions = useMemo(() => {
    const names = new Set<string>();
    bundle.planned?.exercises.forEach((e) => names.add(e.name));
    prs.forEach((p) => names.add(p.exercise));
    return Array.from(names).sort();
  }, [bundle.planned, prs]);

  const prByKey = useMemo(() => new Map(prs.map((p) => [p.exerciseKey, p])), [prs]);
  const dayTotals = workoutTotals(bundle.workouts.flatMap((w) => w.sets));
  const dayMinutes = bundle.workouts.reduce((a, w) => a + (w.durationMin ?? 0), 0);
  const draftTotals = draft ? workoutTotals(flatten(draft)) : null;

  const update = (fn: (d: Draft) => void) => setDraft((d) => { if (!d) return d; const c: Draft = JSON.parse(JSON.stringify(d)); fn(c); return c; });

  const loadPlan = () => {
    if (!bundle.planned?.exercises.length) return;
    const exercises = bundle.planned.exercises.map((e) => {
      const reps = String(e.reps ?? '').match(/\d+/)?.[0] ?? '';
      const count = Math.max(1, Math.min(10, e.sets ?? 1));
      return { name: e.name, note: '', sets: Array.from({ length: count }, () => ({ reps, weightKg: '' })) };
    });
    setDraft({ ...blankDraft(), title: bundle.planned.title, exercises });
  };

  const save = async () => {
    if (!draft) return;
    const sets = flatten(draft);
    if (!sets.length) { toast.error('Add at least one set with an exercise name and reps'); return; }
    setSaving(true);
    try {
      const payload = { id: draft.id, date: bundle.date, title: draft.title, durationMin: draft.durationMin, notes: draft.notes, sets };
      const res = await progressApi<{ newPRs: NewPR[] }>('workouts', { method: draft.id ? 'PUT' : 'POST', body: payload, userId });
      setDraft(null);
      setLastPRs(res.newPRs ?? []);
      if (res.newPRs?.length) {
        toast.success(`New personal record${res.newPRs.length > 1 ? 's' : ''}`, { description: res.newPRs.map((p) => `${p.exercise}: ${p.detail}`).join(' · ') });
      } else {
        toast.success('Workout saved');
      }
      onChanged();
    } catch (e: any) {
      toast.error(e.message || 'Could not save workout');
    } finally {
      setSaving(false);
    }
  };

  const remove = async (id: number) => {
    if (!confirm('Delete this workout and all its sets?')) return;
    try {
      await progressApi('workouts', { method: 'DELETE', query: { id }, userId });
      toast.success('Workout deleted');
      onChanged();
    } catch (e: any) {
      toast.error(e.message || 'Could not delete');
    }
  };

  return (
    <div className="space-y-4">
      {lastPRs.length > 0 && (
        <div className="rounded-xl border border-brand-gold/40 bg-brand-gold/[0.08] p-4">
          <div className="flex items-start justify-between gap-2">
            <p className="flex items-center gap-2 text-sm font-bold text-white"><Trophy className="w-4 h-4 text-brand-gold" /> New personal record{lastPRs.length > 1 ? 's' : ''}</p>
            <button onClick={() => setLastPRs([])} className="text-gray-500 hover:text-white" aria-label="Dismiss"><X className="w-4 h-4" /></button>
          </div>
          <ul className="mt-2 space-y-1">
            {lastPRs.map((p, i) => (
              <li key={i} className="text-sm text-gray-200">
                <span className="font-semibold">{p.exercise}</span> — {p.detail}
                <span className="text-gray-500"> (was {p.kind === 'reps' ? `${p.previous} reps` : fmtKg(p.previous)})</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
        <Stat label="Sets" value={dayTotals.sets} />
        <Stat label="Reps" value={fmtNum(dayTotals.reps)} />
        <Stat label="Volume" value={`${fmtNum(dayTotals.volume)} kg`} />
        <Stat label="Duration" value={dayMinutes ? `${dayMinutes} min` : '—'} />
      </div>

      {/* Coach's plan for this weekday */}
      {bundle.planned && bundle.planned.exercises.length > 0 && !draft && (
        <Card title={`Planned: ${bundle.planned.title}`} icon={ListChecks} action={<button onClick={loadPlan} className={btnGhost}><Copy className="w-3.5 h-3.5" /> Log this plan</button>}>
          <ul className="grid sm:grid-cols-2 gap-x-4 gap-y-1">
            {bundle.planned.exercises.map((e, i) => {
              const done = bundle.workouts.some((w) => w.sets.some((s) => s.exercise.toLowerCase().trim() === e.name.toLowerCase().trim()));
              return (
                <li key={i} className={`text-sm flex items-center justify-between gap-2 ${done ? 'text-emerald-400' : 'text-gray-300'}`}>
                  <span className="truncate">{e.name}</span>
                  <span className="text-xs text-gray-500 flex-shrink-0">{e.sets ? `${e.sets} x ${e.reps ?? ''}` : e.reps}</span>
                </li>
              );
            })}
          </ul>
        </Card>
      )}

      {/* Editor */}
      {draft ? (
        <Card title={draft.id ? 'Edit workout' : 'Log a workout'} icon={Dumbbell}>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 mb-3">
            <Field label="Session name"><input className={inputCls} placeholder="Push day, Legs..." value={draft.title} onChange={(e) => update((d) => { d.title = e.target.value; })} /></Field>
            <Field label="Duration (min)"><input className={inputCls} inputMode="numeric" placeholder="60" value={draft.durationMin} onChange={(e) => update((d) => { d.durationMin = e.target.value.replace(/[^\d]/g, ''); })} /></Field>
            <Field label="Session notes"><input className={inputCls} placeholder="Felt strong today" value={draft.notes} onChange={(e) => update((d) => { d.notes = e.target.value; })} /></Field>
          </div>

          <datalist id="progress-exercise-names">{suggestions.map((n) => <option key={n} value={n} />)}</datalist>

          <div className="space-y-3">
            {draft.exercises.map((ex, ei) => {
              const pr = prByKey.get(ex.name.toLowerCase().replace(/\s+/g, ' ').trim());
              return (
                <div key={ei} className="rounded-lg border border-white/[0.08] bg-white/[0.02] p-3">
                  <div className="flex items-center gap-2 mb-2">
                    <input list="progress-exercise-names" className={`${inputCls} font-semibold`} placeholder="Exercise (e.g. Bench Press)" value={ex.name} onChange={(e) => update((d) => { d.exercises[ei].name = e.target.value; })} />
                    {draft.exercises.length > 1 && (
                      <button onClick={() => update((d) => { d.exercises.splice(ei, 1); })} className="p-2 text-gray-500 hover:text-rose-400" aria-label="Remove exercise"><Trash2 className="w-4 h-4" /></button>
                    )}
                  </div>
                  {pr && <p className="text-[11px] text-gray-500 mb-2">Your best: {fmtKg(pr.maxWeight)} x {pr.maxWeightReps} · most reps {pr.maxReps}</p>}
                  <div className="space-y-1.5">
                    <div className="grid grid-cols-[2rem_1fr_1fr_2rem] gap-2 text-[10px] uppercase tracking-wide text-gray-500 px-0.5">
                      <span>Set</span><span>Reps</span><span>Weight (kg)</span><span />
                    </div>
                    {ex.sets.map((s, si) => (
                      <div key={si} className="grid grid-cols-[2rem_1fr_1fr_2rem] gap-2 items-center">
                        <span className="text-xs font-bold text-gray-400 text-center">{si + 1}</span>
                        <input className={inputCls} inputMode="numeric" placeholder="10" value={s.reps} onChange={(e) => update((d) => { d.exercises[ei].sets[si].reps = e.target.value.replace(/[^\d]/g, ''); })} />
                        <input className={inputCls} inputMode="decimal" placeholder="0" value={s.weightKg} onChange={(e) => update((d) => { d.exercises[ei].sets[si].weightKg = e.target.value.replace(/[^\d.]/g, ''); })} />
                        <button onClick={() => update((d) => { d.exercises[ei].sets.splice(si, 1); if (!d.exercises[ei].sets.length) d.exercises[ei].sets.push({ reps: '', weightKg: '' }); })} className="p-1.5 text-gray-600 hover:text-rose-400" aria-label="Remove set"><X className="w-3.5 h-3.5" /></button>
                      </div>
                    ))}
                  </div>
                  <div className="flex items-center gap-2 mt-2">
                    <button onClick={() => update((d) => { const last = d.exercises[ei].sets[d.exercises[ei].sets.length - 1]; d.exercises[ei].sets.push({ ...last }); })} className={btnGhost}><Plus className="w-3.5 h-3.5" /> Add set</button>
                    <input className={`${inputCls} text-xs`} placeholder="Exercise notes (form, tempo...)" value={ex.note} onChange={(e) => update((d) => { d.exercises[ei].note = e.target.value; })} />
                  </div>
                </div>
              );
            })}
          </div>

          <button onClick={() => update((d) => { d.exercises.push(blankExercise()); })} className={`${btnGhost} mt-3 w-full`}><Plus className="w-3.5 h-3.5" /> Add exercise</button>

          {draftTotals && (
            <p className="text-xs text-gray-400 mt-3">
              {draftTotals.exercises} exercise{draftTotals.exercises === 1 ? '' : 's'} · {draftTotals.sets} sets · {fmtNum(draftTotals.reps)} reps · <span className="text-white font-semibold">{fmtNum(draftTotals.volume)} kg volume</span>
            </p>
          )}

          <div className="flex gap-2 mt-4">
            <button onClick={() => setDraft(null)} className={`${btnGhost} flex-1`}>Cancel</button>
            <button onClick={save} disabled={saving} className={`${btnPrimary} flex-[2]`}>{saving && <Loader2 className="w-4 h-4 animate-spin" />} {draft.id ? 'Save changes' : 'Save workout'}</button>
          </div>
        </Card>
      ) : (
        <button onClick={() => setDraft(blankDraft())} className={`${btnPrimary} w-full`}><Plus className="w-4 h-4" /> Log a workout</button>
      )}

      {/* Sessions on this day */}
      {bundle.workouts.length === 0 && !draft ? (
        <Empty icon={Dumbbell} text={`No workout logged for ${fmtDate(bundle.date, { weekday: 'long', day: 'numeric', month: 'short' })}`} />
      ) : (
        bundle.workouts.map((w) => {
          const t = workoutTotals(w.sets);
          return (
            <Card key={w.id} title={w.title || 'Workout'} icon={Dumbbell} action={
              <div className="flex gap-1">
                <button onClick={() => setDraft(toDraft(w))} className="p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-white/5" aria-label="Edit"><Pencil className="w-3.5 h-3.5" /></button>
                <button onClick={() => remove(w.id)} className="p-1.5 rounded-lg text-gray-400 hover:text-rose-400 hover:bg-white/5" aria-label="Delete"><Trash2 className="w-3.5 h-3.5" /></button>
              </div>
            }>
              <p className="text-xs text-gray-500 mb-3 flex flex-wrap gap-x-3">
                <span>{t.sets} sets</span><span>{fmtNum(t.reps)} reps</span><span>{fmtNum(t.volume)} kg volume</span>
                {w.durationMin ? <span className="inline-flex items-center gap-1"><Clock className="w-3 h-3" />{w.durationMin} min</span> : null}
              </p>
              <div className="space-y-2">
                {groupSets(w).map((g, i) => (
                  <div key={i} className="text-sm">
                    <p className="text-white font-semibold">{g.name}</p>
                    <p className="text-gray-400 text-xs mt-0.5">{g.sets.map((s) => (s.weightKg ? `${s.reps} x ${s.weightKg}kg` : `${s.reps} reps`)).join('  ·  ')}</p>
                    {g.note && <p className="text-gray-500 text-xs italic mt-0.5">{g.note}</p>}
                  </div>
                ))}
              </div>
              {w.notes && <p className="text-xs text-gray-400 mt-3 border-t border-white/5 pt-2">{w.notes}</p>}
            </Card>
          );
        })
      )}

      {/* Personal records */}
      <Card title="Personal records" icon={Trophy}>
        {prs.length === 0 ? (
          <p className="text-sm text-gray-500">Records appear here once you log the same exercise twice.</p>
        ) : (
          <div className="overflow-x-auto -mx-1">
            <table className="w-full text-xs min-w-[420px]">
              <thead>
                <tr className="text-gray-500 text-left">
                  <th className="py-1.5 px-1 font-medium">Exercise</th>
                  <th className="py-1.5 px-1 font-medium">Heaviest</th>
                  <th className="py-1.5 px-1 font-medium">Most reps</th>
                  <th className="py-1.5 px-1 font-medium">Est. 1RM</th>
                  <th className="py-1.5 px-1 font-medium text-right">Sessions</th>
                </tr>
              </thead>
              <tbody>
                {prs.map((p) => (
                  <tr key={p.exerciseKey} className="border-t border-white/5">
                    <td className="py-1.5 px-1 text-white font-medium">{p.exercise}</td>
                    <td className="py-1.5 px-1 text-gray-300">{p.maxWeight ? `${fmtKg(p.maxWeight)} x ${p.maxWeightReps}` : '—'}<span className="block text-[10px] text-gray-600">{fmtDate(p.maxWeightDate)}</span></td>
                    <td className="py-1.5 px-1 text-gray-300">{p.maxReps}{p.maxRepsWeight ? ` @ ${p.maxRepsWeight}kg` : ''}<span className="block text-[10px] text-gray-600">{fmtDate(p.maxRepsDate)}</span></td>
                    <td className="py-1.5 px-1 text-gray-300">{p.best1RM ? fmtKg(p.best1RM) : '—'}</td>
                    <td className="py-1.5 px-1 text-gray-400 text-right">{p.sessions}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </div>
  );
}
