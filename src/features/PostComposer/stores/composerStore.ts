import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { FORMATS, DESIGN_PRESETS, findFormat } from '../constants';
import { uid } from '../helpers';
import { cloneSlide, createBlankSlide, createInitialSlides, createSlideFromPreset } from '../helpers/slideUtils';
import type {
  Background,
  CanvasElement,
  Format,
  ImageElement,
  ShapeElement,
  ShapeType,
  Slide,
  TextElement,
} from '../types';

const STORAGE_KEY = 'tool-boxy-post-composer-v1';

type HistoryStacks = { past: CanvasElement[][]; future: CanvasElement[][] };

function emptyHistory(): HistoryStacks {
  return { past: [], future: [] };
}

function getActiveSlide(state: ComposerState): Slide | undefined {
  return state.slides.find((s) => s.id === state.activeSlideId);
}

function updateActiveSlide(slides: Slide[], activeSlideId: string, updater: (slide: Slide) => Slide): Slide[] {
  return slides.map((s) => (s.id === activeSlideId ? updater(s) : s));
}

export interface ComposerState {
  projectName: string;
  format: Format;
  slides: Slide[];
  activeSlideId: string;
  selectedId: string | null;
  editingTextId: string | null;
  historyBySlide: Record<string, HistoryStacks>;
  _hydrated: boolean;

  setHydrated: (v: boolean) => void;
  setProjectName: (name: string) => void;
  setFormat: (format: Format) => void;

  addSlide: (presetId?: string) => void;
  addBlankSlide: () => void;
  duplicateSlide: (slideId: string) => void;
  deleteSlide: (slideId: string) => void;
  renameSlide: (slideId: string, name: string) => void;
  setActiveSlide: (slideId: string) => void;
  reorderSlides: (fromIndex: number, toIndex: number) => void;
  applyPresetToSlide: (presetId: string) => void;
  applyPresetAsNewSlide: (presetId: string) => void;

  setBackground: (background: Background) => void;
  setSelectedId: (id: string | null) => void;
  setEditingTextId: (id: string | null) => void;
  setElements: (elements: CanvasElement[]) => void;
  commit: (next: CanvasElement[]) => void;
  undo: () => void;
  redo: () => void;
  canUndo: () => boolean;
  canRedo: () => boolean;

  patchSelected: (patch: Partial<CanvasElement>) => void;
  updateSelected: (patch: Partial<CanvasElement>) => void;
  addElement: (el: Omit<ShapeElement, 'id'> | Omit<TextElement, 'id'> | Omit<ImageElement, 'id'>) => string;
  addText: (preset: {
    text: string;
    fontSize: number;
    fontWeight: number;
    fontFamily: string;
    letterSpacing?: number;
  }) => void;
  addShape: (shapeType: ShapeType) => void;
  addImage: (src: string) => void;
  deleteSelected: () => void;
  duplicateSelected: () => void;
  reorder: (direction: 'up' | 'down' | 'top' | 'bottom') => void;
  commitTextEdit: (id: string, value: string) => void;
  clearProject: () => void;
}

const initialFormat = FORMATS[0];
const initialSlides = createInitialSlides(initialFormat.w, initialFormat.h);

export const useComposerStore = create<ComposerState>()(
  persist(
    (set, get) => ({
      projectName: 'Untitled design',
      format: initialFormat,
      slides: initialSlides,
      activeSlideId: initialSlides[0].id,
      selectedId: null,
      editingTextId: null,
      historyBySlide: { [initialSlides[0].id]: emptyHistory() },
      _hydrated: false,

      setHydrated: (v) => set({ _hydrated: v }),
      setProjectName: (projectName) => set({ projectName }),

      setFormat: (format) => set({ format }),

      addSlide: (presetId) => {
        const { format, slides } = get();
        const preset = presetId ? DESIGN_PRESETS.find((p) => p.id === presetId) : null;
        const slide = preset
          ? createSlideFromPreset(preset, format.w, format.h, `Slide ${slides.length + 1}`)
          : createBlankSlide(`Slide ${slides.length + 1}`);
        set({
          slides: [...slides, slide],
          activeSlideId: slide.id,
          selectedId: null,
          editingTextId: null,
          historyBySlide: { ...get().historyBySlide, [slide.id]: emptyHistory() },
        });
      },

      addBlankSlide: () => get().addSlide(),

      duplicateSlide: (slideId) => {
        const { slides } = get();
        const source = slides.find((s) => s.id === slideId);
        if (!source) return;
        const dup = cloneSlide(source, `${source.name} copy`);
        const idx = slides.findIndex((s) => s.id === slideId);
        const next = [...slides];
        next.splice(idx + 1, 0, dup);
        set({
          slides: next,
          activeSlideId: dup.id,
          selectedId: null,
          historyBySlide: { ...get().historyBySlide, [dup.id]: emptyHistory() },
        });
      },

      deleteSlide: (slideId) => {
        const { slides, activeSlideId, historyBySlide } = get();
        if (slides.length <= 1) return;
        const next = slides.filter((s) => s.id !== slideId);
        const nextHistory = { ...historyBySlide };
        delete nextHistory[slideId];
        const nextActive = activeSlideId === slideId ? next[0].id : activeSlideId;
        set({
          slides: next,
          activeSlideId: nextActive,
          selectedId: null,
          editingTextId: null,
          historyBySlide: nextHistory,
        });
      },

      renameSlide: (slideId, name) => {
        set({
          slides: get().slides.map((s) => (s.id === slideId ? { ...s, name } : s)),
        });
      },

      setActiveSlide: (slideId) => {
        set({ activeSlideId: slideId, selectedId: null, editingTextId: null });
      },

      reorderSlides: (fromIndex, toIndex) => {
        const slides = [...get().slides];
        const [item] = slides.splice(fromIndex, 1);
        slides.splice(toIndex, 0, item);
        set({ slides });
      },

      applyPresetToSlide: (presetId) => {
        const preset = DESIGN_PRESETS.find((p) => p.id === presetId);
        if (!preset) return;
        const { format, activeSlideId } = get();
        const slide = createSlideFromPreset(preset, format.w, format.h, preset.name);
        set({
          slides: updateActiveSlide(get().slides, activeSlideId, () => ({
            ...slide,
            id: activeSlideId,
            name: get().slides.find((s) => s.id === activeSlideId)?.name || preset.name,
          })),
          selectedId: null,
          historyBySlide: { ...get().historyBySlide, [activeSlideId]: emptyHistory() },
        });
      },

      applyPresetAsNewSlide: (presetId) => get().addSlide(presetId),

      setBackground: (background) => {
        const { activeSlideId } = get();
        set({
          slides: updateActiveSlide(get().slides, activeSlideId, (s) => ({ ...s, background })),
        });
      },

      setSelectedId: (selectedId) => set({ selectedId }),
      setEditingTextId: (editingTextId) => set({ editingTextId }),

      setElements: (elements) => {
        const { activeSlideId } = get();
        set({
          slides: updateActiveSlide(get().slides, activeSlideId, (s) => ({ ...s, elements })),
        });
      },

      commit: (next) => {
        const { activeSlideId, slides, historyBySlide } = get();
        const slide = slides.find((s) => s.id === activeSlideId);
        if (!slide) return;
        const hist = historyBySlide[activeSlideId] || emptyHistory();
        set({
          slides: updateActiveSlide(slides, activeSlideId, (s) => ({ ...s, elements: next })),
          historyBySlide: {
            ...historyBySlide,
            [activeSlideId]: { past: [...hist.past, slide.elements], future: [] },
          },
        });
      },

      undo: () => {
        const { activeSlideId, slides, historyBySlide } = get();
        const hist = historyBySlide[activeSlideId] || emptyHistory();
        if (!hist.past.length) return;
        const slide = slides.find((s) => s.id === activeSlideId);
        if (!slide) return;
        const prev = hist.past[hist.past.length - 1];
        set({
          slides: updateActiveSlide(slides, activeSlideId, (s) => ({ ...s, elements: prev })),
          historyBySlide: {
            ...historyBySlide,
            [activeSlideId]: {
              past: hist.past.slice(0, -1),
              future: [slide.elements, ...hist.future],
            },
          },
        });
      },

      redo: () => {
        const { activeSlideId, slides, historyBySlide } = get();
        const hist = historyBySlide[activeSlideId] || emptyHistory();
        if (!hist.future.length) return;
        const slide = slides.find((s) => s.id === activeSlideId);
        if (!slide) return;
        const next = hist.future[0];
        set({
          slides: updateActiveSlide(slides, activeSlideId, (s) => ({ ...s, elements: next })),
          historyBySlide: {
            ...historyBySlide,
            [activeSlideId]: {
              past: [...hist.past, slide.elements],
              future: hist.future.slice(1),
            },
          },
        });
      },

      canUndo: () => {
        const hist = get().historyBySlide[get().activeSlideId];
        return Boolean(hist?.past.length);
      },

      canRedo: () => {
        const hist = get().historyBySlide[get().activeSlideId];
        return Boolean(hist?.future.length);
      },

      patchSelected: (patch) => {
        const { selectedId, activeSlideId, slides } = get();
        if (!selectedId) return;
        set({
          slides: updateActiveSlide(slides, activeSlideId, (s) => ({
            ...s,
            elements: s.elements.map((el) => (el.id === selectedId ? ({ ...el, ...patch } as CanvasElement) : el)),
          })),
        });
      },

      updateSelected: (patch) => {
        const { selectedId, activeSlideId, slides, commit } = get();
        if (!selectedId) return;
        const slide = slides.find((s) => s.id === activeSlideId);
        if (!slide) return;
        commit(slide.elements.map((el) => (el.id === selectedId ? ({ ...el, ...patch } as CanvasElement) : el)));
      },

      addElement: (el) => {
        const withId = { ...el, id: uid() } as CanvasElement;
        const slide = getActiveSlide(get());
        if (!slide) return '';
        get().commit([...slide.elements, withId]);
        set({ selectedId: withId.id });
        return withId.id;
      },

      addText: (preset) => {
        const { format } = get();
        get().addElement({
          type: 'text',
          x: format.w / 2 - 220,
          y: format.h / 2 - 40,
          width: 440,
          height: 120,
          text: preset.text,
          fontSize: preset.fontSize,
          fontWeight: preset.fontWeight,
          fontFamily: preset.fontFamily,
          color: '#FFFFFF',
          align: 'left',
          opacity: 1,
          rotation: 0,
          letterSpacing: preset.letterSpacing,
        });
      },

      addShape: (shapeType) => {
        const { format } = get();
        const size =
          shapeType === 'line'
            ? { width: 400, height: 8 }
            : shapeType === 'arrow'
            ? { width: 160, height: 80 }
            : { width: 280, height: 280 };
        get().addElement({
          type: 'shape',
          shapeType,
          x: format.w / 2 - size.width / 2,
          y: format.h / 2 - size.height / 2,
          radius: shapeType === 'rect' ? 16 : 0,
          fill: '#14E8B4',
          opacity: 1,
          rotation: 0,
          ...size,
        });
      },

      addImage: (src) => {
        const { format } = get();
        get().addElement({
          type: 'image',
          x: format.w / 2 - 250,
          y: format.h / 2 - 250,
          width: 500,
          height: 500,
          src,
          opacity: 1,
          rotation: 0,
          objectFit: 'cover',
        });
      },

      deleteSelected: () => {
        const { selectedId, activeSlideId, slides, commit } = get();
        if (!selectedId) return;
        const slide = slides.find((s) => s.id === activeSlideId);
        if (!slide) return;
        commit(slide.elements.filter((el) => el.id !== selectedId));
        set({ selectedId: null });
      },

      duplicateSelected: () => {
        const { selectedId, activeSlideId, slides, commit } = get();
        const slide = slides.find((s) => s.id === activeSlideId);
        if (!slide || !selectedId) return;
        const selected = slide.elements.find((el) => el.id === selectedId);
        if (!selected) return;
        const dup = { ...selected, id: uid(), x: selected.x + 24, y: selected.y + 24 };
        commit([...slide.elements, dup]);
        set({ selectedId: dup.id });
      },

      reorder: (direction) => {
        const { selectedId, activeSlideId, slides, commit } = get();
        if (!selectedId) return;
        const slide = slides.find((s) => s.id === activeSlideId);
        if (!slide) return;
        const idx = slide.elements.findIndex((el) => el.id === selectedId);
        if (idx === -1) return;
        const next = [...slide.elements];
        let target = idx;
        if (direction === 'up') target = Math.min(idx + 1, next.length - 1);
        if (direction === 'down') target = Math.max(idx - 1, 0);
        if (direction === 'top') target = next.length - 1;
        if (direction === 'bottom') target = 0;
        const [item] = next.splice(idx, 1);
        next.splice(target, 0, item);
        commit(next);
      },

      commitTextEdit: (id, value) => {
        set({ editingTextId: null });
        const { activeSlideId, slides, commit } = get();
        const slide = slides.find((s) => s.id === activeSlideId);
        if (!slide) return;
        commit(slide.elements.map((el) => (el.id === id ? ({ ...el, text: value } as TextElement) : el)));
      },

      clearProject: () => {
        const slides = createInitialSlides(initialFormat.w, initialFormat.h);
        set({
          projectName: 'Untitled design',
          format: initialFormat,
          slides,
          activeSlideId: slides[0].id,
          selectedId: null,
          editingTextId: null,
          historyBySlide: { [slides[0].id]: emptyHistory() },
        });
      },
    }),
    {
      name: STORAGE_KEY,
      partialize: (state) => ({
        projectName: state.projectName,
        format: state.format,
        slides: state.slides,
        activeSlideId: state.activeSlideId,
      }),
      onRehydrateStorage: () => (state) => {
        if (state) {
          state.setHydrated(true);
          const validFormat = findFormat(state.format?.id);
          if (validFormat) {
            state.format = validFormat;
          } else {
            state.format = initialFormat;
          }
          if (!state.historyBySlide) {
            state.historyBySlide = {};
          }
          state.slides.forEach((s) => {
            if (!state.historyBySlide[s.id]) {
              state.historyBySlide[s.id] = emptyHistory();
            }
          });
        }
      },
    }
  )
);

export function useActiveSlide() {
  return useComposerStore((s) => s.slides.find((slide) => slide.id === s.activeSlideId));
}

export function useActiveElements() {
  return useComposerStore((s) => {
    const slide = s.slides.find((slide) => slide.id === s.activeSlideId);
    return slide?.elements ?? [];
  });
}

export function useActiveBackground() {
  return useComposerStore((s) => {
    const slide = s.slides.find((slide) => slide.id === s.activeSlideId);
    return slide?.background ?? { type: 'color', value: '#111827' };
  });
}
