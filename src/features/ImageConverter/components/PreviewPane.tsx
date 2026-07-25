import { useCallback, useEffect, useRef, type DragEvent } from 'react';
import { Upload } from 'lucide-react';
import { ACCEPT_IMAGE, SUPPORTED_FORMATS_LABEL } from '../constants';
import { processFiles } from '../helpers';
import { useConverterStore } from '../stores';

export function PreviewPane() {
  const images = useConverterStore((s) => s.images);
  const converted = useConverterStore((s) => s.converted);
  const selectedId = useConverterStore((s) => s.selectedId);
  const isDragging = useConverterStore((s) => s.isDragging);
  const isConverting = useConverterStore((s) => s.isConverting);
  const addImages = useConverterStore((s) => s.addImages);
  const selectImage = useConverterStore((s) => s.selectImage);
  const setDragging = useConverterStore((s) => s.setDragging);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const ingestFiles = useCallback(
    async (files: FileList | File[] | null) => {
      const { images: next } = await processFiles(files);
      if (next.length > 0) addImages(next);
    },
    [addImages]
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

  const selected = images.find((img) => img.id === selectedId) ?? images[0];
  const selectedConverted = selected ? converted.find((c) => c.sourceId === selected.id) : undefined;
  const previewUrl = selectedConverted?.dataUrl ?? selected?.dataUrl;
  const previewName = selectedConverted?.name ?? selected?.name;
  const previewMeta = selectedConverted
    ? `${selectedConverted.size} · ${selectedConverted.width}×${selectedConverted.height}`
    : selected
    ? `${selected.size} · ${selected.width}×${selected.height}`
    : '';

  return (
    <div className="relative flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden bg-muted/40">
      <input
        type="file"
        ref={fileInputRef}
        accept={ACCEPT_IMAGE}
        multiple
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
        {images.length === 0 ? (
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
                <p className="font-heading text-sm font-semibold">Drop images here</p>
                <p className="font-mono text-[11px] text-muted-foreground">click to select · paste from clipboard</p>
              </div>
              <p className="font-mono text-[10px] text-muted-foreground">{SUPPORTED_FORMATS_LABEL}</p>
            </button>
          </div>
        ) : isConverting ? (
          <div className="flex min-h-0 flex-1 flex-col items-center justify-center gap-3 p-8">
            <div className="size-8 animate-spin rounded-full border-2 border-border border-t-primary" />
            <p className="font-mono text-[11px] text-muted-foreground">Converting images…</p>
          </div>
        ) : (
          <div className="flex min-h-0 flex-1 flex-col gap-4 overflow-auto p-6 lg:p-10">
            {previewUrl && (
              <div className="flex min-h-0 flex-1 items-center justify-center">
                <img
                  src={previewUrl}
                  alt={previewName}
                  className="max-h-[min(420px,50svh)] max-w-full border border-border bg-background object-contain shadow-sm"
                />
              </div>
            )}

            <div className="flex flex-wrap justify-center gap-2">
              {images.map((img) => {
                const isActive = (selectedId ?? images[0]?.id) === img.id;
                const result = converted.find((c) => c.sourceId === img.id);
                return (
                  <button
                    key={img.id}
                    type="button"
                    onClick={() => selectImage(img.id)}
                    className={`border p-1 transition-colors ${
                      isActive
                        ? 'border-primary bg-background'
                        : 'border-border bg-background/70 hover:border-primary/50'
                    }`}
                  >
                    <img src={result?.dataUrl ?? img.dataUrl} alt={img.name} className="size-12 object-contain" />
                  </button>
                );
              })}
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="flex size-[3.5rem] items-center justify-center border border-dashed border-border text-muted-foreground transition-colors hover:border-primary hover:text-primary"
                title="Add more images"
              >
                <Upload className="size-4" />
              </button>
            </div>
          </div>
        )}
      </div>

      {selected && !isConverting && (
        <div className="pointer-events-none absolute bottom-3 left-1/2 -translate-x-1/2">
          <span className="rounded-none border border-border bg-background/90 px-2 py-1 font-mono text-[11px] text-muted-foreground tabular-nums shadow-sm backdrop-blur-sm">
            {previewName} · {previewMeta}
            {selectedConverted ? ' · converted' : ''}
          </span>
        </div>
      )}
    </div>
  );
}
