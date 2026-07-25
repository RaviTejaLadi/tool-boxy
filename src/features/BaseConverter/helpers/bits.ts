import { BIT_COUNT } from '../constants';

export function bitsToNumber(bits: boolean[]): number {
  let num = 0;
  for (let i = 0; i < bits.length; i++) {
    if (bits[i]) {
      num |= 1 << (BIT_COUNT - 1 - i);
    }
  }
  return num >>> 0;
}

export function numberToBits(num: number, count = BIT_COUNT): boolean[] {
  const bits = Array(count).fill(false) as boolean[];
  const unsigned = num >>> 0;
  for (let i = 0; i < count; i++) {
    if (unsigned & (1 << (count - 1 - i))) {
      bits[i] = true;
    }
  }
  return bits;
}
