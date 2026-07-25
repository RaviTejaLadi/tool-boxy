import { create } from 'zustand';

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

export interface Tile {
  id: number;
  dataUrl: string;
  blob: Blob;
  name: string;
  row: number;
  col: number;
  width: number;
  height: number;
}

export interface SplitterState {
  source: SourceImage | null;
  columns: number;
  rows: number;
  tiles: Tile[];
  selectedTileId: number | null;
  isDragging: boolean;
  isProcessing: boolean;
  setSource: (source: SourceImage | null) => void;
  clearAll: () => void;
  setColumns: (columns: number) => void;
  setRows: (rows: number) => void;
  setTiles: (tiles: Tile[]) => void;
  clearTiles: () => void;
  selectTile: (id: number | null) => void;
  setDragging: (isDragging: boolean) => void;
  setProcessing: (isProcessing: boolean) => void;
}

export const useSplitterStore = create<SplitterState>((set) => ({
  source: null,
  columns: 3,
  rows: 3,
  tiles: [],
  selectedTileId: null,
  isDragging: false,
  isProcessing: false,
  setSource: (source) =>
    set({
      source,
      tiles: [],
      selectedTileId: null,
      isProcessing: false,
    }),
  clearAll: () =>
    set({
      source: null,
      tiles: [],
      selectedTileId: null,
      isProcessing: false,
      isDragging: false,
    }),
  setColumns: (columns) => set({ columns, tiles: [], selectedTileId: null }),
  setRows: (rows) => set({ rows, tiles: [], selectedTileId: null }),
  setTiles: (tiles) =>
    set({
      tiles,
      selectedTileId: tiles[0]?.id ?? null,
    }),
  clearTiles: () => set({ tiles: [], selectedTileId: null }),
  selectTile: (selectedTileId) => set({ selectedTileId }),
  setDragging: (isDragging) => set({ isDragging }),
  setProcessing: (isProcessing) => set({ isProcessing }),
}));
