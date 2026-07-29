export const TIMING_PRESETS = [
  { value: 'linear', label: 'Linear' },
  { value: 'ease', label: 'Ease' },
  { value: 'ease-in', label: 'Ease In' },
  { value: 'ease-out', label: 'Ease Out' },
  { value: 'ease-in-out', label: 'Ease In Out' },
  { value: 'cubic-bezier(.34,1.56,.64,1)', label: 'Back (overshoot)' },
  { value: 'custom', label: 'Custom cubic-bezier' },
] as const;

export const ITERATION_OPTIONS = ['1', '2', '3', '5', 'infinite', 'custom'] as const;
export const DIRECTION_OPTIONS = ['normal', 'reverse', 'alternate', 'alternate-reverse'] as const;
export const FILL_OPTIONS = ['none', 'forwards', 'backwards', 'both'] as const;
