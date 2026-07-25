import { create } from 'zustand';
import type { FaviconType } from '../constants';

export interface GeneratedFavicon {
  id: string;
  size: number;
  label: string;
  type: FaviconType;
  fileName: string;
  dataUrl: string;
}

export interface FaviconState {
  image: string | null;
  fileName: string;
  favicons: GeneratedFavicon[];
  selectedId: string | null;
  isGenerating: boolean;
  isDragging: boolean;
  setSource: (image: string, fileName: string) => void;
  setFavicons: (favicons: GeneratedFavicon[]) => void;
  setGenerating: (isGenerating: boolean) => void;
  setDragging: (isDragging: boolean) => void;
  selectFavicon: (id: string | null) => void;
  clear: () => void;
}

export const useFaviconStore = create<FaviconState>((set) => ({
  image: null,
  fileName: '',
  favicons: [],
  selectedId: null,
  isGenerating: false,
  isDragging: false,
  setSource: (image, fileName) => set({ image, fileName, favicons: [], selectedId: null }),
  setFavicons: (favicons) =>
    set({
      favicons,
      selectedId: favicons[0]?.id ?? null,
    }),
  setGenerating: (isGenerating) => set({ isGenerating }),
  setDragging: (isDragging) => set({ isDragging }),
  selectFavicon: (selectedId) => set({ selectedId }),
  clear: () =>
    set({
      image: null,
      fileName: '',
      favicons: [],
      selectedId: null,
      isGenerating: false,
      isDragging: false,
    }),
}));
