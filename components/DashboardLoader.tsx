'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';

export default function DashboardLoader() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-brand-navy via-brand-navy-light to-brand-navy flex items-center justify-center relative overflow-hidden">
      {/* Subtle ambient glow */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.05, 0.12, 0.05],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-brand-blue rounded-full blur-[120px]"
        />
      </div>

      {/* Loading content */}
      <div className="relative z-10 text-center flex flex-col items-center">
        {/* Logo with pulse ring animation */}
        <div className="relative mb-8">
          {/* Outer rotating ring */}
          <motion.div
            animate={{ rotate: 360 }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "linear"
            }}
            className="absolute inset-[-12px] rounded-full"
            style={{
              background: 'conic-gradient(from 0deg, transparent 0%, rgba(23,95,255,0.5) 30%, transparent 60%)',
            }}
          />
          {/* Inner glow ring */}
          <motion.div
            animate={{
              boxShadow: [
                '0 0 20px rgba(23,95,255,0.2), 0 0 40px rgba(23,95,255,0.1)',
                '0 0 30px rgba(23,95,255,0.4), 0 0 60px rgba(23,95,255,0.2)',
                '0 0 20px rgba(23,95,255,0.2), 0 0 40px rgba(23,95,255,0.1)',
              ],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            className="absolute inset-[-4px] rounded-full border border-brand-blue/30"
          />
          {/* Logo container */}
          <motion.div
            animate={{
              scale: [1, 1.05, 1],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            className="relative w-24 h-24 rounded-full bg-brand-navy border border-white/10 flex items-center justify-center overflow-hidden"
          >
            <Image
              src="/logo.png"
              alt="Coach Himanshu"
              width={80}
              height={80}
              className="object-contain"
              priority
            />
          </motion.div>
        </div>

        {/* Loading text */}
        <motion.div
          animate={{
            opacity: [0.6, 1, 0.6],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        >
          <h2 className="text-xl font-semibold text-white mb-1 tracking-wide">
            Loading Dashboard
          </h2>
          <p className="text-gray-500 text-sm">
            Preparing your fitness journey...
          </p>
        </motion.div>

        {/* Animated progress bar */}
        <div className="mt-6 w-48 h-[2px] bg-white/5 rounded-full overflow-hidden">
          <motion.div
            animate={{
              x: ['-100%', '100%'],
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="h-full w-1/2 bg-gradient-to-r from-transparent via-brand-blue to-transparent rounded-full"
          />
        </div>
      </div>
    </div>
  );
}
