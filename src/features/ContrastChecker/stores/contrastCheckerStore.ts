import { create } from 'zustand';
import { getContrastRatio, hexToLuminance } from '../helpers';

export interface ContrastCheckerState {
  background: string;
  foreground: string;
  setBackground: (background: string) => void;
  setForeground: (foreground: string) => void;
  flip: () => void;
  fixToAA: () => void;
  fixToAAA: () => void;
}

export const useContrastCheckerStore = create<ContrastCheckerState>((set, get) => ({
  background: '#1a1a2e',
  foreground: '#eaeaea',

  setBackground: (background) => set({ background }),
  setForeground: (foreground) => set({ foreground }),

  flip: () => {
    const { background, foreground } = get();
    set({ background: foreground, foreground: background });
  },

  fixToAA: () => {
    const { background, foreground } = get();
    const ratio = getContrastRatio(background, foreground);
    if (ratio >= 4.5) return;
    const bgLum = hexToLuminance(background);
    const fgLum = hexToLuminance(foreground);
    if (bgLum > fgLum) {
      set({ foreground: '#ffffff' });
    } else {
      set({ foreground: '#000000' });
    }
  },

  fixToAAA: () => {
    const { background, foreground } = get();
    const ratio = getContrastRatio(background, foreground);
    if (ratio >= 7) return;
    const bgLum = hexToLuminance(background);
    if (bgLum > 0.5) {
      set({ foreground: '#000000' });
    } else {
      set({ foreground: '#ffffff' });
    }
  },
}));

export function useContrastRatio() {
  const background = useContrastCheckerStore((s) => s.background);
  const foreground = useContrastCheckerStore((s) => s.foreground);
  return getContrastRatio(background, foreground);
}
