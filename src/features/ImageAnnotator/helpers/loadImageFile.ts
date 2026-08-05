import { detectExportFormat, formatExtension } from './geometry';
import type { ExportFormat, ImageMeta } from '../types';

export function readImageFile(file: File, onLoad: (image: HTMLImageElement, meta: ImageMeta) => void) {
  if (!file.type.startsWith('image/')) return;
  const reader = new FileReader();
  reader.onload = () => {
    const img = new Image();
    img.onload = () => {
      const format = detectExportFormat(file.type, file.name);
      const base = file.name.replace(/\.[^.]+$/, '') || 'image';
      onLoad(img, {
        name: `${base}-annotated.${formatExtension(format)}`,
        mimeType: file.type || 'image/png',
        format,
      });
    };
    img.src = reader.result as string;
  };
  reader.readAsDataURL(file);
}

export function defaultMeta(format: ExportFormat = 'png'): ImageMeta {
  return {
    name: `annotated-image.${formatExtension(format)}`,
    mimeType: format === 'jpeg' ? 'image/jpeg' : format === 'webp' ? 'image/webp' : 'image/png',
    format,
  };
}
