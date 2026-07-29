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

export function rgbToLuminance(r: number, g: number, b: number) {
  const [rs, gs, bs] = [r, g, b].map((c) => {
    const val = c / 255;
    return val <= 0.03928 ? val / 12.92 : Math.pow((val + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
}

export function hexToLuminance(hex: string) {
  const rgb = hexToRgb(hex);
  if (!rgb) return 0;
  return rgbToLuminance(rgb.r, rgb.g, rgb.b);
}

export function getContrastRatio(bg: string, fg: string) {
  const l1 = hexToLuminance(bg);
  const l2 = hexToLuminance(fg);
  const lighter = Math.max(l1, l2);
  const darker = Math.min(l1, l2);
  return +((lighter + 0.05) / (darker + 0.05)).toFixed(2);
}

export function getContrastRating(ratio: number) {
  if (ratio >= 14) return { label: 'Excellent', color: 'text-green-600' };
  if (ratio >= 10) return { label: 'Very Good', color: 'text-green-500' };
  if (ratio >= 7) return { label: 'Good', color: 'text-emerald-500' };
  if (ratio >= 4.5) return { label: 'Passes AA', color: 'text-blue-500' };
  if (ratio >= 3) return { label: 'Passes AA Large', color: 'text-yellow-500' };
  return { label: 'Poor', color: 'text-red-500' };
}

export function isLightBackground(hex: string) {
  return hexToLuminance(hex) > 0.5;
}
