import type { CSSProperties } from 'react';
import type { ShapeType } from '../types';

type Point = [number, number];

function toClipPath(points: Point[]): string {
  return `polygon(${points.map(([x, y]) => `${x}% ${y}%`).join(', ')})`;
}

function regularPolygonClip(sides: number, rotationDeg = -90): string {
  const points: Point[] = [];
  for (let i = 0; i < sides; i++) {
    const angle = ((360 / sides) * i + rotationDeg) * (Math.PI / 180);
    points.push([50 + 50 * Math.cos(angle), 50 + 50 * Math.sin(angle)]);
  }
  return toClipPath(points);
}

function starClip(points: number, innerRatio = 0.4, rotationDeg = -90): string {
  const pts: Point[] = [];
  for (let i = 0; i < points * 2; i++) {
    const r = i % 2 === 0 ? 50 : 50 * innerRatio;
    const angle = ((360 / (points * 2)) * i + rotationDeg) * (Math.PI / 180);
    pts.push([50 + r * Math.cos(angle), 50 + r * Math.sin(angle)]);
  }
  return toClipPath(pts);
}

function arcPolygonClip(startDeg: number, endDeg: number, steps = 14): string {
  const points: Point[] = [[50, 50]];
  for (let i = 0; i <= steps; i++) {
    const angle = (startDeg + ((endDeg - startDeg) * i) / steps) * (Math.PI / 180);
    points.push([50 + 50 * Math.cos(angle), 50 + 50 * Math.sin(angle)]);
  }
  return toClipPath(points);
}

const CLIP_PATHS: Partial<Record<ShapeType, string>> = {
  triangle: 'polygon(50% 0%, 0% 100%, 100% 100%)',
  diamond: 'polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)',
  pentagon: regularPolygonClip(5),
  hexagon: regularPolygonClip(6, -90),
  heptagon: regularPolygonClip(7),
  octagon: regularPolygonClip(8),
  decagon: regularPolygonClip(10),
  parallelogram: 'polygon(22% 0%, 100% 0%, 78% 100%, 0% 100%)',
  trapezoid: 'polygon(18% 0%, 82% 0%, 100% 100%, 0% 100%)',
  star: starClip(5, 0.4),
  'star-4': starClip(4, 0.35),
  'star-6': starClip(6, 0.45),
  burst: starClip(8, 0.55),
  heart: 'polygon(50% 18%, 61% 6%, 75% 6%, 88% 18%, 88% 38%, 50% 88%, 12% 38%, 12% 18%, 25% 6%, 39% 6%)',
  arrow: 'polygon(0% 20%, 60% 20%, 60% 0%, 100% 50%, 60% 100%, 60% 80%, 0% 80%)',
  'arrow-left': 'polygon(100% 20%, 40% 20%, 40% 0%, 0% 50%, 40% 100%, 40% 80%, 100% 80%)',
  'arrow-up': 'polygon(20% 100%, 20% 40%, 0% 40%, 50% 0%, 100% 40%, 80% 40%, 80% 100%)',
  'arrow-down': 'polygon(20% 0%, 20% 60%, 0% 60%, 50% 100%, 100% 60%, 80% 60%, 80% 0%)',
  'arrow-double':
    'polygon(0% 35%, 18% 35%, 18% 15%, 32% 50%, 18% 85%, 18% 65%, 0% 65%, 0% 35%, 82% 35%, 82% 15%, 100% 50%, 82% 85%, 82% 65%, 68% 65%, 68% 35%, 82% 35%)',
  'chevron-right': 'polygon(0% 0%, 65% 0%, 100% 50%, 65% 100%, 0% 100%, 35% 50%)',
  'chevron-left': 'polygon(100% 0%, 35% 0%, 0% 50%, 35% 100%, 100% 100%, 65% 50%)',
  'chevron-up': 'polygon(0% 100%, 0% 35%, 50% 0%, 100% 35%, 100% 100%, 50% 65%)',
  'chevron-down': 'polygon(0% 0%, 0% 65%, 50% 100%, 100% 65%, 100% 0%, 50% 35%)',
  'chevron-double':
    'polygon(0% 0%, 25% 0%, 50% 35%, 75% 0%, 100% 0%, 65% 50%, 100% 100%, 75% 100%, 50% 65%, 25% 100%, 0% 100%, 35% 50%)',
  cross:
    'polygon(35% 0%, 65% 0%, 65% 35%, 100% 35%, 100% 65%, 65% 65%, 65% 100%, 35% 100%, 35% 65%, 0% 65%, 0% 35%, 35% 35%)',
  shield: 'polygon(50% 0%, 96% 12%, 96% 52%, 50% 100%, 4% 52%, 4% 12%)',
  badge: 'polygon(50% 0%, 92% 14%, 100% 50%, 92% 86%, 50% 100%, 8% 86%, 0% 50%, 8% 14%)',
  bolt: 'polygon(58% 0%, 22% 46%, 44% 46%, 32% 100%, 78% 42%, 54% 42%, 68% 0%)',
  sun: starClip(8, 0.72),
  moon: arcPolygonClip(-40, 220),
  semicircle: arcPolygonClip(180, 360),
  'quarter-circle': arcPolygonClip(180, 270),
  teardrop: 'polygon(50% 0%, 92% 38%, 78% 88%, 50% 100%, 22% 88%, 8% 38%)',
  cloud:
    'polygon(18% 68%, 8% 52%, 12% 34%, 28% 24%, 44% 18%, 58% 12%, 74% 16%, 88% 28%, 94% 44%, 88% 60%, 74% 70%, 56% 74%, 38% 78%)',
  'speech-bubble': 'polygon(0% 0%, 100% 0%, 100% 72%, 62% 72%, 48% 100%, 44% 72%, 0% 72%)',
  flower: starClip(6, 0.62),
  leaf: 'polygon(50% 0%, 88% 28%, 82% 58%, 50% 100%, 18% 58%, 12% 28%)',
  gear: regularPolygonClip(12, -75),
  ribbon: 'polygon(0% 22%, 12% 0%, 88% 0%, 100% 22%, 100% 78%, 88% 100%, 12% 100%, 0% 78%)',
  banner: 'polygon(0% 0%, 100% 0%, 100% 68%, 50% 100%, 0% 68%)',
  ticket:
    'polygon(0% 8%, 8% 0%, 92% 0%, 100% 8%, 100% 42%, 94% 50%, 100% 58%, 100% 92%, 92% 100%, 8% 100%, 0% 92%, 0% 58%, 6% 50%, 0% 42%)',
  tag: 'polygon(0% 0%, 72% 0%, 100% 50%, 72% 100%, 0% 100%)',
  bookmark: 'polygon(0% 0%, 100% 0%, 100% 100%, 50% 78%, 0% 100%)',
  flag: 'polygon(0% 0%, 62% 0%, 100% 18%, 62% 36%, 100% 54%, 62% 72%, 100% 90%, 62% 100%, 0% 100%)',
  pin: 'polygon(50% 0%, 82% 28%, 72% 62%, 50% 100%, 28% 62%, 18% 28%)',
  'bracket-left': 'polygon(28% 0%, 28% 18%, 10% 18%, 10% 82%, 28% 82%, 28% 100%, 0% 100%, 0% 0%)',
  'bracket-right': 'polygon(72% 0%, 72% 18%, 90% 18%, 90% 82%, 72% 82%, 72% 100%, 100% 100%, 100% 0%)',
  corner: 'polygon(0% 0%, 100% 0%, 100% 28%, 28% 28%, 28% 100%, 0% 100%)',
  wave: 'polygon(0% 55%, 12% 42%, 25% 55%, 38% 42%, 50% 55%, 62% 42%, 75% 55%, 88% 42%, 100% 55%, 100% 100%, 0% 100%)',
  funnel: 'polygon(12% 0%, 88% 0%, 62% 42%, 62% 100%, 38% 100%, 38% 42%)',
  hourglass: 'polygon(18% 0%, 82% 0%, 58% 42%, 82% 100%, 18% 100%, 42% 42%)',
};

const SPECIAL_FILLS = new Set<ShapeType>(['ring', 'frame', 'crescent']);

export function shapeClipPath(shapeType: ShapeType): string | undefined {
  return CLIP_PATHS[shapeType];
}

export function getShapeBorderRadius(shapeType: ShapeType, radius: number, scale = 1): string | undefined {
  if (shapeType === 'circle') return '9999px';
  if (shapeType === 'rect' || shapeType === 'frame') return `${radius * scale}px`;
  if (shapeType === 'pill') return '9999px';
  return undefined;
}

export function getShapeRenderStyle(shapeType: ShapeType, fill: string, radius = 0, scale = 1): CSSProperties {
  const borderRadius = getShapeBorderRadius(shapeType, radius, scale);

  if (shapeType === 'ring') {
    const thickness = Math.max(8, Math.round(16 * scale));
    return {
      backgroundColor: 'transparent',
      border: `${thickness}px solid ${fill}`,
      borderRadius: '50%',
      boxSizing: 'border-box',
    };
  }

  if (shapeType === 'frame') {
    const thickness = Math.max(10, Math.round(20 * scale));
    return {
      backgroundColor: 'transparent',
      border: `${thickness}px solid ${fill}`,
      borderRadius,
      boxSizing: 'border-box',
    };
  }

  if (shapeType === 'crescent') {
    return {
      backgroundColor: fill,
      borderRadius: '50%',
      boxShadow: `${Math.round(28 * scale)}px 0 0 0 ${fill}`,
      transform: 'translateX(-35%)',
    };
  }

  return {
    backgroundColor: fill,
    clipPath: shapeClipPath(shapeType),
    borderRadius,
  };
}

export function usesSpecialShapeFill(shapeType: ShapeType): boolean {
  return SPECIAL_FILLS.has(shapeType);
}

function drawRegularPolygon(
  ctx: CanvasRenderingContext2D,
  cx: number,
  cy: number,
  rx: number,
  ry: number,
  sides: number,
  rotationDeg = -90
) {
  for (let i = 0; i < sides; i++) {
    const angle = ((360 / sides) * i + rotationDeg) * (Math.PI / 180);
    const px = cx + rx * Math.cos(angle);
    const py = cy + ry * Math.sin(angle);
    if (i === 0) ctx.moveTo(px, py);
    else ctx.lineTo(px, py);
  }
  ctx.closePath();
}

function drawStar(
  ctx: CanvasRenderingContext2D,
  cx: number,
  cy: number,
  outer: number,
  inner: number,
  points: number,
  rotationDeg = -90
) {
  for (let i = 0; i < points * 2; i++) {
    const r = i % 2 === 0 ? outer : inner;
    const angle = (Math.PI / points) * i + (rotationDeg * Math.PI) / 180 - Math.PI / 2;
    const px = cx + r * Math.cos(angle);
    const py = cy + r * Math.sin(angle);
    if (i === 0) ctx.moveTo(px, py);
    else ctx.lineTo(px, py);
  }
  ctx.closePath();
}

function drawArcWedge(
  ctx: CanvasRenderingContext2D,
  cx: number,
  cy: number,
  rx: number,
  ry: number,
  startDeg: number,
  endDeg: number
) {
  ctx.moveTo(cx, cy);
  ctx.ellipse(cx, cy, rx, ry, 0, (startDeg * Math.PI) / 180, (endDeg * Math.PI) / 180);
  ctx.closePath();
}

function drawFromPoints(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, points: Point[]) {
  points.forEach(([px, py], i) => {
    const absX = x + (px / 100) * w;
    const absY = y + (py / 100) * h;
    if (i === 0) ctx.moveTo(absX, absY);
    else ctx.lineTo(absX, absY);
  });
  ctx.closePath();
}

function clipPoints(shapeType: ShapeType): Point[] | null {
  const clip = CLIP_PATHS[shapeType];
  if (!clip?.startsWith('polygon(')) return null;
  const inner = clip.slice(8, -1);
  return inner.split(',').map((pair) => {
    const [px, py] = pair.trim().split(/\s+/);
    return [parseFloat(px), parseFloat(py)] as Point;
  });
}

export function drawShapePath(
  ctx: CanvasRenderingContext2D,
  shapeType: ShapeType,
  x: number,
  y: number,
  w: number,
  h: number
) {
  const cx = x + w / 2;
  const cy = y + h / 2;

  ctx.beginPath();
  switch (shapeType) {
    case 'rect':
    case 'pill':
      return 'rect';
    case 'frame':
      return 'frame';
    case 'circle':
      ctx.ellipse(cx, cy, w / 2, h / 2, 0, 0, Math.PI * 2);
      break;
    case 'ring': {
      const outer = Math.min(w, h) / 2;
      const inner = outer * 0.55;
      ctx.arc(cx, cy, outer, 0, Math.PI * 2);
      ctx.moveTo(cx + inner, cy);
      ctx.arc(cx, cy, inner, 0, Math.PI * 2, true);
      break;
    }
    case 'line':
      ctx.rect(x, y, w, h);
      break;
    case 'triangle':
      ctx.moveTo(cx, y);
      ctx.lineTo(x, y + h);
      ctx.lineTo(x + w, y + h);
      ctx.closePath();
      break;
    case 'diamond':
      ctx.moveTo(cx, y);
      ctx.lineTo(x + w, cy);
      ctx.lineTo(cx, y + h);
      ctx.lineTo(x, cy);
      ctx.closePath();
      break;
    case 'pentagon':
      drawRegularPolygon(ctx, cx, cy, w / 2, h / 2, 5);
      break;
    case 'hexagon':
      drawRegularPolygon(ctx, cx, cy, w / 2, h / 2, 6);
      break;
    case 'heptagon':
      drawRegularPolygon(ctx, cx, cy, w / 2, h / 2, 7);
      break;
    case 'octagon':
      drawRegularPolygon(ctx, cx, cy, w / 2, h / 2, 8);
      break;
    case 'decagon':
      drawRegularPolygon(ctx, cx, cy, w / 2, h / 2, 10);
      break;
    case 'star':
      drawStar(ctx, cx, cy, Math.min(w, h) / 2, Math.min(w, h) * 0.2, 5);
      break;
    case 'star-4':
      drawStar(ctx, cx, cy, Math.min(w, h) / 2, Math.min(w, h) * 0.18, 4);
      break;
    case 'star-6':
      drawStar(ctx, cx, cy, Math.min(w, h) / 2, Math.min(w, h) * 0.22, 6);
      break;
    case 'burst':
      drawStar(ctx, cx, cy, Math.min(w, h) / 2, Math.min(w, h) * 0.28, 8);
      break;
    case 'flower':
      drawStar(ctx, cx, cy, Math.min(w, h) / 2, Math.min(w, h) * 0.31, 6);
      break;
    case 'gear':
      drawRegularPolygon(ctx, cx, cy, w / 2, h / 2, 12, -75);
      break;
    case 'semicircle':
      ctx.moveTo(x, cy);
      ctx.ellipse(cx, cy, w / 2, h / 2, 0, Math.PI, Math.PI * 2);
      ctx.closePath();
      break;
    case 'quarter-circle':
      ctx.moveTo(x, y + h);
      ctx.lineTo(x, y);
      ctx.lineTo(x + w, y);
      ctx.ellipse(x, y, w, h, 0, 0, Math.PI / 2);
      ctx.closePath();
      break;
    case 'moon':
      drawArcWedge(ctx, cx, cy, w / 2, h / 2, -0.7, Math.PI + 0.7);
      break;
    case 'crescent': {
      ctx.arc(cx, cy, Math.min(w, h) / 2, 0, Math.PI * 2);
      ctx.moveTo(cx + w * 0.15, cy);
      ctx.arc(cx + w * 0.22, cy, Math.min(w, h) * 0.42, 0, Math.PI * 2, true);
      break;
    }
    case 'heart': {
      const topCurveHeight = h * 0.3;
      ctx.moveTo(cx, y + topCurveHeight);
      ctx.bezierCurveTo(cx, y, x, y, x, y + topCurveHeight);
      ctx.bezierCurveTo(x, y + (h + topCurveHeight) / 2, cx, y + (h + topCurveHeight) / 2, cx, y + h);
      ctx.bezierCurveTo(
        cx,
        y + (h + topCurveHeight) / 2,
        x + w,
        y + (h + topCurveHeight) / 2,
        x + w,
        y + topCurveHeight
      );
      ctx.bezierCurveTo(x + w, y, cx, y, cx, y + topCurveHeight);
      ctx.closePath();
      break;
    }
    case 'arrow':
      ctx.moveTo(x, y + h * 0.2);
      ctx.lineTo(x + w * 0.6, y + h * 0.2);
      ctx.lineTo(x + w * 0.6, y);
      ctx.lineTo(x + w, cy);
      ctx.lineTo(x + w * 0.6, y + h);
      ctx.lineTo(x + w * 0.6, y + h * 0.8);
      ctx.lineTo(x, y + h * 0.8);
      ctx.closePath();
      break;
    default: {
      const points = clipPoints(shapeType);
      if (points) {
        drawFromPoints(ctx, x, y, w, h, points);
      } else {
        ctx.rect(x, y, w, h);
      }
    }
  }
  return 'path';
}
