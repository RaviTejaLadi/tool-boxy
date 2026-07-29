import { create } from 'zustand';
import { ANIMATIONS, type AnimationType } from '../constants';
import type { AnimationPreset } from '../constants/presets';
import type { PreviewShape } from '../constants/preview';
import { buildCssText, buildHtmlText, getIterationValue, getTimingValue, toKebab } from '../helpers';

export type CodeTab = 'css' | 'html';

export interface BezierControl {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
}

export interface AnimationGeneratorState {
  animationType: AnimationType;
  duration: number;
  delay: number;
  timingFunction: string;
  bezier: BezierControl;
  iterationCount: string;
  iterationCustom: number;
  direction: string;
  fillMode: string;
  shape: PreviewShape;
  size: number;
  colorIndex: number;
  playKey: number;
  isPlaying: boolean;
  copied: boolean;
  codeTab: CodeTab;
  setDuration: (duration: number) => void;
  setDelay: (delay: number) => void;
  setTimingFunction: (timingFunction: string) => void;
  setBezier: (bezier: BezierControl) => void;
  setIterationCount: (iterationCount: string) => void;
  setIterationCustom: (iterationCustom: number) => void;
  setDirection: (direction: string) => void;
  setFillMode: (fillMode: string) => void;
  setShape: (shape: PreviewShape) => void;
  setSize: (size: number) => void;
  setColorIndex: (colorIndex: number) => void;
  setIsPlaying: (isPlaying: boolean) => void;
  setCodeTab: (codeTab: CodeTab) => void;
  selectAnimationType: (key: AnimationType) => void;
  applyPreset: (preset: AnimationPreset) => void;
  resetAll: () => void;
  replay: () => void;
  bumpPlayKey: () => void;
  copyCode: () => Promise<void>;
  getCssText: () => string;
  getHtmlText: () => string;
  getKebabName: () => string;
  getTimingValue: () => string;
  getIterationValue: () => number | string;
}

const initialState = {
  animationType: 'fadeIn' as AnimationType,
  duration: 0.6,
  delay: 0,
  timingFunction: 'ease-out',
  bezier: { x1: 0.34, y1: 1.56, x2: 0.64, y2: 1 },
  iterationCount: '1',
  iterationCustom: 4,
  direction: 'normal',
  fillMode: 'both',
  shape: 'rounded' as PreviewShape,
  size: 96,
  colorIndex: 0,
  playKey: 0,
  isPlaying: true,
  copied: false,
  codeTab: 'css' as CodeTab,
};

export const useAnimationGeneratorStore = create<AnimationGeneratorState>((set, get) => ({
  ...initialState,

  setDuration: (duration) => set({ duration }),
  setDelay: (delay) => set({ delay }),
  setTimingFunction: (timingFunction) => set({ timingFunction }),
  setBezier: (bezier) => set({ bezier }),
  setIterationCount: (iterationCount) => set({ iterationCount }),
  setIterationCustom: (iterationCustom) => set({ iterationCustom }),
  setDirection: (direction) => set({ direction }),
  setFillMode: (fillMode) => set({ fillMode }),
  setShape: (shape) => set({ shape }),
  setSize: (size) => set({ size }),
  setColorIndex: (colorIndex) => set({ colorIndex }),
  setIsPlaying: (isPlaying) => set({ isPlaying }),
  setCodeTab: (codeTab) => set({ codeTab }),

  selectAnimationType: (key) => {
    const preset = ANIMATIONS[key];
    set({
      animationType: key,
      duration: preset.defaultDuration,
      timingFunction: preset.defaultTiming,
      iterationCount: preset.defaultIteration,
      direction: preset.defaultDirection,
      fillMode: preset.defaultFill,
    });
  },

  applyPreset: (preset) => {
    set({
      animationType: preset.type,
      duration: preset.duration,
      timingFunction: preset.timing,
      iterationCount: preset.iteration,
      direction: preset.direction,
      fillMode: preset.fill,
    });
  },

  resetAll: () => set({ ...initialState, playKey: get().playKey + 1 }),

  replay: () => set({ isPlaying: true, playKey: get().playKey + 1 }),

  bumpPlayKey: () => set({ playKey: get().playKey + 1, isPlaying: true }),

  getKebabName: () => toKebab(get().animationType),

  getTimingValue: () => {
    const { timingFunction, bezier } = get();
    return getTimingValue(timingFunction, bezier);
  },

  getIterationValue: () => {
    const { iterationCount, iterationCustom } = get();
    return getIterationValue(iterationCount, iterationCustom);
  },

  getCssText: () => {
    const state = get();
    return buildCssText({
      animationType: state.animationType,
      duration: state.duration,
      timingValue: state.getTimingValue(),
      delay: state.delay,
      iterationValue: state.getIterationValue(),
      direction: state.direction,
      fillMode: state.fillMode,
    });
  },

  getHtmlText: () => buildHtmlText(get().animationType),

  copyCode: async () => {
    const { codeTab } = get();
    const text = codeTab === 'css' ? get().getCssText() : get().getHtmlText();
    try {
      await navigator.clipboard.writeText(text);
      set({ copied: true });
      setTimeout(() => set({ copied: false }), 2000);
    } catch {
      set({ copied: false });
    }
  },
}));
