export const MODES = [
  {
    value: 'classic',
    label: 'Classic',
    description: 'Standard Tailwind-style generation with uniform hue',
  },
  {
    value: 'hueShift',
    label: 'Hue Shift',
    description: 'Shifts hue slightly across the scale for richer transitions',
  },
  {
    value: 'luminanceAnchored',
    label: 'Luminance Anchored',
    description: "Anchors the scale to your base colour's actual luminance",
  },
  {
    value: 'vivid',
    label: 'Vivid',
    description: 'Boosts chroma across the scale for punchier, saturated shades',
  },
  {
    value: 'muted',
    label: 'Muted',
    description: 'Reduces chroma across the scale for softer, desaturated shades',
  },
] as const;

export type GenerationMode = (typeof MODES)[number]['value'];
