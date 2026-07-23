import { create } from 'zustand';

export interface WindowState {
  showTitleBar: boolean;
  showWindowControls: boolean;
  showLineNumbers: boolean;
  showShadow: boolean;
  cornerRadius: number;
  fontSize: number;
  framePadding: number;
  setShowTitleBar: (showTitleBar: boolean) => void;
  setShowWindowControls: (showWindowControls: boolean) => void;
  setShowLineNumbers: (showLineNumbers: boolean) => void;
  setShowShadow: (showShadow: boolean) => void;
  setCornerRadius: (cornerRadius: number) => void;
  setFontSize: (fontSize: number) => void;
  setFramePadding: (framePadding: number) => void;
}

export const useWindowStore = create<WindowState>((set) => ({
  showTitleBar: true,
  showWindowControls: true,
  showLineNumbers: false,
  showShadow: true,
  cornerRadius: 14,
  fontSize: 14,
  framePadding: 64,
  setShowTitleBar: (showTitleBar) => set({ showTitleBar }),
  setShowWindowControls: (showWindowControls) => set({ showWindowControls }),
  setShowLineNumbers: (showLineNumbers) => set({ showLineNumbers }),
  setShowShadow: (showShadow) => set({ showShadow }),
  setCornerRadius: (cornerRadius) => set({ cornerRadius }),
  setFontSize: (fontSize) => set({ fontSize }),
  setFramePadding: (framePadding) => set({ framePadding }),
}));
