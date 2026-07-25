import { Grid2X2, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useSplitterStore } from '../stores';

export function ImageSplitterHeader() {
  const source = useSplitterStore((s) => s.source);
  const tiles = useSplitterStore((s) => s.tiles);
  const isProcessing = useSplitterStore((s) => s.isProcessing);
  const clearAll = useSplitterStore((s) => s.clearAll);

  const hasContent = source != null || tiles.length > 0;

  return (
    <header className="flex shrink-0 items-center justify-between border-b border-border px-6 py-3">
      <div className="flex items-center gap-2.5">
        <div className="flex size-7 items-center justify-center bg-primary text-primary-foreground">
          <Grid2X2 className="size-4" />
        </div>
        <div>
          <div className="font-heading text-sm leading-none font-semibold">Image Splitter</div>
          <div className="mt-1 font-mono text-[11px] leading-none text-muted-foreground">
            Split images into a grid of tiles
          </div>
        </div>
      </div>

      <Button variant="outline" size="sm" onClick={clearAll} disabled={!hasContent || isProcessing}>
        <Trash2 data-icon="inline-start" />
        Clear
      </Button>
    </header>
  );
}
