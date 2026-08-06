/** Shared copy for the calorie calculator — used by both page.tsx (rendered FAQ)
 *  and layout.tsx (FAQPage JSON-LD) so the two never drift. */

export interface CalcFaq {
  question: string;
  answer: string;
}

export const CALCULATOR_FAQS: CalcFaq[] = [
  {
    question: 'How accurate is this calorie calculator?',
    answer:
      'The values are reliable everyday estimates based on standard food composition data (INDB, IFCT 2017 and USDA FoodData Central). Real dishes vary with the amount of oil, ghee, sugar and portion size used at home, so treat the numbers as close approximations rather than lab-exact figures.',
  },
  {
    question: 'Are the calories for cooked or raw food?',
    answer:
      'Most items are for the cooked, ready-to-eat form as you would actually eat them — for example dal, rice, sabzi and chicken curry are cooked values. Raw staples like flour (atta, besan), sugar and uncooked rice are clearly labelled as raw.',
  },
  {
    question: 'What is 1 katori and how are servings measured?',
    answer:
      'A katori is a standard Indian small bowl. We map common household units to approximate weights so you can estimate without a scale: 1 katori of dal or sabzi ≈ 150 g, 1 roti ≈ 40 g, 1 cup of cooked rice ≈ 150 g, and 1 glass of milk ≈ 200 g. You can always switch the unit to grams for an exact weight.',
  },
  {
    question: 'Can I calculate the calories of a full meal?',
    answer:
      'Yes. Add several foods — for example 2 rotis, 1 katori dal and 1 cup rice — and the calculator shows each item’s calories plus the combined total for the whole meal, along with protein, carbs, fat and fibre.',
  },
  {
    question: 'Does this show macros and micronutrients?',
    answer:
      'Yes. For every food and for your full meal you get the macros — calories, protein, carbs, fat, fibre and sugar — plus key micronutrients: sodium, calcium, iron, potassium and vitamin C. Values are per your chosen serving and are based on USDA FoodData Central and IFCT 2017 composition data.',
  },
  {
    question: 'Where does the nutrition data come from?',
    answer:
      'From the Indian Nutrient Databank (INDB) for cooked Indian dishes, the Indian Food Composition Tables 2017 (National Institute of Nutrition, ICMR) for ingredients, and USDA FoodData Central for a few generic items.',
  },
  {
    question: 'How many calories should I eat in a day?',
    answer:
      'It depends on your age, weight, activity level and goal (fat loss, maintenance or muscle gain). A calorie calculator tells you what you are eating; a personalised plan tells you what you should eat. Take the free assessment or explore Coach Himanshu’s coaching plans for a target built around your body and goal.',
  },
];

/** Foods shown in the static SSR "calories in common Indian foods" table (by slug). */
export const COMMON_FOOD_SLUGS: string[] = [
  'toor-dal-cooked',
  'dal-tadka',
  'rajma-cooked',
  'chole-cooked',
  'rice-white-cooked',
  'jeera-rice',
  'roti-chapati',
  'aloo-paratha',
  'naan',
  'idli',
  'plain-dosa',
  'poha',
  'upma',
  'paneer-butter-masala',
  'palak-paneer',
  'mixed-veg',
  'egg-boiled',
  'chicken-curry',
  'butter-chicken',
  'chicken-breast-cooked',
  'fish-curry',
  'paneer-raw',
  'milk-full',
  'curd-dahi',
  'banana',
  'apple',
  'kiwi',
  'carrot-raw',
  'green-salad',
  'veg-kathi-roll',
  'almonds',
  'peanuts',
  'samosa',
  'gulab-jamun',
  'chai',
  'potato-boiled',
];
