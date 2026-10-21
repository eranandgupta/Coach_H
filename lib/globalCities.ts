// Data for /online-fitness-coach/[country]/[city] — the international city pages
// ("Indian fitness coach in Dubai", "online personal trainer Toronto"). Each city
// hangs off a country in lib/countries.ts (currency, dial code, FX), so prices
// stay in one place. Time-zone copy is COMPUTED from the IANA zone with Intl, so
// daylight saving is handled correctly and nothing about time is hand-written.
//
// Hand-written fields (areas, angle) must stay factual and modest: well-known
// Indian neighbourhoods and a lifestyle/climate hook, no statistics.

import { COUNTRIES, getCountryBySlug, localPrice, type CountryData } from '@/lib/countries';
import { getElitePlans } from '@/lib/personalTraining';
import { PLAN_GROUPS } from '@/lib/plans';

export interface GlobalCity {
  slug: string;     // URL segment under the country, e.g. 'dubai'
  name: string;     // display name, e.g. 'Dubai'
  country: string;  // CountryData.slug
  timeZone: string; // IANA zone, e.g. 'Asia/Dubai'
  areas: string[];  // neighbourhoods with large Indian communities (may be empty)
  angle: string;    // one lifestyle hook specific to Indians in this city
}

export const GLOBAL_CITIES: GlobalCity[] = [
  // ── Middle East ────────────────────────────────────────────────────────────
  {
    slug: 'dubai', name: 'Dubai', country: 'uae', timeZone: 'Asia/Dubai',
    areas: ['Karama', 'Bur Dubai', 'Al Nahda', 'Discovery Gardens'],
    angle: 'Summer heat pushes almost every workout indoors for months, and weekend brunches and late dinners make portion control the real battle for Indians in Dubai.',
  },
  {
    slug: 'abu-dhabi', name: 'Abu Dhabi', country: 'uae', timeZone: 'Asia/Dubai',
    areas: ['Hamdan Street', 'Electra Street', 'Mussafah', 'Khalifa City'],
    angle: 'Long summers indoors and commutes between the island and the mainland leave little time for a gym, so a focused home or building-gym session is the realistic plan.',
  },
  {
    slug: 'sharjah', name: 'Sharjah', country: 'uae', timeZone: 'Asia/Dubai',
    areas: ['Al Nahda', 'Rolla', 'Al Majaz', 'Al Taawun'],
    angle: 'Many Indian families in Sharjah commute to Dubai every day, and the traffic eats the evening, so short early-morning or late home workouts fit best.',
  },
  {
    slug: 'riyadh', name: 'Riyadh', country: 'saudi-arabia', timeZone: 'Asia/Riyadh',
    areas: ['Batha', 'Olaya', 'Malaz', 'Al Sulimaniyah'],
    angle: 'Desert summers and long working days make indoor training and a plan that works in a compound gym or at home essential.',
  },
  {
    slug: 'jeddah', name: 'Jeddah', country: 'saudi-arabia', timeZone: 'Asia/Riyadh',
    areas: ['Sharafiya', 'Aziziyah', 'Al Rawdah', 'Al Balad'],
    angle: 'Humid coastal heat for much of the year keeps training indoors, and a rich restaurant scene makes a flexible Indian meal plan the main lever.',
  },
  {
    slug: 'doha', name: 'Doha', country: 'qatar', timeZone: 'Asia/Qatar',
    areas: ['Al Mansoura', 'Najma', 'Bin Mahmoud', 'Al Sadd'],
    angle: 'Long work weeks, hot summers and a dining-heavy social life make structured nutrition the top priority for Indians in Doha.',
  },
  {
    slug: 'kuwait-city', name: 'Kuwait City', country: 'kuwait', timeZone: 'Asia/Kuwait',
    areas: ['Abbasiya', 'Farwaniya', 'Salmiya', 'Mangaf'],
    angle: 'Extreme summer heat and desk-bound jobs make an at-home, coach-guided routine the most practical path for Indians in Kuwait City.',
  },
  {
    slug: 'muscat', name: 'Muscat', country: 'oman', timeZone: 'Asia/Muscat',
    areas: ['Ruwi', 'Darsait', 'Al Khuwair', 'Wadi Kabir'],
    angle: 'Long summers indoors and a car-first routine make a home workout plan plus portion-smart Indian meals the practical fix for Indians in Muscat.',
  },
  {
    slug: 'manama', name: 'Manama', country: 'bahrain', timeZone: 'Asia/Bahrain',
    areas: ['Gudaibiya', 'Manama Souq', 'Adliya', 'Juffair'],
    angle: 'Hot, humid summers and a busy dining-out scene mean the Indian community in Manama does best with indoor training and a plan built around what is actually on the table.',
  },
  // ── Europe ─────────────────────────────────────────────────────────────────
  {
    slug: 'london', name: 'London', country: 'uk', timeZone: 'Europe/London',
    areas: ['Southall', 'Wembley', 'Harrow', 'East Ham'],
    angle: 'Long Tube commutes, dark winter evenings and an easy takeaway habit make consistency the biggest challenge for Indians in London.',
  },
  {
    slug: 'birmingham', name: 'Birmingham', country: 'uk', timeZone: 'Europe/London',
    areas: ['Handsworth', 'Soho Road', 'Smethwick'],
    angle: 'Grey winters and a sweet-shop-and-takeaway food scene make a structured Indian meal plan and a home routine the difference for Indians in Birmingham.',
  },
  {
    slug: 'leicester', name: 'Leicester', country: 'uk', timeZone: 'Europe/London',
    areas: ['Belgrave Road', 'Rushey Mead', 'Evington', 'Oadby'],
    angle: 'With the Golden Mile on the doorstep, mithai and namkeen are never far away, so a plan that keeps the food you love but fixes the portions matters most in Leicester.',
  },
  {
    slug: 'dublin', name: 'Dublin', country: 'ireland', timeZone: 'Europe/Dublin',
    areas: [],
    angle: 'Long tech-sector hours, short winter days and fewer Indian grocery options outside the city centre make a coach who plans around Irish supermarkets genuinely useful.',
  },
  {
    slug: 'berlin', name: 'Berlin', country: 'germany', timeZone: 'Europe/Berlin',
    areas: [],
    angle: 'Bread-heavy lunches, long dark winters and a fast-growing Indian tech and student community make a structured strength plan and Indian meals from German supermarkets the realistic route.',
  },
  {
    slug: 'amsterdam', name: 'Amsterdam', country: 'netherlands', timeZone: 'Europe/Amsterdam',
    areas: ['Amstelveen'],
    angle: 'Cycling everywhere is a head start, but sandwich lunches and expat work hours still make structured strength training and Indian meal planning the difference.',
  },
  // ── North America ──────────────────────────────────────────────────────────
  {
    slug: 'new-york', name: 'New York', country: 'usa', timeZone: 'America/New_York',
    areas: ['Jackson Heights', 'Richmond Hill', 'Floral Park', 'Hicksville'],
    angle: 'Long hours, small apartments and a takeout-on-every-corner city make a compact home routine and a portion-smart Indian meal plan the way to stay consistent in New York.',
  },
  {
    slug: 'new-jersey', name: 'New Jersey', country: 'usa', timeZone: 'America/New_York',
    areas: ['Edison', 'Iselin', 'Jersey City', 'Parsippany'],
    angle: 'Car commutes, desk jobs and Oak Tree Road sweets and chaat on the weekend make portion control and a regular strength routine the biggest levers for Indians in New Jersey.',
  },
  {
    slug: 'bay-area', name: 'the San Francisco Bay Area', country: 'usa', timeZone: 'America/Los_Angeles',
    areas: ['Fremont', 'Sunnyvale', 'San Jose', 'Santa Clara'],
    angle: 'Tech-sector hours, calls with India late at night and free office snacks make sleep, protein and a short, consistent strength routine the priorities for Indians in the Bay Area.',
  },
  {
    slug: 'seattle', name: 'Seattle', country: 'usa', timeZone: 'America/Los_Angeles',
    areas: ['Redmond', 'Bellevue', 'Bothell', 'Sammamish'],
    angle: 'Long grey, wet winters and big-tech hours keep people indoors and at their desks, so a coach-guided home or office-gym routine is the realistic plan around Seattle.',
  },
  {
    slug: 'dallas', name: 'Dallas', country: 'usa', timeZone: 'America/Chicago',
    areas: ['Irving', 'Plano', 'Frisco', 'Richardson'],
    angle: 'A car-first suburb life, hot summers and large restaurant portions make step count and portion control the first fixes for Indians in Dallas–Fort Worth.',
  },
  {
    slug: 'houston', name: 'Houston', country: 'usa', timeZone: 'America/Chicago',
    areas: ['Mahatma Gandhi District', 'Sugar Land', 'Katy', 'Pearland'],
    angle: 'Humid heat for much of the year and long drives everywhere make indoor training and a planned Indian diet the practical route in Houston.',
  },
  {
    slug: 'chicago', name: 'Chicago', country: 'usa', timeZone: 'America/Chicago',
    areas: ['Devon Avenue', 'Schaumburg', 'Naperville', 'Aurora'],
    angle: 'Long, harsh winters keep people indoors for months, which makes a structured home-workout routine essential for many Indians in Chicagoland.',
  },
  {
    slug: 'toronto', name: 'Toronto', country: 'canada', timeZone: 'America/Toronto',
    areas: ['Gerrard India Bazaar', 'Scarborough', 'Mississauga', 'Etobicoke'],
    angle: 'Long winters indoors and long commutes across the GTA make a home routine and an Indian meal plan built for busy weeks the realistic route in Toronto.',
  },
  {
    slug: 'brampton', name: 'Brampton', country: 'canada', timeZone: 'America/Toronto',
    areas: ['Springdale', 'Castlemore', 'Bramalea'],
    angle: 'Shift work, long winters and Punjabi home food that is rich in ghee and butter make portions and a regular strength routine the biggest levers in Brampton.',
  },
  {
    slug: 'vancouver', name: 'Vancouver', country: 'canada', timeZone: 'America/Vancouver',
    areas: ['Surrey', 'Punjabi Market', 'Burnaby', 'Delta'],
    angle: 'Rainy winters keep training indoors, and rich Punjabi home cooking means a plan that keeps your food but fixes portions works best around Vancouver and Surrey.',
  },
  {
    slug: 'calgary', name: 'Calgary', country: 'canada', timeZone: 'America/Edmonton',
    areas: ['Taradale', 'Saddle Ridge', 'Martindale', 'Cityscape'],
    angle: 'Cold, long winters and shift-heavy jobs make a flexible home routine with coach check-ins the practical choice for Indians in Calgary.',
  },
  // ── Asia-Pacific ───────────────────────────────────────────────────────────
  {
    slug: 'sydney', name: 'Sydney', country: 'australia', timeZone: 'Australia/Sydney',
    areas: ['Harris Park', 'Parramatta', 'Blacktown', 'Westmead'],
    angle: 'An outdoor lifestyle helps, but long commutes, shift work and eating out still make expert guidance valuable for Indians in Sydney.',
  },
  {
    slug: 'melbourne', name: 'Melbourne', country: 'australia', timeZone: 'Australia/Melbourne',
    areas: ['Dandenong', 'Tarneit', 'Point Cook', 'Craigieburn'],
    angle: 'Changeable weather, cold winters and long drives from the outer suburbs make a home routine with a coach on WhatsApp the consistent option in Melbourne.',
  },
  {
    slug: 'auckland', name: 'Auckland', country: 'new-zealand', timeZone: 'Pacific/Auckland',
    areas: ['Sandringham', 'Papatoetoe', 'Mount Roskill', 'Takanini'],
    angle: 'A relaxed outdoor lifestyle pairs well with structured coaching, and a plan built from local supermarket staples keeps Indian meals simple in Auckland.',
  },
  {
    slug: 'kuala-lumpur', name: 'Kuala Lumpur', country: 'malaysia', timeZone: 'Asia/Kuala_Lumpur',
    areas: ['Brickfields', 'Sentul', 'Klang'],
    angle: 'Round-the-clock mamak stalls, roti canai breakfasts and year-round humidity make calorie-aware Indian meal planning the biggest lever in Kuala Lumpur.',
  },
  {
    slug: 'tokyo', name: 'Tokyo', country: 'japan', timeZone: 'Asia/Tokyo',
    areas: ['Nishi-Kasai', 'Kasai', 'Yokohama'],
    angle: 'Long office hours, convenience-store meals and the hunt for vegetarian protein make a coach who plans Indian meals from Japanese supermarket staples a real advantage.',
  },
  // ── Africa ─────────────────────────────────────────────────────────────────
  {
    slug: 'durban', name: 'Durban', country: 'south-africa', timeZone: 'Africa/Johannesburg',
    areas: ['Chatsworth', 'Phoenix', 'Overport', 'Verulam'],
    angle: 'Rich Durban curries, bunny chow and weekend braais make heart-smart Indian nutrition and regular strength training especially valuable in Durban.',
  },
  {
    slug: 'johannesburg', name: 'Johannesburg', country: 'south-africa', timeZone: 'Africa/Johannesburg',
    areas: ['Lenasia', 'Fordsburg', 'Mayfair'],
    angle: 'Long commutes and busy corporate hours make a short, home-friendly routine and a planned Indian diet the realistic route in Johannesburg.',
  },
];

// Fail the build on a bad edit: unknown country, duplicate slug, or a time zone
// the runtime doesn't recognise.
for (const city of GLOBAL_CITIES) {
  if (!getCountryBySlug(city.country)) throw new Error(`globalCities: unknown country "${city.country}" for ${city.slug}`);
  new Intl.DateTimeFormat('en', { timeZone: city.timeZone });
}
if (new Set(GLOBAL_CITIES.map((c) => `${c.country}/${c.slug}`)).size !== GLOBAL_CITIES.length) {
  throw new Error('globalCities: duplicate city slug');
}

export function getGlobalCity(countrySlug: string, citySlug: string): GlobalCity | undefined {
  return GLOBAL_CITIES.find((c) => c.country === countrySlug && c.slug === citySlug);
}

export function citiesInCountry(countrySlug: string): GlobalCity[] {
  return GLOBAL_CITIES.filter((c) => c.country === countrySlug);
}

export function globalCityUrl(city: GlobalCity): string {
  return `https://coachhimanshu.com/online-fitness-coach/${city.country}/${city.slug}`;
}

/** Name without a leading "the", for titles and schema ("San Francisco Bay Area"). */
export function plainName(city: GlobalCity): string {
  return city.name.replace(/^the /, '');
}

// ── Time zones ───────────────────────────────────────────────────────────────

const IST_OFFSET = 330; // minutes ahead of UTC

/** UTC offset of a zone, in minutes, at a given instant. */
function offsetMinutes(timeZone: string, at: Date): number {
  const name = new Intl.DateTimeFormat('en', { timeZone, timeZoneName: 'longOffset' })
    .formatToParts(at)
    .find((p) => p.type === 'timeZoneName')?.value ?? 'GMT';
  const m = name.match(/GMT([+-])(\d{2}):(\d{2})/);
  if (!m) return 0; // plain "GMT"
  const mins = Number(m[2]) * 60 + Number(m[3]);
  return m[1] === '-' ? -mins : mins;
}

/** Hours from local time to IST: positive = India is ahead. 4.5 → "4 h 30 min". */
function fmtGap(minutes: number): string {
  const abs = Math.abs(minutes);
  const h = Math.floor(abs / 60);
  const m = abs % 60;
  return m ? `${h} h ${m} min` : `${h} h`;
}

export interface TimeGap {
  /** Minutes India is ahead of the city (negative = city is ahead), outside daylight saving. */
  standard: number;
  /** Same during daylight saving, or null if the city doesn't observe it. */
  summer: number | null;
  /** One quotable sentence, e.g. "India (IST) is 1 h 30 min ahead of Dubai all year round." */
  sentence: string;
}

export function timeGap(city: GlobalCity, year = new Date().getUTCFullYear()): TimeGap {
  // January and July bracket daylight saving in both hemispheres; the smaller
  // UTC offset of the two is standard time.
  const jan = offsetMinutes(city.timeZone, new Date(Date.UTC(year, 0, 15)));
  const jul = offsetMinutes(city.timeZone, new Date(Date.UTC(year, 6, 15)));
  const std = Math.min(jan, jul);
  const dst = jan === jul ? null : Math.max(jan, jul);
  const standard = IST_OFFSET - std;
  const summer = dst === null ? null : IST_OFFSET - dst;
  const place = plainName(city);

  const dir = (gap: number) => (gap >= 0 ? 'ahead of' : 'behind');

  // Standard time is local winter in both hemispheres.
  const sentence =
    summer === null
      ? `India (IST) is ${fmtGap(standard)} ${dir(standard)} ${place} all year round.`
      : `India (IST) is ${fmtGap(standard)} ${dir(standard)} ${place} in winter and ${fmtGap(summer)} ${dir(summer)} during daylight saving time.`;
  return { standard, summer, sentence };
}

function clock(minutesOfDay: number): string {
  const day = Math.floor(minutesOfDay / 1440);
  const t = ((minutesOfDay % 1440) + 1440) % 1440;
  const h24 = Math.floor(t / 60);
  const m = t % 60;
  const h12 = h24 % 12 === 0 ? 12 : h24 % 12;
  const s = `${h12}:${String(m).padStart(2, '0')} ${h24 < 12 ? 'am' : 'pm'}`;
  return day > 0 ? `${s} (next day)` : day < 0 ? `${s} (previous day)` : s;
}

// Local slots people actually train at: before work, lunch, after work.
const SLOTS = [6 * 60, 7 * 60, 12 * 60 + 30, 18 * 60, 19 * 60, 20 * 60 + 30];

export interface SlotRow {
  local: string;
  ist: string;          // standard time
  istSummer?: string;   // during daylight saving
}

/** "Your time → India time" rows for the common training slots. */
export function slotTable(city: GlobalCity): SlotRow[] {
  const gap = timeGap(city);
  return SLOTS.map((s) => ({
    local: clock(s),
    ist: clock(s + gap.standard),
    ...(gap.summer !== null ? { istSummer: clock(s + gap.summer) } : {}),
  }));
}

// ── Prices ───────────────────────────────────────────────────────────────────

export interface LocalPlanRow {
  name: string;
  durationLabel: string;
  inr: string;
  local: string;
  perSession?: string; // live 1:1 only, local currency
}

/** The plans shown on a city page, each with an approximate local price. */
export function localPlanRows(country: CountryData): LocalPlanRow[] {
  const recorded = PLAN_GROUPS.find((g) => g.key === 'recorded')?.plans ?? [];
  const pick = ['Kickstart Plan', 'Consistency Plan'].map((n) => {
    const p = recorded.find((x) => x.name === n);
    if (!p) throw new Error(`globalCities: plan "${n}" not found in lib/plans.ts`);
    return p;
  });
  const rows: LocalPlanRow[] = pick.map((p) => ({
    name: p.name,
    durationLabel: p.durationLabel,
    inr: p.priceLabel,
    local: localPrice(p.price, country),
  }));
  for (const p of getElitePlans()) {
    const sessions = Number(p.specs.liveSessions?.match(/\d+/)?.[0] ?? 0);
    rows.push({
      name: p.name,
      durationLabel: p.durationLabel,
      inr: p.priceLabel,
      local: localPrice(p.price, country),
      perSession: sessions ? localPrice(p.price / sessions, country) : undefined,
    });
  }
  return rows;
}

/** Cheapest live 1:1 price per session, in local currency (from the largest package). */
export function lowestPerSession(country: CountryData): string {
  const per = getElitePlans()
    .map((p) => p.price / Number(p.specs.liveSessions?.match(/\d+/)?.[0] ?? Infinity))
    .filter((x) => Number.isFinite(x));
  return localPrice(Math.min(...per), country);
}

export function citiesByCountry(): { country: CountryData; cities: GlobalCity[] }[] {
  return COUNTRIES.map((country) => ({ country, cities: citiesInCountry(country.slug) })).filter((g) => g.cities.length);
}
