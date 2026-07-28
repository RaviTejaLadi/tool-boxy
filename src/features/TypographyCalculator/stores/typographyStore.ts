import { create } from 'zustand';
import { DEFAULT_BASE_FONT_SIZE, DEFAULT_SOURCE_UNIT, DEFAULT_SOURCE_VALUE } from '../constants';

let copyTimeout: ReturnType<typeof setTimeout> | undefined;

export interface TypographyCalculatorState {
  baseFontSize: number;
  sourceUnit: string;
  sourceValue: string;
  copiedId: string | null;
  setBaseFontSize: (size: number) => void;
  setUnitValue: (symbol: string, value: string) => void;
  flashCopied: (id: string) => void;
  clear: () => void;
}

export const useTypographyCalculatorStore = create<TypographyCalculatorState>((set) => ({
  baseFontSize: DEFAULT_BASE_FONT_SIZE,
  sourceUnit: DEFAULT_SOURCE_UNIT,
  sourceValue: DEFAULT_SOURCE_VALUE,
  copiedId: null,

  setBaseFontSize: (baseFontSize) => {
    set({ baseFontSize: baseFontSize > 0 ? baseFontSize : 1 });
  },

  setUnitValue: (symbol, value) => {
    set({ sourceUnit: symbol, sourceValue: value });
  },

  flashCopied: (id) => {
    if (copyTimeout) clearTimeout(copyTimeout);
    set({ copiedId: id });
    copyTimeout = setTimeout(() => set({ copiedId: null }), 1500);
  },

  clear: () => {
    set({
      baseFontSize: DEFAULT_BASE_FONT_SIZE,
      sourceUnit: DEFAULT_SOURCE_UNIT,
      sourceValue: DEFAULT_SOURCE_VALUE,
      copiedId: null,
    });
  },
}));
