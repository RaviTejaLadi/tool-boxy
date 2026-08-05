import { CodeIcon, DownloadSimpleIcon, NotebookIcon, TrashIcon } from '@phosphor-icons/react';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { buildLlmDigest, buildProjectReport, downloadText, getLanguage } from '../helpers';
import { useCodeViewerStore } from '../stores';

export function CodeViewerHeader() {
  const selectedFile = useCodeViewerStore((s) => s.selectedFile);
  const folderName = useCodeViewerStore((s) => s.folderName);
  const fileCount = useCodeViewerStore((s) => s.fileCount);
  const fileSystem = useCodeViewerStore((s) => s.fileSystem);
  const clearAll = useCodeViewerStore((s) => s.clearAll);

  const exportReport = () => {
    if (!fileSystem || !folderName) return;
    downloadText(`${folderName}-report.md`, buildProjectReport(fileSystem, folderName), 'text/markdown;charset=utf-8');
  };

  const exportDigest = () => {
    if (!fileSystem || !folderName) return;
    downloadText(`${folderName}-llm-digest.md`, buildLlmDigest(fileSystem, folderName), 'text/markdown;charset=utf-8');
  };

  return (
    <header className="flex shrink-0 items-center justify-between gap-3 border-b border-border px-6 py-3">
      <div className="flex min-w-0 items-center gap-2.5">
        <div className="flex size-7 shrink-0 items-center justify-center bg-primary text-primary-foreground">
          <CodeIcon className="size-4" weight="bold" />
        </div>
        <div className="min-w-0">
          <div className="font-heading text-sm leading-none font-semibold">Code Viewer</div>
          <div className="mt-1 truncate font-mono text-[11px] leading-none text-muted-foreground">
            {selectedFile
              ? `${selectedFile.name} · ${
                  selectedFile.kind === 'text' ? getLanguage(selectedFile.name) : selectedFile.kind
                }`
              : folderName
              ? `${folderName} · ${fileCount} files · private local audit`
              : 'Upload a folder — insights, grep, TODOs & secrets stay in your browser'}
          </div>
        </div>
      </div>

      <div className="flex shrink-0 items-center gap-2">
        <Tooltip>
          <TooltipTrigger
            delay={200}
            render={
              <Button
                variant="outline"
                size="sm"
                onClick={exportReport}
                disabled={!folderName}
                className="hidden sm:inline-flex"
              />
            }
          >
            <NotebookIcon data-icon="inline-start" />
            Report
          </TooltipTrigger>
          <TooltipContent side="bottom" align="end" className="max-w-[260px] flex-col items-start gap-1 py-2">
            <span className="font-medium">Project report</span>
            <span className="text-[11px] leading-snug text-background/80">
              Downloads a markdown summary of languages, file sizes, LOC, and TODO/secret findings. Use it for PR notes,
              audits, or sharing a quick health check without sending the whole repo.
            </span>
          </TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger
            delay={200}
            render={
              <Button
                variant="outline"
                size="sm"
                onClick={exportDigest}
                disabled={!folderName}
                className="hidden md:inline-flex"
              />
            }
          >
            <DownloadSimpleIcon data-icon="inline-start" />
            LLM digest
          </TooltipTrigger>
          <TooltipContent side="bottom" align="end" className="max-w-[260px] flex-col items-start gap-1 py-2">
            <span className="font-medium">LLM digest</span>
            <span className="text-[11px] leading-snug text-background/80">
              Packs text files into one markdown file you can paste into ChatGPT, Claude, or Cursor. Useful for “explain
              this codebase” or refactor help without uploading privately.
            </span>
          </TooltipContent>
        </Tooltip>

        <Button variant="outline" size="sm" onClick={clearAll} disabled={!folderName}>
          <TrashIcon data-icon="inline-start" />
          Clear
        </Button>
      </div>
    </header>
  );
}
