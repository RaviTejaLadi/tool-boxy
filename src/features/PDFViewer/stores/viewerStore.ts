import { create } from 'zustand';
import { MAX_SCALE, MIN_SCALE } from '../constants';

export interface ViewerState {
  file: File | null;
  numPages: number | null;
  pageNumber: number;
  scale: number;
  rotation: number;
  twoPageView: boolean;
  isDragging: boolean;
  isLoading: boolean;
  error: string | null;
  setFile: (file: File | null) => void;
  setNumPages: (numPages: number) => void;
  setPageNumber: (pageNumber: number) => void;
  setScale: (scale: number) => void;
  zoomIn: () => void;
  zoomOut: () => void;
  resetZoom: () => void;
  rotate: () => void;
  toggleTwoPageView: () => void;
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
  twoPageView: false,
  isDragging: false,
  isLoading: false,
  error: null,
  setFile: (file) =>
    set({
      file,
      numPages: null,
      pageNumber: 1,
      scale: 1,
      rotation: 0,
      twoPageView: false,
      error: null,
      isLoading: file != null,
    }),
  setNumPages: (numPages) => set({ numPages, isLoading: false, error: null }),
  setPageNumber: (pageNumber) => {
    const { numPages, twoPageView } = get();
    const max = numPages ?? 1;
    let next = Math.min(Math.max(pageNumber, 1), max);
    // Keep left page odd-aligned when browsing two-up (1-2, 3-4, …)
    if (twoPageView && next % 2 === 0) next = Math.max(next - 1, 1);
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
  toggleTwoPageView: () => {
    const { twoPageView, pageNumber } = get();
    const next = !twoPageView;
    // Snap to odd left page when enabling two-up
    const snapped = next && pageNumber % 2 === 0 ? Math.max(pageNumber - 1, 1) : pageNumber;
    set({ twoPageView: next, pageNumber: snapped });
  },
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
      twoPageView: false,
      isDragging: false,
      isLoading: false,
      error: null,
    }),
}));
