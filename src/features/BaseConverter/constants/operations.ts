export type Operation = 'AND' | 'OR' | 'XOR' | 'NOT' | 'LSH' | 'RSH';

export const OPERATIONS: Operation[] = ['AND', 'OR', 'XOR', 'NOT', 'LSH', 'RSH'];

export const OPERATION_META: Record<Operation, { symbol: string; description: string }> = {
  AND: { symbol: '&', description: '1 if both bits are 1' },
  OR: { symbol: '|', description: '1 if either bit is 1' },
  XOR: { symbol: '^', description: '1 if bits differ' },
  NOT: { symbol: '~', description: 'Flip all bits' },
  LSH: { symbol: '<<', description: 'Shift bits left' },
  RSH: { symbol: '>>', description: 'Shift bits right' },
};
