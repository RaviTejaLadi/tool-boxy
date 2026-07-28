import { create } from 'zustand';
import { countText, formatStats, type TextStats } from '../helpers';

const DEFAULT_TEXT = 'lorem ipsum';

let copyTimeout: ReturnType<typeof setTimeout> | undefined;

export interface WordCounterState {
  text: string;
  stats: TextStats;
  copied: boolean;
  setText: (text: string) => void;
  clear: () => void;
  copyStats: () => Promise<void>;
}

export const useWordCounterStore = create<WordCounterState>((set, get) => ({
  text: DEFAULT_TEXT,
  stats: countText(DEFAULT_TEXT),
  copied: false,

  setText: (text) => set({ text, stats: countText(text), copied: false }),

  clear: () => set({ text: '', stats: countText(''), copied: false }),

  copyStats: async () => {
    const { stats } = get();
    const payload = formatStats(stats);

    try {
      await navigator.clipboard.writeText(payload);
    } catch {
      const el = document.createElement('textarea');
      el.value = payload;
      document.body.appendChild(el);
      el.select();
      document.execCommand('copy');
      document.body.removeChild(el);
    }

    if (copyTimeout) clearTimeout(copyTimeout);
    set({ copied: true });
    copyTimeout = setTimeout(() => set({ copied: false }), 2000);
  },
}));
