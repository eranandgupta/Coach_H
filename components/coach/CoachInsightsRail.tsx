'use client';

import { useMemo, useState } from 'react';
import {
  CalendarClock,
  ChevronDown,
  CreditCard,
  Dumbbell,
  Mail,
  MessageSquare,
  Moon,
  Sparkles,
  UserPlus,
  UtensilsCrossed,
  type LucideIcon,
} from 'lucide-react';
import { isSubscriptionCurrentlyActive, subscriptionDisplayStatus } from '@/lib/planUtils';

type Props = {
  clients: any[];
  workouts: any[];
  diets: any[];
  /** Online (paid) enrollments. Omit for roles without payment access — "New clients"
   *  then falls back to clients whose first plan started recently. */
  enrollments?: any[];
  unreadChatCount: number;
  onOpenClient: (client: any) => void;
  /** Subscription actions — omit for roles that can't manage plans (trainer). */
  onRemind?: (client: any) => void;
  onExtend?: (client: any) => void;
  onOpenChat: () => void;
};

const DAY = 86400000;
const INACTIVE_DAYS = 7;
const NEW_CLIENT_DAYS = 14;

function lastSeen(c: any): number | null {
  const t = [c.lastLoginAt, c.lastSeenAt].filter(Boolean).map((d: string) => new Date(d).getTime());
  return t.length ? Math.max(...t) : null;
}

function timeAgo(ms: number): string {
  const mins = Math.floor(ms / 60000);
  if (mins < 60) return `${Math.max(mins, 1)}m ago`;
  const h = Math.floor(mins / 60);
  if (h < 24) return `${h}h ago`;
  return `${Math.floor(h / 24)}d ago`;
}

// Shared by the rail and the dashboard hero so their numbers always agree.
export function getCoachInsights(clients: any[], workouts: any[], diets: any[], enrollments: any[] | undefined, now: Date) {
    const t = now.getTime();
    const activeClients = clients.filter((c) => c.subscriptions?.some((s: any) => isSubscriptionCurrentlyActive(s, now)));

    // Expiring: the plan covering today ends within 7 days and no renewal is queued.
    const expiring = activeClients
      .filter((c) => !c.subscriptions.some((s: any) => subscriptionDisplayStatus(s, now) === 'upcoming'))
      .map((c) => {
        const sub = c.subscriptions.find((s: any) => isSubscriptionCurrentlyActive(s, now));
        const daysLeft = Math.ceil((new Date(sub.endDate).getTime() - t) / DAY);
        return { client: c, sub, daysLeft };
      })
      .filter((x) => x.daysLeft <= 7)
      .sort((a, b) => a.daysLeft - b.daysLeft);

    const hasActive = (list: any[], id: number) => list.some((p) => p.clientId === id && new Date(p.endDate) >= now);
    const priorities: { key: string; icon: LucideIcon; label: string; hint: string; clients: any[] }[] = [
      {
        key: 'workout', icon: Dumbbell, label: 'Needs a workout plan', hint: 'Active, no current workout',
        clients: activeClients.filter((c) => !hasActive(workouts, c.id)),
      },
      {
        key: 'diet', icon: UtensilsCrossed, label: 'Needs a diet plan', hint: 'Active, no current diet',
        clients: activeClients.filter((c) => !hasActive(diets, c.id)),
      },
      {
        key: 'quiet', icon: Moon, label: 'Gone quiet', hint: `No app visit in ${INACTIVE_DAYS}+ days`,
        clients: activeClients.filter((c) => {
          const seen = lastSeen(c);
          return seen === null || t - seen > INACTIVE_DAYS * DAY;
        }),
      },
    ].filter((p) => p.clients.length > 0);

    const byUserId = new Map(clients.map((c) => [c.id, c]));
    type NewClient = { key: string | number; name?: string; detail: string; client: any; age: number };
    const newClients: NewClient[] = enrollments
      ? enrollments
          .filter((e) => t - new Date(e.createdAt).getTime() <= NEW_CLIENT_DAYS * DAY)
          .map((e) => ({
            key: e.id,
            name: e.user?.name,
            detail: `${e.plan?.name ?? ''} · ₹${Number(e.paidAmount || 0).toLocaleString('en-IN')}`,
            client: byUserId.get(e.user?.id),
            age: t - new Date(e.createdAt).getTime(),
          }))
      : clients
          .map((c) => {
            const subs = c.subscriptions || [];
            if (!subs.length) return null;
            const first = subs.reduce((a: any, b: any) => (new Date(a.startDate) < new Date(b.startDate) ? a : b));
            const age = t - new Date(first.startDate).getTime();
            return age >= 0 && age <= NEW_CLIENT_DAYS * DAY
              ? { key: c.id, name: c.name, detail: `Started ${first.plan?.name ?? 'plan'}`, client: c, age }
              : null;
          })
          .filter(Boolean)
          .sort((a: any, b: any) => a.age - b.age) as NewClient[];

    return { expiring, priorities, newClients };
}

// Right-hand "what needs me today" rail for the coach dashboard. Everything is derived
// from data the page already loads — no extra requests.
export default function CoachInsightsRail({
  clients, workouts, diets, enrollments, unreadChatCount, onOpenClient, onRemind, onExtend, onOpenChat,
}: Props) {
  const now = useMemo(() => new Date(), [clients, enrollments]);

  const { expiring, priorities, newClients } = useMemo(
    () => getCoachInsights(clients, workouts, diets, enrollments, now),
    [clients, workouts, diets, enrollments, now],
  );

  const priorityTotal = priorities.length + (unreadChatCount > 0 ? 1 : 0);
  const hasActions = !!(onRemind || onExtend);

  return (
    <aside className="space-y-4 xl:sticky xl:top-24 xl:max-h-[calc(100vh-7rem)] xl:overflow-y-auto scrollbar-hide pb-2 xl:pb-20">
      {/* Date header */}
      <div className="px-1">
        <p className="text-[11px] font-semibold uppercase tracking-widest text-gray-500">Today</p>
        <p className="text-white font-semibold">
          {now.toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'short' })}
        </p>
      </div>

      {/* Expiring in 7 days */}
      <RailCard icon={CalendarClock} title="Expiring in 7 days" count={expiring.length} tone={expiring.length ? 'amber' : 'muted'}>
        {expiring.length === 0 ? (
          <Empty text="No plans ending this week" />
        ) : (
          <ul className="space-y-1">
            {expiring.slice(0, 8).map(({ client, sub, daysLeft }) => (
              <li key={client.id}>
                <div
                  role="button"
                  tabIndex={0}
                  onClick={() => onOpenClient(client)}
                  onKeyDown={(e) => e.key === 'Enter' && onOpenClient(client)}
                  className="group flex items-center gap-2.5 p-2 -mx-1 rounded-lg hover:bg-white/[0.04] cursor-pointer"
                >
                  <Avatar name={client.name} />
                  <div className="min-w-0 flex-1">
                    <p className="text-sm text-white font-medium truncate">{client.name || 'Client'}</p>
                    <p className="text-[11px] text-gray-500 truncate">{sub.plan?.name}</p>
                  </div>
                  <span
                    className={`shrink-0 px-1.5 py-0.5 rounded-md text-[10px] font-bold tabular-nums ${
                      daysLeft <= 1 ? 'bg-rose-500/10 text-rose-400' : daysLeft <= 3 ? 'bg-amber-500/10 text-amber-400' : 'bg-white/[0.06] text-gray-400'
                    } ${hasActions ? 'group-hover:hidden' : ''}`}
                  >
                    {daysLeft <= 0 ? 'Today' : `${daysLeft}d`}
                  </span>
                  {hasActions && (
                    <div className="hidden group-hover:flex items-center gap-1 shrink-0">
                      {onRemind && <IconBtn label="Send reminder" onClick={() => onRemind(client)}><Mail className="w-3.5 h-3.5" /></IconBtn>}
                      {onExtend && <IconBtn label="Extend plan" onClick={() => onExtend(client)}><CreditCard className="w-3.5 h-3.5" /></IconBtn>}
                    </div>
                  )}
                </div>
              </li>
            ))}
            {expiring.length > 8 && <li className="text-[11px] text-gray-500 px-1 pt-1">+{expiring.length - 8} more</li>}
          </ul>
        )}
      </RailCard>

      {/* Today's priorities */}
      <RailCard icon={Sparkles} title="Today's priorities" count={priorityTotal} tone={priorityTotal ? 'blue' : 'muted'}>
        {priorityTotal === 0 ? (
          <Empty text="All caught up" />
        ) : (
          <div className="space-y-1">
            {unreadChatCount > 0 && (
              <button
                onClick={onOpenChat}
                className="w-full flex items-center gap-2.5 p-2 -mx-1 rounded-lg hover:bg-white/[0.04] text-left"
              >
                <PriorityIcon icon={MessageSquare} />
                <span className="flex-1 min-w-0">
                  <span className="block text-sm text-white font-medium">Reply to messages</span>
                  <span className="block text-[11px] text-gray-500">Unread client chats</span>
                </span>
                <CountPill n={unreadChatCount} />
              </button>
            )}
            {priorities.map((p) => (
              <PriorityRow key={p.key} icon={p.icon} label={p.label} hint={p.hint} clients={p.clients} onOpenClient={onOpenClient} />
            ))}
          </div>
        )}
      </RailCard>

      {/* New clients */}
      <RailCard icon={UserPlus} title="New clients" count={newClients.length} tone={newClients.length ? 'green' : 'muted'}>
        {newClients.length === 0 ? (
          <Empty text={`No new clients in ${NEW_CLIENT_DAYS} days`} />
        ) : (
          <ul className="space-y-1">
            {newClients.slice(0, 6).map(({ key, name, detail, client, age }) => (
              <li key={key}>
                <div
                  role={client ? 'button' : undefined}
                  tabIndex={client ? 0 : undefined}
                  onClick={() => client && onOpenClient(client)}
                  onKeyDown={(e) => client && e.key === 'Enter' && onOpenClient(client)}
                  className={`flex items-center gap-2.5 p-2 -mx-1 rounded-lg ${client ? 'hover:bg-white/[0.04] cursor-pointer' : ''}`}
                >
                  <Avatar name={name} />
                  <div className="min-w-0 flex-1">
                    <p className="text-sm text-white font-medium truncate flex items-center gap-1.5">
                      <span className="truncate">{name || 'New client'}</span>
                      {age < 2 * DAY && (
                        <span className="shrink-0 px-1 rounded text-[9px] font-bold uppercase tracking-wide bg-emerald-500/10 text-emerald-400">New</span>
                      )}
                    </p>
                    <p className="text-[11px] text-gray-500 truncate">{detail}</p>
                  </div>
                  <span className="shrink-0 text-[10px] text-gray-500 tabular-nums">{timeAgo(age)}</span>
                </div>
              </li>
            ))}
          </ul>
        )}
      </RailCard>
    </aside>
  );
}

const TONES = {
  amber: 'bg-amber-500/10 text-amber-400',
  blue: 'bg-brand-blue/10 text-brand-blue',
  green: 'bg-emerald-500/10 text-emerald-400',
  muted: 'bg-white/[0.05] text-gray-500',
};

function RailCard({
  icon: Icon, title, count, tone, children,
}: { icon: LucideIcon; title: string; count: number; tone: keyof typeof TONES; children: React.ReactNode }) {
  return (
    <section className="rounded-2xl bg-brand-navy-light/60 border border-white/[0.08] p-3.5 shadow-sm">
      <header className="flex items-center gap-2 mb-2.5">
        <Icon className="w-4 h-4 text-gray-400" />
        <h3 className="flex-1 text-sm font-semibold text-white">{title}</h3>
        <span className={`min-w-[22px] text-center px-1.5 py-0.5 rounded-md text-[11px] font-bold tabular-nums ${TONES[tone]}`}>{count}</span>
      </header>
      {children}
    </section>
  );
}

function PriorityRow({
  icon, label, hint, clients, onOpenClient,
}: { icon: LucideIcon; label: string; hint: string; clients: any[]; onOpenClient: (c: any) => void }) {
  const [open, setOpen] = useState(false);
  return (
    <div>
      <button
        onClick={() => setOpen(!open)}
        aria-expanded={open}
        className="w-full flex items-center gap-2.5 p-2 -mx-1 rounded-lg hover:bg-white/[0.04] text-left"
      >
        <PriorityIcon icon={icon} />
        <span className="flex-1 min-w-0">
          <span className="block text-sm text-white font-medium truncate">{label}</span>
          <span className="block text-[11px] text-gray-500 truncate">{hint}</span>
        </span>
        <CountPill n={clients.length} />
        <ChevronDown className={`w-3.5 h-3.5 text-gray-500 transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>
      {open && (
        <ul className="ml-9 mt-0.5 mb-1.5 border-l border-white/[0.08] pl-2.5 space-y-0.5">
          {clients.slice(0, 8).map((c) => (
            <li key={c.id}>
              <button
                onClick={() => onOpenClient(c)}
                className="w-full text-left text-xs text-gray-300 hover:text-brand-blue truncate py-1"
              >
                {c.name || c.email}
              </button>
            </li>
          ))}
          {clients.length > 8 && <li className="text-[11px] text-gray-500 py-1">+{clients.length - 8} more</li>}
        </ul>
      )}
    </div>
  );
}

function PriorityIcon({ icon: Icon }: { icon: LucideIcon }) {
  return (
    <span className="shrink-0 w-7 h-7 rounded-lg bg-brand-blue/10 text-brand-blue flex items-center justify-center">
      <Icon className="w-3.5 h-3.5" />
    </span>
  );
}

function CountPill({ n }: { n: number }) {
  return <span className="shrink-0 text-xs font-semibold text-gray-300 tabular-nums">{n}</span>;
}

function Avatar({ name }: { name?: string }) {
  return (
    <span className="shrink-0 w-7 h-7 rounded-full bg-brand-blue/15 ring-1 ring-brand-blue/20 text-brand-blue text-xs font-bold flex items-center justify-center">
      {name?.[0]?.toUpperCase() || 'C'}
    </span>
  );
}

function IconBtn({ label, onClick, children }: { label: string; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      aria-label={label}
      title={label}
      onClick={(e) => { e.stopPropagation(); onClick(); }}
      className="w-7 h-7 rounded-md flex items-center justify-center text-gray-400 bg-white/[0.04] border border-white/[0.08] hover:text-brand-blue hover:border-brand-blue/30"
    >
      {children}
    </button>
  );
}

function Empty({ text }: { text: string }) {
  return <p className="text-xs text-gray-500 px-1 py-2">{text}</p>;
}
