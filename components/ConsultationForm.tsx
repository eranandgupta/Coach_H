'use client';

import { useState } from 'react';

// Compact "free consultation" enquiry form for landing pages (country pages,
// the 1:1 hub). Posts to the existing /api/contact endpoint, which stores a
// ContactSubmission and emails the coach — so enquiries land in the same
// inbox and admin list as the contact page.

interface Props {
  /** Where the enquiry came from, e.g. "Online fitness coach — UAE". Goes into the message. */
  source: string;
  /** Pre-filled international dialling code, e.g. "+971". */
  dialCode?: string;
  /** Country/region name used in copy, e.g. "the UAE". */
  placeName?: string;
  whatsappHref: string;
}

const GOALS = ['Lose weight', 'Build muscle', 'Gain weight', 'Get fit & toned', 'Manage PCOS / diabetes / BP', 'Post-injury rehab', 'Not sure yet'];
const TIMES = ['Early morning', 'Daytime', 'Evening', 'Late night', 'Any time'];

const inputCls =
  'w-full rounded-lg border border-white/10 bg-brand-navy px-3 py-2.5 text-sm text-white placeholder:text-gray-500 outline-none focus:border-brand-blue/60';

export default function ConsultationForm({ source, dialCode = '+91', placeName, whatsappHref }: Props) {
  const [form, setForm] = useState({ name: '', email: '', phone: dialCode + ' ', goal: GOALS[0], time: TIMES[2], note: '', website: '' });
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle');
  const [error, setError] = useState('');

  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
    setForm((f) => ({ ...f, [k]: e.target.value }));

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus('sending');
    setError('');
    const message = [
      `Free consultation request — ${source}`,
      `Goal: ${form.goal}`,
      `Preferred time (their local time): ${form.time}`,
      `WhatsApp: ${form.phone.trim() || 'not given'}`,
      form.note.trim() ? `Note: ${form.note.trim()}` : '',
    ]
      .filter(Boolean)
      .join('\n');
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: form.name.trim(),
          email: form.email.trim(),
          phone: form.phone.trim(),
          subject: 'Free consultation request',
          message,
          website: form.website, // honeypot — real users never fill this
        }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || 'Could not send your request');
      }
      setStatus('sent');
      if (typeof window !== 'undefined' && (window as any).gtag) {
        (window as any).gtag('event', 'consultation_request', { event_category: 'engagement', event_label: source });
      }
    } catch (err) {
      setStatus('error');
      setError(err instanceof Error ? err.message : 'Could not send your request. Please try again.');
    }
  }

  if (status === 'sent') {
    return (
      <div className="rounded-2xl border border-emerald-400/30 bg-emerald-400/10 p-6 text-center">
        <h3 className="text-xl font-bold text-white">Request received</h3>
        <p className="mt-2 text-sm text-gray-300">
          Coach Himanshu will reply within 24 hours on WhatsApp or email to set up your free consultation
          {placeName ? ` at a time that works in ${placeName}` : ''}.
        </p>
        <a href={whatsappHref} target="_blank" rel="noopener noreferrer" className="mt-4 inline-block text-sm font-semibold text-brand-gold hover:text-white">
          In a hurry? Message on WhatsApp now →
        </a>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="rounded-2xl border border-brand-blue/20 bg-brand-navy-light p-5 md:p-7 text-left">
      <h3 className="text-xl font-bold text-white">Request a free consultation</h3>
      <p className="mt-1 text-sm text-gray-400">
        Leave your details and Coach Himanshu will get in touch within 24 hours. No payment, no commitment.
      </p>

      <div className="mt-5 grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="cf-name" className="mb-1.5 block text-xs font-medium text-gray-400">Name</label>
          <input id="cf-name" required maxLength={80} autoComplete="name" value={form.name} onChange={set('name')} className={inputCls} placeholder="Your name" />
        </div>
        <div>
          <label htmlFor="cf-email" className="mb-1.5 block text-xs font-medium text-gray-400">Email</label>
          <input id="cf-email" type="email" required maxLength={120} autoComplete="email" value={form.email} onChange={set('email')} className={inputCls} placeholder="you@example.com" />
        </div>
        <div>
          <label htmlFor="cf-phone" className="mb-1.5 block text-xs font-medium text-gray-400">WhatsApp number (with country code)</label>
          <input id="cf-phone" type="tel" required maxLength={24} autoComplete="tel" value={form.phone} onChange={set('phone')} className={inputCls} placeholder={`${dialCode} …`} />
        </div>
        <div>
          <label htmlFor="cf-goal" className="mb-1.5 block text-xs font-medium text-gray-400">Main goal</label>
          <select id="cf-goal" value={form.goal} onChange={set('goal')} className={inputCls}>
            {GOALS.map((g) => <option key={g}>{g}</option>)}
          </select>
        </div>
        <div>
          <label htmlFor="cf-time" className="mb-1.5 block text-xs font-medium text-gray-400">Best time to reach you (your local time)</label>
          <select id="cf-time" value={form.time} onChange={set('time')} className={inputCls}>
            {TIMES.map((t) => <option key={t}>{t}</option>)}
          </select>
        </div>
        <div>
          <label htmlFor="cf-note" className="mb-1.5 block text-xs font-medium text-gray-400">Anything else? (optional)</label>
          <input id="cf-note" maxLength={300} value={form.note} onChange={set('note')} className={inputCls} placeholder="Injuries, schedule, questions…" />
        </div>
        {/* Honeypot: hidden from people, filled by bots */}
        <div className="hidden" aria-hidden="true">
          <label htmlFor="cf-website">Website</label>
          <input id="cf-website" tabIndex={-1} autoComplete="off" value={form.website} onChange={set('website')} />
        </div>
      </div>

      {status === 'error' && <p className="mt-4 text-sm text-red-300">{error}</p>}

      <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center">
        <button
          type="submit"
          disabled={status === 'sending'}
          className="rounded-xl bg-brand-blue px-6 py-3 font-bold text-white shadow-lg shadow-brand-blue/25 transition-colors hover:bg-brand-blue-dark disabled:opacity-60"
        >
          {status === 'sending' ? 'Sending…' : 'Request free consultation'}
        </button>
        <a href={whatsappHref} target="_blank" rel="noopener noreferrer" className="text-sm font-semibold text-gray-300 hover:text-white">
          or message on WhatsApp instead →
        </a>
      </div>
      <p className="mt-3 text-xs text-gray-500">Your details are only used to contact you about coaching. No spam, ever.</p>
    </form>
  );
}
