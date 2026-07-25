import { create } from 'zustand';

export interface PlaceholderState {
  width: number;
  height: number;
  customText: string;
  bgColor: string;
  textColor: string;
  setWidth: (width: number) => void;
  setHeight: (height: number) => void;
  setCustomText: (customText: string) => void;
  setBgColor: (bgColor: string) => void;
  setTextColor: (textColor: string) => void;
  applyPreset: (width: number, height: number) => void;
}

export const usePlaceholderStore = create<PlaceholderState>((set) => ({
  width: 300,
  height: 200,
  customText: '300 × 200',
  bgColor: '#e2e2e2',
  textColor: '#666666',
  setWidth: (width) => set((s) => ({ width, customText: `${width} × ${s.height}` })),
  setHeight: (height) => set((s) => ({ height, customText: `${s.width} × ${height}` })),
  setCustomText: (customText) => set({ customText }),
  setBgColor: (bgColor) => set({ bgColor }),
  setTextColor: (textColor) => set({ textColor }),
  applyPreset: (width, height) => set({ width, height, customText: `${width} × ${height}` }),
}));
