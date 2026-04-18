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
    'px-6 py-3 rounded-xl font-semibold transition-all duration-300 relative overflow-hidden inline-flex items-center justify-center';

  const variants = {
    primary:
      'bg-gradient-to-r from-brand-blue to-blue-500 text-white shadow-lg shadow-brand-blue/25 hover:shadow-[0_8px_30px_rgba(23,95,255,0.45)] hover:-translate-y-0.5',
    secondary:
      'btn-glass text-white hover:-translate-y-0.5',
    outline:
      'bg-transparent text-brand-blue border border-brand-blue/40 hover:bg-brand-blue/10 hover:border-brand-blue/60 hover:shadow-[0_8px_30px_rgba(23,95,255,0.2)] hover:-translate-y-0.5 backdrop-blur-sm',
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
