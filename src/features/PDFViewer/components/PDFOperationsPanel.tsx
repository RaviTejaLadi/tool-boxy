import { useEffect, useMemo, useRef, useState, type ChangeEvent } from 'react';
import {
  ArrowDown,
  ArrowUp,
  Download,
  FileText,
  Files,
  Loader2,
  RefreshCw,
  Scissors,
  Text,
  Upload,
  WandSparkles,
  X,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';
import { ACCEPT_PDF } from '../constants';
import {
  convertPdfToWord,
  downloadBlob,
  ensurePdfWorker,
  exportPdfTextAsTxt,
  formatFileSize,
  mergePdfFilesToFile,
  organizePdf,
  processPdfFileList,
  processPdfFiles,
  splitPdfByRanges,
  splitPdfEveryNPages,
  splitPdfIntoSinglePages,
} from '../helpers';
import { useViewerStore } from '../stores';

type SplitMode = 'ranges' | 'every' | 'single';
type BusyOperation = 'merge' | 'split' | 'organize' | 'word' | 'text' | null;
type Status = { type: 'success' | 'error'; message: string } | null;
type OperationKey = 'merge' | 'split' | 'organize' | 'convert';

const OPERATION_OPTIONS: Array<{
  id: OperationKey;
  title: string;
  description: string;
  icon: typeof Files;
}> = [
  {
    id: 'merge',
    title: 'Merge PDFs',
    description: 'Combine files in exact order',
    icon: Files,
  },
  {
    id: 'split',
    title: 'Split PDF',
    description: 'Ranges, chunks, or one page each',
    icon: Scissors,
  },
  {
    id: 'organize',
    title: 'Organize Pages',
    description: 'Reorder, remove, duplicate, rotate',
    icon: RefreshCw,
  },
  {
    id: 'convert',
    title: 'Convert',
    description: 'PDF to Word or plain text',
    icon: WandSparkles,
  },
];

function StepLabel({ step, title }: { step: number; title: string }) {
  return (
    <div className="flex items-center gap-2">
      <span className="inline-flex h-5 min-w-5 items-center justify-center border border-border bg-background px-1.5 font-mono text-[10px] text-muted-foreground">
        {step}
      </span>
      <p className="font-heading text-xs font-semibold">{title}</p>
    </div>
  );
}

function fileKey(file: File): string {
  return `${file.name}:${file.size}:${file.lastModified}`;
}

function getBaseName(fileName: string): string {
  return fileName.replace(/\.[^/.]+$/, '') || 'document';
}

function ensureExtension(fileName: string, extension: '.pdf' | '.zip' | '.doc' | '.txt'): string {
  const trimmed = fileName.trim();
  if (!trimmed) return `document${extension}`;
  return trimmed.toLowerCase().endsWith(extension) ? trimmed : `${trimmed}${extension}`;
}

function toErrorMessage(error: unknown): string {
  if (error instanceof Error && error.message) return error.message;
  return 'Something went wrong while processing the PDF.';
}

export function PDFOperationsPanel() {
  ensurePdfWorker();

  const file = useViewerStore((s) => s.file);
  const numPages = useViewerStore((s) => s.numPages);
  const setFile = useViewerStore((s) => s.setFile);
  const clearAll = useViewerStore((s) => s.clearAll);

  const sourcePickerRef = useRef<HTMLInputElement>(null);
  const mergePickerRef = useRef<HTMLInputElement>(null);

  const [busy, setBusy] = useState<BusyOperation>(null);
  const [status, setStatus] = useState<Status>(null);
  const [activeOperation, setActiveOperation] = useState<OperationKey>('merge');

  const [mergeFiles, setMergeFiles] = useState<File[]>([]);
  const [mergeOutputName, setMergeOutputName] = useState('merged-document.pdf');
  const [mergedPreviewFile, setMergedPreviewFile] = useState<File | null>(null);

  const [splitMode, setSplitMode] = useState<SplitMode>('ranges');
  const [splitRanges, setSplitRanges] = useState('1-2,3-4');
  const [splitChunkSize, setSplitChunkSize] = useState('2');
  const [splitOutputName, setSplitOutputName] = useState('split-pdf.zip');

  const [pageOrder, setPageOrder] = useState('');
  const [removePages, setRemovePages] = useState('');
  const [duplicatePages, setDuplicatePages] = useState('');
  const [rotatePages, setRotatePages] = useState('');
  const [rotateBy, setRotateBy] = useState<'90' | '180' | '270'>('90');
  const [organizeOutputName, setOrganizeOutputName] = useState('organized.pdf');
  const [openOrganizedInViewer, setOpenOrganizedInViewer] = useState(true);

  const [includePageHeadings, setIncludePageHeadings] = useState(true);
  const [includePageBreaks, setIncludePageBreaks] = useState(true);
  const [wordOutputName, setWordOutputName] = useState('converted.doc');
  const [textOutputName, setTextOutputName] = useState('extracted-text.txt');

  useEffect(() => {
    setMergedPreviewFile(null);
  }, [mergeFiles, mergeOutputName]);

  const sourceLabel = useMemo(() => {
    if (!file) return null;
    const details = [`${formatFileSize(file.size)}`];
    if (numPages != null) details.push(`${numPages} pages`);
    return details.join(' · ');
  }, [file, numPages]);

  const isBusy = busy != null;
  const sourceFileReady = file != null;
  const mergeCount = mergeFiles.length;

  const runOperation = async (operation: BusyOperation, work: () => Promise<void>) => {
    setBusy(operation);
    setStatus(null);
    try {
      await work();
    } catch (error) {
      setStatus({ type: 'error', message: toErrorMessage(error) });
    } finally {
      setBusy(null);
    }
  };

  const onSourceChange = (event: ChangeEvent<HTMLInputElement>) => {
    const selected = processPdfFiles(event.target.files);
    if (selected) {
      setFile(selected);
      setStatus(null);
    } else if (event.target.files && event.target.files.length > 0) {
      setStatus({ type: 'error', message: 'Please select a valid PDF file.' });
    }
    event.target.value = '';
  };

  const onMergeFilesChange = (event: ChangeEvent<HTMLInputElement>) => {
    const selected = processPdfFileList(event.target.files);
    if (selected.length === 0 && event.target.files && event.target.files.length > 0) {
      setStatus({ type: 'error', message: 'Only PDF files can be added to merge queue.' });
      event.target.value = '';
      return;
    }

    setMergeFiles((current) => {
      const seen = new Set(current.map(fileKey));
      const next = [...current];
      for (const nextFile of selected) {
        const key = fileKey(nextFile);
        if (!seen.has(key)) {
          seen.add(key);
          next.push(nextFile);
        }
      }
      return next;
    });
    event.target.value = '';
  };

  const moveMergeFile = (index: number, direction: -1 | 1) => {
    setMergeFiles((current) => {
      const nextIndex = index + direction;
      if (nextIndex < 0 || nextIndex >= current.length) return current;
      const next = [...current];
      const [item] = next.splice(index, 1);
      next.splice(nextIndex, 0, item);
      return next;
    });
  };

  const addCurrentToMerge = () => {
    if (!file) return;
    setMergeFiles((current) => {
      const key = fileKey(file);
      if (current.some((entry) => fileKey(entry) === key)) return current;
      return [...current, file];
    });
  };

  const removeMergeFile = (index: number) => {
    setMergeFiles((current) => current.filter((_, itemIndex) => itemIndex !== index));
  };

  const mergeNow = async () => {
    await runOperation('merge', async () => {
      if (mergeFiles.length < 2) {
        throw new Error('Add at least two PDF files to merge.');
      }
      const fallbackName = `${getBaseName(mergeFiles[0].name)}-merged.pdf`;
      const fileName = ensureExtension(mergeOutputName || fallbackName, '.pdf');
      const mergedFile = await mergePdfFilesToFile(mergeFiles, fileName);
      setMergedPreviewFile(mergedFile);
      setFile(mergedFile);
      setStatus({
        type: 'success',
        message: `Merged ${mergeFiles.length} files and loaded preview. Download when ready.`,
      });
    });
  };

  const downloadMergedPreview = () => {
    if (!mergedPreviewFile) {
      setStatus({
        type: 'error',
        message: 'Generate merged preview first, then download.',
      });
      return;
    }
    downloadBlob(mergedPreviewFile, mergedPreviewFile.name);
    setStatus({
      type: 'success',
      message: `Downloaded merged PDF: ${mergedPreviewFile.name}`,
    });
  };

  const splitNow = async () => {
    await runOperation('split', async () => {
      if (!file) throw new Error('Upload a source PDF before splitting.');

      const result =
        splitMode === 'ranges'
          ? await splitPdfByRanges(file, splitRanges)
          : splitMode === 'every'
          ? await splitPdfEveryNPages(file, Number.parseInt(splitChunkSize, 10))
          : await splitPdfIntoSinglePages(file);

      const fallbackName = `${getBaseName(file.name)}-split.zip`;
      const fileName = ensureExtension(splitOutputName || fallbackName, '.zip');
      downloadBlob(result.blob, fileName);
      setStatus({ type: 'success', message: `Created ${result.outputCount} split file(s) in ZIP.` });
    });
  };

  const organizeNow = async () => {
    await runOperation('organize', async () => {
      if (!file) throw new Error('Upload a source PDF before organizing pages.');

      const result = await organizePdf(file, {
        pageOrder,
        removePages,
        duplicatePages,
        rotatePages,
        rotateBy: Number.parseInt(rotateBy, 10) as 90 | 180 | 270,
      });

      const fallbackName = `${getBaseName(file.name)}-organized.pdf`;
      const fileName = ensureExtension(organizeOutputName || fallbackName, '.pdf');
      downloadBlob(result.blob, fileName);

      if (openOrganizedInViewer) {
        setFile(new File([result.blob], fileName, { type: 'application/pdf' }));
      }

      setStatus({ type: 'success', message: `Organized PDF exported with ${result.outputPages} page(s).` });
    });
  };

  const convertToWordNow = async () => {
    await runOperation('word', async () => {
      if (!file) throw new Error('Upload a source PDF before converting.');

      const result = await convertPdfToWord(file, includePageHeadings, includePageBreaks);
      const fallbackName = `${getBaseName(file.name)}.doc`;
      const fileName = ensureExtension(wordOutputName || fallbackName, '.doc');
      downloadBlob(result.blob, fileName);
      setStatus({
        type: 'success',
        message: `Word export ready (${result.pageCount} pages, ~${result.wordCount} words).`,
      });
    });
  };

  const exportTextNow = async () => {
    await runOperation('text', async () => {
      if (!file) throw new Error('Upload a source PDF before extracting text.');

      const result = await exportPdfTextAsTxt(file, includePageHeadings);
      const fallbackName = `${getBaseName(file.name)}.txt`;
      const fileName = ensureExtension(textOutputName || fallbackName, '.txt');
      downloadBlob(result.blob, fileName);
      setStatus({
        type: 'success',
        message: `Text export complete (${result.pageCount} pages, ~${result.wordCount} words).`,
      });
    });
  };

  return (
    <aside className="flex w-full shrink-0 border-t border-border bg-background xl:w-110 xl:border-t-0 xl:border-l">
      <input ref={sourcePickerRef} type="file" accept={ACCEPT_PDF} className="hidden" onChange={onSourceChange} />
      <input
        ref={mergePickerRef}
        type="file"
        accept={ACCEPT_PDF}
        multiple
        className="hidden"
        onChange={onMergeFilesChange}
      />

      <ScrollArea className="h-full w-full">
        <div className="space-y-5 p-4 lg:p-5">
          <header className="space-y-1">
            <div className="space-y-1">
              <h2 className="font-heading text-base font-semibold">PDF Toolkit</h2>
              <p className="font-mono text-[11px] text-muted-foreground">
                Production-style, offline workflow for merge, split, organize, and convert.
              </p>
            </div>
          </header>

          <section className="space-y-3 border border-border bg-muted/20 p-3.5">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div>
                <div className="font-heading text-sm font-semibold">Source PDF</div>
                <div className="font-mono text-[10px] text-muted-foreground">
                  Required for split, organize, and convert.
                </div>
              </div>
              <div className="flex items-center gap-1.5">
                <Button type="button" variant="outline" size="sm" onClick={() => sourcePickerRef.current?.click()}>
                  <Upload data-icon="inline-start" />
                  {sourceFileReady ? 'Replace' : 'Select'}
                </Button>
                <Button type="button" variant="ghost" size="sm" onClick={clearAll} disabled={!sourceFileReady}>
                  <X data-icon="inline-start" />
                  Clear
                </Button>
              </div>
            </div>

            {sourceFileReady ? (
              <div className="space-y-2 border border-border bg-background p-2.5">
                <p className="truncate font-mono text-[11px] text-foreground">{file.name}</p>
                <div className="flex flex-wrap gap-1.5">
                  <span className="border border-border bg-muted px-1.5 py-0.5 font-mono text-[10px] text-muted-foreground">
                    {sourceLabel}
                  </span>
                </div>
              </div>
            ) : (
              <p className="border border-dashed border-border bg-background px-2.5 py-3 font-mono text-[10px] text-muted-foreground">
                No source PDF selected. Choose a file to unlock all operations.
              </p>
            )}
          </section>

          {status && (
            <div
              className={`border px-3 py-2 font-mono text-[11px] ${
                status.type === 'error'
                  ? 'border-destructive/40 bg-destructive/10 text-destructive'
                  : 'border-border bg-muted/40'
              }`}
            >
              {status.message}
            </div>
          )}

          <section className="space-y-3">
            <div className="space-y-1">
              <h3 className="font-heading text-sm font-semibold">Choose operation</h3>
              <p className="font-mono text-[10px] text-muted-foreground">
                Bigger cards for easier desktop and touch interaction.
              </p>
            </div>
            <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
              {OPERATION_OPTIONS.map((item) => {
                const Icon = item.icon;
                const isActive = activeOperation === item.id;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setActiveOperation(item.id)}
                    aria-pressed={isActive}
                    className={`flex h-20 items-start gap-3 border px-3 py-2.5 text-left transition-colors ${
                      isActive
                        ? 'border-primary bg-primary/5 text-foreground'
                        : 'border-border bg-background hover:border-primary/40 hover:bg-muted/30'
                    }`}
                  >
                    <div
                      className={`mt-0.5 flex size-8 shrink-0 items-center justify-center border ${
                        isActive ? 'border-primary bg-primary text-primary-foreground' : 'border-border bg-muted'
                      }`}
                    >
                      <Icon className="size-4" />
                    </div>
                    <div className="min-w-0">
                      <p className="font-heading text-sm leading-none font-semibold">{item.title}</p>
                      <p className="mt-1 font-mono text-[10px] text-muted-foreground">{item.description}</p>
                    </div>
                  </button>
                );
              })}
            </div>
          </section>

          <section className="space-y-4 border border-border bg-muted/20 p-3.5">
            {activeOperation === 'merge' && (
              <>
                <div className="space-y-2">
                  <h3 className="font-heading text-sm font-semibold">Merge PDFs</h3>
                  <p className="font-mono text-[10px] text-muted-foreground">
                    Add files, set order, then export one merged PDF.
                  </p>
                </div>

                <div className="space-y-2">
                  <StepLabel step={1} title="Add files to merge queue" />
                  <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                    <Button
                      type="button"
                      variant="outline"
                      className="w-full"
                      onClick={() => mergePickerRef.current?.click()}
                    >
                      <Files data-icon="inline-start" />
                      Add PDFs
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      className="w-full"
                      onClick={addCurrentToMerge}
                      disabled={!sourceFileReady}
                    >
                      <Upload data-icon="inline-start" />
                      Add source PDF
                    </Button>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <StepLabel step={2} title="Arrange file order" />
                    <span className="border border-border bg-background px-1.5 py-0.5 font-mono text-[10px] text-muted-foreground">
                      {mergeCount} file(s)
                    </span>
                  </div>
                  <div className="max-h-56 overflow-auto border border-border bg-background">
                    {mergeCount === 0 ? (
                      <p className="px-3 py-6 text-center font-mono text-[10px] text-muted-foreground">
                        No files in merge queue.
                      </p>
                    ) : (
                      mergeFiles.map((entry, index) => (
                        <div
                          key={`${fileKey(entry)}-${index}`}
                          className="grid grid-cols-[auto_1fr_auto] items-center gap-1.5 border-b border-border/60 px-2 py-1.5 last:border-b-0"
                        >
                          <span className="inline-flex size-5 items-center justify-center border border-border bg-muted font-mono text-[10px] text-muted-foreground">
                            {index + 1}
                          </span>
                          <div className="min-w-0">
                            <p className="truncate font-mono text-[11px]">{entry.name}</p>
                            <p className="font-mono text-[10px] text-muted-foreground">{formatFileSize(entry.size)}</p>
                          </div>
                          <div className="flex items-center">
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon-xs"
                              onClick={() => moveMergeFile(index, -1)}
                              disabled={index === 0}
                            >
                              <ArrowUp className="size-3.5" />
                            </Button>
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon-xs"
                              onClick={() => moveMergeFile(index, 1)}
                              disabled={index === mergeCount - 1}
                            >
                              <ArrowDown className="size-3.5" />
                            </Button>
                            <Button type="button" variant="ghost" size="icon-xs" onClick={() => removeMergeFile(index)}>
                              <X className="size-3.5" />
                            </Button>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                  {mergeCount > 0 && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="w-full"
                      onClick={() => setMergeFiles([])}
                    >
                      <X data-icon="inline-start" />
                      Clear merge queue
                    </Button>
                  )}
                </div>

                <div className="space-y-2">
                  <StepLabel step={3} title="Preview then download merged PDF" />
                  <Input
                    value={mergeOutputName}
                    onChange={(e) => setMergeOutputName(e.target.value)}
                    placeholder="Output name (merged.pdf)"
                    className="h-9"
                  />
                  <Button
                    type="button"
                    className="h-9 w-full text-sm"
                    onClick={() => void mergeNow()}
                    disabled={isBusy}
                  >
                    {busy === 'merge' ? <Loader2 className="size-4 animate-spin" /> : <Files />}
                    Build merged preview
                  </Button>
                  <div className="border border-border bg-background px-2.5 py-2">
                    <p className="font-mono text-[10px] text-muted-foreground">
                      {mergedPreviewFile
                        ? `Preview ready: ${mergedPreviewFile.name}`
                        : 'Preview not generated yet. Click "Build merged preview" first.'}
                    </p>
                  </div>
                  <Button
                    type="button"
                    variant="outline"
                    className="h-9 w-full text-sm"
                    onClick={downloadMergedPreview}
                    disabled={isBusy || !mergedPreviewFile}
                  >
                    <Download />
                    Download merged PDF
                  </Button>
                </div>
              </>
            )}

            {activeOperation === 'split' && (
              <>
                <div className="space-y-2">
                  <h3 className="font-heading text-sm font-semibold">Split PDF</h3>
                  <p className="font-mono text-[10px] text-muted-foreground">
                    Create multiple PDFs and export them as a ZIP archive.
                  </p>
                </div>

                <div className="space-y-2">
                  <StepLabel step={1} title="Choose split method" />
                  <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
                    {[
                      { id: 'ranges' as const, label: 'Custom ranges', helper: '1-3,4,8-10' },
                      { id: 'every' as const, label: 'Every N pages', helper: '2 or 5 pages' },
                      { id: 'single' as const, label: 'Single pages', helper: 'one PDF/page' },
                    ].map((mode) => (
                      <button
                        key={mode.id}
                        type="button"
                        onClick={() => setSplitMode(mode.id)}
                        className={`border px-2 py-2 text-left transition-colors ${
                          splitMode === mode.id
                            ? 'border-primary bg-primary/5'
                            : 'border-border bg-background hover:border-primary/40 hover:bg-muted/30'
                        }`}
                      >
                        <p className="font-heading text-xs font-semibold">{mode.label}</p>
                        <p className="font-mono text-[10px] text-muted-foreground">{mode.helper}</p>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <StepLabel step={2} title="Configure output" />
                  {splitMode === 'ranges' ? (
                    <Input
                      value={splitRanges}
                      onChange={(e) => setSplitRanges(e.target.value)}
                      placeholder="Ranges like 1-3,4,5-8"
                      className="h-9"
                    />
                  ) : splitMode === 'every' ? (
                    <Input
                      type="number"
                      min={1}
                      value={splitChunkSize}
                      onChange={(e) => setSplitChunkSize(e.target.value)}
                      placeholder="Pages per chunk"
                      className="h-9"
                    />
                  ) : (
                    <p className="border border-border bg-background px-2.5 py-2 font-mono text-[10px] text-muted-foreground">
                      Every page will be exported as an individual PDF inside the ZIP.
                    </p>
                  )}
                  <Input
                    value={splitOutputName}
                    onChange={(e) => setSplitOutputName(e.target.value)}
                    placeholder="Output ZIP name"
                    className="h-9"
                  />
                </div>

                <Button type="button" className="h-9 w-full text-sm" onClick={() => void splitNow()} disabled={isBusy}>
                  {busy === 'split' ? <Loader2 className="size-4 animate-spin" /> : <Scissors />}
                  Split & download ZIP
                </Button>
              </>
            )}

            {activeOperation === 'organize' && (
              <>
                <div className="space-y-2">
                  <h3 className="font-heading text-sm font-semibold">Organize Pages</h3>
                  <p className="font-mono text-[10px] text-muted-foreground">
                    Reorder, remove, duplicate, and rotate pages in one operation.
                  </p>
                </div>

                <div className="space-y-2">
                  <StepLabel step={1} title="Page rules" />
                  <Input
                    value={pageOrder}
                    onChange={(e) => setPageOrder(e.target.value)}
                    placeholder="Page order (optional): 1,3,2,4"
                    className="h-9"
                  />
                  <Input
                    value={removePages}
                    onChange={(e) => setRemovePages(e.target.value)}
                    placeholder="Remove pages (optional): 2,5-7"
                    className="h-9"
                  />
                  <Input
                    value={duplicatePages}
                    onChange={(e) => setDuplicatePages(e.target.value)}
                    placeholder="Duplicate pages (optional): 1,3"
                    className="h-9"
                  />
                </div>

                <div className="space-y-2">
                  <StepLabel step={2} title="Rotation settings" />
                  <Input
                    value={rotatePages}
                    onChange={(e) => setRotatePages(e.target.value)}
                    placeholder="Rotate pages: 2,4-5"
                    className="h-9"
                  />
                  <div className="grid grid-cols-3 gap-2">
                    {(['90', '180', '270'] as const).map((angle) => (
                      <button
                        key={angle}
                        type="button"
                        onClick={() => setRotateBy(angle)}
                        className={`h-9 border font-mono text-xs transition-colors ${
                          rotateBy === angle
                            ? 'border-primary bg-primary/10 text-foreground'
                            : 'border-border bg-background text-muted-foreground hover:border-primary/40 hover:text-foreground'
                        }`}
                      >
                        +{angle}deg
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <StepLabel step={3} title="Export organized PDF" />
                  <Input
                    value={organizeOutputName}
                    onChange={(e) => setOrganizeOutputName(e.target.value)}
                    placeholder="Output name (organized.pdf)"
                    className="h-9"
                  />
                  <div className="flex items-center justify-between border border-border bg-background px-2.5 py-2">
                    <span className="font-mono text-[10px] text-muted-foreground">Open organized file in viewer</span>
                    <Switch checked={openOrganizedInViewer} onCheckedChange={setOpenOrganizedInViewer} size="sm" />
                  </div>
                  <Button
                    type="button"
                    className="h-9 w-full text-sm"
                    onClick={() => void organizeNow()}
                    disabled={isBusy}
                  >
                    {busy === 'organize' ? <Loader2 className="size-4 animate-spin" /> : <RefreshCw />}
                    Organize & download PDF
                  </Button>
                </div>
              </>
            )}

            {activeOperation === 'convert' && (
              <>
                <div className="space-y-2">
                  <h3 className="font-heading text-sm font-semibold">Convert PDF</h3>
                  <p className="font-mono text-[10px] text-muted-foreground">
                    Extract text content and export as Word or plain text.
                  </p>
                </div>

                <div className="space-y-2 border border-border bg-background px-2.5 py-2">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-[10px] text-muted-foreground">Include page headings</span>
                    <Switch checked={includePageHeadings} onCheckedChange={setIncludePageHeadings} size="sm" />
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-[10px] text-muted-foreground">Insert page breaks in Word file</span>
                    <Switch checked={includePageBreaks} onCheckedChange={setIncludePageBreaks} size="sm" />
                  </div>
                </div>

                <div className="space-y-2">
                  <StepLabel step={1} title="PDF to Word (.doc)" />
                  <Input
                    value={wordOutputName}
                    onChange={(e) => setWordOutputName(e.target.value)}
                    placeholder="Word output name (.doc)"
                    className="h-9"
                  />
                  <Button
                    type="button"
                    className="h-9 w-full text-sm"
                    onClick={() => void convertToWordNow()}
                    disabled={isBusy}
                  >
                    {busy === 'word' ? <Loader2 className="size-4 animate-spin" /> : <WandSparkles />}
                    Convert PDF to Word
                  </Button>
                </div>

                <Separator />

                <div className="space-y-2">
                  <StepLabel step={2} title="Extract plain text (.txt)" />
                  <Input
                    value={textOutputName}
                    onChange={(e) => setTextOutputName(e.target.value)}
                    placeholder="Text output name (.txt)"
                    className="h-9"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    className="h-9 w-full text-sm"
                    onClick={() => void exportTextNow()}
                    disabled={isBusy}
                  >
                    {busy === 'text' ? <Loader2 className="size-4 animate-spin" /> : <Text />}
                    Extract text
                  </Button>
                </div>

                <p className="border border-border bg-background px-2.5 py-2 font-mono text-[10px] text-muted-foreground">
                  Complex layouts and scanned PDFs may lose formatting without OCR.
                </p>
              </>
            )}
          </section>

          <div className="space-y-2 border border-border bg-muted/20 p-3.5">
            <div className="flex items-center gap-1.5 font-heading text-xs font-semibold">
              <FileText className="size-3.5" />
              Quick tips
            </div>
            <ul className="space-y-1.5 font-mono text-[10px] text-muted-foreground">
              <li>Use ranges like 1-3,8,10-12 for split/organize inputs.</li>
              <li>For huge PDFs, run one operation at a time for best browser performance.</li>
              <li>All files stay local. No uploads or external API calls are used.</li>
            </ul>
          </div>
        </div>
      </ScrollArea>
    </aside>
  );
}
