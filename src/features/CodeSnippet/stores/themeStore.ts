import { create } from 'zustand';

export interface ThemeState {
  themeId: string;
  setThemeId: (themeId: string) => void;
}

export const useThemeStore = create<ThemeState>((set) => ({
  themeId: 'onedark',
  setThemeId: (themeId) => set({ themeId }),
}));
