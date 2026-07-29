export const FLEX_DIRECTION_OPTIONS = ['row', 'row-reverse', 'column', 'column-reverse'] as const;

export const FLEX_WRAP_OPTIONS = ['nowrap', 'wrap', 'wrap-reverse'] as const;

export const JUSTIFY_CONTENT_OPTIONS = [
  'flex-start',
  'flex-end',
  'center',
  'space-between',
  'space-around',
  'space-evenly',
] as const;

export const ALIGN_ITEMS_OPTIONS = ['stretch', 'flex-start', 'flex-end', 'center', 'baseline'] as const;

export const ALIGN_CONTENT_OPTIONS = [
  'stretch',
  'flex-start',
  'flex-end',
  'center',
  'space-between',
  'space-around',
] as const;

export const FLEX_BASIS_OPTIONS = ['auto', '0', '50px', '100px', '150px'] as const;

export const ALIGN_SELF_OPTIONS = ['auto', 'flex-start', 'flex-end', 'center', 'stretch', 'baseline'] as const;
