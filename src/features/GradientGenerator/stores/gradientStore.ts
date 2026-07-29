import { create } from 'zustand';
import {
  INITIAL_CORNER_STOPS,
  INITIAL_LINEAR_STOPS,
  INITIAL_MESH_STOPS,
  type ColorStop,
  type GradientType,
} from '../constants';
import { getCurrentCSS } from '../helpers';

export interface GradientGeneratorState {
  activeTab: GradientType;
  angle: number;
  noise: number;
  exportSize: string;
  linearStops: ColorStop[];
  cornerStops: ColorStop[];
  meshStops: ColorStop[];
  meshGrid: '2x2' | '3x3';
  copied: boolean;
  setActiveTab: (tab: GradientType) => void;
  setAngle: (angle: number) => void;
  setNoise: (noise: number) => void;
  setExportSize: (size: string) => void;
  setLinearStops: (stops: ColorStop[]) => void;
  setCornerStops: (stops: ColorStop[]) => void;
  setMeshStops: (stops: ColorStop[]) => void;
  setMeshGrid: (grid: '2x2' | '3x3') => void;
  copyCss: () => Promise<void>;
}

export const useGradientStore = create<GradientGeneratorState>((set, get) => ({
  activeTab: 'linear',
  angle: 115,
  noise: 0,
  exportSize: '1920x1080',
  linearStops: [...INITIAL_LINEAR_STOPS],
  cornerStops: [...INITIAL_CORNER_STOPS],
  meshStops: [...INITIAL_MESH_STOPS],
  meshGrid: '2x2',
  copied: false,

  setActiveTab: (activeTab) => set({ activeTab }),
  setAngle: (angle) => set({ angle }),
  setNoise: (noise) => set({ noise }),
  setExportSize: (exportSize) => set({ exportSize }),
  setLinearStops: (linearStops) => set({ linearStops }),
  setCornerStops: (cornerStops) => set({ cornerStops }),
  setMeshStops: (meshStops) => set({ meshStops }),
  setMeshGrid: (meshGrid) => set({ meshGrid }),

  copyCss: async () => {
    const { activeTab, angle, linearStops, cornerStops, meshStops } = get();
    const css = getCurrentCSS(activeTab, angle, linearStops, cornerStops, meshStops);
    await navigator.clipboard.writeText(css);
    set({ copied: true });
    setTimeout(() => set({ copied: false }), 2000);
  },
}));
