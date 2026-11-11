'use client';

import { useCallback, useEffect, useState } from 'react';
import { Activity, Plus, Pencil, Trash2, Loader2, Timer, Gauge, Flame, Mountain } from 'lucide-react';
import { toast } from 'sonner';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import { progressApi, type CardioRow, type DayBundle } from './api';
import { BRAND_BLUE, Card, Delta, Empty, Field, Stat, btnGhost, btnPrimary, chartBox, fmtDate, inputCls } from './ui';
import { CARDIO_ACTIVITIES, activityLabel, estimateCardioCalories, fmtDuration, fmtPace, paceMinPerKm, parseDuration, speedKmh } from '@/lib/progressCalc';

interface Draft { id?: number; activity: string; distanceKm: string; duration: string; inclinePct: string; calories: string; notes: string }
const blank = (): Draft => ({ activity: 'run', distanceKm: '', duration: '', inclinePct: '', calories: '', notes: '' });
const toDraft = (c: CardioRow): Draft => ({
  id: c.id, activity: c.activity, distanceKm: c.distanceKm != null ? String(c.distanceKm) : '', duration: c.durationSec ? fmtDuration(c.durationSec) : '',
  inclinePct: c.inclinePct != null ? String(c.inclinePct) : '', calories: c.calories != null ? String(c.calories) : '', notes: c.notes ?? '',
});

export default function CardioTab({ bundle, userId, onChanged }: { bundle: DayBundle; userId?: number | null; onChanged: () => void }) {
  const [draft, setDraft] = useState<Draft | null>(null);
  const [saving, setSaving] = useState(false);
  const [history, setHistory] = useState<CardioRow[]>([]);

  const loadHistory = useCallback(async () => {
    try {
      const res = await progressApi<{ cardio: CardioRow[] }>('cardio', { query: { limit: 60 }, userId });
      setHistory(res.cardio);
    } catch { /* non-critical */ }
  }, [userId]);
  useEffect(() => { loadHistory(); }, [loadHistory, bundle]);
  useEffect(() => { setDraft(null); }, [bundle.date]);

  const bodyWeight = bundle.latestBody?.weightKg ?? null;
  const dSec = draft ? parseDuration(draft.duration) : null;
  const dKm = draft ? Number(draft.distanceKm) || null : null;
  const dIncline = draft ? Number(draft.inclinePct) || null : null;
  const preview = draft && {
    speed: speedKmh(dKm, dSec),
    pace: paceMinPerKm(dKm, dSec),
    kcal: draft.calories ? Number(draft.calories) : estimateCardioCalories({ activity: draft.activity, distanceKm: dKm, durationSec: dSec, inclinePct: dIncline, bodyWeightKg: bodyWeight }),
  };

  // The session before `c` of the same activity (history is newest first).
  const previousOf = (c: CardioRow) => history.find((h) => h.activity === c.activity && (h.date < c.date || (h.date === c.date && h.id < c.id)) && h.id !== c.id);

  const save = async () => {
    if (!draft) return;
    if (draft.duration && dSec == null) { toast.error('Time should look like 32 (minutes), 32:15 or 1:05:00'); return; }
    if (!dKm && !dSec) { toast.error('Enter a distance or a time'); return; }
    setSaving(true);
    try {
      await progressApi('cardio', {
        method: draft.id ? 'PUT' : 'POST', userId,
        body: { id: draft.id, date: bundle.date, activity: draft.activity, distanceKm: draft.distanceKm, durationSec: dSec, inclinePct: draft.inclinePct, calories: draft.calories, notes: draft.notes },
      });
      toast.success('Cardio saved');
      setDraft(null);
      onChanged();
    } catch (e: any) {
      toast.error(e.message || 'Could not save');
    } finally {
      setSaving(false);
    }
  };

  const remove = async (id: number) => {
    if (!confirm('Delete this cardio session?')) return;
    try {
      await progressApi('cardio', { method: 'DELETE', query: { id }, userId });
      onChanged();
    } catch (e: any) {
      toast.error(e.message || 'Could not delete');
    }
  };

  const paceTrend = history
    .filter((h) => h.distanceKm && h.durationSec)
    .slice(0, 20)
    .reverse()
    .map((h) => ({ date: fmtDate(h.date), pace: Number(paceMinPerKm(h.distanceKm, h.durationSec)!.toFixed(2)), km: h.distanceKm }));

  const set = (k: keyof Draft, v: string) => setDraft((d) => (d ? { ...d, [k]: v } : d));

  return (
    <div className="space-y-4">
      {draft ? (
        <Card title={draft.id ? 'Edit cardio' : 'Log cardio'} icon={Activity}>
          <div className="flex flex-wrap gap-1.5 mb-3">
            {CARDIO_ACTIVITIES.map((a) => (
              <button key={a.key} onClick={() => set('activity', a.key)} className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-colors ${draft.activity === a.key ? 'bg-brand-blue/15 border-brand-blue/40 text-brand-blue' : 'bg-white/[0.03] border-white/10 text-gray-400 hover:text-white'}`}>
                {a.label}
              </button>
            ))}
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            <Field label="Distance (km)"><input className={inputCls} inputMode="decimal" placeholder="5" value={draft.distanceKm} onChange={(e) => set('distanceKm', e.target.value.replace(/[^\d.]/g, ''))} /></Field>
            <Field label="Time" hint="min, or mm:ss"><input className={inputCls} placeholder="28:30" value={draft.duration} onChange={(e) => set('duration', e.target.value.replace(/[^\d:]/g, ''))} /></Field>
            <Field label="Incline (%)"><input className={inputCls} inputMode="decimal" placeholder="0" value={draft.inclinePct} onChange={(e) => set('inclinePct', e.target.value.replace(/[^\d.]/g, ''))} /></Field>
            <Field label="Calories" hint="blank = estimate"><input className={inputCls} inputMode="numeric" placeholder={preview?.kcal ? String(preview.kcal) : 'auto'} value={draft.calories} onChange={(e) => set('calories', e.target.value.replace(/[^\d]/g, ''))} /></Field>
          </div>
          <Field label="Notes"><input className={`${inputCls} mt-0`} placeholder="Intervals, how it felt..." value={draft.notes} onChange={(e) => set('notes', e.target.value)} /></Field>

          {preview && (
            <div className="grid grid-cols-3 gap-2 mt-3">
              <Stat label="Avg speed" value={preview.speed ? `${preview.speed.toFixed(1)} km/h` : '—'} />
              <Stat label="Pace" value={fmtPace(preview.pace)} />
              <Stat label={draft.calories ? 'Calories' : 'Est. calories'} value={preview.kcal ? `${preview.kcal} kcal` : '—'} />
            </div>
          )}
          {!draft.calories && !bodyWeight && <p className="text-[11px] text-gray-600 mt-2">Estimate assumes 70 kg. Log your weight in Body for a better estimate.</p>}

          <div className="flex gap-2 mt-4">
            <button onClick={() => setDraft(null)} className={`${btnGhost} flex-1`}>Cancel</button>
            <button onClick={save} disabled={saving} className={`${btnPrimary} flex-[2]`}>{saving && <Loader2 className="w-4 h-4 animate-spin" />} Save</button>
          </div>
        </Card>
      ) : (
        <button onClick={() => setDraft(blank())} className={`${btnPrimary} w-full`}><Plus className="w-4 h-4" /> Log run or cardio</button>
      )}

      {bundle.cardio.length === 0 && !draft ? (
        <Empty icon={Activity} text="No cardio logged for this day" />
      ) : (
        bundle.cardio.map((c) => {
          const pace = paceMinPerKm(c.distanceKm, c.durationSec);
          const speed = speedKmh(c.distanceKm, c.durationSec);
          const prev = previousOf(c);
          const prevPace = prev ? paceMinPerKm(prev.distanceKm, prev.durationSec) : null;
          return (
            <Card key={c.id} title={activityLabel(c.activity)} icon={Activity} action={
              <div className="flex gap-1">
                <button onClick={() => setDraft(toDraft(c))} className="p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-white/5" aria-label="Edit"><Pencil className="w-3.5 h-3.5" /></button>
                <button onClick={() => remove(c.id)} className="p-1.5 rounded-lg text-gray-400 hover:text-rose-400 hover:bg-white/5" aria-label="Delete"><Trash2 className="w-3.5 h-3.5" /></button>
              </div>
            }>
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                <Stat label="Distance" value={c.distanceKm != null ? `${c.distanceKm} km` : '—'} sub={prev && <Delta now={c.distanceKm} before={prev.distanceKm} unit=" km" />} />
                <Stat label="Time" value={fmtDuration(c.durationSec)} />
                <Stat label="Pace" value={fmtPace(pace)} sub={prevPace != null && pace != null && <Delta now={pace} before={prevPace} higherIsBetter={false} format={(n) => `${Math.round(n * 60)}s/km`} />} />
                <Stat label="Avg speed" value={speed ? `${speed.toFixed(1)} km/h` : '—'} />
                <Stat label="Calories" value={c.calories ? `${c.calories}` : '—'} />
              </div>
              <div className="flex flex-wrap gap-x-4 gap-y-1 mt-2 text-xs text-gray-500">
                {c.inclinePct ? <span className="inline-flex items-center gap-1"><Mountain className="w-3 h-3" /> {c.inclinePct}% incline</span> : null}
                {prev && <span>vs {fmtDate(prev.date)}</span>}
                {c.notes && <span className="text-gray-400">{c.notes}</span>}
              </div>
            </Card>
          );
        })
      )}

      {paceTrend.length >= 2 && (
        <Card title="Pace trend" icon={Gauge}>
          <p className="text-[11px] text-gray-500 -mt-2 mb-2">Minutes per km — lower is faster</p>
          <div className={`h-44 ${chartBox}`}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={paceTrend} margin={{ top: 5, right: 8, left: -20, bottom: 0 }}>
                <CartesianGrid vertical={false} />
                <XAxis dataKey="date" tick={{ fill: 'currentColor', fontSize: 10 }} tickLine={false} axisLine={false} />
                <YAxis reversed domain={['dataMin - 0.2', 'dataMax + 0.2']} tick={{ fill: 'currentColor', fontSize: 10 }} tickLine={false} axisLine={false} tickFormatter={(v) => fmtPace(v).replace(' /km', '')} />
                <Tooltip formatter={(v: any) => fmtPace(Number(v))} labelClassName="text-ink" />
                <Line type="monotone" dataKey="pace" stroke={BRAND_BLUE} strokeWidth={2} dot={{ r: 2.5 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>
      )}

      {history.length > 0 && (
        <Card title="Recent sessions" icon={Timer}>
          <div className="space-y-1.5">
            {history.slice(0, 10).map((h) => (
              <div key={h.id} className="flex items-center justify-between text-xs border-b border-white/5 last:border-0 pb-1.5">
                <span className="text-gray-300">{fmtDate(h.date)} · {activityLabel(h.activity)}</span>
                <span className="text-gray-400 tabular-nums">
                  {h.distanceKm != null ? `${h.distanceKm} km · ` : ''}{fmtDuration(h.durationSec)}{h.distanceKm && h.durationSec ? ` · ${fmtPace(paceMinPerKm(h.distanceKm, h.durationSec))}` : ''}
                  {h.calories ? <span className="inline-flex items-center gap-0.5 ml-2"><Flame className="w-3 h-3" />{h.calories}</span> : null}
                </span>
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
}
