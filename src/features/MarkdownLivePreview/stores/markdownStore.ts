import { create } from 'zustand';
import { SAMPLE_MARKDOWN } from '../constants';

export interface MarkdownState {
  markdown: string;
  copied: boolean;
  setMarkdown: (markdown: string) => void;
  resetMarkdown: () => void;
  copyMarkdown: () => Promise<void>;
}

export const useMarkdownStore = create<MarkdownState>((set, get) => ({
  markdown: SAMPLE_MARKDOWN,
  copied: false,

  setMarkdown: (markdown) => set({ markdown }),

  resetMarkdown: () => set({ markdown: SAMPLE_MARKDOWN }),

  copyMarkdown: async () => {
    await navigator.clipboard.writeText(get().markdown);
    set({ copied: true });
    window.setTimeout(() => {
      if (get().copied) set({ copied: false });
    }, 2000);
  },
}));
