/**
 * SINGLE SOURCE OF TRUTH for every plan price and every sale/offer.
 *
 * Change a price or a sale here and it flows to: the homepage plan cards + sale banner,
 * the client dashboard renew modal, /api/plans, checkout (create-order price check and
 * floor), sale bonus days at payment, the /plans catalogue, llms.txt and the SEO pages.
 *
 * The DB `SubscriptionPlan.price` column is kept in line with PLAN_PRICES automatically by
 * the daily reconcile cron (or right away with `npx tsx scripts/sync-plan-prices.ts --apply`).
 * Checkout does NOT wait for that sync: it prices from this file.
 *
 * Pure data + pure functions only — imported by both client and server code.
 */

// ─────────────────────────────────────────────────────────────────────────────
// PLAN PRICES (INR) — keyed by the exact DB plan name.
// ─────────────────────────────────────────────────────────────────────────────

export const PLAN_PRICES = {
  // Personalised coaching (gym)
  'Kickstart Plan': { price: 1499, durationDays: 30 },
  'Consistency Plan': { price: 3499, durationDays: 90 },
  'Strength Plan': { price: 5999, durationDays: 180 },
  'Mastery Plan': { price: 11999, durationDays: 365 },
  // Home & rehab
  'Home Workout': { price: 2999, durationDays: 90 },
  'Rehabilitation Plan': { price: 4499, durationDays: 90 },
  // Couple
  'Couple Strength': { price: 9999, durationDays: 180 },
  'Couple Mastery': { price: 19999, durationDays: 365 },
  'Couple Home Workout Plan': { price: 4999, durationDays: 90 },
  'Couple Rehabilitation Plan': { price: 6999, durationDays: 90 },
  // Elite live 1:1
  'Elite 1:1 - 1 Month (12 Sessions)': { price: 8999, durationDays: 30 },
  'Elite 1:1 - 1 Month (24 Sessions)': { price: 14999, durationDays: 30 },
  'Elite 1:1 - 3 Months (36 Sessions)': { price: 21999, durationDays: 90 },
  'Elite 1:1 - 3 Months (72 Sessions)': { price: 34999, durationDays: 90 },
  // Elite live 1:1 couple
  'Elite 1:1 Couple - 1 Month (12 Sessions)': { price: 14999, durationDays: 30 },
  'Elite 1:1 Couple - 1 Month (24 Sessions)': { price: 22999, durationDays: 30 },
  'Elite 1:1 Couple - 3 Months (36 Sessions)': { price: 32999, durationDays: 90 },
  'Elite 1:1 Couple - 3 Months (72 Sessions)': { price: 51999, durationDays: 90 },
} as const satisfies Record<string, { price: number; durationDays: number }>;

export type PlanName = keyof typeof PLAN_PRICES;

// ─────────────────────────────────────────────────────────────────────────────
// SALES / OFFERS
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Master on/off switch for ALL plan offers (sale banner, strikethrough "% OFF" pricing,
 * "+N days free" badges, checkout bonus days). `false` turns every offer off site-wide.
 */
export const SALES_ENABLED = true;

/** % off (or bonus days) per plan type. Missing entries mean 0. */
export interface PlanTable {
  /** Elite 1:1 plans (incl. couple), keyed by session count. */
  eliteSessions?: Partial<Record<12 | 24 | 36 | 72, number>>;
  /** Time-based plans (gym, home, rehab, couple), keyed by length in months. */
  months?: Partial<Record<1 | 3 | 6 | 12, number>>;
  /** Overrides `months` for couple time-based plans. */
  coupleMonths?: Partial<Record<1 | 3 | 6 | 12, number>>;
}

export type SaleTheme = 'environment' | 'yoga' | 'health' | 'independence' | 'festive';

export interface SaleDefinition {
  theme: SaleTheme;
  /** Inclusive date ranges. month is 1–12 (human). A range may not cross a month end; use two ranges. */
  windows: { month: number; from: number; to: number }[];
  title: string;
  subtitle: string;
  endDate: string;
  description: string;
  /** Chips shown on the sale banner. */
  offers: { label: string; off: string }[];
  /** Automatic strikethrough discount. Omit for coupon-only sales. */
  discounts?: PlanTable;
  /** Free days added to the plan at payment (evaluated in IST on the server). */
  bonusDays?: PlanTable;
  /** Coupon-only (spin wheel) sale: no automatic discount. */
  couponOnly?: boolean;
  /** Awareness days shown on the banner (July). */
  healthDays?: { date: number; name: string }[];
}

const JUNE_JULY_DISCOUNTS: PlanTable = {
  eliteSessions: { 12: 10, 24: 10, 36: 20, 72: 20 },
  months: { 1: 5, 3: 10, 6: 10, 12: 12 },
};

const JUNE_JULY_OFFERS = [
  { label: '3M Gym Plan', off: '10% OFF' },
  { label: '3M Home Plan', off: '10% OFF' },
  { label: '3M Rehab Plan', off: '10% OFF' },
  { label: '6M Gym Plan', off: '10% OFF' },
  { label: '12M Gym Plan', off: '12% OFF' },
  { label: '12 Sessions', off: '10% OFF' },
  { label: '24 Sessions', off: '10% OFF' },
  { label: '36 Sessions', off: '20% OFF' },
  { label: '72 Sessions', off: '20% OFF' },
];

const JUNE_DESCRIPTION =
  'Start your fitness journey this June with exclusive discounts on all plans. Transform yourself physically and mentally — the best time to begin is now.';

export const SALES: SaleDefinition[] = [
  {
    theme: 'environment',
    windows: [{ month: 6, from: 1, to: 7 }],
    title: 'WORLD ENVIRONMENT DAY SALE',
    subtitle: 'Valid June 1 - 7 Only',
    endDate: 'June 7, 2026',
    description: JUNE_DESCRIPTION,
    offers: JUNE_JULY_OFFERS,
    discounts: JUNE_JULY_DISCOUNTS,
  },
  {
    theme: 'yoga',
    windows: [{ month: 6, from: 21, to: 30 }],
    title: "WORLD YOGA DAY & FATHER'S DAY SALE",
    subtitle: 'Valid June 21 - 30 Only',
    endDate: 'June 30, 2026',
    description: JUNE_DESCRIPTION,
    offers: JUNE_JULY_OFFERS,
    discounts: JUNE_JULY_DISCOUNTS,
  },
  {
    theme: 'health',
    windows: [{ month: 7, from: 10, to: 31 }],
    title: 'HEALTH REVOLUTION SALE',
    subtitle: 'Valid July 10 - 31 Only',
    endDate: 'July 31, 2026',
    description:
      '22 Days. 5 Global Health Awareness Days. One Mission: Help more people become healthier. Transform your body and mind with exclusive discounts on every plan.',
    offers: JUNE_JULY_OFFERS,
    discounts: JUNE_JULY_DISCOUNTS,
    bonusDays: { eliteSessions: { 24: 3, 72: 7 }, months: { 6: 5, 12: 10 } },
    healthDays: [
      { date: 11, name: 'World Population Day' },
      { date: 21, name: 'National Junk Food Day' },
      { date: 22, name: 'World Brain Day' },
      { date: 24, name: 'International Self-Care Day' },
      { date: 28, name: 'World Hepatitis Day' },
    ],
  },
  {
    theme: 'independence',
    windows: [{ month: 8, from: 9, to: 20 }], // sale is Aug 10–20; live from Aug 9
    title: 'AZAADI FITNESS SALE',
    subtitle: 'Independence Day Special · Aug 10 - 20',
    endDate: 'August 20, 2026',
    description:
      'Celebrate your freedom to get fit. Spin the tricolour wheel and unlock a one-time coupon — win up to 50% OFF any Gym, Home, Rehab or 1:1 plan.',
    offers: [],
    couponOnly: true,
  },
  {
    theme: 'festive',
    windows: [
      { month: 10, from: 20, to: 31 },
      { month: 11, from: 1, to: 10 },
    ],
    title: 'VICTORY TO LIGHT SALE',
    subtitle: 'Valid Oct 20 - Nov 10 Only',
    endDate: 'November 10, 2026',
    description: 'This Dussehra, defeat the excuses. This Diwali, light up your health.',
    offers: [
      { label: '1M & 3M Gym', off: '10% OFF' },
      { label: '6M Gym Plan', off: '20% OFF' },
      { label: '12M Gym & Couple', off: '25% OFF' },
      { label: '3M Home & Rehab', off: '10% OFF' },
      { label: 'Couple Home & Rehab', off: '20% OFF' },
      { label: '12 Sessions', off: '5% OFF' },
      { label: '24 Sessions', off: '10% OFF' },
      { label: '36 Sessions', off: '15% OFF' },
      { label: '72 Sessions', off: '20% OFF' },
    ],
    discounts: {
      eliteSessions: { 12: 5, 24: 10, 36: 15, 72: 20 },
      months: { 1: 10, 3: 10, 6: 20, 12: 25 },
      coupleMonths: { 3: 20 },
    },
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// Helpers (no data below this line)
// ─────────────────────────────────────────────────────────────────────────────

/** Canonical price for a DB plan name, or undefined for plans not listed above (legacy). */
export function getPlanPrice(name: string): number | undefined {
  return (PLAN_PRICES as Record<string, { price: number }>)[name]?.price;
}

/** Price for a known plan name (compile-time checked). */
export function planPrice(name: PlanName): number {
  return PLAN_PRICES[name].price;
}

/** ₹1,499 style label. */
export function formatINR(amount: number): string {
  return `₹${Math.round(amount).toLocaleString('en-IN')}`;
}

/** ₹ label for a known plan name. */
export function planPriceLabel(name: PlanName): string {
  return formatINR(planPrice(name));
}

/** Price after a % discount, rounded to the rupee (the same rounding checkout uses). */
export function applyPercent(price: number, percent: number): number {
  return percent ? Math.round(price * (1 - percent / 100)) : price;
}

/** Cheapest plan of all — the "from ₹X" figure. */
export const LOWEST_PLAN_PRICE = Math.min(...Object.values(PLAN_PRICES).map((p) => p.price));

/** Cheapest Elite live 1:1 plan — the "1:1 from ₹X" figure. */
export const LOWEST_ELITE_PRICE = Math.min(
  ...Object.entries(PLAN_PRICES)
    .filter(([n]) => n.startsWith('Elite'))
    .map(([, p]) => p.price)
);

function inWindow(sale: SaleDefinition, month0: number, day: number): boolean {
  return sale.windows.some((w) => w.month - 1 === month0 && day >= w.from && day <= w.to);
}

/** The sale running on `now`'s LOCAL calendar date (browser = visitor's date), or null. */
export function getActiveSale(now: Date = new Date()): SaleDefinition | null {
  if (!SALES_ENABLED) return null;
  return SALES.find((s) => inWindow(s, now.getMonth(), now.getDate())) ?? null;
}

/** Sale for a fixed UTC offset (server side), or null. */
function saleAtOffset(now: Date, offsetHours: number): SaleDefinition | null {
  if (!SALES_ENABLED) return null;
  const local = new Date(now.getTime() + offsetHours * 60 * 60 * 1000);
  return SALES.find((s) => inWindow(s, local.getUTCMonth(), local.getUTCDate())) ?? null;
}

function lookup(table: PlanTable | undefined, planName: string, durationDays?: number): number {
  if (!table) return 0;
  const name = planName.toLowerCase();
  if (name.includes('elite') || name.includes('1:1')) {
    const m = name.match(/(\d+)\s*sessions?/);
    const sessions = m ? Number(m[1]) : 0;
    return (table.eliteSessions as Record<number, number> | undefined)?.[sessions] ?? 0;
  }
  const days =
    durationDays ?? (PLAN_PRICES as Record<string, { durationDays: number }>)[planName]?.durationDays ?? 0;
  if (!days) return 0;
  const months = days <= 45 ? 1 : days <= 120 ? 3 : days <= 240 ? 6 : 12;
  const couple = name.includes('couple');
  const override = couple ? (table.coupleMonths as Record<number, number> | undefined)?.[months] : undefined;
  return override ?? (table.months as Record<number, number> | undefined)?.[months] ?? 0;
}

/** Automatic % off a plan gets in a given sale. */
export function salePercentFor(sale: SaleDefinition | null, planName: string, durationDays?: number): number {
  if (!sale || sale.couponOnly) return 0;
  return lookup(sale.discounts, planName, durationDays);
}

/** Biggest automatic % in a sale — the "up to X% off" figure. */
export function maxSalePercent(sale: SaleDefinition | null): number {
  if (!sale || sale.couponOnly || !sale.discounts) return 0;
  const { eliteSessions = {}, months = {}, coupleMonths = {} } = sale.discounts;
  return Math.max(0, ...Object.values(eliteSessions), ...Object.values(months), ...Object.values(coupleMonths));
}

/** Free bonus days a plan gets in a given sale. */
export function saleBonusDaysFor(sale: SaleDefinition | null, planName: string, durationDays?: number): number {
  if (!sale) return 0;
  return lookup(sale.bonusDays, planName, durationDays);
}

/** % off a plan right now, by the visitor's local date (client-side display). */
export function getSalePercent(planName: string, durationDays?: number, now: Date = new Date()): number {
  return salePercentFor(getActiveSale(now), planName, durationDays);
}

/** Current sale price of a plan by the visitor's local date. */
export function getSalePrice(planName: string, now: Date = new Date()): number | undefined {
  const price = getPlanPrice(planName);
  return price == null ? undefined : applyPercent(price, getSalePercent(planName, undefined, now));
}

/**
 * Server: the largest % a browser anywhere (UTC-12 … UTC+14) could legitimately be showing
 * for this plan right now. create-order uses it as the price floor.
 */
export function maxSalePercentAnywhere(planName: string, durationDays?: number, now: Date = new Date()): number {
  return Math.max(...[-12, 0, 14].map((h) => salePercentFor(saleAtOffset(now, h), planName, durationDays)));
}

/** Server: bonus days granted at payment, by the India (IST) date. */
export function getSaleBonusDaysIST(planName: string, durationDays?: number, now: Date = new Date()): number {
  return saleBonusDaysFor(saleAtOffset(now, 5.5), planName, durationDays);
}
