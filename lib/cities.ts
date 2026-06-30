export interface CityData {
  slug: string;
  name: string;
  state: string;
  population: string;
  description: string;
  localFoods: string[];
  landmarks: string[];
  fitnessStats: string;
}

export const CITIES: CityData[] = [
  {
    slug: 'mumbai',
    name: 'Mumbai',
    state: 'Maharashtra',
    population: '20.7 million',
    description: 'the financial capital of India',
    localFoods: ['vada pav', 'pav bhaji', 'poha', 'misal pav', 'bombil fry'],
    landmarks: ['Marine Drive', 'Bandra-Worli Sea Link', 'Gateway of India'],
    fitnessStats: '68% of Mumbai professionals report sedentary lifestyles',
  },
  {
    slug: 'delhi',
    name: 'Delhi',
    state: 'Delhi NCR',
    population: '32 million',
    description: 'the capital of India',
    localFoods: ['chole bhature', 'butter chicken', 'rajma chawal', 'paratha', 'chaat'],
    landmarks: ['India Gate', 'Connaught Place', 'Hauz Khas'],
    fitnessStats: '72% of Delhi NCR residents struggle with air quality affecting outdoor exercise',
  },
  {
    slug: 'bangalore',
    name: 'Bangalore',
    state: 'Karnataka',
    population: '12.3 million',
    description: 'the IT capital of India',
    localFoods: ['dosa', 'idli', 'bisi bele bath', 'ragi mudde', 'filter coffee'],
    landmarks: ['Cubbon Park', 'Lalbagh', 'MG Road'],
    fitnessStats: '65% of Bangalore tech workers face back pain from prolonged sitting',
  },
  {
    slug: 'hyderabad',
    name: 'Hyderabad',
    state: 'Telangana',
    population: '10.5 million',
    description: 'the city of pearls and tech hubs',
    localFoods: ['biryani', 'haleem', 'double ka meetha', 'mirchi ka salan', 'pesarattu'],
    landmarks: ['Charminar', 'HITEC City', 'Hussain Sagar'],
    fitnessStats: '60% of Hyderabad IT professionals report stress-related weight gain',
  },
  {
    slug: 'chennai',
    name: 'Chennai',
    state: 'Tamil Nadu',
    population: '11.5 million',
    description: 'the cultural capital of South India',
    localFoods: ['idli sambar', 'dosa', 'pongal', 'chettinad chicken', 'filter kaapi'],
    landmarks: ['Marina Beach', 'Mylapore', 'T. Nagar'],
    fitnessStats: '55% of Chennai residents deal with humidity-related exercise challenges',
  },
  {
    slug: 'pune',
    name: 'Pune',
    state: 'Maharashtra',
    population: '7.4 million',
    description: 'the Oxford of the East',
    localFoods: ['misal pav', 'sabudana khichdi', 'puran poli', 'vada pav', 'mastani'],
    landmarks: ['Shaniwar Wada', 'Koregaon Park', 'Hinjewadi IT Park'],
    fitnessStats: '62% of Pune IT workers report weight gain after starting work-from-home',
  },
  {
    slug: 'kolkata',
    name: 'Kolkata',
    state: 'West Bengal',
    population: '15 million',
    description: 'the cultural hub of East India',
    localFoods: ['fish curry', 'luchi alur dom', 'rosogolla', 'mishti doi', 'kathi roll'],
    landmarks: ['Victoria Memorial', 'Howrah Bridge', 'Park Street'],
    fitnessStats: '58% of Kolkata residents prefer home-based workouts due to weather',
  },
  {
    slug: 'ahmedabad',
    name: 'Ahmedabad',
    state: 'Gujarat',
    population: '8.6 million',
    description: 'the textile city with growing tech presence',
    localFoods: ['dhokla', 'thepla', 'undhiyu', 'fafda jalebi', 'khaman'],
    landmarks: ['Sabarmati Ashram', 'SG Highway', 'Kankaria Lake'],
    fitnessStats: '70% of Ahmedabad residents follow predominantly vegetarian diets',
  },
  {
    slug: 'jaipur',
    name: 'Jaipur',
    state: 'Rajasthan',
    population: '4.1 million',
    description: 'the Pink City of India',
    localFoods: ['dal baati churma', 'laal maas', 'ghevar', 'pyaaz ki kachori', 'ker sangri'],
    landmarks: ['Hawa Mahal', 'Amer Fort', 'City Palace'],
    fitnessStats: '55% of Jaipur residents face challenges with extreme heat for outdoor exercise',
  },
  {
    slug: 'lucknow',
    name: 'Lucknow',
    state: 'Uttar Pradesh',
    population: '3.9 million',
    description: 'the city of Nawabs',
    localFoods: ['kebabs', 'biryani', 'nihari', 'sheermal', 'kulfi falooda'],
    landmarks: ['Bara Imambara', 'Hazratganj', 'Gomti Nagar'],
    fitnessStats: '60% of Lucknow residents report high-calorie traditional diets as a fitness barrier',
  },
  {
    slug: 'chandigarh',
    name: 'Chandigarh',
    state: 'Punjab & Haryana',
    population: '1.2 million',
    description: 'the city beautiful and fitness hub of North India',
    localFoods: ['chole kulche', 'makki di roti sarson da saag', 'lassi', 'paratha', 'paneer tikka'],
    landmarks: ['Rock Garden', 'Sukhna Lake', 'Sector 17'],
    fitnessStats: '75% of Chandigarh residents actively participate in some form of physical activity',
  },
  {
    slug: 'gurgaon',
    name: 'Gurgaon',
    state: 'Haryana (Delhi NCR)',
    population: '1.5 million',
    description: 'the millennium city and corporate hub',
    localFoods: ['chole bhature', 'butter naan', 'rajma chawal', 'parathe wali gali specials', 'biryani'],
    landmarks: ['Cyber Hub', 'Golf Course Road', 'DLF Cyber City'],
    fitnessStats: '70% of Gurgaon corporate employees report desk-job related fitness issues',
  },
  {
    slug: 'noida',
    name: 'Noida',
    state: 'Uttar Pradesh (Delhi NCR)',
    population: '6.4 million',
    description: 'the tech corridor of Delhi NCR',
    localFoods: ['chole bhature', 'paneer tikka', 'biryani', 'south Indian', 'chaat'],
    landmarks: ['Sector 18 Market', 'Worlds of Wonder', 'Noida Expressway'],
    fitnessStats: '67% of Noida tech workers struggle with work-life-fitness balance',
  },
  {
    slug: 'indore',
    name: 'Indore',
    state: 'Madhya Pradesh',
    population: '3.2 million',
    description: 'the cleanest city and food capital of India',
    localFoods: ['poha jalebi', 'bhutte ka kees', 'dal bafla', 'garadu', 'sabudana khichdi'],
    landmarks: ['Rajwada Palace', 'Sarafa Bazaar', 'Patalpani'],
    fitnessStats: '60% of Indore residents cite street food culture as a diet challenge',
  },
  {
    slug: 'kochi',
    name: 'Kochi',
    state: 'Kerala',
    population: '2.1 million',
    description: 'the queen of the Arabian Sea',
    localFoods: ['appam stew', 'fish curry', 'puttu kadala', 'Kerala parotta', 'avial'],
    landmarks: ['Fort Kochi', 'Marine Drive', 'InfoPark'],
    fitnessStats: '58% of Kochi professionals prefer home-based or online coaching',
  },
];

export function getCityBySlug(slug: string): CityData | undefined {
  return CITIES.find(city => city.slug === slug);
}

export function getAllCitySlugs(): string[] {
  return CITIES.map(city => city.slug);
}
