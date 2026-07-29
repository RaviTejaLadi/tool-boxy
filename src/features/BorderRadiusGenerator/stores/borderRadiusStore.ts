import { create } from 'zustand';
import { DEFAULT_CORNERS, formatBorderRadiusCss, type CornerValues } from '../helpers';

export type PreviewSize = 'small' | 'medium' | 'large';

export interface BorderRadiusState {
  corners: CornerValues;
  linked: boolean;
  previewSize: PreviewSize;
  activeTab: string;
  copied: boolean;
  setActiveTab: (tab: string) => void;
  setPreviewSize: (size: PreviewSize) => void;
  handleCornerChange: (corner: keyof CornerValues, value: number) => void;
  toggleLink: () => void;
  applyPreset: (value: number) => void;
  resetAll: () => void;
  copyCss: () => Promise<void>;
}

export const useBorderRadiusStore = create<BorderRadiusState>((set, get) => ({
  corners: { ...DEFAULT_CORNERS },
  linked: true,
  previewSize: 'medium',
  activeTab: 'all',
  copied: false,

  setActiveTab: (activeTab) => set({ activeTab }),
  setPreviewSize: (previewSize) => set({ previewSize }),

  handleCornerChange: (corner, value) => {
    const clamped = Math.max(0, Math.min(200, value));
    const { linked } = get();
    if (linked) {
      set({
        corners: {
          topLeft: clamped,
          topRight: clamped,
          bottomRight: clamped,
          bottomLeft: clamped,
        },
      });
    } else {
      set((state) => ({
        corners: { ...state.corners, [corner]: clamped },
      }));
    }
  },

  toggleLink: () => {
    const { linked, corners } = get();
    if (linked) {
      set({ linked: false });
    } else {
      set({
        linked: true,
        corners: {
          topLeft: corners.topLeft,
          topRight: corners.topLeft,
          bottomRight: corners.topLeft,
          bottomLeft: corners.topLeft,
        },
      });
    }
  },

  applyPreset: (value) => {
    set({
      linked: true,
      corners: {
        topLeft: value,
        topRight: value,
        bottomRight: value,
        bottomLeft: value,
      },
    });
  },

  resetAll: () => set({ corners: { ...DEFAULT_CORNERS }, linked: true }),

  copyCss: async () => {
    const css = formatBorderRadiusCss(get().corners);
    await navigator.clipboard.writeText(css);
    set({ copied: true });
    setTimeout(() => set({ copied: false }), 2000);
  },
}));
