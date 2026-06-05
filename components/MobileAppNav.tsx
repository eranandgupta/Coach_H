'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { LayoutGrid, Dumbbell, BookOpen, User, ShoppingBag } from 'lucide-react';

const navItems = [
  { href: '/', label: 'Home', icon: LayoutGrid },
  { href: '/#plans', label: 'Plans', icon: Dumbbell },
  { href: 'https://rhynogrip.com', label: 'Store', icon: ShoppingBag, external: true },
  { href: '/blog', label: 'Blog', icon: BookOpen },
  { href: '/about', label: 'About', icon: User },
];

export default function MobileAppNav() {
  const pathname = usePathname();

  // Hide on dashboard pages (they have their own bottom nav)
  if (pathname?.startsWith('/dashboard') || pathname?.startsWith('/admin')) {
    return null;
  }

  const isActive = (href: string) => {
    if (href === '/') return pathname === '/';
    if (href.startsWith('/#') || href.startsWith('https://')) return false;
    return pathname?.startsWith(href);
  };

  return (
    <div className="fixed bottom-0 inset-x-0 z-50 flex justify-center pb-[env(safe-area-inset-bottom)] lg:hidden pointer-events-none">
      <nav
        className="pointer-events-auto mx-3 mb-3 flex items-center gap-0.5 rounded-2xl border border-white/[0.08] px-1.5 py-2 w-[calc(100%-1.5rem)]"
        style={{
          background: 'linear-gradient(135deg, rgba(10,15,31,0.85) 0%, rgba(26,37,64,0.80) 50%, rgba(10,15,31,0.85) 100%)',
          backdropFilter: 'blur(24px)',
          WebkitBackdropFilter: 'blur(24px)',
          boxShadow: '0 8px 32px rgba(0,0,0,0.4), 0 0 0 1px rgba(255,255,255,0.04), inset 0 1px 0 rgba(255,255,255,0.06)',
        }}
      >
        {navItems.map((item) => {
          const active = isActive(item.href);
          const Icon = item.icon;

          const content = (
            <button
              className={`relative flex flex-1 flex-col items-center justify-center rounded-xl py-2 transition-all duration-300 ${
                active ? 'text-white' : 'text-white/40 hover:text-white/60'
              }`}
              style={
                active
                  ? {
                      background: 'linear-gradient(135deg, rgba(23,95,255,0.25) 0%, rgba(23,95,255,0.10) 100%)',
                      boxShadow: '0 0 20px rgba(23,95,255,0.15), inset 0 1px 0 rgba(255,255,255,0.08)',
                    }
                  : undefined
              }
            >
              {active && (
                <div
                  className="absolute inset-0 rounded-xl"
                  style={{ border: '1px solid rgba(23,95,255,0.20)' }}
                />
              )}
              <Icon size={20} strokeWidth={active ? 2.2 : 1.8} />
              <span
                className={`mt-1 text-[10px] font-medium tracking-wide ${
                  active ? 'text-blue-300' : ''
                }`}
              >
                {item.label}
              </span>
            </button>
          );

          if (item.external) {
            return (
              <a
                key={item.href}
                href={item.href}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 flex"
              >
                {content}
              </a>
            );
          }

          return (
            <Link key={item.href} href={item.href} className="flex-1 flex">
              {content}
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
