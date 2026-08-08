export const VALID_IMAGE_TYPES = [
  'image/png',
  'image/jpeg',
  'image/gif',
  'image/webp',
  'image/svg+xml',
  'image/bmp',
  'image/tiff',
  'image/x-icon',
  'image/vnd.microsoft.icon',
] as const;

export const ACCEPT_IMAGE =
  'image/png,image/jpeg,image/gif,image/webp,image/svg+xml,image/bmp,image/tiff,image/x-icon,.ico';

export const SUPPORTED_FORMATS_LABEL = 'PNG, JPEG, GIF, WebP, SVG, BMP, TIFF, ICO';

export const MIN_CROP_SIZE = 50;
export const MIN_ZOOM = 1;
export const MAX_ZOOM = 3;
export const DEFAULT_ZOOM = 1;
