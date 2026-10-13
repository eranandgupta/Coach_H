import Image from 'next/image';
import { Instagram, Youtube, Mail, Phone, Facebook, Twitter, ArrowRight, ClipboardCheck, ShieldCheck } from 'lucide-react';

// Internal links are kept intact (they matter for crawl depth / SEO) — only regrouped.
const COLUMNS: { title: string; links: { href: string; label: string }[] }[] = [
  {
    title: 'Programs',
    links: [
      { href: '/plans', label: 'Plans & Pricing' },
      { href: '/online-personal-trainer', label: '1:1 Personal Training' },
      { href: '/fitness-coaching-for/women', label: 'Coaching for Women' },
      { href: '/fitness-coaching-for/men', label: 'Coaching for Men' },
      { href: '/fitness-coaching-for/family', label: 'Couple & Family' },
      { href: '/fitness-coaching-for/seniors', label: 'Coaching for Seniors' },
      { href: '/fitness-coaching-for/working-professionals', label: 'For Working Professionals' },
    ],
  },
  {
    title: 'Resources',
    links: [
      { href: '/blog', label: 'Blog' },
      { href: '/tools', label: 'Fitness Calculators' },
      { href: '/calories', label: 'Food Calorie Chart' },
      { href: '/assessment', label: 'Free Assessment' },
      { href: '/about', label: 'About Coach Himanshu' },
      { href: '/dashboard', label: 'Member Dashboard' },
    ],
  },
  {
    title: 'Legal',
    links: [
      { href: '/privacy-policy', label: 'Privacy Policy' },
      { href: '/terms-of-service', label: 'Terms of Service' },
      { href: '/refund-policy', label: 'Refund Policy' },
      { href: '/cancellation-policy', label: 'Cancellation' },
      { href: '/disclaimer', label: 'Disclaimer' },
      { href: '/contact', label: 'Contact' },
    ],
  },
];

const SOCIALS = [
  { href: 'https://www.instagram.com/coachhimanshusquad_', label: 'Instagram', icon: Instagram },
  { href: 'https://www.youtube.com/@CoachHimanshuKataria', label: 'YouTube', icon: Youtube },
  { href: 'https://www.facebook.com/CouchHimanshuSquad/', label: 'Facebook', icon: Facebook },
  { href: 'https://x.com/coach_himanshu_', label: 'X', icon: Twitter },
];

export default function Footer() {
  return (
    <footer className="relative border-t border-white/[0.06] bg-brand-navy-dark">
      <div className="max-w-7xl mx-auto px-4 md:px-6 pt-10 md:pt-16 pb-8">
        {/* CTA */}
        <div className="dash-hero theme-dark relative overflow-hidden rounded-3xl px-5 py-6 md:px-10 md:py-9 mb-10 md:mb-14 flex flex-col md:flex-row md:items-center gap-5 md:gap-8">
          <div aria-hidden className="dash-hero-bloom pointer-events-none absolute -top-24 -right-10 w-80 h-80 rounded-full blur-3xl" />
          <div className="relative flex-1 min-w-0">
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-white/60">Start today</p>
            <h2 className="mt-1 text-2xl md:text-3xl font-bold text-white tracking-tight">Ready to start your transformation?</h2>
            <p className="mt-1.5 text-sm text-white/70 max-w-xl">
              Personalised workout and diet plans from an NASM certified coach — delivered online, anywhere.
            </p>
          </div>
          <div className="relative flex flex-col sm:flex-row gap-2.5 shrink-0">
            <a
              href="/plans"
              className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-snow text-ink text-sm font-semibold shadow-lg shadow-black/20 hover:bg-white/90 transition-colors"
            >
              View Plans <ArrowRight className="w-4 h-4" />
            </a>
            <a
              href="/assessment"
              className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-white/10 ring-1 ring-white/20 text-white text-sm font-semibold hover:bg-white/15 transition-colors"
            >
              <ClipboardCheck className="w-4 h-4" /> Free Assessment
            </a>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-12 gap-x-6 gap-y-9 mb-10 md:mb-14">
          {/* Brand */}
          <div className="col-span-2 md:col-span-4">
            <a href="/" aria-label="Coach Himanshu — Home" className="inline-block">
              <Image
                src="https://ik.imagekit.io/oeagl0l4x/public/logo.png?tr=w-200,q-80,f-auto"
                alt="Coach Himanshu"
                width={110}
                height={110}
                className="theme-logo object-cover w-[110px] h-[58px] -ml-1"
              />
            </a>
            <p className="mt-3 text-sm text-gray-400 leading-relaxed max-w-sm">
              NASM Certified Bodybuilding Coach &amp; Fitness Educator with 6+ professional diplomas. Making fitness
              guidance affordable, accessible and science-backed.
            </p>

            <div className="mt-5 space-y-2.5">
              <a href="mailto:info@coachhimanshu.com" className="group flex items-center gap-2.5 text-sm text-gray-300 hover:text-white transition-colors w-fit">
                <span className="w-8 h-8 rounded-lg bg-white/[0.05] ring-1 ring-white/[0.08] flex items-center justify-center text-brand-blue group-hover:bg-brand-blue/15">
                  <Mail className="w-4 h-4" />
                </span>
                info@coachhimanshu.com
              </a>
              <a href="tel:+917303484648" className="group flex items-center gap-2.5 text-sm text-gray-300 hover:text-white transition-colors w-fit">
                <span className="w-8 h-8 rounded-lg bg-white/[0.05] ring-1 ring-white/[0.08] flex items-center justify-center text-brand-blue group-hover:bg-brand-blue/15">
                  <Phone className="w-4 h-4" />
                </span>
                +91 73034 84648
              </a>
            </div>

            <div className="mt-5 flex gap-2">
              {SOCIALS.map(({ href, label, icon: Icon }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="w-9 h-9 rounded-full bg-white/[0.05] ring-1 ring-white/[0.08] flex items-center justify-center text-gray-400 hover:text-white hover:bg-brand-blue hover:ring-brand-blue transition-colors"
                >
                  <Icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Link columns */}
          {COLUMNS.map((col, i) => (
            <nav
              key={col.title}
              aria-label={col.title}
              className={['md:col-span-3 md:col-start-6', 'md:col-span-2', 'col-span-2 sm:col-span-1 md:col-span-2'][i]}
            >
              <h3 className="text-xs font-semibold uppercase tracking-[0.14em] text-gray-500 mb-4">{col.title}</h3>
              <ul className={i === 2 ? 'grid grid-cols-2 gap-x-6 gap-y-2.5 sm:block sm:space-y-2.5' : 'space-y-2.5'}>
                {col.links.map((l) => (
                  <li key={l.href}>
                    <a href={l.href} className="text-sm text-gray-300 hover:text-brand-blue transition-colors">
                      {l.label}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="pt-6 border-t border-white/[0.06] flex flex-col-reverse md:flex-row md:items-center md:justify-between gap-3">
          <p className="text-xs text-gray-500">&copy; {new Date().getFullYear()} Coach Himanshu. All rights reserved.</p>
          <p className="inline-flex items-center gap-1.5 text-xs text-gray-500">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            NASM certified · Secure payments via Razorpay
          </p>
        </div>
      </div>
    </footer>
  );
}
