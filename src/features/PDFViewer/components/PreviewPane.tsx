import { useCallback, useEffect, useRef, type DragEvent } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import {
  ChevronLeft,
  ChevronRight,
  Columns2,
  Download,
  Fullscreen,
  Printer,
  RotateCw,
  Square,
  Upload,
  X,
  ZoomIn,
  ZoomOut,
} from 'lucide-react';
import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { ACCEPT_PDF, SUPPORTED_FORMATS_LABEL } from '../constants';
import { downloadPdf, formatFileSize, printPdf, processPdfFiles } from '../helpers';
import { useViewerStore } from '../stores';

pdfjs.GlobalWorkerOptions.workerSrc = new URL('pdfjs-dist/build/pdf.worker.min.mjs', import.meta.url).toString();

export function PreviewPane() {
  const file = useViewerStore((s) => s.file);
  const pageNumber = useViewerStore((s) => s.pageNumber);
  const numPages = useViewerStore((s) => s.numPages);
  const scale = useViewerStore((s) => s.scale);
  const rotation = useViewerStore((s) => s.rotation);
  const twoPageView = useViewerStore((s) => s.twoPageView);
  const isDragging = useViewerStore((s) => s.isDragging);
  const isLoading = useViewerStore((s) => s.isLoading);
  const error = useViewerStore((s) => s.error);
  const setFile = useViewerStore((s) => s.setFile);
  const setNumPages = useViewerStore((s) => s.setNumPages);
  const setError = useViewerStore((s) => s.setError);
  const setDragging = useViewerStore((s) => s.setDragging);
  const setPageNumber = useViewerStore((s) => s.setPageNumber);
  const zoomIn = useViewerStore((s) => s.zoomIn);
  const zoomOut = useViewerStore((s) => s.zoomOut);
  const rotate = useViewerStore((s) => s.rotate);
  const toggleTwoPageView = useViewerStore((s) => s.toggleTwoPageView);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const pageStep = twoPageView ? 2 : 1;
  const secondPage = twoPageView && numPages != null && pageNumber + 1 <= numPages ? pageNumber + 1 : null;
  const pageLabel =
    numPages == null
      ? null
      : twoPageView && secondPage != null
      ? `pages ${pageNumber}–${secondPage}/${numPages}`
      : `page ${pageNumber}/${numPages}`;
  const pageWidth = Math.min(
    typeof window !== 'undefined' ? window.innerWidth * (twoPageView ? 0.4 : 0.75) : 900,
    twoPageView ? 520 : 900
  );

  const toggleFullscreen = () => {
    const container = document.getElementById('pdf-viewer-preview');
    if (!container) return;
    if (!document.fullscreenElement) {
      void container.requestFullscreen().catch((err) => {
        console.error('Fullscreen error:', err);
      });
    } else {
      void document.exitFullscreen();
    }
  };

  const ingestFiles = useCallback(
    (files: FileList | File[] | null) => {
      const next = processPdfFiles(files);
      if (next) {
        setFile(next);
      } else if (files && files.length > 0) {
        setError('Please upload a valid PDF file.');
      }
    },
    [setFile, setError]
  );

  useEffect(() => {
    const handlePaste = (e: ClipboardEvent) => {
      const items = e.clipboardData?.items;
      if (!items) return;
      const files = Array.from(items)
        .map((item) => item.getAsFile())
        .filter((f): f is File => f != null);
      if (files.length > 0) ingestFiles(files);
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
    ingestFiles(e.dataTransfer.files);
  };

  return (
    <div id="pdf-viewer-preview" className="relative flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden bg-muted/40">
      <input
        type="file"
        ref={fileInputRef}
        accept={ACCEPT_PDF}
        className="hidden"
        onChange={(e) => {
          ingestFiles(e.target.files);
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
        {!file ? (
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
                <p className="font-heading text-sm font-semibold">Drop PDF here</p>
                <p className="font-mono text-[11px] text-muted-foreground">click to select · paste from clipboard</p>
              </div>
              <p className="font-mono text-[10px] text-muted-foreground">{SUPPORTED_FORMATS_LABEL}</p>
            </button>
          </div>
        ) : error ? (
          <div className="flex min-h-0 flex-1 flex-col items-center justify-center gap-3 p-8 text-destructive">
            <X className="size-8" />
            <p className="font-mono text-[11px]">{error}</p>
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="font-mono text-[11px] text-muted-foreground underline-offset-2 hover:text-foreground hover:underline"
            >
              Try another file
            </button>
          </div>
        ) : (
          <div className="relative flex min-h-0 flex-1 flex-col overflow-auto p-6 pt-18 lg:p-10 lg:pt-20">
            {isLoading && (
              <div className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-3 bg-muted/40">
                <div className="size-8 animate-spin rounded-full border-2 border-border border-t-primary" />
                <p className="font-mono text-[11px] text-muted-foreground">Loading PDF…</p>
              </div>
            )}
            <div className="mx-auto flex w-full justify-center">
              <Document
                file={file}
                onLoadSuccess={({ numPages: pages }) => setNumPages(pages)}
                onLoadError={(err) => {
                  console.error(err);
                  setError('Failed to load PDF. Please try again.');
                }}
                loading={null}
                className="flex flex-wrap items-start justify-center gap-3"
              >
                <Page
                  key={`page_${pageNumber}_${scale}_${rotation}_l`}
                  pageNumber={pageNumber}
                  scale={scale}
                  rotate={rotation}
                  renderTextLayer
                  renderAnnotationLayer
                  className="max-w-full border border-border bg-background shadow-sm [&_canvas]:max-w-full"
                  width={pageWidth}
                />
                {secondPage != null && (
                  <Page
                    key={`page_${secondPage}_${scale}_${rotation}_r`}
                    pageNumber={secondPage}
                    scale={scale}
                    rotate={rotation}
                    renderTextLayer
                    renderAnnotationLayer
                    className="max-w-full border border-border bg-background shadow-sm [&_canvas]:max-w-full"
                    width={pageWidth}
                  />
                )}
              </Document>
            </div>
          </div>
        )}
      </div>

      {file && !error && (
        <>
          {/* Floating controls on top of the PDF */}
          <div className="pointer-events-none absolute top-3 left-1/2 z-20 -translate-x-1/2">
            <div className="pointer-events-auto flex flex-wrap items-center gap-1 border border-border bg-background/90 px-1.5 py-1 shadow-sm backdrop-blur-sm">
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="size-8"
                onClick={() => setPageNumber(pageNumber - pageStep)}
                disabled={pageNumber <= 1}
              >
                <ChevronLeft className="size-4" />
              </Button>
              <div className="flex items-center gap-1.5">
                <Input
                  type="number"
                  min={1}
                  max={numPages ?? 1}
                  value={pageNumber}
                  onChange={(e) => {
                    const page = parseInt(e.target.value, 10);
                    if (!Number.isNaN(page)) setPageNumber(page);
                  }}
                  className="h-8 w-12 text-center font-mono [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
                />
                <span className="font-mono text-[11px] text-muted-foreground">
                  {twoPageView && secondPage != null ? `–${secondPage}` : ''} / {numPages ?? '…'}
                </span>
              </div>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="size-8"
                onClick={() => setPageNumber(pageNumber + pageStep)}
                disabled={pageNumber >= (numPages ?? 1) || (twoPageView && pageNumber + 1 >= (numPages ?? 1))}
              >
                <ChevronRight className="size-4" />
              </Button>

              <Separator orientation="vertical" className="mx-1 h-6" />

              <Button type="button" variant="ghost" size="icon" className="size-8" onClick={zoomOut}>
                <ZoomOut className="size-4" />
              </Button>
              <span className="min-w-10 text-center font-mono text-[11px] text-muted-foreground">
                {Math.round(scale * 100)}%
              </span>
              <Button type="button" variant="ghost" size="icon" className="size-8" onClick={zoomIn}>
                <ZoomIn className="size-4" />
              </Button>

              <Separator orientation="vertical" className="mx-1 h-6" />

              <Button
                type="button"
                variant={twoPageView ? 'secondary' : 'ghost'}
                size="icon"
                className="size-8"
                onClick={toggleTwoPageView}
                title={twoPageView ? 'Single page view' : 'Two pages side by side'}
              >
                {twoPageView ? <Square className="size-4" /> : <Columns2 className="size-4" />}
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="size-8"
                onClick={rotate}
                title={`Rotate ${rotation}°`}
              >
                <RotateCw className="size-4" />
              </Button>
              <Button type="button" variant="ghost" size="icon" className="size-8" onClick={() => downloadPdf(file)}>
                <Download className="size-4" />
              </Button>
              <Button type="button" variant="ghost" size="icon" className="size-8" onClick={() => printPdf(file)}>
                <Printer className="size-4" />
              </Button>
              <Button type="button" variant="ghost" size="icon" className="size-8" onClick={toggleFullscreen}>
                <Fullscreen className="size-4" />
              </Button>
            </div>
          </div>

          {/* File info */}
          <div className="pointer-events-none absolute bottom-3 left-1/2 z-20 -translate-x-1/2">
            <span className="rounded-none border border-border bg-background/90 px-2 py-1 font-mono text-[11px] text-muted-foreground tabular-nums shadow-sm backdrop-blur-sm">
              {file.name} · {formatFileSize(file.size)}
              {pageLabel ? ` · ${pageLabel}` : ''}
            </span>
          </div>
        </>
      )}
    </div>
  );
}
