import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { parseSliderValue } from '@/lib/utils';
import type { PreviewShape } from '../constants';
import { useAnimationGeneratorStore } from '../stores';
import { SectionHeading } from './SectionHeading';

export function StyleSection() {
  const shape = useAnimationGeneratorStore((s) => s.shape);
  const size = useAnimationGeneratorStore((s) => s.size);
  const setShape = useAnimationGeneratorStore((s) => s.setShape);
  const setSize = useAnimationGeneratorStore((s) => s.setSize);

  return (
    <section className="space-y-4">
      <SectionHeading className="mb-3">Shape</SectionHeading>

      <div className="space-y-2">
        <Label className="text-xs text-muted-foreground">Style</Label>
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
            className="flex-1 rounded-none border-0 text-xs data-pressed:bg-primary data-pressed:text-primary-foreground"
          >
            Square
          </ToggleGroupItem>
          <ToggleGroupItem
            value="rounded"
            className="flex-1 rounded-none border-0 text-xs data-pressed:bg-primary data-pressed:text-primary-foreground"
          >
            Rounded
          </ToggleGroupItem>
          <ToggleGroupItem
            value="circle"
            className="flex-1 rounded-none border-0 text-xs data-pressed:bg-primary data-pressed:text-primary-foreground"
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
    </section>
  );
}
