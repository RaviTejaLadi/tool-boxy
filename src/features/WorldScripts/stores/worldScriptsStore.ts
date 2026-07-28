import { create } from 'zustand';
import { KIND_LABEL, LANGUAGES, SORTED_LANGUAGES, type Kind } from '../constants';
import { filterLanguages, type DirectionFilter, type KindFilter, type ScriptFilter } from '../helpers/filterLanguages';

export type CellSize = 'compact' | 'comfortable' | 'large';

export interface WorldScriptsState {
  selectedId: string;
  pickerOpen: boolean;
  browseScript: ScriptFilter;
  browseKind: KindFilter;
  browseDirection: DirectionFilter;
  symbolQuery: string;
  cellSize: CellSize;
  includeLowercase: boolean;
  sampleFontSize: number;
  exportFlash: string | null;

  setSelectedId: (id: string) => void;
  setPickerOpen: (open: boolean) => void;
  setBrowseScript: (script: ScriptFilter) => void;
  setBrowseKind: (kind: KindFilter) => void;
  setBrowseDirection: (direction: DirectionFilter) => void;
  resetBrowseFilters: () => void;
  setSymbolQuery: (query: string) => void;
  setCellSize: (size: CellSize) => void;
  setIncludeLowercase: (value: boolean) => void;
  setSampleFontSize: (size: number) => void;
  pickRandomLanguage: () => void;
  stepLanguage: (delta: -1 | 1) => void;
  flashExport: (tag: string) => void;
}

const browseDefaults = {
  browseScript: 'all' as ScriptFilter,
  browseKind: 'all' as KindFilter,
  browseDirection: 'all' as DirectionFilter,
};

let exportFlashTimeout: ReturnType<typeof setTimeout> | undefined;

export const useWorldScriptsStore = create<WorldScriptsState>((set, get) => ({
  selectedId: 'english',
  pickerOpen: false,
  ...browseDefaults,
  symbolQuery: '',
  cellSize: 'comfortable',
  includeLowercase: false,
  sampleFontSize: 22,
  exportFlash: null,

  setSelectedId: (selectedId) => set({ selectedId, pickerOpen: false, symbolQuery: '' }),

  setPickerOpen: (pickerOpen) => set({ pickerOpen }),

  setBrowseScript: (browseScript) => set({ browseScript }),

  setBrowseKind: (browseKind) => set({ browseKind }),

  setBrowseDirection: (browseDirection) => set({ browseDirection }),

  resetBrowseFilters: () => set({ ...browseDefaults }),

  setSymbolQuery: (symbolQuery) => set({ symbolQuery }),

  setCellSize: (cellSize) => set({ cellSize }),

  setIncludeLowercase: (includeLowercase) => set({ includeLowercase }),

  setSampleFontSize: (sampleFontSize) => set({ sampleFontSize: Math.min(48, Math.max(14, sampleFontSize)) }),

  pickRandomLanguage: () => {
    const pool = selectFilteredLanguages(get());
    const pick = pool[Math.floor(Math.random() * pool.length)];
    if (pick) set({ selectedId: pick.id, symbolQuery: '' });
  },

  stepLanguage: (delta) => {
    const pool = selectFilteredLanguages(get());
    if (pool.length === 0) return;
    const currentIndex = pool.findIndex((l) => l.id === get().selectedId);
    const index = currentIndex === -1 ? 0 : (currentIndex + delta + pool.length) % pool.length;
    set({ selectedId: pool[index].id, symbolQuery: '' });
  },

  flashExport: (tag) => {
    if (exportFlashTimeout) clearTimeout(exportFlashTimeout);
    set({ exportFlash: tag });
    exportFlashTimeout = setTimeout(() => set({ exportFlash: null }), 1500);
  },
}));

export function selectLanguage(selectedId: string) {
  return LANGUAGES.find((l) => l.id === selectedId) ?? LANGUAGES[0];
}

export function selectFilteredLanguages(
  state: Pick<WorldScriptsState, 'browseScript' | 'browseKind' | 'browseDirection'>
) {
  return filterLanguages(SORTED_LANGUAGES, {
    script: state.browseScript,
    kind: state.browseKind,
    direction: state.browseDirection,
  });
}

export const KIND_FILTER_OPTIONS: { value: KindFilter; label: string }[] = [
  { value: 'all', label: 'All types' },
  ...Object.entries(KIND_LABEL).map(([value, label]) => ({ value: value as Kind, label: label.split(' ')[0] })),
];
