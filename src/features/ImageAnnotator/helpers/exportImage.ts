import { drawAnnotation } from './drawAnnotation';
import { formatExtension, formatMime } from './geometry';
import type { Annotation, ExportFormat } from '../types';

export function exportAnnotatedImage(
  image: HTMLImageElement,
  annotations: Annotation[],
  options: {
    fileName?: string;
    format?: ExportFormat;
    quality?: number;
  } = {}
) {
  const format = options.format ?? 'png';
  const quality = options.quality ?? 0.92;
  const off = document.createElement('canvas');
  off.width = image.naturalWidth;
  off.height = image.naturalHeight;
  const ctx = off.getContext('2d');
  if (!ctx) return;

  if (format === 'jpeg') {
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, off.width, off.height);
  }

  ctx.drawImage(image, 0, 0);
  for (const a of annotations) drawAnnotation(ctx, a, image);

  const mime = formatMime(format);
  const ext = formatExtension(format);
  const base =
    (options.fileName || 'annotated-image').replace(/\.(png|jpe?g|webp)$/i, '').replace(/-annotated$/i, '') +
    `-annotated.${ext}`;

  const url = format === 'png' ? off.toDataURL(mime) : off.toDataURL(mime, quality);
  const link = document.createElement('a');
  link.href = url;
  link.download = base;
  link.click();
}

/** @deprecated use exportAnnotatedImage */
export function exportAnnotatedPng(
  image: HTMLImageElement,
  annotations: Annotation[],
  filename = 'annotated-image.png'
) {
  exportAnnotatedImage(image, annotations, { fileName: filename, format: 'png' });
}
