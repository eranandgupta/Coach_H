'use client';

import { motion } from 'framer-motion';
import Button from './Button';
import { Check, Crown, Sparkles, Heart, Home, MessageCircle, Activity, Users } from 'lucide-react';

interface PlanCardProps {
  id: number;
  dbName?: string;
  title: string;
  duration: string;
  price: string;
  priceValue: number;
  description: string;
  features: string[];
  popular?: boolean;
  couple?: boolean;
  homeWorkout?: boolean;
  rehabilitation?: boolean;
  liveGroup?: boolean;
  liveOneOnOne?: boolean;
  whatsappOnly?: boolean;
  onAddToCart?: (plan: {
    id: number;
    name: string;
    dbName?: string;
    price: number;
    duration: string;
    features: string[];
  }) => void;
}

export default function PlanCard({
  id,
  dbName,
  title,
  duration,
  price,
  priceValue,
  description,
  features,
  popular = false,
  couple = false,
  homeWorkout = false,
  rehabilitation = false,
  liveGroup = false,
  liveOneOnOne = false,
  whatsappOnly = false,
  onAddToCart,
}: PlanCardProps) {
  const handleAddToCart = () => {
    if (onAddToCart) {
      onAddToCart({
        id,
        name: title,
        dbName,
        price: priceValue,
        duration,
        features,
      });
    }
  };
  return (
    <motion.div
      whileHover={{ scale: 1.02, y: -6 }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      className={`relative rounded-2xl overflow-hidden group h-full ${
        popular ? 'shadow-2xl shadow-brand-gold/20' : couple ? 'shadow-2xl shadow-pink-500/20' : homeWorkout ? 'shadow-2xl shadow-emerald-500/20' : rehabilitation ? 'shadow-2xl shadow-cyan-500/20' : liveGroup ? 'shadow-2xl shadow-violet-500/20' : 'shadow-xl shadow-black/30'
      }`}
    >
      {/* Animated gradient border for popular plan */}
      {popular && (
        <>
          <div className="absolute inset-0 bg-gradient-to-r from-brand-gold via-yellow-400 to-brand-gold bg-[length:200%_100%] animate-shimmer" />
          <div className="absolute inset-[1px] bg-brand-navy rounded-2xl" />
        </>
      )}

      {/* Animated gradient border for couple plan */}
      {couple && (
        <>
          <div className="absolute inset-0 bg-gradient-to-r from-pink-500 via-rose-400 to-pink-500 bg-[length:200%_100%] animate-shimmer" />
          <div className="absolute inset-[1px] bg-brand-navy rounded-2xl" />
        </>
      )}

      {/* Animated gradient border for home workout plan */}
      {homeWorkout && (
        <>
          <div className="absolute inset-0 bg-gradient-to-r from-emerald-500 via-green-400 to-emerald-500 bg-[length:200%_100%] animate-shimmer" />
          <div className="absolute inset-[1px] bg-brand-navy rounded-2xl" />
        </>
      )}

      {/* Animated gradient border for rehabilitation plan */}
      {rehabilitation && (
        <>
          <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 via-blue-400 to-cyan-500 bg-[length:200%_100%] animate-shimmer" />
          <div className="absolute inset-[1px] bg-brand-navy rounded-2xl" />
        </>
      )}

      {/* Animated gradient border for live group plan */}
      {liveGroup && (
        <>
          <div className="absolute inset-0 bg-gradient-to-r from-violet-500 via-purple-400 to-violet-500 bg-[length:200%_100%] animate-shimmer" />
          <div className="absolute inset-[1px] bg-brand-navy rounded-2xl" />
        </>
      )}

      {/* Popular badge */}
      {popular && (
        <motion.div
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ type: 'spring', delay: 0.2 }}
          className="absolute top-0 left-1/2 -translate-x-1/2 z-10"
        >
          <div className="bg-gradient-to-r from-brand-gold via-yellow-400 to-brand-gold px-4 py-1 rounded-b-lg shadow-lg">
            <div className="flex items-center gap-1.5">
              <Sparkles size={12} className="text-brand-navy" />
              <span className="text-brand-navy font-bold text-xs uppercase tracking-wider">
                Popular
              </span>
              <Sparkles size={12} className="text-brand-navy" />
            </div>
          </div>
        </motion.div>
      )}

      {/* Couple badge */}
      {couple && (
        <motion.div
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ type: 'spring', delay: 0.2 }}
          className="absolute top-0 left-1/2 -translate-x-1/2 z-10"
        >
          <div className="bg-gradient-to-r from-pink-500 via-rose-400 to-pink-500 px-4 py-1 rounded-b-lg shadow-lg">
            <div className="flex items-center gap-1.5">
              <Heart size={12} className="text-white fill-white" />
              <span className="text-white font-bold text-xs uppercase tracking-wider">
                Couple
              </span>
              <Heart size={12} className="text-white fill-white" />
            </div>
          </div>
        </motion.div>
      )}


      {/* Rehabilitation badge */}
      {rehabilitation && (
        <motion.div
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ type: 'spring', delay: 0.2 }}
          className="absolute top-0 left-1/2 -translate-x-1/2 z-10"
        >
          <div className="bg-gradient-to-r from-cyan-500 via-blue-400 to-cyan-500 px-4 py-1 rounded-b-lg shadow-lg">
            <div className="flex items-center gap-1.5">
              <Activity size={12} className="text-white" />
              <span className="text-white font-bold text-xs uppercase tracking-wider">
                Rehabilitation
              </span>
              <Activity size={12} className="text-white" />
            </div>
          </div>
        </motion.div>
      )}

      {/* Live badge */}
      {liveGroup && (
        <motion.div
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ type: 'spring', delay: 0.2 }}
          className="absolute top-0 left-1/2 -translate-x-1/2 z-10"
        >
          <div className="bg-gradient-to-r from-violet-500 via-purple-400 to-violet-500 px-4 py-1 rounded-b-lg shadow-lg">
            <div className="flex items-center gap-1.5">
              {liveOneOnOne ? <Crown size={12} className="text-white" /> : <Users size={12} className="text-white" />}
              <span className="text-white font-bold text-xs uppercase tracking-wider">
                {liveOneOnOne ? '1:1 Elite' : 'Live Group'}
              </span>
              {liveOneOnOne ? <Crown size={12} className="text-white" /> : <Users size={12} className="text-white" />}
            </div>
          </div>
        </motion.div>
      )}

      <div
        className={`relative p-5 md:p-6 h-full flex flex-col backdrop-blur-xl ${
          popular
            ? 'bg-gradient-to-br from-[#1a2332]/90 via-brand-navy/80 to-[#0f1419]/90'
            : couple
            ? 'bg-gradient-to-br from-[#2a1a2e]/90 via-brand-navy/80 to-[#1a0f1f]/90'
            : homeWorkout
            ? 'bg-gradient-to-br from-[#1a2e1f]/90 via-brand-navy/80 to-[#0f1a14]/90'
            : rehabilitation
            ? 'bg-gradient-to-br from-[#1a2a2e]/90 via-brand-navy/80 to-[#0f1519]/90'
            : liveGroup
            ? 'bg-gradient-to-br from-[#251a2e]/90 via-brand-navy/80 to-[#170f1f]/90'
            : 'glass-card'
        } ${
          popular || couple || homeWorkout || rehabilitation || liveGroup ? 'border-transparent' : ''
        }`}
        style={!(popular || couple || homeWorkout || rehabilitation || liveGroup) ? {
          background: 'linear-gradient(135deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.02) 50%, rgba(255,255,255,0.04) 100%)',
          boxShadow: '0 8px 32px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.05)',
          border: '1px solid rgba(255,255,255,0.08)',
        } : undefined}
      >
        {/* Background decorative elements */}
        <div className={`absolute top-0 right-0 w-24 h-24 bg-gradient-to-br ${couple ? 'from-pink-500/5' : homeWorkout ? 'from-emerald-500/5' : rehabilitation ? 'from-cyan-500/5' : liveGroup ? 'from-violet-500/5' : 'from-brand-gold/5'} to-transparent rounded-full blur-2xl`} />
        <div className={`absolute bottom-0 left-0 w-28 h-28 bg-gradient-to-tr ${couple ? 'from-rose-500/5' : homeWorkout ? 'from-green-500/5' : rehabilitation ? 'from-blue-500/5' : liveGroup ? 'from-purple-500/5' : 'from-brand-blue/5'} to-transparent rounded-full blur-2xl`} />

        {/* Crown icon for popular */}
        {popular && (
          <div className="absolute top-4 right-4 text-brand-gold opacity-15 group-hover:opacity-30 transition-opacity">
            <Crown size={32} />
          </div>
        )}

        {/* Heart icon for couple */}
        {couple && (
          <div className="absolute top-4 right-4 text-pink-400 opacity-15 group-hover:opacity-30 transition-opacity">
            <Heart size={32} />
          </div>
        )}

        {/* Home icon for home workout */}
        {homeWorkout && (
          <div className="absolute top-4 right-4 text-emerald-400 opacity-15 group-hover:opacity-30 transition-opacity">
            <Home size={32} />
          </div>
        )}

        {/* Activity icon for rehabilitation */}
        {rehabilitation && (
          <div className="absolute top-4 right-4 text-cyan-400 opacity-15 group-hover:opacity-30 transition-opacity">
            <Activity size={32} />
          </div>
        )}

        {/* Icon for live plans */}
        {liveGroup && (
          <div className="absolute top-4 right-4 text-violet-400 opacity-15 group-hover:opacity-30 transition-opacity">
            {liveOneOnOne ? <Crown size={32} /> : <Users size={32} />}
          </div>
        )}

        {/* Content */}
        <div className="relative z-10 flex flex-col h-full">
          {/* Header */}
          <div className={`mb-4 ${popular || couple || homeWorkout || rehabilitation || liveGroup ? 'pt-4' : ''}`}>
            <h3 className="text-white text-lg md:text-xl font-bold mb-1 tracking-tight">
              {title}
            </h3>
            <p className="text-gray-400 text-xs mb-3">{description}</p>

            {/* Price */}
            <div className="mb-3">
              <div className="flex items-baseline gap-1.5 mb-1">
                <span className={`text-3xl md:text-4xl font-bold bg-gradient-to-r ${
                  popular
                    ? 'from-brand-gold via-yellow-300 to-brand-gold'
                    : couple
                    ? 'from-pink-400 via-rose-300 to-pink-400'
                    : homeWorkout
                    ? 'from-emerald-400 via-green-300 to-emerald-400'
                    : rehabilitation
                    ? 'from-cyan-400 via-blue-300 to-cyan-400'
                    : liveGroup
                    ? 'from-violet-400 via-purple-300 to-violet-400'
                    : 'from-gray-200 to-gray-400'
                } bg-clip-text text-transparent`}>
                  {price}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-gray-400 text-xs">
                  / {duration.toLowerCase()}
                </span>
                {popular && (
                  <span className="px-1.5 py-0.5 bg-brand-gold/10 text-brand-gold text-xs rounded-full border border-brand-gold/20">
                    Best Value
                  </span>
                )}
                {couple && (
                  <span className="px-1.5 py-0.5 bg-pink-500/10 text-pink-400 text-xs rounded-full border border-pink-400/20">
                    For 2
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Features */}
          <div className="flex-1 mb-4">
            <ul className="space-y-2">
              {features.map((feature, index) => (
                <motion.li
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="flex items-start gap-2 group/item"
                >
                  <div className={`flex-shrink-0 w-4 h-4 rounded-full flex items-center justify-center mt-0.5 ${
                    popular
                      ? 'bg-brand-gold/20 text-brand-gold border border-brand-gold/30'
                      : couple
                      ? 'bg-pink-500/20 text-pink-400 border border-pink-400/30'
                      : homeWorkout
                      ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-400/30'
                      : rehabilitation
                      ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-400/30'
                      : liveGroup
                      ? 'bg-violet-500/20 text-violet-400 border border-violet-400/30'
                      : 'bg-brand-green/20 text-brand-green border border-brand-green/30'
                  }`}>
                    <Check size={10} className="font-bold" />
                  </div>
                  <span className="text-gray-300 text-xs leading-snug group-hover/item:text-white transition-colors">
                    {feature}
                  </span>
                </motion.li>
              ))}
            </ul>
          </div>

          {/* CTA Button */}
          <div className="space-y-2">
            {whatsappOnly ? (
              <motion.a
                href={`https://wa.me/917303484648?text=${encodeURIComponent(`Hi, I want to know more about the ${title}`)}`}
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full flex items-center justify-center gap-2 text-sm font-semibold py-2.5 rounded-lg bg-gradient-to-r from-violet-500 via-purple-400 to-violet-500 hover:shadow-lg hover:shadow-violet-500/30 text-white transition-all duration-300 cursor-pointer"
              >
                <MessageCircle size={16} />
                Connect on WhatsApp
              </motion.a>
            ) : (
              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Button
                  variant={popular || couple || homeWorkout || rehabilitation ? 'primary' : 'secondary'}
                  className={`w-full justify-center text-sm font-semibold py-2.5 rounded-lg transition-all duration-300 ${
                    popular
                      ? 'bg-gradient-to-r from-brand-gold via-yellow-400 to-brand-gold hover:shadow-lg hover:shadow-brand-gold/30 text-brand-navy'
                      : couple
                      ? 'bg-gradient-to-r from-pink-500 via-rose-400 to-pink-500 hover:shadow-lg hover:shadow-pink-500/30 text-white'
                      : homeWorkout
                      ? 'bg-gradient-to-r from-emerald-500 via-green-400 to-emerald-500 hover:shadow-lg hover:shadow-emerald-500/30 text-white'
                      : rehabilitation
                      ? 'bg-gradient-to-r from-cyan-500 via-blue-400 to-cyan-500 hover:shadow-lg hover:shadow-cyan-500/30 text-white'
                      : 'bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 text-white'
                  }`}
                  onClick={handleAddToCart}
                >
                  {couple ? 'Get Started Together' : 'Get Started'}
                </Button>
              </motion.div>
            )}

          </div>
        </div>
      </div>
    </motion.div>
  );
}
