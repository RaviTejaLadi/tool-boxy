export interface ValueSet {
  decimal: string;
  hexadecimal: string;
  binary: string;
  octal: string;
}

export const EMPTY_VALUE: ValueSet = {
  decimal: '',
  hexadecimal: '',
  binary: '',
  octal: '',
};

export function formatValue(num: number): ValueSet {
  const isNegative = num < 0;
  const absNum = Math.abs(num);
  const sign = isNegative ? '-' : '';

  return {
    decimal: String(isNegative ? -absNum : absNum),
    hexadecimal: sign + absNum.toString(16).toUpperCase(),
    binary: sign + absNum.toString(2),
    octal: sign + absNum.toString(8),
  };
}

export function isEmptyValue(value: ValueSet): boolean {
  return BASES_EMPTY.every((key) => value[key] === '');
}

const BASES_EMPTY: (keyof ValueSet)[] = ['decimal', 'hexadecimal', 'binary', 'octal'];
