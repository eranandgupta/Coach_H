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
        m = re.search(r'\((\d+(?:\.\d+)?)\s*g\)', tok)
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

/** Case-insensitive search over name + aliases + category. Empty query -> all foods. */
export function searchFoods(query: string): FoodItem[] {
  const q = norm(query);
  if (!q) return FOODS;
  return FOODS.filter((f) => {
    const hay = [f.name, f.category, ...(f.aliases ?? [])].map(norm).join(' ');
    return hay.includes(q);
  });
}

export function getFoodBySlug(slug: string): FoodItem | undefined {
  return FOODS.find((f) => f.slug === slug);
}
'''
body = "\n".join("  " + json.dumps(f, ensure_ascii=False, separators=(",", ":")) + "," for f in foods)
open(OUT, "w").write(HEADER + body + "\n" + FOOTER)
print(f"Wrote {OUT}: {len(foods)} foods, {len(set(f['category'] for f in foods))} categories, sources={dict(Counter(f['source'] for f in foods))}")
