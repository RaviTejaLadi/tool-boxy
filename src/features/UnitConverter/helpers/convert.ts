import { UNIT_CATEGORIES, type CategoryKey } from '../constants';

export function convertTemperature(value: number, from: string, to: string): number {
  let celsius: number;

  if (from === '°C') celsius = value;
  else if (from === '°F') celsius = ((value - 32) * 5) / 9;
  else if (from === 'K') celsius = value - 273.15;
  else return value;

  if (to === '°C') return celsius;
  if (to === '°F') return (celsius * 9) / 5 + 32;
  if (to === 'K') return celsius + 273.15;

  return value;
}

export function convertValue(value: number, from: string, to: string, category: CategoryKey): number {
  if (category === 'temp') {
    return convertTemperature(value, from, to);
  }

  const units = UNIT_CATEGORIES[category].units;
  const fromUnit = units.find((u) => u.symbol === from);
  const toUnit = units.find((u) => u.symbol === to);

  if (!fromUnit || !toUnit) return 0;

  return (value * fromUnit.toBase) / toUnit.toBase;
}

export function formatResult(value: number): string {
  if (!Number.isFinite(value)) return '0';
  if (Number.isInteger(value)) return String(value);

  const rounded = Number(value.toPrecision(12));
  return String(rounded);
}

export function isValidNumber(value: string): boolean {
  if (value.trim() === '' || value === '-' || value === '.' || value === '-.') return false;
  return !Number.isNaN(Number(value));
}
