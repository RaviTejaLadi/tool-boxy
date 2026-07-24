import { Copy, RotateCcw, Download, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useMarkdownStore } from '../stores';

type MarkdownLivePreviewHeaderProps = {
  onExportPdf: () => void;
};

export function MarkdownLivePreviewHeader({ onExportPdf }: MarkdownLivePreviewHeaderProps) {
  const copied = useMarkdownStore((s) => s.copied);
  const resetMarkdown = useMarkdownStore((s) => s.resetMarkdown);
  const copyMarkdown = useMarkdownStore((s) => s.copyMarkdown);

  return (
    <header className="flex shrink-0 items-center justify-between border-b border-border px-6 py-3">
      <div className="flex items-center gap-2.5">
        <div className="flex size-7 items-center justify-center bg-primary text-primary-foreground">
          <FileText className="size-4" />
        </div>
        <div>
          <div className="font-heading text-sm leading-none font-semibold">Markdown Live Preview</div>
          <div className="mt-1 font-mono text-[11px] leading-none text-muted-foreground">
            Write markdown and preview it live
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <Button variant="outline" size="sm" onClick={resetMarkdown}>
          <RotateCcw data-icon="inline-start" />
          Reset
        </Button>
        <Button variant="outline" size="sm" onClick={() => void copyMarkdown()}>
          <Copy data-icon="inline-start" />
          {copied ? 'Copied!' : 'Copy'}
        </Button>
        <Button size="sm" onClick={onExportPdf}>
          <Download data-icon="inline-start" />
          Export PDF
        </Button>
      </div>
    </header>
  );
}
