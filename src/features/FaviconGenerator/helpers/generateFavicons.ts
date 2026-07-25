import { FAVICON_SIZES, ICO_SIZES, VALID_IMAGE_TYPES } from '../constants';
import type { GeneratedFavicon } from '../stores';
import { createIcoFromPngDataUrls } from './createIco';
import { buildWebManifest } from './buildHtmlSnippet';

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error('Failed to load image'));
    img.src = src;
  });
}

function renderSquarePng(img: HTMLImageElement, size: number): string {
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Canvas context not available');

  const sourceSize = Math.min(img.width, img.height);
  const sx = (img.width - sourceSize) / 2;
  const sy = (img.height - sourceSize) / 2;

  ctx.clearRect(0, 0, size, size);
  ctx.drawImage(img, sx, sy, sourceSize, sourceSize, 0, 0, size, size);
  return canvas.toDataURL('image/png');
}

export async function generateFavicons(imageDataUrl: string): Promise<GeneratedFavicon[]> {
  const img = await loadImage(imageDataUrl);
  const stamp = Date.now();

  return FAVICON_SIZES.map((favSize, index) => ({
    id: `${favSize.type}-${favSize.size}-${stamp}-${index}`,
    size: favSize.size,
    label: favSize.label,
    type: favSize.type,
    fileName: favSize.fileName,
    dataUrl: renderSquarePng(img, favSize.size),
  }));
}

export interface PackageFile {
  name: string;
  data: Blob | Uint8Array | string;
}

/** Build the standard favicon package (same files as realfavicongenerator). */
export async function buildFaviconPackage(imageDataUrl: string): Promise<PackageFile[]> {
  const img = await loadImage(imageDataUrl);

  const pngBySize = new Map<number, string>();
  const neededSizes = new Set<number>([...FAVICON_SIZES.map((s) => s.size), ...ICO_SIZES]);

  for (const size of neededSizes) {
    pngBySize.set(size, renderSquarePng(img, size));
  }

  const files: PackageFile[] = FAVICON_SIZES.map((asset) => {
    const dataUrl = pngBySize.get(asset.size)!;
    const bytes = dataUrlToBytes(dataUrl);
    return { name: asset.fileName, data: bytes };
  });

  const ico = createIcoFromPngDataUrls(
    ICO_SIZES.map((size) => ({
      size,
      dataUrl: pngBySize.get(size)!,
    }))
  );
  files.push({ name: 'favicon.ico', data: ico });
  files.push({ name: 'site.webmanifest', data: buildWebManifest() });

  // Stable order matching typical package layouts
  const order = [
    'android-chrome-192x192.png',
    'android-chrome-512x512.png',
    'apple-touch-icon.png',
    'favicon.ico',
    'favicon-16x16.png',
    'favicon-32x32.png',
    'site.webmanifest',
  ];

  return order.map((name) => files.find((f) => f.name === name)).filter((f): f is PackageFile => Boolean(f));
}

function dataUrlToBytes(dataUrl: string): Uint8Array {
  const base64 = dataUrl.split(',')[1] ?? '';
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes;
}

export function readFileAsDataUrl(file: File): Promise<string> {
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

export function isValidImageFile(file: File): boolean {
  if ((VALID_IMAGE_TYPES as readonly string[]).includes(file.type)) return true;
  return /\.(png|jpe?g|svg|webp|gif)$/i.test(file.name);
}
