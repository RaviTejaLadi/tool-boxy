import { Grid3x3, Shuffle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { BLOCKS } from '../constants';
import { selectFilteredGlyphs, useGlyphBrowserStore } from '../stores';

export function GlyphBrowserHeader() {
  const blockId = useGlyphBrowserStore((s) => s.blockId);
  const query = useGlyphBrowserStore((s) => s.query);
  const pickRandomBlock = useGlyphBrowserStore((s) => s.pickRandomBlock);

  const visibleCount = selectFilteredGlyphs({ blockId, query }).length;

  return (
    <header className="flex shrink-0 flex-wrap items-center justify-between gap-3 border-b border-border px-6 py-3">
      <div className="flex items-center gap-2.5">
        <div className="flex size-7 items-center justify-center bg-primary text-primary-foreground">
          <Grid3x3 className="size-4" />
        </div>
        <div>
          <div className="font-heading text-sm leading-none font-semibold">Glyph Browser</div>
          <div className="mt-1 font-mono text-[11px] leading-none text-muted-foreground">
            Browse Unicode glyphs by block
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <span className="font-mono text-[11px] text-muted-foreground tabular-nums">
          {BLOCKS.length} blocks · {visibleCount} glyphs
        </span>
        <Button type="button" variant="outline" size="sm" className="rounded-none" onClick={() => pickRandomBlock()}>
          <Shuffle data-icon="inline-start" />
          Explore
        </Button>
      </div>
    </header>
  );
}
