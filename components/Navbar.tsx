'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';
import { Menu, X, ShoppingCart, User } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import LoginModal from './LoginModal';
import GetAppModal from './GetAppModal';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isGetAppOpen, setIsGetAppOpen] = useState(false);

  const navLinks = [
    { href: '/', label: 'Home' },
    { href: '/about', label: 'About' },
    { href: '/#plans', label: 'Plans' },
    { href: '/blog', label: 'Blog' },
    { href: 'https://rhynogrip.com', label: 'Store' },
  ];

  return (
    <>
      <nav className="fixed top-[24px] left-0 right-0 z-50 bg-brand-navy/80 backdrop-blur-md border-b border-brand-navy-light/20">
        <div className="max-w-7xl mx-auto px-6 py-0">
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
              className="object-contain"
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
          </div>

          <div className="hidden md:flex items-center gap-6">
            <button
              onClick={() => setIsGetAppOpen(true)}
              className="px-4 py-2 bg-brand-blue text-white rounded-lg font-semibold text-sm hover:bg-blue-600 transition-all duration-300"
            >
              Get App
            </button>
            <button
              onClick={() => setIsLoginOpen(true)}
              className="text-gray-300 hover:text-white transition-colors"
              aria-label="Login"
            >
              <User size={24} />
            </button>
            <Link
              href="/cart"
              className="text-gray-300 hover:text-white transition-colors"
              aria-label="Shopping Cart"
            >
              <ShoppingCart size={24} />
            </Link>
          </div>

          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden text-white hover:text-brand-blue transition-colors"
            aria-label="Toggle menu"
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-brand-navy-light border-t border-brand-navy-light/20"
          >
            <div className="px-6 py-4 space-y-3">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="block text-gray-300 hover:text-white transition-colors py-2"
                  onClick={() => setIsOpen(false)}
                >
                  {link.label}
                </Link>
              ))}
              <button
                onClick={() => {
                  setIsOpen(false);
                  setIsLoginOpen(true);
                }}
                className="block w-full text-left text-gray-300 hover:text-white transition-colors py-2"
              >
                Login
              </button>
              <button
                onClick={() => {
                  setIsOpen(false);
                  setIsGetAppOpen(true);
                }}
                className="block w-full bg-brand-blue text-white px-4 py-2 rounded-lg font-semibold text-center hover:bg-blue-600 transition-all duration-300 mt-4"
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
