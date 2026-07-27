import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { MAX_WIDTH, MIN_WIDTH, WIDTH_STEP } from '../constants';
import { useAsciiStore } from '../stores';
import { SectionHeading } from './SectionHeading';

export function ResolutionSection() {
  const imageSrc = useAsciiStore((s) => s.imageSrc);
  const width = useAsciiStore((s) => s.width);
  const setWidth = useAsciiStore((s) => s.setWidth);

  if (!imageSrc) return null;

  return (
    <section className="space-y-3">
      <SectionHeading className="mb-3">Resolution</SectionHeading>

      <div className="flex items-center justify-between">
        <Label className="text-sm">Width</Label>
        <span className="font-mono text-xs text-muted-foreground tabular-nums">{width} chars</span>
      </div>

      <Slider
        value={[width]}
        min={MIN_WIDTH}
        max={MAX_WIDTH}
        step={WIDTH_STEP}
        onValueChange={(value) => setWidth(Array.isArray(value) ? value[0] : value)}
      />

      <div className="flex justify-between font-mono text-[11px] text-muted-foreground">
        <span>Lower (faster)</span>
        <span>Higher (more detail)</span>
      </div>
    </section>
  );
}
