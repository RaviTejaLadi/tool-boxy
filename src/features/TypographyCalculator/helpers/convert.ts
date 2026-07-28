import { TYPOGRAPHY_UNITS } from '../constants';

export function toPixels(value: number, symbol: string, baseFontSize: number): number {
  const unit = TYPOGRAPHY_UNITS.find((u) => u.symbol === symbol);
  if (!unit) return 0;
  if (unit.relative) return value * baseFontSize;
  return value * unit.toPx;
}

export function fromPixels(px: number, symbol: string, baseFontSize: number): number {
  const unit = TYPOGRAPHY_UNITS.find((u) => u.symbol === symbol);
  if (!unit) return 0;
  if (unit.relative) return px / (baseFontSize || 1);
  return px / unit.toPx;
}

export function convertValue(value: number, from: string, to: string, baseFontSize: number): number {
  const px = toPixels(value, from, baseFontSize);
  return fromPixels(px, to, baseFontSize);
}

export function formatResult(value: number): string {
  if (!Number.isFinite(value)) return '0';
  if (Number.isInteger(value)) return String(value);
  return value.toFixed(6).replace(/\.?0+$/, '') || '0';
}

export function isValidNumber(value: string): boolean {
  if (value.trim() === '' || value === '-' || value === '.' || value === '-.') return false;
  return !Number.isNaN(Number(value));
}
