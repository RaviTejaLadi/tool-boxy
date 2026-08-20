export type ExportFormat = 'png' | 'jpeg' | 'webp';

export interface FilterSettings {
  brightness: number;
  contrast: number;
  saturation: number;
  blur: number;
  grayscale: number;
  sepia: number;
  hueRotate: number;
  invert: number;
  opacity: number;
}

export const DEFAULT_SETTINGS: FilterSettings = {
  brightness: 100,
  contrast: 100,
  saturation: 100,
  blur: 0,
  grayscale: 0,
  sepia: 0,
  hueRotate: 0,
  invert: 0,
  opacity: 100,
};

export const EXPORT_FORMATS: { id: ExportFormat; label: string; mime: string; extension: string }[] = [
  { id: 'png', label: 'PNG', mime: 'image/png', extension: 'png' },
  { id: 'jpeg', label: 'JPEG', mime: 'image/jpeg', extension: 'jpg' },
  { id: 'webp', label: 'WEBP', mime: 'image/webp', extension: 'webp' },
];

export const DEFAULT_EXPORT_FORMAT: ExportFormat = 'png';
export const JPEG_QUALITY = 0.92;

/** Build CSS filter string from manual settings (identity values omitted). */
export function buildSettingsCss(settings: FilterSettings): string {
  const parts: string[] = [];

  if (settings.brightness !== 100) parts.push(`brightness(${settings.brightness / 100})`);
  if (settings.contrast !== 100) parts.push(`contrast(${settings.contrast / 100})`);
  if (settings.saturation !== 100) parts.push(`saturate(${settings.saturation / 100})`);
  if (settings.blur > 0) parts.push(`blur(${settings.blur}px)`);
  if (settings.grayscale > 0) parts.push(`grayscale(${settings.grayscale / 100})`);
  if (settings.sepia > 0) parts.push(`sepia(${settings.sepia / 100})`);
  if (settings.hueRotate !== 0) parts.push(`hue-rotate(${settings.hueRotate}deg)`);
  if (settings.invert > 0) parts.push(`invert(${settings.invert / 100})`);
  if (settings.opacity < 100) parts.push(`opacity(${settings.opacity / 100})`);

  return parts.join(' ');
}

export function composeFilterCss(presetCss: string, settings: FilterSettings): string {
  return [presetCss.trim(), buildSettingsCss(settings)].filter(Boolean).join(' ');
}

export function isSettingsDefault(settings: FilterSettings): boolean {
  return (
    settings.brightness === DEFAULT_SETTINGS.brightness &&
    settings.contrast === DEFAULT_SETTINGS.contrast &&
    settings.saturation === DEFAULT_SETTINGS.saturation &&
    settings.blur === DEFAULT_SETTINGS.blur &&
    settings.grayscale === DEFAULT_SETTINGS.grayscale &&
    settings.sepia === DEFAULT_SETTINGS.sepia &&
    settings.hueRotate === DEFAULT_SETTINGS.hueRotate &&
    settings.invert === DEFAULT_SETTINGS.invert &&
    settings.opacity === DEFAULT_SETTINGS.opacity
  );
}
