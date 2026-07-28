export type TypographyUnit = {
  name: string;
  symbol: string;
  /** Conversion factor relative to 1px (except em/rem which use base font size) */
  toPx: number;
  relative?: boolean;
  description: string;
};

export const TYPOGRAPHY_UNITS: TypographyUnit[] = [
  { name: 'Pixel', symbol: 'px', toPx: 1, description: 'Screen pixels (96 per inch)' },
  { name: 'Point', symbol: 'pt', toPx: 96 / 72, description: 'Print points (72 per inch)' },
  { name: 'Pica', symbol: 'pc', toPx: (96 / 72) * 12, description: '12 points per pica' },
  { name: 'Agate', symbol: 'ag', toPx: 96 / 14, description: '14 agates per inch (US newspapers)' },
  { name: 'Cicero', symbol: 'cc', toPx: (4.512 / 25.4) * 96, description: 'European unit (=4.512mm)' },
  { name: 'Inch', symbol: 'in', toPx: 96, description: 'Imperial inch' },
  { name: 'Millimetre', symbol: 'mm', toPx: 96 / 25.4, description: 'Metric millimeter' },
  { name: 'Centimetre', symbol: 'cm', toPx: 96 / 2.54, description: 'Metric centimeter' },
  { name: 'Em', symbol: 'em', toPx: 1, relative: true, description: 'Relative to parent font-size' },
  { name: 'Rem', symbol: 'rem', toPx: 1, relative: true, description: 'Relative to root font-size' },
];

export const QUICK_REFS = [
  '1 inch = 96px / 72pt / 25.4mm',
  '1 pica = 12 points',
  '1 point = 1/72 inch',
  '1 agate = 1/14 inch (≈5.14pt)',
  '1 cicero = 12 Didot pts (≈4.512mm)',
  '1 em/rem = base font size',
];

export const DEFAULT_BASE_FONT_SIZE = 16;
export const DEFAULT_SOURCE_UNIT = 'px';
export const DEFAULT_SOURCE_VALUE = '16';
