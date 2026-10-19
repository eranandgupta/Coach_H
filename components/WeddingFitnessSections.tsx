import Link from 'next/link';
import { COUNTRIES } from '@/lib/countries';
import { COUNTDOWN_WEEKS, planPicks, weddingTimeline, type WeddingFaq, type WeddingWho } from '@/lib/weddingFitness';

// Server-rendered sections shared by the /wedding-fitness-plan hub and its
// bride / groom / couple pages, so the static tables match the widget exactly.

const th = 'py-3 px-4 text-left text-xs font-semibold uppercase tracking-wide text-gray-400';
const td = 'py-3 px-4 text-sm text-gray-300 align-top';

export function CountdownTable({ who }: { who: WeddingWho }) {
  return (
    <div className="overflow-x-auto rounded-2xl border border-white/[0.08]">
      <table className="w-full min-w-[640px]">
        <thead className="bg-white/[0.03]">
          <tr>
            <th className={th}>Weeks to go</th>
            <th className={th}>Realistic fat loss{who === 'couple' ? ' (each)' : ''}</th>
            <th className={th}>Phases</th>
            <th className={th}>Plans that fit</th>
          </tr>
        </thead>
        <tbody>
          {COUNTDOWN_WEEKS.map((w) => {
            const t = weddingTimeline(w);
            return (
              <tr key={w} className="border-t border-white/[0.06]">
                <td className={`${td} font-semibold text-white`}>{w} weeks</td>
                <td className={td}>
                  {t.lowKg}–{t.highKg} kg
                </td>
                <td className={td}>{t.phases.map((p) => p.name).join(' → ')}</td>
                <td className={td}>
                  {planPicks(who, w)
                    .map((p) => `${p.plan.name} (${p.plan.priceLabel})`)
                    .join(' or ')}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

export function WeddingFaqList({ faqs }: { faqs: WeddingFaq[] }) {
  return (
    <div className="space-y-4">
      {faqs.map((f) => (
        <div key={f.question} className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-6">
          <h3 className="mb-2 text-lg font-semibold text-white">{f.question}</h3>
          <p className="text-sm leading-relaxed text-gray-400">{f.answer}</p>
        </div>
      ))}
    </div>
  );
}

// For the diaspora flying home for a wedding in India.
export function FlyingHomeSection() {
  const points = [
    { title: 'Sessions in your time zone', text: 'Live sessions and consultations are booked around your local working hours, whether you are in Toronto, London, Dubai or Sydney.' },
    { title: 'Travel week planned in', text: 'Long-haul flights, jet lag and the first days at home are built into the plan, with short hotel-room or bodyweight sessions so the streak does not break.' },
    { title: 'Wedding week in India', text: 'Function food, late nights and family meals are planned for, so you keep the result you worked for without refusing every plate.' },
    { title: 'Pay with your card', text: 'Prices are the same everywhere and charged in rupees. International Visa and Mastercard cards work at checkout.' },
  ];
  return (
    <div>
      <div className="grid gap-4 md:grid-cols-2">
        {points.map((p) => (
          <div key={p.title} className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-6">
            <h3 className="mb-2 font-semibold text-white">{p.title}</h3>
            <p className="text-sm leading-relaxed text-gray-400">{p.text}</p>
          </div>
        ))}
      </div>
      <p className="mt-6 text-center text-sm text-gray-400">
        Coaching by country:{' '}
        {COUNTRIES.slice(0, 8).map((c, i) => (
          <span key={c.slug}>
            {i > 0 && ', '}
            <Link href={`/online-fitness-coach/${c.slug}`} className="text-brand-blue hover:underline">
              {c.country}
            </Link>
          </span>
        ))}
        {' · '}
        <Link href="/online-fitness-coach" className="text-brand-blue hover:underline">
          all countries
        </Link>
      </p>
    </div>
  );
}
