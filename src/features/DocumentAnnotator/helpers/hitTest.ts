import { calloutRadius, distToSegment, norm, textMetrics } from './geometry';
import type { Annotation, Point } from '../types';

export function hitTest(pt: Point, a: Annotation, pad: number): boolean {
  if (a.type === 'rect' || a.type === 'highlight' || a.type === 'ellipse' || a.type === 'redact' || a.type === 'mask') {
    const r = norm(a.x, a.y, a.w, a.h);
    return pt.x >= r.x - pad && pt.x <= r.x + r.w + pad && pt.y >= r.y - pad && pt.y <= r.y + r.h + pad;
  }
  if (a.type === 'line' || a.type === 'arrow') {
    const [p0, p1] = a.points;
    if (!p0 || !p1) return false;
    return distToSegment(pt, p0, p1) <= pad + a.strokeWidth;
  }
  if (a.type === 'pen') {
    for (let i = 0; i < a.points.length - 1; i++) {
      if (distToSegment(pt, a.points[i], a.points[i + 1]) <= pad + a.strokeWidth) return true;
    }
    return false;
  }
  if (a.type === 'text') {
    const { w, h } = textMetrics(a);
    return pt.x >= a.x - pad && pt.x <= a.x + w + pad && pt.y >= a.y - pad && pt.y <= a.y + h + pad;
  }
  if (a.type === 'callout') {
    return Math.hypot(pt.x - a.x, pt.y - a.y) <= calloutRadius(a) + pad;
  }
  return false;
}
