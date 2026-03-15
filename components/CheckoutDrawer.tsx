'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { X, ShoppingCart, Trash2, CheckCircle, User, Phone, Mail, Target, FileText, MessageCircle, QrCode, ArrowLeft, Tag, Loader2, Heart, Users } from 'lucide-react';
import { useCart } from '@/contexts/CartContext';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

type CheckoutStep = 'cart' | 'details' | 'payment' | 'success';

export default function CheckoutDrawer() {
  const { cartItems, isCheckoutOpen, closeCheckout, removeFromCart, clearCart, getTotalPrice } = useCart();
  const [currentStep, setCurrentStep] = useState<CheckoutStep>('cart');
  const [formData, setFormData] = useState({
    name: '',
    whatsapp: '',
    email: '',
    goal: '',
    notes: '',
    // Partner 2 details for couple plans
    partner2Name: '',
    partner2Whatsapp: '',
    partner2Email: '',
    partner2Goal: '',
  });
  const [errors, setErrors] = useState<any>({});
  const router = useRouter();

  // Promo code state
  const [promoCode, setPromoCode] = useState('');
  const [appliedPromo, setAppliedPromo] = useState<any>(null);
  const [promoError, setPromoError] = useState('');
  const [isValidatingPromo, setIsValidatingPromo] = useState(false);

  // Check if current plan is a couple plan
  const isCouplePlan = cartItems[0]?.name?.toLowerCase().includes('couple');
  // Check if current plan is a home workout plan
  const isHomeWorkoutPlan = cartItems[0]?.name?.toLowerCase().includes('home workout');

  const validateForm = () => {
    const newErrors: any = {};

    // Partner 1 validation
    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.whatsapp.trim()) {
      newErrors.whatsapp = 'WhatsApp number is required';
    } else if (!/^\d{10}$/.test(formData.whatsapp)) {
      newErrors.whatsapp = 'Please enter a valid 10-digit number';
    }
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email';
    }
    if (!formData.goal.trim()) newErrors.goal = 'Fitness goal is required';

    // Partner 2 validation (only for couple plans)
    if (isCouplePlan) {
      if (!formData.partner2Name.trim()) newErrors.partner2Name = 'Partner 2 name is required';
      if (!formData.partner2Whatsapp.trim()) {
        newErrors.partner2Whatsapp = 'Partner 2 WhatsApp number is required';
      } else if (!/^\d{10}$/.test(formData.partner2Whatsapp)) {
        newErrors.partner2Whatsapp = 'Please enter a valid 10-digit number';
      }
      if (!formData.partner2Email.trim()) {
        newErrors.partner2Email = 'Partner 2 email is required';
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.partner2Email)) {
        newErrors.partner2Email = 'Please enter a valid email';
      }
      if (!formData.partner2Goal.trim()) newErrors.partner2Goal = 'Partner 2 fitness goal is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleProceedToDetails = () => {
    if (cartItems.length === 0) return;
    setCurrentStep('details');
  };

  const handleSubmitDetails = () => {
    if (validateForm()) {
      setCurrentStep('payment');
    }
  };

  const handlePaymentComplete = async () => {
    // If promo code was applied, increment usage count
    if (appliedPromo) {
      try {
        await fetch('/api/promo-codes/apply', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            code: appliedPromo.promoCode.code,
          }),
        });
      } catch (error) {
        console.error('Error applying promo code:', error);
        // Continue anyway - payment is more important
      }
    }

    // Show WhatsApp confirmation message
    const plan = cartItems[0];
    const promoText = appliedPromo
      ? `\nPromo Code: ${appliedPromo.promoCode.code}\nDiscount: ₹${appliedPromo.discountAmount}\nOriginal Price: ₹${getTotalPrice()}\nFinal Amount: ₹${getFinalTotal()}`
      : '';

    // Build message based on whether it's a couple plan
    let detailsText = '';
    if (isCouplePlan) {
      detailsText = `\n👤 *Partner 1 Details:*\nName: ${formData.name}\nEmail: ${formData.email}\nWhatsApp: ${formData.whatsapp}\nGoal: ${formData.goal}\n\n👤 *Partner 2 Details:*\nName: ${formData.partner2Name}\nEmail: ${formData.partner2Email}\nWhatsApp: ${formData.partner2Whatsapp}\nGoal: ${formData.partner2Goal}`;
    } else {
      detailsText = `\nName: ${formData.name}\nEmail: ${formData.email}\nWhatsApp: ${formData.whatsapp}\nGoal: ${formData.goal}`;
    }

    const message = encodeURIComponent(
      `Hi, I've completed payment for ${plan?.name}${detailsText}${promoText}\n\nAmount Paid: ₹${getFinalTotal()}\n\nPlease find the payment screenshot attached.`
    );

    // Open WhatsApp
    window.open(`https://wa.me/917303484648?text=${message}`, '_blank');

    // Show success after short delay
    setTimeout(() => {
      setCurrentStep('success');
      setTimeout(() => {
        clearCart();
        closeCheckout();
        setCurrentStep('cart');
        setFormData({ name: '', whatsapp: '', email: '', goal: '', notes: '', partner2Name: '', partner2Whatsapp: '', partner2Email: '', partner2Goal: '' });
        router.push('/');
      }, 5000);
    }, 500);
  };

  const handleApplyPromo = async () => {
    if (!promoCode.trim()) {
      setPromoError('Please enter a promo code');
      return;
    }

    setIsValidatingPromo(true);
    setPromoError('');

    try {
      const response = await fetch('/api/promo-codes/validate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          code: promoCode.toUpperCase(),
          cartTotal: getTotalPrice(),
          planName: cartItems[0]?.name || null,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setAppliedPromo(data);
        setPromoError('');
      } else {
        setPromoError(data.error || 'Invalid promo code');
        setAppliedPromo(null);
      }
    } catch (error) {
      setPromoError('Failed to validate promo code');
      setAppliedPromo(null);
    } finally {
      setIsValidatingPromo(false);
    }
  };

  const handleRemovePromo = () => {
    setPromoCode('');
    setAppliedPromo(null);
    setPromoError('');
  };

  const getFinalTotal = () => {
    if (appliedPromo) {
      return appliedPromo.finalAmount;
    }
    return getTotalPrice();
  };

  // Format amount for QR code filename (e.g., 4399.2 -> 4399.20, 5499 -> 5499)
  const getQRFileName = () => {
    const amount = getFinalTotal();
    // Check if amount has decimals
    if (amount % 1 !== 0) {
      // Format with 2 decimal places
      return amount.toFixed(2);
    }
    // Return as integer (no decimals)
    return amount.toString();
  };

  // QR code image source state - try .jpg first, then .jpeg
  const [qrExtension, setQrExtension] = useState<'jpg' | 'jpeg'>('jpg');
  const [qrLoadFailed, setQrLoadFailed] = useState(false);

  // Reset QR state when amount changes
  useEffect(() => {
    setQrExtension('jpg');
    setQrLoadFailed(false);
  }, [appliedPromo, cartItems]);

  const handleClose = () => {
    closeCheckout();
    setCurrentStep('cart');
    setFormData({ name: '', whatsapp: '', email: '', goal: '', notes: '', partner2Name: '', partner2Whatsapp: '', partner2Email: '', partner2Goal: '' });
    setErrors({});
    setPromoCode('');
    setAppliedPromo(null);
    setPromoError('');
  };

  const handleBack = () => {
    if (currentStep === 'details') setCurrentStep('cart');
    else if (currentStep === 'payment') setCurrentStep('details');
  };

  return (
    <AnimatePresence>
      {isCheckoutOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 z-50 backdrop-blur-sm"
            onClick={handleClose}
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed right-0 top-0 h-full w-full md:w-[550px] bg-gradient-to-br from-brand-navy-light to-black border-l border-white/10 z-50 flex flex-col shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="bg-brand-navy/90 backdrop-blur-md border-b border-white/10 p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {currentStep !== 'cart' && currentStep !== 'success' && (
                    <button onClick={handleBack} className="text-gray-400 hover:text-white transition-colors mr-2">
                      <ArrowLeft size={24} />
                    </button>
                  )}
                  {currentStep === 'cart' && <ShoppingCart className="w-6 h-6 text-brand-blue" />}
                  {currentStep === 'details' && (isCouplePlan ? <Heart className="w-6 h-6 text-pink-400" /> : <User className="w-6 h-6 text-brand-blue" />)}
                  {currentStep === 'payment' && <QrCode className="w-6 h-6 text-brand-blue" />}
                  {currentStep === 'success' && <CheckCircle className="w-6 h-6 text-green-400" />}
                  <h2 className="text-2xl font-bold text-white">
                    {currentStep === 'cart' && 'Your Cart'}
                    {currentStep === 'details' && (isCouplePlan ? 'Couple Details' : 'Your Details')}
                    {currentStep === 'payment' && 'Payment'}
                    {currentStep === 'success' && 'Success!'}
                  </h2>
                </div>
                <button onClick={handleClose} className="text-gray-400 hover:text-white transition-colors">
                  <X size={24} />
                </button>
              </div>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-6">
              {/* STEP 1: CART */}
              {currentStep === 'cart' && (
                <>
                  {cartItems.length === 0 ? (
                    <div className="text-center py-12">
                      <ShoppingCart className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                      <p className="text-gray-400 text-lg mb-2">Your cart is empty</p>
                      <p className="text-gray-500 text-sm">Add a subscription plan to get started</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {cartItems.map((item) => (
                        <motion.div
                          key={item.id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="bg-white/5 border border-white/10 rounded-xl p-5"
                        >
                          <div className="flex items-start justify-between mb-3">
                            <div className="flex-1">
                              <h3 className="text-xl font-bold text-white mb-1">{item.name}</h3>
                              <p className="text-brand-blue text-sm">{item.duration}</p>
                            </div>
                            <button
                              onClick={() => removeFromCart(item.id)}
                              className="text-red-400 hover:text-red-300 transition-colors ml-4"
                            >
                              <Trash2 size={20} />
                            </button>
                          </div>

                          <div className="space-y-2 mb-4">
                            {item.features.slice(0, 3).map((feature, idx) => (
                              <div key={idx} className="flex items-center gap-2 text-gray-400 text-sm">
                                <CheckCircle className="w-4 h-4 text-green-400 flex-shrink-0" />
                                <span>{feature}</span>
                              </div>
                            ))}
                          </div>

                          <div className="flex items-center justify-between pt-3 border-t border-white/10">
                            <span className="text-gray-400">Price</span>
                            <span className="text-2xl font-bold text-white">₹{item.price.toLocaleString()}</span>
                          </div>
                        </motion.div>
                      ))}

                      {/* Promo Code Section - hidden for Home Workout plan */}
                      {!isHomeWorkoutPlan && <div className="mt-6 pt-6 border-t border-white/10">
                        <div className="flex items-center gap-2 mb-3">
                          <Tag className="w-5 h-5 text-brand-gold" />
                          <h3 className="text-white font-semibold">Have a Promo Code?</h3>
                        </div>

                        {!appliedPromo ? (
                          <div className="space-y-3">
                            <div className="flex gap-2">
                              <input
                                type="text"
                                value={promoCode}
                                onChange={(e) => {
                                  setPromoCode(e.target.value.toUpperCase());
                                  setPromoError('');
                                }}
                                onKeyPress={(e) => e.key === 'Enter' && handleApplyPromo()}
                                placeholder="Enter code"
                                className="flex-1 bg-brand-navy/50 border border-white/10 rounded-lg px-4 py-3 text-white uppercase focus:outline-none focus:border-brand-gold"
                                disabled={isValidatingPromo}
                              />
                              <button
                                onClick={handleApplyPromo}
                                disabled={isValidatingPromo || !promoCode.trim()}
                                className="px-6 py-3 bg-gradient-to-r from-brand-gold to-yellow-600 text-brand-navy font-semibold rounded-lg hover:shadow-lg hover:shadow-brand-gold/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                              >
                                {isValidatingPromo ? (
                                  <>
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                    Applying...
                                  </>
                                ) : (
                                  'Apply'
                                )}
                              </button>
                            </div>
                            {promoError && (
                              <p className="text-red-400 text-sm flex items-center gap-2">
                                <X className="w-4 h-4" />
                                {promoError}
                              </p>
                            )}
                          </div>
                        ) : (
                          <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-4">
                            <div className="flex items-start justify-between">
                              <div className="flex-1">
                                <div className="flex items-center gap-2 mb-1">
                                  <CheckCircle className="w-5 h-5 text-green-400" />
                                  <span className="text-green-400 font-semibold">{appliedPromo.promoCode.code}</span>
                                </div>
                                {appliedPromo.promoCode.description && (
                                  <p className="text-gray-400 text-sm ml-7">{appliedPromo.promoCode.description}</p>
                                )}
                                <p className="text-green-400 text-sm mt-2 ml-7">
                                  You saved ₹{appliedPromo.discountAmount.toLocaleString()}!
                                </p>
                              </div>
                              <button
                                onClick={handleRemovePromo}
                                className="text-gray-400 hover:text-red-400 transition-colors"
                              >
                                <X size={20} />
                              </button>
                            </div>
                          </div>
                        )}
                      </div>}
                    </div>
                  )}
                </>
              )}

              {/* STEP 2: DETAILS FORM */}
              {currentStep === 'details' && (
                <div className="space-y-5">
                  {isCouplePlan ? (
                    <div className="bg-pink-500/10 border border-pink-500/30 rounded-lg p-4 mb-4">
                      <div className="flex items-center gap-2">
                        <Heart className="w-5 h-5 text-pink-400" />
                        <span className="text-pink-400 font-semibold">Couple Plan</span>
                      </div>
                      <p className="text-gray-300 text-sm mt-2">Please provide details for both partners</p>
                    </div>
                  ) : (
                    <p className="text-gray-300 text-sm mb-6">Please provide your details to continue</p>
                  )}

                  {/* Partner 1 Section */}
                  {isCouplePlan && (
                    <div className="flex items-center gap-2 mb-2 mt-4">
                      <User className="w-5 h-5 text-pink-400" />
                      <h3 className="text-pink-400 font-semibold">Partner 1</h3>
                    </div>
                  )}

                  {/* Name */}
                  <div>
                    <label className="block text-gray-300 text-sm font-medium mb-2">
                      <User className="w-4 h-4 inline mr-2" />
                      Full Name *
                    </label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full bg-brand-navy/50 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-brand-blue"
                      placeholder="Enter full name"
                    />
                    {errors.name && <p className="text-red-400 text-xs mt-1">{errors.name}</p>}
                  </div>

                  {/* WhatsApp */}
                  <div>
                    <label className="block text-gray-300 text-sm font-medium mb-2">
                      <Phone className="w-4 h-4 inline mr-2" />
                      WhatsApp Number *
                    </label>
                    <input
                      type="tel"
                      value={formData.whatsapp}
                      onChange={(e) => setFormData({ ...formData, whatsapp: e.target.value.replace(/\D/g, '') })}
                      maxLength={10}
                      className="w-full bg-brand-navy/50 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-brand-blue"
                      placeholder="10-digit mobile number"
                    />
                    {errors.whatsapp && <p className="text-red-400 text-xs mt-1">{errors.whatsapp}</p>}
                  </div>

                  {/* Email */}
                  <div>
                    <label className="block text-gray-300 text-sm font-medium mb-2">
                      <Mail className="w-4 h-4 inline mr-2" />
                      Email Address *
                    </label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full bg-brand-navy/50 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-brand-blue"
                      placeholder="your@email.com"
                    />
                    {errors.email && <p className="text-red-400 text-xs mt-1">{errors.email}</p>}
                  </div>

                  {/* Goal */}
                  <div>
                    <label className="block text-gray-300 text-sm font-medium mb-2">
                      <Target className="w-4 h-4 inline mr-2" />
                      Fitness Goal *
                    </label>
                    <select
                      value={formData.goal}
                      onChange={(e) => setFormData({ ...formData, goal: e.target.value })}
                      className="w-full bg-brand-navy/50 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-brand-blue"
                    >
                      <option value="">Select your goal</option>
                      <option value="weight-loss">Weight Loss</option>
                      <option value="muscle-gain">Muscle Gain</option>
                      <option value="strength">Build Strength</option>
                      <option value="endurance">Increase Endurance</option>
                      <option value="general-fitness">General Fitness</option>
                      <option value="body-transformation">Body Transformation</option>
                    </select>
                    {errors.goal && <p className="text-red-400 text-xs mt-1">{errors.goal}</p>}
                  </div>

                  {/* Partner 2 Section - Only for couple plans */}
                  {isCouplePlan && (
                    <>
                      <div className="border-t border-white/10 my-6"></div>
                      <div className="flex items-center gap-2 mb-2">
                        <Users className="w-5 h-5 text-pink-400" />
                        <h3 className="text-pink-400 font-semibold">Partner 2</h3>
                      </div>

                      {/* Partner 2 Name */}
                      <div>
                        <label className="block text-gray-300 text-sm font-medium mb-2">
                          <User className="w-4 h-4 inline mr-2" />
                          Full Name *
                        </label>
                        <input
                          type="text"
                          value={formData.partner2Name}
                          onChange={(e) => setFormData({ ...formData, partner2Name: e.target.value })}
                          className="w-full bg-brand-navy/50 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-pink-400"
                          placeholder="Enter partner's full name"
                        />
                        {errors.partner2Name && <p className="text-red-400 text-xs mt-1">{errors.partner2Name}</p>}
                      </div>

                      {/* Partner 2 WhatsApp */}
                      <div>
                        <label className="block text-gray-300 text-sm font-medium mb-2">
                          <Phone className="w-4 h-4 inline mr-2" />
                          WhatsApp Number *
                        </label>
                        <input
                          type="tel"
                          value={formData.partner2Whatsapp}
                          onChange={(e) => setFormData({ ...formData, partner2Whatsapp: e.target.value.replace(/\D/g, '') })}
                          maxLength={10}
                          className="w-full bg-brand-navy/50 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-pink-400"
                          placeholder="10-digit mobile number"
                        />
                        {errors.partner2Whatsapp && <p className="text-red-400 text-xs mt-1">{errors.partner2Whatsapp}</p>}
                      </div>

                      {/* Partner 2 Email */}
                      <div>
                        <label className="block text-gray-300 text-sm font-medium mb-2">
                          <Mail className="w-4 h-4 inline mr-2" />
                          Email Address *
                        </label>
                        <input
                          type="email"
                          value={formData.partner2Email}
                          onChange={(e) => setFormData({ ...formData, partner2Email: e.target.value })}
                          className="w-full bg-brand-navy/50 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-pink-400"
                          placeholder="partner@email.com"
                        />
                        {errors.partner2Email && <p className="text-red-400 text-xs mt-1">{errors.partner2Email}</p>}
                      </div>

                      {/* Partner 2 Goal */}
                      <div>
                        <label className="block text-gray-300 text-sm font-medium mb-2">
                          <Target className="w-4 h-4 inline mr-2" />
                          Fitness Goal *
                        </label>
                        <select
                          value={formData.partner2Goal}
                          onChange={(e) => setFormData({ ...formData, partner2Goal: e.target.value })}
                          className="w-full bg-brand-navy/50 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-pink-400"
                        >
                          <option value="">Select partner's goal</option>
                          <option value="weight-loss">Weight Loss</option>
                          <option value="muscle-gain">Muscle Gain</option>
                          <option value="strength">Build Strength</option>
                          <option value="endurance">Increase Endurance</option>
                          <option value="general-fitness">General Fitness</option>
                          <option value="body-transformation">Body Transformation</option>
                        </select>
                        {errors.partner2Goal && <p className="text-red-400 text-xs mt-1">{errors.partner2Goal}</p>}
                      </div>
                    </>
                  )}

                  {/* Notes */}
                  <div className={isCouplePlan ? 'mt-6 pt-6 border-t border-white/10' : ''}>
                    <label className="block text-gray-300 text-sm font-medium mb-2">
                      <FileText className="w-4 h-4 inline mr-2" />
                      Additional Notes (Optional)
                    </label>
                    <textarea
                      value={formData.notes}
                      onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                      className="w-full bg-brand-navy/50 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-brand-blue"
                      rows={3}
                      placeholder={isCouplePlan ? "Any special requirements or medical conditions for either partner..." : "Any special requirements or medical conditions..."}
                    />
                  </div>
                </div>
              )}

              {/* STEP 3: PAYMENT */}
              {currentStep === 'payment' && (
                <div className="space-y-6 text-center">
                  <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-4 text-left">
                    <CheckCircle className="w-6 h-6 text-green-400 inline mr-2" />
                    <span className="text-green-400 font-semibold">Details Submitted</span>
                    <p className="text-gray-300 text-sm mt-2">
                      Your details will be sent to your fitness coach who will review and create a personalized plan for you.
                    </p>
                  </div>

                  <div className="py-6">
                    <h3 className="text-xl font-bold text-white mb-4">Complete Payment</h3>
                    <p className="text-gray-400 mb-6">
                      Scan the QR code below to complete your payment
                    </p>

                    {/* QR Code - Dynamic based on amount */}
                    <div className="bg-white p-6 rounded-xl inline-block mb-4">
                      <div className="w-64 h-64 relative">
                        {!qrLoadFailed ? (
                          <Image
                            src={`/QR/${getQRFileName()}.${qrExtension}`}
                            alt={`Payment QR Code for ₹${getFinalTotal()}`}
                            fill
                            className="object-contain rounded-lg"
                            onError={() => {
                              // Try .jpeg if .jpg fails
                              if (qrExtension === 'jpg') {
                                setQrExtension('jpeg');
                              } else {
                                // Both extensions failed
                                setQrLoadFailed(true);
                              }
                            }}
                          />
                        ) : (
                          <div className="w-full h-full bg-gray-200 rounded-lg flex items-center justify-center flex-col gap-2">
                            <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-400">
                              <rect width="5" height="5" x="3" y="3" rx="1"/>
                              <rect width="5" height="5" x="16" y="3" rx="1"/>
                              <rect width="5" height="5" x="3" y="16" rx="1"/>
                              <path d="M21 16h-3a2 2 0 0 0-2 2v3"/>
                              <path d="M21 21v.01"/>
                              <path d="M12 7v3a2 2 0 0 1-2 2H7"/>
                              <path d="M3 12h.01"/>
                              <path d="M12 3h.01"/>
                              <path d="M12 16v.01"/>
                              <path d="M16 12h1"/>
                              <path d="M21 12v.01"/>
                              <path d="M12 21v-1"/>
                            </svg>
                            <span className="text-gray-500 text-sm">QR not available</span>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="bg-white/5 border border-white/10 rounded-lg p-4 mb-6">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-gray-400">Amount to Pay</span>
                        <span className="text-2xl font-bold text-white">₹{getFinalTotal().toLocaleString()}</span>
                      </div>
                      {appliedPromo && (
                        <div className="flex items-center justify-between text-sm text-gray-400 mb-1">
                          <span>Original Price:</span>
                          <span className="line-through">₹{getTotalPrice().toLocaleString()}</span>
                        </div>
                      )}
                      {appliedPromo && (
                        <div className="flex items-center justify-between text-sm text-green-400 mb-2">
                          <span>Discount ({appliedPromo.promoCode.code}):</span>
                          <span>-₹{appliedPromo.discountAmount.toLocaleString()}</span>
                        </div>
                      )}
                      <p className="text-gray-500 text-xs">Plan: {cartItems[0]?.name}</p>
                    </div>

                    {/* WhatsApp Screenshot Instruction */}
                    <div className="bg-orange-500/10 border border-orange-500/30 rounded-lg p-5 mb-4 text-left">
                      <div className="flex items-start gap-3 mb-3">
                        <MessageCircle className="w-6 h-6 text-orange-400 flex-shrink-0 mt-1" />
                        <div className="flex-1">
                          <h4 className="text-orange-400 font-semibold mb-2">Important: Send Payment Screenshot</h4>
                          <p className="text-gray-300 text-sm mb-3">
                            After completing the payment, please share your payment screenshot to confirm your subscription.
                          </p>
                          <p className="text-gray-400 text-xs mb-3">
                            WhatsApp Number: <span className="text-white font-semibold">+91 7303484648</span>
                          </p>
                        </div>
                      </div>
                      <div className="bg-orange-500/20 rounded-lg p-3 mb-3">
                        <p className="text-orange-300 text-xs font-medium mb-1">📸 What to send:</p>
                        <ul className="text-gray-300 text-xs space-y-1 ml-4">
                          <li>• Screenshot of payment confirmation</li>
                          <li>• Include transaction ID if visible</li>
                          <li>• Your registered email address</li>
                        </ul>
                      </div>
                    </div>

                    <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4 mb-4">
                      <MessageCircle className="w-5 h-5 text-blue-400 inline mr-2" />
                      <span className="text-blue-400 font-semibold">Need Help?</span>
                      <p className="text-gray-300 text-sm mt-2">
                        Having issues with payment? Contact us on WhatsApp
                      </p>
                      <a
                        href="https://wa.me/917303484648"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-3 inline-flex items-center gap-2 bg-green-500/20 text-green-400 px-4 py-2 rounded-lg hover:bg-green-500/30 transition-all text-sm"
                      >
                        <MessageCircle className="w-4 h-4" />
                        WhatsApp Support
                      </a>
                    </div>
                  </div>
                </div>
              )}

              {/* STEP 4: SUCCESS */}
              {currentStep === 'success' && (
                <div className="text-center py-12">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: 'spring', duration: 0.5 }}
                  >
                    <CheckCircle className="w-24 h-24 text-green-400 mx-auto mb-6" />
                    <h2 className="text-3xl font-bold text-white mb-4">Payment Successful!</h2>
                    <p className="text-gray-300 mb-6">
                      Thank you for your purchase. Your credentials will be sent to your email shortly.
                    </p>
                    <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-6 text-left max-w-md mx-auto">
                      <p className="text-gray-300 text-sm mb-4">
                        <strong className="text-white">What's Next:</strong>
                      </p>
                      <ul className="space-y-2 text-sm text-gray-300">
                        <li>• Check your email for login credentials</li>
                        <li>• Your coach will review your details</li>
                        <li>• Personalized plan will be created</li>
                        <li>• You'll get access to your dashboard</li>
                      </ul>
                    </div>
                    <p className="text-brand-blue font-semibold mt-8 text-lg">
                      All the best for your fitness journey! 💪
                    </p>
                    <p className="text-gray-500 text-sm mt-4">Redirecting to home...</p>
                  </motion.div>
                </div>
              )}
            </div>

            {/* Footer Buttons */}
            {currentStep !== 'success' && (
              <div className="bg-brand-navy/90 backdrop-blur-md border-t border-white/10 p-6">
                {currentStep === 'cart' && cartItems.length > 0 && (
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-lg">
                        <span className="text-gray-300">Subtotal</span>
                        <span className="text-xl font-semibold text-white">₹{getTotalPrice().toLocaleString()}</span>
                      </div>

                      {appliedPromo && (
                        <div className="flex items-center justify-between text-lg">
                          <span className="text-green-400">Discount ({appliedPromo.promoCode.code})</span>
                          <span className="text-xl font-semibold text-green-400">-₹{appliedPromo.discountAmount.toLocaleString()}</span>
                        </div>
                      )}

                      <div className="pt-3 border-t border-white/10">
                        <div className="flex items-center justify-between text-lg mb-4">
                          <span className="text-gray-300 font-semibold">Total Amount</span>
                          <span className="text-3xl font-bold text-white">₹{getFinalTotal().toLocaleString()}</span>
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={handleProceedToDetails}
                      className="w-full bg-gradient-to-r from-brand-blue to-brand-blue-dark text-white font-bold py-4 rounded-xl hover:shadow-[0_0_30px_rgba(23,95,255,0.4)] transition-all duration-300"
                    >
                      Proceed to Checkout
                    </button>
                  </div>
                )}

                {currentStep === 'details' && (
                  <button
                    onClick={handleSubmitDetails}
                    className="w-full bg-gradient-to-r from-brand-blue to-brand-blue-dark text-white font-bold py-4 rounded-xl hover:shadow-[0_0_30px_rgba(23,95,255,0.4)] transition-all duration-300"
                  >
                    Continue to Payment
                  </button>
                )}

                {currentStep === 'payment' && (
                  <button
                    onClick={handlePaymentComplete}
                    className="w-full bg-gradient-to-r from-green-500 to-emerald-500 text-white font-bold py-4 rounded-xl hover:shadow-[0_0_30px_rgba(34,197,94,0.4)] transition-all duration-300"
                  >
                    I've Completed Payment
                  </button>
                )}
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
