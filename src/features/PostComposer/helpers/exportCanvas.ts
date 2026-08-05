import type { Background, CanvasElement, Format } from '../types';
import { drawRoundedRect, loadImage, paintGradient, wrapCanvasText } from './canvasUtils';
import { drawShapePath } from './shapePaths';

export async function exportCanvas(format: Format, background: Background, elements: CanvasElement[]) {
  const canvas = document.createElement('canvas');
  canvas.width = format.w;
  canvas.height = format.h;
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Could not get canvas context');

  ctx.fillStyle =
    background.type === 'color' ? background.value : paintGradient(ctx, background.value, format.w, format.h);
  ctx.fillRect(0, 0, format.w, format.h);

  for (const el of elements) {
    ctx.save();
    ctx.globalAlpha = el.opacity ?? 1;
    const cx = el.x + el.width / 2;
    const cy = el.y + el.height / 2;
    ctx.translate(cx, cy);
    ctx.rotate(((el.rotation || 0) * Math.PI) / 180);
    ctx.translate(-cx, -cy);

    if (el.type === 'shape') {
      ctx.fillStyle = el.fill;
      if (el.shapeType === 'rect') {
        drawRoundedRect(ctx, el.x, el.y, el.width, el.height, el.radius || 0);
        ctx.fill();
      } else if (el.shapeType === 'pill') {
        drawRoundedRect(ctx, el.x, el.y, el.width, el.height, el.height / 2);
        ctx.fill();
      } else if (el.shapeType === 'frame') {
        const thickness = Math.max(12, Math.min(el.width, el.height) * 0.08);
        drawRoundedRect(ctx, el.x, el.y, el.width, el.height, el.radius || 0);
        drawRoundedRect(
          ctx,
          el.x + thickness,
          el.y + thickness,
          el.width - thickness * 2,
          el.height - thickness * 2,
          Math.max(0, (el.radius || 0) - thickness)
        );
        ctx.fill('evenodd');
      } else {
        const mode = drawShapePath(ctx, el.shapeType, el.x, el.y, el.width, el.height);
        if (mode === 'rect') {
          drawRoundedRect(ctx, el.x, el.y, el.width, el.height, el.radius || 0);
        }
        if (el.shapeType === 'ring' || el.shapeType === 'crescent') {
          ctx.fill('evenodd');
        } else {
          ctx.fill();
        }
      }
      if (el.stroke && el.strokeWidth) {
        ctx.strokeStyle = el.stroke;
        ctx.lineWidth = el.strokeWidth;
        ctx.stroke();
      }
    } else if (el.type === 'text') {
      ctx.fillStyle = el.color;
      ctx.font = `${el.fontWeight} ${el.fontSize}px ${el.fontFamily}`;
      ctx.textBaseline = 'top';
      const lines = wrapCanvasText(ctx, el.text, el.width);
      const lineHeight = el.fontSize * (el.lineHeight || 1.25);
      let tx = el.x;
      ctx.textAlign = el.align || 'left';
      if (el.align === 'center') tx = el.x + el.width / 2;
      else if (el.align === 'right') tx = el.x + el.width;
      lines.forEach((line, i) => ctx.fillText(line, tx, el.y + i * lineHeight));
    } else if (el.type === 'image') {
      try {
        const img = await loadImage(el.src);
        ctx.drawImage(img, el.x, el.y, el.width, el.height);
      } catch {
        /* skip broken image */
      }
    }
    ctx.restore();
  }

  return new Promise<Blob | null>((resolve) => {
    canvas.toBlob((blob) => resolve(blob), 'image/png');
  });
}

export async function exportAllSlides(
  format: Format,
  slides: { name: string; background: Background; elements: CanvasElement[] }[]
) {
  const blobs: { name: string; blob: Blob }[] = [];
  for (let i = 0; i < slides.length; i++) {
    const slide = slides[i];
    const blob = await exportCanvas(format, slide.background, slide.elements);
    if (blob) blobs.push({ name: `${slide.name || `slide-${i + 1}`}.png`, blob });
  }
  return blobs;
}
