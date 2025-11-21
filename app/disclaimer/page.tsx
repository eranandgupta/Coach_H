'use client';

import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import AnnouncementBar from '@/components/AnnouncementBar';
import { AlertTriangle } from 'lucide-react';

export default function Disclaimer() {
  return (
    <div className="min-h-screen bg-brand-navy">
      <AnnouncementBar />
      <Navbar />

      <div className="pt-32 pb-16 px-4 md:px-6">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-brand-blue/10 rounded-2xl mb-6">
              <AlertTriangle className="w-8 h-8 text-brand-blue" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Disclaimer
            </h1>
            <p className="text-gray-400">
              Last Updated: January 2025
            </p>
          </div>

          {/* Important Notice */}
          <div className="bg-red-500/10 border-2 border-red-500/30 rounded-2xl p-6 mb-8">
            <p className="text-white font-semibold text-lg mb-2">⚠️ IMPORTANT HEALTH NOTICE</p>
            <p className="text-gray-300 leading-relaxed">
              Please read this disclaimer carefully before using our fitness coaching services. By using our services, you acknowledge that you have read, understood, and agree to this disclaimer.
            </p>
          </div>

          {/* Content */}
          <div className="bg-brand-navy-light/30 rounded-2xl p-8 md:p-12 border border-brand-navy-light/20">
            <div className="prose prose-invert max-w-none">
              <section className="mb-8">
                <h2 className="text-2xl font-bold text-white mb-4">1. Medical Disclaimer</h2>
                <h3 className="text-xl font-semibold text-white mb-3">1.1 Not Medical Advice</h3>
                <p className="text-gray-300 leading-relaxed mb-4">
                  The fitness coaching services, workout plans, nutrition guidance, and all content provided by Coach Himanshu ("we," "our," or "us") are for <strong className="text-white">informational and educational purposes only</strong>. They are NOT intended as:
                </p>
                <ul className="list-disc list-inside text-gray-300 space-y-2 mb-4">
                  <li>Medical advice, diagnosis, or treatment</li>
                  <li>Professional medical counseling</li>
                  <li>Substitute for consultation with qualified healthcare providers</li>
                  <li>Treatment for medical conditions or diseases</li>
                  <li>Professional nutritional therapy or dietetics</li>
                </ul>

                <h3 className="text-xl font-semibold text-white mb-3">1.2 Consult Your Physician</h3>
                <p className="text-gray-300 leading-relaxed mb-4">
                  <strong className="text-white">ALWAYS CONSULT YOUR PHYSICIAN</strong> before:
                </p>
                <ul className="list-disc list-inside text-gray-300 space-y-2">
                  <li>Starting any fitness or exercise program</li>
                  <li>Making changes to your diet or nutrition</li>
                  <li>Taking supplements or vitamins</li>
                  <li>If you have any pre-existing medical conditions</li>
                  <li>If you are pregnant, nursing, or planning pregnancy</li>
                  <li>If you are taking medications</li>
                  <li>If you have injuries or physical limitations</li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-bold text-white mb-4">2. Fitness and Exercise Disclaimer</h2>
                <h3 className="text-xl font-semibold text-white mb-3">2.1 Inherent Risks</h3>
                <p className="text-gray-300 leading-relaxed mb-4">
                  Physical exercise and fitness activities carry inherent risks, including but not limited to:
                </p>
                <ul className="list-disc list-inside text-gray-300 space-y-2">
                  <li>Muscle strains, sprains, and injuries</li>
                  <li>Cardiovascular stress</li>
                  <li>Dehydration and electrolyte imbalance</li>
                  <li>Dizziness, fainting, or nausea</li>
                  <li>Aggravation of pre-existing conditions</li>
                  <li>In rare cases, serious injury or death</li>
                </ul>

                <h3 className="text-xl font-semibold text-white mb-3">2.2 Your Responsibility</h3>
                <p className="text-gray-300 leading-relaxed mb-4">
                  By using our services, you:
                </p>
                <ul className="list-disc list-inside text-gray-300 space-y-2">
                  <li>Assume all risks associated with exercise and physical activity</li>
                  <li>Acknowledge you are physically capable of performing exercises</li>
                  <li>Agree to listen to your body and stop if you feel pain or discomfort</li>
                  <li>Will not hold Coach Himanshu liable for injuries or health issues</li>
                  <li>Understand that individual results may vary</li>
                </ul>

                <h3 className="text-xl font-semibold text-white mb-3">2.3 Stop and Seek Medical Attention</h3>
                <p className="text-gray-300 leading-relaxed">
                  <strong className="text-white">IMMEDIATELY STOP EXERCISING</strong> and seek medical attention if you experience:
                </p>
                <ul className="list-disc list-inside text-gray-300 space-y-2 mt-4">
                  <li>Chest pain, pressure, or tightness</li>
                  <li>Severe shortness of breath</li>
                  <li>Dizziness, lightheadedness, or fainting</li>
                  <li>Unusual fatigue or weakness</li>
                  <li>Joint or muscle pain</li>
                  <li>Any unusual symptoms or discomfort</li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-bold text-white mb-4">3. Nutrition and Diet Disclaimer</h2>
                <h3 className="text-xl font-semibold text-white mb-3">3.1 General Guidance Only</h3>
                <p className="text-gray-300 leading-relaxed mb-4">
                  Our meal plans and nutrition recommendations are:
                </p>
                <ul className="list-disc list-inside text-gray-300 space-y-2">
                  <li>Based on general fitness and nutrition principles</li>
                  <li>NOT personalized medical nutrition therapy</li>
                  <li>NOT suitable for treating medical conditions</li>
                  <li>Subject to individual tolerance and preferences</li>
                </ul>

                <h3 className="text-xl font-semibold text-white mb-3">3.2 Food Allergies and Intolerances</h3>
                <p className="text-gray-300 leading-relaxed mb-4">
                  You are responsible for:
                </p>
                <ul className="list-disc list-inside text-gray-300 space-y-2">
                  <li>Disclosing all food allergies and intolerances</li>
                  <li>Verifying ingredients before consumption</li>
                  <li>Modifying meal plans to avoid allergens</li>
                  <li>Consulting a registered dietitian for medical nutrition needs</li>
                </ul>

                <h3 className="text-xl font-semibold text-white mb-3">3.3 Supplements</h3>
                <p className="text-gray-300 leading-relaxed">
                  Supplement recommendations are suggestions only. We do NOT:
                </p>
                <ul className="list-disc list-inside text-gray-300 space-y-2 mt-4">
                  <li>Diagnose supplement deficiencies</li>
                  <li>Prescribe supplements for medical conditions</li>
                  <li>Guarantee supplement safety or efficacy</li>
                  <li>Take responsibility for adverse reactions</li>
                </ul>
                <p className="text-gray-300 leading-relaxed mt-4">
                  Consult your doctor before taking any supplements, especially if you have medical conditions or take medications.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-bold text-white mb-4">4. Results Disclaimer</h2>
                <h3 className="text-xl font-semibold text-white mb-3">4.1 No Guaranteed Results</h3>
                <p className="text-gray-300 leading-relaxed mb-4">
                  We do NOT guarantee specific fitness results, weight loss, muscle gain, or health improvements. Results depend on numerous factors:
                </p>
                <ul className="list-disc list-inside text-gray-300 space-y-2">
                  <li>Individual genetics and metabolism</li>
                  <li>Consistency and adherence to programs</li>
                  <li>Starting fitness level and health status</li>
                  <li>Age, gender, and hormonal factors</li>
                  <li>Sleep, stress, and lifestyle factors</li>
                  <li>Underlying medical conditions</li>
                </ul>

                <h3 className="text-xl font-semibold text-white mb-3">4.2 Testimonials</h3>
                <p className="text-gray-300 leading-relaxed">
                  Testimonials and transformation photos represent individual experiences and may not reflect typical results. Your results may differ significantly.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-bold text-white mb-4">5. Professional Qualifications</h2>
                <p className="text-gray-300 leading-relaxed mb-4">
                  Coach Himanshu is:
                </p>
                <ul className="list-disc list-inside text-gray-300 space-y-2 mb-4">
                  <li>NASM Certified Bodybuilding Coach</li>
                  <li>Holder of 6+ professional fitness diplomas</li>
                  <li>Experienced fitness educator and trainer</li>
                </ul>
                <p className="text-gray-300 leading-relaxed">
                  However, we are NOT:
                </p>
                <ul className="list-disc list-inside text-gray-300 space-y-2 mt-4">
                  <li>Licensed physicians or medical doctors</li>
                  <li>Registered dietitians or nutritionists</li>
                  <li>Physical therapists or sports medicine specialists</li>
                  <li>Licensed to diagnose or treat medical conditions</li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-bold text-white mb-4">6. Third-Party Products and Services</h2>
                <h3 className="text-xl font-semibold text-white mb-3">6.1 Affiliate Links and Partnerships</h3>
                <p className="text-gray-300 leading-relaxed mb-4">
                  We may recommend third-party products, services, or websites (e.g., Rhynogrip gym equipment). We are NOT responsible for:
                </p>
                <ul className="list-disc list-inside text-gray-300 space-y-2">
                  <li>Quality, safety, or suitability of third-party products</li>
                  <li>Third-party business practices or policies</li>
                  <li>Transactions between you and third parties</li>
                  <li>Accuracy of third-party claims or information</li>
                </ul>

                <h3 className="text-xl font-semibold text-white mb-3">6.2 Equipment Safety</h3>
                <p className="text-gray-300 leading-relaxed">
                  When using fitness equipment (recommended or otherwise):
                </p>
                <ul className="list-disc list-inside text-gray-300 space-y-2 mt-4">
                  <li>Follow manufacturer instructions</li>
                  <li>Inspect equipment for damage before use</li>
                  <li>Use equipment as intended</li>
                  <li>Ensure proper setup and safety measures</li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-bold text-white mb-4">7. Online Services Disclaimer</h2>
                <h3 className="text-xl font-semibold text-white mb-3">7.1 Virtual Coaching Limitations</h3>
                <p className="text-gray-300 leading-relaxed mb-4">
                  Our services are provided online and remotely. We:
                </p>
                <ul className="list-disc list-inside text-gray-300 space-y-2">
                  <li>Cannot physically supervise your workouts</li>
                  <li>Cannot verify exercise form in real-time</li>
                  <li>Rely on information you provide (photos, videos, measurements)</li>
                  <li>Cannot guarantee internet connectivity or platform availability</li>
                </ul>

                <h3 className="text-xl font-semibold text-white mb-3">7.2 Information Accuracy</h3>
                <p className="text-gray-300 leading-relaxed">
                  You are responsible for providing accurate, complete, and truthful information about your health, fitness level, and goals. Withholding information may lead to inappropriate recommendations.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-bold text-white mb-4">8. Errors and Omissions</h2>
                <p className="text-gray-300 leading-relaxed">
                  While we strive for accuracy, our website, app, and services may contain:
                </p>
                <ul className="list-disc list-inside text-gray-300 space-y-2 mt-4">
                  <li>Typographical errors or inaccuracies</li>
                  <li>Outdated information</li>
                  <li>Technical glitches or malfunctions</li>
                  <li>Incomplete data</li>
                </ul>
                <p className="text-gray-300 leading-relaxed mt-4">
                  We reserve the right to correct errors and update information without notice.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-bold text-white mb-4">9. Limitation of Liability</h2>
                <p className="text-gray-300 leading-relaxed mb-4">
                  TO THE MAXIMUM EXTENT PERMITTED BY LAW:
                </p>
                <ul className="list-disc list-inside text-gray-300 space-y-2">
                  <li>Coach Himanshu, its affiliates, and staff are NOT liable for any injuries, illnesses, damages, or losses arising from use of our services</li>
                  <li>We are NOT responsible for adverse health outcomes</li>
                  <li>Our liability is limited to the amount you paid for services</li>
                  <li>We disclaim all warranties, express or implied</li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-bold text-white mb-4">10. Assumption of Risk</h2>
                <p className="text-gray-300 leading-relaxed mb-4">
                  By using our services, you:
                </p>
                <ul className="list-disc list-inside text-gray-300 space-y-2">
                  <li>Voluntarily assume all risks associated with exercise and nutrition</li>
                  <li>Release Coach Himanshu from all liability</li>
                  <li>Agree not to hold us responsible for injuries or damages</li>
                  <li>Acknowledge you have read and understood this disclaimer</li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-bold text-white mb-4">11. Jurisdictional Issues</h2>
                <p className="text-gray-300 leading-relaxed">
                  Our services are based in India and comply with Indian laws. If you access our services from outside India, you are responsible for compliance with local laws. Some content or recommendations may not be suitable for all jurisdictions.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-bold text-white mb-4">12. Changes to Disclaimer</h2>
                <p className="text-gray-300 leading-relaxed">
                  We may update this disclaimer at any time. Your continued use of our services after changes constitutes acceptance of the updated disclaimer.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-white mb-4">13. Contact Information</h2>
                <p className="text-gray-300 leading-relaxed mb-4">
                  If you have questions about this disclaimer, contact us:
                </p>
                <div className="bg-brand-navy-light/50 rounded-lg p-6 border border-brand-blue/20">
                  <p className="text-white font-semibold mb-2">Coach Himanshu</p>
                  <p className="text-gray-300">Email: <a href="mailto:info@coachhimanshu.com" className="text-brand-blue hover:underline">info@coachhimanshu.com</a></p>
                  <p className="text-gray-300">Phone: <a href="tel:+917303484648" className="text-brand-blue hover:underline">+91 7303484648</a></p>
                </div>
              </section>

              <div className="mt-8 p-6 bg-red-500/10 border-2 border-red-500/30 rounded-lg">
                <p className="text-white font-semibold mb-2">⚠️ ACKNOWLEDGMENT</p>
                <p className="text-gray-300 text-sm leading-relaxed">
                  By using Coach Himanshu's services, you acknowledge that you have read, understood, and agree to this disclaimer. You accept full responsibility for your health and safety, and you agree to hold Coach Himanshu harmless from any claims, damages, or losses arising from your use of our services.
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
