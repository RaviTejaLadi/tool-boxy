import { useCallback, useRef, type DragEvent } from 'react';
import { CodeIcon, FolderOpenIcon, WarningCircleIcon } from '@phosphor-icons/react';
import { ingestDataTransfer, ingestFolder, isAssetKind } from '../helpers';
import { useCodeViewerStore } from '../stores';
import { AssetPreview } from './AssetPreview';
import { CodePreview } from './CodePreview';
import { MarkdownPreview } from './MarkdownPreview';
import { PreviewTabs } from './PreviewTabs';
import { PreviewToolbar } from './PreviewToolbar';

function isMarkdown(name: string) {
  return /\.(md|mdx)$/i.test(name);
}

export function PreviewPane() {
  const selectedFile = useCodeViewerStore((s) => s.selectedFile);
  const folderName = useCodeViewerStore((s) => s.folderName);
  const error = useCodeViewerStore((s) => s.error);
  const isDragging = useCodeViewerStore((s) => s.isDragging);
  const isLoading = useCodeViewerStore((s) => s.isLoading);
  const svgViewMode = useCodeViewerStore((s) => s.svgViewMode);
  const mdPreview = useCodeViewerStore((s) => s.mdPreview);
  const setFolder = useCodeViewerStore((s) => s.setFolder);
  const setError = useCodeViewerStore((s) => s.setError);
  const setDragging = useCodeViewerStore((s) => s.setDragging);
  const setLoading = useCodeViewerStore((s) => s.setLoading);
  const setSidebarPanel = useCodeViewerStore((s) => s.setSidebarPanel);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const applyResult = useCallback(
    async (resultPromise: Promise<Awaited<ReturnType<typeof ingestFolder>>>) => {
      setLoading(true);
      const result = await resultPromise;
      if ('error' in result) {
        setError(result.error);
        return;
      }
      setFolder(result);
    },
    [setError, setFolder, setLoading]
  );

  const handleFiles = useCallback((files: FileList | File[] | null) => applyResult(ingestFolder(files)), [applyResult]);

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
    void applyResult(ingestDataTransfer(e.dataTransfer));
  };

  const showMarkdown = !!selectedFile && isMarkdown(selectedFile.name) && mdPreview;
  const showCodePreview =
    !!selectedFile &&
    !showMarkdown &&
    (!isAssetKind(selectedFile.kind) || (selectedFile.kind === 'svg' && svgViewMode === 'code'));

  return (
    <section
      className="relative flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden bg-muted/40"
      onDragEnter={handleDragEnter}
      onDragLeave={handleDragLeave}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
    >
      <input
        type="file"
        ref={fileInputRef}
        className="hidden"
        multiple
        // @ts-expect-error — non-standard directory picker attributes
        webkitdirectory=""
        directory=""
        onChange={(e) => {
          void handleFiles(e.target.files);
          e.target.value = '';
        }}
      />

      {error && (
        <div className="shrink-0 border-b border-destructive/40 bg-destructive/10 px-4 py-2">
          <div className="flex items-center gap-2 font-mono text-[11px] text-destructive">
            <WarningCircleIcon className="size-3.5 shrink-0" />
            {error}
          </div>
        </div>
      )}

      {!folderName ? (
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          disabled={isLoading}
          className={`m-auto flex w-full max-w-lg flex-col items-center gap-3 border border-dashed px-6 py-16 text-center transition-colors ${
            isDragging
              ? 'border-primary bg-primary/5'
              : 'border-border bg-background/60 hover:border-primary/50 hover:bg-background/80'
          }`}
        >
          <div className="flex size-12 items-center justify-center bg-primary text-primary-foreground">
            <FolderOpenIcon className="size-5" weight="bold" />
          </div>
          <div>
            <p className="font-heading text-sm font-semibold">
              {isLoading ? 'Loading folder…' : 'Drop a project folder to audit'}
            </p>
            <p className="mt-1 font-mono text-[11px] text-muted-foreground">
              Insights · content search · TODO/secret scan · markdown & asset previews — all local
            </p>
          </div>
        </button>
      ) : (
        <>
          <PreviewTabs />
          {selectedFile ? (
            <>
              <PreviewToolbar file={selectedFile} />
              {showMarkdown ? (
                <MarkdownPreview file={selectedFile} />
              ) : showCodePreview ? (
                <CodePreview file={selectedFile} />
              ) : (
                <AssetPreview file={selectedFile} />
              )}
            </>
          ) : (
            <div className="m-auto flex w-full max-w-md flex-col items-center gap-3 border border-dashed border-border bg-background/60 px-6 py-16 text-center">
              <div className="flex size-12 items-center justify-center bg-primary text-primary-foreground">
                <CodeIcon className="size-5" weight="bold" />
              </div>
              <div>
                <p className="font-heading text-sm font-semibold">Pick a starting point</p>
                <p className="mt-1 font-mono text-[11px] text-muted-foreground">
                  Browse files, or open{' '}
                  <button
                    type="button"
                    className="text-primary underline-offset-2 hover:underline"
                    onClick={() => setSidebarPanel('insights')}
                  >
                    Insights
                  </button>{' '}
                  /{' '}
                  <button
                    type="button"
                    className="text-primary underline-offset-2 hover:underline"
                    onClick={() => setSidebarPanel('findings')}
                  >
                    Findings
                  </button>
                </p>
              </div>
            </div>
          )}
        </>
      )}

      {isDragging && folderName && (
        <div className="pointer-events-none absolute inset-0 z-20 flex items-center justify-center bg-background/70 backdrop-blur-[1px]">
          <div className="border border-primary bg-background px-6 py-4 font-mono text-[11px] text-primary">
            Drop folder to replace
          </div>
        </div>
      )}
    </section>
  );
}
