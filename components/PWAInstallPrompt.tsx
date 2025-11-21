'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Download, Share, Plus, MoreVertical } from 'lucide-react';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

export default function PWAInstallPrompt() {
  const [showPrompt, setShowPrompt] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [isAndroid, setIsAndroid] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);

  useEffect(() => {
    // Check if already installed (standalone mode)
    const standalone = window.matchMedia('(display-mode: standalone)').matches;
    setIsStandalone(standalone);

    // Detect iOS
    const iOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as any).MSStream;
    setIsIOS(iOS);

    // Detect Android
    const android = /Android/.test(navigator.userAgent);
    setIsAndroid(android);

    // Check if user has dismissed the prompt before
    const dismissed = localStorage.getItem('pwa-install-dismissed');
    const dismissedTime = dismissed ? parseInt(dismissed) : 0;
    const oneDayInMs = 24 * 60 * 60 * 1000;
    const shouldShowAgain = Date.now() - dismissedTime > oneDayInMs;

    // Show prompt if not installed and not recently dismissed
    if (!standalone && shouldShowAgain) {
      if (iOS || android) {
        // Delay showing the prompt
        setTimeout(() => setShowPrompt(true), 3000);
      }
    }

    // Listen for beforeinstallprompt event (Android/Desktop)
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      const promptEvent = e as BeforeInstallPromptEvent;
      setDeferredPrompt(promptEvent);
      if (shouldShowAgain) {
        setTimeout(() => setShowPrompt(true), 3000);
      }
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    // Listen for successful installation
    window.addEventListener('appinstalled', () => {
      console.log('PWA was installed');
      setShowPrompt(false);
      setDeferredPrompt(null);
    });

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      // Show the install prompt for Android/Desktop
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      console.log(`User response to install prompt: ${outcome}`);
      setDeferredPrompt(null);
      setShowPrompt(false);
    }
  };

  const handleDismiss = () => {
    setShowPrompt(false);
    localStorage.setItem('pwa-install-dismissed', Date.now().toString());
  };

  if (!showPrompt || isStandalone) return null;

  return (
    <AnimatePresence>
      {showPrompt && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          className="fixed bottom-0 left-0 right-0 z-50 p-4 md:bottom-4 md:left-auto md:right-4 md:max-w-md"
        >
          <div className="bg-gradient-to-br from-brand-navy-light to-brand-navy border border-brand-blue/30 rounded-2xl shadow-2xl overflow-hidden">
            {/* Close button */}
            <button
              onClick={handleDismiss}
              className="absolute top-3 right-3 text-gray-400 hover:text-white transition-colors z-10"
            >
              <X size={20} />
            </button>

            <div className="p-6">
              {/* Header */}
              <div className="flex items-center gap-4 mb-4">
                <div className="w-16 h-16 bg-gradient-to-br from-brand-blue to-purple-500 rounded-2xl flex items-center justify-center flex-shrink-0">
                  <Download size={32} className="text-white" />
                </div>
                <div>
                  <h3 className="text-white font-bold text-lg">Install App</h3>
                  <p className="text-gray-400 text-sm">Quick access anytime</p>
                </div>
              </div>

              {/* Content based on device */}
              {isIOS && (
                <div className="bg-white/5 rounded-xl p-4 mb-4">
                  <p className="text-white text-sm mb-3">
                    Install this app on your iPhone:
                  </p>
                  <ol className="space-y-2 text-sm text-gray-300">
                    <li className="flex items-start gap-2">
                      <span className="flex-shrink-0 w-5 h-5 bg-brand-blue/20 text-brand-blue rounded-full flex items-center justify-center text-xs font-bold">
                        1
                      </span>
                      <span>
                        Tap the <Share size={14} className="inline mx-1" /> share button at the bottom
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="flex-shrink-0 w-5 h-5 bg-brand-blue/20 text-brand-blue rounded-full flex items-center justify-center text-xs font-bold">
                        2
                      </span>
                      <span>
                        Scroll and tap "Add to Home Screen" <Plus size={14} className="inline mx-1" />
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="flex-shrink-0 w-5 h-5 bg-brand-blue/20 text-brand-blue rounded-full flex items-center justify-center text-xs font-bold">
                        3
                      </span>
                      <span>Tap "Add" to confirm</span>
                    </li>
                  </ol>
                </div>
              )}

              {isAndroid && !deferredPrompt && (
                <div className="bg-white/5 rounded-xl p-4 mb-4">
                  <p className="text-white text-sm mb-3">
                    Install this app on your Android:
                  </p>
                  <ol className="space-y-2 text-sm text-gray-300">
                    <li className="flex items-start gap-2">
                      <span className="flex-shrink-0 w-5 h-5 bg-brand-blue/20 text-brand-blue rounded-full flex items-center justify-center text-xs font-bold">
                        1
                      </span>
                      <span>
                        Tap the <MoreVertical size={14} className="inline mx-1" /> menu button
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="flex-shrink-0 w-5 h-5 bg-brand-blue/20 text-brand-blue rounded-full flex items-center justify-center text-xs font-bold">
                        2
                      </span>
                      <span>Tap "Install App" or "Add to Home Screen"</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="flex-shrink-0 w-5 h-5 bg-brand-blue/20 text-brand-blue rounded-full flex items-center justify-center text-xs font-bold">
                        3
                      </span>
                      <span>Follow the prompts to install</span>
                    </li>
                  </ol>
                </div>
              )}

              {deferredPrompt && (
                <div className="bg-white/5 rounded-xl p-4 mb-4">
                  <p className="text-gray-300 text-sm">
                    Get instant access to your fitness journey. Install now for:
                  </p>
                  <ul className="mt-3 space-y-2 text-sm text-gray-300">
                    <li className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 bg-brand-green rounded-full"></div>
                      Quick access from home screen
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 bg-brand-green rounded-full"></div>
                      Offline functionality
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 bg-brand-green rounded-full"></div>
                      Push notifications for updates
                    </li>
                  </ul>
                </div>
              )}

              {/* Action buttons */}
              <div className="flex gap-3">
                {deferredPrompt && (
                  <button
                    onClick={handleInstallClick}
                    className="flex-1 bg-gradient-to-r from-brand-blue to-purple-500 text-white px-6 py-3 rounded-xl font-semibold hover:from-brand-blue-dark hover:to-purple-600 transition-all flex items-center justify-center gap-2"
                  >
                    <Download size={18} />
                    Install Now
                  </button>
                )}
                <button
                  onClick={handleDismiss}
                  className="px-6 py-3 bg-white/5 text-gray-300 rounded-xl font-semibold hover:bg-white/10 transition-all"
                >
                  {deferredPrompt ? 'Later' : 'Got it'}
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
