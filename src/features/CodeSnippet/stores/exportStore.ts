import { create } from 'zustand';

export interface ExportState {
  exportScale: number;
  frameWidth: number;
  frameHeight: number;
  setExportScale: (exportScale: number) => void;
  setFrameSize: (frameWidth: number, frameHeight: number) => void;
}

export const useExportStore = create<ExportState>((set) => ({
  exportScale: 2,
  frameWidth: 0,
  frameHeight: 0,
  setExportScale: (exportScale) => set({ exportScale }),
  setFrameSize: (frameWidth, frameHeight) => set({ frameWidth, frameHeight }),
}));
