import { create } from 'zustand';
import { UNIT_CATEGORIES, type CategoryKey } from '../constants';

const defaultCategory: CategoryKey = 'length';
const defaultUnit = UNIT_CATEGORIES[defaultCategory].units[0].symbol;

let copyTimeout: ReturnType<typeof setTimeout> | undefined;

export interface UnitConverterState {
  category: CategoryKey;
  sourceUnit: string;
  sourceValue: string;
  copiedId: string | null;
  setCategory: (category: CategoryKey) => void;
  setUnitValue: (symbol: string, value: string) => void;
  flashCopied: (id: string) => void;
  clear: () => void;
}

export const useUnitConverterStore = create<UnitConverterState>((set) => ({
  category: defaultCategory,
  sourceUnit: defaultUnit,
  sourceValue: '0',
  copiedId: null,

  setCategory: (category) => {
    const sourceUnit = UNIT_CATEGORIES[category].units[0].symbol;
    set({ category, sourceUnit, sourceValue: '0', copiedId: null });
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
      category: defaultCategory,
      sourceUnit: defaultUnit,
      sourceValue: '0',
      copiedId: null,
    });
  },
}));
