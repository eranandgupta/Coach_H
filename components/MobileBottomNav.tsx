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
} from 'lucide-react';

type NavItem = {
  id: string;
  label: string;
  icon: React.ElementType;
  action?: () => void;
};

type MobileBottomNavProps = {
  role: 'client' | 'coach' | 'trainer' | 'admin';
  activeTab?: string;
  onTabChange?: (tab: string) => void;
  onAction?: (action: string) => void;
  badges?: Record<string, number>;
};

export default function MobileBottomNav({ role, activeTab, onTabChange, onAction, badges }: MobileBottomNavProps) {
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
      { id: 'workouts', label: 'Workouts', icon: Dumbbell },
      { id: 'diets', label: 'Diets', icon: UtensilsCrossed },
      { id: 'sessions', label: 'Sessions', icon: Play },
    ],
    admin: [
      { id: 'home', label: 'Home', icon: LayoutGrid },
      { id: 'clients', label: 'Clients', icon: Users },
      { id: 'subscriptions', label: 'Subs', icon: CreditCard },
      { id: 'promoCodes', label: 'Promos', icon: Tag },
      { id: 'settings', label: 'Settings', icon: Settings },
    ],
  };

  const items = navItems[role] || navItems.client;

  return (
    <div className="fixed bottom-0 inset-x-0 z-50 flex justify-center pb-[env(safe-area-inset-bottom)] lg:hidden pointer-events-none">
      <nav
        className="pointer-events-auto mx-3 mb-3 flex items-center gap-0.5 rounded-2xl border border-white/[0.08] px-1.5 py-2 backdrop-blur-2xl w-[calc(100%-1.5rem)]"
        style={{
          background: 'linear-gradient(135deg, rgba(10,15,31,0.85) 0%, rgba(26,37,64,0.80) 50%, rgba(10,15,31,0.85) 100%)',
          boxShadow: '0 8px 32px rgba(0,0,0,0.4), 0 0 0 1px rgba(255,255,255,0.04), inset 0 1px 0 rgba(255,255,255,0.06)',
        }}
      >
        {items.map((item) => {
          const isActive = active === item.id;
          const Icon = item.icon;

          return (
            <button
              key={item.id}
              onClick={() => handleTap(item)}
              className={`relative flex flex-1 flex-col items-center justify-center rounded-xl py-2 transition-all duration-300 ${
                isActive
                  ? 'text-white'
                  : 'text-white/40 hover:text-white/60'
              }`}
              style={
                isActive
                  ? {
                      background: 'linear-gradient(135deg, rgba(23,95,255,0.25) 0%, rgba(23,95,255,0.10) 100%)',
                      boxShadow: '0 0 20px rgba(23,95,255,0.15), inset 0 1px 0 rgba(255,255,255,0.08)',
                    }
                  : undefined
              }
            >
              {isActive && (
                <div
                  className="absolute inset-0 rounded-xl"
                  style={{
                    border: '1px solid rgba(23,95,255,0.20)',
                  }}
                />
              )}
              <div className="relative">
                <Icon size={20} strokeWidth={isActive ? 2.2 : 1.8} />
                {badges && badges[item.id] > 0 && (
                  <div className="absolute -top-1.5 -right-2.5 min-w-[16px] h-4 bg-red-500 rounded-full flex items-center justify-center px-1">
                    <span className="text-[9px] font-bold text-white">{badges[item.id] > 9 ? '9+' : badges[item.id]}</span>
                  </div>
                )}
              </div>
              <span
                className={`mt-1 text-[10px] font-medium tracking-wide ${
                  isActive ? 'text-blue-300' : ''
                }`}
              >
                {item.label}
              </span>
            </button>
          );
        })}
      </nav>
    </div>
  );
}
