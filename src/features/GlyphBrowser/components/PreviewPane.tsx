import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { selectBlock, selectFilteredGlyphs, type CellSize, useGlyphBrowserStore } from '../stores';
import { GlyphCell } from './GlyphCell';
import { PreviewToolbar } from './PreviewToolbar';

const GRID_BY_SIZE: Record<CellSize, string> = {
  compact: 'grid-cols-8 sm:grid-cols-10 md:grid-cols-12',
  comfortable: 'grid-cols-6 sm:grid-cols-8 md:grid-cols-10',
  large: 'grid-cols-4 sm:grid-cols-5 md:grid-cols-6',
};

const CELL_TEXT_BY_SIZE: Record<CellSize, string> = {
  compact: 'text-base sm:text-lg',
  comfortable: 'text-lg sm:text-xl',
  large: 'text-xl sm:text-2xl',
};

export function PreviewPane() {
  const blockId = useGlyphBrowserStore((s) => s.blockId);
  const query = useGlyphBrowserStore((s) => s.query);
  const cellSize = useGlyphBrowserStore((s) => s.cellSize);

  const block = selectBlock(blockId);
  const visibleGlyphs = selectFilteredGlyphs({ blockId, query });

  return (
    <div className="relative flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden bg-muted/40">
      <div
        className="flex min-h-0 flex-1 flex-col overflow-auto"
        style={{
          backgroundImage:
            'radial-gradient(circle, color-mix(in oklab, var(--foreground) 8%, transparent) 1px, transparent 1px)',
          backgroundSize: '22px 22px',
        }}
      >
        <div className="flex min-h-0 flex-1 flex-col p-6 lg:p-10">
          <div className="mx-auto w-full max-w-3xl border border-border bg-background/90 shadow-sm backdrop-blur-sm">
            <div className="flex flex-wrap items-start justify-between gap-3 border-b border-border px-5 py-4">
              <div>
                <p className="font-mono text-[10px] tracking-wide text-muted-foreground uppercase">Unicode block</p>
                <h2 className="mt-1 font-heading text-lg font-semibold">{block.label}</h2>
                <p className="mt-0.5 font-mono text-xs text-muted-foreground">
                  {visibleGlyphs.length} glyph{visibleGlyphs.length === 1 ? '' : 's'}
                  {query.trim() ? ' matching filter' : ' in block'}
                </p>
              </div>
              <Badge variant="outline" className="rounded-none font-mono text-[10px]">
                {block.id}
              </Badge>
            </div>

            <PreviewToolbar />

            <div className={cn('grid gap-2 p-5', GRID_BY_SIZE[cellSize])}>
              {visibleGlyphs.length === 0 ? (
                <p className="col-span-full py-8 text-center font-mono text-xs text-muted-foreground">
                  {query.trim() ? `No glyphs match "${query.trim()}".` : 'No glyphs in this block.'}
                </p>
              ) : (
                visibleGlyphs.map(({ cp, glyph }) => (
                  <GlyphCell
                    key={cp}
                    glyph={glyph}
                    cellKey={`${blockId}-${cp}`}
                    className={CELL_TEXT_BY_SIZE[cellSize]}
                  />
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
