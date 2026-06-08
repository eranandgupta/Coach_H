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

  const items = navItems[role] || navItems.client;

  return (
    <div className="fixed bottom-0 inset-x-0 z-50 lg:hidden" style={{ background: 'rgba(10,15,31,0.98)' }}>
      <div className="border-t border-white/[0.08]">
        <nav className="flex items-stretch">
          {items.map((item) => {
            const isActive = active === item.id;
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
                  {badges && badges[item.id] > 0 && (
                    <div className="absolute -top-1.5 -right-2.5 min-w-[16px] h-4 bg-red-500 rounded-full flex items-center justify-center px-1">
                      <span className="text-[9px] font-bold text-white">{badges[item.id] > 9 ? '9+' : badges[item.id]}</span>
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
      <div className="pb-[env(safe-area-inset-bottom)]" style={{ background: 'rgba(10,15,31,0.98)' }} />
    </div>
  );
}
