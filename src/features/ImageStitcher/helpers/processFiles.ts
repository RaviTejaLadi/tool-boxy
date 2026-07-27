import {
  DEFAULT_BLEND_MODE,
  DEFAULT_OBJECT_FIT,
  DEFAULT_OPACITY,
  DEFAULT_ROTATION,
  DEFAULT_SCALE,
  VALID_IMAGE_TYPES,
} from '../constants';
import type { StitchImage } from '../stores';
import { formatSize } from './formatSize';

function readFileAsDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result;
      if (typeof result === 'string') resolve(result);
      else reject(new Error('Failed to read file'));
    };
    reader.onerror = () => reject(new Error(`Failed to read ${file.name}`));
    reader.readAsDataURL(file);
  });
}

function loadImageDimensions(dataUrl: string): Promise<{ width: number; height: number }> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve({ width: img.naturalWidth, height: img.naturalHeight });
    img.onerror = () => reject(new Error('Failed to decode image'));
    img.src = dataUrl;
  });
}

function isImageFile(file: File): boolean {
  return (
    file.type.startsWith('image/') ||
    (VALID_IMAGE_TYPES as readonly string[]).includes(file.type) ||
    Boolean(file.name.match(/\.(png|jpe?g|gif|webp|svg|bmp|tiff?|ico)$/i))
  );
}

export async function processFile(file: File | null | undefined): Promise<StitchImage | null> {
  if (!file || !isImageFile(file)) return null;

  const dataUrl = await readFileAsDataUrl(file);
  const { width, height } = await loadImageDimensions(dataUrl);

  return {
    id: `${file.name}-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
    name: file.name || `pasted-image-${Date.now()}`,
    size: formatSize(file.size),
    rawBytes: file.size,
    dataUrl,
    width,
    height,
    mimeType: file.type || 'image/png',
    scale: DEFAULT_SCALE,
    fit: DEFAULT_OBJECT_FIT,
    blendMode: DEFAULT_BLEND_MODE,
    opacity: DEFAULT_OPACITY,
    rotation: DEFAULT_ROTATION,
    flipX: false,
    flipY: false,
  };
}

export async function processFiles(files: FileList | File[] | null): Promise<StitchImage[]> {
  if (!files || files.length === 0) return [];

  const results: StitchImage[] = [];
  for (const file of Array.from(files)) {
    const image = await processFile(file);
    if (image) results.push(image);
  }
  return results;
}
