import { create } from 'zustand';
import {
  DEFAULT_BLEND_MODE,
  DEFAULT_FORMAT_ID,
  DEFAULT_OBJECT_FIT,
  DEFAULT_OPACITY,
  DEFAULT_ROTATION,
  DEFAULT_SCALE,
  MAX_OPACITY,
  MAX_SCALE,
  MIN_OPACITY,
  MIN_SCALE,
  type BlendMode,
  type ObjectFitMode,
  type OutputFormatId,
  type RotationDeg,
} from '../constants';

export interface StitchImage {
  id: string;
  name: string;
  size: string;
  rawBytes: number;
  dataUrl: string;
  width: number;
  height: number;
  mimeType: string;
  /** Relative size in the composition (1 = 100%). */
  scale: number;
  fit: ObjectFitMode;
  blendMode: BlendMode;
  opacity: number;
  rotation: RotationDeg;
  flipX: boolean;
  flipY: boolean;
}

export type ImagePropPatch = Partial<
  Pick<StitchImage, 'scale' | 'fit' | 'blendMode' | 'opacity' | 'rotation' | 'flipX' | 'flipY'>
>;

function clampScale(scale: number): number {
  return Math.min(MAX_SCALE, Math.max(MIN_SCALE, Math.round(scale * 100) / 100));
}

function clampOpacity(opacity: number): number {
  return Math.min(MAX_OPACITY, Math.max(MIN_OPACITY, Math.round(opacity * 100) / 100));
}

function withDefaults(img: StitchImage): StitchImage {
  return {
    ...img,
    scale: img.scale ?? DEFAULT_SCALE,
    fit: img.fit ?? DEFAULT_OBJECT_FIT,
    blendMode: img.blendMode ?? DEFAULT_BLEND_MODE,
    opacity: img.opacity ?? DEFAULT_OPACITY,
    rotation: img.rotation ?? DEFAULT_ROTATION,
    flipX: img.flipX ?? false,
    flipY: img.flipY ?? false,
  };
}

export interface StitcherState {
  images: StitchImage[];
  formatId: OutputFormatId;
  selectedImageId: string | null;
  isFileDragging: boolean;
  error: string | null;
  addImages: (images: StitchImage[]) => void;
  removeImage: (id: string) => void;
  clearAll: () => void;
  setImageScale: (id: string, scale: number) => void;
  updateImageProps: (id: string, patch: ImagePropPatch) => void;
  resetImageProps: (id: string) => void;
  moveImage: (fromIndex: number, toIndex: number) => void;
  swapImages: (fromIndex: number, toIndex: number) => void;
  setFormatId: (formatId: OutputFormatId) => void;
  selectImage: (id: string | null) => void;
  setFileDragging: (isFileDragging: boolean) => void;
  setError: (error: string | null) => void;
}

export const useStitcherStore = create<StitcherState>((set) => ({
  images: [],
  formatId: DEFAULT_FORMAT_ID,
  selectedImageId: null,
  isFileDragging: false,
  error: null,

  addImages: (images) =>
    set((state) => {
      const next = images.map(withDefaults);
      return {
        images: [...state.images, ...next],
        selectedImageId: next[next.length - 1]?.id ?? state.selectedImageId,
        error: null,
      };
    }),

  removeImage: (id) =>
    set((state) => {
      const images = state.images.filter((img) => img.id !== id);
      return {
        images,
        selectedImageId: state.selectedImageId === id ? images[0]?.id ?? null : state.selectedImageId,
      };
    }),

  clearAll: () =>
    set({
      images: [],
      selectedImageId: null,
      isFileDragging: false,
      error: null,
    }),

  setImageScale: (id, scale) =>
    set((state) => ({
      images: state.images.map((img) => (img.id === id ? { ...img, scale: clampScale(scale) } : img)),
    })),

  updateImageProps: (id, patch) =>
    set((state) => ({
      images: state.images.map((img) => {
        if (img.id !== id) return img;
        return {
          ...img,
          ...patch,
          scale: patch.scale != null ? clampScale(patch.scale) : img.scale,
          opacity: patch.opacity != null ? clampOpacity(patch.opacity) : img.opacity,
        };
      }),
    })),

  resetImageProps: (id) =>
    set((state) => ({
      images: state.images.map((img) =>
        img.id === id
          ? {
              ...img,
              scale: DEFAULT_SCALE,
              fit: DEFAULT_OBJECT_FIT,
              blendMode: DEFAULT_BLEND_MODE,
              opacity: DEFAULT_OPACITY,
              rotation: DEFAULT_ROTATION,
              flipX: false,
              flipY: false,
            }
          : img
      ),
    })),

  moveImage: (fromIndex, toIndex) =>
    set((state) => {
      if (
        fromIndex === toIndex ||
        fromIndex < 0 ||
        toIndex < 0 ||
        fromIndex >= state.images.length ||
        toIndex >= state.images.length
      ) {
        return state;
      }
      const images = [...state.images];
      const [item] = images.splice(fromIndex, 1);
      images.splice(toIndex, 0, item);
      return { images };
    }),

  swapImages: (fromIndex, toIndex) =>
    set((state) => {
      if (
        fromIndex === toIndex ||
        fromIndex < 0 ||
        toIndex < 0 ||
        fromIndex >= state.images.length ||
        toIndex >= state.images.length
      ) {
        return state;
      }
      const images = [...state.images];
      const tmp = images[fromIndex];
      images[fromIndex] = images[toIndex];
      images[toIndex] = tmp;
      return { images };
    }),

  setFormatId: (formatId) => set({ formatId }),
  selectImage: (selectedImageId) => set({ selectedImageId }),
  setFileDragging: (isFileDragging) => set({ isFileDragging }),
  setError: (error) => set({ error }),
}));
