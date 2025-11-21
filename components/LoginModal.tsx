'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { X, Mail, Lock, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function LoginModal({ isOpen, onClose }: LoginModalProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLogin, setIsLogin] = useState(true);
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const router = useRouter();

  // Load remembered email on component mount
  useEffect(() => {
    const rememberedEmail = localStorage.getItem('rememberedEmail');
    if (rememberedEmail) {
      setEmail(rememberedEmail);
      setRememberMe(true);
    }
  }, []);

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      console.log('Login form submitted');
      const endpoint = isLogin ? '/api/auth/login' : '/api/auth/register';
      const body = isLogin
        ? { email, password }
        : { email, password, name };

      console.log('Calling API:', endpoint);
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      console.log('API response status:', res.status);
      const data = await res.json();
      console.log('API response data:', data);

      if (!res.ok) {
        setError(data.error || data.details || 'Something went wrong');
        setLoading(false);
        return;
      }

      // Save token and user data to localStorage
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      console.log('Token and user saved to localStorage');

      // Handle Remember Me
      if (isLogin) {
        if (rememberMe) {
          localStorage.setItem('rememberedEmail', email);
        } else {
          localStorage.removeItem('rememberedEmail');
        }
      }

      // Check subscription status and show appropriate message
      if (!isLogin) {
        // For new registrations, redirect to plans page
        onClose();
        router.push('/#plans');
      } else {
        // For login, check if user is a coach
        if (data.user.role === 'coach') {
          // Coaches go directly to dashboard (no assessment needed)
          console.log('Coach login - Redirecting to dashboard...');
          onClose();
          router.push('/dashboard');
        } else {
          // For regular users/clients, check assessment FIRST (before subscription)
          if (!data.user.assessmentCompleted) {
            console.log('Client needs assessment - Redirecting to assessment...');
            onClose();
            router.push('/assessment');
          } else if (data.subscription && !data.subscription.isActive) {
            // Then check subscription status
            alert(data.subscription.message || 'Your subscription has expired. Please renew to continue.');
            onClose();
            router.push('/#plans');
          } else {
            // Redirect to dashboard
            console.log('Client login - Redirecting to dashboard...');
            onClose();
            router.push('/dashboard');
          }
        }
      }
    } catch (err) {
      console.error('Login error:', err);
      setError(`Network error: ${err instanceof Error ? err.message : 'Please try again'}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 z-50 backdrop-blur-md"
            onClick={onClose}
          />
          <div className="fixed inset-0 z-50 flex items-start justify-center p-4 overflow-y-auto">
            <div className="w-full max-w-md my-8">
              <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 40 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 40 }}
                transition={{ type: 'spring', duration: 0.5 }}
                className="bg-gradient-to-br from-brand-navy-light to-black border border-brand-navy-light/30 rounded-3xl p-10 relative shadow-2xl w-full"
              >
                <button
                  onClick={onClose}
                  className="absolute top-5 right-5 text-gray-400 hover:text-white transition-colors hover:rotate-90 duration-300"
                  aria-label="Close"
                >
                  <X size={28} strokeWidth={2} />
                </button>

                <div className="flex flex-col items-center">
                  <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.2 }}
                    className="mb-8"
                  >
                    <Image
                      src="/logo.png"
                      alt="Coach Himanshu"
                      width={120}
                      height={120}
                      className="object-contain"
                    />
                  </motion.div>

                  <motion.h2
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="text-2xl font-bold text-white mb-2"
                  >
                    {isLogin ? 'Welcome Back' : 'Create Account'}
                  </motion.h2>
                  <motion.p
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.35 }}
                    className="text-gray-400 mb-8 text-center"
                  >
                    {isLogin ? 'Sign in to continue your fitness journey' : 'Start your fitness transformation today'}
                  </motion.p>

                  {error && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="bg-red-500/20 border border-red-500/50 rounded-lg p-3 mb-4 flex items-center gap-2"
                    >
                      <AlertCircle className="w-5 h-5 text-red-400" />
                      <p className="text-red-400 text-sm">{error}</p>
                    </motion.div>
                  )}

                  <form onSubmit={handleSubmit} className="w-full">
                    {!isLogin && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="mb-4"
                      >
                        <div className="bg-brand-navy/50 rounded-xl p-4 border border-brand-blue/20 focus-within:border-brand-blue/50 transition-all">
                          <div className="flex items-center gap-3">
                            <Lock className="w-5 h-5 text-brand-blue" />
                            <input
                              type="text"
                              placeholder="Full Name"
                              value={name}
                              onChange={(e) => setName(e.target.value)}
                              className="flex-1 bg-transparent text-white placeholder-gray-500 outline-none"
                              required={!isLogin}
                            />
                          </div>
                        </div>
                      </motion.div>
                    )}

                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.4 }}
                      className="bg-brand-navy/50 rounded-xl p-4 border border-brand-blue/20 mb-4 focus-within:border-brand-blue/50 transition-all"
                    >
                      <div className="flex items-center gap-3">
                        <Mail className="w-5 h-5 text-brand-blue" />
                        <input
                          type="email"
                          placeholder="Email Address"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          className="flex-1 bg-transparent text-white placeholder-gray-500 outline-none"
                          required
                        />
                      </div>
                    </motion.div>

                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.42 }}
                      className="bg-brand-navy/50 rounded-xl p-4 border border-brand-blue/20 mb-4 focus-within:border-brand-blue/50 transition-all"
                    >
                      <div className="flex items-center gap-3">
                        <Lock className="w-5 h-5 text-brand-blue" />
                        <input
                          type="password"
                          placeholder="Password"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          className="flex-1 bg-transparent text-white placeholder-gray-500 outline-none"
                          required
                          minLength={6}
                        />
                      </div>
                    </motion.div>

                    {isLogin && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.43 }}
                        className="flex items-center gap-2 mb-6"
                      >
                        <input
                          type="checkbox"
                          id="rememberMe"
                          checked={rememberMe}
                          onChange={(e) => setRememberMe(e.target.checked)}
                          className="w-4 h-4 rounded border-brand-blue/30 bg-brand-navy/50 text-brand-blue focus:ring-brand-blue focus:ring-offset-0 cursor-pointer"
                        />
                        <label
                          htmlFor="rememberMe"
                          className="text-gray-400 text-sm cursor-pointer select-none hover:text-gray-300 transition-colors"
                        >
                          Remember me
                        </label>
                      </motion.div>
                    )}

                    <motion.button
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.45 }}
                      type="submit"
                      disabled={loading}
                      whileHover={{ scale: loading ? 1 : 1.02 }}
                      whileTap={{ scale: loading ? 1 : 0.98 }}
                      className="w-full bg-gradient-to-r from-brand-blue to-brand-blue-dark text-white font-bold py-4 rounded-xl hover:shadow-[0_0_30px_rgba(23,95,255,0.4)] transition-all duration-300 mb-6 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {loading ? 'LOADING...' : (isLogin ? 'SIGN IN' : 'CREATE ACCOUNT')}
                    </motion.button>
                  </form>

                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.6 }}
                    className="text-gray-500 text-xs text-center leading-relaxed"
                  >
                    By continuing you agree to our{' '}
                    <a href="/terms-of-service" className="text-brand-blue hover:text-brand-blue-dark underline transition-colors" target="_blank" rel="noopener noreferrer">
                      Terms of Service
                    </a>{' '}
                    and{' '}
                    <a href="/privacy-policy" className="text-brand-blue hover:text-brand-blue-dark underline transition-colors" target="_blank" rel="noopener noreferrer">
                      Privacy Policy
                    </a>
                  </motion.p>
                </div>
              </motion.div>
            </div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
