import { mulberry32 } from './rng';

function hslToHex(h: number, s: number, l: number) {
  s /= 100;
  l /= 100;
  const k = (n: number) => (n + h / 30) % 12;
  const a = s * Math.min(l, 1 - l);
  const f = (n: number) => l - a * Math.max(-1, Math.min(k(n) - 3, Math.min(9 - k(n), 1)));
  const toHex = (x: number) =>
    Math.round(255 * x)
      .toString(16)
      .padStart(2, '0');
  return `#${toHex(f(0))}${toHex(f(8))}${toHex(f(4))}`;
}

const SCHEMES = [
  (rand: () => number) => {
    const base = rand() * 360;
    return [base, base + 20, base + 320, base + 40, base + 180];
  },
  (rand: () => number) => {
    const base = 25 + rand() * 30;
    return [base, base + 10, base + 35, base + 190, base + 5];
  },
  (rand: () => number) => {
    const base = rand() * 360;
    return [base, base, base, base, base];
  },
  (rand: () => number) => {
    const base = 90 + rand() * 60;
    return [base, base + 15, base - 20, 40 + rand() * 20, base + 150];
  },
  (rand: () => number) => {
    const base = rand() * 360;
    return [base, base + 150, base + 210, base + 40, base + 300];
  },
];

export function buildColors(seed: number, count: number): string[] {
  const rand = mulberry32(seed);
  const scheme = SCHEMES[Math.floor(rand() * SCHEMES.length)];
  const hues = scheme(rand);
  const colors: string[] = [];

  for (let i = 0; i < count; i++) {
    const h = ((hues[i % hues.length] ?? rand() * 360) + 360) % 360;
    const lightness = 12 + (i / Math.max(1, count - 1)) * 78;
    const sat = 20 + rand() * 45;
    colors.push(hslToHex(h, sat, Math.min(96, lightness)));
  }

  return colors;
}
