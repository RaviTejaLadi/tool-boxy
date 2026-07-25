import { getFormat, type OutputFormatId, type ResizeMode } from '../constants';
import { formatSize } from './formatSize';
import type { ConvertedImage, SourceImage } from '../stores';

export interface ConvertOptions {
  formatId: OutputFormatId;
  resizeMode: ResizeMode;
  width: number;
  height: number;
  scalePercent: number;
  preserveTransparency: boolean;
  quality: number;
}

function loadImage(dataUrl: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error('Failed to load image'));
    img.src = dataUrl;
  });
}

function targetSize(srcW: number, srcH: number, options: ConvertOptions): { width: number; height: number } {
  if (options.resizeMode === 'dimensions') {
    return {
      width: Math.max(1, Math.round(options.width || srcW)),
      height: Math.max(1, Math.round(options.height || srcH)),
    };
  }
  if (options.resizeMode === 'scale') {
    const scale = Math.max(1, options.scalePercent) / 100;
    return {
      width: Math.max(1, Math.round(srcW * scale)),
      height: Math.max(1, Math.round(srcH * scale)),
    };
  }
  return { width: srcW, height: srcH };
}

function canvasToBlob(canvas: HTMLCanvasElement, mimeType: string, quality: number): Promise<Blob | null> {
  return new Promise((resolve) => {
    canvas.toBlob((blob) => resolve(blob), mimeType, quality);
  });
}

function encodeBmp(canvas: HTMLCanvasElement): Blob {
  const width = canvas.width;
  const height = canvas.height;
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Canvas unsupported');

  const imageData = ctx.getImageData(0, 0, width, height);
  const rowSize = Math.ceil((width * 3) / 4) * 4;
  const pixelDataSize = rowSize * height;
  const fileSize = 54 + pixelDataSize;
  const buffer = new ArrayBuffer(fileSize);
  const view = new DataView(buffer);

  view.setUint8(0, 0x42);
  view.setUint8(1, 0x4d);
  view.setUint32(2, fileSize, true);
  view.setUint32(10, 54, true);
  view.setUint32(14, 40, true);
  view.setInt32(18, width, true);
  view.setInt32(22, height, true);
  view.setUint16(26, 1, true);
  view.setUint16(28, 24, true);
  view.setUint32(34, pixelDataSize, true);

  const pixels = new Uint8Array(buffer, 54);
  const data = imageData.data;

  for (let y = 0; y < height; y++) {
    const srcRow = (height - 1 - y) * width * 4;
    const dstRow = y * rowSize;
    for (let x = 0; x < width; x++) {
      const src = srcRow + x * 4;
      const dst = dstRow + x * 3;
      pixels[dst] = data[src + 2];
      pixels[dst + 1] = data[src + 1];
      pixels[dst + 2] = data[src];
    }
  }

  return new Blob([buffer], { type: 'image/bmp' });
}

function createIcoFromPng(pngBytes: Uint8Array, size: number): Blob {
  const headerSize = 6;
  const entrySize = 16;
  const dataOffset = headerSize + entrySize;
  const buffer = new Uint8Array(dataOffset + pngBytes.length);
  const view = new DataView(buffer.buffer);

  view.setUint16(0, 0, true);
  view.setUint16(2, 1, true);
  view.setUint16(4, 1, true);

  const dim = size >= 256 ? 0 : size;
  view.setUint8(6, dim);
  view.setUint8(7, dim);
  view.setUint8(8, 0);
  view.setUint8(9, 0);
  view.setUint16(10, 1, true);
  view.setUint16(12, 32, true);
  view.setUint32(14, pngBytes.length, true);
  view.setUint32(18, dataOffset, true);
  buffer.set(pngBytes, dataOffset);

  return new Blob([buffer], { type: 'image/x-icon' });
}

function encodeSvg(dataUrl: string, width: number, height: number): Blob {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}"><image href="${dataUrl}" width="${width}" height="${height}"/></svg>`;
  return new Blob([svg], { type: 'image/svg+xml' });
}

function replaceExtension(name: string, extension: string): string {
  const base = name.replace(/\.[^.]+$/, '') || name;
  return `${base}.${extension}`;
}

async function blobToDataUrl(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') resolve(reader.result);
      else reject(new Error('Failed to read blob'));
    };
    reader.onerror = () => reject(new Error('Failed to read blob'));
    reader.readAsDataURL(blob);
  });
}

export async function convertImage(source: SourceImage, options: ConvertOptions): Promise<ConvertedImage> {
  const format = getFormat(options.formatId);
  if (!format.convertible) {
    throw new Error(`${format.label} encoding is not supported in the browser`);
  }

  const img = await loadImage(source.dataUrl);
  const { width, height } = targetSize(img.naturalWidth, img.naturalHeight, options);

  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Canvas unsupported');

  const needsOpaqueBg =
    (format.id === 'jpeg' || format.id === 'bmp' || !options.preserveTransparency) && format.id !== 'svg';

  if (needsOpaqueBg) {
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, width, height);
  }

  ctx.drawImage(img, 0, 0, width, height);

  let blob: Blob | null = null;

  if (format.id === 'bmp') {
    blob = encodeBmp(canvas);
  } else if (format.id === 'svg') {
    const pngBlob = await canvasToBlob(canvas, 'image/png', 1);
    if (!pngBlob) throw new Error('Failed to encode PNG for SVG');
    const pngDataUrl = await blobToDataUrl(pngBlob);
    blob = encodeSvg(pngDataUrl, width, height);
  } else if (format.id === 'ico') {
    const icoSize = Math.min(256, Math.max(width, height));
    const icoCanvas = document.createElement('canvas');
    icoCanvas.width = icoSize;
    icoCanvas.height = icoSize;
    const icoCtx = icoCanvas.getContext('2d');
    if (!icoCtx) throw new Error('Canvas unsupported');
    if (!options.preserveTransparency) {
      icoCtx.fillStyle = '#ffffff';
      icoCtx.fillRect(0, 0, icoSize, icoSize);
    }
    const scale = Math.min(icoSize / width, icoSize / height);
    const dw = Math.round(width * scale);
    const dh = Math.round(height * scale);
    icoCtx.drawImage(canvas, Math.floor((icoSize - dw) / 2), Math.floor((icoSize - dh) / 2), dw, dh);
    const pngBlob = await canvasToBlob(icoCanvas, 'image/png', 1);
    if (!pngBlob) throw new Error('Failed to encode ICO');
    const pngBytes = new Uint8Array(await pngBlob.arrayBuffer());
    blob = createIcoFromPng(pngBytes, icoSize);
  } else {
    blob = await canvasToBlob(canvas, format.mimeType, options.quality);
    if (!blob) {
      blob = await canvasToBlob(canvas, 'image/png', 1);
    }
  }

  if (!blob) throw new Error(`Failed to convert ${source.name}`);

  const dataUrl = await blobToDataUrl(blob);
  const fileName = replaceExtension(source.name, format.extension);

  return {
    id: `converted-${source.id}-${format.id}`,
    sourceId: source.id,
    name: fileName,
    size: formatSize(blob.size),
    rawBytes: blob.size,
    dataUrl,
    blob,
    width,
    height,
    formatId: format.id,
  };
}

export async function convertImages(sources: SourceImage[], options: ConvertOptions): Promise<ConvertedImage[]> {
  const results: ConvertedImage[] = [];
  for (const source of sources) {
    results.push(await convertImage(source, options));
  }
  return results;
}
