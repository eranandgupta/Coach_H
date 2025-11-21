'use client';

import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { RefreshCcw } from 'lucide-react';

export default function RefundPolicy() {
  return (
    <div className="min-h-screen bg-brand-navy">
      <Navbar />

      <div className="pt-24 pb-16 px-4 md:px-6">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-brand-blue/10 rounded-2xl mb-6">
              <RefreshCcw className="w-8 h-8 text-brand-blue" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Refund Policy
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
                  <strong className="text-white">ALL SUBSCRIPTIONS ARE NON-REFUNDABLE.</strong> At Coach Himanshu, all payments made for our fitness coaching subscription plans are final and non-refundable.
                </p>
                <p className="text-gray-300 leading-relaxed">
                  By purchasing a subscription, you acknowledge and agree that you will not be entitled to a refund under any circumstances, except as explicitly stated in this policy for duplicate or erroneous charges.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-bold text-white mb-4">2. Non-Refundable Policy</h2>
                <h3 className="text-xl font-semibold text-white mb-3">2.1 All Sales Are Final</h3>
                <p className="text-gray-300 leading-relaxed mb-4">
                  Once you purchase a subscription plan (Kickstart, Consistency, Strength, or Mastery), the payment is considered final and <strong className="text-white">non-refundable</strong>, regardless of:
                </p>
                <ul className="list-disc list-inside text-gray-300 space-y-2">
                  <li>Duration of subscription (1 month, 3 months, 6 months, or 12 months)</li>
                  <li>Whether you use the services or not</li>
                  <li>Change of mind or personal circumstances</li>
                  <li>Lack of motivation or commitment</li>
                  <li>Not achieving desired fitness results</li>
                  <li>Moving to a different location</li>
                  <li>Financial difficulties</li>
                </ul>

                <h3 className="text-xl font-semibold text-white mb-3">2.2 Think Before You Buy</h3>
                <p className="text-gray-300 leading-relaxed">
                  We encourage you to carefully review the subscription plan details, terms, and pricing before making a purchase. Once payment is processed, <strong className="text-white">no refunds will be issued</strong>.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-bold text-white mb-4">3. Exceptions - Duplicate or Erroneous Charges Only</h2>
                <h3 className="text-xl font-semibold text-white mb-3">3.1 Technical Errors</h3>
                <p className="text-gray-300 leading-relaxed mb-4">
                  Refunds will ONLY be issued for:
                </p>
                <ul className="list-disc list-inside text-gray-300 space-y-2">
                  <li>Duplicate charges (charged twice for the same subscription)</li>
                  <li>Erroneous charges due to technical/payment gateway errors</li>
                  <li>Unauthorized charges (with proper verification)</li>
                </ul>

                <h3 className="text-xl font-semibold text-white mb-3">3.2 Verification Process</h3>
                <p className="text-gray-300 leading-relaxed">
                  If you believe you were charged in error, contact us immediately at <a href="mailto:info@coachhimanshu.com" className="text-brand-blue hover:underline">info@coachhimanshu.com</a> with:
                </p>
                <ul className="list-disc list-inside text-gray-300 space-y-2 mt-4">
                  <li>Transaction ID and payment proof</li>
                  <li>Detailed description of the error</li>
                  <li>Account details</li>
                </ul>
                <p className="text-gray-300 leading-relaxed mt-4">
                  We will investigate and process verified erroneous charge refunds within 7-14 business days.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-bold text-white mb-4">4. Why Subscriptions Are Non-Refundable</h2>
                <p className="text-gray-300 leading-relaxed mb-4">
                  Our coaching services involve:
                </p>
                <ul className="list-disc list-inside text-gray-300 space-y-2">
                  <li>Personalized plan creation tailored to your specific needs</li>
                  <li>Coach time and expertise dedicated to your programs</li>
                  <li>Immediate access to proprietary content and resources</li>
                  <li>24/7 WhatsApp support allocation</li>
                  <li>Digital content that cannot be "returned"</li>
                </ul>
                <p className="text-gray-300 leading-relaxed mt-4">
                  Once these services and resources are provided, they cannot be recovered, which is why all subscriptions are non-refundable.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-bold text-white mb-4">5. Cancellation Without Refund</h2>
                <p className="text-gray-300 leading-relaxed mb-4">
                  You CAN cancel your subscription at any time, but <strong className="text-white">NO refund will be issued</strong> for the remaining subscription period.
                </p>
                <ul className="list-disc list-inside text-gray-300 space-y-2">
                  <li>You will continue to have access until the end of your paid period</li>
                  <li>No refund for unused time</li>
                  <li>No further charges after current period ends</li>
                  <li>See our <a href="/cancellation-policy" className="text-brand-blue hover:underline">Cancellation Policy</a> for details</li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-bold text-white mb-4">6. Subscription Pause Option</h2>
                <p className="text-gray-300 leading-relaxed mb-4">
                  If you're facing temporary circumstances (injury, travel, work commitments), you can pause your subscription instead of canceling:
                </p>
                <ul className="list-disc list-inside text-gray-300 space-y-2">
                  <li>Pause duration: Up to 30 days per subscription period</li>
                  <li>Your subscription will be extended by the pause duration</li>
                  <li>No refund, but time is preserved</li>
                  <li>Contact us at <a href="mailto:info@coachhimanshu.com" className="text-brand-blue hover:underline">info@coachhimanshu.com</a> to arrange</li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-bold text-white mb-4">7. Promotional Offers and Discounts</h2>
                <p className="text-gray-300 leading-relaxed">
                  All subscriptions purchased during promotional periods or with discount codes are <strong className="text-white">strictly non-refundable</strong> under any circumstances.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-bold text-white mb-4">8. Chargebacks</h2>
                <p className="text-gray-300 leading-relaxed mb-4">
                  <strong className="text-white">Important:</strong> Initiating a chargeback for a legitimate subscription purchase is considered fraudulent activity.
                </p>
                <ul className="list-disc list-inside text-gray-300 space-y-2">
                  <li>All subscriptions are clearly marked as non-refundable at purchase</li>
                  <li>Unauthorized chargebacks will result in immediate account termination</li>
                  <li>We reserve the right to pursue recovery of chargeback fees and legal costs</li>
                  <li>Future subscription access will be permanently denied</li>
                  <li>Only initiate chargebacks for truly unauthorized transactions</li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-bold text-white mb-4">9. Payment Method Issues</h2>
                <h3 className="text-xl font-semibold text-white mb-3">9.1 Failed Payments</h3>
                <p className="text-gray-300 leading-relaxed mb-4">
                  If a payment fails due to insufficient funds or card issues, you are responsible for updating your payment information. No refund will be issued for service interruptions due to failed payments.
                </p>

                <h3 className="text-xl font-semibold text-white mb-3">9.2 Duplicate Charges</h3>
                <p className="text-gray-300 leading-relaxed">
                  If you are charged multiple times for the same subscription due to a technical error, we will refund the duplicate charges immediately upon verification. This is the ONLY situation where refunds are issued.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-bold text-white mb-4">10. Acknowledgment and Acceptance</h2>
                <p className="text-gray-300 leading-relaxed">
                  By purchasing a subscription, you acknowledge that:
                </p>
                <ul className="list-disc list-inside text-gray-300 space-y-2 mt-4">
                  <li>You have read and understood this Non-Refundable Policy</li>
                  <li>You accept that all subscriptions are final and non-refundable</li>
                  <li>You will not dispute legitimate charges or request chargebacks</li>
                  <li>You are making an informed purchase decision</li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-bold text-white mb-4">11. Modifications to Policy</h2>
                <p className="text-gray-300 leading-relaxed">
                  We reserve the right to modify this Refund Policy at any time. Changes will be effective immediately upon posting on our website. Your continued use of our services after changes constitutes acceptance of the updated policy.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-bold text-white mb-4">12. Governing Law</h2>
                <p className="text-gray-300 leading-relaxed">
                  This Refund Policy is governed by the laws of India. Any disputes will be subject to the exclusive jurisdiction of courts in India.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-white mb-4">13. Contact Us</h2>
                <p className="text-gray-300 leading-relaxed mb-4">
                  For questions about this non-refundable policy or to report duplicate charges:
                </p>
                <div className="bg-brand-navy-light/50 rounded-lg p-6 border border-brand-blue/20">
                  <p className="text-white font-semibold mb-2">Coach Himanshu - Support</p>
                  <p className="text-gray-300">Email: <a href="mailto:info@coachhimanshu.com" className="text-brand-blue hover:underline">info@coachhimanshu.com</a></p>
                  <p className="text-gray-300">Phone: <a href="tel:+917303484648" className="text-brand-blue hover:underline">+91 7303484648</a></p>
                </div>
              </section>

              <div className="mt-8 p-6 bg-red-500/10 border-2 border-red-500/30 rounded-lg">
                <p className="text-white font-semibold mb-2">⚠️ IMPORTANT REMINDER</p>
                <p className="text-gray-300 text-sm leading-relaxed">
                  <strong className="text-white">ALL SUBSCRIPTIONS ARE 100% NON-REFUNDABLE.</strong> Please carefully consider your purchase decision before subscribing. If you have questions or concerns, contact us BEFORE purchasing. Once payment is processed, it cannot be refunded under any circumstances except for duplicate/erroneous charges.
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
