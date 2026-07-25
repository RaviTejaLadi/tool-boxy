import type { Base } from '../constants';

export function parseValue(value: string, base: Base): number {
  const cleanValue = value.replace(/[^0-9a-fA-F-]/g, '');
  if (cleanValue === '' || cleanValue === '-') return 0;

  const isNegative = cleanValue.startsWith('-');
  const digits = isNegative ? cleanValue.slice(1) : cleanValue;
  if (digits === '') return 0;

  let parsed: number;
  switch (base) {
    case 'decimal':
      parsed = parseInt(digits, 10);
      break;
    case 'hexadecimal':
      parsed = parseInt(digits, 16);
      break;
    case 'binary':
      parsed = parseInt(digits.replace(/[^01]/g, ''), 2);
      break;
    case 'octal':
      parsed = parseInt(digits.replace(/[^0-7]/g, ''), 8);
      break;
    default:
      return 0;
  }

  if (Number.isNaN(parsed)) return 0;
  return isNegative ? -parsed : parsed;
}
