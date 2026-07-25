export type OutputFormatId = 'png' | 'jpeg' | 'webp' | 'jxl' | 'gif' | 'bmp' | 'tiff' | 'ico' | 'icns' | 'svg';

export type ResizeMode = 'original' | 'dimensions' | 'scale';

export interface OutputFormat {
  id: OutputFormatId;
  label: string;
  mimeType: string;
  extension: string;
  /** Browser can encode this format natively or via a helper. */
  convertible: boolean;
}

export const OUTPUT_FORMATS: OutputFormat[] = [
  { id: 'png', label: 'PNG', mimeType: 'image/png', extension: 'png', convertible: true },
  { id: 'jpeg', label: 'JPEG', mimeType: 'image/jpeg', extension: 'jpg', convertible: true },
  { id: 'webp', label: 'WEBP', mimeType: 'image/webp', extension: 'webp', convertible: true },
  { id: 'jxl', label: 'JXL', mimeType: 'image/jxl', extension: 'jxl', convertible: false },
  { id: 'gif', label: 'GIF', mimeType: 'image/gif', extension: 'gif', convertible: false },
  { id: 'bmp', label: 'BMP', mimeType: 'image/bmp', extension: 'bmp', convertible: true },
  { id: 'tiff', label: 'TIFF', mimeType: 'image/tiff', extension: 'tiff', convertible: false },
  { id: 'ico', label: 'ICO', mimeType: 'image/x-icon', extension: 'ico', convertible: true },
  { id: 'icns', label: 'ICNS', mimeType: 'image/icns', extension: 'icns', convertible: false },
  { id: 'svg', label: 'SVG', mimeType: 'image/svg+xml', extension: 'svg', convertible: true },
];

export const RESIZE_OPTIONS: { id: ResizeMode; label: string; hint: string }[] = [
  { id: 'original', label: 'Original', hint: 'Images will keep their original dimensions' },
  { id: 'dimensions', label: 'Dimensions', hint: 'Resize to exact width and height' },
  { id: 'scale', label: 'Scale', hint: 'Scale by a percentage of the original size' },
];

export function getFormat(id: OutputFormatId): OutputFormat {
  return OUTPUT_FORMATS.find((f) => f.id === id) ?? OUTPUT_FORMATS[0];
}
