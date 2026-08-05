import { create } from 'zustand';
import { DEFAULT_ROWS_PER_PAGE } from '../constants';
import type { CsvRow } from '../helpers';

export type SortDirection = 'asc' | 'desc' | '';

export interface SortConfig {
  key: string;
  direction: SortDirection;
}

export interface CsvState {
  data: CsvRow[];
  headers: string[];
  fileName: string;
  currentPage: number;
  rowsPerPage: number;
  searchTerm: string;
  searchColumn: string;
  sortConfig: SortConfig;
  filters: Record<string, string>;
  error: string | null;
  isDragging: boolean;
  setParsed: (payload: { headers: string[]; data: CsvRow[]; fileName: string }) => void;
  setError: (error: string | null) => void;
  setDragging: (isDragging: boolean) => void;
  setCurrentPage: (page: number) => void;
  setRowsPerPage: (rowsPerPage: number) => void;
  setSearchTerm: (searchTerm: string) => void;
  setSearchColumn: (searchColumn: string) => void;
  setSortConfig: (sortConfig: SortConfig) => void;
  toggleSort: (key: string) => void;
  setFilter: (column: string, value: string) => void;
  clearFilters: () => void;
  clearAll: () => void;
}

export const useCsvStore = create<CsvState>((set, get) => ({
  data: [],
  headers: [],
  fileName: '',
  currentPage: 1,
  rowsPerPage: DEFAULT_ROWS_PER_PAGE,
  searchTerm: '',
  searchColumn: 'all',
  sortConfig: { key: '', direction: '' },
  filters: {},
  error: null,
  isDragging: false,

  setParsed: ({ headers, data, fileName }) =>
    set({
      headers,
      data,
      fileName,
      currentPage: 1,
      filters: {},
      searchTerm: '',
      searchColumn: 'all',
      sortConfig: { key: '', direction: '' },
      error: null,
    }),

  setError: (error) => set({ error }),
  setDragging: (isDragging) => set({ isDragging }),
  setCurrentPage: (currentPage) => set({ currentPage }),
  setRowsPerPage: (rowsPerPage) => set({ rowsPerPage, currentPage: 1 }),
  setSearchTerm: (searchTerm) => set({ searchTerm, currentPage: 1 }),
  setSearchColumn: (searchColumn) => set({ searchColumn }),
  setSortConfig: (sortConfig) => set({ sortConfig }),

  toggleSort: (key) => {
    const { sortConfig } = get();
    set({
      sortConfig: {
        key,
        direction: sortConfig.key === key && sortConfig.direction === 'asc' ? 'desc' : 'asc',
      },
    });
  },

  setFilter: (column, value) =>
    set((state) => ({
      filters: { ...state.filters, [column]: value },
      currentPage: 1,
    })),

  clearFilters: () =>
    set({
      filters: {},
      searchTerm: '',
      searchColumn: 'all',
      currentPage: 1,
    }),

  clearAll: () =>
    set({
      data: [],
      headers: [],
      fileName: '',
      currentPage: 1,
      rowsPerPage: DEFAULT_ROWS_PER_PAGE,
      searchTerm: '',
      searchColumn: 'all',
      sortConfig: { key: '', direction: '' },
      filters: {},
      error: null,
      isDragging: false,
    }),
}));
