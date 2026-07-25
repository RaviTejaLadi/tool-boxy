import JSZip from 'jszip';
import type { GeneratedFavicon } from '../stores';
import { buildFaviconPackage } from './generateFavicons';

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

export function downloadFavicon(favicon: GeneratedFavicon): void {
  const link = document.createElement('a');
  link.href = favicon.dataUrl;
  link.download = favicon.fileName;
  document.body.appendChild(link);
  link.click();
  link.remove();
}

/** Download the full favicon package as a ZIP archive. */
export async function downloadAllFavicons(imageDataUrl: string): Promise<void> {
  const files = await buildFaviconPackage(imageDataUrl);
  const zip = new JSZip();

  for (const file of files) {
    zip.file(file.name, file.data);
  }

  const blob = await zip.generateAsync({ type: 'blob' });
  triggerDownload(blob, 'favicons.zip');
}
