'use client';

import { useState, useEffect, ReactNode } from 'react';
import { Sparkles, Youtube, Instagram, Gift, Tag } from 'lucide-react';

interface PromoCode {
  code: string;
  discountType: string;
  discountValue: string;
  description: string | null;
  applicablePlans: string | null;
}

export default function AnnouncementBar() {
  const [promoMessages, setPromoMessages] = useState<{ icon: ReactNode; text: ReactNode }[]>([]);

  useEffect(() => {
    fetch('/api/promo-codes/active')
      .then((res) => res.json())
      .then((data) => {
        const promos: PromoCode[] = data.promoCodes || [];
        const msgs = promos.map((promo) => {
          let planInfo = '';
          if (promo.applicablePlans) {
            try {
              const plans = JSON.parse(promo.applicablePlans);
              if (plans.length > 0) planInfo = ` on ${plans.join(', ')} Plan`;
            } catch {}
          }
          const discountText =
            promo.discountType === 'percentage'
              ? `${promo.discountValue}% OFF`
              : `₹${promo.discountValue} OFF`;

          return {
            icon: <Tag className="w-3 h-3 text-brand-gold" />,
            text: (
              <>
                {promo.description ? (
                  <span className="font-bold text-brand-gold">{promo.description} </span>
                ) : null}
                Use Coupon:{' '}
                <span className="font-bold bg-brand-gold/20 text-brand-gold px-1.5 py-0.5 rounded border border-brand-gold/30">
                  {promo.code}
                </span>{' '}
                - Get <span className="font-bold text-brand-gold">{discountText}</span>
                {planInfo}!
              </>
            ),
          };
        });
        setPromoMessages(msgs);
      })
      .catch(() => {});
  }, []);

  const staticMessages = [
    {
      icon: <Gift className="w-3 h-3 text-orange-400" />,
      text: (
        <>
          <span className="font-bold text-orange-400">FREE RhynoGrip Gear!</span> Join our <span className="font-bold bg-orange-500/20 text-orange-400 px-1.5 py-0.5 rounded border border-orange-400/30">6-Month</span> or <span className="font-bold bg-orange-500/20 text-orange-400 px-1.5 py-0.5 rounded border border-orange-400/30">12-Month</span> plan & get exclusive fitness gear!
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

  // Remove the old hardcoded coupon messages - promos now come from DB
  const messages = [...promoMessages, ...staticMessages];

  return (
    <div className="fixed top-0 left-0 right-0 z-[60] text-white py-1.5 px-3 overflow-hidden border-b border-white/[0.04] backdrop-blur-2xl" style={{ background: 'linear-gradient(90deg, rgba(7,10,21,0.95) 0%, rgba(10,15,31,0.9) 50%, rgba(7,10,21,0.95) 100%)' }}>
      {/* Subtle animated background effect */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-brand-blue/[0.04] to-transparent animate-shimmer"></div>

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
