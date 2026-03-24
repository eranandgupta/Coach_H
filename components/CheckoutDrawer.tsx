'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { X, ShoppingCart, Trash2, CheckCircle, User, Phone, Mail, Target, FileText, MessageCircle, ArrowLeft, Tag, Loader2, Heart, Users, CreditCard } from 'lucide-react';
import { useCart } from '@/contexts/CartContext';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

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

  // Receipt state
  const [paymentReceipt, setPaymentReceipt] = useState<any>(null);
  const [isGeneratingReceipt, setIsGeneratingReceipt] = useState(false);

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

const [isProcessingPayment, setIsProcessingPayment] = useState(false);

  // Load Razorpay checkout script
  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    document.body.appendChild(script);
    return () => {
      if (document.body.contains(script)) document.body.removeChild(script);
    };
  }, []);

  const handleRazorpayPayment = async () => {
    const plan = cartItems[0];
    if (!plan) return;

    setIsProcessingPayment(true);

    try {
      const orderRes = await fetch('/api/payment/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: getFinalTotal(),
          planId: plan.id,
          planName: plan.name,
          name: formData.name,
          email: formData.email,
        }),
      });

      if (!orderRes.ok) throw new Error('Failed to create payment order');

      const orderData = await orderRes.json();

      const options = {
        key: orderData.keyId,
        amount: orderData.amount,
        currency: orderData.currency,
        name: 'Coach H',
        description: plan.name,
        order_id: orderData.orderId,
        prefill: {
          name: formData.name,
          email: formData.email,
          contact: `91${formData.whatsapp}`,
        },
        theme: { color: '#175FFF' },
        handler: async (response: any) => {
          try {
            setIsGeneratingReceipt(true);
            setCurrentStep('success');
            const verifyRes = await fetch('/api/payment/verify', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                planId: plan.id,
                name: formData.name,
                email: formData.email,
                whatsapp: formData.whatsapp,
                goal: formData.goal,
                notes: formData.notes,
                partner2Name: formData.partner2Name,
                partner2Email: formData.partner2Email,
                partner2Whatsapp: formData.partner2Whatsapp,
                partner2Goal: formData.partner2Goal,
              }),
            });

            if (!verifyRes.ok) {
              const errData = await verifyRes.json();
              throw new Error(errData.error || 'Verification failed');
            }

            const verifyData = await verifyRes.json();
            setPaymentReceipt(verifyData.receipt || null);
            setIsGeneratingReceipt(false);

            if (appliedPromo) {
              try {
                await fetch('/api/promo-codes/apply', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({ code: appliedPromo.promoCode.code }),
                });
              } catch (_) {}
            }
          } catch (error: any) {
            setIsGeneratingReceipt(false);
            alert(`Payment verification failed: ${error.message}\n\nPlease contact support with Payment ID: ${response.razorpay_payment_id}`);
          }
        },
        modal: {
          ondismiss: () => setIsProcessingPayment(false),
        },
      };

      const rzp = new (window as any).Razorpay(options);
      rzp.on('payment.failed', () => {
        alert('Payment failed. Please try again.');
        setIsProcessingPayment(false);
      });
      rzp.open();
      setIsProcessingPayment(false);
    } catch (error) {
      console.error('Payment error:', error);
      alert('Failed to initiate payment. Please try again.');
      setIsProcessingPayment(false);
    }
  };

  const handleClose = () => {
    closeCheckout();
    setCurrentStep('cart');
    setFormData({ name: '', whatsapp: '', email: '', goal: '', notes: '', partner2Name: '', partner2Whatsapp: '', partner2Email: '', partner2Goal: '' });
    setErrors({});
    setPromoCode('');
    setAppliedPromo(null);
    setPromoError('');
    setPaymentReceipt(null);
    setIsGeneratingReceipt(false);
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
                  {currentStep === 'payment' && <CreditCard className="w-6 h-6 text-brand-blue" />}
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
                <div className="space-y-6">
                  <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-4">
                    <CheckCircle className="w-6 h-6 text-green-400 inline mr-2" />
                    <span className="text-green-400 font-semibold">Details Confirmed</span>
                    <p className="text-gray-300 text-sm mt-2">
                      Your coach will create a personalized plan once payment is complete.
                    </p>
                  </div>

                  {/* Order Summary */}
                  <div className="bg-white/5 border border-white/10 rounded-xl p-5">
                    <h3 className="text-white font-semibold mb-4">Order Summary</h3>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-gray-400 text-sm">Plan</span>
                        <span className="text-white text-sm font-medium">{cartItems[0]?.name}</span>
                      </div>
                      {appliedPromo && (
                        <>
                          <div className="flex items-center justify-between">
                            <span className="text-gray-400 text-sm">Original Price</span>
                            <span className="text-gray-400 text-sm line-through">₹{getTotalPrice().toLocaleString()}</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-green-400 text-sm">Discount ({appliedPromo.promoCode.code})</span>
                            <span className="text-green-400 text-sm">-₹{appliedPromo.discountAmount.toLocaleString()}</span>
                          </div>
                        </>
                      )}
                      <div className="pt-3 border-t border-white/10 flex items-center justify-between">
                        <span className="text-gray-300 font-semibold">Total Payable</span>
                        <span className="text-2xl font-bold text-white">₹{getFinalTotal().toLocaleString()}</span>
                      </div>
                    </div>
                  </div>

                  {/* Payment Methods Info */}
                  <div className="bg-brand-blue/10 border border-brand-blue/30 rounded-xl p-5">
                    <h4 className="text-white font-semibold mb-3">Secure Payment via Razorpay</h4>
                    <div className="grid grid-cols-2 gap-2 mb-4">
                      {['UPI / QR Code', 'Credit / Debit Card', 'Net Banking', 'Wallets'].map((method) => (
                        <div key={method} className="bg-white/5 rounded-lg px-3 py-2 text-center">
                          <span className="text-gray-300 text-xs">{method}</span>
                        </div>
                      ))}
                    </div>
                    <p className="text-gray-400 text-xs">
                      Your payment is secured by Razorpay with 256-bit SSL encryption. Your account will be activated instantly after payment.
                    </p>
                  </div>

                  {/* Need Help */}
                  <div className="text-center">
                    <p className="text-gray-500 text-sm mb-2">Having trouble? Contact us on WhatsApp</p>
                    <a
                      href="https://wa.me/917303484648"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 bg-green-500/10 text-green-400 border border-green-500/20 px-4 py-2 rounded-lg hover:bg-green-500/20 transition-all text-sm"
                    >
                      <MessageCircle className="w-4 h-4" />
                      WhatsApp Support
                    </a>
                  </div>
                </div>
              )}

              {/* STEP 4: SUCCESS + RECEIPT */}
              {currentStep === 'success' && (
                <div className="py-6">
                  <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ type: 'spring', duration: 0.5 }}
                    className="text-center mb-6"
                  >
                    <CheckCircle className="w-16 h-16 text-green-400 mx-auto mb-3" />
                    <h2 className="text-2xl font-bold text-white">Payment Successful!</h2>
                    <p className="text-gray-400 text-sm mt-1">Your subscription is now active.</p>
                  </motion.div>

                  {/* Receipt generating loader */}
                  {isGeneratingReceipt && (
                    <div className="flex flex-col items-center justify-center gap-3 py-6 mb-5 bg-white/5 border border-white/10 rounded-xl">
                      <Loader2 className="w-8 h-8 text-brand-blue animate-spin" />
                      <p className="text-gray-300 text-sm">Generating your receipt...</p>
                      <p className="text-gray-500 text-xs">Please do not refresh the page</p>
                    </div>
                  )}

                  {/* Receipt */}
                  {!isGeneratingReceipt && paymentReceipt && (
                    <div id="payment-receipt" className="bg-white/5 border border-white/10 rounded-xl p-5 mb-5 text-left">
                      <div className="flex items-center justify-between mb-4">
                        <div>
                          <h3 className="text-white font-bold text-lg">Payment Receipt</h3>
                          <p className="text-gray-500 text-xs">{new Date(paymentReceipt.startDate).toLocaleString('en-IN')}</p>
                        </div>
                        <button
                          onClick={() => window.print()}
                          className="flex items-center gap-1.5 bg-white/10 hover:bg-white/20 text-gray-300 text-xs px-3 py-1.5 rounded-lg transition-all"
                        >
                          <FileText className="w-3.5 h-3.5" />
                          Print
                        </button>
                      </div>

                      <div className="space-y-2.5 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-400">Receipt No.</span>
                          <span className="text-white font-mono text-xs">{paymentReceipt.paymentId}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">Order ID</span>
                          <span className="text-white font-mono text-xs">{paymentReceipt.orderId}</span>
                        </div>
                        <div className="border-t border-white/10 pt-2.5">
                          <div className="flex justify-between">
                            <span className="text-gray-400">Plan</span>
                            <span className="text-white font-medium">{paymentReceipt.planName}</span>
                          </div>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">Name</span>
                          <span className="text-white">{paymentReceipt.customerName}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">Email</span>
                          <span className="text-white text-xs">{paymentReceipt.customerEmail}</span>
                        </div>
                        {paymentReceipt.goal && (
                          <div className="flex justify-between">
                            <span className="text-gray-400">Goal</span>
                            <span className="text-white capitalize">{paymentReceipt.goal.replace(/-/g, ' ')}</span>
                          </div>
                        )}
                        <div className="flex justify-between">
                          <span className="text-gray-400">Valid Till</span>
                          <span className="text-white">{new Date(paymentReceipt.endDate).toLocaleDateString('en-IN')}</span>
                        </div>
                        <div className="border-t border-white/10 pt-2.5 flex justify-between items-center">
                          <span className="text-gray-300 font-semibold">Amount Paid</span>
                          <span className="text-green-400 text-xl font-bold">₹{paymentReceipt.paidAmount?.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">Payment Method</span>
                          <span className="text-white">Razorpay</span>
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-4 text-left mb-4">
                    <p className="text-gray-300 text-sm font-semibold text-white mb-2">What's Next:</p>
                    <ul className="space-y-1.5 text-sm text-gray-300">
                      <li>• Check your email for login credentials</li>
                      <li>• Your coach will review your details</li>
                      <li>• Personalized plan will be created within 24hrs</li>
                      <li>• You'll get access to your dashboard</li>
                    </ul>
                  </div>
                  <p className="text-center text-brand-blue font-semibold text-sm">All the best for your fitness journey! 💪</p>
                  <button
                    onClick={() => {
                      clearCart();
                      closeCheckout();
                      setCurrentStep('cart');
                      setFormData({ name: '', whatsapp: '', email: '', goal: '', notes: '', partner2Name: '', partner2Whatsapp: '', partner2Email: '', partner2Goal: '' });
                      setPaymentReceipt(null);
                      router.push('/');
                    }}
                    className="mt-4 w-full bg-brand-blue hover:bg-brand-blue/90 text-white font-semibold py-3 rounded-xl transition-all"
                  >
                    Go to Home
                  </button>
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
                    onClick={handleRazorpayPayment}
                    disabled={isProcessingPayment}
                    className="w-full bg-gradient-to-r from-brand-blue to-brand-blue-dark text-white font-bold py-4 rounded-xl hover:shadow-[0_0_30px_rgba(23,95,255,0.4)] transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {isProcessingPayment ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        Preparing Payment...
                      </>
                    ) : (
                      <>Pay ₹{getFinalTotal().toLocaleString()} Securely</>
                    )}
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
