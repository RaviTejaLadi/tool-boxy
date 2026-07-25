import { useState } from 'react';
import { ImageDown, Loader2, Scissors } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { MAX_GRID, MIN_GRID } from '../constants';
import { downloadAllTiles, splitImage } from '../helpers';
import { useSplitterStore } from '../stores';
import { SectionHeading } from './SectionHeading';

export function GridSection() {
  const source = useSplitterStore((s) => s.source);
  const columns = useSplitterStore((s) => s.columns);
  const rows = useSplitterStore((s) => s.rows);
  const tiles = useSplitterStore((s) => s.tiles);
  const isProcessing = useSplitterStore((s) => s.isProcessing);
  const setColumns = useSplitterStore((s) => s.setColumns);
  const setRows = useSplitterStore((s) => s.setRows);
  const setTiles = useSplitterStore((s) => s.setTiles);
  const setProcessing = useSplitterStore((s) => s.setProcessing);
  const [isDownloading, setIsDownloading] = useState(false);

  const clampGrid = (value: number) => Math.min(MAX_GRID, Math.max(MIN_GRID, value));

  const tileWidth = source ? Math.round(source.width / columns) : null;
  const tileHeight = source ? Math.round(source.height / rows) : null;
  const total = columns * rows;

  const handleSplit = async () => {
    if (!source) return;
    setProcessing(true);
    try {
      const next = await splitImage(source, columns, rows);
      setTiles(next);
    } finally {
      setProcessing(false);
    }
  };

  const handleDownloadAll = async () => {
    if (tiles.length === 0) return;
    setIsDownloading(true);
    try {
      await downloadAllTiles(tiles);
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <section className="space-y-3">
      <SectionHeading className="mb-3">Grid</SectionHeading>

      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-2">
          <Label
            htmlFor="split-columns"
            className="text-xs font-semibold tracking-wide text-muted-foreground uppercase"
          >
            Columns
          </Label>
          <Input
            id="split-columns"
            type="number"
            min={MIN_GRID}
            max={MAX_GRID}
            value={columns}
            onChange={(e) => setColumns(clampGrid(parseInt(e.target.value) || MIN_GRID))}
            className="font-mono text-sm"
            disabled={isProcessing}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="split-rows" className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">
            Rows
          </Label>
          <Input
            id="split-rows"
            type="number"
            min={MIN_GRID}
            max={MAX_GRID}
            value={rows}
            onChange={(e) => setRows(clampGrid(parseInt(e.target.value) || MIN_GRID))}
            className="font-mono text-sm"
            disabled={isProcessing}
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1.5 border border-border bg-muted/30 px-3 py-2">
          <p className="font-mono text-[10px] tracking-wide text-muted-foreground uppercase">Tile size</p>
          <p className="font-mono text-xs tabular-nums">
            {tileWidth != null && tileHeight != null ? `${tileWidth} × ${tileHeight} px` : '—'}
          </p>
        </div>
        <div className="space-y-1.5 border border-border bg-muted/30 px-3 py-2">
          <p className="font-mono text-[10px] tracking-wide text-muted-foreground uppercase">Total</p>
          <p className="font-mono text-xs tabular-nums">{total} tiles</p>
        </div>
      </div>

      <div className="flex flex-col gap-2 pt-1">
        <Button
          type="button"
          size="sm"
          className="w-full"
          onClick={() => void handleSplit()}
          disabled={!source || isProcessing || isDownloading}
        >
          {isProcessing ? (
            <Loader2 data-icon="inline-start" className="animate-spin" />
          ) : (
            <Scissors data-icon="inline-start" />
          )}
          {isProcessing ? 'Splitting…' : `Split into ${total} tiles`}
        </Button>
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="w-full"
          onClick={() => void handleDownloadAll()}
          disabled={tiles.length === 0 || isProcessing || isDownloading}
        >
          {isDownloading ? (
            <Loader2 data-icon="inline-start" className="animate-spin" />
          ) : (
            <ImageDown data-icon="inline-start" />
          )}
          {isDownloading ? 'Preparing…' : 'Download All'}
        </Button>
      </div>
    </section>
  );
}
