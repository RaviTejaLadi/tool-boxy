import { create } from 'zustand';
import { DEFAULT_WIDTH } from '../constants';

export interface AsciiState {
  imageSrc: string | null;
  fileName: string;
  asciiArt: string;
  width: number;
  isDragging: boolean;
  isGenerating: boolean;
  error: string | null;
  setSource: (imageSrc: string, fileName: string) => void;
  setAsciiArt: (asciiArt: string) => void;
  setWidth: (width: number) => void;
  setDragging: (isDragging: boolean) => void;
  setGenerating: (isGenerating: boolean) => void;
  setError: (error: string | null) => void;
  clear: () => void;
}

export const useAsciiStore = create<AsciiState>((set) => ({
  imageSrc: null,
  fileName: '',
  asciiArt: '',
  width: DEFAULT_WIDTH,
  isDragging: false,
  isGenerating: false,
  error: null,

  setSource: (imageSrc, fileName) => set({ imageSrc, fileName, asciiArt: '', error: null }),

  setAsciiArt: (asciiArt) => set({ asciiArt }),

  setWidth: (width) => set({ width }),

  setDragging: (isDragging) => set({ isDragging }),

  setGenerating: (isGenerating) => set({ isGenerating }),

  setError: (error) => set({ error }),

  clear: () =>
    set({
      imageSrc: null,
      fileName: '',
      asciiArt: '',
      width: DEFAULT_WIDTH,
      isDragging: false,
      isGenerating: false,
      error: null,
    }),
}));
