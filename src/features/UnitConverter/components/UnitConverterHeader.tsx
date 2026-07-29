import { Ruler, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useUnitConverterStore } from '../stores';

export function UnitConverterHeader() {
  const clear = useUnitConverterStore((s) => s.clear);

  return (
    <header className="flex shrink-0 items-center justify-between border-b border-border px-6 py-3">
      <div className="flex items-center gap-2.5">
        <div className="flex size-7 items-center justify-center bg-primary text-primary-foreground">
          <Ruler className="size-4" />
        </div>
        <div>
          <div className="font-heading text-sm leading-none font-semibold">Unit Converter</div>
          <div className="mt-1 font-mono text-[11px] leading-none text-muted-foreground">
            Convert between units of length, weight, data, and more
          </div>
        </div>
      </div>

      <Button variant="outline" size="sm" onClick={clear}>
        <Trash2 data-icon="inline-start" />
        Reset
      </Button>
    </header>
  );
}
