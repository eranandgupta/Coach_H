/**
 * Single source for the business identity and policy version shown on the legal pages,
 * checkout and receipts. Bump TERMS_VERSION whenever Terms / Refund / Cancellation /
 * Privacy text changes in substance — each payment records the version the client accepted.
 */

export const TERMS_VERSION = '2026-10-27';
export const TERMS_UPDATED_LABEL = '27 October 2026';

export const BUSINESS = {
  tradeName: 'Coach Himanshu',
  // Must match the Cashfree KYC exactly. Left empty → the identity block is hidden.
  legalName: '',
  address: '',
  gstin: '',
  email: 'info@coachhimanshu.com',
  phone: '+91 7303484648',
  phoneHref: 'tel:+917303484648',
  website: 'https://coachhimanshu.com',
};

export const GRIEVANCE_OFFICER = {
  name: 'Himanshu',
  designation: 'Founder & Head Coach',
  email: 'info@coachhimanshu.com',
  phone: '+91 7303484648',
};

/** Pause allowance per plan — mirrors getMaxPauseDays in lib/planUtils.ts. */
export const PAUSE_RULES: { plan: string; days: string }[] = [
  { plan: '1-month and 3-month plans (incl. Elite 1:1 12 / 24 sessions)', days: 'Not available' },
  { plan: '6-month plans', days: 'Up to 7 days' },
  { plan: 'Elite 1:1 3-month plans (36 / 72 sessions)', days: 'Up to 7 days' },
  { plan: '12-month plans', days: 'Up to 15 days' },
];
