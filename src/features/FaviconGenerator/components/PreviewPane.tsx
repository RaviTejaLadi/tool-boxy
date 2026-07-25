import { useCallback, useEffect, useRef, type DragEvent } from 'react';
import { Upload } from 'lucide-react';
import { ACCEPT_IMAGE, SUPPORTED_FORMATS_LABEL, getTypeLabel } from '../constants';
import { processImageFile } from '../helpers';
import { useFaviconStore } from '../stores';

export function PreviewPane() {
  const image = useFaviconStore((s) => s.image);
  const fileName = useFaviconStore((s) => s.fileName);
  const favicons = useFaviconStore((s) => s.favicons);
  const selectedId = useFaviconStore((s) => s.selectedId);
  const isDragging = useFaviconStore((s) => s.isDragging);
  const isGenerating = useFaviconStore((s) => s.isGenerating);
  const setSource = useFaviconStore((s) => s.setSource);
  const setFavicons = useFaviconStore((s) => s.setFavicons);
  const setGenerating = useFaviconStore((s) => s.setGenerating);
  const setDragging = useFaviconStore((s) => s.setDragging);
  const selectFavicon = useFaviconStore((s) => s.selectFavicon);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const ingestFile = useCallback(
    async (file: File | null | undefined) => {
      if (!file) return;
      setGenerating(true);
      try {
        const result = await processImageFile(file);
        if (!result) return;
        setSource(result.image, result.fileName);
        setFavicons(result.favicons);
      } finally {
        setGenerating(false);
      }
    },
    [setFavicons, setGenerating, setSource]
  );

  useEffect(() => {
    const handlePaste = (e: ClipboardEvent) => {
      const items = e.clipboardData?.items;
      if (!items) return;
      const imageItem = Array.from(items).find((item) => item.type.startsWith('image/'));
      if (!imageItem) return;
      const file = imageItem.getAsFile();
      if (file) void ingestFile(file);
    };
    document.addEventListener('paste', handlePaste);
    return () => document.removeEventListener('paste', handlePaste);
  }, [ingestFile]);

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
    void ingestFile(e.dataTransfer.files[0]);
  };

  const selected = favicons.find((fav) => fav.id === selectedId) ?? favicons[0];

  return (
    <div className="relative flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden bg-muted/40">
      <input
        type="file"
        ref={fileInputRef}
        accept={ACCEPT_IMAGE}
        className="hidden"
        onChange={(e) => {
          void ingestFile(e.target.files?.[0]);
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
        {!image ? (
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
        ) : isGenerating ? (
          <div className="flex min-h-0 flex-1 flex-col items-center justify-center gap-3 p-8">
            <div className="size-8 animate-spin rounded-full border-2 border-border border-t-primary" />
            <p className="font-mono text-[11px] text-muted-foreground">Generating favicons…</p>
          </div>
        ) : (
          <div className="flex min-h-0 flex-1 flex-col gap-4 overflow-auto p-6 lg:p-10">
            <div className="flex min-h-0 flex-1 items-center justify-center">
              <img
                src={selected?.dataUrl ?? image}
                alt={selected ? `${selected.label} favicon` : fileName}
                className="max-h-[min(420px,50svh)] max-w-full border border-border bg-background object-contain shadow-sm"
                style={{
                  imageRendering: selected && selected.size <= 32 ? 'pixelated' : undefined,
                  width: selected ? Math.min(selected.size * 2, 256) : undefined,
                  height: selected ? Math.min(selected.size * 2, 256) : undefined,
                }}
              />
            </div>

            <div className="flex flex-wrap justify-center gap-2">
              {favicons.map((fav) => {
                const isActive = (selectedId ?? favicons[0]?.id) === fav.id;
                return (
                  <button
                    key={fav.id}
                    type="button"
                    onClick={() => selectFavicon(fav.id)}
                    title={`${fav.label} · ${getTypeLabel(fav.type)}`}
                    className={`border p-1 transition-colors ${
                      isActive
                        ? 'border-primary bg-background'
                        : 'border-border bg-background/70 hover:border-primary/50'
                    }`}
                  >
                    <img
                      src={fav.dataUrl}
                      alt={fav.label}
                      className="size-12 object-contain"
                      style={{ imageRendering: fav.size <= 32 ? 'pixelated' : undefined }}
                    />
                  </button>
                );
              })}
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="flex size-[3.5rem] items-center justify-center border border-dashed border-border text-muted-foreground transition-colors hover:border-primary hover:text-primary"
                title="Replace image"
              >
                <Upload className="size-4" />
              </button>
            </div>
          </div>
        )}
      </div>

      {image && selected && !isGenerating && (
        <div className="pointer-events-none absolute bottom-3 left-1/2 -translate-x-1/2">
          <span className="rounded-none border border-border bg-background/90 px-2 py-1 font-mono text-[11px] text-muted-foreground tabular-nums shadow-sm backdrop-blur-sm">
            {selected.label} · {getTypeLabel(selected.type)}
          </span>
        </div>
      )}
    </div>
  );
}
