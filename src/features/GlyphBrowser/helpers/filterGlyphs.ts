import type { ResolvedGlyph } from './resolveBlock';

export function filterGlyphs(glyphs: ResolvedGlyph[], query: string): ResolvedGlyph[] {
  const q = query.trim().toLowerCase();
  if (!q) return glyphs;

  const qHex = q.replace(/^u\+/, '').replace(/^0x/, '');

  return glyphs.filter(({ cp, glyph }) => {
    if (glyph.toLowerCase() === q) return true;
    const h = cp.toString(16).toLowerCase();
    return h === qHex || h.padStart(4, '0') === qHex.padStart(4, '0');
  });
}
