import { Shield } from 'lucide-react';
import LegalPage, { A, ContactBlock, List, P, Section, Sub } from '@/components/LegalPage';

export default function PrivacyPolicy() {
  return (
    <LegalPage
      icon={<Shield className="w-8 h-8 text-brand-blue" />}
      title="Privacy Policy"
      intro="What personal data we collect, why, who we share it with and how long we keep it — written to meet the Digital Personal Data Protection Act, 2023 and the IT Act, 2000."
    >
      <Section n={1} title="Who is responsible">
        <P>
          Coach Himanshu is the data fiduciary for personal data collected through coachhimanshu.com and our coaching
          services. Questions or requests go to our Grievance Officer (details at the end of this page).
        </P>
      </Section>

      <Section n={2} title="Data we collect">
        <Sub title="2.1 You give us">
          <List items={[
            'Name, email address, phone / WhatsApp number and country — at checkout.',
            'For couple plans, your partner’s name, contact details and goal.',
            'Assessment data: age, gender, height, weight, body measurements, fitness level, goals, diet preferences, and health information such as conditions, injuries and medication.',
            'Progress photos, habit and workout logs, and messages you send our coaches.',
          ]} />
        </Sub>
        <Sub title="2.2 Collected automatically">
          <List items={[
            'Order records: plan, amount, order and payment IDs, payment time and status (from Cashfree Payments).',
            'Policy acceptance record: the version of our terms you accepted, with date, time and IP address.',
            'Login records: date, time, IP address and browser / device of each sign-in.',
            'Service records: plans delivered to you and Elite 1:1 sessions confirmed by your trainer.',
            'Basic analytics (pages visited, device type) through Google Analytics, and cookies needed to keep you signed in.',
          ]} />
        </Sub>
        <P>
          We do <strong className="text-white">not</strong> receive or store your card number, CVV, UPI PIN or bank login.
          These are handled entirely by Cashfree Payments, a PCI-DSS compliant payment gateway.
        </P>
      </Section>

      <Section n={3} title="Why we use it">
        <List items={[
          'To create your account and deliver the coaching you paid for — personalised plans, progress reviews and sessions.',
          'To process payments, send receipts and handle refunds.',
          'To keep records that prove the service was purchased and delivered, and to respond to payment disputes and chargebacks.',
          'To prevent fraud, account sharing and misuse.',
          'To send service messages (login details, plan updates, session reminders) by email, WhatsApp or push notification.',
          'To send offers — only if you have not opted out. You can opt out at any time.',
          'To meet legal, tax and accounting obligations.',
        ]} />
        <P>
          We process your data on the basis of your consent given at checkout and while using the service, and where it
          is necessary to perform our contract with you or to comply with law. Health information is used only to coach
          you safely.
        </P>
      </Section>

      <Section n={4} title="Who we share it with">
        <P>We never sell your data. We share it only with:</P>
        <List items={[
          'Cashfree Payments — to process payments, refunds and disputes.',
          'Our hosting and infrastructure providers — Vercel (website hosting), Hostinger (database and email, India) and ImageKit (images).',
          'Google Analytics — anonymised usage statistics.',
          'Our coaches and trainers — only the data needed to coach you.',
          'Banks, card networks and the payment gateway — the purchase, acceptance, login, delivery and communication records described above, if you raise a payment dispute.',
          'Government or law-enforcement authorities — when required by law.',
        ]} />
      </Section>

      <Section n={5} title="How long we keep it">
        <List items={[
          'Account, assessment and progress data: while your account is active, and until you ask us to delete it.',
          'Payment, invoice and policy-acceptance records: up to 8 years, as required by tax and accounting law.',
          'Login, delivery, session and communication records: for 3 years after your last plan ends, so we can respond to disputes.',
          'Where a dispute or legal claim is open, the related records are kept until it is resolved.',
        ]} />
      </Section>

      <Section n={6} title="Your rights">
        <P>You can ask us to:</P>
        <List items={[
          'give you a summary of the personal data we hold about you;',
          'correct or update inaccurate data;',
          'delete your data (except records we must keep by law, listed above);',
          'withdraw consent for marketing or optional processing;',
          'nominate a person to exercise these rights on your behalf.',
        ]} />
        <P>
          Email <A href="mailto:info@coachhimanshu.com">info@coachhimanshu.com</A> from your registered email. We respond
          within 30 days. If you are not satisfied, you may complain to the Data Protection Board of India.
        </P>
      </Section>

      <Section n={7} title="Security">
        <P>
          We use reasonable security practices: encrypted (HTTPS) connections, hashed passwords, access limited to staff
          who need it, and payment processing through a PCI-DSS compliant gateway. No system is completely secure; if a
          breach affects your data, we will inform you and the authorities as required by law.
        </P>
      </Section>

      <Section n={8} title="Children">
        <P>
          The Services are for people aged 18 and over, or 16–17 with verifiable parental consent. We do not knowingly
          collect data from anyone younger. Parents can contact us to review or delete their child’s data.
        </P>
      </Section>

      <Section n={9} title="Changes">
        <P>
          We may update this policy. The version and date are shown at the top of this page, and significant changes are
          notified by email or on the website.
        </P>
      </Section>

      <Section n={10} title="Contact and grievances">
        <ContactBlock />
      </Section>
    </LegalPage>
  );
}
