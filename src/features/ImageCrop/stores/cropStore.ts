import { create } from 'zustand';
import { ASPECT_RATIOS, DEFAULT_ZOOM, type AspectRatioId } from '../constants';
import type { CroppedImage } from '../helpers';

export interface SourceImage {
  id: string;
  name: string;
  size: string;
  rawBytes: number;
  dataUrl: string;
  width: number;
  height: number;
  mimeType: string;
}

export interface CropArea {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface CropState {
  source: SourceImage | null;
  cropArea: CropArea | null;
  displaySize: { width: number; height: number };
  zoom: number;
  aspectRatioId: AspectRatioId;
  cropped: CroppedImage | null;
  isDragging: boolean;
  isProcessing: boolean;
  setSource: (source: SourceImage | null) => void;
  clearAll: () => void;
  setCropArea: (cropArea: CropArea | null) => void;
  setDisplaySize: (displaySize: { width: number; height: number }) => void;
  setZoom: (zoom: number) => void;
  setAspectRatioId: (aspectRatioId: AspectRatioId) => void;
  setCropped: (cropped: CroppedImage | null) => void;
  setDragging: (isDragging: boolean) => void;
  setProcessing: (isProcessing: boolean) => void;
  getAspectRatio: () => number | null;
}

export const useCropStore = create<CropState>((set, get) => ({
  source: null,
  cropArea: null,
  displaySize: { width: 0, height: 0 },
  zoom: DEFAULT_ZOOM,
  aspectRatioId: 'free',
  cropped: null,
  isDragging: false,
  isProcessing: false,
  setSource: (source) =>
    set({
      source,
      cropArea: null,
      displaySize: { width: 0, height: 0 },
      zoom: DEFAULT_ZOOM,
      cropped: null,
      isProcessing: false,
    }),
  clearAll: () =>
    set({
      source: null,
      cropArea: null,
      displaySize: { width: 0, height: 0 },
      zoom: DEFAULT_ZOOM,
      aspectRatioId: 'free',
      cropped: null,
      isProcessing: false,
      isDragging: false,
    }),
  setCropArea: (cropArea) => set({ cropArea, cropped: null }),
  setDisplaySize: (displaySize) => set({ displaySize }),
  setZoom: (zoom) => set({ zoom }),
  setAspectRatioId: (aspectRatioId) => set({ aspectRatioId, cropped: null }),
  setCropped: (cropped) => set({ cropped }),
  setDragging: (isDragging) => set({ isDragging }),
  setProcessing: (isProcessing) => set({ isProcessing }),
  getAspectRatio: () => ASPECT_RATIOS.find((r) => r.id === get().aspectRatioId)?.value ?? null,
}));
