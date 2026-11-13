'use client';

import { useEffect, useMemo, useState } from 'react';
import { UtensilsCrossed, Plus, Trash2, Pencil, Droplet, Loader2, Search, Target } from 'lucide-react';
import { toast } from 'sonner';
import { progressApi, type DayBundle, type FoodRow } from './api';
import { Card, Field, TargetBar, btnGhost, btnPrimary, fmtNum, inputCls } from './ui';
import { MEAL_TYPES, foodTotals, round1 } from '@/lib/progressCalc';
import { FOODS, searchFoods, type FoodItem } from '@/lib/foods';

interface Draft { id?: number; mealType: string; foodName: string; foodSlug: string | null; quantity: string; calories: string; protein: string; carbs: string; fats: string }
const blank = (mealType: string): Draft => ({ mealType, foodName: '', foodSlug: null, quantity: '', calories: '', protein: '', carbs: '', fats: '' });
const toDraft = (f: FoodRow): Draft => ({
  id: f.id, mealType: f.mealType, foodName: f.foodName, foodSlug: f.foodSlug, quantity: f.quantity ?? '',
  calories: f.calories != null ? String(f.calories) : '', protein: f.protein != null ? String(f.protein) : '',
  carbs: f.carbs != null ? String(f.carbs) : '', fats: f.fats != null ? String(f.fats) : '',
});

/** Default meal for "now": breakfast before 11, lunch before 4, snacks before 7, else dinner. */
function mealForNow() {
  const h = new Date().getHours();
  return h < 11 ? 'breakfast' : h < 16 ? 'lunch' : h < 19 ? 'snacks' : 'dinner';
}

function FoodPicker({ onPick }: { onPick: (f: FoodItem) => void }) {
  const [q, setQ] = useState('');
  const results = useMemo(() => (q.trim().length >= 2 ? searchFoods(q).slice(0, 8) : []), [q]);
  return (
    <div className="relative">
      <Search className="w-4 h-4 text-gray-500 absolute left-3 top-1/2 -translate-y-1/2" />
      <input className={`${inputCls} pl-9`} placeholder={`Search ${(Math.floor(FOODS.length / 100) * 100).toLocaleString('en-IN')}+ foods (roti, paneer, dal...)`} value={q} onChange={(e) => setQ(e.target.value)} />
      {results.length > 0 && (
        <div className="absolute z-20 left-0 right-0 mt-1 rounded-lg border border-white/10 bg-[#0a0f1f] shadow-2xl max-h-64 overflow-y-auto">
          {results.map((f) => (
            <button key={f.slug} onClick={() => { onPick(f); setQ(''); }} className="w-full text-left px-3 py-2 hover:bg-white/[0.06] flex justify-between gap-2 text-sm">
              <span className="text-white truncate">{f.name}</span>
              <span className="text-gray-500 text-xs flex-shrink-0">{f.per100g.kcal} kcal/100g</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export default function DietTab({ bundle, userId, onChanged }: { bundle: DayBundle; userId?: number | null; onChanged: () => void }) {
  const [draft, setDraft] = useState<Draft | null>(null);
  const [picked, setPicked] = useState<FoodItem | null>(null);
  const [serving, setServing] = useState(0);
  const [count, setCount] = useState('1');
  const [saving, setSaving] = useState(false);
  const [water, setWater] = useState<string>('');
  const [savingWater, setSavingWater] = useState(false);

  useEffect(() => { setWater(bundle.waterL != null ? String(bundle.waterL) : ''); }, [bundle.waterL, bundle.date]);
  useEffect(() => { setDraft(null); setPicked(null); }, [bundle.date]);

  const totals = foodTotals(bundle.food);
  const t = bundle.targets;

  // Fill macros from the picked food x serving x count.
  useEffect(() => {
    if (!picked || !draft) return;
    const s = picked.servings[serving] ?? { label: '100 g', grams: 100 };
    const n = Number(count) || 0;
    const k = (s.grams / 100) * n;
    setDraft((d) => d && ({
      ...d, foodName: picked.name, foodSlug: picked.slug,
      quantity: `${n} x ${s.label}`,
      calories: String(Math.round(picked.per100g.kcal * k)),
      protein: String(round1(picked.per100g.protein * k)),
      carbs: String(round1(picked.per100g.carbs * k)),
      fats: String(round1(picked.per100g.fat * k)),
    }));
  }, [picked, serving, count]); // eslint-disable-line react-hooks/exhaustive-deps

  const open = (d: Draft) => { setDraft(d); setPicked(null); setServing(0); setCount('1'); };

  const save = async () => {
    if (!draft) return;
    if (!draft.foodName.trim()) { toast.error('Enter a food name'); return; }
    setSaving(true);
    try {
      await progressApi('food', { method: draft.id ? 'PUT' : 'POST', userId, body: { ...draft, date: bundle.date } });
      toast.success('Food saved');
      setDraft(null);
      setPicked(null);
      onChanged();
    } catch (e: any) {
      toast.error(e.message || 'Could not save');
    } finally {
      setSaving(false);
    }
  };

  const remove = async (id: number) => {
    try {
      await progressApi('food', { method: 'DELETE', query: { id }, userId });
      onChanged();
    } catch (e: any) {
      toast.error(e.message || 'Could not delete');
    }
  };

  const saveWater = async (value: number | null) => {
    setSavingWater(true);
    try {
      const res = await progressApi<{ waterL: number | null }>('water', { method: 'POST', userId, body: { date: bundle.date, waterL: value } });
      setWater(res.waterL != null ? String(res.waterL) : '');
      onChanged();
    } catch (e: any) {
      toast.error(e.message || 'Could not save water');
    } finally {
      setSavingWater(false);
    }
  };

  const set = (k: keyof Draft, v: string) => setDraft((d) => (d ? { ...d, [k]: v } : d));
  const numOnly = (v: string) => v.replace(/[^\d.]/g, '');

  return (
    <div className="space-y-4">
      <Card title="Today vs target" icon={Target} action={
        <span className="text-[10px] uppercase tracking-wide text-gray-500">
          {t.source === 'coach' ? 'Set by your coach' : t.source === 'diet-plan' ? 'From your diet plan' : 'No target set yet'}
        </span>
      }>
        <div className="grid sm:grid-cols-2 gap-3">
          <TargetBar label="Calories" value={totals.calories} target={t.calories} unit=" kcal" overIsBad />
          <TargetBar label="Protein" value={totals.protein} target={t.protein} unit=" g" />
          <TargetBar label="Carbs" value={totals.carbs} target={t.carbs} unit=" g" overIsBad />
          <TargetBar label="Fats" value={totals.fats} target={t.fats} unit=" g" overIsBad />
        </div>
      </Card>

      <Card title="Water" icon={Droplet}>
        <TargetBar label="Water" value={Number(water) || 0} target={t.waterL} unit=" L" />
        <div className="flex flex-wrap items-center gap-2 mt-3">
          {[0.25, 0.5, 1].map((add) => (
            <button key={add} disabled={savingWater} onClick={() => saveWater(round1((Number(water) || 0) + add))} className={btnGhost}>
              <Plus className="w-3 h-3" /> {add < 1 ? `${add * 1000} ml` : '1 L'}
            </button>
          ))}
          <div className="flex items-center gap-1.5 ml-auto">
            <input className={`${inputCls} w-20 text-center`} inputMode="decimal" value={water} placeholder="0" onChange={(e) => setWater(numOnly(e.target.value))} aria-label="Litres of water" />
            <span className="text-xs text-gray-500">L</span>
            <button disabled={savingWater} onClick={() => saveWater(water === '' ? null : Number(water))} className={btnGhost}>
              {savingWater ? <Loader2 className="w-3 h-3 animate-spin" /> : 'Set'}
            </button>
          </div>
        </div>
        <p className="text-[10px] text-gray-600 mt-2">Shared with your Habit Tracker.</p>
      </Card>

      {draft ? (
        <Card title={draft.id ? 'Edit food' : 'Add food'} icon={UtensilsCrossed}>
          <div className="flex flex-wrap gap-1.5 mb-3">
            {MEAL_TYPES.map((m) => (
              <button key={m.key} onClick={() => set('mealType', m.key)} className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-colors ${draft.mealType === m.key ? 'bg-brand-blue/15 border-brand-blue/40 text-brand-blue' : 'bg-white/[0.03] border-white/10 text-gray-400 hover:text-white'}`}>
                {m.label}
              </button>
            ))}
          </div>
          {!draft.id && <FoodPicker onPick={(f) => { setPicked(f); setServing(0); setCount('1'); }} />}
          {picked && (
            <div className="grid grid-cols-[1fr_5rem] gap-2 mt-2">
              <Field label="Serving">
                <select className={inputCls} value={serving} onChange={(e) => setServing(Number(e.target.value))}>
                  {picked.servings.map((s, i) => <option key={i} value={i}>{s.label}</option>)}
                </select>
              </Field>
              <Field label="How many"><input className={inputCls} inputMode="decimal" value={count} onChange={(e) => setCount(numOnly(e.target.value))} /></Field>
            </div>
          )}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mt-3">
            <div className="col-span-2"><Field label="Food"><input className={inputCls} placeholder="e.g. Paneer bhurji" value={draft.foodName} onChange={(e) => { set('foodName', e.target.value); setPicked(null); }} /></Field></div>
            <Field label="Quantity"><input className={inputCls} placeholder="1 bowl, 150 g" value={draft.quantity} onChange={(e) => set('quantity', e.target.value)} /></Field>
            <Field label="Calories (kcal)"><input className={inputCls} inputMode="numeric" value={draft.calories} onChange={(e) => set('calories', e.target.value.replace(/[^\d]/g, ''))} /></Field>
            <Field label="Protein (g)"><input className={inputCls} inputMode="decimal" value={draft.protein} onChange={(e) => set('protein', numOnly(e.target.value))} /></Field>
            <Field label="Carbs (g)"><input className={inputCls} inputMode="decimal" value={draft.carbs} onChange={(e) => set('carbs', numOnly(e.target.value))} /></Field>
            <Field label="Fats (g)"><input className={inputCls} inputMode="decimal" value={draft.fats} onChange={(e) => set('fats', numOnly(e.target.value))} /></Field>
          </div>
          <div className="flex gap-2 mt-4">
            <button onClick={() => { setDraft(null); setPicked(null); }} className={`${btnGhost} flex-1`}>Cancel</button>
            <button onClick={save} disabled={saving} className={`${btnPrimary} flex-[2]`}>{saving && <Loader2 className="w-4 h-4 animate-spin" />} Save</button>
          </div>
        </Card>
      ) : (
        <button onClick={() => open(blank(mealForNow()))} className={`${btnPrimary} w-full`}><Plus className="w-4 h-4" /> Add food</button>
      )}

      {MEAL_TYPES.map((m) => {
        const items = bundle.food.filter((f) => f.mealType === m.key);
        const mt = foodTotals(items);
        return (
          <Card key={m.key} title={m.label} action={
            <div className="flex items-center gap-2">
              {items.length > 0 && <span className="text-xs text-gray-500 tabular-nums">{mt.calories} kcal · {fmtNum(mt.protein)}g P</span>}
              <button onClick={() => open(blank(m.key))} className="p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-white/5" aria-label={`Add to ${m.label}`}><Plus className="w-3.5 h-3.5" /></button>
            </div>
          }>
            {items.length === 0 ? (
              <p className="text-xs text-gray-600 -mt-1">Nothing logged</p>
            ) : (
              <ul className="space-y-1.5 -mt-1">
                {items.map((f) => (
                  <li key={f.id} className="flex items-center gap-2 text-sm">
                    <div className="min-w-0 flex-1">
                      <p className="text-white truncate">{f.foodName}{f.quantity && <span className="text-gray-500 text-xs"> · {f.quantity}</span>}</p>
                      <p className="text-[11px] text-gray-500 tabular-nums">{f.calories ?? 0} kcal · P {fmtNum(f.protein, 1)} · C {fmtNum(f.carbs, 1)} · F {fmtNum(f.fats, 1)}</p>
                    </div>
                    <button onClick={() => open(toDraft(f))} className="p-1.5 text-gray-500 hover:text-white" aria-label="Edit"><Pencil className="w-3.5 h-3.5" /></button>
                    <button onClick={() => remove(f.id)} className="p-1.5 text-gray-500 hover:text-rose-400" aria-label="Delete"><Trash2 className="w-3.5 h-3.5" /></button>
                  </li>
                ))}
              </ul>
            )}
          </Card>
        );
      })}
    </div>
  );
}
