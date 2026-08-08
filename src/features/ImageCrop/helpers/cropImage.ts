import type { CropArea, SourceImage } from '../stores';
import { formatSize } from './formatSize';

export interface CroppedImage {
  dataUrl: string;
  blob: Blob;
  width: number;
  height: number;
  size: string;
  rawBytes: number;
  name: string;
}

function dataUrlToBlob(dataUrl: string): Blob {
  const [header, data] = dataUrl.split(',');
  const mime = header.match(/:(.*?);/)?.[1] ?? 'image/png';
  const binary = atob(data);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
  return new Blob([bytes], { type: mime });
}

function croppedFileName(sourceName: string): string {
  const base = sourceName.replace(/\.[^.]+$/, '') || 'image';
  return `${base}-cropped.png`;
}

export async function cropImage(
  source: SourceImage,
  cropArea: CropArea,
  displaySize: { width: number; height: number }
): Promise<CroppedImage> {
  const img = await new Promise<HTMLImageElement>((resolve, reject) => {
    const el = new Image();
    el.onload = () => resolve(el);
    el.onerror = () => reject(new Error('Failed to load image for crop'));
    el.src = source.dataUrl;
  });

  const scaleX = img.naturalWidth / displaySize.width;
  const scaleY = img.naturalHeight / displaySize.height;

  const sx = cropArea.x * scaleX;
  const sy = cropArea.y * scaleY;
  const sw = cropArea.width * scaleX;
  const sh = cropArea.height * scaleY;

  const canvas = document.createElement('canvas');
  canvas.width = Math.max(1, Math.round(sw));
  canvas.height = Math.max(1, Math.round(sh));

  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Canvas unavailable');

  ctx.drawImage(img, sx, sy, sw, sh, 0, 0, canvas.width, canvas.height);

  const dataUrl = canvas.toDataURL('image/png');
  const blob = dataUrlToBlob(dataUrl);

  return {
    dataUrl,
    blob,
    width: canvas.width,
    height: canvas.height,
    size: formatSize(blob.size),
    rawBytes: blob.size,
    name: croppedFileName(source.name),
  };
}

export function downloadCropped(cropped: CroppedImage): void {
  const url = URL.createObjectURL(cropped.blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = cropped.name;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}
