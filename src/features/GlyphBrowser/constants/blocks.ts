export type Range = [number, number];

export interface BlockDef {
  id: string;
  label: string;
  ranges?: Range[];
  codepoints?: number[];
}

export const DEFAULT_BLOCK_ID = 'latin-basic';

export const BLOCKS: BlockDef[] = [
  { id: 'latin-basic', label: 'Latin Basic', ranges: [[0x0020, 0x007e]] },
  {
    id: 'latin-extended',
    label: 'Latin Extended',
    ranges: [
      [0x00a0, 0x00ff],
      [0x0100, 0x017f],
    ],
  },
  {
    id: 'greek',
    label: 'Greek',
    ranges: [
      [0x0391, 0x03a9],
      [0x03b1, 0x03c9],
    ],
  },
  {
    id: 'cyrillic',
    label: 'Cyrillic',
    ranges: [
      [0x0410, 0x042f],
      [0x0430, 0x044f],
    ],
  },
  {
    id: 'punctuation',
    label: 'Punctuation',
    ranges: [[0x2010, 0x2027]],
    codepoints: [
      0x21, 0x22, 0x23, 0x25, 0x26, 0x27, 0x28, 0x29, 0x2a, 0x2c, 0x2d, 0x2e, 0x2f, 0x3a, 0x3b, 0x3f, 0x40, 0x5b, 0x5c,
      0x5d, 0x5f, 0x7b, 0x7c, 0x7d,
    ],
  },
  {
    id: 'currency',
    label: 'Currency',
    ranges: [[0x20a0, 0x20bf]],
    codepoints: [0x24, 0x00a2, 0x00a3, 0x00a5],
  },
  { id: 'arrows', label: 'Arrows', ranges: [[0x2190, 0x21ff]] },
  {
    id: 'math-operators',
    label: 'Math Operators',
    ranges: [[0x2200, 0x22ff]],
  },
  { id: 'box-drawing', label: 'Box Drawing', ranges: [[0x2500, 0x257f]] },
  {
    id: 'geometric-shapes',
    label: 'Geometric Shapes',
    ranges: [[0x25a0, 0x25ff]],
  },
  {
    id: 'symbols',
    label: 'Symbols',
    ranges: [
      [0x2600, 0x267f],
      [0x2190, 0x2199],
    ],
  },
  { id: 'dingbats', label: 'Dingbats', ranges: [[0x2700, 0x27bf]] },
  {
    id: 'emoji',
    label: 'Emoji',
    ranges: [
      [0x1f600, 0x1f64f],
      [0x1f300, 0x1f321],
    ],
  },
];
