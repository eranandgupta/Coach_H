'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X, Dumbbell, Droplet, Activity, Footprints, Moon, Pencil,
  Check, ChevronLeft, ChevronRight, Flame, Loader2, CalendarDays,
} from 'lucide-react';

interface HabitEntry {
  id?: number;
  date: string; // ISO
  protein: number | null;
  water: number | null;
  workout: boolean;
  steps: number | null;
  sleep: number | null;
  notes: string | null;
}

interface HabitFormState {
  protein: string;
  water: string;
  workout: boolean;
  steps: string;
  sleep: string;
  notes: string;
}

interface HabitTrackerProps {
  isOpen: boolean;
  onClose: () => void;
}

const EMPTY_FORM: HabitFormState = { protein: '', water: '', workout: false, steps: '', sleep: '', notes: '' };

const MONTH_NAMES = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

// Local calendar helpers (India is UTC+5:30, so a UTC-midnight date maps to the same day)
const pad = (n: number) => String(n).padStart(2, '0');
const dateStr = (d: Date) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
const monthStr = (d: Date) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}`;

const COLUMNS = [
  { key: 'protein', label: 'Protein', unit: 'grams', Icon: Dumbbell },
  { key: 'water', label: 'Water', unit: 'litres', Icon: Droplet },
  { key: 'workout', label: 'Workout', unit: 'yes / no', Icon: Activity },
  { key: 'steps', label: 'Steps', unit: 'count', Icon: Footprints },
  { key: 'sleep', label: 'Sleep', unit: 'hours', Icon: Moon },
] as const;

function entryToForm(e?: HabitEntry | null): HabitFormState {
  if (!e) return { ...EMPTY_FORM };
  return {
    protein: e.protein != null ? String(e.protein) : '',
    water: e.water != null ? String(e.water) : '',
    workout: !!e.workout,
    steps: e.steps != null ? String(e.steps) : '',
    sleep: e.sleep != null ? String(e.sleep) : '',
    notes: e.notes || '',
  };
}

export default function HabitTracker({ isOpen, onClose }: HabitTrackerProps) {
  const today = new Date();
  const todayKey = dateStr(today);

  const [tab, setTab] = useState<'today' | 'month'>('today');
  const [month, setMonth] = useState<string>(monthStr(today)); // 'YYYY-MM'
  const [entries, setEntries] = useState<HabitEntry[]>([]);
  const [loading, setLoading] = useState(false);

  const [todayForm, setTodayForm] = useState<HabitFormState>({ ...EMPTY_FORM });
  const [savingToday, setSavingToday] = useState(false);
  const [savedFlash, setSavedFlash] = useState(false);

  // Day editor overlay (from the Month grid)
  const [editingDay, setEditingDay] = useState<string | null>(null);
  const [dayForm, setDayForm] = useState<HabitFormState>({ ...EMPTY_FORM });
  const [savingDay, setSavingDay] = useState(false);

  const entryFor = useCallback(
    (key: string) => entries.find((e) => e.date.slice(0, 10) === key),
    [entries]
  );

  const fetchEntries = useCallback(async (m: string) => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`/api/habits?month=${m}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const data = await res.json();
        setEntries(data.entries || []);
      }
    } catch (err) {
      console.error('Failed to load habits:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (isOpen) fetchEntries(month);
  }, [isOpen, month, fetchEntries]);

  // Keep the Today form in sync with today's saved entry
  useEffect(() => {
    if (month === monthStr(today)) {
      setTodayForm(entryToForm(entryFor(todayKey)));
    }
  }, [entries]); // eslint-disable-line react-hooks/exhaustive-deps

  const saveDay = async (key: string, form: HabitFormState) => {
    const token = localStorage.getItem('token');
    const res = await fetch('/api/habits', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({
        date: key,
        protein: form.protein,
        water: form.water,
        workout: form.workout,
        steps: form.steps,
        sleep: form.sleep,
        notes: form.notes,
      }),
    });
    if (!res.ok) return false;
    await fetchEntries(month);
    return true;
  };

  const handleSaveToday = async () => {
    setSavingToday(true);
    const ok = await saveDay(todayKey, todayForm);
    setSavingToday(false);
    if (ok) {
      setSavedFlash(true);
      setTimeout(() => setSavedFlash(false), 1800);
    }
  };

  const openDayEditor = (key: string) => {
    setEditingDay(key);
    setDayForm(entryToForm(entryFor(key)));
  };

  const handleSaveDay = async () => {
    if (!editingDay) return;
    setSavingDay(true);
    const ok = await saveDay(editingDay, dayForm);
    setSavingDay(false);
    if (ok) setEditingDay(null);
  };

  const changeMonth = (delta: number) => {
    const [y, m] = month.split('-').map(Number);
    const d = new Date(y, m - 1 + delta, 1);
    setMonth(monthStr(d));
  };

  // --- derived ---
  const [curY, curM] = month.split('-').map(Number);
  const daysInMonth = new Date(curY, curM, 0).getDate();
  const isCurrentMonth = month === monthStr(today);

  const loggedDays = entries.filter(
    (e) => e.protein != null || e.water != null || e.workout || e.steps != null || e.sleep != null || (e.notes && e.notes.length)
  ).length;

  // Simple streak: consecutive days ending today that have an entry
  const streak = (() => {
    let s = 0;
    const d = new Date();
    for (let i = 0; i < 366; i++) {
      const key = dateStr(d);
      const e = entries.find((x) => x.date.slice(0, 10) === key);
      const filled = e && (e.protein != null || e.water != null || e.workout || e.steps != null || e.sleep != null);
      if (filled) s++;
      else break;
      d.setDate(d.getDate() - 1);
    }
    return s;
  })();

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-2 sm:p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: 16 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96, y: 16 }}
          transition={{ type: 'spring', damping: 26, stiffness: 240 }}
          className="bg-[#0a0f1f] border border-white/10 rounded-2xl w-full max-w-3xl max-h-[92vh] flex flex-col overflow-hidden shadow-2xl"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Branded header */}
          <div className="relative px-5 py-4 border-b border-white/10" style={{ background: 'linear-gradient(135deg,#0b1224 0%,#101a33 60%,#0b1224 100%)' }}>
            <button onClick={onClose} className="absolute top-4 right-4 p-2 rounded-xl hover:bg-white/10 transition-colors">
              <X className="w-5 h-5 text-gray-300" />
            </button>
            <h2 className="text-2xl font-extrabold tracking-tight text-white">
              HABIT <span className="text-brand-blue">TRACKER</span>
            </h2>
            <p className="text-[11px] uppercase tracking-[0.2em] text-gray-400 mt-0.5">Track today, transform tomorrow</p>
          </div>

          {/* Tabs */}
          <div className="flex gap-2 px-5 pt-4">
            <button
              onClick={() => setTab('today')}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
                tab === 'today' ? 'bg-brand-blue/20 text-brand-blue border border-brand-blue/30' : 'bg-white/[0.03] text-gray-400 border border-white/[0.06] hover:bg-white/[0.05]'
              }`}
            >
              <Check className="w-3.5 h-3.5" /> Today
            </button>
            <button
              onClick={() => setTab('month')}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
                tab === 'month' ? 'bg-brand-blue/20 text-brand-blue border border-brand-blue/30' : 'bg-white/[0.03] text-gray-400 border border-white/[0.06] hover:bg-white/[0.05]'
              }`}
            >
              <CalendarDays className="w-3.5 h-3.5" /> Month
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-5">
            {/* ---------------- TODAY ---------------- */}
            {tab === 'today' && (
              <div>
                <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
                  <div>
                    <p className="text-white font-bold text-lg">Today</p>
                    <p className="text-gray-500 text-xs">
                      {today.toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long' })}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    {streak > 0 && (
                      <span className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full bg-orange-500/10 border border-orange-500/30 text-orange-400 text-xs font-semibold">
                        <Flame className="w-3.5 h-3.5" /> {streak}-day streak
                      </span>
                    )}
                    <span className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-gray-300 text-xs font-medium">
                      {loggedDays} logged
                    </span>
                  </div>
                </div>

                <HabitFields values={todayForm} onChange={setTodayForm} />

                <button
                  onClick={handleSaveToday}
                  disabled={savingToday}
                  className="mt-5 w-full py-3 rounded-xl font-bold text-sm text-white bg-gradient-to-r from-brand-blue to-blue-600 hover:shadow-lg hover:shadow-brand-blue/25 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {savingToday ? <Loader2 className="w-4 h-4 animate-spin" /> : savedFlash ? <Check className="w-4 h-4" /> : null}
                  {savingToday ? 'Saving...' : savedFlash ? 'Saved!' : "Save Today's Habits"}
                </button>
              </div>
            )}

            {/* ---------------- MONTH ---------------- */}
            {tab === 'month' && (
              <div>
                {/* Month selector */}
                <div className="flex items-center justify-between mb-4">
                  <button onClick={() => changeMonth(-1)} className="p-2 rounded-lg hover:bg-white/5 text-gray-400">
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <p className="text-white font-bold">{MONTH_NAMES[curM - 1]} {curY}</p>
                  <button
                    onClick={() => changeMonth(1)}
                    disabled={isCurrentMonth}
                    className="p-2 rounded-lg hover:bg-white/5 text-gray-400 disabled:opacity-30 disabled:cursor-not-allowed"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </div>

                {loading ? (
                  <div className="flex justify-center py-12"><Loader2 className="w-8 h-8 text-brand-blue animate-spin" /></div>
                ) : (
                  <div className="overflow-x-auto rounded-xl border border-white/10">
                    <table className="w-full text-sm min-w-[560px]">
                      <thead>
                        <tr className="bg-[#101a33] text-white">
                          <th className="py-2.5 px-2 text-left font-bold w-12">Day</th>
                          {COLUMNS.map(({ label, unit, Icon }) => (
                            <th key={label} className="py-2 px-2 font-bold text-center">
                              <div className="flex flex-col items-center gap-0.5">
                                <Icon className="w-3.5 h-3.5 text-brand-blue" />
                                <span className="text-[11px]">{label}</span>
                                <span className="text-[9px] text-gray-400 font-normal uppercase">{unit}</span>
                              </div>
                            </th>
                          ))}
                          <th className="py-2 px-2 font-bold text-center">
                            <div className="flex flex-col items-center gap-0.5">
                              <Pencil className="w-3.5 h-3.5 text-brand-blue" />
                              <span className="text-[11px]">Notes</span>
                            </div>
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {Array.from({ length: daysInMonth }, (_, i) => i + 1).map((day) => {
                          const key = `${curY}-${pad(curM)}-${pad(day)}`;
                          const e = entryFor(key);
                          const isToday = key === todayKey;
                          return (
                            <tr
                              key={day}
                              onClick={() => openDayEditor(key)}
                              className={`cursor-pointer border-t border-white/5 hover:bg-white/[0.04] transition-colors ${isToday ? 'bg-brand-blue/10' : ''}`}
                            >
                              <td className={`py-2 px-2 font-semibold ${isToday ? 'text-brand-blue' : 'text-gray-400'}`}>{day}</td>
                              <td className="py-2 px-2 text-center text-white">{e?.protein ?? '—'}</td>
                              <td className="py-2 px-2 text-center text-white">{e?.water ?? '—'}</td>
                              <td className="py-2 px-2 text-center">
                                {e?.workout ? <Check className="w-4 h-4 text-green-400 mx-auto" /> : <span className="text-gray-600">—</span>}
                              </td>
                              <td className="py-2 px-2 text-center text-white">{e?.steps ?? '—'}</td>
                              <td className="py-2 px-2 text-center text-white">{e?.sleep ?? '—'}</td>
                              <td className="py-2 px-2 text-center text-gray-400 max-w-[120px] truncate">{e?.notes || '—'}</td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                )}
                <p className="text-center text-gray-500 text-xs mt-3">Tap any day to fill or edit it</p>
              </div>
            )}
          </div>

          {/* Footer tagline */}
          <div className="px-5 py-3 border-t border-white/10 text-center">
            <p className="text-[11px] font-bold uppercase tracking-wide text-gray-400">
              Small daily habits <span className="text-brand-blue">create big transformations</span>
            </p>
          </div>
        </motion.div>

        {/* Day editor overlay */}
        <AnimatePresence>
          {editingDay && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/70 z-[60] flex items-end sm:items-center justify-center p-0 sm:p-4"
              onClick={() => setEditingDay(null)}
            >
              <motion.div
                initial={{ y: 40, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: 40, opacity: 0 }}
                className="bg-[#0a0f1f] border border-white/10 rounded-t-2xl sm:rounded-2xl w-full max-w-md p-5"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex items-center justify-between mb-4">
                  <p className="text-white font-bold">
                    {new Date(`${editingDay}T00:00:00`).toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'long' })}
                  </p>
                  <button onClick={() => setEditingDay(null)} className="p-1.5 rounded-lg hover:bg-white/10"><X className="w-4 h-4 text-gray-400" /></button>
                </div>
                <HabitFields values={dayForm} onChange={setDayForm} />
                <button
                  onClick={handleSaveDay}
                  disabled={savingDay}
                  className="mt-5 w-full py-3 rounded-xl font-bold text-sm text-white bg-gradient-to-r from-brand-blue to-blue-600 hover:shadow-lg hover:shadow-brand-blue/25 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {savingDay ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
                  {savingDay ? 'Saving...' : 'Save'}
                </button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </AnimatePresence>
  );
}

/* ---- Reusable 6-field habit input block ---- */
function HabitFields({ values, onChange }: { values: HabitFormState; onChange: (v: HabitFormState) => void }) {
  const set = (patch: Partial<HabitFormState>) => onChange({ ...values, ...patch });
  const numInput = 'w-full bg-white/[0.04] border border-white/10 rounded-xl px-3 py-2.5 text-white text-sm placeholder-gray-600 focus:outline-none focus:border-brand-blue/50';

  return (
    <div className="grid grid-cols-2 gap-3">
      <Field icon={<Dumbbell className="w-4 h-4 text-brand-blue" />} label="Protein" hint="grams">
        <input type="number" inputMode="numeric" min={0} value={values.protein} onChange={(e) => set({ protein: e.target.value })} placeholder="e.g. 120" className={numInput} />
      </Field>
      <Field icon={<Droplet className="w-4 h-4 text-brand-blue" />} label="Water" hint="litres">
        <input type="number" inputMode="decimal" min={0} step={0.5} value={values.water} onChange={(e) => set({ water: e.target.value })} placeholder="e.g. 3" className={numInput} />
      </Field>
      <Field icon={<Activity className="w-4 h-4 text-brand-blue" />} label="Workout" hint="yes / no">
        <div className="flex gap-2">
          <button type="button" onClick={() => set({ workout: true })} className={`flex-1 py-2.5 rounded-xl text-sm font-semibold border transition-all ${values.workout ? 'bg-green-500/20 text-green-400 border-green-500/40' : 'bg-white/[0.03] text-gray-400 border-white/10'}`}>Yes</button>
          <button type="button" onClick={() => set({ workout: false })} className={`flex-1 py-2.5 rounded-xl text-sm font-semibold border transition-all ${!values.workout ? 'bg-white/10 text-white border-white/20' : 'bg-white/[0.03] text-gray-400 border-white/10'}`}>No</button>
        </div>
      </Field>
      <Field icon={<Footprints className="w-4 h-4 text-brand-blue" />} label="Steps" hint="count">
        <input type="number" inputMode="numeric" min={0} value={values.steps} onChange={(e) => set({ steps: e.target.value })} placeholder="e.g. 8000" className={numInput} />
      </Field>
      <Field icon={<Moon className="w-4 h-4 text-brand-blue" />} label="Sleep" hint="hours">
        <input type="number" inputMode="decimal" min={0} step={0.5} value={values.sleep} onChange={(e) => set({ sleep: e.target.value })} placeholder="e.g. 7.5" className={numInput} />
      </Field>
      <Field icon={<Pencil className="w-4 h-4 text-brand-blue" />} label="Notes" hint="optional">
        <input type="text" value={values.notes} onChange={(e) => set({ notes: e.target.value })} placeholder="How did the day go?" className={numInput} />
      </Field>
    </div>
  );
}

function Field({ icon, label, hint, children }: { icon: React.ReactNode; label: string; hint: string; children: React.ReactNode }) {
  return (
    <div>
      <div className="flex items-center gap-1.5 mb-1.5">
        {icon}
        <span className="text-xs font-semibold text-white">{label}</span>
        <span className="text-[10px] text-gray-500 uppercase">{hint}</span>
      </div>
      {children}
    </div>
  );
}
