export interface PlaceholderPreset {
  label: string;
  width: number;
  height: number;
}

export const PRESET_SIZES: PlaceholderPreset[] = [
  { label: 'HD', width: 1920, height: 1080 },
  { label: 'Square', width: 1000, height: 1000 },
  { label: 'Banner', width: 1200, height: 400 },
  { label: 'Thumb', width: 300, height: 200 },
  { label: 'Social', width: 1200, height: 630 },
  { label: 'Avatar', width: 400, height: 400 },
];
