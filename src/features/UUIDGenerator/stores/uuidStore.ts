import { create } from 'zustand';
import { generateBulkUuids, generateUuidV4, generateUuidV7, type UuidVersion } from '../helpers';

export interface UuidState {
  activeVersion: UuidVersion;
  uuidV4: string;
  uuidV7: string;
  count: number;
  bulkUuids: string[];
  copied: boolean;
  setActiveVersion: (version: UuidVersion) => void;
  setCount: (count: number) => void;
  generateActive: () => void;
  generateV4: () => void;
  generateV7: () => void;
  generateBoth: () => void;
  generateBulk: (version: UuidVersion) => void;
  clearBulk: () => void;
  copyActive: () => Promise<void>;
  copyText: (text: string) => Promise<void>;
  copyAllBulk: () => Promise<void>;
  getActiveUuid: () => string;
}

export const useUuidStore = create<UuidState>((set, get) => ({
  activeVersion: 'v4',
  uuidV4: '',
  uuidV7: '',
  count: 1,
  bulkUuids: [],
  copied: false,

  setActiveVersion: (activeVersion) => set({ activeVersion }),

  setCount: (count) => set({ count: Math.min(100, Math.max(1, count)) }),

  generateV4: () => set({ uuidV4: generateUuidV4() }),

  generateV7: () => set({ uuidV7: generateUuidV7() }),

  generateBoth: () =>
    set({
      uuidV4: generateUuidV4(),
      uuidV7: generateUuidV7(),
    }),

  generateActive: () => {
    const { activeVersion } = get();
    if (activeVersion === 'v4') {
      set({ uuidV4: generateUuidV4() });
    } else {
      set({ uuidV7: generateUuidV7() });
    }
  },

  generateBulk: (version) => {
    const { count } = get();
    set({ bulkUuids: generateBulkUuids(version, count) });
  },

  clearBulk: () => set({ bulkUuids: [] }),

  getActiveUuid: () => {
    const { activeVersion, uuidV4, uuidV7 } = get();
    return activeVersion === 'v4' ? uuidV4 : uuidV7;
  },

  copyActive: async () => {
    const text = get().getActiveUuid();
    if (!text) return;
    await navigator.clipboard.writeText(text);
    set({ copied: true });
    setTimeout(() => set({ copied: false }), 2000);
  },

  copyText: async (text) => {
    await navigator.clipboard.writeText(text);
  },

  copyAllBulk: async () => {
    const { bulkUuids } = get();
    if (bulkUuids.length === 0) return;
    await navigator.clipboard.writeText(bulkUuids.join('\n'));
  },
}));
