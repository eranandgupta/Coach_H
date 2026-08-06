import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import AnnouncementBar from '@/components/AnnouncementBar';
import CalorieCalculator from '@/components/CalorieCalculator';
import { FOODS, getFoodBySlug } from '@/lib/foods';
import { caloriesForServing } from '@/lib/nutrition';
import { CALCULATOR_FAQS, COMMON_FOOD_SLUGS } from './content';

export default function CalorieCalculatorPage() {
  // Precompute the static "common foods" table (household serving of each) — SSR'd for SEO/AEO.
  const commonRows = COMMON_FOOD_SLUGS.map((slug) => {
    const food = getFoodBySlug(slug);
    if (!food) return null;
    const serving = food.servings[0]; // first = household unit
    const m = caloriesForServing(food, serving.label, 1);
    return {
      name: food.name,
      serving: serving.label,
      kcal: m.kcal,
      protein: m.protein,
      fiber: m.fiber,
      vitaminC: m.vitaminC,
    };
  }).filter((r): r is NonNullable<typeof r> => r !== null);

  return (
    <div className="min-h-screen bg-brand-navy">
      <AnnouncementBar />
      <Navbar />

      {/* Hero */}
      <section className="relative pt-28 pb-10 md:pt-36 md:pb-14 overflow-hidden">
        <div className="max-w-5xl mx-auto px-4">
          <nav className="mb-4 text-xs text-gray-500" aria-label="Breadcrumb">
            <Link href="/" className="hover:text-gray-300">Home</Link>
            <span className="mx-1.5">/</span>
            <span className="text-gray-400">Calorie Calculator</span>
          </nav>
          <h1 className="text-3xl md:text-5xl font-extrabold leading-tight text-white">
            Indian Food{' '}
            <span className="bg-gradient-to-r from-brand-blue to-brand-gold bg-clip-text text-transparent">
              Calorie Calculator
            </span>
          </h1>
          <p className="mt-4 max-w-2xl text-gray-300 md:text-lg">
            Search any food — dal, roti, rice, paneer, chicken, fruits and {FOODS.length}+ more — choose a
            katori, roti, cup or grams, and instantly see its calories with full macros (protein, carbs,
            fat, fibre, sugar) and key micronutrients — sodium, calcium, iron, potassium and vitamin C.
            Add several items to calculate a whole meal.
          </p>
        </div>
      </section>

      {/* Calculator */}
      <section className="pb-14">
        <div className="max-w-5xl mx-auto px-4">
          <CalorieCalculator />
        </div>
      </section>

      {/* Common foods table (SSR, crawlable) */}
      <section className="pb-14">
        <div className="max-w-5xl mx-auto px-4">
          <h2 className="text-2xl md:text-3xl font-bold text-white">Calories in common Indian foods</h2>
          <p className="mt-2 text-sm text-gray-400">
            Quick reference for a standard serving. Use the calculator above for other quantities.
          </p>
          <div className="mt-5 overflow-x-auto rounded-xl border border-white/10">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-white/5 text-left text-gray-300">
                  <th className="px-4 py-3 font-semibold">Food</th>
                  <th className="px-4 py-3 font-semibold">Serving</th>
                  <th className="px-4 py-3 font-semibold text-right">Calories</th>
                  <th className="px-4 py-3 font-semibold text-right">Protein</th>
                  <th className="px-4 py-3 font-semibold text-right">Fibre</th>
                  <th className="px-4 py-3 font-semibold text-right">Vitamin C</th>
                </tr>
              </thead>
              <tbody>
                {commonRows.map((r) => (
                  <tr key={r.name} className="border-t border-white/5 text-gray-300">
                    <td className="px-4 py-2.5 font-medium text-white">{r.name}</td>
                    <td className="px-4 py-2.5 text-gray-400">{r.serving}</td>
                    <td className="px-4 py-2.5 text-right font-semibold text-brand-gold">{r.kcal} kcal</td>
                    <td className="px-4 py-2.5 text-right">{r.protein} g</td>
                    <td className="px-4 py-2.5 text-right">{r.fiber} g</td>
                    <td className="px-4 py-2.5 text-right">{r.vitaminC} mg</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="pb-14">
        <div className="max-w-3xl mx-auto px-4">
          <h2 className="text-2xl md:text-3xl font-bold text-white">Frequently asked questions</h2>
          <div className="mt-5 space-y-3">
            {CALCULATOR_FAQS.map((f) => (
              <details
                key={f.question}
                className="group rounded-xl border border-white/10 bg-brand-navy-light p-4"
              >
                <summary className="cursor-pointer list-none font-semibold text-white marker:hidden flex items-center justify-between gap-4">
                  {f.question}
                  <span className="text-brand-blue transition-transform group-open:rotate-45">+</span>
                </summary>
                <p className="mt-3 text-sm leading-relaxed text-gray-300">{f.answer}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="pb-14">
        <div className="max-w-3xl mx-auto px-4">
          <div className="rounded-2xl border border-brand-blue/20 bg-gradient-to-r from-brand-blue/10 to-brand-navy-light p-6 text-center">
            <h2 className="text-xl md:text-2xl font-bold text-white">
              Knowing your calories is step one. Knowing your target is step two.
            </h2>
            <p className="mx-auto mt-2 max-w-xl text-sm text-gray-300">
              Get a personalised Indian diet + workout plan built around your body, routine and goal.
            </p>
            <div className="mt-5 flex flex-wrap justify-center gap-3">
              <Link
                href="/assessment"
                className="rounded-xl bg-gradient-to-r from-brand-blue to-blue-500 px-6 py-3 font-semibold text-white shadow-lg shadow-brand-blue/25 hover:-translate-y-0.5 transition-transform"
              >
                Take the free assessment
              </Link>
              <Link
                href="/plans"
                className="rounded-xl border border-white/15 px-6 py-3 font-semibold text-white hover:bg-white/5 transition-colors"
              >
                View coaching plans
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Data-source credit */}
      <section className="pb-16">
        <div className="max-w-5xl mx-auto px-4">
          <p className="text-[11px] leading-relaxed text-gray-500">
            Nutrition data: Indian Nutrient Databank (INDB), Anuvaad Solutions / Jaacks Lab, used under
            CC BY (Vijayakumar A, Dubasi HB, Awasthi A, Jaacks LM. &ldquo;Development of an Indian Food
            Composition Database.&rdquo; Current Developments in Nutrition, 2024); Indian Food Composition
            Tables 2017, National Institute of Nutrition (ICMR), Hyderabad; and USDA FoodData Central
            (public domain). Values are approximate and for general information, not medical advice.
          </p>
        </div>
      </section>

      <Footer />
    </div>
  );
}
