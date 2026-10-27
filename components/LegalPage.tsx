import type { ReactNode } from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import AnnouncementBar from '@/components/AnnouncementBar';
import { BUSINESS, GRIEVANCE_OFFICER, TERMS_UPDATED_LABEL, TERMS_VERSION } from '@/lib/legal';

/** Shared frame + typography for the policy pages, so they stay consistent and versioned. */
export default function LegalPage({ icon, title, intro, children }: {
  icon: ReactNode;
  title: string;
  intro?: ReactNode;
  children: ReactNode;
}) {
  return (
    <div className="min-h-screen bg-brand-navy">
      <AnnouncementBar />
      <Navbar />

      <div className="pt-32 pb-16 px-4 md:px-6">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-brand-blue/10 rounded-2xl mb-6">
              {icon}
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">{title}</h1>
            <p className="text-gray-400">
              Last updated: {TERMS_UPDATED_LABEL} · Version {TERMS_VERSION}
            </p>
            {intro && <p className="text-gray-300 mt-6 max-w-2xl mx-auto leading-relaxed">{intro}</p>}
          </div>

          <div className="bg-brand-navy-light/30 rounded-2xl p-6 md:p-12 border border-brand-navy-light/20">
            <div className="max-w-none">{children}</div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}

export function Section({ n, title, children }: { n: number | string; title: string; children: ReactNode }) {
  return (
    <section className="mb-10" id={`s${n}`}>
      <h2 className="text-2xl font-bold text-white mb-4">{n}. {title}</h2>
      {children}
    </section>
  );
}

export function Sub({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="mb-5">
      <h3 className="text-lg font-semibold text-white mb-2">{title}</h3>
      {children}
    </div>
  );
}

export function P({ children }: { children: ReactNode }) {
  return <p className="text-gray-300 leading-relaxed mb-4">{children}</p>;
}

export function List({ items }: { items: ReactNode[] }) {
  return (
    <ul className="list-disc pl-5 text-gray-300 space-y-2 mb-4 leading-relaxed">
      {items.map((item, i) => <li key={i}>{item}</li>)}
    </ul>
  );
}

export function Callout({ children }: { children: ReactNode }) {
  return (
    <div className="my-6 p-5 rounded-xl border border-brand-blue/30 bg-brand-blue/10 text-gray-200 leading-relaxed">
      {children}
    </div>
  );
}

export function A({ href, children }: { href: string; children: ReactNode }) {
  const cls = 'text-brand-blue hover:underline';
  return href.startsWith('/')
    ? <Link href={href} className={cls}>{children}</Link>
    : <a href={href} className={cls}>{children}</a>;
}

/** Business identity + grievance officer — required by the Consumer Protection (E-Commerce) Rules, 2020. */
export function ContactBlock() {
  return (
    <div className="grid md:grid-cols-2 gap-4">
      <div className="rounded-lg p-5 border border-brand-blue/20 bg-brand-navy-light/50 text-gray-300 space-y-1">
        <p className="text-white font-semibold mb-2">{BUSINESS.tradeName}</p>
        {BUSINESS.legalName && <p>Legal name: {BUSINESS.legalName}</p>}
        {BUSINESS.address && <p>Address: {BUSINESS.address}</p>}
        {BUSINESS.gstin && <p>GSTIN: {BUSINESS.gstin}</p>}
        <p>Email: <A href={`mailto:${BUSINESS.email}`}>{BUSINESS.email}</A></p>
        <p>Phone / WhatsApp: <A href={BUSINESS.phoneHref}>{BUSINESS.phone}</A></p>
        <p>Website: <A href={BUSINESS.website}>{BUSINESS.website.replace('https://', '')}</A></p>
      </div>
      <div className="rounded-lg p-5 border border-brand-blue/20 bg-brand-navy-light/50 text-gray-300 space-y-1">
        <p className="text-white font-semibold mb-2">Grievance Officer</p>
        <p>{GRIEVANCE_OFFICER.name}, {GRIEVANCE_OFFICER.designation}</p>
        <p>Email: <A href={`mailto:${GRIEVANCE_OFFICER.email}`}>{GRIEVANCE_OFFICER.email}</A></p>
        <p>Phone: {GRIEVANCE_OFFICER.phone}</p>
        <p className="text-sm text-gray-400 pt-1">Complaints are acknowledged within 48 hours and resolved within 30 days.</p>
      </div>
    </div>
  );
}
