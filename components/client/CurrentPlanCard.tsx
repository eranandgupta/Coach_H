'use client';

import { useMemo, useState } from 'react';
import { AlertCircle, Calendar, type LucideIcon } from 'lucide-react';
import InfoTip from './InfoTip';

export type LoadStatus = 'loading' | 'ready' | 'error';

const WEEK = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
const todayName = () => new Date().toLocaleDateString('en-US', { weekday: 'long' });
const dayRank = (day?: string) => {
  const i = WEEK.indexOf(day || '');
  return i === -1 ? WEEK.length : i;
};

type PlanItem = { day?: string; calories?: number | null };

interface CurrentPlanCardProps<T extends PlanItem> {
  id?: string;
  tourId: string;
  title: string;
  icon: LucideIcon;
  tip: string;
  status: LoadStatus;
  onRetry: () => void;
  plans: any[];
  selectedIndex: number;
  onSelectPlan: (index: number) => void;
  /** The plan's day-by-day rows: exercises or meals. */
  itemsOf: (plan: any) => T[];
  itemNoun: string;
  meta: (plan: any) => React.ReactNode;
  renderItem: (item: T) => React.ReactNode;
  viewAllLabel: string;
  onViewAll: () => void;
  empty: { title: string; body: string; action?: { label: string; onClick: () => void } };
}

export default function CurrentPlanCard<T extends PlanItem>(props: CurrentPlanCardProps<T>) {
  const { id, tourId, title, icon: Icon, tip, status, onRetry, plans, selectedIndex, onSelectPlan, empty } = props;
  const plan = plans[selectedIndex] || plans[0];

  return (
    <section id={id} data-tour={tourId} className="glass-card p-4 md:p-6 scroll-mt-24 min-w-0">
      <div className="flex items-center gap-2.5 mb-4">
        <span className="w-9 h-9 shrink-0 rounded-xl bg-brand-blue/10 text-brand-blue flex items-center justify-center">
          <Icon className="w-[18px] h-[18px]" aria-hidden />
        </span>
        <h2 className="text-lg font-bold text-white">{title}</h2>
        <InfoTip label={title}>{tip}</InfoTip>
      </div>

      {status === 'loading' && plans.length === 0 ? (
        <div className="space-y-2.5 animate-pulse" role="status" aria-label={`Loading ${title}`}>
          <div className="h-5 w-2/3 rounded bg-white/[0.06]" />
          <div className="h-14 rounded-lg bg-white/[0.04]" />
          <div className="h-14 rounded-lg bg-white/[0.04]" />
          <div className="h-14 rounded-lg bg-white/[0.04]" />
        </div>
      ) : status === 'error' && plans.length === 0 ? (
        <div className="flex flex-col items-center text-center py-8" role="alert">
          <AlertCircle className="w-6 h-6 text-gray-500 mb-3" aria-hidden />
          <p className="text-white font-semibold">Couldn&apos;t load this right now</p>
          <p className="text-gray-500 text-sm mt-1">Check your connection and try again.</p>
          <button onClick={onRetry} className="mt-4 min-h-[44px] px-5 rounded-xl text-sm font-semibold text-white bg-white/[0.06] border border-white/10 hover:bg-white/10 transition-colors">
            Try again
          </button>
        </div>
      ) : !plan ? (
        <div className="flex flex-col items-center text-center py-8">
          <span className="w-12 h-12 rounded-2xl bg-white/[0.04] ring-1 ring-white/[0.08] flex items-center justify-center mb-3">
            <Icon className="w-5 h-5 text-gray-500" aria-hidden />
          </span>
          <p className="text-white font-semibold">{empty.title}</p>
          <p className="text-gray-500 text-sm mt-1">{empty.body}</p>
          {empty.action && (
            <button onClick={empty.action.onClick} className="mt-4 min-h-[44px] px-5 rounded-xl text-sm font-semibold text-white bg-brand-blue hover:bg-blue-600 transition-colors">
              {empty.action.label}
            </button>
          )}
        </div>
      ) : (
        <>
          {plans.length > 1 && (
            <div className="flex gap-2 mb-4 flex-wrap" role="group" aria-label={`Choose a ${title.toLowerCase()}`}>
              {plans.map((p: any, idx: number) => (
                <button
                  key={p.id}
                  onClick={() => onSelectPlan(idx)}
                  aria-pressed={p.id === plan.id}
                  className={`min-h-[40px] px-3 rounded-lg text-sm font-medium transition-colors ${
                    p.id === plan.id ? 'bg-brand-blue text-white' : 'bg-white/[0.06] text-gray-400 hover:text-white'
                  }`}
                >
                  {p.title || `Plan ${idx + 1}`}
                </button>
              ))}
            </div>
          )}
          {/* Keyed so that switching plan re-picks the default day for the new plan. */}
          <PlanBody key={plan.id} plan={plan} {...props} />
        </>
      )}
    </section>
  );
}

function PlanBody<T extends PlanItem>({ plan, itemsOf, itemNoun, meta, renderItem, viewAllLabel, onViewAll }: CurrentPlanCardProps<T> & { plan: any }) {
  const today = todayName();
  const items = useMemo(() => itemsOf(plan) || [], [plan, itemsOf]);
  const days = useMemo(
    () => Array.from(new Set(items.map((i) => i.day).filter(Boolean) as string[])).sort((a, b) => dayRank(a) - dayRank(b)),
    [items]
  );
  const hasToday = days.includes(today);
  const [day, setDay] = useState<string>(hasToday ? today : 'all');

  const shown = useMemo(() => {
    const rows = day === 'all' ? items : items.filter((i) => i.day === day);
    return [...rows].sort((a, b) => dayRank(a.day) - dayRank(b.day));
  }, [items, day]);
  const dayCalories = shown.reduce((sum, i) => sum + (i.calories || 0), 0);

  return (
    <div>
      <h3 className="text-base md:text-xl font-bold text-white mb-1 break-words">{plan.title}</h3>
      {plan.description && <p className="text-gray-400 text-sm mb-2 break-words">{plan.description}</p>}
      <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-gray-400">
        <span className="inline-flex items-center gap-1.5">
          <Calendar className="w-4 h-4" aria-hidden />
          {meta(plan)}
        </span>
      </div>

      {days.length > 0 && (
        <div className="-mx-4 md:mx-0 mt-4 px-4 md:px-0 flex gap-1.5 overflow-x-auto scrollbar-hide md:flex-wrap" role="group" aria-label="Filter by day">
          {['all', ...days].map((d) => (
            <button
              key={d}
              onClick={() => setDay(d)}
              aria-pressed={day === d}
              className={`shrink-0 min-h-[40px] px-3 rounded-lg text-sm font-medium transition-colors ${
                day === d ? 'bg-brand-blue text-white' : 'bg-white/[0.05] text-gray-400 hover:text-white'
              }`}
            >
              {d === 'all' ? 'All' : d === today ? 'Today' : d.slice(0, 3)}
            </button>
          ))}
        </div>
      )}

      {days.length > 0 && !hasToday && (
        <p className="mt-2 text-xs text-gray-500">Nothing scheduled for {today}, so this shows the full plan.</p>
      )}

      <div className="mt-4 pt-4 border-t border-white/10">
        <p className="flex items-center justify-between text-sm font-semibold text-gray-300 mb-3">
          <span>
            {itemNoun} ({shown.length})
          </span>
          {day !== 'all' && dayCalories > 0 && <span className="font-normal text-gray-400">{dayCalories} cal total</span>}
        </p>
        <ul className="space-y-2 max-h-72 overflow-y-auto">
          {shown.map((item, idx) => (
            <li key={idx} className="flex items-center justify-between gap-3 p-3 bg-white/[0.05] rounded-lg">
              {renderItem(item)}
            </li>
          ))}
        </ul>
      </div>

      <button onClick={onViewAll} className="w-full mt-4 min-h-[48px] bg-brand-blue text-white rounded-xl font-semibold hover:bg-blue-600 transition-colors">
        {viewAllLabel}
      </button>
    </div>
  );
}
