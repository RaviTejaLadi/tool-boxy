import type { Operation } from '../constants';

export function performBitwise(numA: number, numB: number, operation: Operation): number {
  switch (operation) {
    case 'AND':
      return numA & numB;
    case 'OR':
      return numA | numB;
    case 'XOR':
      return numA ^ numB;
    case 'NOT':
      return ~numA;
    case 'LSH':
      return numA << numB;
    case 'RSH':
      return numA >> numB;
    default:
      return 0;
  }
}
