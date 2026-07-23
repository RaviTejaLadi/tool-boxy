import { CATEGORIES, type PaletteCategory } from '../constants/categories';
import { NAME_PARTS_A, NAME_PARTS_B } from '../constants/nameParts';
import type { Palette } from '../constants/types';
import { buildColors } from './colors';
import { hashString, mulberry32 } from './rng';

function buildNames(total: number): string[] {
  const names = new Set<string>();
  for (const n of NAME_PARTS_A) names.add(n);
  let i = 0;
  while (names.size < total) {
    const a = NAME_PARTS_A[i % NAME_PARTS_A.length];
    const b = NAME_PARTS_B[Math.floor(i / NAME_PARTS_A.length) % NAME_PARTS_B.length];
    names.add(`${a} ${b}`);
    i++;
    if (i > total * 4) break;
  }
  return Array.from(names).slice(0, total);
}

/** Deterministic London-inspired swatch sets. Swap for real data when available. */
export function buildPalettes(total = 284): Palette[] {
  const names = buildNames(total);
  return names.map((name, idx) => {
    const seed = hashString(name) + idx * 7919;
    const rand = mulberry32(seed);
    const count = rand() > 0.82 ? 4 : 5;
    const categories: PaletteCategory[] = [];
    const primary = CATEGORIES[idx % CATEGORIES.length];
    categories.push(primary);
    if (rand() > 0.6) {
      const second = CATEGORIES[(idx * 3 + 1) % CATEGORIES.length];
      if (second !== primary) categories.push(second);
    }
    return {
      id: `palette-${idx}`,
      name,
      colors: buildColors(seed, count),
      categories,
    };
  });
}
