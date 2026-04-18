'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState, useRef, useEffect } from 'react';
import { Menu, X, ShoppingCart, User, ChevronDown, Heart, Dumbbell, Apple } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import LoginModal from './LoginModal';
import GetAppModal from './GetAppModal';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isGetAppOpen, setIsGetAppOpen] = useState(false);
  const [isFitBharatOpen, setIsFitBharatOpen] = useState(false);
  const [isMobileFitBharatOpen, setIsMobileFitBharatOpen] = useState(false);
  const fitBharatRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (fitBharatRef.current && !fitBharatRef.current.contains(event.target as Node)) {
        setIsFitBharatOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const navLinks = [
    { href: '/', label: 'Home' },
    { href: '/about', label: 'About' },
    { href: '/#plans', label: 'Plans' },
    { href: '/blog', label: 'Blog' },
    { href: 'https://rhynogrip.com', label: 'Store' },
  ];

  return (
    <>
      <nav className="fixed top-[24px] left-0 right-0 z-50 navbar-glass">
        <div className="max-w-7xl mx-auto px-4 md:px-6 py-0">
        <div className="flex justify-between items-center">
          <Link
            href="/"
            className="flex items-center hover:opacity-80 transition-opacity"
          >
            <Image
              src="/logo.png"
              alt="Coach Himanshu"
              width={100}
              height={100}
              className="object-contain w-[70px] md:w-[100px]"
            />
          </Link>

          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-gray-300 hover:text-white transition-colors text-sm font-medium uppercase"
              >
                {link.label}
              </Link>
            ))}

            {/* Fit Bharat Mission Dropdown */}
            <div className="relative" ref={fitBharatRef}>
              <button
                onClick={() => setIsFitBharatOpen(!isFitBharatOpen)}
                className="flex items-center gap-1 text-sm font-medium uppercase transition-all group"
              >
                <span className="bg-gradient-to-r from-orange-500 via-white to-green-500 bg-clip-text text-transparent font-bold">
                  Fit Bharat
                </span>
                <ChevronDown
                  size={16}
                  className={`text-orange-500 transition-transform duration-200 ${isFitBharatOpen ? 'rotate-180' : ''}`}
                />
              </button>

              <AnimatePresence>
                {isFitBharatOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    transition={{ duration: 0.2 }}
                    className="absolute top-full left-1/2 -translate-x-1/2 mt-3 w-64 bg-gradient-to-br from-brand-navy-light to-brand-navy border border-orange-500/30 rounded-xl shadow-2xl shadow-orange-500/10 overflow-hidden"
                  >
                    <div className="p-2">
                      <div className="px-3 py-2 mb-1">
                        <p className="text-[10px] uppercase tracking-wider text-orange-500 font-semibold flex items-center gap-1">
                          <Heart size={10} className="fill-current" />
                          Free Resources
                        </p>
                      </div>
                      <Link
                        href="/fit-bharat-mission#free-diet"
                        onClick={() => setIsFitBharatOpen(false)}
                        className="flex items-center gap-3 px-3 py-3 rounded-lg hover:bg-orange-500/10 transition-all group"
                      >
                        <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-green-500/20 to-green-600/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                          <Apple size={20} className="text-green-500" />
                        </div>
                        <div>
                          <p className="text-white font-medium text-sm">Free Diet Plan</p>
                          <p className="text-gray-400 text-xs">Nutrition guidance for all</p>
                        </div>
                      </Link>
                      <Link
                        href="/fit-bharat-mission#free-workout"
                        onClick={() => setIsFitBharatOpen(false)}
                        className="flex items-center gap-3 px-3 py-3 rounded-lg hover:bg-orange-500/10 transition-all group"
                      >
                        <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500/20 to-blue-600/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                          <Dumbbell size={20} className="text-blue-500" />
                        </div>
                        <div>
                          <p className="text-white font-medium text-sm">Free Workout Plan</p>
                          <p className="text-gray-400 text-xs">Train smart, stay fit</p>
                        </div>
                      </Link>
                    </div>
                    <div className="border-t border-white/10 p-2">
                      <Link
                        href="/fit-bharat-mission"
                        onClick={() => setIsFitBharatOpen(false)}
                        className="block px-3 py-2 text-center text-xs font-medium text-orange-500 hover:text-orange-400 transition-colors"
                      >
                        View All Plans & Resources →
                      </Link>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          <div className="hidden md:flex items-center gap-5">
            <button
              onClick={() => setIsGetAppOpen(true)}
              className="px-4 py-2 bg-gradient-to-r from-brand-blue to-blue-500 text-white rounded-xl font-semibold text-sm hover:shadow-lg hover:shadow-brand-blue/25 transition-all duration-300"
            >
              Get App
            </button>
            <button
              onClick={() => setIsLoginOpen(true)}
              className="text-gray-400 hover:text-white transition-colors"
              aria-label="Login"
            >
              <User size={22} />
            </button>
            <Link
              href="/cart"
              className="text-gray-400 hover:text-white transition-colors"
              aria-label="Shopping Cart"
            >
              <ShoppingCart size={22} />
            </Link>
          </div>

          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-2 rounded-xl border border-white/[0.08] text-white/80 hover:text-white transition-all"
            style={{ background: 'linear-gradient(135deg, rgba(255,255,255,0.04) 0%, rgba(255,255,255,0.01) 100%)' }}
            aria-label="Toggle menu"
          >
            {isOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-brand-navy/90 backdrop-blur-2xl border-t border-white/[0.06]"
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

              {/* Mobile Fit Bharat Mission */}
              <div className="border-t border-white/[0.06] pt-3 mt-2">
                <button
                  onClick={() => setIsMobileFitBharatOpen(!isMobileFitBharatOpen)}
                  className="flex items-center justify-between w-full py-2"
                >
                  <span className="bg-gradient-to-r from-orange-500 via-white to-green-500 bg-clip-text text-transparent font-bold">
                    Fit Bharat Mission
                  </span>
                  <ChevronDown
                    size={18}
                    className={`text-orange-500 transition-transform duration-200 ${isMobileFitBharatOpen ? 'rotate-180' : ''}`}
                  />
                </button>
                <AnimatePresence>
                  {isMobileFitBharatOpen && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="overflow-hidden"
                    >
                      <div className="pl-4 space-y-2 pb-2">
                        <Link
                          href="/fit-bharat-mission#free-diet"
                          onClick={() => setIsOpen(false)}
                          className="flex items-center gap-2 py-2 text-gray-300 hover:text-green-500 transition-colors"
                        >
                          <Apple size={16} className="text-green-500" />
                          Free Diet Plan
                        </Link>
                        <Link
                          href="/fit-bharat-mission#free-workout"
                          onClick={() => setIsOpen(false)}
                          className="flex items-center gap-2 py-2 text-gray-300 hover:text-blue-500 transition-colors"
                        >
                          <Dumbbell size={16} className="text-blue-500" />
                          Free Workout Plan
                        </Link>
                        <Link
                          href="/fit-bharat-mission"
                          onClick={() => setIsOpen(false)}
                          className="flex items-center gap-2 py-2 text-orange-500 hover:text-orange-400 transition-colors text-sm"
                        >
                          View All →
                        </Link>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <button
                onClick={() => {
                  setIsOpen(false);
                  setIsLoginOpen(true);
                }}
                className="block w-full text-left text-gray-300 hover:text-white transition-colors py-2.5 px-3 rounded-xl hover:bg-white/[0.04] text-sm font-medium"
              >
                Login
              </button>
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
