import { detectExportFormat, formatExtension } from './geometry';
import { getPdfPageCount, renderPdfPage } from './loadPdfPage';
import type { DocumentMeta, ExportFormat, SourceKind } from '../types';

export type LoadedDocument = {
  image: HTMLImageElement;
  meta: DocumentMeta;
  pdfData?: ArrayBuffer;
  numPages?: number;
};

function isPdfFile(file: File) {
  return file.type === 'application/pdf' || file.name.toLowerCase().endsWith('.pdf');
}

export async function readDocumentFile(file: File): Promise<LoadedDocument | null> {
  if (isPdfFile(file)) {
    const pdfData = await file.arrayBuffer();
    const numPages = await getPdfPageCount(pdfData);
    const image = await renderPdfPage(pdfData, 1);
    const base = file.name.replace(/\.[^.]+$/, '') || 'document';
    return {
      image,
      pdfData,
      numPages,
      meta: {
        name: `${base}-annotated.pdf`,
        mimeType: 'application/pdf',
        format: 'pdf',
        sourceKind: 'pdf',
      },
    };
  }

  if (!file.type.startsWith('image/')) return null;

  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = () => {
      const img = new Image();
      img.onload = () => {
        const format = detectExportFormat(file.type, file.name);
        const base = file.name.replace(/\.[^.]+$/, '') || 'image';
        resolve({
          image: img,
          meta: {
            name: `${base}-annotated.${formatExtension(format)}`,
            mimeType: file.type || 'image/png',
            format,
            sourceKind: 'image',
          },
        });
      };
      img.onerror = () => resolve(null);
      img.src = reader.result as string;
    };
    reader.onerror = () => resolve(null);
    reader.readAsDataURL(file);
  });
}

/** @deprecated alias */
export function readImageFile(file: File, onLoad: (image: HTMLImageElement, meta: DocumentMeta) => void) {
  void readDocumentFile(file).then((loaded) => {
    if (loaded) onLoad(loaded.image, loaded.meta);
  });
}

export function defaultMeta(format: ExportFormat = 'png', sourceKind: SourceKind = 'image'): DocumentMeta {
  return {
    name: `annotated-document.${formatExtension(format)}`,
    mimeType: format === 'jpeg' ? 'image/jpeg' : format === 'webp' ? 'image/webp' : 'image/png',
    format,
    sourceKind,
  };
}
