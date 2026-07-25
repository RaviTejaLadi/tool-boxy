import { create } from 'zustand';
import { BIT_COUNT, type Base, type Operation } from '../constants';
import {
  bitsToNumber,
  EMPTY_VALUE,
  formatValue,
  numberToBits,
  parseValue,
  performBitwise,
  type ValueSet,
} from '../helpers';

export type ActiveMode = 'converter' | 'bitwise';

const emptyBits = Array(BIT_COUNT).fill(false) as boolean[];

export interface ConverterState {
  activeMode: ActiveMode;
  converterValue: ValueSet;
  bits: boolean[];
  valueA: ValueSet;
  valueB: ValueSet;
  operation: Operation;
  setActiveMode: (mode: ActiveMode) => void;
  setConverterFromBase: (value: string, base: Base) => void;
  toggleBit: (index: number) => void;
  setValueAFromBase: (value: string, base: Base) => void;
  setValueBFromBase: (value: string, base: Base) => void;
  setOperation: (operation: Operation) => void;
  getBitwiseResult: () => ValueSet | null;
  clear: () => void;
}

function syncAllBases(value: string, base: Base): ValueSet {
  if (value.trim() === '') return EMPTY_VALUE;
  return formatValue(parseValue(value, base));
}

export const useConverterStore = create<ConverterState>((set, get) => ({
  activeMode: 'converter',
  converterValue: EMPTY_VALUE,
  bits: emptyBits,
  valueA: EMPTY_VALUE,
  valueB: EMPTY_VALUE,
  operation: 'AND',

  setActiveMode: (activeMode) => set({ activeMode }),

  setConverterFromBase: (value, base) => {
    const converterValue = syncAllBases(value, base);
    const bits =
      converterValue.decimal === ''
        ? emptyBits
        : numberToBits(parseValue(converterValue.decimal, 'decimal'), BIT_COUNT);
    set({ converterValue, bits });
  },

  toggleBit: (index) => {
    const bits = [...get().bits];
    bits[index] = !bits[index];
    const converterValue = formatValue(bitsToNumber(bits));
    set({ bits, converterValue });
  },

  setValueAFromBase: (value, base) => {
    set({ valueA: syncAllBases(value, base) });
  },

  setValueBFromBase: (value, base) => {
    set({ valueB: syncAllBases(value, base) });
  },

  setOperation: (operation) => set({ operation }),

  getBitwiseResult: () => {
    const { valueA, valueB, operation } = get();
    if (valueA.decimal === '' || (operation !== 'NOT' && valueB.decimal === '')) {
      return null;
    }
    const numA = parseValue(valueA.decimal, 'decimal');
    const numB = parseValue(valueB.decimal, 'decimal');
    return formatValue(performBitwise(numA, numB, operation));
  },

  clear: () =>
    set({
      activeMode: 'converter',
      converterValue: EMPTY_VALUE,
      bits: emptyBits,
      valueA: EMPTY_VALUE,
      valueB: EMPTY_VALUE,
      operation: 'AND',
    }),
}));
