import { create } from 'zustand';
import type { PaletteCategory } from '../constants';

export type ActiveCategory = PaletteCategory | 'All';

export interface FilterState {
  query: string;
  activeCategory: ActiveCategory;
  setQuery: (query: string) => void;
  setActiveCategory: (activeCategory: ActiveCategory) => void;
}

export const useFilterStore = create<FilterState>((set) => ({
  query: '',
  activeCategory: 'All',
  setQuery: (query) => set({ query }),
  setActiveCategory: (activeCategory) => set({ activeCategory }),
}));
