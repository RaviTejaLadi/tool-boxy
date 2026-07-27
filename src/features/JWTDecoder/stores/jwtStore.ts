import { create } from 'zustand';
import { decodeJwt, formatPart, type DecodedJwt, type JwtPart } from '../helpers';

export interface JwtState {
  jwtInput: string;
  decodedData: DecodedJwt | null;
  error: string;
  activePart: JwtPart;
  copied: boolean;
  setJwtInput: (value: string) => void;
  setActivePart: (part: JwtPart) => void;
  copyActivePart: () => void;
  clear: () => void;
}

export const useJwtStore = create<JwtState>((set, get) => ({
  jwtInput: '',
  decodedData: null,
  error: '',
  activePart: 'payload',
  copied: false,

  setJwtInput: (jwtInput) => {
    const { data, error } = decodeJwt(jwtInput);
    set({ jwtInput, decodedData: data, error });
  },

  setActivePart: (activePart) => set({ activePart }),

  copyActivePart: () => {
    const { decodedData, activePart } = get();
    if (!decodedData) return;
    const text = formatPart(decodedData, activePart);
    void navigator.clipboard.writeText(text).then(() => {
      set({ copied: true });
      setTimeout(() => set({ copied: false }), 2000);
    });
  },

  clear: () =>
    set({
      jwtInput: '',
      decodedData: null,
      error: '',
      activePart: 'payload',
      copied: false,
    }),
}));
