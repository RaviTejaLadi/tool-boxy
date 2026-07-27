export type ObjectFitMode = 'cover' | 'contain' | 'fill' | 'none';

export type BlendMode =
  | 'normal'
  | 'multiply'
  | 'screen'
  | 'overlay'
  | 'darken'
  | 'lighten'
  | 'soft-light'
  | 'hard-light'
  | 'difference'
  | 'exclusion';

export type RotationDeg = 0 | 90 | 180 | 270;

export const OBJECT_FIT_OPTIONS: { id: ObjectFitMode; label: string; description: string }[] = [
  { id: 'cover', label: 'Cover', description: 'Fill the cell, crop overflow' },
  { id: 'contain', label: 'Contain', description: 'Fit inside, may letterbox' },
  { id: 'fill', label: 'Fill', description: 'Stretch to fill the cell' },
  { id: 'none', label: 'None', description: 'Natural size, centered' },
];

export const BLEND_MODE_OPTIONS: { id: BlendMode; label: string }[] = [
  { id: 'normal', label: 'Normal' },
  { id: 'multiply', label: 'Multiply' },
  { id: 'screen', label: 'Screen' },
  { id: 'overlay', label: 'Overlay' },
  { id: 'darken', label: 'Darken' },
  { id: 'lighten', label: 'Lighten' },
  { id: 'soft-light', label: 'Soft light' },
  { id: 'hard-light', label: 'Hard light' },
  { id: 'difference', label: 'Difference' },
  { id: 'exclusion', label: 'Exclusion' },
];

export const ROTATION_OPTIONS: { id: RotationDeg; label: string }[] = [
  { id: 0, label: '0°' },
  { id: 90, label: '90°' },
  { id: 180, label: '180°' },
  { id: 270, label: '270°' },
];

export const DEFAULT_OBJECT_FIT: ObjectFitMode = 'cover';
export const DEFAULT_BLEND_MODE: BlendMode = 'normal';
export const DEFAULT_OPACITY = 1;
export const DEFAULT_ROTATION: RotationDeg = 0;
export const MIN_OPACITY = 0.05;
export const MAX_OPACITY = 1;
export const OPACITY_STEP = 0.05;

/** Map CSS mix-blend-mode / canvas globalCompositeOperation */
export function toCanvasComposite(mode: BlendMode): GlobalCompositeOperation {
  return mode === 'normal' ? 'source-over' : mode;
}
