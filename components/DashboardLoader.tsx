'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';

export default function DashboardLoader() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-brand-navy via-brand-navy-light to-brand-navy flex items-center justify-center relative overflow-hidden">
      {/* Ambient glow — radial gradient (NOT CSS blur, which Safari clips to a hard
          square inside overflow-hidden). Renders as a soft feathered halo everywhere. */}
      <motion.div
        aria-hidden
        animate={{
          opacity: [0.45, 0.8, 0.45],
          scale: [1, 1.08, 1],
        }}
        transition={{
          duration: 5,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[min(120vw,1000px)] h-[min(120vw,1000px)]"
        style={{
          background:
            'radial-gradient(circle at center, rgba(23,95,255,0.20) 0%, rgba(23,95,255,0.08) 32%, rgba(23,95,255,0.02) 55%, transparent 70%)',
        }}
      />

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
              src="https://ik.imagekit.io/oeagl0l4x/public/logo.png?tr=w-200,q-80,f-auto"
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
