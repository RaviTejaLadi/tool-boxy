import { Check, Copy, RotateCcw, Square } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useBorderRadiusStore } from '../stores';

export function BorderRadiusGeneratorHeader() {
  const copied = useBorderRadiusStore((s) => s.copied);
  const copyCss = useBorderRadiusStore((s) => s.copyCss);
  const resetAll = useBorderRadiusStore((s) => s.resetAll);

  return (
    <header className="flex shrink-0 items-center justify-between border-b border-border px-6 py-3">
      <div className="flex items-center gap-2.5">
        <div className="flex size-7 items-center justify-center bg-primary text-primary-foreground">
          <Square className="size-4" />
        </div>
        <div>
          <div className="font-heading text-sm leading-none font-semibold">Border Radius Generator</div>
          <div className="mt-1 font-mono text-[11px] leading-none text-muted-foreground">
            Visualise and copy border-radius CSS
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <Button variant="outline" size="sm" onClick={resetAll}>
          <RotateCcw data-icon="inline-start" />
          Reset
        </Button>
        <Button size="sm" onClick={() => void copyCss()}>
          {copied ? <Check data-icon="inline-start" /> : <Copy data-icon="inline-start" />}
          {copied ? 'Copied' : 'Copy CSS'}
        </Button>
      </div>
    </header>
  );
}
