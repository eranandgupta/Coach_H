'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { BookOpen, ClipboardList, Dumbbell, Scale, Utensils, X } from 'lucide-react';
import { checkInsToShow, dueCheckIns, type CheckIn, type CheckInAction, type RemindersData, type ShownLog } from '@/lib/checkins';

/**
 * Check-in popup on the client dashboard. Asks only for what is actually due today:
 * habits and diary workout/food daily, the weigh-in weekly, the Transformation Logbook at the
 * start and end of each 30-day cycle (rules in lib/checkins.ts). Each prompt has a cooldown
 * stored per member in localStorage, so closing it means "not again today" (or this week).
 */
interface Props {
  userId: number;
  /** False while anything else is on screen (a tracker, the tour, another modal) or the plan is inactive. */
  enabled: boolean;
  /** localStorage key the first-visit tour sets; the popup never competes with the tour. */
  tourSeenKey: string;
  /** Bump after a tracker closes so logged items drop off the list. */
  refreshKey: number;
  onAction: (action: CheckInAction) => void;
}

const pad = (n: number) => String(n).padStart(2, '0');
const localToday = () => { const d = new Date(); return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`; };

const ICONS: Record<string, typeof Dumbbell> = {
  habits: ClipboardList,
  logbook: BookOpen,
  workout: Dumbbell,
  diet: Utensils,
  body: Scale,
};
const iconFor = (a: CheckInAction) => ICONS[a.kind === 'diary' ? a.tab : a.kind] ?? ClipboardList;

function readShown(key: string): ShownLog {
  try { return JSON.parse(localStorage.getItem(key) || '{}') || {}; } catch { return {}; }
}

export default function CheckInPrompt({ userId, enabled, tourSeenKey, refreshKey, onAction }: Props) {
  const storeKey = `ch_checkins_shown_v1_${userId}`;
  const [due, setDue] = useState<CheckIn[] | null>(null);
  // The prompts picked for this visit (past their cooldown when the dashboard loaded).
  const [session, setSession] = useState<string[] | null>(null);
  const [acted, setActed] = useState<Set<string>>(new Set());
  const [dismissed, setDismissed] = useState(false);
  const [visible, setVisible] = useState(false);
  const markedRef = useRef(false);

  const load = useCallback(async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return;
      const res = await fetch(`/api/progress/reminders?date=${localToday()}`, { headers: { Authorization: `Bearer ${token}` } });
      if (!res.ok) return;
      const data: RemindersData = await res.json();
      setDue(dueCheckIns(data, new Date().getHours()));
    } catch {
      /* offline or API error: no popup this time */
    }
  }, []);

  useEffect(() => { load(); }, [load, refreshKey]);

  // Pick this visit's prompts once, from what is due and past its cooldown.
  useEffect(() => {
    if (!due || session) return;
    let tourSeen = true;
    try { tourSeen = !!localStorage.getItem(tourSeenKey); } catch {}
    if (!tourSeen) { setSession([]); return; } // first visit belongs to the tour
    setSession(checkInsToShow(due, readShown(storeKey), localToday()).map((c) => c.id));
  }, [due, session, storeKey, tourSeenKey]);

  // Still due (logged items drop off after a refresh), picked this visit, not yet acted on.
  const items = useMemo(
    () => (due && session ? due.filter((c) => session.includes(c.id) && !acted.has(c.id)) : []),
    [due, session, acted]
  );
  const canShow = enabled && !dismissed && items.length > 0;

  // Small delay so the popup never flashes over a page that's still settling or a modal closing.
  useEffect(() => {
    if (!canShow) { setVisible(false); return; }
    const t = setTimeout(() => setVisible(true), 1200);
    return () => clearTimeout(t);
  }, [canShow]);

  // Record when prompts were shown, the first time they appear on screen.
  useEffect(() => {
    if (!visible || markedRef.current) return;
    markedRef.current = true;
    const shown = readShown(storeKey);
    const today = localToday();
    items.forEach((c) => { shown[c.id] = today; });
    try { localStorage.setItem(storeKey, JSON.stringify(shown)); } catch {}
  }, [visible, items, storeKey]);

  useEffect(() => {
    if (!visible) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setDismissed(true); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [visible]);

  if (!visible || !canShow) return null;

  const act = (c: CheckIn) => {
    setActed((s) => new Set(s).add(c.id));
    onAction(c.action);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/50 p-0 sm:p-4" onClick={() => setDismissed(true)}>
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="checkin-title"
        onClick={(e) => e.stopPropagation()}
        className="w-full sm:max-w-md max-h-[85vh] overflow-y-auto rounded-t-2xl sm:rounded-2xl border border-white/[0.08] bg-brand-navy-light p-5 shadow-2xl"
      >
        <div className="flex items-start justify-between gap-3">
          <div>
            <h2 id="checkin-title" className="text-lg font-bold text-white">Your check-ins</h2>
            <p className="mt-0.5 text-sm text-gray-400">
              {items.length === 1 ? '1 thing to log' : `${items.length} things to log`}. Your coach sees what you log.
            </p>
          </div>
          <button onClick={() => setDismissed(true)} aria-label="Close" className="rounded-lg p-1.5 text-gray-400 hover:bg-white/5 hover:text-white">
            <X size={18} />
          </button>
        </div>

        <ul className="mt-4 space-y-3">
          {items.map((c, i) => {
            const Icon = iconFor(c.action);
            return (
              <li key={c.id} className="rounded-xl border border-white/[0.08] bg-brand-navy/60 p-4">
                <div className="flex items-start gap-3">
                  <span className="shrink-0 w-9 h-9 rounded-xl bg-brand-blue/10 text-brand-blue flex items-center justify-center">
                    <Icon size={18} />
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="text-sm font-semibold text-white">{c.title}</h3>
                      <span className="rounded-full border border-white/10 px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide text-gray-400">{c.cadence}</span>
                    </div>
                    <p className="mt-1 text-xs leading-relaxed text-gray-400">{c.body}</p>
                    <button
                      onClick={() => act(c)}
                      className={
                        i === 0
                          ? 'mt-3 rounded-lg bg-brand-blue px-4 py-2 text-xs font-semibold text-white hover:bg-brand-blue/90'
                          : 'mt-3 rounded-lg border border-white/15 px-4 py-2 text-xs font-semibold text-white hover:bg-white/5'
                      }
                    >
                      {c.cta}
                    </button>
                  </div>
                </div>
              </li>
            );
          })}
        </ul>

        <button onClick={() => setDismissed(true)} className="mt-4 w-full rounded-lg py-2 text-sm font-medium text-gray-400 hover:text-white">
          Remind me later
        </button>
      </div>
    </div>
  );
}
