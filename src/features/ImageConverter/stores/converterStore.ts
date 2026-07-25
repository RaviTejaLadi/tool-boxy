import { create } from 'zustand';
import type { OutputFormatId, ResizeMode } from '../constants';

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

export interface ConvertedImage {
  id: string;
  sourceId: string;
  name: string;
  size: string;
  rawBytes: number;
  dataUrl: string;
  blob: Blob;
  width: number;
  height: number;
  formatId: OutputFormatId;
}

export interface ConverterState {
  images: SourceImage[];
  converted: ConvertedImage[];
  selectedId: string | null;
  formatId: OutputFormatId;
  resizeMode: ResizeMode;
  resizeWidth: number;
  resizeHeight: number;
  scalePercent: number;
  preserveTransparency: boolean;
  quality: number;
  isDragging: boolean;
  isConverting: boolean;
  addImages: (images: SourceImage[]) => void;
  removeImage: (id: string) => void;
  clearAll: () => void;
  selectImage: (id: string | null) => void;
  setFormatId: (formatId: OutputFormatId) => void;
  setResizeMode: (resizeMode: ResizeMode) => void;
  setResizeWidth: (resizeWidth: number) => void;
  setResizeHeight: (resizeHeight: number) => void;
  setScalePercent: (scalePercent: number) => void;
  setPreserveTransparency: (preserveTransparency: boolean) => void;
  setQuality: (quality: number) => void;
  setDragging: (isDragging: boolean) => void;
  setConverting: (isConverting: boolean) => void;
  setConverted: (converted: ConvertedImage[]) => void;
  clearConverted: () => void;
}

export const useConverterStore = create<ConverterState>((set) => ({
  images: [],
  converted: [],
  selectedId: null,
  formatId: 'png',
  resizeMode: 'original',
  resizeWidth: 800,
  resizeHeight: 600,
  scalePercent: 100,
  preserveTransparency: true,
  quality: 0.92,
  isDragging: false,
  isConverting: false,
  addImages: (images) =>
    set((s) => ({
      images: [...s.images, ...images],
      selectedId: images[0]?.id ?? s.selectedId,
      converted: [],
    })),
  removeImage: (id) =>
    set((s) => {
      const images = s.images.filter((img) => img.id !== id);
      const selectedId = s.selectedId === id ? images[0]?.id ?? null : s.selectedId;
      return {
        images,
        selectedId,
        converted: s.converted.filter((c) => c.sourceId !== id),
      };
    }),
  clearAll: () =>
    set({
      images: [],
      converted: [],
      selectedId: null,
      isConverting: false,
      isDragging: false,
    }),
  selectImage: (selectedId) => set({ selectedId }),
  setFormatId: (formatId) => set({ formatId, converted: [] }),
  setResizeMode: (resizeMode) => set({ resizeMode, converted: [] }),
  setResizeWidth: (resizeWidth) => set({ resizeWidth, converted: [] }),
  setResizeHeight: (resizeHeight) => set({ resizeHeight, converted: [] }),
  setScalePercent: (scalePercent) => set({ scalePercent, converted: [] }),
  setPreserveTransparency: (preserveTransparency) => set({ preserveTransparency, converted: [] }),
  setQuality: (quality) => set({ quality, converted: [] }),
  setDragging: (isDragging) => set({ isDragging }),
  setConverting: (isConverting) => set({ isConverting }),
  setConverted: (converted) => set({ converted }),
  clearConverted: () => set({ converted: [] }),
}));
