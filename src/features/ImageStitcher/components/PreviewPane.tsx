import { useCallback, useEffect, useMemo, useRef, useState, type DragEvent, type PointerEvent } from 'react';
import { Upload, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ACCEPT_IMAGE, MAX_SCALE, MIN_SCALE, SUPPORTED_FORMATS_LABEL } from '../constants';
import { chunkByPattern, computeRowPattern, describeLayout, processFiles } from '../helpers';
import { useStitcherStore } from '../stores';

const ROW_HEIGHT = 200;

function CompositionTile({
  id,
  index,
  flexGrow,
  isDropTarget,
  onDragStartIndex,
  onDragOverIndex,
  onDropIndex,
  onDragEnd,
}: {
  id: string;
  index: number;
  flexGrow: number;
  isDropTarget: boolean;
  onDragStartIndex: (index: number) => void;
  onDragOverIndex: (index: number) => void;
  onDropIndex: (index: number) => void;
  onDragEnd: () => void;
}) {
  const image = useStitcherStore((s) => s.images.find((img) => img.id === id));
  const selectedImageId = useStitcherStore((s) => s.selectedImageId);
  const selectImage = useStitcherStore((s) => s.selectImage);
  const removeImage = useStitcherStore((s) => s.removeImage);
  const setImageScale = useStitcherStore((s) => s.setImageScale);
  const [isResizing, setIsResizing] = useState(false);
  const resizeRef = useRef<{ startX: number; startScale: number } | null>(null);

  if (!image) return null;

  const isActive = selectedImageId === image.id;

  const onResizePointerDown = (e: PointerEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();
    selectImage(image.id);
    resizeRef.current = { startX: e.clientX, startScale: image.scale };
    setIsResizing(true);
    e.currentTarget.setPointerCapture(e.pointerId);
  };

  const onResizePointerMove = (e: PointerEvent<HTMLButtonElement>) => {
    if (!resizeRef.current) return;
    const delta = e.clientX - resizeRef.current.startX;
    setImageScale(image.id, resizeRef.current.startScale + delta / 180);
  };

  const onResizePointerUp = (e: PointerEvent<HTMLButtonElement>) => {
    if (!resizeRef.current) return;
    resizeRef.current = null;
    setIsResizing(false);
    try {
      e.currentTarget.releasePointerCapture(e.pointerId);
    } catch {
      /* already released */
    }
  };

  return (
    <div
      draggable={!isResizing}
      onDragStart={(e) => {
        if (isResizing) {
          e.preventDefault();
          return;
        }
        e.dataTransfer.effectAllowed = 'move';
        e.dataTransfer.setData('text/plain', String(index));
        onDragStartIndex(index);
      }}
      onDragOver={(e) => {
        e.preventDefault();
        e.stopPropagation();
        e.dataTransfer.dropEffect = 'move';
        onDragOverIndex(index);
      }}
      onDrop={(e) => {
        e.preventDefault();
        e.stopPropagation();
        onDropIndex(index);
      }}
      onDragEnd={onDragEnd}
      onClick={() => selectImage(image.id)}
      className={`group relative min-w-0 cursor-grab border bg-background active:cursor-grabbing ${
        isActive
          ? 'border-primary ring-1 ring-primary'
          : isDropTarget
          ? 'border-primary border-dashed'
          : 'border-border'
      }`}
      style={{ flexGrow, flexBasis: 0, height: ROW_HEIGHT }}
    >
      <img
        src={image.dataUrl}
        alt={image.name}
        className="size-full"
        draggable={false}
        style={{
          objectFit: image.fit,
          opacity: image.opacity,
          mixBlendMode: image.blendMode,
          transform: `rotate(${image.rotation}deg) scaleX(${image.flipX ? -1 : 1}) scaleY(${image.flipY ? -1 : 1})`,
        }}
      />

      <span className="pointer-events-none absolute top-1 left-1 border border-border bg-background/90 px-1 font-mono text-[10px] tabular-nums backdrop-blur-sm">
        {index + 1}
      </span>
      <span className="pointer-events-none absolute bottom-1 left-1 max-w-[calc(100%-0.5rem)] truncate border border-border bg-background/90 px-1 font-mono text-[10px] tabular-nums backdrop-blur-sm">
        {image.fit} · {Math.round(image.opacity * 100)}%
      </span>

      <Button
        type="button"
        variant="secondary"
        size="icon"
        className="absolute top-1 right-1 size-6 opacity-0 transition-opacity group-hover:opacity-100"
        onClick={(e) => {
          e.stopPropagation();
          removeImage(image.id);
        }}
        title="Remove"
      >
        <X className="size-3" />
      </Button>

      {isActive && (
        <button
          type="button"
          aria-label="Resize image"
          className="absolute right-0 bottom-0 z-10 size-4 cursor-ew-resize border border-primary bg-primary"
          onPointerDown={onResizePointerDown}
          onPointerMove={onResizePointerMove}
          onPointerUp={onResizePointerUp}
          onPointerCancel={onResizePointerUp}
          onClick={(e) => e.stopPropagation()}
        />
      )}
    </div>
  );
}

export function PreviewPane() {
  const idsSignature = useStitcherStore((s) => s.images.map((img) => img.id).join('|'));
  const scalesSignature = useStitcherStore((s) => s.images.map((img) => img.scale).join(','));
  const imageCount = useStitcherStore((s) => s.images.length);
  const isFileDragging = useStitcherStore((s) => s.isFileDragging);
  const error = useStitcherStore((s) => s.error);
  const addImages = useStitcherStore((s) => s.addImages);
  const swapImages = useStitcherStore((s) => s.swapImages);
  const setFileDragging = useStitcherStore((s) => s.setFileDragging);
  const setError = useStitcherStore((s) => s.setError);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [dragIndex, setDragIndex] = useState<number | null>(null);
  const [overIndex, setOverIndex] = useState<number | null>(null);

  const imageIds = useMemo(() => (idsSignature.length > 0 ? idsSignature.split('|') : []), [idsSignature]);

  const scales = useMemo(
    () => (scalesSignature.length > 0 ? scalesSignature.split(',').map(Number) : []),
    [scalesSignature]
  );

  const pattern = useMemo(() => computeRowPattern(imageCount), [imageCount]);
  const rows = useMemo(() => chunkByPattern(imageIds, pattern), [imageIds, pattern]);
  const layoutLabel = useMemo(() => describeLayout(imageCount), [imageCount]);

  const ingestFiles = useCallback(
    async (files: FileList | File[] | null) => {
      const next = await processFiles(files);
      if (next.length === 0) {
        setError('No valid images found');
        return;
      }
      addImages(next);
    },
    [addImages, setError]
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
    if (e.dataTransfer.types.includes('Files')) {
      e.preventDefault();
      e.stopPropagation();
      setFileDragging(true);
    }
  };
  const handleDragLeave = (e: DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setFileDragging(false);
  };
  const handleDragOver = (e: DragEvent) => {
    if (e.dataTransfer.types.includes('Files')) {
      e.preventDefault();
      e.stopPropagation();
    }
  };
  const handleDrop = (e: DragEvent) => {
    if (!e.dataTransfer.files?.length) return;
    e.preventDefault();
    e.stopPropagation();
    setFileDragging(false);
    void ingestFiles(e.dataTransfer.files);
  };

  const clearDrag = () => {
    setDragIndex(null);
    setOverIndex(null);
  };

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
        {imageCount === 0 ? (
          <div className="flex min-h-0 flex-1 items-center justify-center p-8 lg:p-14">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className={`flex w-full max-w-md flex-col items-center justify-center gap-3 border-2 border-dashed px-8 py-14 text-center transition-colors ${
                isFileDragging
                  ? 'border-primary bg-primary/5'
                  : 'border-border bg-background/60 hover:border-primary/50 hover:bg-background/80'
              }`}
            >
              <Upload className={`size-10 ${isFileDragging ? 'text-primary' : 'text-muted-foreground'}`} />
              <div className="space-y-1">
                <p className="font-heading text-sm font-semibold">Drop images here</p>
                <p className="font-mono text-[11px] text-muted-foreground">Add several images at once or paste</p>
              </div>
              <p className="font-mono text-[10px] text-muted-foreground">{SUPPORTED_FORMATS_LABEL}</p>
            </button>
          </div>
        ) : (
          <div className="flex min-h-0 flex-1 flex-col gap-4 overflow-auto p-6 lg:p-10">
            <div className="mx-auto flex w-full max-w-4xl flex-col gap-0 border border-border bg-background shadow-sm">
              {rows.map((row, rowIndex) => {
                let offset = 0;
                for (let r = 0; r < rowIndex; r++) offset += rows[r].length;

                return (
                  <div key={`row-${rowIndex}`} className="flex w-full">
                    {row.map((id, colIndex) => {
                      const index = offset + colIndex;
                      return (
                        <CompositionTile
                          key={id}
                          id={id}
                          index={index}
                          flexGrow={scales[index] > 0 ? scales[index] : 1}
                          isDropTarget={overIndex === index && dragIndex !== null && dragIndex !== index}
                          onDragStartIndex={setDragIndex}
                          onDragOverIndex={setOverIndex}
                          onDropIndex={(to) => {
                            if (dragIndex != null) swapImages(dragIndex, to);
                            clearDrag();
                          }}
                          onDragEnd={clearDrag}
                        />
                      );
                    })}
                  </div>
                );
              })}
            </div>

            <div className="flex justify-center">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="flex size-14 items-center justify-center border border-dashed border-border text-muted-foreground transition-colors hover:border-primary hover:text-primary"
                title="Add more images"
              >
                <Upload className="size-4" />
              </button>
            </div>

            <p className="text-center font-mono text-[11px] text-muted-foreground">
              Smart layout {layoutLabel} · drag tiles to swap · resize handle ({Math.round(MIN_SCALE * 100)}–
              {Math.round(MAX_SCALE * 100)}%) · download when ready
            </p>
          </div>
        )}
      </div>

      {error && (
        <div className="absolute top-3 left-1/2 z-10 -translate-x-1/2">
          <span className="border border-destructive/30 bg-destructive/10 px-3 py-1.5 font-mono text-[11px] text-destructive shadow-sm backdrop-blur-sm">
            {error}
          </span>
        </div>
      )}

      {imageCount > 0 && (
        <div className="pointer-events-none absolute bottom-3 left-1/2 -translate-x-1/2">
          <span className="rounded-none border border-border bg-background/90 px-2 py-1 font-mono text-[11px] text-muted-foreground tabular-nums shadow-sm backdrop-blur-sm">
            {imageCount} image{imageCount === 1 ? '' : 's'} · {layoutLabel}
          </span>
        </div>
      )}
    </div>
  );
}
