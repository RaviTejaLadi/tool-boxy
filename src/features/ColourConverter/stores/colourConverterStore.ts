import { create } from 'zustand';
import { buildAllFormats } from '../helpers';

export interface ColourConverterState {
  hex: string;
  copied: string | null;
  setHex: (hex: string) => void;
  copyValue: (text: string, format: string) => Promise<void>;
}

export const useColourConverterStore = create<ColourConverterState>((set) => ({
  hex: '#3b82f6',
  copied: null,

  setHex: (hex) => set({ hex }),

  copyValue: async (text, format) => {
    await navigator.clipboard.writeText(text);
    set({ copied: format });
    setTimeout(() => set({ copied: null }), 2000);
  },
}));

export function useColourFormats() {
  const hex = useColourConverterStore((s) => s.hex);
  return buildAllFormats(hex);
}
