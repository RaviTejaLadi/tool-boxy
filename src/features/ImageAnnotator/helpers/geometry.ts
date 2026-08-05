import type { Annotation, Bounds, CalloutAnnotation, Point, TextAnnotation } from '../types';

export const uid = () => Math.random().toString(36).slice(2, 10);

export const clamp = (v: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, v));

export const norm = (x: number, y: number, w: number, h: number): Bounds => ({
  x: w < 0 ? x + w : x,
  y: h < 0 ? y + h : y,
  w: Math.abs(w),
  h: Math.abs(h),
});

export function distToSegment(p: Point, a: Point, b: Point) {
  const dx = b.x - a.x;
  const dy = b.y - a.y;
  const lenSq = dx * dx + dy * dy;
  let t = lenSq === 0 ? 0 : ((p.x - a.x) * dx + (p.y - a.y) * dy) / lenSq;
  t = clamp(t, 0, 1);
  const projX = a.x + t * dx;
  const projY = a.y + t * dy;
  return Math.hypot(p.x - projX, p.y - projY);
}

export function textMetrics(a: TextAnnotation) {
  const w = Math.max(20, a.text.length * a.fontSize * 0.56);
  const h = a.fontSize * 1.3;
  return { w, h };
}

export function calloutRadius(a: CalloutAnnotation) {
  return Math.max(14, a.fontSize * 0.85);
}

export function boundsOf(a: Annotation): Bounds {
  if (a.type === 'rect' || a.type === 'highlight' || a.type === 'ellipse' || a.type === 'redact') {
    return norm(a.x, a.y, a.w, a.h);
  }
  if (a.type === 'line' || a.type === 'arrow') {
    const [p0, p1] = a.points;
    const x = Math.min(p0.x, p1.x);
    const y = Math.min(p0.y, p1.y);
    return { x, y, w: Math.abs(p1.x - p0.x), h: Math.abs(p1.y - p0.y) };
  }
  if (a.type === 'pen') {
    const xs = a.points.map((p) => p.x);
    const ys = a.points.map((p) => p.y);
    const x = Math.min(...xs);
    const y = Math.min(...ys);
    return { x, y, w: Math.max(...xs) - x, h: Math.max(...ys) - y };
  }
  if (a.type === 'callout') {
    const r = calloutRadius(a);
    return { x: a.x - r, y: a.y - r, w: r * 2, h: r * 2 };
  }
  if (a.type === 'text') {
    const { w, h } = textMetrics(a);
    return { x: a.x, y: a.y, w, h };
  }
  return { x: 0, y: 0, w: 0, h: 0 };
}

export function detectExportFormat(mimeType: string, fileName = ''): 'png' | 'jpeg' | 'webp' {
  const mime = mimeType.toLowerCase();
  const ext = fileName.split('.').pop()?.toLowerCase() ?? '';
  if (mime.includes('webp') || ext === 'webp') return 'webp';
  if (mime.includes('jpeg') || mime.includes('jpg') || ext === 'jpg' || ext === 'jpeg') return 'jpeg';
  return 'png';
}

export function formatExtension(format: 'png' | 'jpeg' | 'webp') {
  return format === 'jpeg' ? 'jpg' : format;
}

export function formatMime(format: 'png' | 'jpeg' | 'webp') {
  return format === 'jpeg' ? 'image/jpeg' : format === 'webp' ? 'image/webp' : 'image/png';
}

export function formatLabel(format: 'png' | 'jpeg' | 'webp') {
  return format === 'jpeg' ? 'JPG' : format.toUpperCase();
}
