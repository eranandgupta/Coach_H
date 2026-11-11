'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { Scale, Ruler, Camera, Loader2, Trash2, Columns2, LineChart as LineIcon } from 'lucide-react';
import { toast } from 'sonner';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import ImageKitUpload from '@/components/ImageKitUpload';
import { progressApi, type BodyRow, type DayBundle } from './api';
import { BRAND_BLUE, Card, Delta, Field, btnPrimary, chartBox, fmtDate, inputCls } from './ui';
import { MEASUREMENTS } from '@/lib/progressCalc';

type Form = Record<'weightKg' | 'bodyFatPct' | 'chestCm' | 'waistCm' | 'hipsCm' | 'armsCm' | 'thighsCm' | 'neckCm' | 'notes', string> & { photoFront: string; photoSide: string; photoBack: string };
const FIELDS = ['weightKg', 'bodyFatPct', ...MEASUREMENTS.map((m) => m.key)] as const;
const toForm = (b: BodyRow | null): Form => ({
  weightKg: b?.weightKg != null ? String(b.weightKg) : '', bodyFatPct: b?.bodyFatPct != null ? String(b.bodyFatPct) : '',
  chestCm: b?.chestCm != null ? String(b.chestCm) : '', waistCm: b?.waistCm != null ? String(b.waistCm) : '',
  hipsCm: b?.hipsCm != null ? String(b.hipsCm) : '', armsCm: b?.armsCm != null ? String(b.armsCm) : '',
  thighsCm: b?.thighsCm != null ? String(b.thighsCm) : '', neckCm: b?.neckCm != null ? String(b.neckCm) : '',
  notes: b?.notes ?? '', photoFront: b?.photoFront ?? '', photoSide: b?.photoSide ?? '', photoBack: b?.photoBack ?? '',
});
const POSES = [
  { key: 'photoFront', label: 'Front' },
  { key: 'photoSide', label: 'Side' },
  { key: 'photoBack', label: 'Back' },
] as const;
const ik = (url: string, w = 500) => (url.includes('ik.imagekit.io') ? `${url}${url.includes('?') ? '&' : '?'}tr=w-${w},q-80,f-auto` : url);

export default function BodyTab({ bundle, userId, onChanged }: { bundle: DayBundle; userId?: number | null; onChanged: () => void }) {
  const [form, setForm] = useState<Form>(toForm(bundle.body));
  const [saving, setSaving] = useState(false);
  const [history, setHistory] = useState<BodyRow[]>([]);
  const [compareA, setCompareA] = useState<string>('');
  const [compareB, setCompareB] = useState<string>('');

  useEffect(() => { setForm(toForm(bundle.body)); }, [bundle.body, bundle.date]);

  const load = useCallback(async () => {
    try {
      const res = await progressApi<{ metrics: BodyRow[] }>('body', { userId });
      setHistory(res.metrics);
    } catch { /* non-critical */ }
  }, [userId]);
  useEffect(() => { load(); }, [load, bundle]);

  const withPhotos = useMemo(() => history.filter((h) => h.photoFront || h.photoSide || h.photoBack), [history]);
  useEffect(() => {
    if (withPhotos.length >= 1 && !compareA) setCompareA(withPhotos[0].date);
    if (withPhotos.length >= 2 && !compareB) setCompareB(withPhotos[withPhotos.length - 1].date);
  }, [withPhotos]); // eslint-disable-line react-hooks/exhaustive-deps

  const save = async () => {
    setSaving(true);
    try {
      await progressApi('body', { method: 'POST', userId, body: { ...form, date: bundle.date } });
      toast.success('Check-in saved');
      onChanged();
    } catch (e: any) {
      toast.error(e.message || 'Could not save');
    } finally {
      setSaving(false);
    }
  };

  const remove = async () => {
    if (!bundle.body || !confirm('Delete this day’s check-in (measurements and photos)?')) return;
    try {
      await progressApi('body', { method: 'DELETE', query: { id: bundle.body.id }, userId });
      onChanged();
    } catch (e: any) {
      toast.error(e.message || 'Could not delete');
    }
  };

  const set = (k: keyof Form, v: string) => setForm((f) => ({ ...f, [k]: v }));
  const first = history[0];
  const latest = history[history.length - 1];
  const firstOf = (k: string) => history.find((h: any) => h[k] != null) as any;
  const lastOf = (k: string) => [...history].reverse().find((h: any) => h[k] != null) as any;
  const weightSeries = history.filter((h) => h.weightKg != null).map((h) => ({ date: fmtDate(h.date), weight: h.weightKg, fat: h.bodyFatPct }));
  const A = withPhotos.find((h) => h.date === compareA);
  const B = withPhotos.find((h) => h.date === compareB);

  return (
    <div className="space-y-4">
      <Card title={`Check-in · ${fmtDate(bundle.date, { weekday: 'short', day: 'numeric', month: 'short' })}`} icon={Scale} action={bundle.body && <button onClick={remove} className="p-1.5 rounded-lg text-gray-500 hover:text-rose-400" aria-label="Delete check-in"><Trash2 className="w-3.5 h-3.5" /></button>}>
        <div className="grid grid-cols-2 gap-2 mb-2">
          <Field label="Body weight (kg)"><input className={inputCls} inputMode="decimal" placeholder={bundle.latestBody?.weightKg ? String(bundle.latestBody.weightKg) : '72.5'} value={form.weightKg} onChange={(e) => set('weightKg', e.target.value.replace(/[^\d.]/g, ''))} /></Field>
          <Field label="Body fat (%)"><input className={inputCls} inputMode="decimal" placeholder="18" value={form.bodyFatPct} onChange={(e) => set('bodyFatPct', e.target.value.replace(/[^\d.]/g, ''))} /></Field>
        </div>
        <p className="text-[11px] font-medium text-gray-400 mb-1 flex items-center gap-1"><Ruler className="w-3 h-3" /> Measurements (cm)</p>
        <div className="grid grid-cols-3 gap-2">
          {MEASUREMENTS.map((m) => (
            <Field key={m.key} label={m.label}><input className={inputCls} inputMode="decimal" value={form[m.key]} onChange={(e) => set(m.key, e.target.value.replace(/[^\d.]/g, ''))} /></Field>
          ))}
        </div>

        <p className="text-[11px] font-medium text-gray-400 mt-4 mb-1 flex items-center gap-1"><Camera className="w-3 h-3" /> Progress photos <span className="text-gray-600 font-normal">(monthly is plenty)</span></p>
        <div className="grid grid-cols-3 gap-2">
          {POSES.map((p) => (
            <div key={p.key}>
              <ImageKitUpload
                folder={`/progress/${userId ?? 'me'}`}
                label={p.label}
                currentImageUrl={form[p.key] || undefined}
                onUploadSuccess={(url) => set(p.key, url)}
                onRemove={() => set(p.key, '')}
                className="w-full [&_img]:h-32 sm:[&_img]:h-44 [&_img]:max-w-none [&_label]:px-2 [&_label]:py-4"
              />
            </div>
          ))}
        </div>
        <Field label="Notes"><input className={`${inputCls}`} placeholder="Morning, fasted..." value={form.notes} onChange={(e) => set('notes', e.target.value)} /></Field>
        <button onClick={save} disabled={saving} className={`${btnPrimary} w-full mt-4`}>{saving && <Loader2 className="w-4 h-4 animate-spin" />} Save check-in</button>
      </Card>

      {weightSeries.length >= 2 && (
        <Card title="Weight trend" icon={LineIcon}>
          <div className={`h-48 ${chartBox}`}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={weightSeries} margin={{ top: 5, right: 8, left: -20, bottom: 0 }}>
                <CartesianGrid vertical={false} />
                <XAxis dataKey="date" tick={{ fill: 'currentColor', fontSize: 10 }} tickLine={false} axisLine={false} />
                <YAxis domain={['dataMin - 1', 'dataMax + 1']} tick={{ fill: 'currentColor', fontSize: 10 }} tickLine={false} axisLine={false} />
                <Tooltip formatter={(v: any) => `${v} kg`} labelClassName="text-ink" />
                <Line type="monotone" dataKey="weight" stroke={BRAND_BLUE} strokeWidth={2} dot={{ r: 2.5 }} connectNulls />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>
      )}

      {history.length >= 1 && (
        <Card title="Transformation so far" icon={Ruler}>
          <p className="text-[11px] text-gray-500 -mt-2 mb-2">{first && latest && first.date !== latest.date ? `${fmtDate(first.date, { day: 'numeric', month: 'short', year: 'numeric' })} to ${fmtDate(latest.date, { day: 'numeric', month: 'short', year: 'numeric' })}` : 'Log another check-in to see your change'}</p>
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead><tr className="text-gray-500 text-left"><th className="py-1 font-medium">Measure</th><th className="py-1 font-medium">Start</th><th className="py-1 font-medium">Latest</th><th className="py-1 font-medium text-right">Change</th></tr></thead>
              <tbody>
                {FIELDS.map((k) => {
                  const a = firstOf(k); const b = lastOf(k);
                  if (!a) return null;
                  const label = k === 'weightKg' ? 'Weight' : k === 'bodyFatPct' ? 'Body fat' : MEASUREMENTS.find((m) => m.key === k)!.label;
                  const unit = k === 'weightKg' ? ' kg' : k === 'bodyFatPct' ? '%' : ' cm';
                  // Lower is "better" for weight, fat, waist, hips; arms/chest growing is usually the goal.
                  const lowerBetter = ['weightKg', 'bodyFatPct', 'waistCm', 'hipsCm'].includes(k);
                  return (
                    <tr key={k} className="border-t border-white/5">
                      <td className="py-1.5 text-gray-300">{label}</td>
                      <td className="py-1.5 text-gray-400">{a[k]}{unit}</td>
                      <td className="py-1.5 text-white font-semibold">{b[k]}{unit}</td>
                      <td className="py-1.5 text-right">{a.date !== b.date ? <Delta now={b[k]} before={a[k]} unit={unit} higherIsBetter={!lowerBetter} /> : <span className="text-gray-600">—</span>}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {withPhotos.length >= 1 && (
        <Card title="Compare photos" icon={Columns2}>
          <div className="grid grid-cols-2 gap-2 mb-3">
            {[{ v: compareA, setV: setCompareA, label: 'Before' }, { v: compareB, setV: setCompareB, label: 'After' }].map((s) => (
              <Field key={s.label} label={s.label}>
                <select className={inputCls} value={s.v} onChange={(e) => s.setV(e.target.value)}>
                  <option value="">Pick a date</option>
                  {withPhotos.map((h) => <option key={h.date} value={h.date}>{fmtDate(h.date, { day: 'numeric', month: 'short', year: 'numeric' })}{h.weightKg ? ` · ${h.weightKg} kg` : ''}</option>)}
                </select>
              </Field>
            ))}
          </div>
          {POSES.map((p) => (A?.[p.key] || B?.[p.key]) ? (
            <div key={p.key} className="mb-3">
              <p className="text-[11px] text-gray-500 mb-1">{p.label}</p>
              <div className="grid grid-cols-2 gap-2">
                {[A, B].map((row, i) => (
                  <div key={i} className="aspect-[3/4] rounded-lg overflow-hidden bg-white/[0.03] border border-white/[0.06] flex items-center justify-center">
                    {row?.[p.key] ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={ik(row[p.key]!)} alt={`${p.label} ${row.date}`} className="w-full h-full object-cover" loading="lazy" />
                    ) : <span className="text-[11px] text-gray-600">No photo</span>}
                  </div>
                ))}
              </div>
            </div>
          ) : null)}
          {withPhotos.length < 2 && <p className="text-xs text-gray-500">Add photos at your next check-in to compare side by side.</p>}
        </Card>
      )}

      {history.length > 0 && (
        <Card title="All check-ins" icon={Scale}>
          <div className="space-y-1.5 max-h-56 overflow-y-auto">
            {[...history].reverse().map((h) => (
              <div key={h.id} className="flex items-center justify-between text-xs border-b border-white/5 last:border-0 pb-1.5">
                <span className="text-gray-300">{fmtDate(h.date, { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                <span className="text-gray-400 tabular-nums flex items-center gap-2">
                  {h.weightKg != null && <span>{h.weightKg} kg</span>}
                  {h.bodyFatPct != null && <span>{h.bodyFatPct}%</span>}
                  {h.waistCm != null && <span>waist {h.waistCm}</span>}
                  {(h.photoFront || h.photoSide || h.photoBack) && <Camera className="w-3 h-3 text-brand-blue" />}
                </span>
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
}
