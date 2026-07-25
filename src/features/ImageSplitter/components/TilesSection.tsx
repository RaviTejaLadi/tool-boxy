import { Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { downloadTile } from '../helpers';
import { useSplitterStore } from '../stores';
import { SectionHeading } from './SectionHeading';

export function TilesSection() {
  const source = useSplitterStore((s) => s.source);
  const tiles = useSplitterStore((s) => s.tiles);
  const selectedTileId = useSplitterStore((s) => s.selectedTileId);
  const selectTile = useSplitterStore((s) => s.selectTile);

  if (!source) {
    return (
      <section className="space-y-3">
        <SectionHeading className="mb-3">Tiles</SectionHeading>
        <p className="font-mono text-[11px] text-muted-foreground">Upload an image to begin splitting.</p>
      </section>
    );
  }

  if (tiles.length === 0) {
    return (
      <section className="space-y-3">
        <SectionHeading className="mb-3">Tiles</SectionHeading>
        <p className="font-mono text-[11px] text-muted-foreground">
          Set columns and rows, then split to generate tiles.
        </p>
      </section>
    );
  }

  return (
    <section className="space-y-3">
      <SectionHeading className="mb-3">Tiles · {tiles.length}</SectionHeading>

      <ul className="space-y-2">
        {tiles.map((tile) => {
          const isActive = (selectedTileId ?? tiles[0]?.id) === tile.id;
          return (
            <li key={tile.id}>
              <div
                className={`flex items-center gap-2 border px-2 py-2 transition-colors ${
                  isActive ? 'border-primary bg-primary/5' : 'border-border bg-background'
                }`}
              >
                <button
                  type="button"
                  onClick={() => selectTile(tile.id)}
                  className="flex min-w-0 flex-1 items-center gap-2 text-left"
                >
                  <img
                    src={tile.dataUrl}
                    alt=""
                    className="size-8 shrink-0 border border-border bg-muted/30 object-contain"
                  />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium">
                      Row {tile.row + 1}, Col {tile.col + 1}
                    </p>
                    <p className="font-mono text-[10px] text-muted-foreground">
                      {tile.width}×{tile.height}
                    </p>
                  </div>
                </button>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="size-7 shrink-0 text-muted-foreground hover:text-foreground"
                  onClick={() => downloadTile(tile)}
                  title="Download"
                >
                  <Download className="size-3.5" />
                </Button>
              </div>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
