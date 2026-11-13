import Link from 'next/link';
import ConsultationForm from '@/components/ConsultationForm';
import { SUMMARY, inr } from '@/lib/pricingGuide';
import { getGoalBySlug } from '@/lib/ptGoals';

/**
 * "Train live with the coach" block for the free nutrition pages (food, list, comparison,
 * calculator). Those pages bring in most of the search traffic but only offered a diet-plan
 * WhatsApp link; this points readers at live 1-on-1 sessions and collects an enquiry with the
 * page as its source. Prices come from lib/plans.ts via lib/pricingGuide.ts, so they can't drift.
 */
interface Props {
  /** 1:1 goal page slug (/online-personal-trainer/for/{goal}); omit to link the 1:1 hub. */
  goal?: string;
  /** What the reader was looking at, used in the heading and WhatsApp text: "butter chicken". */
  topic: string;
  /** Enquiry source shown to the coach, e.g. "Food page: Butter Chicken". */
  source: string;
}

export default function SessionsCta({ goal, topic, source }: Props) {
  const g = goal ? getGoalBySlug(goal) : undefined;
  if (goal && !g) throw new Error(`SessionsCta: unknown 1:1 goal "${goal}"`);
  const href = g ? `/online-personal-trainer/for/${g.slug}` : '/online-personal-trainer';
  const whatsapp = `https://wa.me/917303484648?text=${encodeURIComponent(
    `Hi Coach Himanshu! I was reading about ${topic} on your site and want to know about 1-on-1 training sessions.`
  )}`;

  return (
    <section className="pb-16">
      <div className="max-w-3xl mx-auto px-4">
        <div className="rounded-2xl border border-brand-blue/20 bg-gradient-to-r from-brand-blue/10 to-brand-navy-light p-6 md:p-8">
          <p className="text-xs font-semibold uppercase tracking-wider text-brand-gold">Live 1-on-1 coaching</p>
          <h2 className="mt-2 text-xl md:text-2xl font-bold text-white">
            Knowing the calories is step one. Want a coach to build them into your week?
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-gray-300">
            Train live with NASM-certified Coach Himanshu over video: 60-minute 1-on-1 sessions, a personalised Indian diet
            plan around foods like {topic}, and WhatsApp support between sessions. Packages start at{' '}
            <strong className="text-white">{inr(SUMMARY.liveFrom)} for 12 sessions</strong>, and larger packages come to about{' '}
            {inr(SUMMARY.sessionLow)} a session.
          </p>
          <div className="mt-5 flex flex-wrap gap-3">
            <Link
              href={href}
              className="rounded-xl bg-gradient-to-r from-brand-blue to-blue-500 px-6 py-3 font-semibold text-white shadow-lg shadow-brand-blue/25 hover:-translate-y-0.5 transition-transform"
            >
              {g ? `1-on-1 training for ${g.name.toLowerCase()}` : '1-on-1 online personal training'}
            </Link>
            <a
              href={whatsapp}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-xl border border-white/15 px-6 py-3 font-semibold text-white hover:bg-white/5 transition-colors"
            >
              Ask on WhatsApp
            </a>
          </div>
          <p className="mt-4 text-xs text-gray-400">
            Not ready for live sessions?{' '}
            <Link href="/plans" className="text-brand-blue hover:underline">See coaching plans</Link> or{' '}
            <Link href="/personal-trainer-cost-india" className="text-brand-blue hover:underline">compare session prices</Link>.
          </p>
          <div className="mt-6">
            <ConsultationForm source={source} whatsappHref={whatsapp} />
          </div>
        </div>
      </div>
    </section>
  );
}
