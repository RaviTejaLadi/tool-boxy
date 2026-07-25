import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { PRESET_SIZES } from '../constants';
import { usePlaceholderStore } from '../stores';
import { SectionHeading } from './SectionHeading';

export function DimensionsSection() {
  const width = usePlaceholderStore((s) => s.width);
  const height = usePlaceholderStore((s) => s.height);
  const setWidth = usePlaceholderStore((s) => s.setWidth);
  const setHeight = usePlaceholderStore((s) => s.setHeight);
  const applyPreset = usePlaceholderStore((s) => s.applyPreset);

  return (
    <section className="space-y-4">
      <SectionHeading className="mb-3">Dimensions</SectionHeading>

      <div className="flex gap-3">
        <div className="flex-1 space-y-2">
          <Label htmlFor="width" className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">
            Width
          </Label>
          <Input
            id="width"
            type="number"
            min={1}
            value={width}
            onChange={(e) => setWidth(parseInt(e.target.value) || 0)}
            className="font-mono text-sm"
          />
        </div>
        <div className="flex-1 space-y-2">
          <Label htmlFor="height" className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">
            Height
          </Label>
          <Input
            id="height"
            type="number"
            min={1}
            value={height}
            onChange={(e) => setHeight(parseInt(e.target.value) || 0)}
            className="font-mono text-sm"
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">Presets</Label>
        <div className="flex flex-wrap gap-2">
          {PRESET_SIZES.map((size) => (
            <Button
              key={size.label}
              type="button"
              variant="outline"
              size="sm"
              onClick={() => applyPreset(size.width, size.height)}
            >
              {size.label}
            </Button>
          ))}
        </div>
      </div>
    </section>
  );
}
