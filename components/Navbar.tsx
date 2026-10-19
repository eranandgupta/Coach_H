'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { Menu, X, ShoppingCart, User, LayoutDashboard } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import LoginModal from './LoginModal';
import GetAppModal from './GetAppModal';
import ThemeToggle from './theme/ThemeToggle';
import { hasSessionHint } from '@/lib/session';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isGetAppOpen, setIsGetAppOpen] = useState(false);
  // Logged-in visitors go straight to their dashboard instead of seeing the login form.
  const [loggedIn, setLoggedIn] = useState(false);
  useEffect(() => setLoggedIn(hasSessionHint()), []);

  const navLinks = [
    { href: '/', label: 'Home' },
    { href: '/about', label: 'About' },
    { href: '/plans', label: 'Plans' },
    { href: '/online-personal-trainer', label: '1:1 Coaching' },
    { href: '/calorie-calculator', label: 'Calorie Calculator' },
    { href: '/blog', label: 'Blog' },
    { href: 'https://rhynogrip.com', label: 'Store' },
  ];

  return (
    <>
      <nav className="fixed top-[24px] left-0 right-0 z-50 navbar-glass">
        <div className="max-w-7xl mx-auto px-4 md:px-6 py-1 md:py-0">
        <div className="flex justify-between items-center gap-4">
          <div className="flex items-center gap-4 lg:gap-5">
            <Link
              href="/"
              className="flex items-center hover:opacity-80 transition-opacity"
            >
              <Image
                src="https://ik.imagekit.io/oeagl0l4x/public/logo.png?tr=w-200,q-80,f-auto"
                alt="Coach Himanshu"
                width={100}
                height={100}
                className="theme-logo object-contain w-[70px] md:w-[100px]"
              />
            </Link>
            <ThemeToggle className="hidden lg:inline-flex" />
          </div>

          <div className="hidden lg:flex items-center gap-4 xl:gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-gray-300 hover:text-white transition-colors text-sm font-medium uppercase whitespace-nowrap"
              >
                {link.label}
              </Link>
            ))}

            {/* Fit Bharat Mission - Direct Link */}
            <Link
              href="/fit-bharat-mission"
              className="text-sm font-bold uppercase transition-all whitespace-nowrap"
            >
              <span className="bg-gradient-to-r from-orange-500 via-white to-green-500 bg-clip-text text-transparent">
                Fit Bharat
              </span>
            </Link>
          </div>

          <div className="hidden lg:flex items-center gap-4 xl:gap-5">
            <ThemeToggle size="sm" className="lg:hidden" />
            <button
              onClick={() => setIsGetAppOpen(true)}
              className="px-4 py-2 bg-gradient-to-r from-brand-blue to-blue-500 text-white rounded-xl font-semibold text-sm whitespace-nowrap hover:shadow-lg hover:shadow-brand-blue/25 transition-all duration-300"
            >
              Get App
            </button>
            {loggedIn ? (
              <Link
                href="/dashboard"
                aria-label="Dashboard"
                className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-semibold text-white bg-white/[0.06] border border-white/[0.1] hover:bg-white/[0.1] transition-colors whitespace-nowrap"
              >
                <LayoutDashboard size={16} />
                {/* Icon-only until xl: the full label crowds the nav links at laptop widths */}
                <span className="hidden xl:inline">Dashboard</span>
              </Link>
            ) : (
              <button
                onClick={() => setIsLoginOpen(true)}
                className="text-gray-400 hover:text-white transition-colors"
                aria-label="Login"
              >
                <User size={22} />
              </button>
            )}
            <Link
              href="/cart"
              className="text-gray-400 hover:text-white transition-colors"
              aria-label="Shopping Cart"
            >
              <ShoppingCart size={22} />
            </Link>
          </div>

          <div className="lg:hidden flex items-center gap-3">
          <ThemeToggle size="sm" />
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="p-2 rounded-xl border border-white/[0.08] text-white/80 hover:text-white transition-all"
            style={{ background: 'linear-gradient(135deg, rgb(var(--c-white) / 0.04) 0%, rgb(var(--c-white) / 0.01) 100%)' }}
            aria-label="Toggle menu"
          >
            {isOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden bg-brand-navy/90 border-t border-white/[0.06]"
          >
            <div className="px-5 py-4 space-y-1">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="block text-gray-300 hover:text-white transition-colors py-2.5 px-3 rounded-xl hover:bg-white/[0.04] text-sm font-medium"
                  onClick={() => setIsOpen(false)}
                >
                  {link.label}
                </Link>
              ))}

              {/* Mobile Fit Bharat Mission - Direct Link */}
              <div className="border-t border-white/[0.06] pt-3 mt-2">
                <Link
                  href="/fit-bharat-mission"
                  onClick={() => setIsOpen(false)}
                  className="flex items-center py-2"
                >
                  <span className="bg-gradient-to-r from-orange-500 via-white to-green-500 bg-clip-text text-transparent font-bold">
                    Fit Bharat Mission
                  </span>
                </Link>
              </div>

              {loggedIn ? (
                <Link
                  href="/dashboard"
                  onClick={() => setIsOpen(false)}
                  className="flex items-center gap-2 w-full text-left text-white transition-colors py-2.5 px-3 rounded-xl hover:bg-white/[0.04] text-sm font-semibold"
                >
                  <LayoutDashboard size={16} /> My Dashboard
                </Link>
              ) : (
                <button
                  onClick={() => {
                    setIsOpen(false);
                    setIsLoginOpen(true);
                  }}
                  className="block w-full text-left text-gray-300 hover:text-white transition-colors py-2.5 px-3 rounded-xl hover:bg-white/[0.04] text-sm font-medium"
                >
                  Login
                </button>
              )}
              <button
                onClick={() => {
                  setIsOpen(false);
                  setIsGetAppOpen(true);
                }}
                className="block w-full bg-gradient-to-r from-brand-blue to-blue-500 text-white px-4 py-3 rounded-xl font-semibold text-center text-sm shadow-lg shadow-brand-blue/20 transition-all duration-300 mt-3"
              >
                Get App
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      </nav>

      <LoginModal isOpen={isLoginOpen} onClose={() => setIsLoginOpen(false)} />
      <GetAppModal isOpen={isGetAppOpen} onClose={() => setIsGetAppOpen(false)} />
    </>
  );
}
