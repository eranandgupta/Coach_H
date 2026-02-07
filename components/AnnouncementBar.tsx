'use client';

import { Sparkles, Youtube, Instagram, Gift, Heart } from 'lucide-react';

export default function AnnouncementBar() {
  const messages = [
    {
      icon: <Heart className="w-3 h-3 text-pink-500" />,
      text: (
        <>
          <span className="font-bold text-pink-400">Couple Offer!</span> Use <span className="font-bold bg-pink-500/20 text-pink-400 px-1.5 py-0.5 rounded border border-pink-400/30">VALENTINE06</span> for <span className="font-bold text-pink-400">15% OFF</span> (6M) | <span className="font-bold bg-pink-500/20 text-pink-400 px-1.5 py-0.5 rounded border border-pink-400/30">VALENTINE12</span> for <span className="font-bold text-pink-400">25% OFF</span> (12M)
        </>
      )
    },
    {
      icon: <Gift className="w-3 h-3 text-orange-400" />,
      text: (
        <>
          <span className="font-bold text-orange-400">FREE RhynoGrip Gear!</span> Join our <span className="font-bold bg-orange-500/20 text-orange-400 px-1.5 py-0.5 rounded border border-orange-400/30">6-Month</span> or <span className="font-bold bg-orange-500/20 text-orange-400 px-1.5 py-0.5 rounded border border-orange-400/30">12-Month</span> plan & get exclusive fitness gear!
        </>
      )
    },
    {
      icon: <Sparkles className="w-3 h-3 text-brand-gold" />,
      text: (
        <>
          Use Coupon: <span className="font-bold bg-brand-gold/20 text-brand-gold px-1.5 py-0.5 rounded border border-brand-gold/30">JOINSTRENGTH</span> - Get <span className="font-bold text-brand-gold">5% OFF</span> on 6-Month Plan!
        </>
      )
    },
    {
      icon: <Sparkles className="w-3 h-3 text-green-400" />,
      text: (
        <>
          Use Coupon: <span className="font-bold bg-green-500/20 text-green-400 px-1.5 py-0.5 rounded border border-green-400/30">JOINMASTERY</span> - Get <span className="font-bold text-green-400">10% OFF</span> on 12-Month Plan!
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
          <div className="flex animate-marquee-slow whitespace-nowrap">
            {/* First set of messages */}
            {messages.map((message, index) => (
              <div key={index} className="inline-flex items-center gap-1.5 mx-4 md:mx-8">
                {message.icon}
                <p className="text-[10px] md:text-xs font-semibold">
                  {message.text}
                </p>
              </div>
            ))}
            {/* Duplicate set for seamless loop */}
            {messages.map((message, index) => (
              <div key={`dup-${index}`} className="inline-flex items-center gap-1.5 mx-4 md:mx-8">
                {message.icon}
                <p className="text-[10px] md:text-xs font-semibold">
                  {message.text}
                </p>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
