import { Check, Copy, LayoutGrid, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useFlexboxPlaygroundStore } from '../stores';

export function FlexboxPlaygroundHeader() {
  const copied = useFlexboxPlaygroundStore((s) => s.copied);
  const copyCss = useFlexboxPlaygroundStore((s) => s.copyCss);
  const resetAll = useFlexboxPlaygroundStore((s) => s.resetAll);

  return (
    <header className="flex shrink-0 items-center justify-between border-b border-border px-6 py-3">
      <div className="flex items-center gap-2.5">
        <div className="flex size-7 items-center justify-center bg-primary text-primary-foreground">
          <LayoutGrid className="size-4" />
        </div>
        <div>
          <div className="font-heading text-sm leading-none font-semibold">Flexbox Playground</div>
          <div className="mt-1 font-mono text-[11px] leading-none text-muted-foreground">
            Explore flex container and item properties
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
