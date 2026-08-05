import { DESIGN_PRESETS } from '../constants/presets';
import { uid } from './canvasUtils';
import type { Background, CanvasElement, DesignPreset, Slide } from '../types';

export function assignIds(elements: Omit<CanvasElement, 'id'>[]): CanvasElement[] {
  return elements.map((el) => ({ ...el, id: uid() } as CanvasElement));
}

export function createSlideFromPreset(preset: DesignPreset, w: number, h: number, name?: string): Slide {
  return {
    id: uid(),
    name: name || preset.name,
    background: { ...preset.background },
    elements: assignIds(preset.buildElements(w, h)),
  };
}

export function createBlankSlide(name: string, background?: Background): Slide {
  return {
    id: uid(),
    name,
    background: background || { type: 'gradient', value: 'linear-gradient(135deg,#6C5CE7,#00D9C0)' },
    elements: [],
  };
}

export function createInitialSlides(w: number, h: number): Slide[] {
  const preset = DESIGN_PRESETS[0];
  return [createSlideFromPreset(preset, w, h, 'Slide 1')];
}

export function cloneSlide(slide: Slide, name?: string): Slide {
  return {
    id: uid(),
    name: name || `${slide.name} copy`,
    background: { ...slide.background },
    elements: slide.elements.map((el) => ({ ...el, id: uid() })),
  };
}

export function cloneElementsWithOffset(elements: CanvasElement[]): CanvasElement[] {
  return elements.map((el) => ({ ...el, id: uid(), x: el.x + 24, y: el.y + 24 }));
}
