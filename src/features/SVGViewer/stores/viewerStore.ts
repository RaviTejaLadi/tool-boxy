import { create } from 'zustand';
import {
  DEFAULT_SVG,
  HISTORY_LIMIT,
  MAX_SCALE,
  MIN_SCALE,
  SCALE_STEP,
  type PreviewBackground,
  type PreviewTab,
} from '../constants';
import { optimizeSvg, prettifySvg, validateSvg } from '../helpers';

export interface ViewerState {
  svgCode: string;
  past: string[];
  future: string[];
  isTyping: boolean;
  scale: number;
  error: string | null;
  previewTab: PreviewTab;
  previewBackground: PreviewBackground;
  wordWrap: boolean;
  setSvgCode: (svgCode: string, options?: { history?: boolean }) => void;
  undo: () => void;
  redo: () => void;
  clearCode: () => void;
  prettify: () => void;
  optimize: () => void;
  zoomIn: () => void;
  zoomOut: () => void;
  resetZoom: () => void;
  setPreviewTab: (tab: PreviewTab) => void;
  setPreviewBackground: (bg: PreviewBackground) => void;
  setWordWrap: (wordWrap: boolean) => void;
  reset: () => void;
  endTyping: () => void;
}

function pushPast(past: string[], value: string) {
  return [...past.slice(-(HISTORY_LIMIT - 1)), value];
}

export const useViewerStore = create<ViewerState>((set, get) => ({
  svgCode: DEFAULT_SVG,
  past: [],
  future: [],
  isTyping: false,
  scale: 1,
  error: null,
  previewTab: 'preview',
  previewBackground: 'surface',
  wordWrap: true,

  setSvgCode: (svgCode, options) => {
    const history = options?.history !== false;
    const state = get();

    if (!history) {
      if (!state.isTyping) {
        set({
          past: pushPast(state.past, state.svgCode),
          future: [],
          isTyping: true,
          svgCode,
          error: validateSvg(svgCode),
        });
      } else {
        set({ svgCode, error: validateSvg(svgCode) });
      }
      return;
    }

    set({
      past: pushPast(state.past, state.svgCode),
      future: [],
      isTyping: false,
      svgCode,
      error: validateSvg(svgCode),
    });
  },

  endTyping: () => set({ isTyping: false }),

  undo: () => {
    const { past, svgCode, future } = get();
    if (past.length === 0) return;
    const previous = past[past.length - 1];
    set({
      past: past.slice(0, -1),
      future: [svgCode, ...future].slice(0, HISTORY_LIMIT),
      svgCode: previous,
      error: validateSvg(previous),
      isTyping: false,
    });
  },

  redo: () => {
    const { past, svgCode, future } = get();
    if (future.length === 0) return;
    const [next, ...rest] = future;
    set({
      past: pushPast(past, svgCode),
      future: rest,
      svgCode: next,
      error: validateSvg(next),
      isTyping: false,
    });
  },

  clearCode: () => {
    const { svgCode, past } = get();
    set({
      past: pushPast(past, svgCode),
      future: [],
      svgCode: '',
      error: validateSvg(''),
      isTyping: false,
    });
  },

  prettify: () => {
    const { svgCode, past } = get();
    const next = prettifySvg(svgCode);
    if (next === svgCode) return;
    set({
      past: pushPast(past, svgCode),
      future: [],
      svgCode: next,
      error: validateSvg(next),
      isTyping: false,
    });
  },

  optimize: () => {
    const { svgCode, past } = get();
    const next = optimizeSvg(svgCode);
    if (next === svgCode) return;
    set({
      past: pushPast(past, svgCode),
      future: [],
      svgCode: next,
      error: validateSvg(next),
      isTyping: false,
    });
  },

  zoomIn: () => set({ scale: Math.min(get().scale + SCALE_STEP, MAX_SCALE) }),
  zoomOut: () => set({ scale: Math.max(get().scale - SCALE_STEP, MIN_SCALE) }),
  resetZoom: () => set({ scale: 1 }),
  setPreviewTab: (previewTab) => set({ previewTab }),
  setPreviewBackground: (previewBackground) => set({ previewBackground }),
  setWordWrap: (wordWrap) => set({ wordWrap }),
  reset: () =>
    set({
      past: pushPast(get().past, get().svgCode),
      future: [],
      svgCode: DEFAULT_SVG,
      scale: 1,
      error: null,
      previewTab: 'preview',
      previewBackground: 'surface',
      isTyping: false,
    }),
}));
