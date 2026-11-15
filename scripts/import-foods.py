#!/usr/bin/env python3
"""
Regenerate lib/foods.ts from the master food-database spreadsheet.

The spreadsheet ("All Foods (per 100g)" sheet) is the single source of truth for the
calorie calculator. Columns: #, Food Name, Category, Source, Calories, Protein, Carbs,
Fat, Fibre, Sugar, Sodium, Calcium, Iron, Potassium, Vitamin C, Serving Options,
Aliases / Other Names, Slug (internal id).

Usage:  python3 scripts/import-foods.py /path/to/Food_Database.xlsx
Then:   npx tsc --noEmit  &&  npx next build   (verify)  ->  commit lib/foods.ts
"""
import sys, re, json, openpyxl
from collections import Counter

SRC = sys.argv[1] if len(sys.argv) > 1 else sys.exit("usage: import-foods.py <xlsx>")
OUT = "lib/foods.ts"

def num(v):
    if v in (None, ''): return 0
    try:
        f = float(v); return int(f) if f == int(f) else round(f, 3)
    except Exception: return 0

def src_norm(v):
    s = str(v or '').upper()
    return 'IFCT' if 'IFCT' in s else 'INDB' if 'INDB' in s else 'USDA'

def parse_servings(s):
    if not s: return [{"label": "100 g", "grams": 100}]
    out = []
    for tok in str(s).split('·'):
        tok = tok.strip()
        if not tok: continue
        # Weight in the label's parentheses, most specific first:
        #   "(30 ml ≈ 28 g)" -> 28 · "(40 g dry)" -> 40 · "(330 ml)" -> 330 (liquids: 1 ml ≈ 1 g)
        m = (re.search(r'≈\s*(\d+(?:\.\d+)?)\s*g\b', tok)
             or re.search(r'\((\d+(?:\.\d+)?)\s*g\b', tok)
             or re.search(r'\((\d+(?:\.\d+)?)\s*ml\b', tok))
        if m: g = float(m.group(1))
        else:
            m2 = re.match(r'(\d+(?:\.\d+)?)\s*g', tok); g = float(m2.group(1)) if m2 else 100.0
        out.append({"label": tok, "grams": int(g) if g == int(g) else g})
    if not any(x["grams"] == 100 for x in out): out.append({"label": "100 g", "grams": 100})
    return out

wb = openpyxl.load_workbook(SRC, read_only=True, data_only=True)
rows = list(wb["All Foods (per 100g)"].iter_rows(values_only=True))
hi = next(i for i, r in enumerate(rows) if r and r[0] == '#')
col = {n: i for i, n in enumerate(rows[hi]) if n}
C = lambda row, k: row[col[k]]

foods, seen = [], set()
for r in rows[hi + 1:]:
    if not r or C(r, 'Food Name') in (None, ''): continue
    slug = (C(r, 'Slug (internal id)') or '').strip() or re.sub(r'[^a-z0-9]+', '-', str(C(r, 'Food Name')).lower()).strip('-')
    if slug in seen: continue
    seen.add(slug)
    al = C(r, 'Aliases / Other Names')
    aliases = [a.strip() for a in str(al).split(',') if a and a.strip()] if al else []
    foods.append({
        "slug": slug, "name": str(C(r, 'Food Name')).strip(), "aliases": aliases,
        "category": str(C(r, 'Category') or '').strip(),
        "per100g": {"kcal": num(C(r,'Calories (kcal)')), "protein": num(C(r,'Protein (g)')),
            "carbs": num(C(r,'Carbs (g)')), "fat": num(C(r,'Fat (g)')), "fiber": num(C(r,'Fibre (g)')),
            "sugar": num(C(r,'Sugar (g)')), "sodium": num(C(r,'Sodium (mg)')), "calcium": num(C(r,'Calcium (mg)')),
            "iron": num(C(r,'Iron (mg)')), "potassium": num(C(r,'Potassium (mg)')), "vitaminC": num(C(r,'Vitamin C (mg)'))},
        "servings": parse_servings(C(r, 'Serving Options')), "source": src_norm(C(r, 'Source'))})

HEADER = '''/**
 * Curated food nutrition dataset for the public Calorie Calculator.
 *
 * GENERATED from the master spreadsheet by scripts/import-foods.py — the single source
 * of truth curated by the coach. To change foods, edit the sheet and re-run the import;
 * do not hand-edit the FOODS array below.
 *
 * Values are per 100 g of the edible (typically cooked / ready-to-eat) form.
 *   MACROS (g): kcal, protein, carbs, fat, fibre, sugar
 *   MICROS (mg): sodium, calcium, iron, potassium, vitaminC
 *
 * Sources: INDB (Indian Nutrient Databank, CC BY), IFCT 2017 (NIN/ICMR), USDA (CC0).
 */

export interface FoodServing { label: string; grams: number; }

/** Per-serving nutrients. Macros in grams; micros in milligrams. */
export interface FoodNutrients {
  kcal: number; protein: number; carbs: number; fat: number; fiber: number; sugar: number;
  sodium: number; calcium: number; iron: number; potassium: number; vitaminC: number;
}

/** @deprecated Kept for backwards-compatibility; use FoodNutrients. */
export type FoodMacros = FoodNutrients;

export interface FoodItem {
  slug: string; name: string; aliases?: string[]; category: string;
  per100g: FoodNutrients; servings: FoodServing[]; source: 'INDB' | 'IFCT' | 'USDA';
}

export const FOODS: FoodItem[] = [
'''
FOOTER = '''];

/** Distinct categories in dataset order. */
export const FOOD_CATEGORIES: string[] = FOODS.reduce<string[]>((acc, f) => {
  if (!acc.includes(f.category)) acc.push(f.category);
  return acc;
}, []);

const norm = (s: string) => s.toLowerCase().trim();

const words = (s: string) => norm(s).split(/[^a-z0-9]+/).filter(Boolean);

/** "eggs" -> "egg", so plural queries still hit singular names/aliases. */
const singular = (s: string) => (s.length > 3 && s.endsWith("s") && !s.endsWith("ss") ? s.slice(0, -1) : s);

/** How well a query (word or phrase) matches one text (lower = better), or null for no match. */
function wordScore(term: string, text: string): number | null {
  const t = norm(text);
  const tw = words(t).join(" ");
  const q = words(term).join(" ");
  if (!q) return null;
  if (t === term || tw === q) return 0;
  if (tw.startsWith(q + " ")) return 1; // "Egg Curry"
  if ((" " + tw + " ").includes(" " + q + " ")) return 2; // "Boiled Egg"
  if (tw.startsWith(q)) return 2.5; // "Buttermilk"
  if ((" " + tw).includes(" " + q)) return 3; // word prefix
  if (t.includes(term)) return 20; // mid-word ("tea" in "steak"): weak
  return null;
}

/** Best of the query word and its singular form (the latter a hair worse, so "oats" prefers Oats over Oat Milk). */
function matchScore(term: string, text: string): number | null {
  const a = wordScore(term, text);
  const s = singular(term);
  const sb = s === term ? null : wordScore(s, text);
  const b = sb === null ? null : sb + 0.25;
  return a === null ? b : b === null ? a : Math.min(a, b);
}

/**
 * Relevance-ranked search. Every query word must appear in the name, an alias or the category.
 * Name matches rank first, then aliases (an exact alias like "egg" on Boiled Egg counts as a top
 * name hit); a category-only match ("egg" in "Paneer, Egg & Dairy") ranks last, so "egg" lists eggs
 * before milk. A name/alias hit whose category also matches ("rice" in Rice & Grains) gets a small
 * boost. Ties keep dataset order. Empty query -> all foods.
 */
export function searchFoods(query: string): FoodItem[] {
  const q = norm(query);
  if (!q) return FOODS;
  const terms = words(q);
  if (!terms.length) return FOODS;
  const scored: { f: FoodItem; s: number; i: number }[] = [];
  FOODS.forEach((f, i) => {
    let total = 0;
    for (const term of terms) {
      const name = matchScore(term, f.name);
      const alias = (f.aliases ?? []).reduce<number | null>((best, a) => {
        const s = matchScore(term, a);
        return s === null ? best : best === null ? s : Math.min(best, s);
      }, null);
      const aliasAdj = alias === null ? null : alias < 1 ? alias : 10 + alias; // exact alias = top hit
      const direct = name === null ? aliasAdj : aliasAdj === null ? name : Math.min(name, aliasAdj);
      const cat = matchScore(term, f.category);
      if (direct === null) {
        if (cat === null) return;
        total += 100;
      } else {
        total += direct - (cat !== null && cat < 20 ? 1.5 : 0);
      }
    }
    // A whole-phrase hit on the name ("boiled egg") beats the same words scattered.
    if (terms.length > 1) {
      const phrase = matchScore(q, f.name);
      if (phrase !== null && phrase < 20) total -= 5 - phrase;
    }
    scored.push({ f, s: total, i });
  });
  return scored.sort((a, b) => a.s - b.s || a.i - b.i).map((x) => x.f);
}

export function getFoodBySlug(slug: string): FoodItem | undefined {
  return FOODS.find((f) => f.slug === slug);
}
'''
body = "\n".join("  " + json.dumps(f, ensure_ascii=False, separators=(",", ":")) + "," for f in foods)
open(OUT, "w").write(HEADER + body + "\n" + FOOTER)
print(f"Wrote {OUT}: {len(foods)} foods, {len(set(f['category'] for f in foods))} categories, sources={dict(Counter(f['source'] for f in foods))}")
