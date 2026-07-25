import { create } from 'zustand';

export interface EncodedImage {
  id: string;
  name: string;
  size: string;
  rawBytes: number;
  dataUri: string;
  base64: string;
  mimeType: string;
}

export interface EncoderState {
  images: EncodedImage[];
  selectedId: string | null;
  isDragging: boolean;
  addImages: (images: EncodedImage[]) => void;
  removeImage: (id: string) => void;
  clearAll: () => void;
  selectImage: (id: string | null) => void;
  setDragging: (isDragging: boolean) => void;
}

export const useEncoderStore = create<EncoderState>((set) => ({
  images: [],
  selectedId: null,
  isDragging: false,
  addImages: (images) =>
    set((s) => ({
      images: [...s.images, ...images],
      selectedId: images[0]?.id ?? s.selectedId,
    })),
  removeImage: (id) =>
    set((s) => {
      const images = s.images.filter((img) => img.id !== id);
      const selectedId = s.selectedId === id ? images[0]?.id ?? null : s.selectedId;
      return { images, selectedId };
    }),
  clearAll: () => set({ images: [], selectedId: null }),
  selectImage: (selectedId) => set({ selectedId }),
  setDragging: (isDragging) => set({ isDragging }),
}));
