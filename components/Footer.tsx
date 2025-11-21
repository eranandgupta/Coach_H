'use client';

import { Instagram, Youtube, Mail, Phone, Facebook, Twitter } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-brand-navy border-t border-brand-navy-light/20 py-8 md:py-16">
      <div className="max-w-7xl mx-auto px-4 md:px-6">
        {/* About Section - Full width on mobile */}
        <div className="mb-6 md:mb-0 md:hidden">
          <h3 className="text-white font-bold text-base mb-2">
            Coach Himanshu
          </h3>
          <p className="text-gray-400 text-xs leading-relaxed">
            NASM Certified Coach making fitness <span className="text-brand-gold font-semibold">affordable</span>, <span className="text-brand-gold font-semibold">accessible</span>, and <span className="text-brand-gold font-semibold">science-backed</span>.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-12 mb-6 md:mb-12">
          {/* About Section - Desktop only */}
          <div className="hidden md:block">
            <h3 className="text-white font-bold text-lg mb-4">
              Coach Himanshu
            </h3>
            <p className="text-gray-400 text-sm leading-relaxed mb-3">
              NASM Certified Bodybuilding Coach & Fitness Educator with 6+ professional diplomas.
            </p>
            <p className="text-gray-400 text-sm leading-relaxed">
              Making fitness guidance <span className="text-brand-gold font-semibold">affordable</span>, <span className="text-brand-gold font-semibold">accessible</span>, and <span className="text-brand-gold font-semibold">science-backed</span>—because money should never be an excuse to stay unfit.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-semibold mb-3 md:mb-6 text-sm md:text-base">Quick Links</h4>
            <ul className="space-y-2 md:space-y-3">
              <li>
                <a
                  href="/"
                  className="text-gray-400 hover:text-brand-blue transition-colors text-xs md:text-sm"
                >
                  Home
                </a>
              </li>
              <li>
                <a
                  href="/about"
                  className="text-gray-400 hover:text-brand-blue transition-colors text-xs md:text-sm"
                >
                  About
                </a>
              </li>
              <li>
                <a
                  href="/#plans"
                  className="text-gray-400 hover:text-brand-blue transition-colors text-xs md:text-sm"
                >
                  Plans
                </a>
              </li>
              <li>
                <a
                  href="/blog"
                  className="text-gray-400 hover:text-brand-blue transition-colors text-xs md:text-sm"
                >
                  Blog
                </a>
              </li>
              <li>
                <a
                  href="/assessment"
                  className="text-gray-400 hover:text-brand-blue transition-colors text-xs md:text-sm"
                >
                  Assessment
                </a>
              </li>
              <li>
                <a
                  href="/dashboard"
                  className="text-gray-400 hover:text-brand-blue transition-colors text-xs md:text-sm"
                >
                  Dashboard
                </a>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="text-white font-semibold mb-3 md:mb-6 text-sm md:text-base">Legal</h4>
            <ul className="space-y-2 md:space-y-3">
              <li>
                <a
                  href="/privacy-policy"
                  className="text-gray-400 hover:text-brand-blue transition-colors text-xs md:text-sm"
                >
                  Privacy Policy
                </a>
              </li>
              <li>
                <a
                  href="/terms-of-service"
                  className="text-gray-400 hover:text-brand-blue transition-colors text-xs md:text-sm"
                >
                  Terms of Service
                </a>
              </li>
              <li>
                <a
                  href="/refund-policy"
                  className="text-gray-400 hover:text-brand-blue transition-colors text-xs md:text-sm"
                >
                  Refund Policy
                </a>
              </li>
              <li>
                <a
                  href="/cancellation-policy"
                  className="text-gray-400 hover:text-brand-blue transition-colors text-xs md:text-sm"
                >
                  Cancellation
                </a>
              </li>
              <li>
                <a
                  href="/disclaimer"
                  className="text-gray-400 hover:text-brand-blue transition-colors text-xs md:text-sm"
                >
                  Disclaimer
                </a>
              </li>
              <li>
                <a
                  href="/contact"
                  className="text-gray-400 hover:text-brand-blue transition-colors text-xs md:text-sm"
                >
                  Contact
                </a>
              </li>
            </ul>
          </div>

          {/* Get in Touch */}
          <div className="col-span-2 md:col-span-1">
            <h4 className="text-white font-semibold mb-3 md:mb-6 text-sm md:text-base">Get in Touch</h4>
            <div className="space-y-2 md:space-y-4">
              <a
                href="mailto:info@coachhimanshu.com"
                className="flex items-center gap-2 text-gray-400 text-xs md:text-sm hover:text-brand-blue transition-colors cursor-pointer"
              >
                <Mail size={16} className="text-brand-blue flex-shrink-0" />
                <span>info@coachhimanshu.com</span>
              </a>
              <a
                href="tel:+917303484648"
                className="flex items-center gap-2 text-gray-400 text-xs md:text-sm hover:text-brand-blue transition-colors cursor-pointer"
              >
                <Phone size={16} className="text-brand-blue flex-shrink-0" />
                <span>+91 7303484648</span>
              </a>
              <div className="pt-1 md:pt-2">
                <p className="text-gray-400 text-xs mb-2 md:mb-3">Follow Us</p>
                <div className="flex gap-3 md:gap-4">
                  <a
                    href="https://www.facebook.com/CouchHimanshuSquad/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-400 hover:text-blue-500 transition-colors"
                    aria-label="Facebook"
                  >
                    <Facebook size={18} />
                  </a>
                  <a
                    href="https://www.instagram.com/coachhimanshusquad_"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-400 hover:text-pink-500 transition-colors"
                    aria-label="Instagram"
                  >
                    <Instagram size={18} />
                  </a>
                  <a
                    href="https://x.com/coach_himanshu_"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-400 hover:text-gray-200 transition-colors"
                    aria-label="X"
                  >
                    <Twitter size={18} />
                  </a>
                  <a
                    href="https://www.youtube.com/@CoachHimanshuKataria"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-400 hover:text-red-500 transition-colors"
                    aria-label="YouTube"
                  >
                    <Youtube size={18} />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-4 md:pt-8 border-t border-brand-navy-light/20">
          <div className="flex flex-col md:flex-row justify-between items-center gap-2 md:gap-4">
            <p className="text-gray-400 text-xs md:text-sm text-center md:text-left">
              &copy; 2025 Coach Himanshu. All rights reserved.
            </p>
            <div className="flex flex-wrap justify-center gap-2 md:gap-4 text-xs text-gray-400">
              <a href="/privacy-policy" className="hover:text-brand-blue transition-colors">
                Privacy
              </a>
              <span>•</span>
              <a href="/terms-of-service" className="hover:text-brand-blue transition-colors">
                Terms
              </a>
              <span>•</span>
              <a href="/refund-policy" className="hover:text-brand-blue transition-colors">
                Refund
              </a>
              <span>•</span>
              <a href="/contact" className="hover:text-brand-blue transition-colors">
                Contact
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
