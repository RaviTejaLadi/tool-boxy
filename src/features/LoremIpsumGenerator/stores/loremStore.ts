import { create } from 'zustand';
import { DEFAULT_FORMAT, DEFAULT_PARAGRAPH_COUNT, type OutputFormat } from '../constants';
import { generateLorem } from '../helpers';

export interface LoremState {
  paragraphCount: number;
  format: OutputFormat;
  generatedText: string;
  copied: boolean;
  setParagraphCount: (count: number) => void;
  setFormat: (format: OutputFormat) => void;
  generate: () => void;
  copy: () => Promise<void>;
}

export const useLoremStore = create<LoremState>((set, get) => ({
  paragraphCount: DEFAULT_PARAGRAPH_COUNT,
  format: DEFAULT_FORMAT,
  generatedText: generateLorem(DEFAULT_PARAGRAPH_COUNT, DEFAULT_FORMAT),
  copied: false,

  setParagraphCount: (paragraphCount) => {
    const { format } = get();
    set({ paragraphCount, generatedText: generateLorem(paragraphCount, format) });
  },

  setFormat: (format) => {
    const { paragraphCount } = get();
    set({ format, generatedText: generateLorem(paragraphCount, format) });
  },

  generate: () => {
    const { paragraphCount, format } = get();
    set({ generatedText: generateLorem(paragraphCount, format), copied: false });
  },

  copy: async () => {
    const { generatedText } = get();
    if (!generatedText) return;

    try {
      await navigator.clipboard.writeText(generatedText);
    } catch {
      const el = document.createElement('textarea');
      el.value = generatedText;
      document.body.appendChild(el);
      el.select();
      document.execCommand('copy');
      document.body.removeChild(el);
    }

    set({ copied: true });
    setTimeout(() => set({ copied: false }), 2000);
  },
}));
