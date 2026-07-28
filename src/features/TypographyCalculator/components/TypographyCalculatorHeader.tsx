import { Text, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useTypographyCalculatorStore } from '../stores';

export function TypographyCalculatorHeader() {
  const clear = useTypographyCalculatorStore((s) => s.clear);
  const baseFontSize = useTypographyCalculatorStore((s) => s.baseFontSize);
  const setBaseFontSize = useTypographyCalculatorStore((s) => s.setBaseFontSize);

  return (
    <header className="flex shrink-0 flex-wrap items-center justify-between gap-3 border-b border-border px-6 py-3">
      <div className="flex items-center gap-2.5">
        <div className="flex size-7 items-center justify-center bg-primary text-primary-foreground">
          <Text className="size-4" />
        </div>
        <div>
          <div className="font-heading text-sm leading-none font-semibold">Typography Calculator</div>
          <div className="mt-1 font-mono text-[11px] leading-none text-muted-foreground">
            Convert between typographic units
          </div>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2">
          <Label
            htmlFor="base-font-size"
            className="font-mono text-[11px] tracking-wide text-muted-foreground uppercase"
          >
            Base
          </Label>
          <Input
            id="base-font-size"
            type="number"
            min={1}
            step={0.5}
            value={baseFontSize}
            onChange={(e) => {
              const v = parseFloat(e.target.value);
              setBaseFontSize(Number.isNaN(v) || v <= 0 ? 1 : v);
            }}
            className="h-8 w-20 rounded-none font-mono text-sm"
          />
          <span className="font-mono text-xs text-muted-foreground">px</span>
        </div>
        <Button variant="outline" size="sm" onClick={clear}>
          <Trash2 data-icon="inline-start" />
          Reset
        </Button>
      </div>
    </header>
  );
}
