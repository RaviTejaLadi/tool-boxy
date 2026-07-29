import { create } from 'zustand';
import { buildFlexboxCss } from '../helpers';

export interface FlexboxPlaygroundState {
  flexDirection: string;
  flexWrap: string;
  justifyContent: string;
  alignItems: string;
  alignContent: string;
  gap: number;
  itemCount: number;
  itemWidth: number;
  itemHeight: number;
  itemGrow: number;
  itemShrink: number;
  itemBasis: string;
  alignSelf: string;
  copied: boolean;
  setFlexDirection: (flexDirection: string) => void;
  setFlexWrap: (flexWrap: string) => void;
  setJustifyContent: (justifyContent: string) => void;
  setAlignItems: (alignItems: string) => void;
  setAlignContent: (alignContent: string) => void;
  setGap: (gap: number) => void;
  setItemCount: (itemCount: number) => void;
  setItemWidth: (itemWidth: number) => void;
  setItemHeight: (itemHeight: number) => void;
  setItemGrow: (itemGrow: number) => void;
  setItemShrink: (itemShrink: number) => void;
  setItemBasis: (itemBasis: string) => void;
  setAlignSelf: (alignSelf: string) => void;
  resetAll: () => void;
  getCssText: () => string;
  copyCss: () => Promise<void>;
}

const initialState = {
  flexDirection: 'row',
  flexWrap: 'nowrap',
  justifyContent: 'flex-start',
  alignItems: 'stretch',
  alignContent: 'stretch',
  gap: 0,
  itemCount: 4,
  itemWidth: 80,
  itemHeight: 80,
  itemGrow: 0,
  itemShrink: 1,
  itemBasis: 'auto',
  alignSelf: 'auto',
  copied: false,
};

export const useFlexboxPlaygroundStore = create<FlexboxPlaygroundState>((set, get) => ({
  ...initialState,

  setFlexDirection: (flexDirection) => set({ flexDirection }),
  setFlexWrap: (flexWrap) => set({ flexWrap }),
  setJustifyContent: (justifyContent) => set({ justifyContent }),
  setAlignItems: (alignItems) => set({ alignItems }),
  setAlignContent: (alignContent) => set({ alignContent }),
  setGap: (gap) => set({ gap }),
  setItemCount: (itemCount) => set({ itemCount }),
  setItemWidth: (itemWidth) => set({ itemWidth }),
  setItemHeight: (itemHeight) => set({ itemHeight }),
  setItemGrow: (itemGrow) => set({ itemGrow }),
  setItemShrink: (itemShrink) => set({ itemShrink }),
  setItemBasis: (itemBasis) => set({ itemBasis }),
  setAlignSelf: (alignSelf) => set({ alignSelf }),

  resetAll: () => set({ ...initialState }),

  getCssText: () => {
    const state = get();
    return buildFlexboxCss({
      flexDirection: state.flexDirection,
      flexWrap: state.flexWrap,
      justifyContent: state.justifyContent,
      alignItems: state.alignItems,
      alignContent: state.alignContent,
      gap: state.gap,
      itemWidth: state.itemWidth,
      itemHeight: state.itemHeight,
      itemGrow: state.itemGrow,
      itemShrink: state.itemShrink,
      itemBasis: state.itemBasis,
      alignSelf: state.alignSelf,
    });
  },

  copyCss: async () => {
    try {
      await navigator.clipboard.writeText(get().getCssText());
      set({ copied: true });
      setTimeout(() => set({ copied: false }), 2000);
    } catch {
      set({ copied: false });
    }
  },
}));
