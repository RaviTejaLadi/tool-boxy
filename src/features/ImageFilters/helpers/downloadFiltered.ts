import type { ExportFormat } from '../constants';
import { EXPORT_FORMATS, JPEG_QUALITY } from '../constants';
import type { SourceImage } from '../stores';

function filteredFileName(sourceName: string, filterId: string, extension: string): string {
  const base = sourceName.replace(/\.[^.]+$/, '') || 'image';
  return `${base}-${filterId}.${extension}`;
}

function loadImage(dataUrl: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error('Failed to load image for export'));
    img.src = dataUrl;
  });
}

function stripOpacity(css: string): string {
  return css.replace(/\s*opacity\([^)]+\)/g, '').trim();
}

export async function downloadFiltered(
  source: SourceImage,
  filterCss: string,
  intensity: number,
  filterId: string,
  format: ExportFormat,
  settingsOpacity: number
): Promise<void> {
  const img = await loadImage(source.dataUrl);
  const canvas = document.createElement('canvas');
  canvas.width = img.naturalWidth || img.width;
  canvas.height = img.naturalHeight || img.height;

  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Canvas unavailable');

  const formatMeta = EXPORT_FORMATS.find((f) => f.id === format) ?? EXPORT_FORMATS[0];
  const amount = Math.max(0, Math.min(100, intensity)) / 100;
  const opacity = Math.max(0, Math.min(100, settingsOpacity)) / 100;
  const css = stripOpacity(filterCss);

  if (format !== 'png') {
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  } else {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  }

  // Build result on an offscreen canvas at full opacity, then apply settings opacity once
  const layer = document.createElement('canvas');
  layer.width = canvas.width;
  layer.height = canvas.height;
  const lctx = layer.getContext('2d');
  if (!lctx) throw new Error('Canvas unavailable');

  if (!css || amount <= 0) {
    lctx.drawImage(img, 0, 0, layer.width, layer.height);
  } else if (amount >= 1) {
    lctx.filter = css;
    lctx.drawImage(img, 0, 0, layer.width, layer.height);
  } else {
    lctx.drawImage(img, 0, 0, layer.width, layer.height);
    lctx.filter = css;
    lctx.globalAlpha = amount;
    lctx.drawImage(img, 0, 0, layer.width, layer.height);
  }

  ctx.globalAlpha = opacity;
  ctx.drawImage(layer, 0, 0);
  ctx.globalAlpha = 1;

  const quality = format === 'png' ? undefined : JPEG_QUALITY;
  const blob = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, formatMeta.mime, quality));
  if (!blob) throw new Error('Failed to export image');

  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filteredFileName(source.name, filterId, formatMeta.extension);
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}
