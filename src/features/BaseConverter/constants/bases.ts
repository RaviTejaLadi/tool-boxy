export type Base = 'decimal' | 'hexadecimal' | 'binary' | 'octal';

export const BASES: Base[] = ['decimal', 'hexadecimal', 'binary', 'octal'];

export const BASE_LABELS: Record<Base, string> = {
  decimal: 'Decimal',
  hexadecimal: 'Hex',
  binary: 'Binary',
  octal: 'Octal',
};

export const BASE_PREFIXES: Record<Base, string> = {
  decimal: '',
  hexadecimal: '0x ',
  binary: '0b ',
  octal: '0o ',
};
