import JSZip from 'jszip';
import type { ConvertedImage } from '../stores';

function triggerDownload(blob: Blob, fileName: string): void {
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = fileName;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}

export function downloadConverted(image: ConvertedImage): void {
  triggerDownload(image.blob, image.name);
}

export async function downloadAllConverted(images: ConvertedImage[]): Promise<void> {
  if (images.length === 0) return;

  if (images.length === 1) {
    downloadConverted(images[0]);
    return;
  }

  const zip = new JSZip();
  const usedNames = new Set<string>();

  for (const image of images) {
    let name = image.name;
    let i = 1;
    while (usedNames.has(name)) {
      const base = image.name.replace(/(\.[^.]+)$/, '');
      const ext = image.name.match(/(\.[^.]+)$/)?.[1] ?? '';
      name = `${base}-${i}${ext}`;
      i += 1;
    }
    usedNames.add(name);
    zip.file(name, image.blob);
  }

  const blob = await zip.generateAsync({ type: 'blob' });
  triggerDownload(blob, 'converted-images.zip');
}
