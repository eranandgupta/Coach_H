import { XCircle } from 'lucide-react';
import LegalPage, { A, Callout, ContactBlock, List, P, Section, Sub } from '@/components/LegalPage';
import { PAUSE_RULES } from '@/lib/legal';

export default function CancellationPolicy() {
  return (
    <LegalPage
      icon={<XCircle className="w-8 h-8 text-brand-blue" />}
      title="Cancellation Policy"
      intro="How plans end, how to stop or pause your coaching, and the rules for Elite 1:1 live sessions."
    >
      <Callout>
        <strong className="text-white">No automatic renewals.</strong> Every plan is a one-time payment for a fixed
        period. We never charge you again unless you choose to buy or renew a plan yourself.
      </Callout>

      <Section n={1} title="How a plan ends">
        <List items={[
          'Each plan runs for the period shown at checkout, starting on the activation date (or, for an early renewal, the day after your current plan ends).',
          'Elite 1:1 plans end when the validity period ends or when all sessions are used — whichever comes first.',
          'Your start and end dates are shown in your payment receipt and on your dashboard.',
          'When a plan ends, coaching support and plan updates stop. You can still log in and view your history.',
        ]} />
      </Section>

      <Section n={2} title="Cancelling">
        <P>
          You can ask us to stop your coaching at any time by emailing <A href="mailto:info@coachhimanshu.com">info@coachhimanshu.com</A> or
          messaging us on WhatsApp at <A href="tel:+917303484648">+91 7303484648</A> from your registered number. We confirm in writing within 48 hours.
        </P>
        <P>
          Because plans are one-time payments that start immediately, cancelling does not create a refund for the remaining
          period. You keep access until the plan&apos;s end date unless you ask us to close the account sooner. Refunds are only
          given in the cases listed in our <A href="/refund-policy">Refund Policy</A>.
        </P>
      </Section>

      <Section n={3} title="Pausing a plan">
        <P>Longer plans can be paused once for travel, illness or injury. The end date moves forward by the days paused.</P>
        <div className="overflow-x-auto mb-4">
          <table className="w-full text-left text-gray-300 text-sm border border-white/10 rounded-lg">
            <thead>
              <tr className="bg-white/5 text-white">
                <th className="p-3">Plan</th>
                <th className="p-3">Pause allowed</th>
              </tr>
            </thead>
            <tbody>
              {PAUSE_RULES.map((r) => (
                <tr key={r.plan} className="border-t border-white/10">
                  <td className="p-3">{r.plan}</td>
                  <td className="p-3">{r.days}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <List items={[
          'Request a pause in advance by email or WhatsApp. Pauses cannot be applied to dates that have already passed.',
          'When the allowed pause days are used up, the plan resumes automatically.',
          'Days not paused are not refundable and cannot be transferred to another person.',
        ]} />
      </Section>

      <Section n={4} title="Elite 1:1 live session rules">
        <List items={[
          'Each session is 60 minutes, held online at the fixed time agreed with your trainer.',
          'All sessions must be used within the plan validity: 30 days for the 12- and 24-session plans, 3 months for the 36- and 72-session plans. Unused sessions expire.',
          'Renewing an Elite 1:1 plan while it is still running carries your unused sessions into the new plan.',
          'To reschedule, tell your trainer at least 24 hours in advance. A session missed or cancelled with less than 24 hours’ notice counts as completed.',
          'If you join late, the session still ends at the scheduled time.',
          'Sessions missed because the trainer was unavailable, or because of a problem on our side, are rescheduled or credited one-for-one.',
          'Each completed session is recorded and confirmed by your trainer in our system.',
          'Couple plans share one account and one session slot for both partners.',
        ]} />
      </Section>

      <Section n={5} title="Cancellation by us">
        <Sub title="5.1 For breach of terms">
          <P>
            We may suspend or end a plan without refund if you share your account, copy or resell our content, give false
            information, abuse or harass our staff, or raise a dispute for a plan that was delivered as described.
          </P>
        </Sub>
        <Sub title="5.2 For reasons not your fault">
          <P>If we have to stop providing your plan for any other reason, you receive a pro-rata refund for the unused period or sessions.</P>
        </Sub>
      </Section>

      <Section n={6} title="Data after your plan ends">
        <P>
          Your account and history stay available so you can return. You can ask us to delete your data at any time —
          see the <A href="/privacy-policy">Privacy Policy</A> for what we must keep by law.
        </P>
      </Section>

      <Section n={7} title="Contact and grievances">
        <ContactBlock />
      </Section>
    </LegalPage>
  );
}
