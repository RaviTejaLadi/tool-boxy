import { create } from 'zustand';
import { SAMPLE_CODE } from '../constants';

export interface CodeState {
  code: string;
  langId: string;
  title: string;
  setCode: (code: string) => void;
  setLangId: (langId: string) => void;
  setTitle: (title: string) => void;
}

export const useCodeStore = create<CodeState>((set) => ({
  code: SAMPLE_CODE,
  langId: 'tsx',
  title: 'Untitled-1',
  setCode: (code) => set({ code }),
  setLangId: (langId) => set({ langId }),
  setTitle: (title) => set({ title }),
}));
