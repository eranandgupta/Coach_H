'use client';

import { motion } from 'framer-motion';
import { ReactNode } from 'react';

interface ButtonProps {
  children: ReactNode;
  onClick?: () => void;
  variant?: 'primary' | 'secondary' | 'outline';
  className?: string;
  type?: 'button' | 'submit' | 'reset';
  disabled?: boolean;
}

export default function Button({
  children,
  onClick,
  variant = 'primary',
  className = '',
  type = 'button',
  disabled = false,
}: ButtonProps) {
  const baseStyles =
    'px-6 py-3 rounded-lg font-semibold transition-all duration-300 relative overflow-hidden inline-flex items-center justify-center';

  const variants = {
    primary:
      'bg-brand-blue text-white hover:bg-brand-blue-dark shadow-lg hover:shadow-[0_8px_24px_rgba(23,95,255,0.4)] hover:-translate-y-0.5',
    secondary:
      'bg-brand-navy-light text-white border border-brand-navy-light/50 hover:border-brand-blue/50 hover:shadow-[0_8px_24px_rgba(23,95,255,0.2)] hover:-translate-y-0.5',
    outline:
      'bg-transparent text-brand-blue border-2 border-brand-blue hover:bg-brand-blue/10 hover:shadow-[0_8px_24px_rgba(23,95,255,0.3)] hover:-translate-y-0.5',
  };

  return (
    <motion.button
      whileHover={{ scale: disabled ? 1 : 1.02 }}
      whileTap={{ scale: disabled ? 1 : 0.98 }}
      onClick={onClick}
      type={type}
      disabled={disabled}
      className={`${baseStyles} ${variants[variant]} ${className} ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
    >
      {children}
    </motion.button>
  );
}
