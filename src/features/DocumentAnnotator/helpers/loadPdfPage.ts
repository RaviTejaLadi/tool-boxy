import { pdfjs } from 'react-pdf';

pdfjs.GlobalWorkerOptions.workerSrc = new URL('pdfjs-dist/build/pdf.worker.min.mjs', import.meta.url).toString();

const PDF_RENDER_SCALE = 2;

export async function getPdfPageCount(data: ArrayBuffer): Promise<number> {
  const pdf = await pdfjs.getDocument({ data: data.slice(0) }).promise;
  const count = pdf.numPages;
  await pdf.destroy();
  return count;
}

export async function renderPdfPage(data: ArrayBuffer, pageNumber: number): Promise<HTMLImageElement> {
  const pdf = await pdfjs.getDocument({ data: data.slice(0) }).promise;
  try {
    const page = await pdf.getPage(pageNumber);
    const viewport = page.getViewport({ scale: PDF_RENDER_SCALE });
    const canvas = document.createElement('canvas');
    canvas.width = Math.floor(viewport.width);
    canvas.height = Math.floor(viewport.height);
    const ctx = canvas.getContext('2d');
    if (!ctx) throw new Error('Could not create canvas context');

    await page.render({ canvasContext: ctx, viewport, canvas }).promise;

    const blob = await new Promise<Blob>((resolve, reject) => {
      canvas.toBlob((b) => (b ? resolve(b) : reject(new Error('Failed to encode page'))), 'image/png');
    });

    const url = URL.createObjectURL(blob);
    const img = new Image();
    await new Promise<void>((resolve, reject) => {
      img.onload = () => resolve();
      img.onerror = () => reject(new Error('Failed to load rendered page'));
      img.src = url;
    });
    URL.revokeObjectURL(url);
    return img;
  } finally {
    await pdf.destroy();
  }
}
