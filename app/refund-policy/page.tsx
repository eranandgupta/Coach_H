import { RefreshCcw } from 'lucide-react';
import LegalPage, { A, Callout, ContactBlock, List, P, Section, Sub } from '@/components/LegalPage';

export default function RefundPolicy() {
  return (
    <LegalPage
      icon={<RefreshCcw className="w-8 h-8 text-brand-blue" />}
      title="Refund Policy"
      intro="Our coaching is a personalised digital service that starts the moment your payment is confirmed. Please read this policy before you buy — you accept it at checkout."
    >
      <Callout>
        <strong className="text-white">Summary:</strong> plans are non-refundable once activated. You get a refund only if
        you were charged twice, the payment was not made by you, or we fail to deliver the service as described below.
        If something is wrong, write to us first — we resolve most issues within 48 hours.
      </Callout>

      <Section n={1} title="When your plan is activated">
        <P>Your plan is <strong className="text-white">activated</strong> as soon as your payment is confirmed. At that moment:</P>
        <List items={[
          'your client account is created and login details are emailed to the address you entered at checkout;',
          'you get immediate access to your dashboard, the video exercise library and coach support;',
          'our coaching team starts preparing your personalised plan (workout and nutrition plans are delivered within 24 hours of receiving your completed assessment form);',
          'for Elite 1:1 plans, a trainer is assigned and your session slot is reserved.',
        ]} />
        <P>
          By completing payment you expressly ask us to start the service immediately, and you acknowledge that a
          personalised digital service that has started cannot be returned.
        </P>
      </Section>

      <Section n={2} title="Non-refundable after activation">
        <P>Once activated, a plan is <strong className="text-white">non-refundable</strong>, including — but not limited to — when:</P>
        <List items={[
          'you change your mind, lose motivation, or do not use the service (logging in, following the plan or attending sessions is your choice — the plan runs either way);',
          'you are dissatisfied with results (fitness results depend on your own effort, health and consistency and are never guaranteed);',
          'you relocate, travel, change jobs or face personal or financial difficulties;',
          'you are injured or unwell (use the pause option where your plan allows it — see the Cancellation Policy);',
          'you bought the plan at a sale price or with a promo code;',
          'unused Elite 1:1 sessions expire at the end of the plan validity.',
        ]} />
      </Section>

      <Section n={3} title="When you WILL get a refund">
        <Sub title="3.1 Duplicate or erroneous charge">
          <P>If you were charged more than once for the same order, or charged an amount different from the price shown at checkout, the extra amount is refunded in full.</P>
        </Sub>
        <Sub title="3.2 Unauthorised payment">
          <P>If a payment was made without your knowledge (for example a stolen card), tell us immediately. After verification, the payment is refunded in full and the account is closed.</P>
        </Sub>
        <Sub title="3.3 We fail to deliver">
          <List items={[
            'If we do not deliver your personalised plan within 7 days of receiving your completed assessment form, despite you reminding us in writing, you may choose a full refund instead.',
            'If your login does not work and we cannot fix it within 72 hours of you reporting it, you may choose a full refund.',
            'If we discontinue the service or terminate your plan for reasons that are not your fault, you get a pro-rata refund for the unused period (or unused sessions for Elite 1:1).',
            'Elite 1:1 sessions missed because of trainer unavailability are first rescheduled or credited one-for-one; if we cannot do so within the plan validity, the missed sessions are refunded pro-rata.',
          ]} />
        </Sub>
      </Section>

      <Section n={4} title="How to request a refund">
        <List items={[
          <>Email <A href="mailto:info@coachhimanshu.com">info@coachhimanshu.com</A> or WhatsApp <A href="tel:+917303484648">+91 7303484648</A> with your registered email, order ID / payment ID and the reason.</>,
          'We acknowledge every request within 48 hours and give a decision within 7 working days.',
          'Approved refunds are sent to the original payment method within 5–7 working days. Bank or card network processing time may add a few days.',
          'Refunds are only made to the original payment method — never in cash or to a different account.',
        ]} />
      </Section>

      <Section n={5} title="Chargebacks and payment disputes">
        <P>
          Please contact us before raising a dispute with your bank, card issuer or UPI app. A refund we issue directly
          is faster than any dispute, and every genuine problem listed in Section 3 is refunded without one.
        </P>
        <P>If a dispute is raised for a plan that was activated and delivered, we will respond to the payment gateway and bank with evidence, which may include:</P>
        <List items={[
          'the order and payment record (amount, time, payment method, customer email and phone);',
          'your acceptance of these policies at checkout — the policy version, date, time and IP address are recorded with every payment;',
          'the payment receipt and login-details emails sent to you;',
          'your account activity — login history with dates, times, IP addresses and devices;',
          'the plans, workouts and diet charts delivered to you, and Elite 1:1 session records confirmed by your trainer;',
          'our communication with you on WhatsApp, email and in-app chat.',
        ]} />
        <P>
          You agree that we may share these records with the payment gateway, bank and card network for the sole purpose
          of resolving the dispute. While a dispute is open, account access may be suspended. A dispute raised for a plan
          that was delivered as described is a breach of these terms; we may permanently close the account and recover
          the amount and any dispute fees through lawful means.
        </P>
      </Section>

      <Section n={6} title="Payments made outside the official checkout">
        <P>
          We are only responsible for payments made through the checkout on coachhimanshu.com (processed by Cashfree
          Payments) or to official accounts confirmed in writing by us. Money paid directly to an individual trainer or
          any other person is at your own risk and is not covered by this policy.
        </P>
      </Section>

      <Section n={7} title="Your statutory rights">
        <P>
          Nothing in this policy limits any right you have under the Consumer Protection Act, 2019 that cannot be
          excluded by contract. This policy is part of our <A href="/terms-of-service">Terms of Service</A>; see also
          the <A href="/cancellation-policy">Cancellation Policy</A>.
        </P>
      </Section>

      <Section n={8} title="Contact and grievances">
        <ContactBlock />
      </Section>
    </LegalPage>
  );
}
