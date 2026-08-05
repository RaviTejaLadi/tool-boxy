import { create } from 'zustand';
import type { PanelId } from '../types';

export interface PanelState {
  activePanel: PanelId;
  setActivePanel: (panel: PanelId) => void;
}

export const usePanelStore = create<PanelState>((set) => ({
  activePanel: 'design',
  setActivePanel: (activePanel) => set({ activePanel }),
}));
