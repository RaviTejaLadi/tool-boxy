import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { cn, parseSliderValue } from '@/lib/utils';
import { COLOR_SWATCHES, type PreviewShape } from '../constants';
import { useAnimationGeneratorStore } from '../stores';
import { SectionHeading } from './SectionHeading';

export function StyleSection() {
  const shape = useAnimationGeneratorStore((s) => s.shape);
  const size = useAnimationGeneratorStore((s) => s.size);
  const colorIndex = useAnimationGeneratorStore((s) => s.colorIndex);
  const setShape = useAnimationGeneratorStore((s) => s.setShape);
  const setSize = useAnimationGeneratorStore((s) => s.setSize);
  const setColorIndex = useAnimationGeneratorStore((s) => s.setColorIndex);

  return (
    <section className="space-y-4">
      <SectionHeading className="mb-3">Preview style</SectionHeading>

      <div className="space-y-2">
        <Label className="text-xs text-muted-foreground">Shape</Label>
        <ToggleGroup
          value={[shape]}
          onValueChange={(value) => {
            const next = value[0] as PreviewShape | undefined;
            if (next) setShape(next);
          }}
          variant="outline"
          spacing={0}
          className="grid w-full grid-cols-3 border border-border"
        >
          <ToggleGroupItem
            value="square"
            className="flex-1 rounded-none border-0 text-xs data-[pressed]:bg-primary data-[pressed]:text-primary-foreground"
          >
            Square
          </ToggleGroupItem>
          <ToggleGroupItem
            value="rounded"
            className="flex-1 rounded-none border-0 text-xs data-[pressed]:bg-primary data-[pressed]:text-primary-foreground"
          >
            Rounded
          </ToggleGroupItem>
          <ToggleGroupItem
            value="circle"
            className="flex-1 rounded-none border-0 text-xs data-[pressed]:bg-primary data-[pressed]:text-primary-foreground"
          >
            Circle
          </ToggleGroupItem>
        </ToggleGroup>
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label className="text-xs text-muted-foreground">Size</Label>
          <span className="font-mono text-xs">{size}px</span>
        </div>
        <Slider value={[size]} min={40} max={160} step={4} onValueChange={(v) => setSize(parseSliderValue(v))} />
      </div>

      <div className="space-y-2">
        <Label className="text-xs text-muted-foreground">Preview colour</Label>
        <div className="flex items-center gap-2">
          {COLOR_SWATCHES.map((c, i) => (
            <button
              key={c.name}
              type="button"
              title={c.name}
              onClick={() => setColorIndex(i)}
              className={cn(
                'size-7 rounded-full ring-offset-2 ring-offset-background transition-all',
                colorIndex === i ? 'ring-2 ring-foreground' : 'ring-1 ring-border'
              )}
              style={{ backgroundColor: c.value }}
            />
          ))}
        </div>
        <p className="text-xs text-muted-foreground">Visual only — not included in exported CSS.</p>
      </div>
    </section>
  );
}
