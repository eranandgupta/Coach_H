'use client';

import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import AnnouncementBar from '@/components/AnnouncementBar';
import { FileText } from 'lucide-react';

export default function TermsOfService() {
  return (
    <div className="min-h-screen bg-brand-navy">
      <AnnouncementBar />
      <Navbar />

      <div className="pt-32 pb-16 px-4 md:px-6">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-brand-blue/10 rounded-2xl mb-6">
              <FileText className="w-8 h-8 text-brand-blue" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Terms of Service
            </h1>
            <p className="text-gray-400">
              Last Updated: January 2025
            </p>
          </div>

          {/* Content */}
          <div className="bg-brand-navy-light/30 rounded-2xl p-8 md:p-12 border border-brand-navy-light/20">
            <div className="prose prose-invert max-w-none">
              <section className="mb-8">
                <h2 className="text-2xl font-bold text-white mb-4">1. Acceptance of Terms</h2>
                <p className="text-gray-300 leading-relaxed mb-4">
                  Welcome to Coach Himanshu. By accessing or using our fitness coaching platform, mobile application, or services (collectively, the "Services"), you agree to be bound by these Terms of Service ("Terms").
                </p>
                <p className="text-gray-300 leading-relaxed">
                  If you do not agree to these Terms, please do not use our Services. We reserve the right to modify these Terms at any time, and your continued use constitutes acceptance of any changes.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-bold text-white mb-4">2. Description of Services</h2>
                <p className="text-gray-300 leading-relaxed mb-4">
                  Coach Himanshu provides online fitness coaching services, including:
                </p>
                <ul className="list-disc list-inside text-gray-300 space-y-2">
                  <li>Personalized workout plans tailored to your fitness goals</li>
                  <li>Custom meal plans and nutrition guidance</li>
                  <li>Daily progress tracking and monitoring</li>
                  <li>24/7 WhatsApp support for fitness-related queries</li>
                  <li>Video library access with exercise demonstrations</li>
                  <li>Monthly one-on-one consultations</li>
                  <li>Supplement guidance and lifestyle coaching</li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-bold text-white mb-4">3. User Eligibility</h2>
                <p className="text-gray-300 leading-relaxed mb-4">
                  To use our Services, you must:
                </p>
                <ul className="list-disc list-inside text-gray-300 space-y-2">
                  <li>Be at least 16 years of age</li>
                  <li>If you are under 18, you must have parental/guardian consent to use our services</li>
                  <li>Provide accurate and complete registration information</li>
                  <li>Have the legal capacity to enter into a binding contract (or have parental consent)</li>
                  <li>Not be prohibited from using our Services under applicable laws</li>
                  <li>Maintain the confidentiality of your account credentials</li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-bold text-white mb-4">4. Account Registration and Security</h2>
                <h3 className="text-xl font-semibold text-white mb-3">4.1 Account Creation</h3>
                <p className="text-gray-300 leading-relaxed mb-4">
                  You must create an account to access our Services. You agree to:
                </p>
                <ul className="list-disc list-inside text-gray-300 space-y-2 mb-4">
                  <li>Provide truthful, accurate, and complete information</li>
                  <li>Update your information promptly if it changes</li>
                  <li>Maintain one account per person</li>
                  <li>Not share your account with others</li>
                </ul>

                <h3 className="text-xl font-semibold text-white mb-3">4.2 Account Security</h3>
                <p className="text-gray-300 leading-relaxed">
                  You are responsible for all activities under your account. Notify us immediately of any unauthorized access or security breach.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-bold text-white mb-4">5. Subscription Plans and Pricing</h2>
                <h3 className="text-xl font-semibold text-white mb-3">5.1 Available Plans</h3>
                <p className="text-gray-300 leading-relaxed mb-4">
                  We offer the following subscription plans:
                </p>
                <ul className="list-disc list-inside text-gray-300 space-y-2 mb-4">
                  <li>Kickstart Plan: ₹799/month</li>
                  <li>Consistency Plan: ₹1,799 for 3 months</li>
                  <li>Strength Plan: ₹2,999 for 6 months</li>
                  <li>Mastery Plan: ₹5,499 for 12 months</li>
                </ul>

                <h3 className="text-xl font-semibold text-white mb-3">5.2 Payment Terms</h3>
                <ul className="list-disc list-inside text-gray-300 space-y-2 mb-4">
                  <li>All prices are in Indian Rupees (INR)</li>
                  <li>Payment must be made in full before accessing services</li>
                  <li>We accept payments through Razorpay and other approved methods</li>
                  <li>Prices are subject to change with 30 days' notice</li>
                  <li>Taxes and fees may apply as per Indian law</li>
                </ul>

                <h3 className="text-xl font-semibold text-white mb-3">5.3 Billing</h3>
                <p className="text-gray-300 leading-relaxed">
                  Subscriptions are billed in advance for the selected period. You authorize us to charge your payment method for the subscription fee.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-bold text-white mb-4">6. Non-Refundable Policy</h2>
                <p className="text-gray-300 leading-relaxed mb-4">
                  <strong className="text-white">ALL SUBSCRIPTIONS ARE 100% NON-REFUNDABLE.</strong>
                </p>
                <ul className="list-disc list-inside text-gray-300 space-y-2 mb-4">
                  <li>All payments are final once processed</li>
                  <li>You can cancel your subscription at any time, but NO refunds will be issued</li>
                  <li>Access continues until the end of your paid period after cancellation</li>
                  <li>Refunds are ONLY issued for duplicate or erroneous charges</li>
                </ul>
                <p className="text-gray-300 leading-relaxed">
                  For complete details, see our <a href="/refund-policy" className="text-brand-blue hover:underline">Refund Policy</a> and <a href="/cancellation-policy" className="text-brand-blue hover:underline">Cancellation Policy</a>.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-bold text-white mb-4">7. User Responsibilities</h2>
                <p className="text-gray-300 leading-relaxed mb-4">
                  As a user of our Services, you agree to:
                </p>
                <ul className="list-disc list-inside text-gray-300 space-y-2">
                  <li>Follow the workout and nutrition plans as recommended</li>
                  <li>Provide accurate health and fitness information</li>
                  <li>Consult a physician before starting any fitness program</li>
                  <li>Report any health concerns or injuries immediately</li>
                  <li>Use the Services only for lawful purposes</li>
                  <li>Not share, reproduce, or distribute our proprietary content</li>
                  <li>Respect intellectual property rights</li>
                  <li>Communicate respectfully with coaches and staff</li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-bold text-white mb-4">8. Prohibited Activities</h2>
                <p className="text-gray-300 leading-relaxed mb-4">
                  You may NOT:
                </p>
                <ul className="list-disc list-inside text-gray-300 space-y-2">
                  <li>Share your account credentials with others</li>
                  <li>Use the Services for commercial purposes without authorization</li>
                  <li>Copy, modify, or distribute our content without permission</li>
                  <li>Reverse engineer or attempt to extract source code</li>
                  <li>Upload viruses, malware, or harmful code</li>
                  <li>Harass, abuse, or harm other users or staff</li>
                  <li>Impersonate Coach Himanshu or our staff</li>
                  <li>Collect user data without consent</li>
                  <li>Interfere with the platform's operation</li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-bold text-white mb-4">9. Intellectual Property Rights</h2>
                <h3 className="text-xl font-semibold text-white mb-3">9.1 Our Content</h3>
                <p className="text-gray-300 leading-relaxed mb-4">
                  All content on our platform, including workout plans, meal plans, videos, text, graphics, logos, and software, is owned by Coach Himanshu and protected by copyright, trademark, and other intellectual property laws.
                </p>

                <h3 className="text-xl font-semibold text-white mb-3">9.2 Limited License</h3>
                <p className="text-gray-300 leading-relaxed mb-4">
                  We grant you a limited, non-exclusive, non-transferable license to access and use our Services for personal, non-commercial purposes during your active subscription.
                </p>

                <h3 className="text-xl font-semibold text-white mb-3">9.3 User Content</h3>
                <p className="text-gray-300 leading-relaxed">
                  You retain ownership of content you submit (e.g., progress photos). By submitting content, you grant us a license to use, display, and share it for service provision and marketing purposes (with your consent for marketing use).
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-bold text-white mb-4">10. Health and Medical Disclaimer</h2>
                <p className="text-gray-300 leading-relaxed mb-4">
                  <strong className="text-white">IMPORTANT:</strong> Our Services are NOT a substitute for professional medical advice, diagnosis, or treatment.
                </p>
                <ul className="list-disc list-inside text-gray-300 space-y-2">
                  <li>Consult your physician before starting any fitness or nutrition program</li>
                  <li>We are not liable for any health issues arising from use of our Services</li>
                  <li>Disclose all health conditions and medications during onboarding</li>
                  <li>Stop exercising and seek medical attention if you experience pain or discomfort</li>
                  <li>Our recommendations are based on general fitness principles, not medical expertise</li>
                </ul>
                <p className="text-gray-300 leading-relaxed mt-4">
                  For more details, see our <a href="/disclaimer" className="text-brand-blue hover:underline">Disclaimer</a>.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-bold text-white mb-4">11. Limitation of Liability</h2>
                <p className="text-gray-300 leading-relaxed mb-4">
                  TO THE MAXIMUM EXTENT PERMITTED BY LAW:
                </p>
                <ul className="list-disc list-inside text-gray-300 space-y-2">
                  <li>We provide Services "AS IS" without warranties of any kind</li>
                  <li>We are not liable for injuries, health issues, or damages resulting from use of our Services</li>
                  <li>Our total liability is limited to the amount you paid for the Services</li>
                  <li>We are not responsible for third-party content, products, or services (e.g., Rhynogrip)</li>
                  <li>We do not guarantee specific fitness results or outcomes</li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-bold text-white mb-4">12. Indemnification</h2>
                <p className="text-gray-300 leading-relaxed">
                  You agree to indemnify and hold harmless Coach Himanshu, its affiliates, and staff from any claims, damages, losses, or expenses (including legal fees) arising from:
                </p>
                <ul className="list-disc list-inside text-gray-300 space-y-2 mt-4">
                  <li>Your violation of these Terms</li>
                  <li>Your use or misuse of the Services</li>
                  <li>Your violation of any third-party rights</li>
                  <li>Any health issues or injuries sustained</li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-bold text-white mb-4">13. Termination</h2>
                <h3 className="text-xl font-semibold text-white mb-3">13.1 By You</h3>
                <p className="text-gray-300 leading-relaxed mb-4">
                  You may cancel your subscription at any time according to our Cancellation Policy. Refunds are subject to our Refund Policy.
                </p>

                <h3 className="text-xl font-semibold text-white mb-3">13.2 By Us</h3>
                <p className="text-gray-300 leading-relaxed">
                  We may suspend or terminate your account immediately if you:
                </p>
                <ul className="list-disc list-inside text-gray-300 space-y-2 mt-4">
                  <li>Violate these Terms</li>
                  <li>Engage in fraudulent or illegal activities</li>
                  <li>Provide false information</li>
                  <li>Abuse or harass our staff</li>
                  <li>Fail to pay subscription fees</li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-bold text-white mb-4">14. Modifications to Services</h2>
                <p className="text-gray-300 leading-relaxed">
                  We reserve the right to modify, suspend, or discontinue any aspect of our Services at any time, with or without notice. We are not liable for any modifications or discontinuation.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-bold text-white mb-4">15. Governing Law and Dispute Resolution</h2>
                <h3 className="text-xl font-semibold text-white mb-3">15.1 Governing Law</h3>
                <p className="text-gray-300 leading-relaxed mb-4">
                  These Terms are governed by the laws of India. Any disputes will be subject to the exclusive jurisdiction of courts in India.
                </p>

                <h3 className="text-xl font-semibold text-white mb-3">15.2 Dispute Resolution</h3>
                <p className="text-gray-300 leading-relaxed">
                  In case of disputes, we encourage you to contact us first at info@coachhimanshu.com to resolve the matter amicably. If resolution is not possible, disputes will be resolved through arbitration in accordance with Indian Arbitration and Conciliation Act, 1996.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-bold text-white mb-4">16. Privacy</h2>
                <p className="text-gray-300 leading-relaxed">
                  Your use of our Services is also governed by our <a href="/privacy-policy" className="text-brand-blue hover:underline">Privacy Policy</a>. Please review it to understand how we collect, use, and protect your information.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-bold text-white mb-4">17. Severability</h2>
                <p className="text-gray-300 leading-relaxed">
                  If any provision of these Terms is found to be invalid or unenforceable, the remaining provisions will continue in full force and effect.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-bold text-white mb-4">18. Entire Agreement</h2>
                <p className="text-gray-300 leading-relaxed">
                  These Terms, along with our Privacy Policy, Refund Policy, Cancellation Policy, and Disclaimer, constitute the entire agreement between you and Coach Himanshu regarding use of our Services.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-white mb-4">19. Contact Information</h2>
                <p className="text-gray-300 leading-relaxed mb-4">
                  For questions about these Terms, please contact us:
                </p>
                <div className="bg-brand-navy-light/50 rounded-lg p-6 border border-brand-blue/20">
                  <p className="text-white font-semibold mb-2">Coach Himanshu</p>
                  <p className="text-gray-300">Email: <a href="mailto:info@coachhimanshu.com" className="text-brand-blue hover:underline">info@coachhimanshu.com</a></p>
                  <p className="text-gray-300">Phone: <a href="tel:+917303484648" className="text-brand-blue hover:underline">+91 7303484648</a></p>
                  <p className="text-gray-300">Website: <a href="https://coachhimanshu.com" className="text-brand-blue hover:underline">https://coachhimanshu.com</a></p>
                </div>
              </section>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
