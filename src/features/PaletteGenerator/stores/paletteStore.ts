import { create } from 'zustand';
import { MIN_COLORS, MAX_COLORS } from '../constants';
import { type PaletteColor, colorsFromCollection, makeColor, makeInitialPalette, nextId, randomName } from '../helpers';

export interface PaletteState {
  colors: PaletteColor[];
  cohesive: boolean;
  copiedTag: string | null;
  setCohesive: (cohesive: boolean) => void;
  flashCopied: (tag: string) => void;
  loadFromCollection: (hexes: string[], paletteName?: string) => void;
  regenerateAll: () => void;
  toggleLock: (id: string) => void;
  shuffleOne: (id: string) => void;
  duplicateOne: (id: string) => void;
  deleteOne: (id: string) => void;
  changeCount: (delta: number) => void;
}

export const usePaletteStore = create<PaletteState>((set, get) => ({
  colors: makeInitialPalette(),
  cohesive: true,
  copiedTag: null,

  setCohesive: (cohesive) => set({ cohesive }),

  flashCopied: (tag) => {
    set({ copiedTag: tag });
    window.setTimeout(() => {
      if (get().copiedTag === tag) set({ copiedTag: null });
    }, 1400);
  },

  loadFromCollection: (hexes, paletteName) => {
    const next = colorsFromCollection(hexes, paletteName);
    if (next.length === 0) return;
    set({ colors: next, copiedTag: null });
  },

  regenerateAll: () => {
    const { cohesive } = get();
    const baseHue = Math.random() * 360;
    set((state) => {
      const used = state.colors.filter((c) => c.locked).map((c) => c.name);
      return {
        colors: state.colors.map((c) => {
          if (c.locked) return c;
          const nc = makeColor(baseHue, cohesive, used);
          used.push(nc.name);
          return nc;
        }),
      };
    });
  },

  toggleLock: (id) => {
    set((state) => ({
      colors: state.colors.map((c) => (c.id === id ? { ...c, locked: !c.locked } : c)),
    }));
  },

  shuffleOne: (id) => {
    const { cohesive } = get();
    set((state) => {
      const used = state.colors.filter((c) => c.id !== id).map((c) => c.name);
      const baseHue = Math.random() * 360;
      return {
        colors: state.colors.map((c) => (c.id === id ? makeColor(baseHue, cohesive, used) : c)),
      };
    });
  },

  duplicateOne: (id) => {
    set((state) => {
      if (state.colors.length >= MAX_COLORS) return state;
      const idx = state.colors.findIndex((c) => c.id === id);
      if (idx === -1) return state;
      const used = state.colors.map((c) => c.name);
      const clone = {
        ...state.colors[idx]!,
        id: nextId(),
        name: randomName(used),
        locked: false,
      };
      const next = [...state.colors];
      next.splice(idx + 1, 0, clone);
      return { colors: next };
    });
  },

  deleteOne: (id) => {
    set((state) => ({
      colors: state.colors.length <= MIN_COLORS ? state.colors : state.colors.filter((c) => c.id !== id),
    }));
  },

  changeCount: (delta) => {
    const { cohesive } = get();
    set((state) => {
      const target = Math.max(MIN_COLORS, Math.min(MAX_COLORS, state.colors.length + delta));
      if (target === state.colors.length) return state;

      if (target < state.colors.length) {
        const next = [...state.colors];
        while (next.length > target) {
          const idx = [...next].reverse().findIndex((c) => !c.locked);
          if (idx === -1) break;
          next.splice(next.length - 1 - idx, 1);
        }
        return { colors: next };
      }

      const used = state.colors.map((c) => c.name);
      const baseHue = Math.random() * 360;
      const next = [...state.colors];
      while (next.length < target) {
        const c = makeColor(baseHue, cohesive, used);
        used.push(c.name);
        next.push(c);
      }
      return { colors: next };
    });
  },
}));
