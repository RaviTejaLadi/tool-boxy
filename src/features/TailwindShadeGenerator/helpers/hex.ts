import { oklchToHex } from './colorMath';

export const isValidHex = (v: string) => /^#?[0-9a-fA-F]{6}$/.test(v.trim());

export const normalizeHex = (v: string) => {
  const withHash = v.startsWith('#') ? v : `#${v}`;
  return withHash.toLowerCase();
};

export function randomHex() {
  const hue = Math.random() * 360;
  const chroma = 0.12 + Math.random() * 0.14;
  const lightness = 0.45 + Math.random() * 0.2;
  return oklchToHex({ L: lightness, C: chroma, H: hue });
}

export function resolveInitialHex(param: string | null) {
  if (param && isValidHex(param)) return normalizeHex(param);
  return randomHex();
}
