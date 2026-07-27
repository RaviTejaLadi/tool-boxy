import { useCallback, useRef, type ChangeEvent, type DragEvent } from 'react';
import { ImageIcon, Upload, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ACCEPT_IMAGE } from '../constants';
import { isValidImageFile, readFileAsDataUrl } from '../helpers';
import { useAsciiStore } from '../stores';
import { SectionHeading } from './SectionHeading';

export function UploadSection() {
  const imageSrc = useAsciiStore((s) => s.imageSrc);
  const fileName = useAsciiStore((s) => s.fileName);
  const isDragging = useAsciiStore((s) => s.isDragging);
  const error = useAsciiStore((s) => s.error);
  const setSource = useAsciiStore((s) => s.setSource);
  const setDragging = useAsciiStore((s) => s.setDragging);
  const setError = useAsciiStore((s) => s.setError);
  const clear = useAsciiStore((s) => s.clear);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const ingestFile = useCallback(
    async (file: File | null | undefined) => {
      if (!file) return;
      const validationError = isValidImageFile(file);
      if (validationError) {
        setError(validationError);
        return;
      }
      try {
        const dataUrl = await readFileAsDataUrl(file);
        setSource(dataUrl, file.name || `image-${Date.now()}`);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to read image file');
      } finally {
        if (fileInputRef.current) fileInputRef.current.value = '';
      }
    },
    [setError, setSource]
  );

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

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    void ingestFile(e.target.files?.[0]);
  };

  return (
    <section className="space-y-3">
      <SectionHeading className="mb-3">Upload</SectionHeading>

      <input type="file" ref={fileInputRef} accept={ACCEPT_IMAGE} className="hidden" onChange={handleFileChange} />

      {!imageSrc ? (
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          onDragEnter={handleDragEnter}
          onDragLeave={handleDragLeave}
          onDragOver={handleDragOver}
          onDrop={handleDrop}
          className={`flex w-full flex-col items-center justify-center gap-3 border-2 border-dashed px-4 py-8 text-center transition-colors ${
            isDragging
              ? 'border-primary bg-primary/5'
              : 'border-border bg-muted/30 hover:border-primary/50 hover:bg-muted/50'
          }`}
        >
          <Upload className={`size-6 ${isDragging ? 'text-primary' : 'text-muted-foreground'}`} />
          <div className="space-y-1">
            <p className="font-heading text-sm font-semibold">Drop an image here</p>
            <p className="font-mono text-[11px] text-muted-foreground">or click to select a file</p>
          </div>
          <span className="inline-flex items-center gap-1.5 border border-border bg-background px-2.5 py-1 font-mono text-[11px] text-muted-foreground">
            <ImageIcon className="size-3.5" />
            Choose Image
          </span>
        </button>
      ) : (
        <div className="space-y-3">
          <div className="relative overflow-hidden border border-border bg-muted/40">
            <img src={imageSrc} alt={fileName || 'Uploaded'} className="max-h-40 w-full object-contain" />
            <Button type="button" variant="destructive" size="sm" className="absolute top-2 right-2" onClick={clear}>
              <X data-icon="inline-start" />
              Remove
            </Button>
          </div>
          {fileName ? (
            <p className="truncate font-mono text-[11px] text-muted-foreground" title={fileName}>
              {fileName}
            </p>
          ) : null}
          <Button type="button" variant="outline" className="w-full" onClick={() => fileInputRef.current?.click()}>
            <Upload data-icon="inline-start" />
            Replace image
          </Button>
        </div>
      )}

      {error && (
        <p className="border border-destructive/30 bg-destructive/10 px-3 py-2 font-mono text-[11px] text-destructive">
          {error}
        </p>
      )}

      <p className="font-mono text-[11px] leading-relaxed text-muted-foreground">
        Supports common image formats. Max size 10MB.
      </p>
    </section>
  );
}
