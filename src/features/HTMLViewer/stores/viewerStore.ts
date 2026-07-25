import { create } from 'zustand';
import { DEFAULT_HTML, HISTORY_LIMIT } from '../constants';
import { prettifyHtml } from '../helpers';

export interface ViewerState {
  htmlCode: string;
  past: string[];
  future: string[];
  isTyping: boolean;
  wordWrap: boolean;
  setHtmlCode: (htmlCode: string, options?: { history?: boolean }) => void;
  undo: () => void;
  redo: () => void;
  clearCode: () => void;
  prettify: () => void;
  setWordWrap: (wordWrap: boolean) => void;
  reset: () => void;
  endTyping: () => void;
}

function pushPast(past: string[], value: string) {
  return [...past.slice(-(HISTORY_LIMIT - 1)), value];
}

export const useViewerStore = create<ViewerState>((set, get) => ({
  htmlCode: DEFAULT_HTML,
  past: [],
  future: [],
  isTyping: false,
  wordWrap: true,

  setHtmlCode: (htmlCode, options) => {
    const history = options?.history !== false;
    const state = get();

    if (!history) {
      if (!state.isTyping) {
        set({
          past: pushPast(state.past, state.htmlCode),
          future: [],
          isTyping: true,
          htmlCode,
        });
      } else {
        set({ htmlCode });
      }
      return;
    }

    set({
      past: pushPast(state.past, state.htmlCode),
      future: [],
      isTyping: false,
      htmlCode,
    });
  },

  endTyping: () => set({ isTyping: false }),

  undo: () => {
    const { past, htmlCode, future } = get();
    if (past.length === 0) return;
    const previous = past[past.length - 1];
    set({
      past: past.slice(0, -1),
      future: [htmlCode, ...future].slice(0, HISTORY_LIMIT),
      htmlCode: previous,
      isTyping: false,
    });
  },

  redo: () => {
    const { past, htmlCode, future } = get();
    if (future.length === 0) return;
    const [next, ...rest] = future;
    set({
      past: pushPast(past, htmlCode),
      future: rest,
      htmlCode: next,
      isTyping: false,
    });
  },

  clearCode: () => {
    const { htmlCode, past } = get();
    set({
      past: pushPast(past, htmlCode),
      future: [],
      htmlCode: '',
      isTyping: false,
    });
  },

  prettify: () => {
    const { htmlCode, past } = get();
    const next = prettifyHtml(htmlCode);
    if (next === htmlCode) return;
    set({
      past: pushPast(past, htmlCode),
      future: [],
      htmlCode: next,
      isTyping: false,
    });
  },

  setWordWrap: (wordWrap) => set({ wordWrap }),
  reset: () =>
    set({
      past: pushPast(get().past, get().htmlCode),
      future: [],
      htmlCode: DEFAULT_HTML,
      isTyping: false,
    }),
}));
