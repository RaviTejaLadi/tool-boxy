import { create } from 'zustand';
import { type GenerationMode } from '../constants';
import { isValidHex, normalizeHex, randomHex } from '../helpers';

export interface ShadeState {
  baseHex: string;
  hexDraft: string;
  colourName: string;
  mode: GenerationMode;
  copiedId: string | null;
  setBaseHex: (hex: string) => void;
  setHexDraft: (draft: string) => void;
  setColourName: (name: string) => void;
  setMode: (mode: GenerationMode) => void;
  commitHexDraft: (value: string) => void;
  loadFromHex: (hex: string | null) => void;
  flashCopied: (id: string) => void;
}

export const useShadeStore = create<ShadeState>((set, get) => {
  const initial = randomHex();

  return {
    baseHex: initial,
    hexDraft: initial,
    colourName: 'primary',
    mode: 'classic',
    copiedId: null,

    setBaseHex: (hex) => set({ baseHex: hex, hexDraft: hex }),

    setHexDraft: (draft) => set({ hexDraft: draft }),

    setColourName: (name) => set({ colourName: name.replace(/\s+/g, '-') }),

    setMode: (mode) => set({ mode }),

    commitHexDraft: (value) => {
      const trimmed = value.trim();
      if (isValidHex(trimmed)) {
        const normalized = normalizeHex(trimmed);
        set({ baseHex: normalized, hexDraft: normalized });
      } else {
        set({ hexDraft: get().baseHex });
      }
    },

    loadFromHex: (hex) => {
      if (!hex || !isValidHex(hex)) return;
      const normalized = normalizeHex(hex);
      set({ baseHex: normalized, hexDraft: normalized });
    },

    flashCopied: (id) => {
      set({ copiedId: id });
      window.setTimeout(() => {
        if (get().copiedId === id) set({ copiedId: null });
      }, 1500);
    },
  };
});
