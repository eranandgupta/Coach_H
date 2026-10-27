import { FileText } from 'lucide-react';
import LegalPage, { A, Callout, ContactBlock, List, P, Section, Sub } from '@/components/LegalPage';
import { BUSINESS } from '@/lib/legal';

export default function TermsOfService() {
  return (
    <LegalPage
      icon={<FileText className="w-8 h-8 text-brand-blue" />}
      title="Terms of Service"
      intro="These terms form a binding agreement between you and Coach Himanshu. You accept them by ticking the box at checkout and completing payment."
    >
      <Section n={1} title="Who we are and this agreement">
        <P>
          Coach Himanshu{BUSINESS.legalName ? ` (${BUSINESS.legalName})` : ''} (&quot;we&quot;, &quot;us&quot;) runs coachhimanshu.com and provides online
          fitness coaching (the &quot;Services&quot;). These Terms, together with our <A href="/refund-policy">Refund Policy</A>,{' '}
          <A href="/cancellation-policy">Cancellation Policy</A>, <A href="/privacy-policy">Privacy Policy</A> and{' '}
          <A href="/disclaimer">Disclaimer</A>, are the whole agreement between you and us.
        </P>
        <P>
          This agreement is made electronically under the Information Technology Act, 2000. Ticking the acceptance box
          and paying has the same effect as signing it. We record the version you accepted together with the date, time
          and IP address of your purchase.
        </P>
      </Section>

      <Section n={2} title="The Services">
        <Sub title="2.1 What every plan includes">
          <List items={[
            'A client account with dashboard access, created automatically when payment is confirmed. Login details are emailed to you straight away.',
            'A personalised workout plan and nutrition guidance, prepared by our coaching team from your assessment form and delivered within 24 hours of receiving the completed form.',
            'Progress tracking, plan updates and coach support on WhatsApp and in-app chat (9 am – 7 pm IST).',
            'Access to the exercise video library for the plan period.',
          ]} />
        </Sub>
        <Sub title="2.2 Elite 1:1 plans">
          <P>
            Elite 1:1 plans add a fixed number of live, one-on-one online sessions of 60 minutes with an assigned trainer.
            Scheduling, rescheduling, expiry and missed-session rules are in Section 4 of the{' '}
            <A href="/cancellation-policy">Cancellation Policy</A> and form part of these Terms.
          </P>
        </Sub>
        <Sub title="2.3 What the Services are not">
          <P>
            The Services are coaching and education. They are not medical treatment, physiotherapy or a diagnosis, and we
            do not promise any particular result. Results depend on your own effort, consistency, health and lifestyle.
          </P>
        </Sub>
      </Section>

      <Section n={3} title="Eligibility and your account">
        <List items={[
          'You must be at least 18, or at least 16 with the consent of a parent or guardian who accepts these Terms for you.',
          'Give accurate details at checkout and in your assessment — especially health conditions, injuries and medication.',
          'One account per person (couple plans: one shared account for the two named partners). Do not share your login.',
          'You are responsible for activity on your account. Tell us at once if you suspect unauthorised access.',
        ]} />
      </Section>

      <Section n={4} title="Plans, prices and payment">
        <List items={[
          <>Current plans, durations and prices are shown on our <A href="/plans">plans page</A> and at checkout. The price and period shown at checkout when you pay are the ones that apply to your order.</>,
          'Prices are in Indian Rupees (INR) and include any applicable taxes unless stated otherwise.',
          'Payment is taken in full, in advance, through Cashfree Payments. We never see or store your card or UPI credentials.',
          'Every plan is a one-time payment. There are no automatic renewals or recurring charges.',
          'Sale prices and promo codes apply only within their stated period and cannot be applied after purchase.',
          'Renewing early adds the new plan after your current one ends, so no paid time is lost.',
          'We are only responsible for payments made through our website checkout or to official accounts we confirm in writing. Payments made directly to any trainer or individual are at your own risk.',
        ]} />
      </Section>

      <Section n={5} title="Refunds, cancellation and disputes">
        <Callout>
          Plans start immediately on payment and are <strong className="text-white">non-refundable once activated</strong>,
          except for duplicate charges, unauthorised payments, or our failure to deliver — exactly as described in the{' '}
          <A href="/refund-policy">Refund Policy</A>. Please contact us before raising any dispute with your bank.
        </Callout>
        <P>
          You agree that we may keep and use records of your purchase, policy acceptance, logins (date, time, IP address,
          device), delivered plans, session attendance and communication with us, and share them with the payment gateway,
          bank or card network to resolve any payment dispute.
        </P>
      </Section>

      <Section n={6} title="Your responsibilities">
        <List items={[
          'Consult a doctor before starting, and whenever your health changes. Tell your coach about any pain, injury or condition straight away.',
          'Exercise in a safe space with suitable equipment. No trainer is physically present with you, so your own physical safety is your responsibility.',
          'Follow the plan within your own limits and stop if you feel unwell.',
          'Treat coaches and staff with respect. Abuse or harassment ends the service without refund.',
        ]} />
      </Section>

      <Section n={7} title="Our content">
        <P>
          Workout plans, diet plans, videos, text and software on the platform belong to Coach Himanshu. You receive a
          personal, non-transferable licence to use them during your plan. You may not copy, record, share, resell or
          publish them. Progress photos and data you send remain yours; we use them only to coach you, and only use them
          in marketing with your separate written consent.
        </P>
      </Section>

      <Section n={8} title="Health disclaimer and liability">
        <List items={[
          'Our guidance is based on general fitness and nutrition principles and is not a substitute for medical advice.',
          'To the extent permitted by law, we are not liable for injury, illness or loss arising from exercise or diet changes you undertake, or from information you did not disclose to us.',
          'Our total liability for any claim relating to a plan is limited to the amount you paid for that plan.',
          'We are not responsible for third-party products or services, even if mentioned by a coach.',
        ]} />
        <P>See the full <A href="/disclaimer">Disclaimer</A>.</P>
      </Section>

      <Section n={9} title="Suspension and termination">
        <P>
          We may suspend or end your account without refund if you breach these Terms — including account sharing,
          copying content, giving false information, abusive behaviour, fraud, or raising a dispute for a plan delivered as
          described. If we end a plan for any other reason, you receive a pro-rata refund for the unused part.
        </P>
      </Section>

      <Section n={10} title="Changes to these Terms">
        <P>
          We may update these Terms. Each version is dated and numbered at the top of this page. The version you accepted
          at checkout governs that purchase; later versions apply to later purchases and renewals.
        </P>
      </Section>

      <Section n={11} title="Governing law and complaints">
        <List items={[
          'These Terms are governed by the laws of India.',
          'Please raise any complaint with our Grievance Officer first (details below). We acknowledge it within 48 hours and aim to resolve it within 30 days.',
          'If it is not resolved, the courts at our place of business in India have jurisdiction. This does not limit your rights under the Consumer Protection Act, 2019.',
          'If any part of these Terms is found unenforceable, the rest remains in effect.',
        ]} />
      </Section>

      <Section n={12} title="Contact and grievances">
        <ContactBlock />
      </Section>
    </LegalPage>
  );
}
