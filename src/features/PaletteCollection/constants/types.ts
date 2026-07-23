import type { PaletteCategory } from './categories';

export interface Palette {
  id: string;
  name: string;
  colors: string[];
  categories: PaletteCategory[];
}
