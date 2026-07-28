import { Label } from '@/components/ui/label';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { type CellSize, useGlyphBrowserStore } from '../stores';
import { SectionHeading } from './SectionHeading';

const CELL_SIZE_OPTIONS: { value: CellSize; label: string }[] = [
  { value: 'compact', label: 'S' },
  { value: 'comfortable', label: 'M' },
  { value: 'large', label: 'L' },
];

export function DisplaySection() {
  const cellSize = useGlyphBrowserStore((s) => s.cellSize);
  const setCellSize = useGlyphBrowserStore((s) => s.setCellSize);

  return (
    <section className="space-y-4">
      <SectionHeading className="mb-3">Display</SectionHeading>

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
    </section>
  );
}
