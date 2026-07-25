export type FaviconType = 'png' | 'apple' | 'android';

export interface FaviconSize {
  size: number;
  label: string;
  type: FaviconType;
  fileName: string;
}

/** PNG assets shown in preview / individual download */
export const FAVICON_SIZES: FaviconSize[] = [
  { size: 16, label: '16×16', type: 'png', fileName: 'favicon-16x16.png' },
  { size: 32, label: '32×32', type: 'png', fileName: 'favicon-32x32.png' },
  { size: 180, label: '180×180', type: 'apple', fileName: 'apple-touch-icon.png' },
  { size: 192, label: '192×192', type: 'android', fileName: 'android-chrome-192x192.png' },
  { size: 512, label: '512×512', type: 'android', fileName: 'android-chrome-512x512.png' },
];

/** Extra raster sizes baked into favicon.ico */
export const ICO_SIZES = [16, 32, 48] as const;

export function getTypeLabel(type: FaviconType | string): string {
  switch (type) {
    case 'apple':
      return 'Apple Touch';
    case 'android':
      return 'Android Chrome';
    case 'png':
      return 'Favicon';
    default:
      return type;
  }
}
