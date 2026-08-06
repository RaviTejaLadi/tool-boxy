import { create } from 'zustand';
import {
  DEFAULT_COLOR,
  DEFAULT_EXPORT_QUALITY,
  DEFAULT_FONT_SIZE,
  DEFAULT_OPACITY,
  DEFAULT_STROKE_WIDTH,
} from '../constants';
import { formatExtension, formatMime, uid } from '../helpers';
import type { Annotation, DocumentMeta, ExportFormat, PageState, Point, SourceKind, Tool } from '../types';

export interface AnnotatorState {
  image: HTMLImageElement | null;
  fileName: string;
  mimeType: string;
  exportFormat: ExportFormat;
  exportQuality: number;
  sourceKind: SourceKind | null;
  pdfFile: File | null;
  pdfData: ArrayBuffer | null;
  pageNumber: number;
  numPages: number;
  pageStates: Record<number, PageState>;
  isLoading: boolean;
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

  loadDocument: (
    image: HTMLImageElement,
    meta: DocumentMeta,
    pdf?: { file: File; data: ArrayBuffer; numPages: number }
  ) => void;
  clearDocument: () => void;
  setPage: (pageNumber: number) => Promise<void>;
  setNumPages: (numPages: number) => void;
  setLoading: (isLoading: boolean) => void;
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

const emptyPageState = (): PageState => ({
  history: emptyHistory(),
  historyIndex: 0,
  nextCallout: 1,
});

function withFileName(fileName: string, format: ExportFormat) {
  const base = fileName.replace(/\.(png|jpe?g|webp|pdf)$/i, '') || 'annotated-document';
  return `${base.replace(/-annotated$/i, '')}-annotated.${formatExtension(format)}`;
}

function snapshotPage(s: AnnotatorState): PageState {
  return {
    history: s.history,
    historyIndex: s.historyIndex,
    nextCallout: s.nextCallout,
  };
}

export const useAnnotatorStore = create<AnnotatorState>((set, get) => ({
  image: null,
  fileName: '',
  mimeType: 'image/png',
  exportFormat: 'png',
  exportQuality: DEFAULT_EXPORT_QUALITY,
  sourceKind: null,
  pdfFile: null,
  pdfData: null,
  pageNumber: 1,
  numPages: 1,
  pageStates: {},
  isLoading: false,
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

  loadDocument: (image, meta, pdf) => {
    set({
      image,
      fileName: meta.name,
      mimeType: meta.mimeType,
      exportFormat: meta.format,
      sourceKind: meta.sourceKind,
      pdfFile: pdf?.file ?? null,
      pdfData: pdf?.data ?? null,
      pageNumber: 1,
      numPages: pdf?.numPages ?? 1,
      pageStates: {},
      history: emptyHistory(),
      historyIndex: 0,
      selectedId: null,
      zoom: 1,
      pan: { x: 0, y: 0 },
      nextCallout: 1,
      confirmClear: false,
      isLoading: false,
    });
  },

  clearDocument: () =>
    set({
      image: null,
      fileName: '',
      mimeType: 'image/png',
      exportFormat: 'png',
      sourceKind: null,
      pdfFile: null,
      pdfData: null,
      pageNumber: 1,
      numPages: 1,
      pageStates: {},
      history: emptyHistory(),
      historyIndex: 0,
      selectedId: null,
      zoom: 1,
      pan: { x: 0, y: 0 },
      nextCallout: 1,
      confirmClear: false,
      isLoading: false,
    }),

  setPage: async (pageNumber) => {
    const s = get();
    if (!s.pdfData || pageNumber < 1 || pageNumber > s.numPages || pageNumber === s.pageNumber) return;

    const pageStates = { ...s.pageStates, [s.pageNumber]: snapshotPage(s) };
    const nextPage = pageStates[pageNumber] ?? emptyPageState();

    set({
      pageNumber,
      pageStates,
      history: nextPage.history,
      historyIndex: nextPage.historyIndex,
      nextCallout: nextPage.nextCallout,
      selectedId: null,
      confirmClear: false,
    });
  },

  setNumPages: (numPages) =>
    set((s) => {
      const nextTotal = Math.max(1, Math.floor(numPages) || 1);
      const nextPage = Math.min(Math.max(s.pageNumber, 1), nextTotal);
      return {
        numPages: nextTotal,
        pageNumber: nextPage,
      };
    }),

  setLoading: (isLoading) => set({ isLoading }),

  commit: (next) => {
    set((state) => ({
      history: [...state.history.slice(0, state.historyIndex + 1), next],
      historyIndex: state.historyIndex + 1,
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
      fileName: withFileName(s.fileName || 'document', exportFormat),
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
      selected.type === 'redact' ||
      selected.type === 'mask'
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
export const selectHasDocument = (s: AnnotatorState) => Boolean(s.image || s.pdfFile);
