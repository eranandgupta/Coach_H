'use client';

import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import AnnouncementBar from '@/components/AnnouncementBar';
import { Shield } from 'lucide-react';

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-brand-navy">
      <AnnouncementBar />
      <Navbar />

      <div className="pt-32 pb-16 px-4 md:px-6">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-brand-blue/10 rounded-2xl mb-6">
              <Shield className="w-8 h-8 text-brand-blue" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Privacy Policy
            </h1>
            <p className="text-gray-400">
              Last Updated: January 2025
            </p>
          </div>

          {/* Content */}
          <div className="bg-brand-navy-light/30 rounded-2xl p-8 md:p-12 border border-brand-navy-light/20">
            <div className="prose prose-invert max-w-none">
              <section className="mb-8">
                <h2 className="text-2xl font-bold text-white mb-4">1. Introduction</h2>
                <p className="text-gray-300 leading-relaxed mb-4">
                  Welcome to Coach Himanshu ("we," "our," or "us"). We are committed to protecting your personal information and your right to privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our fitness coaching platform and services.
                </p>
                <p className="text-gray-300 leading-relaxed">
                  By using our services, you agree to the collection and use of information in accordance with this policy. If you do not agree with our policies and practices, please do not use our services.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-bold text-white mb-4">2. Information We Collect</h2>

                <h3 className="text-xl font-semibold text-white mb-3">2.1 Personal Information</h3>
                <p className="text-gray-300 leading-relaxed mb-4">
                  We collect the following personal information when you register or use our services:
                </p>
                <ul className="list-disc list-inside text-gray-300 space-y-2 mb-4">
                  <li>Full name and contact information (email, phone number)</li>
                  <li>Age, gender, and date of birth</li>
                  <li>Physical measurements (height, weight, body measurements)</li>
                  <li>Health and fitness information (medical conditions, fitness goals, dietary restrictions)</li>
                  <li>Payment information (processed securely through third-party payment processors)</li>
                  <li>Profile photos and progress photos (optional)</li>
                </ul>

                <h3 className="text-xl font-semibold text-white mb-3">2.2 Automatically Collected Information</h3>
                <ul className="list-disc list-inside text-gray-300 space-y-2 mb-4">
                  <li>IP address and browser type</li>
                  <li>Device information and operating system</li>
                  <li>Usage data and interaction with our platform</li>
                  <li>Cookies and similar tracking technologies</li>
                  <li>Location data (with your permission)</li>
                </ul>

                <h3 className="text-xl font-semibold text-white mb-3">2.3 Communication Data</h3>
                <p className="text-gray-300 leading-relaxed">
                  We collect information from your communications with us, including WhatsApp messages, emails, and in-app messages related to your fitness coaching.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-bold text-white mb-4">3. How We Use Your Information</h2>
                <p className="text-gray-300 leading-relaxed mb-4">
                  We use the collected information for the following purposes:
                </p>
                <ul className="list-disc list-inside text-gray-300 space-y-2">
                  <li>To provide personalized workout and nutrition plans</li>
                  <li>To track your fitness progress and adjust programs accordingly</li>
                  <li>To process payments and manage subscriptions</li>
                  <li>To communicate with you about your fitness journey</li>
                  <li>To send important updates, notifications, and promotional content (with your consent)</li>
                  <li>To improve our services and develop new features</li>
                  <li>To ensure platform security and prevent fraud</li>
                  <li>To comply with legal obligations</li>
                  <li>To analyze usage patterns and optimize user experience</li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-bold text-white mb-4">4. Information Sharing and Disclosure</h2>
                <p className="text-gray-300 leading-relaxed mb-4">
                  We do not sell your personal information. We may share your information in the following circumstances:
                </p>

                <h3 className="text-xl font-semibold text-white mb-3">4.1 Service Providers</h3>
                <p className="text-gray-300 leading-relaxed mb-4">
                  We share information with third-party service providers who assist us in:
                </p>
                <ul className="list-disc list-inside text-gray-300 space-y-2 mb-4">
                  <li>Payment processing (Razorpay, Stripe)</li>
                  <li>Email and SMS communications</li>
                  <li>Cloud hosting and data storage</li>
                  <li>Analytics and performance monitoring</li>
                </ul>

                <h3 className="text-xl font-semibold text-white mb-3">4.2 Legal Requirements</h3>
                <p className="text-gray-300 leading-relaxed mb-4">
                  We may disclose your information if required by law or in response to valid legal requests.
                </p>

                <h3 className="text-xl font-semibold text-white mb-3">4.3 Business Transfers</h3>
                <p className="text-gray-300 leading-relaxed">
                  In the event of a merger, acquisition, or sale of assets, your information may be transferred to the acquiring entity.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-bold text-white mb-4">5. Data Security</h2>
                <p className="text-gray-300 leading-relaxed mb-4">
                  We implement industry-standard security measures to protect your personal information:
                </p>
                <ul className="list-disc list-inside text-gray-300 space-y-2">
                  <li>Encryption of data in transit and at rest</li>
                  <li>Secure authentication and access controls</li>
                  <li>Regular security audits and updates</li>
                  <li>Staff training on data protection</li>
                  <li>Secure payment processing through PCI-DSS compliant providers</li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-bold text-white mb-4">6. Your Privacy Rights</h2>
                <p className="text-gray-300 leading-relaxed mb-4">
                  You have the following rights regarding your personal information:
                </p>
                <ul className="list-disc list-inside text-gray-300 space-y-2">
                  <li><strong className="text-white">Access:</strong> Request a copy of your personal data</li>
                  <li><strong className="text-white">Correction:</strong> Request correction of inaccurate information</li>
                  <li><strong className="text-white">Deletion:</strong> Request deletion of your personal data</li>
                  <li><strong className="text-white">Portability:</strong> Request transfer of your data to another service</li>
                  <li><strong className="text-white">Opt-out:</strong> Unsubscribe from marketing communications</li>
                  <li><strong className="text-white">Restriction:</strong> Request limitation of data processing</li>
                </ul>
                <p className="text-gray-300 leading-relaxed mt-4">
                  To exercise these rights, please contact us at <a href="mailto:info@coachhimanshu.com" className="text-brand-blue hover:underline">info@coachhimanshu.com</a>
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-bold text-white mb-4">7. Cookies and Tracking Technologies</h2>
                <p className="text-gray-300 leading-relaxed mb-4">
                  We use cookies and similar technologies to enhance your experience:
                </p>
                <ul className="list-disc list-inside text-gray-300 space-y-2">
                  <li><strong className="text-white">Essential Cookies:</strong> Required for platform functionality</li>
                  <li><strong className="text-white">Analytics Cookies:</strong> Help us understand usage patterns</li>
                  <li><strong className="text-white">Preference Cookies:</strong> Remember your settings and preferences</li>
                </ul>
                <p className="text-gray-300 leading-relaxed mt-4">
                  You can control cookies through your browser settings, but disabling certain cookies may affect functionality.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-bold text-white mb-4">8. Data Retention</h2>
                <p className="text-gray-300 leading-relaxed">
                  We retain your personal information for as long as necessary to provide our services and comply with legal obligations. After subscription termination, we may retain certain data for:
                </p>
                <ul className="list-disc list-inside text-gray-300 space-y-2 mt-4">
                  <li>Legal compliance: 7 years for financial records</li>
                  <li>Dispute resolution: Until resolved</li>
                  <li>Aggregated analytics: Indefinitely (anonymized)</li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-bold text-white mb-4">9. Minors and Parental Consent</h2>
                <p className="text-gray-300 leading-relaxed mb-4">
                  Our services are available to users aged 16 and above. Special provisions apply for minors:
                </p>
                <ul className="list-disc list-inside text-gray-300 space-y-2">
                  <li><strong className="text-white">Ages 16-17:</strong> Must have explicit parental or guardian consent to use our services</li>
                  <li><strong className="text-white">Under 16:</strong> Our services are not intended for individuals under 16 years of age</li>
                  <li>We do not knowingly collect personal information from children under 16 without parental consent</li>
                  <li>Parents/guardians of users aged 16-17 have the right to review, modify, or delete their child's information</li>
                </ul>
                <p className="text-gray-300 leading-relaxed mt-4">
                  If you believe we have collected information from a minor under 16 without consent, please contact us immediately at <a href="mailto:info@coachhimanshu.com" className="text-brand-blue hover:underline">info@coachhimanshu.com</a>.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-bold text-white mb-4">10. International Data Transfers</h2>
                <p className="text-gray-300 leading-relaxed">
                  Your information may be transferred to and processed in countries other than India. We ensure appropriate safeguards are in place to protect your data in accordance with this Privacy Policy.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-bold text-white mb-4">11. Third-Party Links</h2>
                <p className="text-gray-300 leading-relaxed">
                  Our platform may contain links to third-party websites (e.g., Rhynogrip.com). We are not responsible for the privacy practices of these external sites. Please review their privacy policies before providing any information.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-bold text-white mb-4">12. Changes to This Policy</h2>
                <p className="text-gray-300 leading-relaxed">
                  We may update this Privacy Policy periodically. We will notify you of significant changes by email or through a prominent notice on our platform. Your continued use of our services after changes constitutes acceptance of the updated policy.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-white mb-4">13. Contact Us</h2>
                <p className="text-gray-300 leading-relaxed mb-4">
                  If you have questions or concerns about this Privacy Policy, please contact us:
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
