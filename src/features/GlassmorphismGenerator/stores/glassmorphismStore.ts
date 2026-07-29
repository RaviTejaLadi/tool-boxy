import { create } from 'zustand';
import { generateGlassCssBlock, type GlassOptions } from '../helpers';

const DEFAULTS = {
  bgColor: '#ffffff',
  bgOpacity: 20,
  borderColor: '#ffffff',
  borderOpacity: 30,
  blur: 10,
  borderRadius: 16,
  shadowIntensity: 10,
  borderWidth: 1,
  enableBorder: true,
  enableShadow: true,
  gradient1: '#6d28d9',
  gradient2: '#ec4899',
  gradientAngle: 135,
};

export interface GlassmorphismState extends GlassOptions {
  gradient1: string;
  gradient2: string;
  gradientAngle: number;
  copied: boolean;
  setBgColor: (v: string) => void;
  setBgOpacity: (v: number) => void;
  setBorderColor: (v: string) => void;
  setBorderOpacity: (v: number) => void;
  setBlur: (v: number) => void;
  setBorderRadius: (v: number) => void;
  setShadowIntensity: (v: number) => void;
  setBorderWidth: (v: number) => void;
  setEnableBorder: (v: boolean) => void;
  setEnableShadow: (v: boolean) => void;
  setGradient1: (v: string) => void;
  setGradient2: (v: string) => void;
  setGradientAngle: (v: number) => void;
  resetDefaults: () => void;
  copyCss: () => Promise<void>;
  getGlassOptions: () => GlassOptions;
  getPreviewBackground: () => string;
}

export const useGlassmorphismStore = create<GlassmorphismState>((set, get) => ({
  ...DEFAULTS,
  copied: false,

  setBgColor: (bgColor) => set({ bgColor }),
  setBgOpacity: (bgOpacity) => set({ bgOpacity }),
  setBorderColor: (borderColor) => set({ borderColor }),
  setBorderOpacity: (borderOpacity) => set({ borderOpacity }),
  setBlur: (blur) => set({ blur }),
  setBorderRadius: (borderRadius) => set({ borderRadius }),
  setShadowIntensity: (shadowIntensity) => set({ shadowIntensity }),
  setBorderWidth: (borderWidth) => set({ borderWidth }),
  setEnableBorder: (enableBorder) => set({ enableBorder }),
  setEnableShadow: (enableShadow) => set({ enableShadow }),
  setGradient1: (gradient1) => set({ gradient1 }),
  setGradient2: (gradient2) => set({ gradient2 }),
  setGradientAngle: (gradientAngle) => set({ gradientAngle }),

  resetDefaults: () => set({ ...DEFAULTS, copied: false }),

  copyCss: async () => {
    const css = generateGlassCssBlock(get().getGlassOptions());
    await navigator.clipboard.writeText(css);
    set({ copied: true });
    setTimeout(() => set({ copied: false }), 2000);
  },

  getGlassOptions: () => {
    const s = get();
    return {
      bgColor: s.bgColor,
      bgOpacity: s.bgOpacity,
      borderColor: s.borderColor,
      borderOpacity: s.borderOpacity,
      blur: s.blur,
      borderRadius: s.borderRadius,
      shadowIntensity: s.shadowIntensity,
      borderWidth: s.borderWidth,
      enableBorder: s.enableBorder,
      enableShadow: s.enableShadow,
    };
  },

  getPreviewBackground: () => {
    const { gradientAngle, gradient1, gradient2 } = get();
    return `linear-gradient(${gradientAngle}deg, ${gradient1}, ${gradient2})`;
  },
}));
