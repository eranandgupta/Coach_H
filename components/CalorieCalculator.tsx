'use client';

import { useMemo, useRef, useState } from 'react';
import { Search, Plus, X, Trash2, Flame } from 'lucide-react';
import { FOODS, searchFoods, type FoodItem } from '@/lib/foods';
import { caloriesForServing, sumMacros } from '@/lib/nutrition';

interface MealRow {
  id: number;
  food: FoodItem;
  servingLabel: string;
  qty: number;
}

const MAX_RESULTS = 40;

export default function CalorieCalculator() {
  const [query, setQuery] = useState('');
  const [open, setOpen] = useState(false);
  const [rows, setRows] = useState<MealRow[]>([]);
  const nextId = useRef(1);

  const results = useMemo(() => {
    const list = query.trim() ? searchFoods(query) : FOODS;
    return list.slice(0, MAX_RESULTS);
  }, [query]);

  const addFood = (food: FoodItem) => {
    setRows((prev) => [
      ...prev,
      { id: nextId.current++, food, servingLabel: food.servings[0].label, qty: 1 },
    ]);
    setQuery('');
    setOpen(false);
  };

  const updateRow = (id: number, patch: Partial<MealRow>) =>
    setRows((prev) => prev.map((r) => (r.id === id ? { ...r, ...patch } : r)));

  const removeRow = (id: number) => setRows((prev) => prev.filter((r) => r.id !== id));
  const clearAll = () => setRows([]);

  const rowMacros = rows.map((r) => caloriesForServing(r.food, r.servingLabel, r.qty));
  const total = sumMacros(rowMacros);

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
      {/* ── Left: search + meal rows ─────────────────────────────────── */}
      <div>
        {/* Search combobox */}
        <div className="relative">
          <div className="flex items-center gap-2 rounded-xl border border-white/10 bg-brand-navy-light px-4 py-3 focus-within:border-brand-blue/60 transition-colors">
            <Search className="h-5 w-5 shrink-0 text-gray-400" />
            <input
              type="text"
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setOpen(true);
              }}
              onFocus={() => setOpen(true)}
              onBlur={() => setTimeout(() => setOpen(false), 150)}
              placeholder="Search a food… e.g. dal, roti, rice, paneer"
              className="w-full bg-transparent text-white placeholder:text-gray-500 outline-none"
              aria-label="Search food"
            />
          </div>

          {open && (
            <div className="absolute z-20 mt-2 w-full max-h-80 overflow-y-auto rounded-xl border border-white/10 bg-brand-navy-light shadow-2xl shadow-black/50">
              {results.length === 0 ? (
                <p className="px-4 py-6 text-center text-sm text-gray-400">
                  No food found. Try another name (e.g. &ldquo;chana&rdquo;, &ldquo;curd&rdquo;).
                </p>
              ) : (
                results.map((food) => (
                  <button
                    key={food.slug}
                    type="button"
                    // onMouseDown (not onClick) so it fires before the input blur closes the list.
                    onMouseDown={(e) => {
                      e.preventDefault();
                      addFood(food);
                    }}
                    className="flex w-full items-center justify-between gap-3 px-4 py-2.5 text-left hover:bg-white/5 transition-colors border-b border-white/5 last:border-0"
                  >
                    <span>
                      <span className="block text-sm font-medium text-white">{food.name}</span>
                      <span className="block text-xs text-gray-500">{food.category}</span>
                    </span>
                    <span className="flex items-center gap-2 shrink-0">
                      <span className="text-xs text-gray-400">{food.per100g.kcal} kcal/100g</span>
                      <Plus className="h-4 w-4 text-brand-blue" />
                    </span>
                  </button>
                ))
              )}
            </div>
          )}
        </div>

        {/* Meal rows */}
        <div className="mt-5">
          {rows.length === 0 ? (
            <div className="rounded-xl border border-dashed border-white/10 bg-white/[0.02] px-6 py-10 text-center">
              <Flame className="mx-auto mb-2 h-6 w-6 text-gray-500" />
              <p className="text-sm text-gray-400">
                Search and add a food to see its calories. Add more items to build a full meal.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-semibold text-gray-300">Your meal ({rows.length})</h3>
                <button
                  type="button"
                  onClick={clearAll}
                  className="inline-flex items-center gap-1 text-xs text-gray-400 hover:text-red-400 transition-colors"
                >
                  <Trash2 className="h-3.5 w-3.5" /> Clear all
                </button>
              </div>

              {rows.map((row, i) => {
                const m = rowMacros[i];
                return (
                  <div
                    key={row.id}
                    className="rounded-xl border border-white/10 bg-brand-navy-light p-3 sm:p-4"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <p className="truncate text-sm font-semibold text-white">{row.food.name}</p>
                        <p className="text-xs text-gray-500">{row.food.category}</p>
                      </div>
                      <button
                        type="button"
                        onClick={() => removeRow(row.id)}
                        aria-label={`Remove ${row.food.name}`}
                        className="shrink-0 rounded-lg p-1.5 text-gray-400 hover:bg-red-500/10 hover:text-red-400 transition-colors"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>

                    <div className="mt-3 flex flex-wrap items-center gap-2">
                      <input
                        type="number"
                        min={0}
                        step="0.5"
                        value={row.qty}
                        onChange={(e) =>
                          updateRow(row.id, { qty: Math.max(0, Number(e.target.value)) })
                        }
                        className="w-20 rounded-lg border border-white/10 bg-brand-navy px-3 py-2 text-sm text-white outline-none focus:border-brand-blue/60"
                        aria-label="Quantity"
                      />
                      <select
                        value={row.servingLabel}
                        onChange={(e) => updateRow(row.id, { servingLabel: e.target.value })}
                        className="flex-1 min-w-[140px] rounded-lg border border-white/10 bg-brand-navy px-3 py-2 text-sm text-white outline-none focus:border-brand-blue/60"
                        aria-label="Serving size"
                      >
                        {row.food.servings.map((s) => (
                          <option key={s.label} value={s.label} className="bg-brand-navy">
                            {s.label}
                          </option>
                        ))}
                      </select>

                      <div className="ml-auto text-right">
                        <span className="text-lg font-bold text-brand-gold">{m.kcal}</span>
                        <span className="ml-1 text-xs text-gray-400">kcal</span>
                      </div>
                    </div>

                    <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs text-gray-400">
                      <span>P: <span className="text-gray-200">{m.protein} g</span></span>
                      <span>C: <span className="text-gray-200">{m.carbs} g</span></span>
                      <span>F: <span className="text-gray-200">{m.fat} g</span></span>
                      <span>Fibre: <span className="text-gray-200">{m.fiber} g</span></span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* ── Right: sticky total ──────────────────────────────────────── */}
      <div>
        <div className="lg:sticky lg:top-24 rounded-2xl border border-brand-blue/20 bg-gradient-to-b from-brand-blue/10 to-brand-navy-light p-5">
          <p className="text-sm font-medium text-gray-300">Total calories</p>
          <div className="mt-1 flex items-baseline gap-2">
            <span className="text-4xl font-extrabold bg-gradient-to-r from-brand-blue to-brand-gold bg-clip-text text-transparent">
              {total.kcal}
            </span>
            <span className="text-sm text-gray-400">kcal</span>
          </div>

          <div className="mt-4 grid grid-cols-3 gap-2 text-center">
            <div className="rounded-lg bg-white/5 py-2">
              <p className="text-base font-bold text-white">{total.protein}</p>
              <p className="text-[11px] text-gray-400">Protein (g)</p>
            </div>
            <div className="rounded-lg bg-white/5 py-2">
              <p className="text-base font-bold text-white">{total.carbs}</p>
              <p className="text-[11px] text-gray-400">Carbs (g)</p>
            </div>
            <div className="rounded-lg bg-white/5 py-2">
              <p className="text-base font-bold text-white">{total.fat}</p>
              <p className="text-[11px] text-gray-400">Fat (g)</p>
            </div>
            <div className="rounded-lg bg-white/5 py-2">
              <p className="text-base font-bold text-white">{total.fiber}</p>
              <p className="text-[11px] text-gray-400">Fibre (g)</p>
            </div>
            <div className="rounded-lg bg-white/5 py-2">
              <p className="text-base font-bold text-white">{total.sugar}</p>
              <p className="text-[11px] text-gray-400">Sugar (g)</p>
            </div>
          </div>

          {/* Micronutrients */}
          <div className="mt-5 border-t border-white/10 pt-4">
            <p className="text-xs font-semibold text-gray-300">Key micronutrients</p>
            <dl className="mt-2 space-y-1.5 text-xs">
              <div className="flex items-center justify-between">
                <dt className="text-gray-400">Sodium</dt>
                <dd className="font-medium text-gray-200">{total.sodium} mg</dd>
              </div>
              <div className="flex items-center justify-between">
                <dt className="text-gray-400">Calcium</dt>
                <dd className="font-medium text-gray-200">{total.calcium} mg</dd>
              </div>
              <div className="flex items-center justify-between">
                <dt className="text-gray-400">Iron</dt>
                <dd className="font-medium text-gray-200">{total.iron} mg</dd>
              </div>
              <div className="flex items-center justify-between">
                <dt className="text-gray-400">Potassium</dt>
                <dd className="font-medium text-gray-200">{total.potassium} mg</dd>
              </div>
              <div className="flex items-center justify-between">
                <dt className="text-gray-400">Vitamin C</dt>
                <dd className="font-medium text-gray-200">{total.vitaminC} mg</dd>
              </div>
            </dl>
          </div>

          <p className="mt-4 text-[11px] leading-relaxed text-gray-500">
            Estimates for everyday use — home recipes vary with oil/ghee and portion size.
          </p>
        </div>
      </div>
    </div>
  );
}
