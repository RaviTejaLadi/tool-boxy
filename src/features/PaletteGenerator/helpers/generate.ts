import { PALETTES } from '@/features/PaletteCollection/constants';
import { NAME_BANK, DEFAULT_COLOR_COUNT, MAX_COLORS } from '../constants';
import { hslToRgb, rgbToHex } from './colorMath';

export interface PaletteColor {
  id: string;
  hex: string;
  name: string;
  locked: boolean;
}

let idCounter = 0;

export function nextId() {
  idCounter += 1;
  return `c-${idCounter}-${Date.now()}`;
}

export function randomName(used: string[]) {
  const available = NAME_BANK.filter((n) => !used.includes(n));
  const pool = available.length ? available : [...NAME_BANK];
  return pool[Math.floor(Math.random() * pool.length)]!;
}

function normalizeHex(hex: string) {
  const clean = hex.startsWith('#') ? hex.slice(1) : hex;
  return `#${clean.toUpperCase()}`;
}

/** Convert a Palette Collection swatch set into editable generator colours. */
export function colorsFromCollection(hexes: string[], paletteName?: string): PaletteColor[] {
  return hexes.slice(0, MAX_COLORS).map((hex, i) => ({
    id: nextId(),
    hex: normalizeHex(hex),
    name: paletteName ? `${paletteName} ${String(i + 1).padStart(2, '0')}` : randomName([]),
    locked: false,
  }));
}

export function randomHexAround(baseHue: number, cohesive: boolean) {
  const h = cohesive ? (baseHue + (Math.random() * 70 - 35) + 360) % 360 : Math.random() * 360;
  const s = 35 + Math.random() * 45;
  const l = 32 + Math.random() * 40;
  const { r, g, b } = hslToRgb(h, s, l);
  return rgbToHex(r, g, b);
}

export function makeColor(baseHue: number, cohesive: boolean, usedNames: string[]): PaletteColor {
  return {
    id: nextId(),
    hex: randomHexAround(baseHue, cohesive),
    name: randomName(usedNames),
    locked: false,
  };
}

export function makeInitialPalette(count = DEFAULT_COLOR_COUNT): PaletteColor[] {
  const first = PALETTES[0];
  if (first) return colorsFromCollection(first.colors, first.name);

  const baseHue = Math.random() * 360;
  const used: string[] = [];
  const out: PaletteColor[] = [];
  for (let i = 0; i < count; i++) {
    const c = makeColor(baseHue, true, used);
    used.push(c.name);
    out.push(c);
  }
  return out;
}
