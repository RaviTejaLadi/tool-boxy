import { getCharacterFormats } from './characterFormats';

export function getUnicodeRange(chars: string[]): { min: number; max: number; label: string } | null {
  if (chars.length === 0) return null;

  let min = Number.POSITIVE_INFINITY;
  let max = Number.NEGATIVE_INFINITY;

  for (const char of chars) {
    const cp = getCharacterFormats(char).codePoint;
    min = Math.min(min, cp);
    max = Math.max(max, cp);
  }

  const toLabel = (cp: number) => `U+${cp.toString(16).toUpperCase().padStart(4, '0')}`;

  return {
    min,
    max,
    label: min === max ? toLabel(min) : `${toLabel(min)} – ${toLabel(max)}`,
  };
}
