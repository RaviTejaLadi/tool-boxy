import { VALID_IMAGE_TYPES } from '../constants';
import { formatSize } from './formatSize';
import type { EncodedImage } from '../stores';

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

export async function processFiles(files: FileList | File[] | null): Promise<{
  images: EncodedImage[];
  skipped: string[];
  failed: string[];
}> {
  if (!files) return { images: [], skipped: [], failed: [] };

  const fileArray = Array.from(files);
  const images: EncodedImage[] = [];
  const skipped: string[] = [];
  const failed: string[] = [];

  for (const file of fileArray) {
    if (!(VALID_IMAGE_TYPES as readonly string[]).includes(file.type)) {
      skipped.push(file.name);
      continue;
    }

    try {
      const dataUri = await readFileAsDataUrl(file);
      const base64 = dataUri.split(',')[1] || '';
      images.push({
        id: `${file.name}-${Date.now()}-${Math.random().toString(36).slice(2)}`,
        name: file.name || `pasted-image-${Date.now()}`,
        size: formatSize(file.size),
        rawBytes: file.size,
        dataUri,
        base64,
        mimeType: file.type,
      });
    } catch {
      failed.push(file.name);
    }
  }

  return { images, skipped, failed };
}
