import { create } from 'zustand';

export interface BackgroundState {
  bgId: string;
  customColor: string;
  setBgId: (bgId: string) => void;
  setCustomColor: (customColor: string) => void;
}

export const useBackgroundStore = create<BackgroundState>((set) => ({
  bgId: 'violet',
  customColor: '#8b5cf6',
  setBgId: (bgId) => set({ bgId }),
  setCustomColor: (customColor) => set({ customColor }),
}));
