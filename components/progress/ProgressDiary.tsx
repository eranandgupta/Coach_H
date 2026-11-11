'use client';

import { useCallback, useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, LayoutDashboard, Dumbbell, Activity, UtensilsCrossed, Scale, BarChart3, MessageSquareQuote } from 'lucide-react';
import { progressApi, type DayBundle } from './api';
import { DayNav, Empty, Spinner } from './ui';
import OverviewTab, { useFeedback, type DiaryTab } from './OverviewTab';
import WorkoutTab from './WorkoutTab';
import CardioTab from './CardioTab';
import DietTab from './DietTab';
import BodyTab from './BodyTab';
import ReportsTab from './ReportsTab';
import CoachTab from './CoachTab';
import type { ExercisePR } from '@/lib/progressCalc';

const pad = (n: number) => String(n).padStart(2, '0');
const localToday = () => { const d = new Date(); return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`; };

interface Props {
  isOpen: boolean;
  onClose: () => void;
  /** Staff viewing a client. Omit for the logged-in client's own diary. */
  clientId?: number | null;
  clientName?: string | null;
  initialTab?: DiaryTab;
}

/**
 * The Daily Progress Diary. Clients log workouts, cardio, diet, water and body check-ins;
 * coach/admin/trainer open the same diary for a client (clientId) with an extra Coach tab
 * for targets and feedback.
 */
export default function ProgressDiary({ isOpen, onClose, clientId, clientName, initialTab = 'overview' }: Props) {
  const isStaffView = !!clientId;
  const today = localToday();
  const [tab, setTab] = useState<DiaryTab>(initialTab);
  const [date, setDate] = useState(today);
  const [bundle, setBundle] = useState<DayBundle | null>(null);
  const [week, setWeek] = useState<any>(null);
  const [prs, setPrs] = useState<ExercisePR[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [refreshKey, setRefreshKey] = useState(0);
  const feedback = useFeedback(clientId, refreshKey, isOpen);

  useEffect(() => { if (isOpen) { setTab(initialTab); setDate(localToday()); } }, [isOpen, initialTab]);

  const load = useCallback(async () => {
    setLoading((l) => l || !bundle);
    setError('');
    try {
      const [day, rep] = await Promise.all([
        progressApi<DayBundle>('day', { query: { date }, userId: clientId }),
        progressApi<{ report: any }>('report', { query: { period: 'week', date }, userId: clientId }),
      ]);
      setBundle(day);
      setWeek(rep.report);
      setPrs(rep.report.prs ?? []);
    } catch (e: any) {
      setError(e.subscriptionExpired ? 'Your plan has ended. Renew to keep logging your progress.' : e.message || 'Could not load your diary');
    } finally {
      setLoading(false);
    }
  }, [date, clientId]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => { if (isOpen) load(); }, [isOpen, load, refreshKey]);

  // Lock page scroll behind the sheet.
  useEffect(() => {
    if (!isOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = prev; };
  }, [isOpen]);

  const changed = () => setRefreshKey((k) => k + 1);

  const TABS: { key: DiaryTab; label: string; icon: any }[] = [
    { key: 'overview', label: 'Overview', icon: LayoutDashboard },
    { key: 'workout', label: 'Workout', icon: Dumbbell },
    { key: 'cardio', label: 'Cardio', icon: Activity },
    { key: 'diet', label: 'Diet', icon: UtensilsCrossed },
    { key: 'body', label: 'Body', icon: Scale },
    { key: 'reports', label: 'Reports', icon: BarChart3 },
    ...(isStaffView ? [{ key: 'coach' as DiaryTab, label: 'Coach', icon: MessageSquareQuote }] : []),
  ];

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/80 z-[60] flex items-stretch sm:items-center justify-center sm:p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 24 }}
          transition={{ type: 'spring', damping: 26, stiffness: 240 }}
          className="bg-[#0a0f1f] border border-white/10 sm:rounded-2xl w-full sm:max-w-3xl h-full sm:h-auto sm:max-h-[92vh] flex flex-col overflow-hidden shadow-2xl"
          onClick={(e) => e.stopPropagation()}
          role="dialog"
          aria-modal="true"
          aria-label="Progress diary"
        >
          <div className="px-4 sm:px-5 pt-4 pb-3 border-b border-white/10" style={{ paddingTop: 'max(1rem, env(safe-area-inset-top))' }}>
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <h2 className="text-xl font-extrabold tracking-tight text-white">
                  PROGRESS <span className="text-brand-blue">DIARY</span>
                </h2>
                <p className="text-[11px] uppercase tracking-[0.18em] text-gray-500 mt-0.5 truncate">
                  {isStaffView ? clientName || 'Client' : 'Log it. See it. Beat it.'}
                </p>
              </div>
              <div className="flex items-center gap-1">
                {tab !== 'reports' && tab !== 'coach' && <DayNav date={date} today={today} onChange={setDate} />}
                <button onClick={onClose} className="p-2 rounded-xl hover:bg-white/10 transition-colors" aria-label="Close"><X className="w-5 h-5 text-gray-300" /></button>
              </div>
            </div>
            <div className="flex gap-1 mt-3 overflow-x-auto -mx-1 px-1 scrollbar-none">
              {TABS.map((t) => (
                <button
                  key={t.key}
                  onClick={() => setTab(t.key)}
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${tab === t.key ? 'bg-brand-blue/15 text-brand-blue' : 'text-gray-400 hover:text-white hover:bg-white/[0.04]'}`}
                >
                  <t.icon className="w-3.5 h-3.5" /> {t.label}
                </button>
              ))}
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-4 sm:p-5" style={{ paddingBottom: 'max(1.25rem, env(safe-area-inset-bottom))' }}>
            {error ? (
              <Empty icon={X} text={error} />
            ) : loading && !bundle ? (
              <Spinner />
            ) : bundle ? (
              <>
                {tab === 'overview' && <OverviewTab bundle={bundle} week={week} prs={prs} feedback={feedback} onJump={setTab} />}
                {tab === 'workout' && <WorkoutTab bundle={bundle} userId={clientId} prs={prs} onChanged={changed} />}
                {tab === 'cardio' && <CardioTab bundle={bundle} userId={clientId} onChanged={changed} />}
                {tab === 'diet' && <DietTab bundle={bundle} userId={clientId} onChanged={changed} />}
                {tab === 'body' && <BodyTab bundle={bundle} userId={clientId} onChanged={changed} />}
                {tab === 'reports' && <ReportsTab date={date} userId={clientId} refreshKey={refreshKey} />}
                {tab === 'coach' && clientId && <CoachTab userId={clientId} targets={bundle.targets} feedback={feedback} onChanged={changed} />}
              </>
            ) : null}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
