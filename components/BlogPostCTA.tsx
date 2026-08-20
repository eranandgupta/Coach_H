'use client';

import Link from 'next/link';
import { ArrowLeft, ArrowRight } from 'lucide-react';

/** WhatsApp chat for the free-assessment CTA (same number used across the site). */
const WHATSAPP_ASSESSMENT =
  'https://wa.me/917303484648?text=Hi%20Coach%20Himanshu!%20I%20want%20my%20free%20fitness%20assessment.';

export function BackToBlogButton() {
  return (
    <Link
      href="/blog"
      className="px-6 py-3 rounded-xl font-semibold transition-all duration-300 relative overflow-hidden inline-flex items-center justify-center bg-transparent text-brand-blue border border-brand-blue/40 hover:bg-brand-blue/10 hover:border-brand-blue/60 hover:shadow-[0_8px_30px_rgba(23,95,255,0.2)] hover:-translate-y-0.5 gap-2"
    >
      <ArrowLeft size={18} />
      <span>Back to Blog</span>
    </Link>
  );
}

export function ExplorePlansButton() {
  return (
    <Link
      href="/#plans"
      className="px-6 py-3 rounded-xl font-semibold transition-all duration-300 relative overflow-hidden inline-flex items-center justify-center bg-gradient-to-r from-brand-blue to-blue-500 text-white shadow-lg shadow-brand-blue/25 hover:shadow-[0_8px_30px_rgba(23,95,255,0.45)] hover:-translate-y-0.5 gap-2"
    >
      <span>Explore Plans</span>
    </Link>
  );
}

export function StickyCtaBanner() {
  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 bg-gradient-to-r from-brand-navy via-brand-navy-light to-brand-navy border-t border-brand-blue/20 px-3 py-2.5 md:py-3 shadow-[0_-4px_20px_rgba(0,0,0,0.3)]">
      <div className="max-w-4xl mx-auto flex items-center justify-between gap-3">
        <div className="flex items-center gap-2 min-w-0">
          <div className="hidden sm:flex h-8 w-8 rounded-full bg-brand-blue/20 items-center justify-center flex-shrink-0">
            <ArrowRight className="w-4 h-4 text-brand-blue" />
          </div>
          <p className="text-white text-xs md:text-sm font-medium truncate">
            Get your <span className="text-brand-gold">free fitness assessment</span> today
          </p>
        </div>
        <div className="flex items-center gap-2 flex-shrink-0">
          <a
            href={WHATSAPP_ASSESSMENT}
            target="_blank"
            rel="noopener noreferrer"
            className="px-3 md:px-5 py-1.5 md:py-2 text-xs md:text-sm rounded-xl font-semibold transition-all duration-300 relative overflow-hidden inline-flex items-center justify-center bg-gradient-to-r from-brand-blue to-blue-500 text-white shadow-lg shadow-brand-blue/25 hover:shadow-[0_8px_30px_rgba(23,95,255,0.45)] hover:-translate-y-0.5 whitespace-nowrap"
          >
            Free Assessment
          </a>
        </div>
      </div>
    </div>
  );
}
