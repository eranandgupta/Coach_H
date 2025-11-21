'use client';

import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import AnnouncementBar from '@/components/AnnouncementBar';
import { XCircle } from 'lucide-react';

export default function CancellationPolicy() {
  return (
    <div className="min-h-screen bg-brand-navy">
      <AnnouncementBar />
      <Navbar />

      <div className="pt-32 pb-16 px-4 md:px-6">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-brand-blue/10 rounded-2xl mb-6">
              <XCircle className="w-8 h-8 text-brand-blue" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Cancellation Policy
            </h1>
            <p className="text-gray-400">
              Last Updated: January 2025
            </p>
          </div>

          {/* Content */}
          <div className="bg-brand-navy-light/30 rounded-2xl p-8 md:p-12 border border-brand-navy-light/20">
            <div className="prose prose-invert max-w-none">
              <section className="mb-8">
                <h2 className="text-2xl font-bold text-white mb-4">1. Overview</h2>
                <p className="text-gray-300 leading-relaxed mb-4">
                  <strong className="text-white">You can cancel your subscription at any time, but ALL subscriptions are NON-REFUNDABLE.</strong>
                </p>
                <p className="text-gray-300 leading-relaxed">
                  This Cancellation Policy outlines how to cancel your subscription with Coach Himanshu. While you have the freedom to cancel at any time, please note that no refunds will be issued for any remaining subscription period. See our <a href="/refund-policy" className="text-brand-blue hover:underline">Refund Policy</a> for details.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-bold text-white mb-4">2. Cancellation Rights</h2>
                <h3 className="text-xl font-semibold text-white mb-3">2.1 Your Right to Cancel</h3>
                <p className="text-gray-300 leading-relaxed mb-4">
                  You have the right to cancel your subscription at any time during your subscription period. However, <strong className="text-white">cancellation does NOT entitle you to a refund</strong>.
                </p>

                <h3 className="text-xl font-semibold text-white mb-3">2.2 What Happens When You Cancel</h3>
                <p className="text-gray-300 leading-relaxed">
                  When you cancel your subscription:
                </p>
                <ul className="list-disc list-inside text-gray-300 space-y-2 mt-4">
                  <li>You will continue to have full access until the end of your current paid period</li>
                  <li><strong className="text-white">NO refund will be issued for the remaining time</strong></li>
                  <li>No further charges will be made after the current period expires</li>
                  <li>You will not be automatically renewed for the next period</li>
                  <li>Access to coaching services ends when the paid period expires</li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-bold text-white mb-4">3. No Refund on Cancellation</h2>
                <h3 className="text-xl font-semibold text-white mb-3">3.1 All Plans Are Non-Refundable</h3>
                <p className="text-gray-300 leading-relaxed mb-4">
                  <strong className="text-white">Important:</strong> Regardless of when you cancel, you will NOT receive a refund for:
                </p>
                <ul className="list-disc list-inside text-gray-300 space-y-2">
                  <li>Monthly Plans (Kickstart - ₹799/month) - No refund for current month</li>
                  <li>3-Month Plans (Consistency - ₹1,799) - No refund for remaining months</li>
                  <li>6-Month Plans (Strength - ₹2,999) - No refund for remaining months</li>
                  <li>12-Month Plans (Mastery - ₹5,499) - No refund for remaining months</li>
                </ul>

                <h3 className="text-xl font-semibold text-white mb-3">3.2 Example Scenarios</h3>
                <div className="bg-brand-navy-light/50 rounded-lg p-4 mb-4">
                  <p className="text-gray-300 text-sm leading-relaxed">
                    <strong className="text-white">Example 1:</strong> You purchase a 6-month plan for ₹2,999 and cancel after 2 months. You will continue to have access for the remaining 4 months, but you will NOT receive a refund of any amount.
                  </p>
                </div>
                <div className="bg-brand-navy-light/50 rounded-lg p-4">
                  <p className="text-gray-300 text-sm leading-relaxed">
                    <strong className="text-white">Example 2:</strong> You purchase a monthly plan for ₹799 and cancel after 2 weeks. You will continue to have access for the remaining 2 weeks of the month, but you will NOT receive a refund.
                  </p>
                </div>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-bold text-white mb-4">4. How to Cancel Your Subscription</h2>
                <h3 className="text-xl font-semibold text-white mb-3">4.1 Method 1: Email Cancellation</h3>
                <ol className="list-decimal list-inside text-gray-300 space-y-2 mb-4">
                  <li>Send an email to <a href="mailto:info@coachhimanshu.com" className="text-brand-blue hover:underline">info@coachhimanshu.com</a></li>
                  <li>Use subject line: "Cancel Subscription - [Your Name]"</li>
                  <li>Include your registered email address and reason for cancellation (optional)</li>
                  <li>You'll receive a confirmation email within 24-48 hours</li>
                </ol>

                <h3 className="text-xl font-semibold text-white mb-3">4.2 Method 2: Dashboard Cancellation</h3>
                <ol className="list-decimal list-inside text-gray-300 space-y-2 mb-4">
                  <li>Log in to your account dashboard</li>
                  <li>Navigate to "Subscription Settings"</li>
                  <li>Click "Cancel Subscription"</li>
                  <li>Follow the on-screen instructions</li>
                  <li>You'll receive an immediate confirmation</li>
                </ol>

                <h3 className="text-xl font-semibold text-white mb-3">4.3 Method 3: WhatsApp Request</h3>
                <p className="text-gray-300 leading-relaxed">
                  Message us on WhatsApp at <a href="tel:+917303484648" className="text-brand-blue hover:underline">+91 7303484648</a> with your cancellation request. Our team will guide you through the process.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-bold text-white mb-4">5. Subscription Pause Option (Alternative to Cancellation)</h2>
                <h3 className="text-xl font-semibold text-white mb-3">5.1 Alternative to Cancellation</h3>
                <p className="text-gray-300 leading-relaxed mb-4">
                  Before canceling, consider pausing your subscription if you're facing temporary circumstances:
                </p>
                <ul className="list-disc list-inside text-gray-300 space-y-2">
                  <li>Injury or medical recovery</li>
                  <li>Travel or work commitments</li>
                  <li>Personal reasons requiring a break</li>
                </ul>

                <h3 className="text-xl font-semibold text-white mb-3">5.2 Pause Terms</h3>
                <ul className="list-disc list-inside text-gray-300 space-y-2">
                  <li>Maximum pause duration: 30 days per subscription period</li>
                  <li>Your subscription will be extended by the pause duration</li>
                  <li>No additional charges during pause</li>
                  <li>No refund - your paid time is preserved and extended</li>
                  <li>Request via email at <a href="mailto:info@coachhimanshu.com" className="text-brand-blue hover:underline">info@coachhimanshu.com</a> or WhatsApp</li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-bold text-white mb-4">6. What Happens After Cancellation</h2>
                <h3 className="text-xl font-semibold text-white mb-3">6.1 Immediate Effects</h3>
                <ul className="list-disc list-inside text-gray-300 space-y-2 mb-4">
                  <li>You receive a cancellation confirmation email</li>
                  <li>Access to coaching services continues until period end</li>
                  <li>Billing is stopped (no future charges)</li>
                </ul>

                <h3 className="text-xl font-semibold text-white mb-3">6.2 End of Billing Period</h3>
                <ul className="list-disc list-inside text-gray-300 space-y-2 mb-4">
                  <li>Access to personalized plans is discontinued</li>
                  <li>WhatsApp support is terminated</li>
                  <li>Dashboard access becomes read-only (view past progress)</li>
                  <li>Your data is retained according to our Privacy Policy</li>
                </ul>

                <h3 className="text-xl font-semibold text-white mb-3">6.3 Data Retention</h3>
                <p className="text-gray-300 leading-relaxed">
                  After cancellation, we retain your data for 90 days in case you decide to reactivate. After 90 days, your data may be anonymized or deleted (except as required by law).
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-bold text-white mb-4">7. Reactivation</h2>
                <h3 className="text-xl font-semibold text-white mb-3">7.1 Within 90 Days</h3>
                <p className="text-gray-300 leading-relaxed mb-4">
                  If you reactivate within 90 days of cancellation:
                </p>
                <ul className="list-disc list-inside text-gray-300 space-y-2 mb-4">
                  <li>Your previous data and progress will be restored</li>
                  <li>You can choose any available subscription plan</li>
                  <li>Welcome back bonus may be offered (at our discretion)</li>
                </ul>

                <h3 className="text-xl font-semibold text-white mb-3">7.2 After 90 Days</h3>
                <p className="text-gray-300 leading-relaxed">
                  Reactivation after 90 days is treated as a new subscription. Previous data may not be available, and you'll start fresh with a new onboarding process.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-bold text-white mb-4">8. Cancellation by Coach Himanshu</h2>
                <h3 className="text-xl font-semibold text-white mb-3">8.1 Our Right to Cancel</h3>
                <p className="text-gray-300 leading-relaxed mb-4">
                  We reserve the right to cancel your subscription immediately if:
                </p>
                <ul className="list-disc list-inside text-gray-300 space-y-2">
                  <li>You violate our Terms of Service</li>
                  <li>You engage in abusive or harassing behavior</li>
                  <li>Payment fraud is detected</li>
                  <li>You provide false health information that endangers safety</li>
                </ul>

                <h3 className="text-xl font-semibold text-white mb-3">8.2 No Refund Policy Applies</h3>
                <p className="text-gray-300 leading-relaxed">
                  Even if we cancel your subscription due to Terms violations, no refund will be issued for any remaining subscription period.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-bold text-white mb-4">9. Special Circumstances</h2>
                <p className="text-gray-300 leading-relaxed mb-4">
                  <strong className="text-white">Important:</strong> The non-refundable policy applies to ALL circumstances, including:
                </p>
                <ul className="list-disc list-inside text-gray-300 space-y-2">
                  <li>Medical conditions or injuries</li>
                  <li>Relocation or travel</li>
                  <li>Financial difficulties</li>
                  <li>Personal emergencies</li>
                  <li>Dissatisfaction with results</li>
                </ul>
                <p className="text-gray-300 leading-relaxed mt-4">
                  While we understand that unexpected situations arise, our non-refundable policy remains in effect. We recommend using the subscription pause option (up to 30 days) if you need temporary time off.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-bold text-white mb-4">10. No-Show and Inactivity Policy</h2>
                <p className="text-gray-300 leading-relaxed mb-4">
                  If you remain inactive (no login or communication) for 30+ consecutive days:
                </p>
                <ul className="list-disc list-inside text-gray-300 space-y-2">
                  <li>We'll send reminder emails to check on your progress</li>
                  <li>Your subscription continues and charges apply</li>
                  <li>No refund for inactive periods (subscription remains active)</li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-bold text-white mb-4">11. Promotional and Discounted Subscriptions</h2>
                <p className="text-gray-300 leading-relaxed">
                  All promotional and discounted subscriptions are <strong className="text-white">100% non-refundable</strong> upon cancellation, just like regular-priced subscriptions.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-white mb-4">12. Contact for Cancellation Support</h2>
                <p className="text-gray-300 leading-relaxed mb-4">
                  Need help with cancellation or have questions?
                </p>
                <div className="bg-brand-navy-light/50 rounded-lg p-6 border border-brand-blue/20">
                  <p className="text-white font-semibold mb-2">Coach Himanshu - Cancellation Support</p>
                  <p className="text-gray-300">Email: <a href="mailto:info@coachhimanshu.com" className="text-brand-blue hover:underline">info@coachhimanshu.com</a></p>
                  <p className="text-gray-300">Phone/WhatsApp: <a href="tel:+917303484648" className="text-brand-blue hover:underline">+91 7303484648</a></p>
                  <p className="text-gray-300 mt-3 text-sm">We're here to help! Response within 24-48 hours.</p>
                </div>
              </section>

              <div className="mt-8 p-6 bg-red-500/10 border-2 border-red-500/30 rounded-lg">
                <p className="text-white font-semibold mb-2">⚠️ IMPORTANT REMINDER</p>
                <p className="text-gray-300 text-sm leading-relaxed mb-3">
                  <strong className="text-white">You can cancel anytime, but NO REFUNDS will be issued.</strong> You will continue to have full access until the end of your paid period.
                </p>
                <p className="text-gray-300 text-sm leading-relaxed">
                  Before you cancel, consider pausing your subscription or reaching out to us. We may be able to help with schedule adjustments or other solutions. Your fitness journey matters to us!
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
