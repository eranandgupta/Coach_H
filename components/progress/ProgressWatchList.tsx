'use client';

import { useEffect, useMemo, useState } from 'react';
import { NotebookPen, Dumbbell, UtensilsCrossed, Droplet, Scale, Activity, Loader2, Search, ChevronRight } from 'lucide-react';
import { progressApi } from './api';
import { fmtDate } from './ui';

interface Row {
  id: number; name: string | null; email: string | null; plan: string | null; status: string | null;
  lastLogDate: string | null; daysSinceLog: number | null;
  today: { workout: boolean; cardio: boolean; diet: boolean; body: boolean; water: boolean };
}

type Filter = 'stale' | 'today' | 'all';
const STALE_DAYS = 3;

/**
 * Coach dashboard board: every client on a running plan, what they logged today and who has
 * stopped updating their diary (3+ days, or never).
 */
export default function ProgressWatchList({ onOpenClient }: { onOpenClient: (id: number, name: string | null) => void }) {
  const [rows, setRows] = useState<Row[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState<Filter>('stale');
  const [q, setQ] = useState('');

  useEffect(() => {
    progressApi<{ clients: Row[] }>('clients')
      .then((r) => setRows(r.clients))
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  const isStale = (r: Row) => r.daysSinceLog == null || r.daysSinceLog >= STALE_DAYS;
  const loggedToday = (r: Row) => r.daysSinceLog === 0;
  const counts = { stale: rows.filter(isStale).length, today: rows.filter(loggedToday).length, all: rows.length };

  const shown = useMemo(() => {
    const term = q.trim().toLowerCase();
    return rows
      .filter((r) => (filter === 'stale' ? isStale(r) : filter === 'today' ? loggedToday(r) : true))
      .filter((r) => !term || (r.name ?? '').toLowerCase().includes(term) || (r.email ?? '').toLowerCase().includes(term))
      .sort((a, b) => (b.daysSinceLog ?? 9999) - (a.daysSinceLog ?? 9999) || (a.name ?? '').localeCompare(b.name ?? ''));
  }, [rows, filter, q]); // eslint-disable-line react-hooks/exhaustive-deps

  const FILTERS: { key: Filter; label: string }[] = [
    { key: 'stale', label: `Not updating (${counts.stale})` },
    { key: 'today', label: `Logged today (${counts.today})` },
    { key: 'all', label: `All active (${counts.all})` },
  ];

  return (
    <section className="bg-brand-navy-light/60 border border-white/[0.08] rounded-2xl p-4 md:p-5">
      <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
        <h3 className="flex items-center gap-2 text-base font-bold text-white"><NotebookPen className="w-5 h-5 text-brand-blue" /> Client Progress Diaries</h3>
        <div className="relative">
          <Search className="w-3.5 h-3.5 text-gray-500 absolute left-2.5 top-1/2 -translate-y-1/2" />
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search client" className="bg-white/[0.04] border border-white/10 rounded-lg pl-8 pr-3 py-1.5 text-xs text-white placeholder-gray-600 focus:outline-none focus:border-brand-blue/60 w-40" />
        </div>
      </div>
      <div className="flex gap-1.5 mb-3 overflow-x-auto">
        {FILTERS.map((f) => (
          <button key={f.key} onClick={() => setFilter(f.key)} className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap border transition-colors ${filter === f.key ? 'bg-brand-blue/15 border-brand-blue/40 text-brand-blue' : 'bg-white/[0.03] border-white/10 text-gray-400 hover:text-white'}`}>
            {f.label}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="flex justify-center py-6"><Loader2 className="w-5 h-5 text-brand-blue animate-spin" /></div>
      ) : error ? (
        <p className="text-sm text-gray-500">{error}</p>
      ) : shown.length === 0 ? (
        <p className="text-sm text-gray-500 py-4 text-center">{filter === 'stale' ? 'Everyone has logged in the last 3 days.' : 'No clients here.'}</p>
      ) : (
        <ul className="divide-y divide-white/[0.05] max-h-[420px] overflow-y-auto -mx-1">
          {shown.map((r) => (
            <li key={r.id}>
              <button onClick={() => onOpenClient(r.id, r.name)} className="w-full flex items-center gap-3 px-1 py-2.5 text-left hover:bg-white/[0.03] rounded-lg transition-colors">
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-semibold text-white truncate">{r.name || r.email || `Client #${r.id}`}</p>
                  <p className="text-[11px] text-gray-500 truncate">{r.plan ?? 'Plan'}{r.status === 'paused' ? ' · paused' : ''}</p>
                </div>
                <div className="hidden sm:flex items-center gap-1.5" aria-label="Logged today">
                  {[
                    { on: r.today.workout, Icon: Dumbbell, label: 'Workout' },
                    { on: r.today.cardio, Icon: Activity, label: 'Cardio' },
                    { on: r.today.diet, Icon: UtensilsCrossed, label: 'Diet' },
                    { on: r.today.water, Icon: Droplet, label: 'Water' },
                    { on: r.today.body, Icon: Scale, label: 'Body' },
                  ].map(({ on, Icon, label }) => <Icon key={label} className={`w-3.5 h-3.5 ${on ? 'text-emerald-400' : 'text-gray-700'}`} aria-label={`${label}${on ? ' logged' : ' not logged'}`} />)}
                </div>
                <span className={`text-[11px] font-semibold w-24 text-right flex-shrink-0 ${r.daysSinceLog == null ? 'text-gray-500' : r.daysSinceLog >= STALE_DAYS ? 'text-rose-400' : r.daysSinceLog === 0 ? 'text-emerald-400' : 'text-gray-400'}`}>
                  {r.daysSinceLog == null ? 'Never logged' : r.daysSinceLog === 0 ? 'Today' : r.daysSinceLog === 1 ? 'Yesterday' : `${r.daysSinceLog}d ago`}
                  {r.lastLogDate && r.daysSinceLog! > 1 && <span className="block text-[10px] text-gray-600 font-normal">{fmtDate(r.lastLogDate)}</span>}
                </span>
                <ChevronRight className="w-4 h-4 text-gray-600 flex-shrink-0" />
              </button>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
