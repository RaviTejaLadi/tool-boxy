import type { ShapeType } from '../types';

export function shapeClipPath(shapeType: ShapeType): string | undefined {
  switch (shapeType) {
    case 'triangle':
      return 'polygon(50% 0%, 0% 100%, 100% 100%)';
    case 'star':
      return 'polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%)';
    case 'diamond':
      return 'polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)';
    case 'hexagon':
      return 'polygon(25% 0%, 75% 0%, 100% 50%, 75% 100%, 25% 100%, 0% 50%)';
    case 'heart':
      return 'polygon(50% 18%, 61% 6%, 75% 6%, 88% 18%, 88% 38%, 50% 88%, 12% 38%, 12% 18%, 25% 6%, 39% 6%)';
    case 'arrow':
      return 'polygon(0% 20%, 60% 20%, 60% 0%, 100% 50%, 60% 100%, 60% 80%, 0% 80%)';
    default:
      return undefined;
  }
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
    case 'circle':
      ctx.ellipse(cx, cy, w / 2, h / 2, 0, 0, Math.PI * 2);
      break;
    case 'triangle':
      ctx.moveTo(cx, y);
      ctx.lineTo(x, y + h);
      ctx.lineTo(x + w, y + h);
      ctx.closePath();
      break;
    case 'line':
      ctx.rect(x, y, w, h);
      break;
    case 'star': {
      const outer = Math.min(w, h) / 2;
      const inner = outer * 0.4;
      for (let i = 0; i < 10; i++) {
        const r = i % 2 === 0 ? outer : inner;
        const angle = (Math.PI / 5) * i - Math.PI / 2;
        const px = cx + r * Math.cos(angle);
        const py = cy + r * Math.sin(angle);
        if (i === 0) ctx.moveTo(px, py);
        else ctx.lineTo(px, py);
      }
      ctx.closePath();
      break;
    }
    case 'diamond':
      ctx.moveTo(cx, y);
      ctx.lineTo(x + w, cy);
      ctx.lineTo(cx, y + h);
      ctx.lineTo(x, cy);
      ctx.closePath();
      break;
    case 'hexagon': {
      const rx = w / 2;
      const ry = h / 2;
      for (let i = 0; i < 6; i++) {
        const angle = (Math.PI / 3) * i - Math.PI / 6;
        const px = cx + rx * Math.cos(angle);
        const py = cy + ry * Math.sin(angle);
        if (i === 0) ctx.moveTo(px, py);
        else ctx.lineTo(px, py);
      }
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
    default:
      ctx.rect(x, y, w, h);
  }
  return 'path';
}

export function getShapeBorderRadius(shapeType: ShapeType, radius: number, scale = 1): string | undefined {
  if (shapeType === 'circle') return '9999px';
  if (shapeType === 'rect') return `${radius * scale}px`;
  if (shapeType === 'pill') return `${9999}px`;
  return undefined;
}
