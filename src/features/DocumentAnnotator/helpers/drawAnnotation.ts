import { calloutRadius, norm } from './geometry';
import type { Annotation } from '../types';

function applyStrokeStyle(ctx: CanvasRenderingContext2D, a: Annotation) {
  ctx.strokeStyle = a.color;
  ctx.lineWidth = a.strokeWidth;
  ctx.setLineDash(a.dashed ? [Math.max(4, a.strokeWidth * 2), Math.max(3, a.strokeWidth * 1.5)] : []);
}

function drawPixelate(
  ctx: CanvasRenderingContext2D,
  image: HTMLImageElement,
  x: number,
  y: number,
  w: number,
  h: number
) {
  const block = Math.max(4, Math.round(Math.min(w, h) / 16));
  const tw = Math.max(1, Math.floor(w / block));
  const th = Math.max(1, Math.floor(h / block));
  const tmp = document.createElement('canvas');
  tmp.width = tw;
  tmp.height = th;
  const tctx = tmp.getContext('2d');
  if (!tctx) return;
  tctx.imageSmoothingEnabled = false;
  tctx.drawImage(image, x, y, w, h, 0, 0, tw, th);
  ctx.imageSmoothingEnabled = false;
  ctx.drawImage(tmp, x, y, w, h);
  ctx.imageSmoothingEnabled = true;
}

export function drawAnnotation(ctx: CanvasRenderingContext2D, a: Annotation, image?: HTMLImageElement | null) {
  ctx.save();
  ctx.globalAlpha = a.opacity ?? 1;
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';

  if (a.type === 'rect') {
    const r = norm(a.x, a.y, a.w, a.h);
    applyStrokeStyle(ctx, a);
    if (a.filled) {
      ctx.fillStyle = a.color;
      ctx.globalAlpha = (a.opacity ?? 1) * 0.35;
      ctx.fillRect(r.x, r.y, r.w, r.h);
      ctx.globalAlpha = a.opacity ?? 1;
    }
    ctx.strokeRect(r.x, r.y, r.w, r.h);
  } else if (a.type === 'highlight') {
    const r = norm(a.x, a.y, a.w, a.h);
    ctx.globalAlpha = (a.opacity ?? 1) * 0.35;
    ctx.fillStyle = a.color;
    ctx.fillRect(r.x, r.y, r.w, r.h);
  } else if (a.type === 'redact') {
    const r = norm(a.x, a.y, a.w, a.h);
    if (image && r.w > 1 && r.h > 1) {
      drawPixelate(ctx, image, r.x, r.y, r.w, r.h);
    } else {
      ctx.fillStyle = '#0f172a';
      ctx.fillRect(r.x, r.y, r.w, r.h);
    }
  } else if (a.type === 'mask') {
    const r = norm(a.x, a.y, a.w, a.h);
    ctx.fillStyle = '#000000';
    ctx.fillRect(r.x, r.y, r.w, r.h);
  } else if (a.type === 'ellipse') {
    const r = norm(a.x, a.y, a.w, a.h);
    applyStrokeStyle(ctx, a);
    const path = () => {
      ctx.beginPath();
      ctx.ellipse(r.x + r.w / 2, r.y + r.h / 2, Math.max(r.w / 2, 0.01), Math.max(r.h / 2, 0.01), 0, 0, Math.PI * 2);
    };
    if (a.filled) {
      path();
      ctx.fillStyle = a.color;
      ctx.globalAlpha = (a.opacity ?? 1) * 0.35;
      ctx.fill();
      ctx.globalAlpha = a.opacity ?? 1;
    }
    path();
    ctx.stroke();
  } else if (a.type === 'line' || a.type === 'arrow') {
    const [p0, p1] = a.points;
    if (!p0 || !p1) {
      ctx.restore();
      return;
    }
    applyStrokeStyle(ctx, a);
    ctx.beginPath();
    ctx.moveTo(p0.x, p0.y);
    ctx.lineTo(p1.x, p1.y);
    ctx.stroke();
    if (a.type === 'arrow') {
      ctx.setLineDash([]);
      const angle = Math.atan2(p1.y - p0.y, p1.x - p0.x);
      const headLen = Math.max(12, a.strokeWidth * 3.2);
      const spread = Math.PI / 7;
      ctx.beginPath();
      ctx.moveTo(p1.x, p1.y);
      ctx.lineTo(p1.x - headLen * Math.cos(angle - spread), p1.y - headLen * Math.sin(angle - spread));
      ctx.lineTo(p1.x - headLen * Math.cos(angle + spread), p1.y - headLen * Math.sin(angle + spread));
      ctx.closePath();
      ctx.fillStyle = a.color;
      ctx.fill();
    }
  } else if (a.type === 'pen') {
    if (a.points.length < 2) {
      ctx.restore();
      return;
    }
    applyStrokeStyle(ctx, a);
    ctx.beginPath();
    ctx.moveTo(a.points[0].x, a.points[0].y);
    for (let i = 1; i < a.points.length; i++) {
      ctx.lineTo(a.points[i].x, a.points[i].y);
    }
    ctx.stroke();
  } else if (a.type === 'text') {
    ctx.font = `600 ${a.fontSize}px ui-sans-serif, system-ui, sans-serif`;
    ctx.textBaseline = 'top';
    ctx.fillStyle = a.color;
    ctx.fillText(a.text, a.x, a.y);
  } else if (a.type === 'callout') {
    const r = calloutRadius(a);
    ctx.beginPath();
    ctx.arc(a.x, a.y, r, 0, Math.PI * 2);
    ctx.fillStyle = a.color;
    ctx.fill();
    ctx.lineWidth = Math.max(2, a.strokeWidth * 0.5);
    ctx.strokeStyle = '#ffffff';
    ctx.setLineDash([]);
    ctx.stroke();
    ctx.fillStyle = '#ffffff';
    ctx.font = `700 ${a.fontSize}px ui-sans-serif, system-ui, sans-serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(String(a.number), a.x, a.y + 1);
  }
  ctx.restore();
}
