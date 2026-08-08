import { create } from 'zustand';
import {
  ANIMATIONS,
  TEXT_ANIMATIONS,
  type AnimationType,
  type TextAnimationType,
  type TextDirection,
  type TextMotionPhase,
  type TextSegmentMode,
} from '../constants';
import type { AnimationPreset } from '../constants/presets';
import type { PreviewShape } from '../constants/preview';
import {
  buildCssText,
  buildHtmlText,
  buildTextCssText,
  buildTextHtmlText,
  getIterationValue,
  getTimingValue,
  toKebab,
} from '../helpers';

export type CodeTab = 'css' | 'html';
export type PreviewMode = 'shape' | 'text';

export interface BezierControl {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
}

export interface AnimationGeneratorState {
  previewMode: PreviewMode;
  animationType: AnimationType;
  textAnimationType: TextAnimationType;
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
  previewText: string;
  textFontSize: number;
  textFontWeight: string;
  textColorIndex: number;
  textLetterSpacing: number;
  textSegmentMode: TextSegmentMode;
  textPhase: TextMotionPhase;
  textDirection: TextDirection;
  textStagger: number;
  playKey: number;
  isPlaying: boolean;
  copied: boolean;
  codeTab: CodeTab;
  textCategoryFilter: 'all' | 'basic' | 'writing' | 'exaggerate';
  setPreviewMode: (previewMode: PreviewMode) => void;
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
  setPreviewText: (previewText: string) => void;
  setTextFontSize: (textFontSize: number) => void;
  setTextFontWeight: (textFontWeight: string) => void;
  setTextColorIndex: (textColorIndex: number) => void;
  setTextLetterSpacing: (textLetterSpacing: number) => void;
  setTextSegmentMode: (textSegmentMode: TextSegmentMode) => void;
  setTextPhase: (textPhase: TextMotionPhase) => void;
  setTextDirection: (textDirection: TextDirection) => void;
  setTextStagger: (textStagger: number) => void;
  setTextCategoryFilter: (textCategoryFilter: 'all' | 'basic' | 'writing' | 'exaggerate') => void;
  setIsPlaying: (isPlaying: boolean) => void;
  setCodeTab: (codeTab: CodeTab) => void;
  selectAnimationType: (key: AnimationType) => void;
  selectTextAnimationType: (key: TextAnimationType) => void;
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
  previewMode: 'text' as PreviewMode,
  animationType: 'fadeIn' as AnimationType,
  textAnimationType: 'rise' as TextAnimationType,
  duration: 0.7,
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
  previewText: 'Animate your text',
  textFontSize: 48,
  textFontWeight: '700',
  textColorIndex: 0,
  textLetterSpacing: -0.5,
  textSegmentMode: 'line' as TextSegmentMode,
  textPhase: 'enter' as TextMotionPhase,
  textDirection: 'right' as TextDirection,
  textStagger: 0.06,
  playKey: 0,
  isPlaying: true,
  copied: false,
  codeTab: 'css' as CodeTab,
  textCategoryFilter: 'all' as const,
};

export const useAnimationGeneratorStore = create<AnimationGeneratorState>((set, get) => ({
  ...initialState,

  setPreviewMode: (previewMode) => set({ previewMode, playKey: get().playKey + 1, isPlaying: true }),
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
  setPreviewText: (previewText) => set({ previewText }),
  setTextFontSize: (textFontSize) => set({ textFontSize }),
  setTextFontWeight: (textFontWeight) => set({ textFontWeight }),
  setTextColorIndex: (textColorIndex) => set({ textColorIndex }),
  setTextLetterSpacing: (textLetterSpacing) => set({ textLetterSpacing }),
  setTextSegmentMode: (textSegmentMode) => set({ textSegmentMode, playKey: get().playKey + 1 }),
  setTextPhase: (textPhase) => set({ textPhase, playKey: get().playKey + 1 }),
  setTextDirection: (textDirection) => set({ textDirection, playKey: get().playKey + 1 }),
  setTextStagger: (textStagger) => set({ textStagger }),
  setTextCategoryFilter: (textCategoryFilter) => set({ textCategoryFilter }),
  setIsPlaying: (isPlaying) => set({ isPlaying }),
  setCodeTab: (codeTab) => set({ codeTab }),

  selectAnimationType: (key) => {
    const preset = ANIMATIONS[key];
    set({
      previewMode: 'shape',
      animationType: key,
      duration: preset.defaultDuration,
      timingFunction: preset.defaultTiming,
      iterationCount: preset.defaultIteration,
      direction: preset.defaultDirection,
      fillMode: preset.defaultFill,
      playKey: get().playKey + 1,
      isPlaying: true,
    });
  },

  selectTextAnimationType: (key) => {
    const preset = TEXT_ANIMATIONS[key];
    set({
      previewMode: 'text',
      textAnimationType: key,
      duration: preset.defaultDuration,
      timingFunction: preset.defaultTiming,
      iterationCount: preset.defaultIteration,
      direction: preset.defaultDirection,
      fillMode: preset.defaultFill,
      textSegmentMode: preset.prefersSegment,
      textStagger: preset.defaultStagger,
      playKey: get().playKey + 1,
      isPlaying: true,
    });
  },

  applyPreset: (preset) => {
    if (preset.mode === 'text' && preset.textType) {
      const def = TEXT_ANIMATIONS[preset.textType];
      set({
        previewMode: 'text',
        textAnimationType: preset.textType,
        duration: preset.duration,
        timingFunction: preset.timing,
        iterationCount: preset.iteration,
        direction: preset.direction,
        fillMode: preset.fill,
        textStagger: preset.stagger ?? def.defaultStagger,
        textSegmentMode: preset.segmentMode ?? def.prefersSegment,
        textPhase: preset.phase ?? 'enter',
        playKey: get().playKey + 1,
        isPlaying: true,
      });
      return;
    }

    if (preset.type) {
      set({
        previewMode: 'shape',
        animationType: preset.type,
        duration: preset.duration,
        timingFunction: preset.timing,
        iterationCount: preset.iteration,
        direction: preset.direction,
        fillMode: preset.fill,
        playKey: get().playKey + 1,
        isPlaying: true,
      });
    }
  },

  resetAll: () => set({ ...initialState, playKey: get().playKey + 1 }),

  replay: () => set({ isPlaying: true, playKey: get().playKey + 1 }),

  bumpPlayKey: () => set({ playKey: get().playKey + 1, isPlaying: true }),

  getKebabName: () => {
    const { previewMode, animationType, textAnimationType } = get();
    return previewMode === 'text' ? `text-${textAnimationType}` : toKebab(animationType);
  },

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
    if (state.previewMode === 'text') {
      return buildTextCssText({
        textAnimationType: state.textAnimationType,
        phase: state.textPhase,
        duration: state.duration,
        timingValue: state.getTimingValue(),
        delay: state.delay,
        iterationValue: state.getIterationValue(),
        direction: state.direction,
        fillMode: state.fillMode,
        stagger: state.textStagger,
        segmentMode: state.textSegmentMode,
        textDirection: state.textDirection,
        previewText: state.previewText,
      });
    }

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

  getHtmlText: () => {
    const state = get();
    if (state.previewMode === 'text') {
      return buildTextHtmlText({
        textAnimationType: state.textAnimationType,
        segmentMode: state.textSegmentMode,
        previewText: state.previewText,
      });
    }
    return buildHtmlText(state.animationType);
  },

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
