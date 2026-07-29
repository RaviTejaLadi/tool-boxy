import { create } from 'zustand';
import { BLOCKS, DEFAULT_BLOCK_ID } from '../constants';
import { filterGlyphs, resolveBlock } from '../helpers';

export type CellSize = 'compact' | 'comfortable' | 'large';

export interface GlyphBrowserState {
  blockId: string;
  query: string;
  cellSize: CellSize;

  setBlockId: (blockId: string) => void;
  setQuery: (query: string) => void;
  setCellSize: (size: CellSize) => void;
  pickRandomBlock: () => void;
  stepBlock: (delta: -1 | 1) => void;
}

export function selectBlock(blockId: string) {
  return BLOCKS.find((b) => b.id === blockId) ?? BLOCKS[0];
}

export function selectFilteredGlyphs(state: Pick<GlyphBrowserState, 'blockId' | 'query'>) {
  const block = selectBlock(state.blockId);
  return filterGlyphs(resolveBlock(block), state.query);
}

export const useGlyphBrowserStore = create<GlyphBrowserState>((set, get) => ({
  blockId: DEFAULT_BLOCK_ID,
  query: '',
  cellSize: 'compact',

  setBlockId: (blockId) => set({ blockId, query: '' }),

  setQuery: (query) => set({ query }),

  setCellSize: (cellSize) => set({ cellSize }),

  pickRandomBlock: () => {
    const pick = BLOCKS[Math.floor(Math.random() * BLOCKS.length)];
    if (pick) set({ blockId: pick.id, query: '' });
  },

  stepBlock: (delta) => {
    const { blockId } = get();
    const index = BLOCKS.findIndex((b) => b.id === blockId);
    const next = BLOCKS[(index + delta + BLOCKS.length) % BLOCKS.length];
    if (next) set({ blockId: next.id, query: '' });
  },
}));
