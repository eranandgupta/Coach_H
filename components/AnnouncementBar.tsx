'use client';

import { useState, useEffect, ReactNode } from 'react';
import {
  Sparkles, Youtube, Instagram, Gift, Tag, Flame, Bell,
  Heart, Star, Zap, Trophy, Megaphone, MessageCircle,
} from 'lucide-react';

interface PromoCode {
  code: string;
  discountType: string;
  discountValue: string;
  description: string | null;
  applicablePlans: string | null;
}

interface DbAnnouncement {
  id: number;
  icon: string;
  text: string;
}

const iconMap: Record<string, React.ComponentType<any>> = {
  sparkles: Sparkles,
  gift: Gift,
  tag: Tag,
  flame: Flame,
  youtube: Youtube,
  instagram: Instagram,
  bell: Bell,
  heart: Heart,
  star: Star,
  zap: Zap,
  trophy: Trophy,
  megaphone: Megaphone,
  message: MessageCircle,
};

const iconColorMap: Record<string, string> = {
  sparkles: 'text-brand-gold',
  gift: 'text-orange-400',
  tag: 'text-brand-gold',
  flame: 'text-orange-400',
  youtube: 'text-red-500',
  instagram: 'text-pink-500',
  bell: 'text-yellow-400',
  heart: 'text-red-400',
  star: 'text-yellow-400',
  zap: 'text-yellow-300',
  trophy: 'text-brand-gold',
  megaphone: 'text-blue-400',
  message: 'text-green-400',
};

export default function AnnouncementBar() {
  const [promoMessages, setPromoMessages] = useState<{ icon: ReactNode; text: ReactNode }[]>([]);
  const [dbMessages, setDbMessages] = useState<{ icon: ReactNode; text: ReactNode }[]>([]);
  const [speed, setSpeed] = useState(40);

  useEffect(() => {
    // Fetch promo codes
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

    // Fetch DB announcement messages + speed
    fetch('/api/announcements/active')
      .then((res) => res.json())
      .then((data) => {
        const msgs: DbAnnouncement[] = data.messages || [];
        setSpeed(parseInt(data.marqueeSpeed) || 40);
        setDbMessages(
          msgs.map((msg) => {
            const IconComp = iconMap[msg.icon] || Sparkles;
            const colorClass = iconColorMap[msg.icon] || 'text-brand-gold';
            return {
              icon: <IconComp className={`w-3 h-3 ${colorClass}`} />,
              text: <>{msg.text}</>,
            };
          })
        );
      })
      .catch(() => {});
  }, []);

  const messages = [...promoMessages, ...dbMessages];

  if (messages.length === 0) return null;

  return (
    <div className="fixed top-0 left-0 right-0 z-[60] text-white py-1.5 px-3 overflow-hidden border-b border-white/[0.04]" style={{ background: 'linear-gradient(90deg, rgba(7,10,21,0.95) 0%, rgba(10,15,31,0.9) 50%, rgba(7,10,21,0.95) 100%)' }}>
      {/* Subtle animated background effect */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-brand-blue/[0.04] to-transparent animate-shimmer"></div>

      <div className="relative z-10 flex items-center">
        {/* Running text container */}
        <div className="flex-1 overflow-hidden">
          <div
            className="flex whitespace-nowrap hover:[animation-play-state:paused]"
            style={{ animation: `marquee ${speed}s linear infinite` }}
          >
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
