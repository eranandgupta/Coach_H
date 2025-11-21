'use client';

import { X, Sparkles, Youtube, Instagram } from 'lucide-react';
import { useState } from 'react';

export default function AnnouncementBar() {
  const [isVisible, setIsVisible] = useState(true);

  if (!isVisible) return null;

  const messages = [
    {
      icon: <Sparkles className="w-3 h-3 text-brand-gold" />,
      text: (
        <>
          Use Coupon: <span className="font-bold bg-brand-gold/20 text-brand-gold px-1.5 py-0.5 rounded border border-brand-gold/30">JOINCOACH10</span> - Get <span className="font-bold text-brand-gold">10% OFF</span> on All Plans!
        </>
      )
    },
    {
      icon: <Youtube className="w-3 h-3 text-red-500" />,
      text: (
        <>
          Subscribe on YouTube: <span className="font-bold text-red-400">Coach Himanshu Kataria</span> - Free Fitness Knowledge!
        </>
      )
    },
    {
      icon: <Instagram className="w-3 h-3 text-pink-500" />,
      text: (
        <>
          Follow on Instagram: <span className="font-bold text-pink-400">@coachhimanshusquad_</span> - Daily Fitness Tips!
        </>
      )
    }
  ];

  return (
    <div className="fixed top-0 left-0 right-0 z-[60] bg-gradient-to-r from-slate-900 via-brand-navy to-slate-900 text-white py-1 px-3 overflow-hidden border-b border-brand-gold/20">
      {/* Animated background effect */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-brand-gold/10 to-transparent animate-shimmer"></div>

      <div className="relative z-10 flex items-center">
        {/* Running text container */}
        <div className="flex-1 overflow-hidden">
          <div className="flex animate-marquee whitespace-nowrap">
            {/* First set of messages */}
            {messages.map((message, index) => (
              <div key={index} className="inline-flex items-center gap-1.5 mx-8">
                {message.icon}
                <p className="text-[10px] md:text-xs font-semibold">
                  {message.text}
                </p>
              </div>
            ))}
            {/* Duplicate set for seamless loop */}
            {messages.map((message, index) => (
              <div key={`dup-${index}`} className="inline-flex items-center gap-1.5 mx-8">
                {message.icon}
                <p className="text-[10px] md:text-xs font-semibold">
                  {message.text}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Close button */}
        <button
          onClick={() => setIsVisible(false)}
          className="ml-2 p-0.5 hover:bg-white/20 rounded-full transition-colors flex-shrink-0"
          aria-label="Close announcement"
        >
          <X className="w-3 h-3" />
        </button>
      </div>
    </div>
  );
}
