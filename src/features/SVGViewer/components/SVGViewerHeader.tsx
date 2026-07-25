import { CodeXml, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useViewerStore } from '../stores';

export function SVGViewerHeader() {
  const reset = useViewerStore((s) => s.reset);

  return (
    <header className="flex shrink-0 items-center justify-between border-b border-border px-6 py-3">
      <div className="flex items-center gap-2.5">
        <div className="flex size-7 items-center justify-center bg-primary text-primary-foreground">
          <CodeXml className="size-4" />
        </div>
        <div>
          <div className="font-heading text-sm leading-none font-semibold">SVG Viewer</div>
          <div className="mt-1 font-mono text-[11px] leading-none text-muted-foreground">
            Edit, optimize, and export SVG in the browser
          </div>
        </div>
      </div>

      <Button variant="outline" size="sm" onClick={reset}>
        <RefreshCw data-icon="inline-start" />
        Reset
      </Button>
    </header>
  );
}
