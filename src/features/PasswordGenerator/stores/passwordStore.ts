import { create } from 'zustand';
import { calculateStrength, generatePassword } from '../helpers';

export interface PasswordState {
  password: string;
  length: number;
  includeUppercase: boolean;
  includeLowercase: boolean;
  includeNumbers: boolean;
  includeSymbols: boolean;
  excludeAmbiguous: boolean;
  strength: number;
  copied: boolean;
  generate: (nextLength?: number) => void;
  setLength: (length: number) => void;
  commitLength: (length: number) => void;
  setLengthAndGenerate: (length: number) => void;
  setIncludeUppercase: (value: boolean) => void;
  setIncludeLowercase: (value: boolean) => void;
  setIncludeNumbers: (value: boolean) => void;
  setIncludeSymbols: (value: boolean) => void;
  setExcludeAmbiguous: (value: boolean) => void;
  copyToClipboard: () => Promise<void>;
}

export const usePasswordStore = create<PasswordState>((set, get) => ({
  password: '',
  length: 16,
  includeUppercase: true,
  includeLowercase: true,
  includeNumbers: true,
  includeSymbols: true,
  excludeAmbiguous: false,
  strength: 0,
  copied: false,

  generate: (nextLength) => {
    const state = get();
    const length = nextLength ?? state.length;
    const password = generatePassword({
      length,
      includeUppercase: state.includeUppercase,
      includeLowercase: state.includeLowercase,
      includeNumbers: state.includeNumbers,
      includeSymbols: state.includeSymbols,
      excludeAmbiguous: state.excludeAmbiguous,
    });
    set({
      password,
      length,
      strength: password ? calculateStrength(password) : 0,
      copied: false,
    });
  },

  setLength: (length) => set({ length }),

  commitLength: (length) => {
    set({ length });
    get().generate(length);
  },

  setLengthAndGenerate: (length) => {
    set({ length });
    get().generate(length);
  },

  setIncludeUppercase: (includeUppercase) => {
    set({ includeUppercase });
    get().generate();
  },

  setIncludeLowercase: (includeLowercase) => {
    set({ includeLowercase });
    get().generate();
  },

  setIncludeNumbers: (includeNumbers) => {
    set({ includeNumbers });
    get().generate();
  },

  setIncludeSymbols: (includeSymbols) => {
    set({ includeSymbols });
    get().generate();
  },

  setExcludeAmbiguous: (excludeAmbiguous) => {
    set({ excludeAmbiguous });
    get().generate();
  },

  copyToClipboard: async () => {
    const { password } = get();
    if (!password) return;
    try {
      await navigator.clipboard.writeText(password);
      set({ copied: true });
      window.setTimeout(() => {
        set({ copied: false });
      }, 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  },
}));
