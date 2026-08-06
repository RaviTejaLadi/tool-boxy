import { useCallback, useEffect, useMemo, useRef, useState, type DragEvent } from 'react';
import { Document, Page } from 'react-pdf';
import {
  ChevronLeft,
  ChevronRight,
  Copy,
  Download,
  Fullscreen,
  GripVertical,
  PanelRightClose,
  PanelRightOpen,
  Plus,
  Printer,
  RotateCw,
  Undo2,
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
import {
  downloadPdf,
  duplicatePdfPage,
  ensurePdfWorker,
  formatFileSize,
  insertPdfAtPosition,
  mergePdfFilesToFile,
  printPdf,
  processPdfFileList,
  removePdfPage,
  reorderPdfFile,
  rotatePdfPage,
} from '../helpers';
import { useViewerStore } from '../stores';

ensurePdfWorker();

function toErrorMessage(error: unknown): string {
  if (error instanceof Error && error.message) return error.message;
  return 'Failed to process PDF. Please try again.';
}

function moveItem<T>(items: T[], fromIndex: number, toIndex: number): T[] {
  const next = [...items];
  const [item] = next.splice(fromIndex, 1);
  next.splice(toIndex, 0, item);
  return next;
}

interface RemovedPageBinItem {
  id: string;
  pageFile: File;
  originalPage: number;
  removedAt: string;
}

export function PreviewPane() {
  const file = useViewerStore((s) => s.file);
  const pageNumber = useViewerStore((s) => s.pageNumber);
  const numPages = useViewerStore((s) => s.numPages);
  const scale = useViewerStore((s) => s.scale);
  const pagesPerRow = useViewerStore((s) => s.pagesPerRow);
  const isDragging = useViewerStore((s) => s.isDragging);
  const isLoading = useViewerStore((s) => s.isLoading);
  const error = useViewerStore((s) => s.error);
  const setFile = useViewerStore((s) => s.setFile);
  const replaceFile = useViewerStore((s) => s.replaceFile);
  const setNumPages = useViewerStore((s) => s.setNumPages);
  const setError = useViewerStore((s) => s.setError);
  const setDragging = useViewerStore((s) => s.setDragging);
  const setLoading = useViewerStore((s) => s.setLoading);
  const setPageNumber = useViewerStore((s) => s.setPageNumber);
  const zoomIn = useViewerStore((s) => s.zoomIn);
  const zoomOut = useViewerStore((s) => s.zoomOut);
  const setPagesPerRow = useViewerStore((s) => s.setPagesPerRow);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const previewScrollRef = useRef<HTMLDivElement>(null);
  const pageElementMapRef = useRef<Map<number, HTMLDivElement>>(new Map());
  const scrollSyncFrameRef = useRef<number | null>(null);
  const currentPageRef = useRef(pageNumber);
  const [showPageOrganizer, setShowPageOrganizer] = useState(true);
  const [organizerOrder, setOrganizerOrder] = useState<number[]>([]);
  const [draggedPageIndex, setDraggedPageIndex] = useState<number | null>(null);
  const [dropPageIndex, setDropPageIndex] = useState<number | null>(null);
  const [removedPageBin, setRemovedPageBin] = useState<RemovedPageBinItem[]>([]);
  const [activePageAction, setActivePageAction] = useState<'remove' | 'duplicate' | 'rotate' | 'restore' | null>(null);
  const [notice, setNotice] = useState<string | null>(null);

  const pageStep = pagesPerRow;
  const allPages = useMemo(() => {
    if (numPages == null || numPages < 1) return [1];
    return Array.from({ length: numPages }, (_, index) => index + 1);
  }, [numPages]);
  const lastVisiblePage = Math.min(pageNumber + pagesPerRow - 1, numPages ?? 1);
  const pageLabel =
    numPages == null
      ? null
      : lastVisiblePage > pageNumber
      ? `pages ${pageNumber}–${lastVisiblePage}/${numPages}`
      : `page ${pageNumber}/${numPages}`;
  const widthFraction = pagesPerRow === 1 ? 0.75 : pagesPerRow === 2 ? 0.43 : 0.3;
  const maxPageWidth = pagesPerRow === 1 ? 900 : pagesPerRow === 2 ? 560 : 390;
  const pageWidth = Math.min(
    typeof window !== 'undefined' ? window.innerWidth * widthFraction : maxPageWidth,
    maxPageWidth
  );
  const fileSignature = useMemo(() => (file ? `${file.name}:${file.size}:${file.lastModified}` : ''), [file]);
  const canReorderPages = file != null && numPages != null && numPages > 1 && !isLoading;
  const canRunPageActions = file != null && numPages != null && !isLoading && activePageAction == null;

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

  const clampPageNumber = useCallback(
    (nextPage: number) => {
      const max = numPages ?? 1;
      return Math.min(Math.max(nextPage, 1), max);
    },
    [numPages]
  );

  const setPageElementRef = useCallback(
    (page: number) => (element: HTMLDivElement | null) => {
      if (element) {
        pageElementMapRef.current.set(page, element);
      } else {
        pageElementMapRef.current.delete(page);
      }
    },
    []
  );

  const scrollToPage = useCallback(
    (targetPage: number, behavior: ScrollBehavior = 'smooth') => {
      const nextPage = clampPageNumber(targetPage);
      setPageNumber(nextPage);
      const element = pageElementMapRef.current.get(nextPage);
      if (element) {
        element.scrollIntoView({ behavior, block: 'start', inline: 'nearest' });
      }
    },
    [clampPageNumber, setPageNumber]
  );

  const syncPageFromScroll = useCallback(() => {
    const container = previewScrollRef.current;
    if (!container || !numPages) return;

    const containerRect = container.getBoundingClientRect();
    const markerY = containerRect.top + 26;
    let closestPage: number | null = null;
    let closestDistance = Number.POSITIVE_INFINITY;

    for (const [page, element] of Array.from(pageElementMapRef.current.entries())) {
      const rect = element.getBoundingClientRect();
      if (rect.bottom < containerRect.top || rect.top > containerRect.bottom) continue;
      const distance = Math.abs(rect.top - markerY);
      if (distance < closestDistance) {
        closestDistance = distance;
        closestPage = page;
      }
    }

    if (closestPage != null && closestPage !== currentPageRef.current) {
      setPageNumber(closestPage);
    }
  }, [numPages, setPageNumber]);

  const scheduleScrollSync = useCallback(() => {
    if (scrollSyncFrameRef.current != null) return;
    scrollSyncFrameRef.current = requestAnimationFrame(() => {
      scrollSyncFrameRef.current = null;
      syncPageFromScroll();
    });
  }, [syncPageFromScroll]);

  const ingestFiles = useCallback(
    async (files: FileList | File[] | null) => {
      const additions = processPdfFileList(files);
      if (additions.length === 0) {
        if (files && files.length > 0) setError('Please upload valid PDF files only.');
        return;
      }

      setError(null);
      setNotice(null);
      setRemovedPageBin([]);

      if (!file && additions.length === 1) {
        setFile(additions[0]);
        return;
      }

      setLoading(true);
      try {
        const mergeQueue = file ? [file, ...additions] : additions;
        const merged = await mergePdfFilesToFile(mergeQueue, file?.name);
        if (file) {
          replaceFile(merged);
        } else {
          setFile(merged);
        }
        if (file) {
          setNotice(`Added ${additions.length} PDF${additions.length > 1 ? 's' : ''} and auto-merged in preview.`);
        } else {
          setNotice(`Loaded ${additions.length} PDFs as one merged document.`);
        }
      } catch (ingestError) {
        setError(toErrorMessage(ingestError));
        setLoading(false);
      }
    },
    [file, replaceFile, setError, setFile, setLoading]
  );

  const applyPageOrder = useCallback(
    async (nextOrder: number[]) => {
      if (!file || !numPages || nextOrder.length !== numPages) return;
      setLoading(true);
      setError(null);
      try {
        const reordered = await reorderPdfFile(file, nextOrder, file.name);
        replaceFile(reordered);
        setNotice('Page order updated successfully.');
      } catch (reorderError) {
        setError(toErrorMessage(reorderError));
        setLoading(false);
      }
    },
    [file, numPages, replaceFile, setLoading, setError]
  );

  const runPageAction = useCallback(
    async (action: 'remove' | 'duplicate' | 'rotate' | 'restore', work: () => Promise<void>) => {
      setActivePageAction(action);
      setLoading(true);
      setError(null);
      try {
        await work();
      } catch (pageActionError) {
        setError(toErrorMessage(pageActionError));
        setLoading(false);
      } finally {
        setActivePageAction(null);
      }
    },
    [setError, setLoading]
  );

  const removePageToBin = useCallback(
    async (page: number) => {
      if (!file) return;
      await runPageAction('remove', async () => {
        const result = await removePdfPage(file, page, file.name);
        replaceFile(result.file);
        setPageNumber(Math.min(page, result.remainingPages));
        setRemovedPageBin((current) => [
          {
            id: `${Date.now()}-${Math.random().toString(36).slice(2)}`,
            pageFile: result.removedPage,
            originalPage: result.removedPageNumber,
            removedAt: new Date().toLocaleTimeString(),
          },
          ...current,
        ]);
        setNotice(`Page ${page} moved to bin.`);
      });
    },
    [file, replaceFile, runPageAction, setPageNumber]
  );

  const duplicatePage = useCallback(
    async (page: number) => {
      if (!file) return;
      await runPageAction('duplicate', async () => {
        const duplicated = await duplicatePdfPage(file, page, file.name);
        replaceFile(duplicated);
        setPageNumber(page + 1);
        setNotice(`Page ${page} duplicated.`);
      });
    },
    [file, replaceFile, runPageAction, setPageNumber]
  );

  const rotatePage = useCallback(
    async (page: number) => {
      if (!file) return;
      await runPageAction('rotate', async () => {
        const rotatedFile = await rotatePdfPage(file, page, 90, file.name);
        replaceFile(rotatedFile);
        setPageNumber(page);
        setNotice(`Page ${page} rotated by 90deg.`);
      });
    },
    [file, replaceFile, runPageAction, setPageNumber]
  );

  const restorePageFromBin = useCallback(
    async (item: RemovedPageBinItem) => {
      if (!file) return;
      await runPageAction('restore', async () => {
        const fallbackInsert = (numPages ?? 0) + 1;
        const insertPage = Math.min(item.originalPage, fallbackInsert);
        const restored = await insertPdfAtPosition(file, item.pageFile, insertPage, file.name);
        replaceFile(restored);
        setPageNumber(insertPage);
        setRemovedPageBin((current) => current.filter((entry) => entry.id !== item.id));
        setNotice(`Restored page from bin near page ${item.originalPage}.`);
      });
    },
    [file, numPages, replaceFile, runPageAction, setPageNumber]
  );

  useEffect(() => {
    if (!file || numPages == null || numPages < 1) {
      setOrganizerOrder([]);
      return;
    }
    setOrganizerOrder(Array.from({ length: numPages }, (_, index) => index + 1));
    setDraggedPageIndex(null);
    setDropPageIndex(null);
  }, [fileSignature, numPages, file]);

  useEffect(() => {
    if (!file) {
      setNotice(null);
      setRemovedPageBin([]);
    }
  }, [file]);

  useEffect(() => {
    currentPageRef.current = pageNumber;
  }, [pageNumber]);

  useEffect(() => {
    if (!numPages) return;
    const nextPage = Math.min(Math.max(currentPageRef.current, 1), numPages);
    setPageNumber(nextPage);

    const rafId = requestAnimationFrame(() => {
      scrollToPage(nextPage, 'auto');
    });
    return () => cancelAnimationFrame(rafId);
  }, [numPages, fileSignature, scrollToPage, setPageNumber]);

  useEffect(() => {
    return () => {
      if (scrollSyncFrameRef.current != null) {
        cancelAnimationFrame(scrollSyncFrameRef.current);
        scrollSyncFrameRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    const handlePaste = (e: ClipboardEvent) => {
      const items = e.clipboardData?.items;
      if (!items) return;
      const files = Array.from(items)
        .map((item) => item.getAsFile())
        .filter((f): f is File => f != null);
      if (files.length > 0) void ingestFiles(files);
    };
    document.addEventListener('paste', handlePaste);
    return () => document.removeEventListener('paste', handlePaste);
  }, [ingestFiles]);

  const isFileDragEvent = (event: DragEvent) => Array.from(event.dataTransfer.types).includes('Files');

  const handleDragEnter = (e: DragEvent) => {
    if (!isFileDragEvent(e)) return;
    e.preventDefault();
    e.stopPropagation();
    setDragging(true);
  };
  const handleDragLeave = (e: DragEvent) => {
    if (!isFileDragEvent(e)) return;
    e.preventDefault();
    e.stopPropagation();
    setDragging(false);
  };
  const handleDragOver = (e: DragEvent) => {
    if (!isFileDragEvent(e)) return;
    e.preventDefault();
    e.stopPropagation();
  };
  const handleDrop = (e: DragEvent) => {
    if (!isFileDragEvent(e)) return;
    e.preventDefault();
    e.stopPropagation();
    setDragging(false);
    void ingestFiles(e.dataTransfer.files);
  };

  const handleThumbnailDragStart = (index: number) => (e: DragEvent<HTMLDivElement>) => {
    if (!canReorderPages) return;
    setDraggedPageIndex(index);
    setDropPageIndex(index);
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', String(organizerOrder[index] ?? index + 1));
  };

  const handleThumbnailDragOver = (index: number) => (e: DragEvent<HTMLDivElement>) => {
    if (!canReorderPages) return;
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    if (dropPageIndex !== index) setDropPageIndex(index);
  };

  const handleThumbnailDrop = (index: number) => (e: DragEvent<HTMLDivElement>) => {
    if (!canReorderPages) return;
    e.preventDefault();
    if (draggedPageIndex == null) return;
    if (draggedPageIndex === index) {
      setDraggedPageIndex(null);
      setDropPageIndex(null);
      return;
    }

    const nextOrder = moveItem(organizerOrder, draggedPageIndex, index);
    setOrganizerOrder(nextOrder);
    setDraggedPageIndex(null);
    setDropPageIndex(null);
    void applyPageOrder(nextOrder);
  };

  const handleThumbnailDragEnd = () => {
    setDraggedPageIndex(null);
    setDropPageIndex(null);
  };

  return (
    <div id="pdf-viewer-preview" className="relative flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden bg-muted/40">
      <input
        type="file"
        ref={fileInputRef}
        accept={ACCEPT_PDF}
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
                <p className="font-heading text-sm font-semibold">Drop one or more PDFs here</p>
                <p className="font-mono text-[11px] text-muted-foreground">
                  click to select · paste from clipboard · new files auto-merge
                </p>
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
          <div className="relative flex min-h-0 flex-1 overflow-hidden pt-18 lg:pt-20">
            {isLoading && (
              <div className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-3 bg-muted/40">
                <div className="size-8 animate-spin rounded-full border-2 border-border border-t-primary" />
                <p className="font-mono text-[11px] text-muted-foreground">Loading PDF…</p>
              </div>
            )}
            <div
              ref={previewScrollRef}
              className="min-h-0 flex-1 overflow-auto p-6 lg:p-10"
              onScroll={scheduleScrollSync}
            >
              <div className="mx-auto flex w-full justify-center">
                <Document
                  key={`main-${fileSignature}`}
                  file={file}
                  onLoadSuccess={({ numPages: pages }) => setNumPages(pages)}
                  onLoadError={(err) => {
                    console.error(err);
                    setError('Failed to load PDF. Please try again.');
                  }}
                  loading={null}
                  className={`grid items-start justify-center gap-3 ${
                    pagesPerRow === 1 ? 'grid-cols-1' : pagesPerRow === 2 ? 'grid-cols-2' : 'grid-cols-3'
                  }`}
                >
                  {allPages.map((previewPage) => (
                    <div
                      key={`page_${previewPage}_${scale}`}
                      ref={setPageElementRef(previewPage)}
                      className={`border bg-background shadow-sm transition-shadow ${
                        previewPage === pageNumber ? 'border-primary ring-1 ring-primary/40' : 'border-border'
                      }`}
                      onClick={() => setPageNumber(previewPage)}
                    >
                      <Page
                        pageNumber={previewPage}
                        scale={scale}
                        renderTextLayer
                        renderAnnotationLayer
                        className="max-w-full [&_canvas]:max-w-full"
                        width={pageWidth}
                      />
                    </div>
                  ))}
                </Document>
              </div>
            </div>

            {showPageOrganizer && file && numPages != null && numPages > 0 && (
              <aside className="hidden w-44 shrink-0 border-l border-border bg-background/90 lg:flex">
                <div className="flex min-h-0 flex-1 flex-col">
                  <div className="border-b border-border px-2.5 py-2">
                    <p className="font-heading text-xs font-semibold">Page Organizer</p>
                    <p className="font-mono text-[10px] text-muted-foreground">Drag thumbnails to reorder</p>
                  </div>
                  <div className="min-h-0 flex-1 overflow-auto p-2">
                    <Document
                      key={`thumbs-${fileSignature}`}
                      file={file}
                      loading={null}
                      onLoadError={() => setError('Failed to render page organizer thumbnails.')}
                      className="space-y-2"
                    >
                      {organizerOrder.map((page, index) => {
                        const isDropTarget = dropPageIndex === index && draggedPageIndex != null;
                        const isDragged = draggedPageIndex === index;
                        const disableActions = !canRunPageActions;
                        return (
                          <div
                            key={`thumb-${page}-${index}`}
                            role="button"
                            tabIndex={0}
                            draggable={canReorderPages}
                            onClick={() => scrollToPage(page)}
                            onKeyDown={(event) => {
                              if (event.key === 'Enter' || event.key === ' ') {
                                event.preventDefault();
                                scrollToPage(page);
                              }
                            }}
                            onDragStart={handleThumbnailDragStart(index)}
                            onDragOver={handleThumbnailDragOver(index)}
                            onDrop={handleThumbnailDrop(index)}
                            onDragEnd={handleThumbnailDragEnd}
                            className={`w-full border p-1.5 text-left transition-colors ${
                              isDragged
                                ? 'border-primary bg-primary/10 opacity-70'
                                : isDropTarget
                                ? 'border-primary bg-primary/5'
                                : 'border-border bg-background hover:border-primary/40'
                            } ${page === pageNumber ? 'ring-1 ring-primary/50' : ''}`}
                            title={canReorderPages ? 'Drag to move this page' : 'Need at least 2 pages to reorder'}
                          >
                            <div className="mb-1 flex items-center justify-between gap-1 font-mono text-[10px] text-muted-foreground">
                              <span className="inline-flex items-center gap-1">
                                <GripVertical className="size-3" />#{index + 1}
                              </span>
                              <div className="flex items-center gap-0.5">
                                <button
                                  type="button"
                                  className="inline-flex size-5 items-center justify-center border border-border bg-background hover:border-primary/40 disabled:cursor-not-allowed disabled:opacity-50"
                                  title="Duplicate page"
                                  disabled={disableActions}
                                  onClick={(event) => {
                                    event.stopPropagation();
                                    void duplicatePage(page);
                                  }}
                                >
                                  <Copy className="size-3" />
                                </button>
                                <button
                                  type="button"
                                  className="inline-flex size-5 items-center justify-center border border-border bg-background hover:border-primary/40 disabled:cursor-not-allowed disabled:opacity-50"
                                  title="Rotate page 90deg"
                                  disabled={disableActions}
                                  onClick={(event) => {
                                    event.stopPropagation();
                                    void rotatePage(page);
                                  }}
                                >
                                  <RotateCw className="size-3" />
                                </button>
                                <button
                                  type="button"
                                  className="inline-flex size-5 items-center justify-center border border-destructive/30 bg-background text-destructive hover:border-destructive/60 disabled:cursor-not-allowed disabled:opacity-50"
                                  title="Remove page to bin"
                                  disabled={disableActions}
                                  onClick={(event) => {
                                    event.stopPropagation();
                                    void removePageToBin(page);
                                  }}
                                >
                                  <X className="size-3" />
                                </button>
                              </div>
                            </div>
                            <Page
                              pageNumber={page}
                              width={112}
                              renderTextLayer={false}
                              renderAnnotationLayer={false}
                              className="border border-border bg-background [&_canvas]:max-w-full"
                            />
                          </div>
                        );
                      })}
                    </Document>
                  </div>
                  <div className="border-t border-border px-2 py-2">
                    <div className="mb-1.5 flex items-center justify-between">
                      <p className="font-heading text-[11px] font-semibold">Removed Pages Bin</p>
                      <span className="font-mono text-[10px] text-muted-foreground">{removedPageBin.length}</span>
                    </div>
                    {removedPageBin.length === 0 ? (
                      <p className="font-mono text-[10px] text-muted-foreground">No removed pages.</p>
                    ) : (
                      <div className="max-h-30 space-y-1 overflow-auto">
                        {removedPageBin.map((item) => (
                          <div
                            key={item.id}
                            className="flex items-center justify-between gap-1 border border-border bg-background px-1.5 py-1"
                          >
                            <div className="min-w-0">
                              <p className="truncate font-mono text-[10px]">Page {item.originalPage}</p>
                              <p className="font-mono text-[9px] text-muted-foreground">{item.removedAt}</p>
                            </div>
                            <button
                              type="button"
                              className="inline-flex size-5 items-center justify-center border border-border bg-muted hover:border-primary/40 disabled:cursor-not-allowed disabled:opacity-50"
                              title="Restore this page"
                              disabled={!canRunPageActions}
                              onClick={() => void restorePageFromBin(item)}
                            >
                              <Undo2 className="size-3" />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </aside>
            )}
          </div>
        )}
      </div>

      {file && !error && showPageOrganizer && numPages != null && numPages > 0 && (
        <div className="border-t border-border bg-background/90 p-2 lg:hidden">
          <p className="mb-1 font-mono text-[10px] text-muted-foreground">Drag page tiles to reorder</p>
          <div className="overflow-x-auto">
            <Document
              key={`thumbs-mobile-${fileSignature}`}
              file={file}
              loading={null}
              onLoadError={() => setError('Failed to render page organizer thumbnails.')}
              className="flex gap-2"
            >
              {organizerOrder.map((page, index) => {
                const isDropTarget = dropPageIndex === index && draggedPageIndex != null;
                const isDragged = draggedPageIndex === index;
                const disableActions = !canRunPageActions;
                return (
                  <div
                    key={`thumb-mobile-${page}-${index}`}
                    role="button"
                    tabIndex={0}
                    draggable={canReorderPages}
                    onClick={() => scrollToPage(page)}
                    onKeyDown={(event) => {
                      if (event.key === 'Enter' || event.key === ' ') {
                        event.preventDefault();
                        scrollToPage(page);
                      }
                    }}
                    onDragStart={handleThumbnailDragStart(index)}
                    onDragOver={handleThumbnailDragOver(index)}
                    onDrop={handleThumbnailDrop(index)}
                    onDragEnd={handleThumbnailDragEnd}
                    className={`w-24 shrink-0 border p-1 transition-colors ${
                      isDragged
                        ? 'border-primary bg-primary/10 opacity-70'
                        : isDropTarget
                        ? 'border-primary bg-primary/5'
                        : 'border-border bg-background'
                    } ${page === pageNumber ? 'ring-1 ring-primary/50' : ''}`}
                  >
                    <div className="mb-1 flex items-center justify-between gap-1">
                      <span className="inline-flex items-center gap-1 font-mono text-[10px] text-muted-foreground">
                        <GripVertical className="size-3" />#{index + 1}
                      </span>
                      <div className="flex items-center gap-0.5">
                        <button
                          type="button"
                          className="inline-flex size-5 items-center justify-center border border-border bg-background hover:border-primary/40 disabled:cursor-not-allowed disabled:opacity-50"
                          title="Duplicate page"
                          disabled={disableActions}
                          onClick={(event) => {
                            event.stopPropagation();
                            void duplicatePage(page);
                          }}
                        >
                          <Copy className="size-3" />
                        </button>
                        <button
                          type="button"
                          className="inline-flex size-5 items-center justify-center border border-border bg-background hover:border-primary/40 disabled:cursor-not-allowed disabled:opacity-50"
                          title="Rotate page 90deg"
                          disabled={disableActions}
                          onClick={(event) => {
                            event.stopPropagation();
                            void rotatePage(page);
                          }}
                        >
                          <RotateCw className="size-3" />
                        </button>
                        <button
                          type="button"
                          className="inline-flex size-5 items-center justify-center border border-destructive/30 bg-background text-destructive hover:border-destructive/60 disabled:cursor-not-allowed disabled:opacity-50"
                          title="Remove page to bin"
                          disabled={disableActions}
                          onClick={(event) => {
                            event.stopPropagation();
                            void removePageToBin(page);
                          }}
                        >
                          <X className="size-3" />
                        </button>
                      </div>
                    </div>
                    <Page
                      pageNumber={page}
                      width={86}
                      renderTextLayer={false}
                      renderAnnotationLayer={false}
                      className="border border-border bg-background [&_canvas]:max-w-full"
                    />
                  </div>
                );
              })}
            </Document>
          </div>
          <div className="mt-2 border-t border-border pt-2">
            <div className="mb-1 flex items-center justify-between">
              <p className="font-heading text-[11px] font-semibold">Removed Pages Bin</p>
              <span className="font-mono text-[10px] text-muted-foreground">{removedPageBin.length}</span>
            </div>
            {removedPageBin.length === 0 ? (
              <p className="font-mono text-[10px] text-muted-foreground">No removed pages.</p>
            ) : (
              <div className="flex gap-1 overflow-x-auto pb-0.5">
                {removedPageBin.map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    className="inline-flex shrink-0 items-center gap-1 border border-border bg-background px-2 py-1 font-mono text-[10px] disabled:cursor-not-allowed disabled:opacity-50"
                    disabled={!canRunPageActions}
                    onClick={() => void restorePageFromBin(item)}
                  >
                    <Undo2 className="size-3" />
                    Restore p{item.originalPage}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {file && !error && (
        <>
          {/* Floating controls on top of the PDF */}
          <div className="pointer-events-none absolute top-3 left-1/2 z-20 -translate-x-1/2">
            <div className="pointer-events-auto flex w-[min(92vw,760px)] flex-wrap items-center justify-center gap-1.5 border border-border bg-background/90 px-2 py-1.5 shadow-sm backdrop-blur-sm">
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="size-8"
                onClick={() => scrollToPage(pageNumber - pageStep)}
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
                    if (!Number.isNaN(page)) scrollToPage(page);
                  }}
                  className="h-8 w-12 text-center font-mono [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
                />
                <span className="font-mono text-[11px] text-muted-foreground">
                  {lastVisiblePage > pageNumber ? `–${lastVisiblePage}` : ''} / {numPages ?? '…'}
                </span>
              </div>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="size-8"
                onClick={() => scrollToPage(pageNumber + pageStep)}
                disabled={pageNumber + pageStep > (numPages ?? 1)}
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

              <div className="inline-flex overflow-hidden border border-border bg-background">
                {[1, 2, 3].map((mode) => (
                  <button
                    key={`pages-per-row-${mode}`}
                    type="button"
                    className={`h-8 min-w-8 px-1 font-mono text-[11px] transition-colors ${
                      pagesPerRow === mode
                        ? 'bg-primary/15 text-foreground'
                        : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                    }`}
                    onClick={() => setPagesPerRow(mode as 1 | 2 | 3)}
                    title={`${mode} page${mode > 1 ? 's' : ''} per row`}
                  >
                    {mode}
                  </button>
                ))}
              </div>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="size-8"
                onClick={() => fileInputRef.current?.click()}
                title="Add one or more PDFs (auto-merge)"
              >
                <Plus className="size-4" />
              </Button>
              <Button
                type="button"
                variant={showPageOrganizer ? 'secondary' : 'ghost'}
                size="icon"
                className="size-8"
                onClick={() => setShowPageOrganizer((value) => !value)}
                title={showPageOrganizer ? 'Hide page organizer' : 'Show page organizer'}
              >
                {showPageOrganizer ? <PanelRightClose className="size-4" /> : <PanelRightOpen className="size-4" />}
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="size-8"
                onClick={() => void rotatePage(pageNumber)}
                disabled={!canRunPageActions}
                title={`Rotate page ${pageNumber} by 90deg`}
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
          {notice && (
            <div className="pointer-events-none absolute bottom-11 left-1/2 z-20 -translate-x-1/2">
              <span className="rounded-none border border-primary/40 bg-primary/10 px-2 py-1 font-mono text-[10px] text-foreground shadow-sm backdrop-blur-sm">
                {notice}
              </span>
            </div>
          )}
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
