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
    const handleAppInstalled = () => {
      console.log('PWA was installed');
      setShowPrompt(false);
      setDeferredPrompt(null);
    };
    window.addEventListener('appinstalled', handleAppInstalled);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
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
          className="fixed bottom-[60px] left-0 right-0 z-50 p-3 md:p-4 md:bottom-4 md:left-auto md:right-4 md:max-w-md lg:bottom-4"
        >
          <div className="bg-gradient-to-br from-brand-navy-light to-brand-navy border border-brand-blue/30 rounded-2xl shadow-2xl overflow-hidden">
            {/* Close button */}
            <button
              onClick={handleDismiss}
              className="absolute top-3 right-3 text-gray-400 hover:text-white transition-colors z-10 w-8 h-8 flex items-center justify-center rounded-full bg-white/5"
            >
              <X size={16} />
            </button>

            <div className="p-4 md:p-6">
              {/* Header - compact on mobile */}
              <div className="flex items-center gap-3 mb-3 md:mb-4">
                <div className="w-11 h-11 md:w-14 md:h-14 bg-gradient-to-br from-brand-blue to-purple-500 rounded-xl md:rounded-2xl flex items-center justify-center flex-shrink-0">
                  <Download size={22} className="text-white md:hidden" />
                  <Download size={28} className="text-white hidden md:block" />
                </div>
                <div>
                  <h3 className="text-white font-bold text-base md:text-lg">Install App</h3>
                  <p className="text-gray-400 text-xs md:text-sm">Quick access anytime</p>
                </div>
              </div>

              {/* Content based on device */}
              {isIOS && (
                <div className="bg-white/5 rounded-xl p-3 md:p-4 mb-3 md:mb-4">
                  <p className="text-white text-xs md:text-sm mb-2 md:mb-3">
                    Install this app on your iPhone:
                  </p>
                  <ol className="space-y-1.5 md:space-y-2 text-xs md:text-sm text-gray-300">
                    <li className="flex items-start gap-2">
                      <span className="flex-shrink-0 w-5 h-5 bg-brand-blue/20 text-brand-blue rounded-full flex items-center justify-center text-xs font-bold">
                        1
                      </span>
                      <span>
                        Tap the <Share size={12} className="inline mx-0.5" /> share button
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="flex-shrink-0 w-5 h-5 bg-brand-blue/20 text-brand-blue rounded-full flex items-center justify-center text-xs font-bold">
                        2
                      </span>
                      <span>
                        Tap "Add to Home Screen" <Plus size={12} className="inline mx-0.5" />
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
                <div className="bg-white/5 rounded-xl p-3 md:p-4 mb-3 md:mb-4">
                  <p className="text-white text-xs md:text-sm mb-2 md:mb-3">
                    Install this app on your Android:
                  </p>
                  <ol className="space-y-1.5 md:space-y-2 text-xs md:text-sm text-gray-300">
                    <li className="flex items-start gap-2">
                      <span className="flex-shrink-0 w-5 h-5 bg-brand-blue/20 text-brand-blue rounded-full flex items-center justify-center text-xs font-bold">
                        1
                      </span>
                      <span>
                        Tap the <MoreVertical size={12} className="inline mx-0.5" /> menu button
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
                <div className="bg-white/5 rounded-xl p-3 md:p-4 mb-3 md:mb-4">
                  <p className="text-gray-300 text-xs md:text-sm">
                    Get instant access to your fitness journey. Install now for:
                  </p>
                  <ul className="mt-2 md:mt-3 space-y-1.5 md:space-y-2 text-xs md:text-sm text-gray-300">
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
              <div className="flex gap-2 md:gap-3">
                {deferredPrompt && (
                  <button
                    onClick={handleInstallClick}
                    className="flex-1 bg-gradient-to-r from-brand-blue to-purple-500 text-white px-4 md:px-6 py-2.5 md:py-3 rounded-xl font-semibold text-sm md:text-base hover:from-brand-blue-dark hover:to-purple-600 transition-all flex items-center justify-center gap-2"
                  >
                    <Download size={16} />
                    Install Now
                  </button>
                )}
                <button
                  onClick={handleDismiss}
                  className="px-4 md:px-6 py-2.5 md:py-3 bg-white/5 text-gray-300 rounded-xl font-semibold text-sm md:text-base hover:bg-white/10 transition-all"
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
