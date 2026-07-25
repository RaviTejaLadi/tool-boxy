import { create } from 'zustand';
import { HISTORY_LIMIT, SAMPLE_JSON, type ViewMode } from '../constants';
import { minifyJson, prettifyJson, validateJson } from '../helpers';

export interface JsonState {
  jsonCode: string;
  past: string[];
  future: string[];
  isTyping: boolean;
  error: string | null;
  searchTerm: string;
  expanded: boolean;
  viewMode: ViewMode;
  wordWrap: boolean;
  setJsonCode: (jsonCode: string, options?: { history?: boolean }) => void;
  undo: () => void;
  redo: () => void;
  clearCode: () => void;
  prettify: () => void;
  minify: () => void;
  setSearchTerm: (searchTerm: string) => void;
  toggleExpanded: () => void;
  setViewMode: (viewMode: ViewMode) => void;
  setWordWrap: (wordWrap: boolean) => void;
  reset: () => void;
  endTyping: () => void;
}

function pushPast(past: string[], value: string) {
  return [...past.slice(-(HISTORY_LIMIT - 1)), value];
}

export const useJsonStore = create<JsonState>((set, get) => ({
  jsonCode: SAMPLE_JSON,
  past: [],
  future: [],
  isTyping: false,
  error: null,
  searchTerm: '',
  expanded: true,
  viewMode: 'tree',
  wordWrap: true,

  setJsonCode: (jsonCode, options) => {
    const history = options?.history !== false;
    const state = get();

    if (!history) {
      if (!state.isTyping) {
        set({
          past: pushPast(state.past, state.jsonCode),
          future: [],
          isTyping: true,
          jsonCode,
          error: validateJson(jsonCode),
        });
      } else {
        set({ jsonCode, error: validateJson(jsonCode) });
      }
      return;
    }

    set({
      past: pushPast(state.past, state.jsonCode),
      future: [],
      isTyping: false,
      jsonCode,
      error: validateJson(jsonCode),
    });
  },

  endTyping: () => set({ isTyping: false }),

  undo: () => {
    const { past, jsonCode, future } = get();
    if (past.length === 0) return;
    const previous = past[past.length - 1];
    set({
      past: past.slice(0, -1),
      future: [jsonCode, ...future].slice(0, HISTORY_LIMIT),
      jsonCode: previous,
      error: validateJson(previous),
      isTyping: false,
    });
  },

  redo: () => {
    const { past, jsonCode, future } = get();
    if (future.length === 0) return;
    const [next, ...rest] = future;
    set({
      past: pushPast(past, jsonCode),
      future: rest,
      jsonCode: next,
      error: validateJson(next),
      isTyping: false,
    });
  },

  clearCode: () => {
    const { jsonCode, past } = get();
    set({
      past: pushPast(past, jsonCode),
      future: [],
      jsonCode: '',
      error: validateJson(''),
      isTyping: false,
    });
  },

  prettify: () => {
    const { jsonCode, past } = get();
    const next = prettifyJson(jsonCode);
    if (next === jsonCode) return;
    set({
      past: pushPast(past, jsonCode),
      future: [],
      jsonCode: next,
      error: validateJson(next),
      isTyping: false,
    });
  },

  minify: () => {
    const { jsonCode, past } = get();
    const next = minifyJson(jsonCode);
    if (next === jsonCode) return;
    set({
      past: pushPast(past, jsonCode),
      future: [],
      jsonCode: next,
      error: validateJson(next),
      isTyping: false,
    });
  },

  setSearchTerm: (searchTerm) => set({ searchTerm }),
  toggleExpanded: () => set({ expanded: !get().expanded }),
  setViewMode: (viewMode) => set({ viewMode }),
  setWordWrap: (wordWrap) => set({ wordWrap }),
  reset: () =>
    set({
      past: pushPast(get().past, get().jsonCode),
      future: [],
      jsonCode: SAMPLE_JSON,
      error: null,
      searchTerm: '',
      expanded: true,
      viewMode: 'tree',
      wordWrap: true,
      isTyping: false,
    }),
}));
