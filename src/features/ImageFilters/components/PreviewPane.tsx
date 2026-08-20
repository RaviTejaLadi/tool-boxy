import { useCallback, useEffect, useRef, type DragEvent } from 'react';
import { Upload } from 'lucide-react';
import { ACCEPT_IMAGE, SUPPORTED_FORMATS_LABEL, composeFilterCss, getFilterById } from '../constants';
import { processFiles } from '../helpers';
import { useFilterStore } from '../stores';
import { FiltersStrip } from './FiltersStrip';

export function PreviewPane() {
  const source = useFilterStore((s) => s.source);
  const selectedFilterId = useFilterStore((s) => s.selectedFilterId);
  const intensity = useFilterStore((s) => s.intensity);
  const settings = useFilterStore((s) => s.settings);
  const isDragging = useFilterStore((s) => s.isDragging);
  const setSource = useFilterStore((s) => s.setSource);
  const setDragging = useFilterStore((s) => s.setDragging);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const currentFilter = getFilterById(selectedFilterId);
  const composedCss = composeFilterCss(currentFilter.css, settings);
  const filterCss = composedCss.replace(/\s*opacity\([^)]+\)/g, '').trim();
  const amount = Math.max(0, Math.min(100, intensity)) / 100;
  const settingsOpacity = settings.opacity / 100;
  const hasEffect = Boolean(filterCss) && amount > 0;
  const showBlend = hasEffect && amount < 1;
  const previewFilter = hasEffect ? filterCss : 'none';

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
        ) : (
          <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
            <div className="flex min-h-0 flex-1 flex-col gap-3 overflow-auto p-4 lg:p-6">
              <div className="flex min-h-0 flex-1 items-center justify-center">
                <div
                  className="relative inline-block max-h-[min(420px,48svh)] max-w-full border border-border bg-background shadow-sm"
                  style={{ opacity: settingsOpacity }}
                >
                  {showBlend && (
                    <img
                      src={source.dataUrl}
                      alt=""
                      aria-hidden
                      className="block max-h-[min(420px,48svh)] max-w-full object-contain"
                    />
                  )}
                  <img
                    src={source.dataUrl}
                    alt={source.name}
                    className={`${
                      showBlend ? 'absolute inset-0 size-full' : 'block max-h-[min(420px,48svh)] max-w-full'
                    } object-contain transition-[filter,opacity] duration-200`}
                    style={{
                      filter: previewFilter,
                      opacity: showBlend ? amount : 1,
                    }}
                  />
                </div>
              </div>

              <div className="flex shrink-0 justify-center">
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="flex size-10 items-center justify-center border border-dashed border-border text-muted-foreground transition-colors hover:border-primary hover:text-primary"
                  title="Replace image"
                >
                  <Upload className="size-3.5" />
                </button>
              </div>
            </div>

            <FiltersStrip />
          </div>
        )}
      </div>

      {source && (
        <div className="pointer-events-none absolute top-3 left-1/2 z-10 -translate-x-1/2">
          <span className="rounded-none border border-border bg-background/90 px-2 py-1 font-mono text-[11px] text-muted-foreground tabular-nums shadow-sm backdrop-blur-sm">
            {source.name} · {source.width}×{source.height} · {currentFilter.name}
          </span>
        </div>
      )}
    </div>
  );
}
