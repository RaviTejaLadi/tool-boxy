import { create } from 'zustand';
import {
  DEFAULT_COLOR,
  DEFAULT_EXPORT_QUALITY,
  DEFAULT_FONT_SIZE,
  DEFAULT_OPACITY,
  DEFAULT_STROKE_WIDTH,
} from '../constants';
import { formatExtension, formatMime, uid } from '../helpers';
import type { Annotation, ExportFormat, ImageMeta, Point, Tool } from '../types';

export interface AnnotatorState {
  image: HTMLImageElement | null;
  fileName: string;
  mimeType: string;
  exportFormat: ExportFormat;
  exportQuality: number;
  history: Annotation[][];
  historyIndex: number;
  tool: Tool;
  color: string;
  strokeWidth: number;
  fontSize: number;
  opacity: number;
  filled: boolean;
  dashed: boolean;
  selectedId: string | null;
  zoom: number;
  pan: Point;
  nextCallout: number;
  showShortcuts: boolean;
  confirmClear: boolean;

  loadImage: (image: HTMLImageElement, meta?: Partial<ImageMeta>) => void;
  clearImage: () => void;
  commit: (next: Annotation[]) => void;
  undo: () => void;
  redo: () => void;
  setTool: (tool: Tool) => void;
  setColor: (color: string) => void;
  setStrokeWidth: (strokeWidth: number) => void;
  setFontSize: (fontSize: number) => void;
  setOpacity: (opacity: number) => void;
  setFilled: (filled: boolean) => void;
  setDashed: (dashed: boolean) => void;
  setSelectedId: (selectedId: string | null) => void;
  setZoom: (zoom: number | ((z: number) => number)) => void;
  setPan: (pan: Point | ((p: Point) => Point)) => void;
  fitToScreen: () => void;
  setShowShortcuts: (show: boolean | ((s: boolean) => boolean)) => void;
  setConfirmClear: (confirmClear: boolean) => void;
  setExportFormat: (exportFormat: ExportFormat) => void;
  setExportQuality: (exportQuality: number) => void;
  applyStyleToSelected: (patch: Partial<Annotation>) => void;
  clearAnnotations: () => void;
  deleteSelected: () => void;
  duplicateSelected: () => void;
  bringForward: () => void;
  sendBackward: () => void;
  takeCalloutNumber: () => number;
}

const emptyHistory = (): Annotation[][] => [[]];

function withFileName(fileName: string, format: ExportFormat) {
  const base = fileName.replace(/\.(png|jpe?g|webp)$/i, '') || 'annotated-image';
  return `${base.replace(/-annotated$/i, '')}-annotated.${formatExtension(format)}`;
}

export const useAnnotatorStore = create<AnnotatorState>((set, get) => ({
  image: null,
  fileName: '',
  mimeType: 'image/png',
  exportFormat: 'png',
  exportQuality: DEFAULT_EXPORT_QUALITY,
  history: emptyHistory(),
  historyIndex: 0,
  tool: 'select',
  color: DEFAULT_COLOR,
  strokeWidth: DEFAULT_STROKE_WIDTH,
  fontSize: DEFAULT_FONT_SIZE,
  opacity: DEFAULT_OPACITY,
  filled: false,
  dashed: false,
  selectedId: null,
  zoom: 1,
  pan: { x: 0, y: 0 },
  nextCallout: 1,
  showShortcuts: false,
  confirmClear: false,

  loadImage: (image, meta = {}) => {
    const format = meta.format ?? 'png';
    set({
      image,
      fileName: meta.name ?? withFileName('image', format),
      mimeType: meta.mimeType ?? formatMime(format),
      exportFormat: format,
      history: emptyHistory(),
      historyIndex: 0,
      selectedId: null,
      zoom: 1,
      pan: { x: 0, y: 0 },
      nextCallout: 1,
      confirmClear: false,
    });
  },

  clearImage: () =>
    set({
      image: null,
      fileName: '',
      mimeType: 'image/png',
      exportFormat: 'png',
      history: emptyHistory(),
      historyIndex: 0,
      selectedId: null,
      zoom: 1,
      pan: { x: 0, y: 0 },
      nextCallout: 1,
      confirmClear: false,
    }),

  commit: (next) => {
    set((s) => ({
      history: [...s.history.slice(0, s.historyIndex + 1), next],
      historyIndex: s.historyIndex + 1,
    }));
  },

  undo: () => {
    set((s) => ({
      historyIndex: Math.max(0, s.historyIndex - 1),
      selectedId: null,
    }));
  },

  redo: () => {
    set((s) => ({
      historyIndex: Math.min(s.history.length - 1, s.historyIndex + 1),
      selectedId: null,
    }));
  },

  setTool: (tool) => set({ tool }),
  setColor: (color) => set({ color }),
  setStrokeWidth: (strokeWidth) => set({ strokeWidth }),
  setFontSize: (fontSize) => set({ fontSize }),
  setOpacity: (opacity) => set({ opacity }),
  setFilled: (filled) => set({ filled }),
  setDashed: (dashed) => set({ dashed }),
  setSelectedId: (selectedId) => set({ selectedId }),

  setZoom: (zoom) =>
    set((s) => ({
      zoom: typeof zoom === 'function' ? zoom(s.zoom) : zoom,
    })),

  setPan: (pan) =>
    set((s) => ({
      pan: typeof pan === 'function' ? pan(s.pan) : pan,
    })),

  fitToScreen: () => set({ zoom: 1, pan: { x: 0, y: 0 } }),

  setShowShortcuts: (show) =>
    set((s) => ({
      showShortcuts: typeof show === 'function' ? show(s.showShortcuts) : show,
    })),

  setConfirmClear: (confirmClear) => set({ confirmClear }),

  setExportFormat: (exportFormat) =>
    set((s) => ({
      exportFormat,
      fileName: withFileName(s.fileName || 'image', exportFormat),
      mimeType: formatMime(exportFormat),
    })),

  setExportQuality: (exportQuality) => set({ exportQuality }),

  applyStyleToSelected: (patch) => {
    const { selectedId, history, historyIndex, commit } = get();
    if (!selectedId) return;
    const annotations = history[historyIndex];
    commit(annotations.map((a) => (a.id === selectedId ? ({ ...a, ...patch } as Annotation) : a)));
  },

  clearAnnotations: () => {
    get().commit([]);
    set({ selectedId: null, confirmClear: false, nextCallout: 1 });
  },

  deleteSelected: () => {
    const { selectedId, history, historyIndex, commit } = get();
    if (!selectedId) return;
    commit(history[historyIndex].filter((a) => a.id !== selectedId));
    set({ selectedId: null });
  },

  duplicateSelected: () => {
    const { selectedId, history, historyIndex, commit } = get();
    if (!selectedId) return;
    const annotations = history[historyIndex];
    const selected = annotations.find((a) => a.id === selectedId);
    if (!selected) return;
    const offset = 16;
    let copy: Annotation;
    if (
      selected.type === 'rect' ||
      selected.type === 'ellipse' ||
      selected.type === 'highlight' ||
      selected.type === 'redact'
    ) {
      copy = { ...selected, id: uid(), x: selected.x + offset, y: selected.y + offset };
    } else if (selected.type === 'line' || selected.type === 'arrow' || selected.type === 'pen') {
      copy = {
        ...selected,
        id: uid(),
        points: selected.points.map((p) => ({ x: p.x + offset, y: p.y + offset })),
      };
    } else if (selected.type === 'text' || selected.type === 'callout') {
      copy = { ...selected, id: uid(), x: selected.x + offset, y: selected.y + offset };
    } else {
      return;
    }
    commit([...annotations, copy]);
    set({ selectedId: copy.id });
  },

  bringForward: () => {
    const { selectedId, history, historyIndex, commit } = get();
    if (!selectedId) return;
    const list = [...history[historyIndex]];
    const idx = list.findIndex((a) => a.id === selectedId);
    if (idx < 0 || idx >= list.length - 1) return;
    [list[idx], list[idx + 1]] = [list[idx + 1], list[idx]];
    commit(list);
  },

  sendBackward: () => {
    const { selectedId, history, historyIndex, commit } = get();
    if (!selectedId) return;
    const list = [...history[historyIndex]];
    const idx = list.findIndex((a) => a.id === selectedId);
    if (idx <= 0) return;
    [list[idx - 1], list[idx]] = [list[idx], list[idx - 1]];
    commit(list);
  },

  takeCalloutNumber: () => {
    const n = get().nextCallout;
    set({ nextCallout: n + 1 });
    return n;
  },
}));

export const selectAnnotations = (s: AnnotatorState) => s.history[s.historyIndex] ?? [];
export const selectCanUndo = (s: AnnotatorState) => s.historyIndex > 0;
export const selectCanRedo = (s: AnnotatorState) => s.historyIndex < s.history.length - 1;
