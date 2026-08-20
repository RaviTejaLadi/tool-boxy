import { create } from 'zustand';
import {
  DEFAULT_CATEGORY_ID,
  DEFAULT_EXPORT_FORMAT,
  DEFAULT_FILTER_ID,
  DEFAULT_INTENSITY,
  DEFAULT_SETTINGS,
  type ExportFormat,
  type FilterCategoryId,
  type FilterSettings,
} from '../constants';

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

export interface FilterState {
  source: SourceImage | null;
  selectedFilterId: string;
  categoryId: FilterCategoryId | 'all';
  intensity: number;
  settings: FilterSettings;
  exportFormat: ExportFormat;
  isDragging: boolean;
  isExporting: boolean;
  setSource: (source: SourceImage | null) => void;
  clearAll: () => void;
  setSelectedFilterId: (selectedFilterId: string) => void;
  setCategoryId: (categoryId: FilterCategoryId | 'all') => void;
  setIntensity: (intensity: number) => void;
  setSetting: <K extends keyof FilterSettings>(key: K, value: FilterSettings[K]) => void;
  resetSettings: () => void;
  setExportFormat: (exportFormat: ExportFormat) => void;
  setDragging: (isDragging: boolean) => void;
  setExporting: (isExporting: boolean) => void;
}

export const useFilterStore = create<FilterState>((set) => ({
  source: null,
  selectedFilterId: DEFAULT_FILTER_ID,
  categoryId: DEFAULT_CATEGORY_ID,
  intensity: DEFAULT_INTENSITY,
  settings: { ...DEFAULT_SETTINGS },
  exportFormat: DEFAULT_EXPORT_FORMAT,
  isDragging: false,
  isExporting: false,
  setSource: (source) =>
    set({
      source,
      selectedFilterId: DEFAULT_FILTER_ID,
      intensity: DEFAULT_INTENSITY,
      settings: { ...DEFAULT_SETTINGS },
      isExporting: false,
    }),
  clearAll: () =>
    set({
      source: null,
      selectedFilterId: DEFAULT_FILTER_ID,
      categoryId: DEFAULT_CATEGORY_ID,
      intensity: DEFAULT_INTENSITY,
      settings: { ...DEFAULT_SETTINGS },
      exportFormat: DEFAULT_EXPORT_FORMAT,
      isDragging: false,
      isExporting: false,
    }),
  setSelectedFilterId: (selectedFilterId) => set({ selectedFilterId }),
  setCategoryId: (categoryId) => set({ categoryId }),
  setIntensity: (intensity) => set({ intensity }),
  setSetting: (key, value) => set((state) => ({ settings: { ...state.settings, [key]: value } })),
  resetSettings: () => set({ settings: { ...DEFAULT_SETTINGS }, intensity: DEFAULT_INTENSITY }),
  setExportFormat: (exportFormat) => set({ exportFormat }),
  setDragging: (isDragging) => set({ isDragging }),
  setExporting: (isExporting) => set({ isExporting }),
}));
