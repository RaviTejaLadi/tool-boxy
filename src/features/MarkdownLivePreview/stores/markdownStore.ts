import { create } from 'zustand';
import { SAMPLE_MARKDOWN } from '../constants';

export interface MarkdownState {
  markdown: string;
  copied: boolean;
  copiedCodeKey: string | null;
  setMarkdown: (markdown: string) => void;
  resetMarkdown: () => void;
  copyMarkdown: () => Promise<void>;
  copyCode: (key: string, text: string) => Promise<void>;
}

export const useMarkdownStore = create<MarkdownState>((set, get) => ({
  markdown: SAMPLE_MARKDOWN,
  copied: false,
  copiedCodeKey: null,

  setMarkdown: (markdown) => set({ markdown }),

  resetMarkdown: () => set({ markdown: SAMPLE_MARKDOWN }),

  copyMarkdown: async () => {
    await navigator.clipboard.writeText(get().markdown);
    set({ copied: true });
    window.setTimeout(() => {
      if (get().copied) set({ copied: false });
    }, 2000);
  },

  copyCode: async (key, text) => {
    await navigator.clipboard.writeText(text);
    set({ copiedCodeKey: key });
    window.setTimeout(() => {
      if (get().copiedCodeKey === key) set({ copiedCodeKey: null });
    }, 2000);
  },
}));
