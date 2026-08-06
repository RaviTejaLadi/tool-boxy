import JSZip from 'jszip';
import { degrees, PDFDocument } from 'pdf-lib';
import { pdfjs } from 'react-pdf';

type RotateBy = 90 | 180 | 270;

export interface SplitResult {
  blob: Blob;
  outputCount: number;
}

export interface OrganizeOptions {
  pageOrder: string;
  removePages: string;
  duplicatePages: string;
  rotatePages: string;
  rotateBy: RotateBy;
}

export interface PdfTextExportResult {
  blob: Blob;
  pageCount: number;
  wordCount: number;
}

export interface RemovePdfPageResult {
  file: File;
  removedPage: File;
  removedPageNumber: number;
  remainingPages: number;
}

let workerConfigured = false;

export function ensurePdfWorker() {
  if (workerConfigured) return;
  pdfjs.GlobalWorkerOptions.workerSrc = new URL('pdfjs-dist/build/pdf.worker.min.mjs', import.meta.url).toString();
  workerConfigured = true;
}

export function isPdfFile(file: File | null | undefined): file is File {
  if (!file) return false;
  return file.type === 'application/pdf' || file.name.toLowerCase().endsWith('.pdf');
}

export function processPdfFiles(files: FileList | File[] | null): File | null {
  if (!files || files.length === 0) return null;
  const file = Array.from(files).find(isPdfFile) ?? null;
  return file;
}

export function processPdfFileList(files: FileList | File[] | null): File[] {
  if (!files || files.length === 0) return [];
  return Array.from(files).filter(isPdfFile);
}

export function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

export function downloadPdf(file: File) {
  downloadBlob(file, file.name);
}

export function printPdf(file: File) {
  const url = URL.createObjectURL(file);
  const win = window.open(url, '_blank');
  if (win) {
    win.onload = () => {
      win.print();
    };
  }
}

export function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function getBaseFileName(fileName: string): string {
  return fileName.replace(/\.[^/.]+$/, '') || 'document';
}

function slugifyToken(value: string): string {
  return (
    value
      .replace(/[^0-9-]+/g, '-')
      .replace(/--+/g, '-')
      .replace(/^-|-$/g, '') || 'pages'
  );
}

function createNumericRange(start: number, end: number): number[] {
  const step = start <= end ? 1 : -1;
  const values: number[] = [];
  for (let current = start; step > 0 ? current <= end : current >= end; current += step) {
    values.push(current);
  }
  return values;
}

function parsePageChunks(input: string): string[] {
  return input
    .split(',')
    .map((token) => token.trim())
    .filter(Boolean);
}

function parsePageToken(token: string, maxPages: number, preserveOrder: boolean): number[] {
  const singleMatch = token.match(/^\d+$/);
  if (singleMatch) {
    const page = Number.parseInt(token, 10);
    if (page < 1 || page > maxPages) {
      throw new Error(`Page ${page} is outside of 1-${maxPages}.`);
    }
    return [page];
  }

  const rangeMatch = token.match(/^(\d+)\s*-\s*(\d+)$/);
  if (!rangeMatch) {
    throw new Error(`Invalid page token "${token}". Use values like 1,3,5-8.`);
  }

  const start = Number.parseInt(rangeMatch[1], 10);
  const end = Number.parseInt(rangeMatch[2], 10);
  if (start < 1 || start > maxPages || end < 1 || end > maxPages) {
    throw new Error(`Range ${start}-${end} is outside of 1-${maxPages}.`);
  }

  const values = createNumericRange(start, end);
  return preserveOrder ? values : values.sort((a, b) => a - b);
}

function parsePageExpression(input: string, maxPages: number, preserveOrder: boolean): number[] {
  const chunks = parsePageChunks(input);
  if (chunks.length === 0) {
    throw new Error('Please enter at least one page number.');
  }

  const values = chunks.flatMap((chunk) => parsePageToken(chunk, maxPages, preserveOrder));
  if (preserveOrder) return values;

  return Array.from(new Set(values)).sort((a, b) => a - b);
}

function parseOptionalPageExpression(input: string, maxPages: number, preserveOrder: boolean): number[] {
  if (!input.trim()) return [];
  return parsePageExpression(input, maxPages, preserveOrder);
}

async function readFileAsUint8Array(file: File): Promise<Uint8Array> {
  return new Uint8Array(await file.arrayBuffer());
}

function toBlobPart(bytes: Uint8Array): ArrayBuffer {
  const clone = new Uint8Array(bytes.byteLength);
  clone.set(bytes);
  return clone.buffer;
}

async function createPdfFromPageNumbers(source: PDFDocument, pageNumbers: number[]): Promise<Uint8Array> {
  const doc = await PDFDocument.create();
  const copied = await doc.copyPages(
    source,
    pageNumbers.map((page) => page - 1)
  );
  copied.forEach((page) => doc.addPage(page));
  return doc.save();
}

async function loadPdfDocument(file: File): Promise<PDFDocument> {
  const bytes = await readFileAsUint8Array(file);
  return PDFDocument.load(bytes, { ignoreEncryption: true });
}

export async function mergePdfFiles(files: File[]): Promise<Blob> {
  if (files.length < 2) {
    throw new Error('Add at least two PDF files to merge.');
  }

  const merged = await PDFDocument.create();
  for (const file of files) {
    const source = await loadPdfDocument(file);
    const copiedPages = await merged.copyPages(source, source.getPageIndices());
    copiedPages.forEach((page) => merged.addPage(page));
  }

  const bytes = await merged.save();
  return new Blob([toBlobPart(bytes)], { type: 'application/pdf' });
}

function ensurePdfFileName(fileName: string): string {
  const trimmed = fileName.trim();
  if (!trimmed) return 'document.pdf';
  return trimmed.toLowerCase().endsWith('.pdf') ? trimmed : `${trimmed}.pdf`;
}

export async function mergePdfFilesToFile(files: File[], outputName?: string): Promise<File> {
  if (files.length === 0) {
    throw new Error('At least one PDF is required.');
  }

  if (files.length === 1 && !outputName) {
    return files[0];
  }

  const mergedBlob = await mergePdfFiles(files);
  const fallbackName = `${getBaseFileName(files[0].name)}-merged.pdf`;
  const nextName = ensurePdfFileName(outputName ?? fallbackName);
  return new File([mergedBlob], nextName, { type: 'application/pdf', lastModified: Date.now() });
}

export async function reorderPdfFile(file: File, pageOrder: number[], outputName = file.name): Promise<File> {
  const source = await loadPdfDocument(file);
  const pageCount = source.getPageCount();

  if (pageOrder.length !== pageCount) {
    throw new Error(`Page order should contain exactly ${pageCount} pages.`);
  }

  const normalized = pageOrder.map((value) => Math.floor(value));
  const uniquePages = new Set<number>();
  for (const page of normalized) {
    if (page < 1 || page > pageCount) {
      throw new Error(`Page ${page} is outside of 1-${pageCount}.`);
    }
    uniquePages.add(page);
  }

  if (uniquePages.size !== pageCount) {
    throw new Error('Page order contains duplicates or missing pages.');
  }

  const bytes = await createPdfFromPageNumbers(source, normalized);
  return new File([toBlobPart(bytes)], ensurePdfFileName(outputName), {
    type: 'application/pdf',
    lastModified: Date.now(),
  });
}

export async function duplicatePdfPage(file: File, pageNumber: number, outputName = file.name): Promise<File> {
  const source = await loadPdfDocument(file);
  const pageCount = source.getPageCount();
  const page = Math.floor(pageNumber);
  if (page < 1 || page > pageCount) {
    throw new Error(`Page ${page} is outside of 1-${pageCount}.`);
  }

  const order = createNumericRange(1, pageCount);
  order.splice(page, 0, page);
  const bytes = await createPdfFromPageNumbers(source, order);
  return new File([toBlobPart(bytes)], ensurePdfFileName(outputName), {
    type: 'application/pdf',
    lastModified: Date.now(),
  });
}

export async function rotatePdfPage(
  file: File,
  pageNumber: number,
  rotateBy: RotateBy,
  outputName = file.name
): Promise<File> {
  const source = await loadPdfDocument(file);
  const pageCount = source.getPageCount();
  const page = Math.floor(pageNumber);
  if (page < 1 || page > pageCount) {
    throw new Error(`Page ${page} is outside of 1-${pageCount}.`);
  }

  const target = source.getPage(page - 1);
  const currentAngle = target.getRotation().angle;
  target.setRotation(degrees((currentAngle + rotateBy) % 360));

  const bytes = await source.save();
  return new File([toBlobPart(bytes)], ensurePdfFileName(outputName), {
    type: 'application/pdf',
    lastModified: Date.now(),
  });
}

export async function removePdfPage(
  file: File,
  pageNumber: number,
  outputName = file.name
): Promise<RemovePdfPageResult> {
  const source = await loadPdfDocument(file);
  const pageCount = source.getPageCount();
  const page = Math.floor(pageNumber);
  if (page < 1 || page > pageCount) {
    throw new Error(`Page ${page} is outside of 1-${pageCount}.`);
  }
  if (pageCount <= 1) {
    throw new Error('Cannot remove the only page in the PDF.');
  }

  const keptOrder = createNumericRange(1, pageCount).filter((value) => value !== page);
  const keptBytes = await createPdfFromPageNumbers(source, keptOrder);
  const removedBytes = await createPdfFromPageNumbers(source, [page]);

  const baseName = getBaseFileName(file.name);
  return {
    file: new File([toBlobPart(keptBytes)], ensurePdfFileName(outputName), {
      type: 'application/pdf',
      lastModified: Date.now(),
    }),
    removedPage: new File([toBlobPart(removedBytes)], `${baseName}_page_${page}.pdf`, {
      type: 'application/pdf',
      lastModified: Date.now(),
    }),
    removedPageNumber: page,
    remainingPages: keptOrder.length,
  };
}

export async function insertPdfAtPosition(
  file: File,
  insertFile: File,
  insertAtPage: number,
  outputName = file.name
): Promise<File> {
  const source = await loadPdfDocument(file);
  const insertion = await loadPdfDocument(insertFile);
  const target = await PDFDocument.create();

  const sourceCount = source.getPageCount();
  const position = Math.min(Math.max(Math.floor(insertAtPage), 1), sourceCount + 1);

  const beforeIndices = Array.from({ length: position - 1 }, (_, index) => index);
  if (beforeIndices.length > 0) {
    const beforePages = await target.copyPages(source, beforeIndices);
    beforePages.forEach((page) => target.addPage(page));
  }

  const insertionPages = await target.copyPages(insertion, insertion.getPageIndices());
  insertionPages.forEach((page) => target.addPage(page));

  const afterStart = position - 1;
  const afterLength = sourceCount - afterStart;
  if (afterLength > 0) {
    const afterIndices = Array.from({ length: afterLength }, (_, index) => afterStart + index);
    const afterPages = await target.copyPages(source, afterIndices);
    afterPages.forEach((page) => target.addPage(page));
  }

  const bytes = await target.save();
  return new File([toBlobPart(bytes)], ensurePdfFileName(outputName), {
    type: 'application/pdf',
    lastModified: Date.now(),
  });
}

export async function splitPdfByRanges(file: File, rangeExpression: string): Promise<SplitResult> {
  const source = await loadPdfDocument(file);
  const maxPages = source.getPageCount();
  const chunks = parsePageChunks(rangeExpression);
  if (chunks.length === 0) {
    throw new Error('Enter one or more ranges, for example 1-2,3-4.');
  }

  const zip = new JSZip();
  const baseName = getBaseFileName(file.name);

  for (let index = 0; index < chunks.length; index += 1) {
    const token = chunks[index];
    const pages = parsePageToken(token, maxPages, true);
    const bytes = await createPdfFromPageNumbers(source, pages);
    const label = slugifyToken(token);
    const partNumber = String(index + 1).padStart(2, '0');
    zip.file(`${baseName}_part_${partNumber}_${label}.pdf`, bytes);
  }

  return {
    blob: await zip.generateAsync({ type: 'blob' }),
    outputCount: chunks.length,
  };
}

export async function splitPdfEveryNPages(file: File, pagesPerChunk: number): Promise<SplitResult> {
  const safeChunkSize = Math.max(1, Math.floor(pagesPerChunk));
  const source = await loadPdfDocument(file);
  const pageCount = source.getPageCount();
  const zip = new JSZip();
  const baseName = getBaseFileName(file.name);
  let outputCount = 0;

  for (let start = 1; start <= pageCount; start += safeChunkSize) {
    const end = Math.min(start + safeChunkSize - 1, pageCount);
    const pages = createNumericRange(start, end);
    const bytes = await createPdfFromPageNumbers(source, pages);
    outputCount += 1;
    const partNumber = String(outputCount).padStart(2, '0');
    zip.file(`${baseName}_chunk_${partNumber}_pages_${start}-${end}.pdf`, bytes);
  }

  return {
    blob: await zip.generateAsync({ type: 'blob' }),
    outputCount,
  };
}

export async function splitPdfIntoSinglePages(file: File): Promise<SplitResult> {
  return splitPdfEveryNPages(file, 1);
}

export async function organizePdf(file: File, options: OrganizeOptions): Promise<{ blob: Blob; outputPages: number }> {
  const source = await loadPdfDocument(file);
  const maxPages = source.getPageCount();

  const sourceOrder = options.pageOrder.trim()
    ? parsePageExpression(options.pageOrder, maxPages, true)
    : createNumericRange(1, maxPages);
  const removeSet = new Set(parseOptionalPageExpression(options.removePages, maxPages, false));
  const duplicateList = parseOptionalPageExpression(options.duplicatePages, maxPages, true);
  const rotateSet = new Set(parseOptionalPageExpression(options.rotatePages, maxPages, false));

  if (rotateSet.size > 0) {
    for (const pageNumber of rotateSet) {
      const page = source.getPage(pageNumber - 1);
      const currentAngle = page.getRotation().angle;
      page.setRotation(degrees((currentAngle + options.rotateBy) % 360));
    }
  }

  const arranged = sourceOrder.filter((pageNumber) => !removeSet.has(pageNumber));
  const finalOrder = [...arranged, ...duplicateList];
  if (finalOrder.length === 0) {
    throw new Error('The resulting PDF has no pages. Adjust remove/order inputs.');
  }

  const bytes = await createPdfFromPageNumbers(source, finalOrder);
  return {
    blob: new Blob([toBlobPart(bytes)], { type: 'application/pdf' }),
    outputPages: finalOrder.length,
  };
}

function escapeHtml(value: string): string {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');
}

type TextChunk = { text: string; x: number; y: number };

function isTextChunkCandidate(item: unknown): item is { str: string; transform: number[] } {
  if (!item || typeof item !== 'object') return false;
  const candidate = item as { str?: unknown; transform?: unknown };
  return typeof candidate.str === 'string' && Array.isArray(candidate.transform) && candidate.transform.length >= 6;
}

function normalizePageText(items: unknown[]): string {
  const chunks: TextChunk[] = items
    .filter(isTextChunkCandidate)
    .map((item) => ({
      text: item.str.trim(),
      x: Number(item.transform[4] ?? 0),
      y: Number(item.transform[5] ?? 0),
    }))
    .filter((item) => item.text.length > 0);

  if (chunks.length === 0) return '';

  chunks.sort((a, b) => {
    if (Math.abs(a.y - b.y) < 2) return a.x - b.x;
    return b.y - a.y;
  });

  const rows: Array<{ y: number; chunks: TextChunk[] }> = [];
  for (const chunk of chunks) {
    const row = rows.find((entry) => Math.abs(entry.y - chunk.y) < 4);
    if (row) {
      row.chunks.push(chunk);
    } else {
      rows.push({ y: chunk.y, chunks: [chunk] });
    }
  }

  rows.sort((a, b) => b.y - a.y);
  const lines = rows
    .map((row) =>
      row.chunks
        .sort((a, b) => a.x - b.x)
        .map((item) => item.text)
        .join(' ')
        .replace(/\s+/g, ' ')
        .trim()
    )
    .filter(Boolean);

  return lines.join('\n');
}

export async function extractPdfText(file: File): Promise<string[]> {
  ensurePdfWorker();
  const data = await readFileAsUint8Array(file);
  const loadingTask = pdfjs.getDocument({ data });

  try {
    const document = await loadingTask.promise;
    const pages: string[] = [];
    for (let pageNumber = 1; pageNumber <= document.numPages; pageNumber += 1) {
      const page = await document.getPage(pageNumber);
      const content = await page.getTextContent();
      pages.push(normalizePageText(content.items as unknown[]));
    }
    return pages;
  } finally {
    void loadingTask.destroy();
  }
}

function countWords(text: string): number {
  return text.trim().split(/\s+/).filter(Boolean).length;
}

export async function convertPdfToWord(
  file: File,
  includePageHeadings: boolean,
  addPageBreaks: boolean
): Promise<PdfTextExportResult> {
  const pages = await extractPdfText(file);
  const body = pages
    .map((pageText, index) => {
      const safeText = escapeHtml(pageText).replaceAll('\n', '<br />') || '&nbsp;';
      const heading = includePageHeadings ? `<h2 style="font-size:14pt;margin:0 0 8pt;">Page ${index + 1}</h2>` : '';
      return `<section>${heading}<p style="font-size:11pt;line-height:1.5;margin:0;">${safeText}</p></section>`;
    })
    .join(addPageBreaks ? '<div style="page-break-after:always;"></div>' : '<div style="height:16pt;"></div>');

  const html = `<!doctype html>
<html>
<head>
  <meta charset="utf-8" />
  <title>${escapeHtml(getBaseFileName(file.name))}</title>
</head>
<body style="font-family:Calibri,Arial,sans-serif;padding:18pt;">
${body}
</body>
</html>`;

  const fullText = pages.join('\n');
  return {
    blob: new Blob([`\uFEFF${html}`], { type: 'application/msword' }),
    pageCount: pages.length,
    wordCount: countWords(fullText),
  };
}

export async function exportPdfTextAsTxt(file: File, includePageHeadings: boolean): Promise<PdfTextExportResult> {
  const pages = await extractPdfText(file);
  const body = pages
    .map((text, index) => {
      const heading = includePageHeadings ? `--- Page ${index + 1} ---\n` : '';
      return `${heading}${text || '[No extractable text]'}`;
    })
    .join('\n\n');

  return {
    blob: new Blob([body], { type: 'text/plain;charset=utf-8' }),
    pageCount: pages.length,
    wordCount: countWords(body),
  };
}
