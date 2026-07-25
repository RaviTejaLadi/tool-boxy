import { useEffect, useRef, useState } from 'react';
import { AlertCircle, Download, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { buildPreviewDocument, downloadText } from '../helpers';
import { useViewerStore } from '../stores';

export function PreviewPane() {
  const htmlCode = useViewerStore((s) => s.htmlCode);

  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [error, setError] = useState<string | null>(null);

  const renderPreview = () => {
    const iframe = iframeRef.current;
    if (!iframe) return;

    try {
      const doc = iframe.contentDocument || iframe.contentWindow?.document;
      if (!doc) {
        setError('Unable to access iframe document');
        return;
      }

      doc.open();
      doc.write(buildPreviewDocument(htmlCode));
      doc.close();
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to render HTML content');
    }
  };

  useEffect(() => {
    renderPreview();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [htmlCode]);

  const handleRefresh = () => {
    renderPreview();
  };

  const handleDownload = () => {
    if (!htmlCode.trim()) return;
    downloadText(htmlCode, 'preview.html', 'text/html');
  };

  return (
    <section className="relative flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden bg-muted/40">
      <div className="flex shrink-0 items-center justify-between gap-2 border-b border-border px-3 py-2">
        <span className="font-mono text-[11px] font-semibold text-primary">Preview</span>
        <div className="flex items-center gap-1">
          <Button variant="ghost" size="icon" className="size-8" onClick={handleRefresh} aria-label="Refresh preview">
            <RefreshCw className="size-4" />
          </Button>
        </div>
      </div>

      <div className="relative flex min-h-0 flex-1 overflow-hidden bg-white">
        {error && (
          <div className="absolute inset-0 z-10 flex items-center justify-center bg-muted/40 p-6">
            <div className="flex max-w-md flex-col items-center gap-2 border border-destructive/40 bg-background/90 px-4 py-6 text-center text-destructive">
              <AlertCircle className="size-5" />
              <p className="font-mono text-[11px]">{error}</p>
            </div>
          </div>
        )}
        <iframe
          ref={iframeRef}
          title="HTML Preview"
          className="size-full border-0 bg-transparent"
          sandbox="allow-scripts allow-modals allow-same-origin"
        />
      </div>

      <div className="flex h-12 shrink-0 items-center gap-2 border-t border-border bg-background/80 px-3 backdrop-blur-sm">
        <Button size="sm" className="ml-auto" onClick={handleDownload} disabled={!htmlCode.trim()}>
          <Download data-icon="inline-start" />
          Download
        </Button>
      </div>
    </section>
  );
}
