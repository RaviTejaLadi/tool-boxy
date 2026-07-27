import { create } from 'zustand';

export interface QrState {
  text: string;
  fgColor: string;
  bgColor: string;
  copied: boolean;
  setText: (text: string) => void;
  setFgColor: (fgColor: string) => void;
  setBgColor: (bgColor: string) => void;
  copyText: () => Promise<void>;
}

export const useQrStore = create<QrState>((set, get) => ({
  text: 'https://example.com',
  fgColor: '#000000',
  bgColor: '#ffffff',
  copied: false,

  setText: (text) => set({ text }),
  setFgColor: (fgColor) => set({ fgColor }),
  setBgColor: (bgColor) => set({ bgColor }),

  copyText: async () => {
    const { text } = get();
    if (!text) return;
    await navigator.clipboard.writeText(text);
    set({ copied: true });
    setTimeout(() => set({ copied: false }), 2000);
  },
}));
