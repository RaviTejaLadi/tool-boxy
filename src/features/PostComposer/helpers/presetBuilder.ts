import type { CanvasElement, ShapeElement, ShapeType, TextElement } from '../types';

export type PresetEl = Omit<CanvasElement, 'id'>;
export type PresetShapeEl = Omit<ShapeElement, 'id'>;
export type PresetTextEl = Omit<TextElement, 'id'>;

export const g = (value: string) => ({ type: 'gradient' as const, value });
export const c = (value: string) => ({ type: 'color' as const, value });

export function shape(
  shapeType: ShapeType,
  x: number,
  y: number,
  width: number,
  height: number,
  fill: string,
  opts: Partial<Omit<ShapeElement, 'id'>> = {}
): PresetShapeEl {
  return { type: 'shape', shapeType, x, y, width, height, fill, opacity: 1, ...opts };
}

export function text(
  content: string,
  x: number,
  y: number,
  width: number,
  height: number,
  opts: Partial<Omit<TextElement, 'id' | 'type' | 'text' | 'x' | 'y' | 'width' | 'height'>>
): PresetTextEl {
  return {
    type: 'text',
    text: content,
    x,
    y,
    width,
    height,
    fontSize: 48,
    fontWeight: 700,
    fontFamily: 'system-ui, sans-serif',
    color: '#FFFFFF',
    align: 'left',
    ...opts,
  };
}

/** Percentage-based coords relative to canvas w×h */
export const pct = {
  x: (w: number, p: number) => w * p,
  y: (h: number, p: number) => h * p,
  w: (w: number, p: number) => w * p,
  h: (h: number, p: number) => h * p,
};

export function eyebrow(
  label: string,
  w: number,
  h: number,
  yPct: number,
  color: string,
  align: 'left' | 'center' | 'right' = 'left'
): PresetTextEl {
  return text(label, pct.x(w, 0.08), pct.y(h, yPct), pct.w(w, 0.84), pct.h(h, 0.05), {
    fontSize: Math.round(w * 0.022),
    fontWeight: 700,
    fontFamily: 'system-ui, sans-serif',
    color,
    align,
    letterSpacing: 4,
  });
}

export function glassPanel(
  w: number,
  h: number,
  xPct: number,
  yPct: number,
  wPct: number,
  hPct: number,
  radius = 24
): PresetShapeEl {
  return shape('rect', pct.x(w, xPct), pct.y(h, yPct), pct.w(w, wPct), pct.h(h, hPct), '#FFFFFF', {
    opacity: 0.12,
    radius,
  });
}

export function accentBar(w: number, h: number, yPct: number, color: string, widthPct = 0.18): PresetShapeEl {
  return shape('rect', pct.x(w, 0.08), pct.y(h, yPct), pct.w(w, widthPct), 4, color, { opacity: 1 });
}

export function blob(
  w: number,
  h: number,
  xPct: number,
  yPct: number,
  sizePct: number,
  fill: string,
  opacity: number,
  rotation = 0
): PresetShapeEl {
  const size = pct.w(w, sizePct);
  return shape('circle', pct.x(w, xPct), pct.y(h, yPct), size, size, fill, { opacity, rotation });
}
