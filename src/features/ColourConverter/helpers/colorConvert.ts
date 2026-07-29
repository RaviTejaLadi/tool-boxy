export function hexToRgb(hex: string) {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16),
      }
    : null;
}

export function rgbToDecimal(r: number, g: number, b: number) {
  return {
    r: +(r / 255).toFixed(4),
    g: +(g / 255).toFixed(4),
    b: +(b / 255).toFixed(4),
  };
}

export function rgbToHsl(r: number, g: number, b: number) {
  r /= 255;
  g /= 255;
  b /= 255;
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h = 0;
  let s = 0;
  const l = (max + min) / 2;

  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r:
        h = ((g - b) / d + (g < b ? 6 : 0)) / 6;
        break;
      case g:
        h = ((b - r) / d + 2) / 6;
        break;
      case b:
        h = ((r - g) / d + 4) / 6;
        break;
    }
  }

  return {
    h: +(h * 360).toFixed(1),
    s: +(s * 100).toFixed(1),
    l: +(l * 100).toFixed(1),
  };
}

export function demoLab(hex: string) {
  const rgb = hexToRgb(hex);
  if (!rgb) return { L: 0, a: 0, b: 0 };
  const { r, g, b } = rgb;
  return {
    L: +(50 + (r / 255) * 20 - (g / 255) * 10).toFixed(1),
    a: +(10 - (r / 255) * 20 + (g / 255) * 10).toFixed(1),
    b: +(-40 - (b / 255) * 30 + (r / 255) * 10).toFixed(1),
  };
}

export function demoLch(hex: string) {
  const lab = demoLab(hex);
  const c = Math.sqrt(lab.a * lab.a + lab.b * lab.b);
  const h = (Math.atan2(lab.b, lab.a) * 180) / Math.PI;
  return {
    L: lab.L,
    c: +c.toFixed(1),
    h: +(h < 0 ? h + 360 : h).toFixed(1),
  };
}

export function demoOklab(hex: string) {
  const lab = demoLab(hex);
  return {
    L: +(0.6 + (lab.L - 50) / 100).toFixed(4),
    a: +(-0.02 + lab.a / 100).toFixed(4),
    b: +(-0.15 + lab.b / 100).toFixed(4),
  };
}

export function demoOklch(hex: string) {
  const oklab = demoOklab(hex);
  const c = Math.sqrt(oklab.a * oklab.a + oklab.b * oklab.b);
  const h = (Math.atan2(oklab.b, oklab.a) * 180) / Math.PI;
  return {
    L: oklab.L,
    c: +c.toFixed(4),
    h: +(h < 0 ? h + 360 : h).toFixed(1),
  };
}

export type ColourFormatRow = { format: string; value: string };

export function buildAllFormats(hex: string): ColourFormatRow[] {
  const rgb = hexToRgb(hex);
  const decimal = rgb ? rgbToDecimal(rgb.r, rgb.g, rgb.b) : null;
  const hsl = rgb ? rgbToHsl(rgb.r, rgb.g, rgb.b) : null;
  const lab = demoLab(hex);
  const lch = demoLch(hex);
  const oklab = demoOklab(hex);
  const oklch = demoOklch(hex);

  return [
    { format: 'HEX', value: hex },
    { format: 'RGB', value: `rgb(${rgb?.r ?? 0}, ${rgb?.g ?? 0}, ${rgb?.b ?? 0})` },
    { format: 'Decimal RGB', value: `rgb(${decimal?.r ?? 0}, ${decimal?.g ?? 0}, ${decimal?.b ?? 0})` },
    { format: 'HSL', value: `hsl(${hsl?.h ?? 0}, ${hsl?.s ?? 0}%, ${hsl?.l ?? 0}%)` },
    { format: 'LAB', value: `lab(${lab.L} ${lab.a} ${lab.b})` },
    { format: 'LCH', value: `lch(${lch.L} ${lch.c} ${lch.h})` },
    { format: 'OKLAB', value: `oklab(${oklab.L} ${oklab.a} ${oklab.b})` },
    { format: 'OKLCH', value: `oklch(${oklch.L} ${oklch.c} ${oklch.h})` },
  ];
}

export const FORMAT_EXAMPLES = [
  { format: 'Decimal RGB', hex: '0.2314, 0.5098, 0.9647', rgb: 'HSL', value: '217, 91%, 60%' },
  { format: 'LAB', hex: '54.5 8.5 -65.5', rgb: 'LCH', value: '54.5 66.0 277.5' },
  { format: 'OKLAB', hex: '0.64 -0.01 -0.15', rgb: 'OKLCH', value: '0.64 0.15 264' },
];
