'use client';

import { useState } from 'react';
import {
  ACTIVITY_LEVELS,
  DEFICIT_RATES,
  MACRO_GOALS,
  PROTEIN_GOALS,
  bmi,
  bmiBand,
  bmr,
  bodyFatBand,
  dailyDeficit,
  deficitTarget,
  feetInchesToCm,
  healthyWeightRange,
  macroTargets,
  navyBodyFat,
  proteinRange,
  tdee,
  type Sex,
  type ToolSlug,
} from '@/lib/fitnessTools';

// Interactive calculator for every /tools/[tool] page. All maths comes from
// lib/fitnessTools.ts, the same functions the server-rendered copy uses.

const inputCls =
  'w-full rounded-lg border border-white/10 bg-brand-navy px-3 py-2 text-sm text-white outline-none focus:border-brand-blue/60';

const TONE: Record<string, string> = {
  low: 'text-sky-300 border-sky-400/30 bg-sky-400/10',
  good: 'text-emerald-300 border-emerald-400/30 bg-emerald-400/10',
  watch: 'text-amber-300 border-amber-400/30 bg-amber-400/10',
  high: 'text-red-300 border-red-400/30 bg-red-400/10',
};

/** Which inputs each calculator asks for. */
const FIELDS: Record<ToolSlug, { sex?: boolean; age?: boolean; weight?: boolean; activity?: boolean }> = {
  'bmi-calculator': { weight: true },
  'tdee-calculator': { sex: true, age: true, weight: true, activity: true },
  'calorie-deficit-calculator': { sex: true, age: true, weight: true, activity: true },
  'protein-calculator': { weight: true },
  'macro-calculator': { sex: true, age: true, weight: true, activity: true },
  'ideal-weight-calculator': {},
  'body-fat-calculator': { sex: true, weight: true },
};

const num = (s: string) => {
  const n = parseFloat(s);
  return Number.isFinite(n) ? n : 0;
};
const within = (n: number, min: number, max: number) => n >= min && n <= max;
const kcal = (n: number) => `${Math.round(n).toLocaleString('en-IN')} kcal`;

function Field({ label, htmlFor, children }: { label: string; htmlFor?: string; children: React.ReactNode }) {
  return (
    <div>
      <label htmlFor={htmlFor} className="mb-1.5 block text-xs font-medium text-gray-400">
        {label}
      </label>
      {children}
    </div>
  );
}

function Toggle<T extends string>({
  value,
  onChange,
  options,
  label,
}: {
  value: T;
  onChange: (v: T) => void;
  options: { value: T; label: string }[];
  label: string;
}) {
  return (
    <div role="group" aria-label={label} className="grid grid-flow-col auto-cols-fr gap-1 rounded-lg border border-white/10 bg-brand-navy p-1">
      {options.map((o) => (
        <button
          key={o.value}
          type="button"
          aria-pressed={value === o.value}
          onClick={() => onChange(o.value)}
          className={`whitespace-nowrap rounded-md px-2 py-1.5 text-sm font-medium transition-colors ${
            value === o.value ? 'bg-brand-blue text-white' : 'text-gray-400 hover:text-white'
          }`}
        >
          {o.label}
        </button>
      ))}
    </div>
  );
}

function Stat({ label, value, sub }: { label: string; value: string; sub?: string }) {
  return (
    <div className="rounded-xl border border-white/10 bg-brand-navy p-4">
      <div className="text-xs text-gray-400">{label}</div>
      <div className="mt-1 text-xl font-bold text-white">{value}</div>
      {sub && <div className="mt-0.5 text-xs text-gray-500">{sub}</div>}
    </div>
  );
}

export default function FitnessToolWidget({ slug }: { slug: ToolSlug }) {
  const fields = FIELDS[slug];

  const [sex, setSex] = useState<Sex>('male');
  const [age, setAge] = useState('30');
  const [weight, setWeight] = useState('70');
  const [heightUnit, setHeightUnit] = useState<'cm' | 'ft'>('cm');
  const [cm, setCm] = useState('170');
  const [feet, setFeet] = useState('5');
  const [inches, setInches] = useState('7');
  const [activity, setActivity] = useState('moderate');
  const [rate, setRate] = useState('0.5');
  const [goalWeight, setGoalWeight] = useState('');
  const [proteinGoal, setProteinGoal] = useState('muscle');
  const [macroGoal, setMacroGoal] = useState('lose');
  const [neck, setNeck] = useState('38');
  const [waist, setWaist] = useState('85');
  const [hip, setHip] = useState('96');

  const heightCm = heightUnit === 'cm' ? num(cm) : feetInchesToCm(num(feet), num(inches));
  const w = num(weight);
  const a = num(age);

  const heightOk = within(heightCm, 120, 230);
  const weightOk = !fields.weight || within(w, 30, 250);
  const ageOk = !fields.age || within(a, 18, 90);
  const ready = heightOk && weightOk && ageOk;

  const maintenance = ready && fields.activity ? tdee(sex, w, heightCm, a, activity) : 0;

  function result() {
    if (!ready) {
      return (
        <p className="text-sm text-gray-400">
          Enter {fields.age ? 'your age (18–90), ' : ''}
          {fields.weight ? 'weight (30–250 kg) and ' : ''}height (120–230 cm) to see your result.
        </p>
      );
    }

    switch (slug) {
      case 'bmi-calculator': {
        const value = bmi(w, heightCm);
        const indian = bmiBand(value, 'indian');
        const who = bmiBand(value, 'who');
        const healthy = healthyWeightRange(heightCm, 'indian');
        const diff =
          w > healthy.max
            ? `${(w - healthy.max).toFixed(1)} kg above the top of that range`
            : w < healthy.min
              ? `${(healthy.min - w).toFixed(1)} kg below the bottom of that range`
              : 'inside that range';
        return (
          <>
            <div className="flex flex-wrap items-end gap-3">
              <div className="text-5xl font-extrabold text-white">{value.toFixed(1)}</div>
              <span className={`mb-1.5 rounded-full border px-3 py-1 text-sm font-semibold ${TONE[indian.tone]}`}>
                {indian.label} (Asian Indian)
              </span>
            </div>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              <Stat label="WHO global category" value={who.label} />
              <Stat label="Healthy weight for your height" value={`${healthy.min.toFixed(1)}–${healthy.max.toFixed(1)} kg`} sub={`You are ${diff}`} />
            </div>
          </>
        );
      }

      case 'tdee-calculator': {
        const rest = bmr(sex, w, heightCm, a);
        const cut = deficitTarget(maintenance, 0.5, sex);
        return (
          <>
            <div className="text-xs text-gray-400">Maintenance calories (TDEE)</div>
            <div className="mt-1 text-5xl font-extrabold text-white">
              {maintenance.toLocaleString('en-IN')} <span className="text-xl font-semibold text-gray-400">kcal / day</span>
            </div>
            <div className="mt-4 grid gap-3 sm:grid-cols-3">
              <Stat label="BMR (at rest)" value={kcal(rest)} />
              <Stat label="Fat loss" value={kcal(cut.target)} sub={`About ${cut.kgPerWeek} kg a week`} />
              <Stat label="Muscle gain" value={kcal(maintenance + 300)} sub="Maintenance + 300" />
            </div>
          </>
        );
      }

      case 'calorie-deficit-calculator': {
        const t = deficitTarget(maintenance, num(rate), sex);
        const goal = num(goalWeight);
        const toLose = goal > 0 && goal < w ? w - goal : 0;
        return (
          <>
            <div className="text-xs text-gray-400">Eat this much to lose weight</div>
            <div className="mt-1 text-5xl font-extrabold text-white">
              {t.target.toLocaleString('en-IN')} <span className="text-xl font-semibold text-gray-400">kcal / day</span>
            </div>
            <div className="mt-4 grid gap-3 sm:grid-cols-3">
              <Stat label="Maintenance" value={kcal(maintenance)} />
              <Stat label="Daily deficit" value={kcal(t.deficit)} sub={`About ${t.kgPerWeek} kg a week`} />
              <Stat
                label="Time to goal"
                value={toLose > 0 && t.kgPerWeek > 0 ? `${Math.ceil(toLose / t.kgPerWeek)} weeks` : '—'}
                sub={toLose > 0 ? `To lose ${toLose.toFixed(1)} kg` : 'Add a goal weight'}
              />
            </div>
            {t.floored && (
              <p className={`mt-4 rounded-lg border px-3 py-2 text-sm ${TONE.watch}`}>
                {num(rate)} kg a week would need a {kcal(dailyDeficit(num(rate)))} deficit, which takes you below the{' '}
                {kcal(t.target)} minimum. The target is held at that floor, so expect about {t.kgPerWeek} kg a week.
              </p>
            )}
          </>
        );
      }

      case 'protein-calculator': {
        const r = proteinRange(w, proteinGoal);
        const goal = PROTEIN_GOALS.find((g) => g.key === proteinGoal) ?? PROTEIN_GOALS[0];
        return (
          <>
            <div className="text-xs text-gray-400">Your daily protein target</div>
            <div className="mt-1 text-5xl font-extrabold text-white">
              {r.min}–{r.max} <span className="text-xl font-semibold text-gray-400">g / day</span>
            </div>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              <Stat label="Per kg of body weight" value={`${goal.min}–${goal.max} g`} sub={goal.basis} />
              <Stat label="Across 4 meals" value={`${Math.round(r.min / 4)}–${Math.round(r.max / 4)} g each`} />
            </div>
          </>
        );
      }

      case 'macro-calculator': {
        const m = macroTargets(maintenance, w, macroGoal, sex);
        const parts = [
          { label: 'Protein', grams: m.protein, kcal: m.protein * 4, cls: 'bg-brand-blue' },
          { label: 'Carbs', grams: m.carbs, kcal: m.carbs * 4, cls: 'bg-brand-gold' },
          { label: 'Fat', grams: m.fat, kcal: m.fat * 9, cls: 'bg-emerald-400' },
        ];
        const total = parts.reduce((s, p) => s + p.kcal, 0) || 1;
        return (
          <>
            <div className="text-xs text-gray-400">Daily calories</div>
            <div className="mt-1 text-5xl font-extrabold text-white">
              {m.calories.toLocaleString('en-IN')} <span className="text-xl font-semibold text-gray-400">kcal / day</span>
            </div>
            <div className="mt-4 flex h-2.5 gap-0.5 overflow-hidden rounded-full" aria-hidden="true">
              {parts.map((p) => (
                <div key={p.label} className={p.cls} style={{ width: `${(p.kcal / total) * 100}%` }} />
              ))}
            </div>
            <div className="mt-4 grid gap-3 grid-cols-3">
              {parts.map((p) => (
                <Stat key={p.label} label={p.label} value={`${p.grams} g`} sub={`${Math.round((p.kcal / total) * 100)}% of calories`} />
              ))}
            </div>
          </>
        );
      }

      case 'ideal-weight-calculator': {
        const indian = healthyWeightRange(heightCm, 'indian');
        const who = healthyWeightRange(heightCm, 'who');
        return (
          <>
            <div className="text-xs text-gray-400">Healthy weight for {heightCm} cm (Asian Indian cut-offs)</div>
            <div className="mt-1 text-5xl font-extrabold text-white">
              {indian.min.toFixed(1)}–{indian.max.toFixed(1)} <span className="text-xl font-semibold text-gray-400">kg</span>
            </div>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              <Stat label="WHO global range" value={`${who.min.toFixed(1)}–${who.max.toFixed(1)} kg`} sub="BMI 18.5–24.9" />
              <Stat label="Middle of the Indian range" value={`${((indian.min + indian.max) / 2).toFixed(1)} kg`} sub="BMI 18.5–22.9" />
            </div>
          </>
        );
      }

      case 'body-fat-calculator': {
        const pct = navyBodyFat(sex, heightCm, num(neck), num(waist), num(hip));
        if (pct === null) {
          return (
            <p className="text-sm text-gray-400">
              Check your measurements: your waist{sex === 'female' ? ' plus hips' : ''} must be larger than your neck, all in
              centimetres.
            </p>
          );
        }
        const band = bodyFatBand(pct, sex);
        const fatMass = (w * pct) / 100;
        return (
          <>
            <div className="flex flex-wrap items-end gap-3">
              <div className="text-5xl font-extrabold text-white">{pct.toFixed(1)}%</div>
              {band && (
                <span className={`mb-1.5 rounded-full border px-3 py-1 text-sm font-semibold ${TONE[band.tone]}`}>{band.label}</span>
              )}
            </div>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              <Stat label="Fat mass" value={`${fatMass.toFixed(1)} kg`} />
              <Stat label="Lean mass" value={`${(w - fatMass).toFixed(1)} kg`} sub="Muscle, bone, organs and water" />
            </div>
          </>
        );
      }
    }
  }

  return (
    <div className="rounded-2xl border border-brand-blue/20 bg-brand-navy-light p-5 md:p-7">
      <div className="grid gap-4 sm:grid-cols-2">
        {fields.sex && (
          <Field label="Sex">
            <Toggle
              label="Sex"
              value={sex}
              onChange={setSex}
              options={[
                { value: 'male', label: 'Male' },
                { value: 'female', label: 'Female' },
              ]}
            />
          </Field>
        )}

        {fields.age && (
          <Field label="Age (years)" htmlFor="tool-age">
            <input id="tool-age" type="number" inputMode="numeric" min={18} max={90} value={age} onChange={(e) => setAge(e.target.value)} className={inputCls} />
          </Field>
        )}

        {fields.weight && (
          <Field label="Weight (kg)" htmlFor="tool-weight">
            <input id="tool-weight" type="number" inputMode="decimal" min={30} max={250} step="0.1" value={weight} onChange={(e) => setWeight(e.target.value)} className={inputCls} />
          </Field>
        )}

        <Field label="Height" htmlFor={heightUnit === 'cm' ? 'tool-height-cm' : 'tool-height-ft'}>
          <div className="flex gap-2">
            {heightUnit === 'cm' ? (
              <input id="tool-height-cm" type="number" inputMode="decimal" min={120} max={230} value={cm} onChange={(e) => setCm(e.target.value)} className={inputCls} aria-label="Height in centimetres" />
            ) : (
              <>
                <input id="tool-height-ft" type="number" inputMode="numeric" min={3} max={7} value={feet} onChange={(e) => setFeet(e.target.value)} className={inputCls} aria-label="Height, feet" />
                <input type="number" inputMode="decimal" min={0} max={11} value={inches} onChange={(e) => setInches(e.target.value)} className={inputCls} aria-label="Height, inches" />
              </>
            )}
            <div className="w-32 shrink-0">
              <Toggle
                label="Height unit"
                value={heightUnit}
                onChange={setHeightUnit}
                options={[
                  { value: 'cm', label: 'cm' },
                  { value: 'ft', label: 'ft/in' },
                ]}
              />
            </div>
          </div>
        </Field>

        {fields.activity && (
          <Field label="Activity level" htmlFor="tool-activity">
            <select id="tool-activity" value={activity} onChange={(e) => setActivity(e.target.value)} className={inputCls}>
              {ACTIVITY_LEVELS.map((l) => (
                <option key={l.key} value={l.key}>
                  {l.label}: {l.detail}
                </option>
              ))}
            </select>
          </Field>
        )}

        {slug === 'calorie-deficit-calculator' && (
          <>
            <Field label="How fast do you want to lose?" htmlFor="tool-rate">
              <select id="tool-rate" value={rate} onChange={(e) => setRate(e.target.value)} className={inputCls}>
                {DEFICIT_RATES.map((r) => (
                  <option key={r} value={r}>
                    {r} kg a week
                  </option>
                ))}
              </select>
            </Field>
            <Field label="Goal weight (kg, optional)" htmlFor="tool-goal-weight">
              <input id="tool-goal-weight" type="number" inputMode="decimal" min={30} max={250} step="0.1" value={goalWeight} onChange={(e) => setGoalWeight(e.target.value)} placeholder="e.g. 65" className={inputCls} />
            </Field>
          </>
        )}

        {slug === 'protein-calculator' && (
          <Field label="Your goal" htmlFor="tool-protein-goal">
            <select id="tool-protein-goal" value={proteinGoal} onChange={(e) => setProteinGoal(e.target.value)} className={inputCls}>
              {PROTEIN_GOALS.map((g) => (
                <option key={g.key} value={g.key}>
                  {g.label}
                </option>
              ))}
            </select>
          </Field>
        )}

        {slug === 'macro-calculator' && (
          <Field label="Your goal" htmlFor="tool-macro-goal">
            <select id="tool-macro-goal" value={macroGoal} onChange={(e) => setMacroGoal(e.target.value)} className={inputCls}>
              {MACRO_GOALS.map((g) => (
                <option key={g.key} value={g.key}>
                  {g.label}
                </option>
              ))}
            </select>
          </Field>
        )}

        {slug === 'body-fat-calculator' && (
          <>
            <Field label="Neck (cm)" htmlFor="tool-neck">
              <input id="tool-neck" type="number" inputMode="decimal" min={20} max={70} step="0.5" value={neck} onChange={(e) => setNeck(e.target.value)} className={inputCls} />
            </Field>
            <Field label={sex === 'male' ? 'Waist at navel (cm)' : 'Waist at narrowest point (cm)'} htmlFor="tool-waist">
              <input id="tool-waist" type="number" inputMode="decimal" min={40} max={200} step="0.5" value={waist} onChange={(e) => setWaist(e.target.value)} className={inputCls} />
            </Field>
            {sex === 'female' && (
              <Field label="Hips at widest point (cm)" htmlFor="tool-hip">
                <input id="tool-hip" type="number" inputMode="decimal" min={50} max={200} step="0.5" value={hip} onChange={(e) => setHip(e.target.value)} className={inputCls} />
              </Field>
            )}
          </>
        )}
      </div>

      <div className="mt-6 border-t border-white/10 pt-6" aria-live="polite">
        {result()}
      </div>
    </div>
  );
}
