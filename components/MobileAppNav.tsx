'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { Home, Dumbbell, BookOpen, User, ShoppingBag } from 'lucide-react';

const navItems = [
  { href: '/', label: 'Home', icon: Home },
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
    <div className="fixed bottom-0 inset-x-0 z-50 lg:hidden pointer-events-none">
      {/* Safe area spacer for content behind the nav */}
      <nav
        className="pointer-events-auto flex items-stretch border-t border-white/[0.06]"
        style={{
          background: 'linear-gradient(180deg, rgba(10,15,31,0.97) 0%, rgba(7,10,21,0.99) 100%)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          paddingBottom: 'env(safe-area-inset-bottom, 0px)',
        }}
      >
        {navItems.map((item) => {
          const active = isActive(item.href);
          const Icon = item.icon;

          const content = (
            <div
              className={`relative flex flex-1 flex-col items-center justify-center py-2 transition-colors duration-200 ${
                active ? 'text-brand-blue' : 'text-gray-500'
              }`}
            >
              {/* Active indicator dot */}
              {active && (
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-5 h-[2px] rounded-full bg-brand-blue" />
              )}
              <Icon
                size={22}
                strokeWidth={active ? 2.2 : 1.6}
                className={active ? 'text-brand-blue' : 'text-gray-500'}
              />
              <span
                className={`mt-0.5 text-[10px] font-medium ${
                  active ? 'text-brand-blue' : 'text-gray-500'
                }`}
              >
                {item.label}
              </span>
            </div>
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
