'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

interface VideoModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  videoUrl?: string;
}

export default function VideoModal({
  isOpen,
  onClose,
  title,
  videoUrl,
}: VideoModalProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/80 z-50"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="fixed inset-4 md:inset-auto md:left-1/2 md:top-1/2 md:-translate-x-1/2 md:-translate-y-1/2 md:w-full md:max-w-3xl z-50"
          >
            <div className="bg-[#1A1A1A] rounded-xl border border-[#2A2A2A] overflow-hidden h-full md:h-auto">
              <div className="flex items-center justify-between p-4 border-b border-[#2A2A2A]">
                <h3 className="text-white font-bold text-lg">{title}</h3>
                <button
                  onClick={onClose}
                  className="text-[#B3B3B3] hover:text-white transition-colors"
                >
                  <X size={24} />
                </button>
              </div>

              <div className="aspect-video bg-[#0D0D0D] flex items-center justify-center">
                {videoUrl ? (
                  <iframe
                    src={videoUrl}
                    className="w-full h-full"
                    allowFullScreen
                  />
                ) : (
                  <div className="text-center">
                    <div className="text-[#E50914] text-6xl mb-4">▶</div>
                    <p className="text-[#B3B3B3]">
                      Video placeholder - Integration pending
                    </p>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
