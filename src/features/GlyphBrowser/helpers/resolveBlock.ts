import type { BlockDef } from '../constants';

export type ResolvedGlyph = { cp: number; glyph: string };

function codepointToGlyph(cp: number): string {
  return String.fromCodePoint(cp);
}

function isPrintable(cp: number): boolean {
  if (cp <= 0x1f) return false;
  if (cp >= 0x7f && cp <= 0x9f) return false;
  return true;
}

export function resolveBlock(block: BlockDef): ResolvedGlyph[] {
  const seen = new Set<number>();
  const out: ResolvedGlyph[] = [];

  const add = (cp: number) => {
    if (seen.has(cp) || !isPrintable(cp)) return;
    seen.add(cp);
    out.push({ cp, glyph: codepointToGlyph(cp) });
  };

  block.ranges?.forEach(([start, end]) => {
    for (let cp = start; cp <= end; cp++) add(cp);
  });
  block.codepoints?.forEach(add);

  return out.sort((a, b) => a.cp - b.cp);
}
