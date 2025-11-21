'use client';

import { motion } from 'framer-motion';
import Button from './Button';
import { Check, Crown, Sparkles } from 'lucide-react';

interface PlanCardProps {
  id: number;
  title: string;
  duration: string;
  price: string;
  priceValue: number;
  description: string;
  features: string[];
  popular?: boolean;
  onAddToCart?: (plan: {
    id: number;
    name: string;
    price: number;
    duration: string;
    features: string[];
  }) => void;
}

export default function PlanCard({
  id,
  title,
  duration,
  price,
  priceValue,
  description,
  features,
  popular = false,
  onAddToCart,
}: PlanCardProps) {
  const handleAddToCart = () => {
    if (onAddToCart) {
      onAddToCart({
        id,
        name: title,
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
      className={`relative rounded-xl overflow-hidden group ${
        popular ? 'shadow-2xl shadow-brand-gold/20' : 'shadow-xl shadow-black/30'
      }`}
    >
      {/* Animated gradient border for popular plan */}
      {popular && (
        <>
          <div className="absolute inset-0 bg-gradient-to-r from-brand-gold via-yellow-400 to-brand-gold bg-[length:200%_100%] animate-shimmer" />
          <div className="absolute inset-[2px] bg-brand-navy rounded-xl" />
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

      <div
        className={`relative p-4 md:p-5 h-full flex flex-col ${
          popular
            ? 'bg-gradient-to-br from-[#1a2332] via-brand-navy to-[#0f1419]'
            : 'bg-gradient-to-br from-brand-navy-light/80 to-brand-navy/60 backdrop-blur-sm'
        } border ${
          popular ? 'border-transparent' : 'border-white/5'
        }`}
      >
        {/* Background decorative elements */}
        <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-brand-gold/5 to-transparent rounded-full blur-2xl" />
        <div className="absolute bottom-0 left-0 w-28 h-28 bg-gradient-to-tr from-brand-blue/5 to-transparent rounded-full blur-2xl" />

        {/* Crown icon for popular */}
        {popular && (
          <div className="absolute top-4 right-4 text-brand-gold opacity-15 group-hover:opacity-30 transition-opacity">
            <Crown size={32} />
          </div>
        )}

        {/* Content */}
        <div className="relative z-10 flex flex-col h-full">
          {/* Header */}
          <div className={`mb-4 ${popular ? 'pt-4' : ''}`}>
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
          <motion.div
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Button
              variant={popular ? 'primary' : 'secondary'}
              className={`w-full justify-center text-sm font-semibold py-2.5 rounded-lg transition-all duration-300 ${
                popular
                  ? 'bg-gradient-to-r from-brand-gold via-yellow-400 to-brand-gold hover:shadow-lg hover:shadow-brand-gold/30 text-brand-navy'
                  : 'bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 text-white'
              }`}
              onClick={handleAddToCart}
            >
              {popular ? 'Get Started' : 'Get Started'}
            </Button>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}
