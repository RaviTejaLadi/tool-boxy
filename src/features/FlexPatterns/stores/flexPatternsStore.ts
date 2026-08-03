import { create } from 'zustand';
import { FLEX_PATTERNS, type FlexPattern } from '../constants/patterns';

export interface FlexPatternsState {
  activePatternId: string;
  searchQuery: string;
  copiedId: string | null;
  selectPattern: (id: string) => void;
  setSearchQuery: (searchQuery: string) => void;
  flashCopied: (id: string) => void;
}

export const useFlexPatternsStore = create<FlexPatternsState>((set) => ({
  activePatternId: FLEX_PATTERNS[0]!.id,
  searchQuery: '',
  copiedId: null,

  selectPattern: (id) => set({ activePatternId: id }),

  setSearchQuery: (searchQuery) => set({ searchQuery }),

  flashCopied: (id) => {
    set({ copiedId: id });
    setTimeout(() => set({ copiedId: null }), 2000);
  },
}));

export function getActivePattern(activePatternId: string): FlexPattern {
  return FLEX_PATTERNS.find((pattern) => pattern.id === activePatternId) ?? FLEX_PATTERNS[0]!;
}

export function filterPatterns(searchQuery: string): FlexPattern[] {
  const query = searchQuery.trim().toLowerCase();
  if (!query) return FLEX_PATTERNS;

  return FLEX_PATTERNS.filter(
    (pattern) => pattern.name.toLowerCase().includes(query) || pattern.description.toLowerCase().includes(query)
  );
}
