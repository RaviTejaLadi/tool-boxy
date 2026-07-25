import { FileJson, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useJsonStore } from '../stores';

export function JSONViewerHeader() {
  const reset = useJsonStore((s) => s.reset);

  return (
    <header className="flex shrink-0 items-center justify-between border-b border-border px-6 py-3">
      <div className="flex items-center gap-2.5">
        <div className="flex size-7 items-center justify-center bg-primary text-primary-foreground">
          <FileJson className="size-4" />
        </div>
        <div>
          <div className="font-heading text-sm leading-none font-semibold">JSON Viewer</div>
          <div className="mt-1 font-mono text-[11px] leading-none text-muted-foreground">
            Edit, search, and explore JSON in the browser
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
