import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { type CellSize, useWorldScriptsStore } from '../stores';
import { SectionHeading } from './SectionHeading';

const CELL_SIZE_OPTIONS: { value: CellSize; label: string }[] = [
  { value: 'compact', label: 'S' },
  { value: 'comfortable', label: 'M' },
  { value: 'large', label: 'L' },
];

export function DisplaySection() {
  const cellSize = useWorldScriptsStore((s) => s.cellSize);
  const includeLowercase = useWorldScriptsStore((s) => s.includeLowercase);
  const setCellSize = useWorldScriptsStore((s) => s.setCellSize);
  const setIncludeLowercase = useWorldScriptsStore((s) => s.setIncludeLowercase);

  return (
    <section className="space-y-4">
      <SectionHeading className="mb-3">Display</SectionHeading>

      <div className="space-y-3">
        <div className="space-y-2">
          <Label className="font-mono text-[10px] tracking-wide text-muted-foreground uppercase">Grid density</Label>
          <ToggleGroup
            value={[cellSize]}
            onValueChange={(value) => {
              const next = value[0] as CellSize | undefined;
              if (next) setCellSize(next);
            }}
            variant="outline"
            spacing={0}
            className="grid w-full grid-cols-3 border border-border"
          >
            {CELL_SIZE_OPTIONS.map((opt) => (
              <ToggleGroupItem
                key={opt.value}
                value={opt.value}
                className="flex-1 rounded-none border-0 data-[pressed]:bg-primary data-[pressed]:text-primary-foreground"
              >
                {opt.label}
              </ToggleGroupItem>
            ))}
          </ToggleGroup>
        </div>

        <div className="flex items-center justify-between gap-3 border border-border bg-muted/30 px-3 py-2.5">
          <div>
            <Label htmlFor="include-lowercase" className="text-xs font-medium">
              Include lowercase
            </Label>
            <p className="mt-0.5 font-mono text-[10px] text-muted-foreground">Adds case variants when available</p>
          </div>
          <Switch id="include-lowercase" checked={includeLowercase} onCheckedChange={setIncludeLowercase} />
        </div>
      </div>
    </section>
  );
}
