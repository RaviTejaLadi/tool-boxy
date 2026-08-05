import { jsPDF } from 'jspdf';
import { drawAnnotation } from './drawAnnotation';
import { formatExtension, formatMime } from './geometry';
import { renderPdfPage } from './loadPdfPage';
import type { Annotation, ExportFormat, PageState } from '../types';

function annotatedFileName(fileName: string | undefined, format: ExportFormat) {
  const ext = formatExtension(format);
  return (
    (fileName || 'annotated-document').replace(/\.(png|jpe?g|webp|pdf)$/i, '').replace(/-annotated$/i, '') +
    `-annotated.${ext}`
  );
}

export function renderAnnotatedCanvas(
  image: HTMLImageElement,
  annotations: Annotation[],
  options: { fillWhite?: boolean } = {}
) {
  const canvas = document.createElement('canvas');
  canvas.width = image.naturalWidth;
  canvas.height = image.naturalHeight;
  const ctx = canvas.getContext('2d');
  if (!ctx) return null;

  if (options.fillWhite) {
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }

  ctx.drawImage(image, 0, 0);
  for (const a of annotations) drawAnnotation(ctx, a, image);
  return canvas;
}

function downloadDataUrl(url: string, fileName: string) {
  const link = document.createElement('a');
  link.href = url;
  link.download = fileName;
  link.click();
}

export function exportAnnotatedImage(
  image: HTMLImageElement,
  annotations: Annotation[],
  options: {
    fileName?: string;
    format?: Exclude<ExportFormat, 'pdf'>;
    quality?: number;
  } = {}
) {
  const format = options.format ?? 'png';
  const quality = options.quality ?? 0.92;
  const canvas = renderAnnotatedCanvas(image, annotations, { fillWhite: format === 'jpeg' });
  if (!canvas) return;

  const mime = formatMime(format);
  const url = format === 'png' ? canvas.toDataURL(mime) : canvas.toDataURL(mime, quality);
  downloadDataUrl(url, annotatedFileName(options.fileName, format));
}

function appendCanvasToPdf(pdf: jsPDF | null, canvas: HTMLCanvasElement): jsPDF {
  const width = canvas.width;
  const height = canvas.height;
  const data = canvas.toDataURL('image/jpeg', 0.92);
  const orientation = width >= height ? 'landscape' : 'portrait';

  if (!pdf) {
    const doc = new jsPDF({
      orientation,
      unit: 'pt',
      format: [width, height],
    });
    doc.addImage(data, 'JPEG', 0, 0, width, height);
    return doc;
  }

  pdf.addPage([width, height], orientation);
  pdf.addImage(data, 'JPEG', 0, 0, width, height);
  return pdf;
}

export async function exportAnnotatedPdf(options: {
  fileName?: string;
  image: HTMLImageElement;
  annotations: Annotation[];
  sourceKind: 'image' | 'pdf' | null;
  pdfData: ArrayBuffer | null;
  numPages: number;
  pageNumber: number;
  pageStates: Record<number, PageState>;
  history: Annotation[][];
  historyIndex: number;
}) {
  const { fileName, image, annotations, sourceKind, pdfData, numPages, pageNumber, pageStates, history, historyIndex } =
    options;

  let pdf: jsPDF | null = null;

  if (sourceKind === 'pdf' && pdfData && numPages > 0) {
    for (let page = 1; page <= numPages; page++) {
      const pageImage = page === pageNumber ? image : await renderPdfPage(pdfData, page);
      const state = page === pageNumber ? { history, historyIndex, nextCallout: 1 } : pageStates[page];
      const marks = state?.history[state.historyIndex] ?? (page === pageNumber ? annotations : []);
      const canvas = renderAnnotatedCanvas(pageImage, marks, { fillWhite: true });
      if (!canvas) continue;
      pdf = appendCanvasToPdf(pdf, canvas);
    }
  } else {
    const canvas = renderAnnotatedCanvas(image, annotations, { fillWhite: true });
    if (!canvas) return;
    pdf = appendCanvasToPdf(null, canvas);
  }

  if (!pdf) return;
  pdf.save(annotatedFileName(fileName, 'pdf'));
}

export async function exportAnnotatedDocument(options: {
  fileName?: string;
  format: ExportFormat;
  quality?: number;
  image: HTMLImageElement;
  annotations: Annotation[];
  sourceKind: 'image' | 'pdf' | null;
  pdfData: ArrayBuffer | null;
  numPages: number;
  pageNumber: number;
  pageStates: Record<number, PageState>;
  history: Annotation[][];
  historyIndex: number;
}) {
  if (options.format === 'pdf') {
    await exportAnnotatedPdf(options);
    return;
  }

  exportAnnotatedImage(options.image, options.annotations, {
    fileName: options.fileName,
    format: options.format,
    quality: options.quality,
  });
}

/** @deprecated */
export function exportAnnotatedPng(
  image: HTMLImageElement,
  annotations: Annotation[],
  filename = 'annotated-image.png'
) {
  exportAnnotatedImage(image, annotations, { fileName: filename, format: 'png' });
}
