'use client';

import { useState, useEffect } from 'react';
import {
  LayoutGrid,
  Dumbbell,
  UtensilsCrossed,
  Users,
  FileText,
  User,
  MessageSquare,
  CreditCard,
  Tag,
  Settings,
  Bell,
  TrendingUp,
  Play,
  Ellipsis as MoreIcon,
  X,
} from 'lucide-react';

type NavItem = {
  id: string;
  label: string;
  icon: React.ElementType;
  action?: () => void;
};

export type MoreItem = {
  id: string;
  label: string;
  icon: React.ElementType;
  onSelect: () => void;
  badge?: number;
  /** Small "NEW" tag on the tile. */
  isNew?: boolean;
  danger?: boolean;
  disabled?: boolean;
};

type MobileBottomNavProps = {
  role: 'client' | 'coach' | 'trainer' | 'admin';
  activeTab?: string;
  onTabChange?: (tab: string) => void;
  onAction?: (action: string) => void;
  badges?: Record<string, number>;
  /** When set, the last tab becomes "More" and opens a tray with these actions. */
  moreItems?: MoreItem[];
};

export default function MobileBottomNav({ role, activeTab, onTabChange, onAction, badges, moreItems }: MobileBottomNavProps) {
  const [moreOpen, setMoreOpen] = useState(false);
  const [active, setActive] = useState(activeTab || 'home');

  useEffect(() => {
    if (activeTab) setActive(activeTab);
  }, [activeTab]);

  const handleTap = (item: NavItem) => {
    setActive(item.id);
    if (item.action) {
      item.action();
    } else if (onTabChange) {
      onTabChange(item.id);
    }
  };

  const navItems: Record<string, NavItem[]> = {
    client: [
      { id: 'home', label: 'Home', icon: LayoutGrid },
      { id: 'workout', label: 'Workout', icon: Dumbbell },
      { id: 'diet', label: 'Diet', icon: UtensilsCrossed },
      { id: 'chat', label: 'Chat', icon: MessageSquare },
      { id: 'profile', label: 'Profile', icon: User },
    ],
    coach: [
      { id: 'home', label: 'Home', icon: LayoutGrid },
      { id: 'clients', label: 'Clients', icon: Users },
      { id: 'chat', label: 'Chat', icon: MessageSquare },
      { id: 'workouts', label: 'Workouts', icon: Dumbbell },
      { id: 'diets', label: 'Diets', icon: UtensilsCrossed },
    ],
    trainer: [
      { id: 'home', label: 'Home', icon: LayoutGrid },
      { id: 'clients', label: 'Clients', icon: Users },
      { id: 'chat', label: 'Chat', icon: MessageSquare },
      { id: 'workouts', label: 'Workouts', icon: Dumbbell },
      { id: 'diets', label: 'Diets', icon: UtensilsCrossed },
    ],
    admin: [
      { id: 'home', label: 'Home', icon: LayoutGrid },
      { id: 'clients', label: 'Clients', icon: Users },
      { id: 'subscriptions', label: 'Subs', icon: CreditCard },
      { id: 'promoCodes', label: 'Promos', icon: Tag },
      { id: 'settings', label: 'Settings', icon: Settings },
    ],
  };

  const baseItems = navItems[role] || navItems.client;
  const moreBadge = moreItems?.reduce((n, m) => n + (m.badge || 0), 0) || 0;
  const moreIsNew = !!moreItems?.some((m) => m.isNew);
  const items: NavItem[] = moreItems
    ? [...baseItems.slice(0, -1), { id: 'more', label: 'More', icon: MoreIcon, action: () => setMoreOpen((o) => !o) }]
    : baseItems;
  const allBadges: Record<string, number> = { ...(badges || {}), ...(moreItems ? { more: moreBadge } : {}) };

  return (
    <>
    {moreItems && (
      <>
        {/* Backdrop */}
        <div
          aria-hidden
          onClick={() => setMoreOpen(false)}
          className={`fixed inset-0 z-[45] bg-black/40 transition-opacity duration-200 lg:hidden ${moreOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        />
        {/* Tray — slides up above the bar */}
        <div
          role="dialog"
          aria-label="More"
          aria-hidden={!moreOpen}
          className={`fixed inset-x-0 bottom-0 z-[48] lg:hidden transition-transform duration-300 ease-[cubic-bezier(.22,1,.36,1)] ${moreOpen ? 'translate-y-0' : 'translate-y-full'}`}
        >
          <div className="mx-2 mb-[calc(64px+env(safe-area-inset-bottom))] rounded-3xl bg-brand-navy-light border border-white/[0.08] shadow-2xl p-3">
            <div className="flex items-center justify-between px-1.5 pb-2">
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-gray-500">More</p>
              <button onClick={() => setMoreOpen(false)} aria-label="Close" className="w-7 h-7 rounded-full flex items-center justify-center text-gray-400 hover:text-white hover:bg-white/[0.06]">
                <X size={16} />
              </button>
            </div>
            <div className="grid grid-cols-3 gap-2">
              {moreItems.map((m) => {
                const Icon = m.icon;
                return (
                  <button
                    key={m.id}
                    tabIndex={moreOpen ? 0 : -1}
                    onClick={() => { setMoreOpen(false); m.onSelect(); }}
                    className={`relative flex flex-col items-center justify-center gap-1.5 rounded-2xl py-3.5 px-1 bg-white/[0.04] border border-white/[0.06] active:scale-95 transition-transform ${m.disabled ? 'opacity-50' : ''}`}
                  >
                    <span className={`w-10 h-10 rounded-xl flex items-center justify-center ${m.danger ? 'bg-rose-500/10 text-rose-400' : 'bg-brand-blue/10 text-brand-blue'}`}>
                      <Icon size={19} />
                    </span>
                    <span className={`text-[11px] font-medium leading-tight text-center ${m.danger ? 'text-rose-400' : 'text-gray-300'}`}>{m.label}</span>
                    {!!m.badge && m.badge > 0 && (
                      <span className="absolute top-2 right-2 min-w-[16px] h-4 px-1 rounded-full bg-red-500 text-[9px] font-bold text-snow flex items-center justify-center">{m.badge > 9 ? '9+' : m.badge}</span>
                    )}
                    {m.isNew && (
                      <span className="absolute top-2 right-2 bg-amber-400 text-ink text-[8px] font-extrabold leading-none px-1 py-0.5 rounded-full">NEW</span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </>
    )}
    <div className="fixed bottom-0 inset-x-0 z-50 lg:hidden" style={{ background: 'rgb(var(--c-navy) / 0.98)' }}>
      <div className="border-t border-white/[0.08]">
        <nav className="flex items-stretch">
          {items.map((item) => {
            const isActive = item.id === 'more' ? moreOpen || active === 'more' : active === item.id;
            const Icon = item.icon;

            return (
              <button
                key={item.id}
                onClick={() => handleTap(item)}
                className={`relative flex flex-1 flex-col items-center justify-center py-3 transition-colors duration-200 ${
                  isActive
                    ? 'text-blue-400'
                    : 'text-white/40 hover:text-white/60'
                }`}
              >
                {isActive && (
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 w-12 h-[2px] bg-blue-400 rounded-b-full" />
                )}
                <div className="relative">
                  <Icon size={22} strokeWidth={isActive ? 2.2 : 1.6} />
                  {item.id === 'more' && moreIsNew && !(allBadges.more > 0) && (
                    <span className="absolute -top-1 -right-1.5 w-2 h-2 rounded-full bg-amber-400 ring-2 ring-brand-navy" />
                  )}
                  {allBadges[item.id] > 0 && (
                    <div className="absolute -top-1.5 -right-2.5 min-w-[16px] h-4 bg-red-500 rounded-full flex items-center justify-center px-1">
                      <span className="text-[9px] font-bold text-white">{allBadges[item.id] > 9 ? '9+' : allBadges[item.id]}</span>
                    </div>
                  )}
                </div>
                <span
                  className={`mt-1 text-[10px] font-medium tracking-wide ${
                    isActive ? 'text-blue-400' : ''
                  }`}
                >
                  {item.label}
                </span>
              </button>
            );
          })}
        </nav>
      </div>
      <div className="pb-[env(safe-area-inset-bottom)]" style={{ background: 'rgb(var(--c-navy) / 0.98)' }} />
    </div>
    </>
  );
}
