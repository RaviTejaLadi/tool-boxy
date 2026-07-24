import { STEPS, BASE_LADDER, type GenerationMode } from '../constants';
import { clamp, hexToOklch, oklchToHex } from './colorMath';

export interface Shade {
  step: (typeof STEPS)[number];
  hex: string;
  oklch: { L: number; C: number; H: number };
}

export function generateShades(baseHex: string, mode: GenerationMode): Shade[] {
  const base = hexToOklch(baseHex);

  return STEPS.map((step, i) => {
    const { L, C } = BASE_LADDER[step];
    let lightness = L;
    let chroma = C;
    let hue = base.H;

    if (mode === 'hueShift') {
      const spread = 32;
      const t = i / (STEPS.length - 1) - 0.5;
      hue = (base.H + t * spread + 360) % 360;
    } else if (mode === 'luminanceAnchored') {
      const delta = base.L - BASE_LADDER[500].L;
      lightness = clamp(L + delta, 0.04, 0.98);
    } else if (mode === 'vivid') {
      chroma = Math.min(C * 1.35, 0.37);
    } else if (mode === 'muted') {
      chroma = C * 0.45;
    }

    const oklch = { L: lightness, C: chroma, H: hue };
    return { step, hex: oklchToHex(oklch), oklch };
  });
}

export function formatCssVarsHex(shades: Shade[], name: string) {
  return `:root {\n${shades.map((s) => `  --${name}-${s.step}: ${s.hex};`).join('\n')}\n}`;
}

export function formatCssVarsOklch(shades: Shade[], name: string) {
  return `:root {\n${shades
    .map(
      (s) => `  --${name}-${s.step}: oklch(${s.oklch.L.toFixed(3)} ${s.oklch.C.toFixed(3)} ${s.oklch.H.toFixed(1)});`
    )
    .join('\n')}\n}`;
}

export function formatTailwindConfig(shades: Shade[], name: string) {
  return `${name}: {\n${shades.map((s) => `  ${s.step}: '${s.hex}',`).join('\n')}\n},`;
}
