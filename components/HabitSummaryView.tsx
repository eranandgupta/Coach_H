'use client';

import { useState, useEffect, useCallback } from 'react';
import { Dumbbell, Droplet, Activity, Footprints, Moon, ChevronLeft, ChevronRight, Loader2, Check, ClipboardList } from 'lucide-react';

interface HabitEntry {
  date: string;
  protein: number | null;
  water: number | null;
  workout: boolean;
  steps: number | null;
  sleep: number | null;
  notes: string | null;
}

const MONTH_NAMES = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
const pad = (n: number) => String(n).padStart(2, '0');
const monthStr = (d: Date) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}`;

const COLUMNS = [
  { label: 'Protein', Icon: Dumbbell },
  { label: 'Water', Icon: Droplet },
  { label: 'Workout', Icon: Activity },
  { label: 'Steps', Icon: Footprints },
  { label: 'Sleep', Icon: Moon },
] as const;

const avg = (nums: number[]) => (nums.length ? nums.reduce((a, b) => a + b, 0) / nums.length : null);
const fmt = (n: number | null, digits = 0) => (n == null ? '—' : n.toFixed(digits));

// Read-only monthly habit view for the coach/admin client card.
export default function HabitSummaryView({ userId }: { userId: number }) {
  const [month, setMonth] = useState<string>(monthStr(new Date()));
  const [entries, setEntries] = useState<HabitEntry[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchEntries = useCallback(async (m: string) => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`/api/habits?userId=${userId}&month=${m}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const data = await res.json();
        setEntries(data.entries || []);
      } else {
        setEntries([]);
      }
    } catch {
      setEntries([]);
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => { fetchEntries(month); }, [month, fetchEntries]);

  const changeMonth = (delta: number) => {
    const [y, m] = month.split('-').map(Number);
    setMonth(monthStr(new Date(y, m - 1 + delta, 1)));
  };

  const [curY, curM] = month.split('-').map(Number);
  const daysInMonth = new Date(curY, curM, 0).getDate();
  const isCurrentMonth = month === monthStr(new Date());
  const entryFor = (key: string) => entries.find((e) => e.date.slice(0, 10) === key);

  const logged = entries.filter((e) => e.protein != null || e.water != null || e.workout || e.steps != null || e.sleep != null || (e.notes && e.notes.length));
  const stats = {
    daysLogged: logged.length,
    avgProtein: avg(entries.filter((e) => e.protein != null).map((e) => Number(e.protein))),
    avgWater: avg(entries.filter((e) => e.water != null).map((e) => Number(e.water))),
    workoutPct: logged.length ? (entries.filter((e) => e.workout).length / logged.length) * 100 : null,
    avgSteps: avg(entries.filter((e) => e.steps != null).map((e) => Number(e.steps))),
    avgSleep: avg(entries.filter((e) => e.sleep != null).map((e) => Number(e.sleep))),
  };

  return (
    <div>
      {/* Month selector */}
      <div className="flex items-center justify-between mb-3">
        <button onClick={() => changeMonth(-1)} className="p-1.5 rounded-lg hover:bg-white/5 text-gray-400"><ChevronLeft className="w-4 h-4" /></button>
        <p className="text-white font-semibold text-sm">{MONTH_NAMES[curM - 1]} {curY}</p>
        <button onClick={() => changeMonth(1)} disabled={isCurrentMonth} className="p-1.5 rounded-lg hover:bg-white/5 text-gray-400 disabled:opacity-30 disabled:cursor-not-allowed"><ChevronRight className="w-4 h-4" /></button>
      </div>

      {loading ? (
        <div className="flex justify-center py-10"><Loader2 className="w-7 h-7 text-brand-blue animate-spin" /></div>
      ) : stats.daysLogged === 0 ? (
        <div className="text-center py-8 bg-white/[0.02] rounded-lg border border-white/5">
          <ClipboardList className="w-10 h-10 text-gray-600 mx-auto mb-2" />
          <p className="text-gray-500 text-sm">No habits logged this month</p>
        </div>
      ) : (
        <>
          {/* Summary tiles */}
          <div className="grid grid-cols-3 gap-2 mb-4">
            <Stat label="Days Logged" value={`${stats.daysLogged}`} />
            <Stat label="Avg Protein" value={stats.avgProtein == null ? '—' : `${fmt(stats.avgProtein)}g`} />
            <Stat label="Avg Water" value={stats.avgWater == null ? '—' : `${fmt(stats.avgWater, 1)}L`} />
            <Stat label="Workout" value={stats.workoutPct == null ? '—' : `${fmt(stats.workoutPct)}%`} />
            <Stat label="Avg Steps" value={stats.avgSteps == null ? '—' : fmt(stats.avgSteps)} />
            <Stat label="Avg Sleep" value={stats.avgSleep == null ? '—' : `${fmt(stats.avgSleep, 1)}h`} />
          </div>

          {/* Read-only grid */}
          <div className="overflow-x-auto rounded-lg border border-white/10">
            <table className="w-full text-xs min-w-[520px]">
              <thead>
                <tr className="bg-[#101a33] text-white">
                  <th className="py-2 px-2 text-left font-bold w-10">Day</th>
                  {COLUMNS.map(({ label, Icon }) => (
                    <th key={label} className="py-2 px-2 font-bold text-center">
                      <div className="flex flex-col items-center gap-0.5"><Icon className="w-3 h-3 text-brand-blue" /><span className="text-[10px]">{label}</span></div>
                    </th>
                  ))}
                  <th className="py-2 px-2 font-bold text-center text-[10px]">Notes</th>
                </tr>
              </thead>
              <tbody>
                {Array.from({ length: daysInMonth }, (_, i) => i + 1).map((day) => {
                  const key = `${curY}-${pad(curM)}-${pad(day)}`;
                  const e = entryFor(key);
                  return (
                    <tr key={day} className="border-t border-white/5">
                      <td className="py-1.5 px-2 font-semibold text-gray-400">{day}</td>
                      <td className="py-1.5 px-2 text-center text-white">{e?.protein ?? '—'}</td>
                      <td className="py-1.5 px-2 text-center text-white">{e?.water ?? '—'}</td>
                      <td className="py-1.5 px-2 text-center">{e?.workout ? <Check className="w-3.5 h-3.5 text-green-400 mx-auto" /> : <span className="text-gray-600">—</span>}</td>
                      <td className="py-1.5 px-2 text-center text-white">{e?.steps ?? '—'}</td>
                      <td className="py-1.5 px-2 text-center text-white">{e?.sleep ?? '—'}</td>
                      <td className="py-1.5 px-2 text-center text-gray-400 max-w-[100px] truncate">{e?.notes || '—'}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-white/[0.03] border border-white/[0.06] rounded-lg p-2.5 text-center">
      <p className="text-white font-bold text-base leading-tight">{value}</p>
      <p className="text-gray-500 text-[10px] mt-0.5">{label}</p>
    </div>
  );
}
