'use client';

import { motion } from 'framer-motion';
import { Dumbbell, Activity } from 'lucide-react';

export default function DashboardLoader() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-brand-navy via-brand-navy-light to-brand-navy flex items-center justify-center relative overflow-hidden">
      {/* Animated background circles */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.1, 0.2, 0.1],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="absolute top-1/4 left-1/4 w-96 h-96 bg-brand-blue rounded-full blur-3xl"
        />
        <motion.div
          animate={{
            scale: [1, 1.3, 1],
            opacity: [0.1, 0.15, 0.1],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1
          }}
          className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-brand-gold rounded-full blur-3xl"
        />
      </div>

      {/* Loading content */}
      <div className="relative z-10 text-center">
        {/* Animated icons */}
        <div className="flex items-center justify-center gap-4 mb-8">
          <motion.div
            animate={{
              rotate: [0, 360],
              scale: [1, 1.1, 1],
            }}
            transition={{
              rotate: {
                duration: 2,
                repeat: Infinity,
                ease: "linear"
              },
              scale: {
                duration: 1,
                repeat: Infinity,
                ease: "easeInOut"
              }
            }}
            className="p-4 bg-brand-blue/20 rounded-full backdrop-blur-sm border border-brand-blue/30"
          >
            <Dumbbell className="w-8 h-8 text-brand-blue" />
          </motion.div>

          <motion.div
            animate={{
              y: [0, -10, 0],
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            className="p-4 bg-brand-gold/20 rounded-full backdrop-blur-sm border border-brand-gold/30"
          >
            <Activity className="w-8 h-8 text-brand-gold" />
          </motion.div>
        </div>

        {/* Spinner */}
        <motion.div
          animate={{ rotate: 360 }}
          transition={{
            duration: 1,
            repeat: Infinity,
            ease: "linear"
          }}
          className="w-16 h-16 border-4 border-brand-blue/30 border-t-brand-blue rounded-full mx-auto mb-6"
        />

        {/* Loading text with pulse animation */}
        <motion.div
          animate={{
            opacity: [0.5, 1, 0.5],
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        >
          <h2 className="text-2xl font-bold text-white mb-2">
            Loading Dashboard
          </h2>
          <p className="text-gray-400 text-sm">
            Preparing your fitness journey...
          </p>
        </motion.div>

        {/* Animated dots */}
        <div className="flex items-center justify-center gap-2 mt-6">
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              animate={{
                scale: [1, 1.5, 1],
                opacity: [0.3, 1, 0.3],
              }}
              transition={{
                duration: 1,
                repeat: Infinity,
                ease: "easeInOut",
                delay: i * 0.2,
              }}
              className="w-2 h-2 bg-brand-blue rounded-full"
            />
          ))}
        </div>
      </div>
    </div>
  );
}
