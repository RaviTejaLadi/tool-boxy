import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { KIND_LABEL } from '../constants';
import { filterSymbols, getDisplayLetters } from '../helpers';
import { type CellSize, selectLanguage, useWorldScriptsStore } from '../stores';
import { PreviewToolbar } from './PreviewToolbar';
import { SymbolCell } from './SymbolCell';

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
  const selectedId = useWorldScriptsStore((s) => s.selectedId);
  const symbolQuery = useWorldScriptsStore((s) => s.symbolQuery);
  const cellSize = useWorldScriptsStore((s) => s.cellSize);
  const includeLowercase = useWorldScriptsStore((s) => s.includeLowercase);
  const selected = selectLanguage(selectedId);

  const allLetters = getDisplayLetters(selected, includeLowercase);
  const visibleLetters = filterSymbols(allLetters, symbolQuery);

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
                <p className="font-mono text-[10px] tracking-wide text-muted-foreground uppercase">Writing system</p>
                <h2 className="mt-1 font-heading text-lg font-semibold">{selected.name}</h2>
                <p className="mt-0.5 font-mono text-xs text-muted-foreground">
                  {selected.native} · {selected.script}
                </p>
              </div>
              <div className="flex flex-wrap gap-1.5">
                <Badge variant="outline" className="rounded-none font-mono text-[10px]">
                  {KIND_LABEL[selected.kind]}
                </Badge>
                <Badge variant="outline" className="rounded-none font-mono text-[10px]">
                  {selected.direction === 'rtl' ? 'RTL' : 'LTR'}
                </Badge>
              </div>
            </div>

            <PreviewToolbar />

            <div dir={selected.direction} className={cn('grid gap-2 p-5', GRID_BY_SIZE[cellSize])}>
              {visibleLetters.length === 0 ? (
                <p className="col-span-full py-8 text-center font-mono text-xs text-muted-foreground">
                  No symbols match your filter.
                </p>
              ) : (
                visibleLetters.map((letter, i) => (
                  <SymbolCell
                    key={`${selected.id}-${letter}-${i}`}
                    letter={letter}
                    cellKey={`${selected.id}-${letter}-${i}`}
                    className={CELL_TEXT_BY_SIZE[cellSize]}
                  />
                ))
              )}
            </div>

            {selected.kind === 'logographic' && (
              <p className="border-t border-border px-5 py-3 font-mono text-[11px] text-muted-foreground">
                Chinese is logographic rather than alphabetic — shown here is a small sample of common characters, not a
                full alphabet.
              </p>
            )}
          </div>
        </div>
      </div>

      <div className="pointer-events-none absolute bottom-3 left-1/2 -translate-x-1/2">
        <span className="rounded-none border border-border bg-background/90 px-2 py-1 font-mono text-[11px] text-muted-foreground tabular-nums shadow-sm backdrop-blur-sm">
          {visibleLetters.length}
          {symbolQuery ? ` / ${allLetters.length}` : ''} symbols
        </span>
      </div>
    </div>
  );
}
