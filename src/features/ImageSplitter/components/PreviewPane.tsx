import { useCallback, useEffect, useRef, type DragEvent } from 'react';
import { Download, Upload } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ACCEPT_IMAGE, SUPPORTED_FORMATS_LABEL } from '../constants';
import { downloadTile, processFiles } from '../helpers';
import { useSplitterStore } from '../stores';

export function PreviewPane() {
  const source = useSplitterStore((s) => s.source);
  const tiles = useSplitterStore((s) => s.tiles);
  const columns = useSplitterStore((s) => s.columns);
  const selectedTileId = useSplitterStore((s) => s.selectedTileId);
  const isDragging = useSplitterStore((s) => s.isDragging);
  const isProcessing = useSplitterStore((s) => s.isProcessing);
  const setSource = useSplitterStore((s) => s.setSource);
  const selectTile = useSplitterStore((s) => s.selectTile);
  const setDragging = useSplitterStore((s) => s.setDragging);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const ingestFiles = useCallback(
    async (files: FileList | File[] | null) => {
      const image = await processFiles(files);
      if (image) setSource(image);
    },
    [setSource]
  );

  useEffect(() => {
    const handlePaste = (e: ClipboardEvent) => {
      const items = e.clipboardData?.items;
      if (!items) return;
      const imageItems = Array.from(items).filter((item) => item.type.startsWith('image/'));
      if (imageItems.length === 0) return;
      const files = imageItems.map((item) => item.getAsFile()).filter((f): f is File => f != null);
      if (files.length > 0) void ingestFiles(files);
    };
    document.addEventListener('paste', handlePaste);
    return () => document.removeEventListener('paste', handlePaste);
  }, [ingestFiles]);

  const handleDragEnter = (e: DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragging(true);
  };
  const handleDragLeave = (e: DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragging(false);
  };
  const handleDragOver = (e: DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };
  const handleDrop = (e: DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragging(false);
    void ingestFiles(e.dataTransfer.files);
  };

  const selectedTile = tiles.find((t) => t.id === selectedTileId) ?? tiles[0];
  const previewUrl = selectedTile?.dataUrl ?? source?.dataUrl;
  const previewMeta = selectedTile
    ? `r${selectedTile.row + 1},c${selectedTile.col + 1} · ${selectedTile.width}×${selectedTile.height}`
    : source
    ? `${source.size} · ${source.width}×${source.height}`
    : '';
  const previewName = selectedTile ? `Tile ${selectedTile.id + 1}` : source?.name ?? '';

  return (
    <div className="relative flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden bg-muted/40">
      <input
        type="file"
        ref={fileInputRef}
        accept={ACCEPT_IMAGE}
        className="hidden"
        onChange={(e) => {
          void ingestFiles(e.target.files);
          e.target.value = '';
        }}
      />

      <div
        className="flex min-h-0 flex-1 flex-col"
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        style={{
          backgroundImage:
            'radial-gradient(circle, color-mix(in oklab, var(--foreground) 8%, transparent) 1px, transparent 1px)',
          backgroundSize: '22px 22px',
        }}
      >
        {!source ? (
          <div className="flex min-h-0 flex-1 items-center justify-center p-8 lg:p-14">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className={`flex w-full max-w-md flex-col items-center justify-center gap-3 border-2 border-dashed px-8 py-14 text-center transition-colors ${
                isDragging
                  ? 'border-primary bg-primary/5'
                  : 'border-border bg-background/60 hover:border-primary/50 hover:bg-background/80'
              }`}
            >
              <Upload className={`size-10 ${isDragging ? 'text-primary' : 'text-muted-foreground'}`} />
              <div className="space-y-1">
                <p className="font-heading text-sm font-semibold">Drop image here</p>
                <p className="font-mono text-[11px] text-muted-foreground">click to select · paste from clipboard</p>
              </div>
              <p className="font-mono text-[10px] text-muted-foreground">{SUPPORTED_FORMATS_LABEL}</p>
            </button>
          </div>
        ) : isProcessing ? (
          <div className="flex min-h-0 flex-1 flex-col items-center justify-center gap-3 p-8">
            <div className="size-8 animate-spin rounded-full border-2 border-border border-t-primary" />
            <p className="font-mono text-[11px] text-muted-foreground">Splitting image…</p>
          </div>
        ) : tiles.length > 0 ? (
          <div className="flex min-h-0 flex-1 flex-col gap-4 overflow-auto p-6 lg:p-10">
            <div
              className="mx-auto grid w-full max-w-3xl gap-2"
              style={{
                gridTemplateColumns: `repeat(${Math.min(columns, 6)}, minmax(0, 1fr))`,
              }}
            >
              {tiles.map((tile) => {
                const isActive = (selectedTileId ?? tiles[0]?.id) === tile.id;
                return (
                  <div key={tile.id} className="group relative">
                    <button
                      type="button"
                      onClick={() => selectTile(tile.id)}
                      className={`w-full border p-1 transition-colors ${
                        isActive
                          ? 'border-primary bg-background'
                          : 'border-border bg-background/70 hover:border-primary/50'
                      }`}
                    >
                      <img
                        src={tile.dataUrl}
                        alt={`Tile ${tile.id + 1}`}
                        className="aspect-square w-full object-contain"
                      />
                    </button>
                    <span className="pointer-events-none absolute top-2 left-2 border border-border bg-background/90 px-1.5 py-0.5 font-mono text-[10px] tabular-nums backdrop-blur-sm">
                      {tile.row + 1},{tile.col + 1}
                    </span>
                    <Button
                      type="button"
                      variant="secondary"
                      size="icon"
                      className="absolute right-2 bottom-2 size-7 opacity-0 transition-opacity group-hover:opacity-100"
                      onClick={() => downloadTile(tile)}
                      title="Download tile"
                    >
                      <Download className="size-3.5" />
                    </Button>
                  </div>
                );
              })}
            </div>
          </div>
        ) : (
          <div className="flex min-h-0 flex-1 flex-col gap-4 overflow-auto p-6 lg:p-10">
            {previewUrl && (
              <div className="flex min-h-0 flex-1 items-center justify-center">
                <img
                  src={previewUrl}
                  alt={previewName}
                  className="max-h-[min(480px,55svh)] max-w-full border border-border bg-background object-contain shadow-sm"
                />
              </div>
            )}
            <div className="flex justify-center">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="flex size-14 items-center justify-center border border-dashed border-border text-muted-foreground transition-colors hover:border-primary hover:text-primary"
                title="Replace image"
              >
                <Upload className="size-4" />
              </button>
            </div>
          </div>
        )}
      </div>

      {source && !isProcessing && (
        <div className="pointer-events-none absolute bottom-3 left-1/2 -translate-x-1/2">
          <span className="rounded-none border border-border bg-background/90 px-2 py-1 font-mono text-[11px] text-muted-foreground tabular-nums shadow-sm backdrop-blur-sm">
            {previewName} · {previewMeta}
            {tiles.length > 0 ? ` · ${tiles.length} tiles` : ''}
          </span>
        </div>
      )}
    </div>
  );
}
