export type OutputFormatId = 'png' | 'jpeg' | 'webp';

export type OutputFormat = {
  id: OutputFormatId;
  label: string;
  mime: string;
  extension: string;
};

export const OUTPUT_FORMATS: OutputFormat[] = [
  { id: 'png', label: 'PNG', mime: 'image/png', extension: 'png' },
  { id: 'jpeg', label: 'JPEG', mime: 'image/jpeg', extension: 'jpg' },
  { id: 'webp', label: 'WebP', mime: 'image/webp', extension: 'webp' },
];

export const DEFAULT_FORMAT_ID: OutputFormatId = 'png';

export function getFormat(id: OutputFormatId): OutputFormat {
  return OUTPUT_FORMATS.find((f) => f.id === id) ?? OUTPUT_FORMATS[0];
}
