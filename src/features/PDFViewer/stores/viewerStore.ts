import { create } from 'zustand';
import { MAX_SCALE, MIN_SCALE } from '../constants';

export interface ViewerState {
  file: File | null;
  numPages: number | null;
  pageNumber: number;
  scale: number;
  rotation: number;
  pagesPerRow: 1 | 2 | 3;
  isDragging: boolean;
  isLoading: boolean;
  error: string | null;
  setFile: (file: File | null) => void;
  replaceFile: (file: File | null) => void;
  setNumPages: (numPages: number) => void;
  setPageNumber: (pageNumber: number) => void;
  setScale: (scale: number) => void;
  zoomIn: () => void;
  zoomOut: () => void;
  resetZoom: () => void;
  rotate: () => void;
  setPagesPerRow: (pagesPerRow: 1 | 2 | 3) => void;
  setDragging: (isDragging: boolean) => void;
  setLoading: (isLoading: boolean) => void;
  setError: (error: string | null) => void;
  clearAll: () => void;
}

export const useViewerStore = create<ViewerState>((set, get) => ({
  file: null,
  numPages: null,
  pageNumber: 1,
  scale: 1,
  rotation: 0,
  pagesPerRow: 1,
  isDragging: false,
  isLoading: false,
  error: null,
  setFile: (file) =>
    set((state) => ({
      file,
      numPages: null,
      pageNumber: 1,
      scale: 1,
      rotation: 0,
      pagesPerRow: state.pagesPerRow,
      error: null,
      isLoading: file != null,
    })),
  replaceFile: (file) =>
    set((state) => ({
      file,
      numPages: null,
      pageNumber: file ? state.pageNumber : 1,
      scale: state.scale,
      rotation: state.rotation,
      pagesPerRow: state.pagesPerRow,
      error: null,
      isLoading: file != null,
    })),
  setNumPages: (numPages) => set({ numPages, isLoading: false, error: null }),
  setPageNumber: (pageNumber) => {
    const { numPages } = get();
    const max = numPages ?? 1;
    const next = Math.min(Math.max(pageNumber, 1), max);
    set({ pageNumber: next });
  },
  setScale: (scale) => set({ scale: Math.min(Math.max(scale, MIN_SCALE), MAX_SCALE) }),
  zoomIn: () => {
    const { scale } = get();
    set({ scale: Math.min(scale + 0.1, MAX_SCALE) });
  },
  zoomOut: () => {
    const { scale } = get();
    set({ scale: Math.max(scale - 0.1, MIN_SCALE) });
  },
  resetZoom: () => set({ scale: 1 }),
  rotate: () => set({ rotation: (get().rotation + 90) % 360 }),
  setPagesPerRow: (pagesPerRow) => set({ pagesPerRow }),
  setDragging: (isDragging) => set({ isDragging }),
  setLoading: (isLoading) => set({ isLoading }),
  setError: (error) => set({ error, isLoading: false }),
  clearAll: () =>
    set({
      file: null,
      numPages: null,
      pageNumber: 1,
      scale: 1,
      rotation: 0,
      pagesPerRow: 1,
      isDragging: false,
      isLoading: false,
      error: null,
    }),
}));
