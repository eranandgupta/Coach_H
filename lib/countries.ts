export interface CountryData {
  slug: string;          // lowercase-hyphenated, matches URL — e.g. 'usa'
  name: string;          // prepositional display form, reads after "in " — e.g. 'the USA', 'Canada'
  country: string;       // plain country name for schema — e.g. 'United States'
  region: string;        // 'North America', 'Middle East', etc.
  currencyCode: string;  // 'USD'
  approxStart: string;   // approx local value of the ₹799 starting plan — e.g. '$10'
  timezoneNote: string;  // how sessions are scheduled relative to IST
  diaspora: string;      // Indian-origin population, phrased directionally
  hubs: string[];        // major cities/areas with large Indian communities
  angle: string;         // one lifestyle hook specific to Indians living there
}

export const COUNTRIES: CountryData[] = [
  {
    slug: 'usa',
    name: 'the USA',
    country: 'United States',
    region: 'North America',
    currencyCode: 'USD',
    approxStart: '$10',
    timezoneNote: 'US time zones (about 9.5–13.5 hours behind IST), so sessions are scheduled for your early morning or evening',
    diaspora: 'over 4.8 million people of Indian origin',
    hubs: ['New Jersey', 'California', 'Texas', 'New York'],
    angle: 'Long desk hours, oversized restaurant portions and a car-first lifestyle make weight gain common for Indians settling in America.',
  },
  {
    slug: 'canada',
    name: 'Canada',
    country: 'Canada',
    region: 'North America',
    currencyCode: 'CAD',
    approxStart: 'C$13',
    timezoneNote: 'Canadian time zones (about 9.5–13.5 hours behind IST), with sessions set for your convenient hours',
    diaspora: 'more than 1.4 million people of Indian origin',
    hubs: ['Toronto', 'Brampton', 'Vancouver', 'Calgary'],
    angle: 'Long, harsh winters keep people indoors for months, making a structured home-workout routine essential for many Indian-Canadians.',
  },
  {
    slug: 'uk',
    name: 'the UK',
    country: 'United Kingdom',
    region: 'Europe',
    currencyCode: 'GBP',
    approxStart: '£8',
    timezoneNote: 'UK time (about 4.5–5.5 hours behind IST), so live sessions fit neatly into your day',
    diaspora: 'around 1.9 million people of Indian origin',
    hubs: ['London', 'Leicester', 'Birmingham', 'Manchester'],
    angle: 'A busy work culture and a pub-and-takeaway food scene make consistency the biggest challenge for Indians in Britain.',
  },
  {
    slug: 'ireland',
    name: 'Ireland',
    country: 'Ireland',
    region: 'Europe',
    currencyCode: 'EUR',
    approxStart: '€9',
    timezoneNote: 'Irish time (about 4.5–5.5 hours behind IST), with sessions scheduled around your work hours',
    diaspora: 'a fast-growing Indian community',
    hubs: ['Dublin', 'Cork', 'Galway', 'Limerick'],
    angle: 'Long office hours and limited access to familiar Indian ingredients make personalised online coaching genuinely valuable.',
  },
  {
    slug: 'uae',
    name: 'the UAE',
    country: 'United Arab Emirates',
    region: 'Middle East',
    currencyCode: 'AED',
    approxStart: '35 AED',
    timezoneNote: 'Gulf Standard Time (just 1.5 hours behind IST), so scheduling live sessions is effortless',
    diaspora: 'roughly 3.5 million Indians — the largest expatriate community in the country',
    hubs: ['Dubai', 'Abu Dhabi', 'Sharjah', 'Ajman'],
    angle: 'Extreme summer heat pushes workouts indoors, and a rich dining-out culture makes portion control the key focus for Indian expats in the Gulf.',
  },
  {
    slug: 'saudi-arabia',
    name: 'Saudi Arabia',
    country: 'Saudi Arabia',
    region: 'Middle East',
    currencyCode: 'SAR',
    approxStart: '36 SAR',
    timezoneNote: 'Arabia Standard Time (about 2.5 hours behind IST), making live coaching easy to schedule',
    diaspora: 'over 2.5 million Indian workers and professionals',
    hubs: ['Riyadh', 'Jeddah', 'Dammam', 'Al Khobar'],
    angle: 'Hot weather and demanding work schedules make flexible, home-friendly online coaching ideal for Indian professionals in the Kingdom.',
  },
  {
    slug: 'qatar',
    name: 'Qatar',
    country: 'Qatar',
    region: 'Middle East',
    currencyCode: 'QAR',
    approxStart: '35 QAR',
    timezoneNote: 'Arabia Standard Time (about 2.5 hours behind IST), so sessions slot easily into your routine',
    diaspora: 'around 800,000 Indians — one of the largest communities in the country',
    hubs: ['Doha', 'Al Rayyan', 'Al Wakrah'],
    angle: 'Long work weeks and a dining-heavy social scene make structured nutrition the top priority for Indian expats in Doha.',
  },
  {
    slug: 'kuwait',
    name: 'Kuwait',
    country: 'Kuwait',
    region: 'Middle East',
    currencyCode: 'KWD',
    approxStart: '3 KWD',
    timezoneNote: 'Arabia Standard Time (about 2.5 hours behind IST), with sessions set for your free hours',
    diaspora: 'close to 1 million Indians — the largest expatriate group',
    hubs: ['Kuwait City', 'Hawalli', 'Salmiya'],
    angle: 'Desert heat and desk-bound jobs make an at-home, coach-guided routine the most practical path for Indians in Kuwait.',
  },
  {
    slug: 'australia',
    name: 'Australia',
    country: 'Australia',
    region: 'Oceania',
    currencyCode: 'AUD',
    approxStart: 'A$15',
    timezoneNote: 'Australian time zones (about 4.5–5.5 hours ahead of IST), so sessions fit your mornings or evenings',
    diaspora: 'nearly 1 million people of Indian origin',
    hubs: ['Sydney', 'Melbourne', 'Brisbane', 'Perth'],
    angle: 'An active outdoor culture is a great fit, but shift work and frequent eating out still make expert guidance valuable for Indian-Australians.',
  },
  {
    slug: 'new-zealand',
    name: 'New Zealand',
    country: 'New Zealand',
    region: 'Oceania',
    currencyCode: 'NZD',
    approxStart: 'NZ$16',
    timezoneNote: 'New Zealand time (about 6.5–7.5 hours ahead of IST), with sessions scheduled to suit you',
    diaspora: 'a large and growing Indian community of around 240,000',
    hubs: ['Auckland', 'Wellington', 'Hamilton', 'Christchurch'],
    angle: 'A relaxed outdoor lifestyle pairs perfectly with structured online coaching for Indians settling in New Zealand.',
  },
  {
    slug: 'singapore',
    name: 'Singapore',
    country: 'Singapore',
    region: 'Asia',
    currencyCode: 'SGD',
    approxStart: 'S$13',
    timezoneNote: 'Singapore Standard Time (about 2.5 hours ahead of IST), so live sessions are simple to arrange',
    diaspora: 'a large Indian community of over 650,000',
    hubs: ['Singapore'],
    angle: 'Hawker-centre food culture and demanding corporate hours make macro-aware meal planning essential for Indians in Singapore.',
  },
];

export function getCountryBySlug(slug: string): CountryData | undefined {
  return COUNTRIES.find(country => country.slug === slug);
}

export function getAllCountrySlugs(): string[] {
  return COUNTRIES.map(country => country.slug);
}
