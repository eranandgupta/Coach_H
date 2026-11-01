// Links the Indian city pages (/fitness-coach/[city]) and the international city pages
// (/online-fitness-coach/[country]/[city]) into one network, by home region: a client
// who moves from Kochi to Dubai keeps the same coach and the same home-food plan.
//
// Community claims are deliberately modest: only long-established, widely documented
// Indian communities are listed, and copy says "well-established communities", never
// numbers. A city with no confident entry gets none (pages fall back to generic links).
// Every slug is checked at import, so a typo or a renamed city fails the build.

import { CITIES, type CityData } from '@/lib/cities';
import { GLOBAL_CITIES, type GlobalCity } from '@/lib/globalCities';
import { getCountryBySlug } from '@/lib/countries';

export type HomeRegion =
  | 'kerala' | 'tamil' | 'telugu' | 'kannada' | 'gujarati' | 'punjabi' | 'marathi' | 'bengali' | 'north';

interface RegionInfo {
  community: string;   // 'Malayali'
  dishes: string[];    // home food the meal plan keeps
  indianCities: string[]; // /fitness-coach/[city] slugs
}

export const REGIONS: Record<HomeRegion, RegionInfo> = {
  kerala: { community: 'Malayali', dishes: ['appam', 'puttu', 'avial', 'fish curry'], indianCities: ['kochi', 'thiruvananthapuram'] },
  tamil: { community: 'Tamil', dishes: ['idli', 'dosa', 'sambar', 'rasam'], indianCities: ['chennai', 'coimbatore'] },
  telugu: { community: 'Telugu', dishes: ['pesarattu', 'pappu', 'gongura', 'biryani'], indianCities: ['hyderabad', 'visakhapatnam'] },
  kannada: { community: 'Kannadiga', dishes: ['ragi mudde', 'bisi bele bath', 'akki roti'], indianCities: ['bangalore'] },
  gujarati: { community: 'Gujarati', dishes: ['dhokla', 'thepla', 'dal-bhaat', 'khichdi'], indianCities: ['ahmedabad', 'surat', 'vadodara'] },
  punjabi: { community: 'Punjabi', dishes: ['rajma', 'chole', 'sarson da saag', 'lassi'], indianCities: ['ludhiana', 'chandigarh'] },
  marathi: { community: 'Marathi', dishes: ['poha', 'varan bhaat', 'misal', 'thalipeeth'], indianCities: ['mumbai', 'pune', 'nagpur', 'nashik'] },
  bengali: { community: 'Bengali', dishes: ['maach-bhaat', 'shukto', 'dal'], indianCities: ['kolkata'] },
  north: { community: 'North Indian', dishes: ['dal', 'roti', 'rajma', 'paneer'], indianCities: ['delhi', 'gurgaon', 'noida', 'lucknow', 'jaipur', 'kanpur'] },
};

// International city → communities with a long, well-documented presence there.
const ABROAD: Record<string, HomeRegion[]> = {
  'uae/dubai': ['kerala', 'gujarati'],
  'uae/abu-dhabi': ['kerala'],
  'uae/sharjah': ['kerala'],
  'saudi-arabia/riyadh': ['kerala'],
  'saudi-arabia/jeddah': ['kerala'],
  'qatar/doha': ['kerala', 'tamil'],
  'kuwait/kuwait-city': ['kerala', 'telugu'],
  'oman/muscat': ['kerala', 'gujarati'],
  'bahrain/manama': ['kerala'],
  'uk/london': ['punjabi', 'gujarati'],
  'uk/birmingham': ['punjabi'],
  'uk/leicester': ['gujarati'],
  'ireland/dublin': ['kerala'],
  'usa/new-york': ['punjabi', 'gujarati'],
  'usa/new-jersey': ['gujarati', 'telugu'],
  'usa/bay-area': ['telugu', 'tamil', 'punjabi'],
  'usa/seattle': ['telugu', 'tamil'],
  'usa/dallas': ['telugu', 'gujarati'],
  'usa/houston': ['gujarati', 'telugu'],
  'usa/chicago': ['gujarati'],
  'canada/toronto': ['punjabi', 'gujarati'],
  'canada/brampton': ['punjabi'],
  'canada/vancouver': ['punjabi'],
  'canada/calgary': ['punjabi'],
  'australia/sydney': ['punjabi'],
  'australia/melbourne': ['punjabi'],
  'new-zealand/auckland': ['gujarati', 'punjabi'],
  'malaysia/kuala-lumpur': ['tamil'],
  'south-africa/durban': ['tamil', 'gujarati'],
  'south-africa/johannesburg': ['gujarati'],
};

// Shown when a page has no community match: the biggest hubs on each side.
// Abroad entries are a city key ('uae/dubai') or a country slug with no city page ('singapore').
const DEFAULT_ABROAD = ['uae/dubai', 'uk/london', 'usa/new-york', 'canada/toronto', 'australia/sydney', 'singapore'];
const DEFAULT_HOME = ['delhi', 'mumbai', 'bangalore', 'hyderabad', 'chennai', 'kochi', 'ahmedabad', 'ludhiana'];

const key = (c: GlobalCity) => `${c.country}/${c.slug}`;
const globalByKey = new Map(GLOBAL_CITIES.map((c) => [key(c), c]));
const indianBySlug = new Map(CITIES.map((c) => [c.slug, c]));

// ── Build-time integrity checks ──────────────────────────────────────────────
for (const [r, info] of Object.entries(REGIONS)) {
  for (const s of info.indianCities) {
    if (!indianBySlug.has(s)) throw new Error(`worldConnections: unknown Indian city "${s}" in region ${r}`);
  }
}
for (const k of Object.keys(ABROAD)) {
  if (!globalByKey.has(k)) throw new Error(`worldConnections: unknown international city "${k}"`);
}
for (const k of DEFAULT_ABROAD) {
  if (!globalByKey.has(k) && !getCountryBySlug(k)) throw new Error(`worldConnections: unknown default "${k}"`);
}
for (const s of DEFAULT_HOME) {
  if (!indianBySlug.has(s)) throw new Error(`worldConnections: unknown default Indian city "${s}"`);
}

/** "Malayali and Gujarati" / "Telugu, Tamil and Punjabi". */
export function joinCommunities(regions: HomeRegion[]): string {
  const names = regions.map((r) => REGIONS[r].community);
  return names.length <= 1 ? names.join('') : `${names.slice(0, -1).join(', ')} and ${names[names.length - 1]}`;
}

/** Home region of an Indian city page, if it has one. */
export function regionOfIndianCity(slug: string): HomeRegion | undefined {
  return (Object.keys(REGIONS) as HomeRegion[]).find((r) => REGIONS[r].indianCities.includes(slug));
}

export interface AbroadLink {
  label: string;
  href: string;
}

/**
 * International pages to link from an Indian city page: cities with an established
 * community from that region first, then the big hubs, up to `max`.
 */
export function abroadLinksForIndianCity(slug: string, max = 8): { region?: HomeRegion; links: AbroadLink[] } {
  const region = regionOfIndianCity(slug);
  const matched = region
    ? Object.entries(ABROAD).filter(([, rs]) => rs.includes(region)).map(([k]) => k)
    : [];
  const keys = Array.from(new Set([...matched, ...DEFAULT_ABROAD])).slice(0, max);
  const links = keys.map((k) => {
    const city = globalByKey.get(k);
    const label = city ? city.name.replace(/^the /, '') : getCountryBySlug(k)!.country;
    return { label, href: `/online-fitness-coach/${k}` };
  });
  // Only count real community matches as "matched" for copy purposes.
  return { region: matched.length ? region : undefined, links };
}

export interface HomeConnections {
  regions: HomeRegion[];           // empty = no confident community claim
  homeCities: CityData[];          // Indian city pages to link
  dishes: string[];                // home food named in the copy
  sameCommunityAbroad: GlobalCity[]; // other international cities sharing a community
}

/** Indian home cities (and sister cities abroad) to link from an international city page. */
export function homeConnectionsForGlobalCity(city: GlobalCity): HomeConnections {
  const regions = ABROAD[key(city)] ?? [];
  const slugs = regions.length ? regions.flatMap((r) => REGIONS[r].indianCities) : DEFAULT_HOME;
  const homeCities = slugs.map((s) => indianBySlug.get(s)!).slice(0, 8);
  const dishes = regions.flatMap((r) => REGIONS[r].dishes.slice(0, 2));
  const sameCommunityAbroad = regions.length
    ? GLOBAL_CITIES.filter(
        (c) => c.country !== city.country && (ABROAD[key(c)] ?? []).some((r) => regions.includes(r))
      ).slice(0, 8)
    : [];
  return { regions, homeCities, dishes, sameCommunityAbroad };
}
