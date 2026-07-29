export type PreviewShape = 'square' | 'rounded' | 'circle';

export const COLOR_SWATCHES = [
  { name: 'Violet', value: '#8b7cff', glow: 'rgba(139,124,255,0.5)' },
  { name: 'Emerald', value: '#34d399', glow: 'rgba(52,211,153,0.5)' },
  { name: 'Amber', value: '#fbbf24', glow: 'rgba(251,191,36,0.5)' },
  { name: 'Rose', value: '#fb7185', glow: 'rgba(251,113,133,0.5)' },
  { name: 'Sky', value: '#38bdf8', glow: 'rgba(56,189,248,0.5)' },
] as const;

export const SHAPE_RADIUS: Record<PreviewShape, string> = {
  square: '0.5rem',
  rounded: '1.5rem',
  circle: '9999px',
};
