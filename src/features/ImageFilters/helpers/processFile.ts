import { VALID_IMAGE_TYPES } from '../constants';
import { formatSize } from './formatSize';
import type { SourceImage } from '../stores';

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

export async function processFile(file: File | null | undefined): Promise<SourceImage | null> {
  if (!file) return null;

  const isImage = file.type.startsWith('image/') || (VALID_IMAGE_TYPES as readonly string[]).includes(file.type);
  if (!isImage && !file.name.match(/\.(png|jpe?g|gif|webp|svg|bmp|tiff?|ico)$/i)) {
    return null;
  }

  const dataUrl = await readFileAsDataUrl(file);
  const { width, height } = await loadImageDimensions(dataUrl);

  return {
    id: `${file.name}-${Date.now()}-${Math.random().toString(36).slice(2)}`,
    name: file.name || `pasted-image-${Date.now()}`,
    size: formatSize(file.size),
    rawBytes: file.size,
    dataUrl,
    width,
    height,
    mimeType: file.type || 'image/png',
  };
}

export async function processFiles(files: FileList | File[] | null): Promise<SourceImage | null> {
  if (!files || files.length === 0) return null;
  const first = Array.from(files).find(
    (f) => f.type.startsWith('image/') || f.name.match(/\.(png|jpe?g|gif|webp|svg|bmp|tiff?|ico)$/i)
  );
  return processFile(first);
}
