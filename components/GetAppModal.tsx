'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Download, Share, Plus, MoreVertical, Monitor, Smartphone, Apple, Sparkles } from 'lucide-react';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

interface GetAppModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function GetAppModal({ isOpen, onClose }: GetAppModalProps) {
  const [deviceType, setDeviceType] = useState<'ios' | 'android' | 'desktop'>('desktop');
  const [browserName, setBrowserName] = useState('');
  const [isStandalone, setIsStandalone] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [canInstall, setCanInstall] = useState(false);
  const [installing, setInstalling] = useState(false);

  useEffect(() => {
    // Listen for beforeinstallprompt event (Android/Desktop Chrome/Edge)
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      const promptEvent = e as BeforeInstallPromptEvent;
      setDeferredPrompt(promptEvent);
      setCanInstall(true);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    // Listen for successful installation
    window.addEventListener('appinstalled', () => {
      console.log('PWA was installed');
      setDeferredPrompt(null);
      setCanInstall(false);
      setIsStandalone(true);
    });

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  useEffect(() => {
    if (!isOpen) return;

    // Check if already installed
    const standalone = window.matchMedia('(display-mode: standalone)').matches;
    setIsStandalone(standalone);

    // Detect device type
    const userAgent = navigator.userAgent;
    const iOS = /iPad|iPhone|iPod/.test(userAgent) && !(window as any).MSStream;
    const android = /Android/.test(userAgent);

    if (iOS) {
      setDeviceType('ios');
      setBrowserName('Safari');
    } else if (android) {
      setDeviceType('android');
      setBrowserName('Chrome');
    } else {
      setDeviceType('desktop');
      // Detect browser
      if (userAgent.includes('Chrome')) {
        setBrowserName('Chrome');
      } else if (userAgent.includes('Firefox')) {
        setBrowserName('Firefox');
      } else if (userAgent.includes('Edg')) {
        setBrowserName('Edge');
      } else if (userAgent.includes('Safari')) {
        setBrowserName('Safari');
      } else {
        setBrowserName('your browser');
      }
    }
  }, [isOpen]);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;

    setInstalling(true);

    try {
      // Show the install prompt
      await deferredPrompt.prompt();

      // Wait for the user's response
      const { outcome } = await deferredPrompt.userChoice;

      console.log(`User response to install prompt: ${outcome}`);

      if (outcome === 'accepted') {
        // Installation successful
        setDeferredPrompt(null);
        setCanInstall(false);
        // Close modal after short delay
        setTimeout(() => {
          onClose();
        }, 1500);
      }
    } catch (error) {
      console.error('Error during installation:', error);
    } finally {
      setInstalling(false);
    }
  };

  const renderInstructions = () => {
    if (isStandalone) {
      return (
        <div className="text-center py-8">
          <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <Download size={40} className="text-green-400" />
          </div>
          <h3 className="text-white text-xl font-bold mb-2">Already Installed!</h3>
          <p className="text-gray-400">
            The app is already installed on your device.
          </p>
        </div>
      );
    }

    switch (deviceType) {
      case 'ios':
        return (
          <div>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-500 rounded-xl flex items-center justify-center">
                <Apple size={24} className="text-white" />
              </div>
              <div>
                <h3 className="text-white font-bold text-lg">Install on iPhone/iPad</h3>
                <p className="text-gray-400 text-sm">Follow these simple steps</p>
              </div>
            </div>

            <div className="bg-white/5 rounded-xl p-4 mb-4">
              <ol className="space-y-4">
                <li className="flex items-start gap-3">
                  <span className="flex-shrink-0 w-6 h-6 bg-brand-blue/30 text-brand-blue rounded-full flex items-center justify-center text-sm font-bold">
                    1
                  </span>
                  <div className="flex-1">
                    <p className="text-white text-sm font-medium mb-1">Tap the Share button</p>
                    <p className="text-gray-400 text-xs">
                      Look for the <Share size={12} className="inline mx-1" /> icon at the bottom of Safari
                    </p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <span className="flex-shrink-0 w-6 h-6 bg-brand-blue/30 text-brand-blue rounded-full flex items-center justify-center text-sm font-bold">
                    2
                  </span>
                  <div className="flex-1">
                    <p className="text-white text-sm font-medium mb-1">Scroll and find "Add to Home Screen"</p>
                    <p className="text-gray-400 text-xs">
                      Tap on <Plus size={12} className="inline mx-1" /> "Add to Home Screen" option
                    </p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <span className="flex-shrink-0 w-6 h-6 bg-brand-blue/30 text-brand-blue rounded-full flex items-center justify-center text-sm font-bold">
                    3
                  </span>
                  <div className="flex-1">
                    <p className="text-white text-sm font-medium mb-1">Tap "Add" to confirm</p>
                    <p className="text-gray-400 text-xs">
                      The app icon will appear on your home screen
                    </p>
                  </div>
                </li>
              </ol>
            </div>

            <div className="bg-brand-blue/10 border border-brand-blue/30 rounded-lg p-3">
              <p className="text-brand-blue text-xs">
                <strong>Note:</strong> This only works in Safari. If you're using another browser, please open this page in Safari.
              </p>
            </div>
          </div>
        );

      case 'android':
        return (
          <div>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-500 rounded-xl flex items-center justify-center">
                <Smartphone size={24} className="text-white" />
              </div>
              <div>
                <h3 className="text-white font-bold text-lg">Install on Android</h3>
                <p className="text-gray-400 text-sm">Quick and easy installation</p>
              </div>
            </div>

            {canInstall && (
              <div className="bg-gradient-to-r from-brand-blue/20 to-purple-500/20 border border-brand-blue/30 rounded-xl p-4 mb-4">
                <div className="flex items-center gap-2 mb-2">
                  <Sparkles size={16} className="text-brand-gold" />
                  <p className="text-white font-semibold text-sm">One-Click Installation Available!</p>
                </div>
                <p className="text-gray-300 text-xs mb-3">
                  Your browser supports instant installation. Click the "Install Now" button below for the fastest setup.
                </p>
              </div>
            )}

            <div className="bg-white/5 rounded-xl p-4 mb-4">
              {canInstall && (
                <p className="text-gray-400 text-xs mb-3 font-medium">Or follow these steps manually:</p>
              )}
              <ol className="space-y-4">
                <li className="flex items-start gap-3">
                  <span className="flex-shrink-0 w-6 h-6 bg-brand-blue/30 text-brand-blue rounded-full flex items-center justify-center text-sm font-bold">
                    1
                  </span>
                  <div className="flex-1">
                    <p className="text-white text-sm font-medium mb-1">Tap the menu button</p>
                    <p className="text-gray-400 text-xs">
                      Tap the <MoreVertical size={12} className="inline mx-1" /> three-dot menu in the top right corner
                    </p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <span className="flex-shrink-0 w-6 h-6 bg-brand-blue/30 text-brand-blue rounded-full flex items-center justify-center text-sm font-bold">
                    2
                  </span>
                  <div className="flex-1">
                    <p className="text-white text-sm font-medium mb-1">Select "Install App" or "Add to Home Screen"</p>
                    <p className="text-gray-400 text-xs">
                      Look for the install option in the menu
                    </p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <span className="flex-shrink-0 w-6 h-6 bg-brand-blue/30 text-brand-blue rounded-full flex items-center justify-center text-sm font-bold">
                    3
                  </span>
                  <div className="flex-1">
                    <p className="text-white text-sm font-medium mb-1">Tap "Install" to confirm</p>
                    <p className="text-gray-400 text-xs">
                      The app will be added to your home screen automatically
                    </p>
                  </div>
                </li>
              </ol>
            </div>

            <div className="bg-white/5 rounded-lg p-3 mb-3">
              <p className="text-gray-300 text-xs font-medium mb-2">Benefits of installing:</p>
              <ul className="space-y-1.5 text-xs text-gray-400">
                <li className="flex items-center gap-2">
                  <div className="w-1 h-1 bg-brand-green rounded-full"></div>
                  Works offline after installation
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-1 h-1 bg-brand-green rounded-full"></div>
                  Faster loading and performance
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-1 h-1 bg-brand-green rounded-full"></div>
                  Push notifications for updates
                </li>
              </ul>
            </div>
          </div>
        );

      case 'desktop':
        return (
          <div>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
                <Monitor size={24} className="text-white" />
              </div>
              <div>
                <h3 className="text-white font-bold text-lg">Install on Desktop</h3>
                <p className="text-gray-400 text-sm">Available for {browserName}</p>
              </div>
            </div>

            {canInstall && (
              <div className="bg-gradient-to-r from-brand-blue/20 to-purple-500/20 border border-brand-blue/30 rounded-xl p-4 mb-4">
                <div className="flex items-center gap-2 mb-2">
                  <Sparkles size={16} className="text-brand-gold" />
                  <p className="text-white font-semibold text-sm">One-Click Installation Available!</p>
                </div>
                <p className="text-gray-300 text-xs mb-3">
                  Your browser supports instant installation. Click the "Install Now" button below for the fastest setup.
                </p>
              </div>
            )}

            <div className="bg-white/5 rounded-xl p-4 mb-4">
              {canInstall && (
                <p className="text-gray-400 text-xs mb-3 font-medium">Or follow these steps manually:</p>
              )}
              <ol className="space-y-4">
                <li className="flex items-start gap-3">
                  <span className="flex-shrink-0 w-6 h-6 bg-brand-blue/30 text-brand-blue rounded-full flex items-center justify-center text-sm font-bold">
                    1
                  </span>
                  <div className="flex-1">
                    <p className="text-white text-sm font-medium mb-1">Look for the install icon</p>
                    <p className="text-gray-400 text-xs">
                      Check the address bar for an install icon <Download size={12} className="inline mx-1" /> or <Plus size={12} className="inline mx-1" /> button
                    </p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <span className="flex-shrink-0 w-6 h-6 bg-brand-blue/30 text-brand-blue rounded-full flex items-center justify-center text-sm font-bold">
                    2
                  </span>
                  <div className="flex-1">
                    <p className="text-white text-sm font-medium mb-1">Click "Install" or "Add"</p>
                    <p className="text-gray-400 text-xs">
                      Follow the browser's installation prompt
                    </p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <span className="flex-shrink-0 w-6 h-6 bg-brand-blue/30 text-brand-blue rounded-full flex items-center justify-center text-sm font-bold">
                    3
                  </span>
                  <div className="flex-1">
                    <p className="text-white text-sm font-medium mb-1">Launch the app</p>
                    <p className="text-gray-400 text-xs">
                      Find the app in your applications menu or desktop
                    </p>
                  </div>
                </li>
              </ol>
            </div>

            {browserName === 'Chrome' && (
              <div className="bg-brand-blue/10 border border-brand-blue/30 rounded-lg p-3 mb-3">
                <p className="text-brand-blue text-xs">
                  <strong>Chrome users:</strong> You can also click the three-dot menu → "Install Coach Himanshu..."
                </p>
              </div>
            )}

            {browserName === 'Edge' && (
              <div className="bg-brand-blue/10 border border-brand-blue/30 rounded-lg p-3 mb-3">
                <p className="text-brand-blue text-xs">
                  <strong>Edge users:</strong> Click the three-dot menu → "Apps" → "Install this site as an app"
                </p>
              </div>
            )}

            <div className="bg-white/5 rounded-lg p-3">
              <p className="text-gray-300 text-xs font-medium mb-2">Why install?</p>
              <ul className="space-y-1.5 text-xs text-gray-400">
                <li className="flex items-center gap-2">
                  <div className="w-1 h-1 bg-brand-green rounded-full"></div>
                  Quick access from taskbar/dock
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-1 h-1 bg-brand-green rounded-full"></div>
                  Works independently as a standalone app
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-1 h-1 bg-brand-green rounded-full"></div>
                  Better performance and offline support
                </li>
              </ul>
            </div>
          </div>
        );
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/70 z-50 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-md bg-gradient-to-br from-brand-navy-light to-black border border-white/10 rounded-2xl shadow-2xl overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-5 border-b border-white/10">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-brand-blue to-purple-500 rounded-xl flex items-center justify-center">
                  <Download size={20} className="text-white" />
                </div>
                <div>
                  <h2 className="text-white font-bold text-lg">Get the App</h2>
                  <p className="text-gray-400 text-xs">Install for better experience</p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            {/* Content */}
            <div className="p-5 max-h-[70vh] overflow-y-auto">
              {renderInstructions()}
            </div>

            {/* Footer */}
            {!isStandalone && (
              <div className="p-5 border-t border-white/10">
                {canInstall ? (
                  <div className="flex gap-3">
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={handleInstallClick}
                      disabled={installing}
                      className="flex-1 bg-gradient-to-r from-brand-blue to-purple-500 hover:from-brand-blue-dark hover:to-purple-600 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {installing ? (
                        <>
                          <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                          Installing...
                        </>
                      ) : (
                        <>
                          <Download size={18} />
                          Install Now
                        </>
                      )}
                    </motion.button>
                    <button
                      onClick={onClose}
                      className="px-6 py-3 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 text-white rounded-xl font-semibold transition-all"
                    >
                      Later
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={onClose}
                    className="w-full bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 text-white px-4 py-3 rounded-xl font-semibold transition-all"
                  >
                    Got it
                  </button>
                )}
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
