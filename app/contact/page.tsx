'use client';

import { useState } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import AnnouncementBar from '@/components/AnnouncementBar';
import { Mail, Phone, Instagram, Youtube, MapPin, Clock, CheckCircle, AlertCircle, Facebook, Twitter } from 'lucide-react';

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus('idle');
    setErrorMessage('');

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to submit form');
      }

      setSubmitStatus('success');
      setFormData({ name: '', email: '', phone: '', subject: '', message: '' });

      // Clear success message after 5 seconds
      setTimeout(() => setSubmitStatus('idle'), 5000);
    } catch (error) {
      setSubmitStatus('error');
      setErrorMessage(
        error instanceof Error ? error.message : 'Failed to submit form. Please try again.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };
  return (
    <div className="min-h-screen bg-brand-navy">
      <AnnouncementBar />
      <Navbar />

      <div className="pt-32 pb-16 px-4 md:px-6">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Get in Touch
            </h1>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              Have questions? We're here to help you start your fitness journey
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12">
            {/* Contact Information */}
            <div className="space-y-6">
              <div className="bg-brand-navy-light/30 rounded-2xl p-8 border border-brand-navy-light/20">
                <h2 className="text-2xl font-bold text-white mb-6">Contact Information</h2>

                {/* Email */}
                <div className="flex items-start gap-4 mb-6">
                  <div className="w-12 h-12 bg-brand-blue/10 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Mail className="w-6 h-6 text-brand-blue" />
                  </div>
                  <div>
                    <h3 className="text-white font-semibold mb-1">Email</h3>
                    <a
                      href="mailto:info@coachhimanshu.com"
                      className="text-gray-300 hover:text-brand-blue transition-colors"
                    >
                      info@coachhimanshu.com
                    </a>
                    <p className="text-gray-400 text-sm mt-1">
                      Response within 24-48 hours
                    </p>
                  </div>
                </div>

                {/* Phone/WhatsApp */}
                <div className="flex items-start gap-4 mb-6">
                  <div className="w-12 h-12 bg-brand-blue/10 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Phone className="w-6 h-6 text-brand-blue" />
                  </div>
                  <div>
                    <h3 className="text-white font-semibold mb-1">Phone/WhatsApp</h3>
                    <a
                      href="tel:+917303484648"
                      className="text-gray-300 hover:text-brand-blue transition-colors"
                    >
                      +91 7303484648
                    </a>
                    <p className="text-gray-400 text-sm mt-1">
                      24/7 WhatsApp support for clients
                    </p>
                  </div>
                </div>

                {/* Location */}
                <div className="flex items-start gap-4 mb-6">
                  <div className="w-12 h-12 bg-brand-blue/10 rounded-xl flex items-center justify-center flex-shrink-0">
                    <MapPin className="w-6 h-6 text-brand-blue" />
                  </div>
                  <div>
                    <h3 className="text-white font-semibold mb-1">Location</h3>
                    <p className="text-gray-300">Online Coaching - Serving India & Worldwide</p>
                    <p className="text-gray-400 text-sm mt-1">
                      Virtual fitness coaching from anywhere
                    </p>
                  </div>
                </div>

                {/* Business Hours */}
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-brand-blue/10 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Clock className="w-6 h-6 text-brand-blue" />
                  </div>
                  <div>
                    <h3 className="text-white font-semibold mb-1">Business Hours</h3>
                    <p className="text-gray-300">Monday - Saturday: 6:00 AM - 10:00 PM IST</p>
                    <p className="text-gray-300">Sunday: 8:00 AM - 8:00 PM IST</p>
                    <p className="text-gray-400 text-sm mt-1">
                      WhatsApp support available 24/7 for active clients
                    </p>
                  </div>
                </div>
              </div>

              {/* Social Media */}
              <div className="bg-brand-navy-light/30 rounded-2xl p-8 border border-brand-navy-light/20">
                <h2 className="text-2xl font-bold text-white mb-6">Follow Us</h2>
                <div className="space-y-4">
                  <a
                    href="https://www.facebook.com/CouchHimanshuSquad/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-4 p-4 bg-brand-navy-light/50 rounded-xl hover:bg-brand-navy-light transition-all group"
                  >
                    <div className="w-12 h-12 bg-blue-500/10 rounded-xl flex items-center justify-center group-hover:bg-blue-500/20 transition-all">
                      <Facebook className="w-6 h-6 text-blue-500" />
                    </div>
                    <div>
                      <h3 className="text-white font-semibold">Facebook</h3>
                      <p className="text-gray-400 text-sm">Coach Himanshu Squad</p>
                    </div>
                  </a>

                  <a
                    href="https://www.instagram.com/coachhimanshusquad_"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-4 p-4 bg-brand-navy-light/50 rounded-xl hover:bg-brand-navy-light transition-all group"
                  >
                    <div className="w-12 h-12 bg-pink-500/10 rounded-xl flex items-center justify-center group-hover:bg-pink-500/20 transition-all">
                      <Instagram className="w-6 h-6 text-pink-500" />
                    </div>
                    <div>
                      <h3 className="text-white font-semibold">Instagram</h3>
                      <p className="text-gray-400 text-sm">@coachhimanshusquad_</p>
                    </div>
                  </a>

                  <a
                    href="https://x.com/coach_himanshu_"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-4 p-4 bg-brand-navy-light/50 rounded-xl hover:bg-brand-navy-light transition-all group"
                  >
                    <div className="w-12 h-12 bg-gray-500/10 rounded-xl flex items-center justify-center group-hover:bg-gray-500/20 transition-all">
                      <Twitter className="w-6 h-6 text-gray-300" />
                    </div>
                    <div>
                      <h3 className="text-white font-semibold">X (Twitter)</h3>
                      <p className="text-gray-400 text-sm">@coach_himanshu_</p>
                    </div>
                  </a>

                  <a
                    href="https://www.youtube.com/@CoachHimanshuKataria"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-4 p-4 bg-brand-navy-light/50 rounded-xl hover:bg-brand-navy-light transition-all group"
                  >
                    <div className="w-12 h-12 bg-red-500/10 rounded-xl flex items-center justify-center group-hover:bg-red-500/20 transition-all">
                      <Youtube className="w-6 h-6 text-red-500" />
                    </div>
                    <div>
                      <h3 className="text-white font-semibold">YouTube</h3>
                      <p className="text-gray-400 text-sm">Coach Himanshu Kataria</p>
                    </div>
                  </a>
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <div className="bg-brand-navy-light/30 rounded-2xl p-8 border border-brand-navy-light/20">
              <h2 className="text-2xl font-bold text-white mb-6">Send Us a Message</h2>

              {/* Success Message */}
              {submitStatus === 'success' && (
                <div className="mb-6 p-4 bg-green-500/10 border border-green-500/30 rounded-xl flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-green-500 font-semibold">Message sent successfully!</p>
                    <p className="text-gray-300 text-sm mt-1">
                      Thank you for contacting us. We'll get back to you within 24-48 hours.
                    </p>
                  </div>
                </div>
              )}

              {/* Error Message */}
              {submitStatus === 'error' && (
                <div className="mb-6 p-4 bg-red-500/10 border border-red-500/30 rounded-xl flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-red-500 font-semibold">Failed to send message</p>
                    <p className="text-gray-300 text-sm mt-1">{errorMessage}</p>
                  </div>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Name */}
                <div>
                  <label htmlFor="name" className="block text-white font-medium mb-2">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    disabled={isSubmitting}
                    className="w-full px-4 py-3 bg-brand-navy border border-brand-navy-light/30 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-brand-blue transition-colors disabled:opacity-50"
                    placeholder="Enter your full name"
                  />
                </div>

                {/* Email */}
                <div>
                  <label htmlFor="email" className="block text-white font-medium mb-2">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    disabled={isSubmitting}
                    className="w-full px-4 py-3 bg-brand-navy border border-brand-navy-light/30 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-brand-blue transition-colors disabled:opacity-50"
                    placeholder="your.email@example.com"
                  />
                </div>

                {/* Phone */}
                <div>
                  <label htmlFor="phone" className="block text-white font-medium mb-2">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    disabled={isSubmitting}
                    className="w-full px-4 py-3 bg-brand-navy border border-brand-navy-light/30 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-brand-blue transition-colors disabled:opacity-50"
                    placeholder="+91 XXXXX XXXXX"
                  />
                </div>

                {/* Subject */}
                <div>
                  <label htmlFor="subject" className="block text-white font-medium mb-2">
                    Subject *
                  </label>
                  <select
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleInputChange}
                    required
                    disabled={isSubmitting}
                    className="w-full px-4 py-3 bg-brand-navy border border-brand-navy-light/30 rounded-xl text-white focus:outline-none focus:border-brand-blue transition-colors disabled:opacity-50"
                  >
                    <option value="">Select a subject</option>
                    <option value="subscription">Subscription Inquiry</option>
                    <option value="plans">Plan Information</option>
                    <option value="support">Technical Support</option>
                    <option value="refund">Refund Request</option>
                    <option value="partnership">Partnership Opportunity</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                {/* Message */}
                <div>
                  <label htmlFor="message" className="block text-white font-medium mb-2">
                    Message *
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    required
                    disabled={isSubmitting}
                    rows={5}
                    className="w-full px-4 py-3 bg-brand-navy border border-brand-navy-light/30 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-brand-blue transition-colors resize-none disabled:opacity-50"
                    placeholder="Tell us how we can help you..."
                  ></textarea>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-4 bg-gradient-to-r from-brand-blue to-brand-blue/80 hover:from-brand-blue/90 hover:to-brand-blue/70 text-white font-semibold rounded-xl transition-all duration-300 shadow-lg shadow-brand-blue/20 hover:shadow-brand-blue/40 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <span className="flex items-center justify-center gap-2">
                      <svg
                        className="animate-spin h-5 w-5"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      Sending...
                    </span>
                  ) : (
                    'Send Message'
                  )}
                </button>

                <p className="text-gray-400 text-sm text-center">
                  We'll respond within 24-48 hours
                </p>
              </form>
            </div>
          </div>

          {/* FAQ Quick Links */}
          <div className="mt-12 bg-brand-navy-light/30 rounded-2xl p-8 border border-brand-navy-light/20">
            <h2 className="text-2xl font-bold text-white mb-6 text-center">
              Frequently Asked Questions
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <h3 className="text-white font-semibold mb-2">Subscription Plans</h3>
                <p className="text-gray-400 text-sm mb-3">
                  Learn about our pricing and what's included
                </p>
                <a
                  href="/#plans"
                  className="text-brand-blue hover:underline text-sm font-medium"
                >
                  View Plans →
                </a>
              </div>

              <div className="text-center">
                <h3 className="text-white font-semibold mb-2">Refund & Cancellation</h3>
                <p className="text-gray-400 text-sm mb-3">
                  Understand our refund and cancellation policies
                </p>
                <a
                  href="/refund-policy"
                  className="text-brand-blue hover:underline text-sm font-medium"
                >
                  Read Policy →
                </a>
              </div>

              <div className="text-center">
                <h3 className="text-white font-semibold mb-2">Getting Started</h3>
                <p className="text-gray-400 text-sm mb-3">
                  Take our fitness assessment to begin
                </p>
                <a
                  href="/assessment"
                  className="text-brand-blue hover:underline text-sm font-medium"
                >
                  Start Assessment →
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
