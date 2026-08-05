import { Maximize2, ZoomIn, ZoomOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Field, FieldContent } from '@/components/ui/field';
import { Slider } from '@/components/ui/slider';
import { parseSliderValue } from '@/lib/utils';
import { MAX_ZOOM, MIN_ZOOM } from '../constants';
import { clamp } from '../helpers';
import { useAnnotatorStore } from '../stores';
import { SectionHeading } from './SectionHeading';

export function ViewSection() {
  const image = useAnnotatorStore((s) => s.image);
  const zoom = useAnnotatorStore((s) => s.zoom);
  const setZoom = useAnnotatorStore((s) => s.setZoom);
  const fitToScreen = useAnnotatorStore((s) => s.fitToScreen);

  return (
    <section className="space-y-4">
      <SectionHeading className="mb-1">View</SectionHeading>

      <Field>
        <div className="mb-2 flex items-center justify-between">
          <Label className="text-sm">Zoom</Label>
          <span className="font-mono text-xs text-muted-foreground">{Math.round(zoom * 100)}%</span>
        </div>
        <FieldContent>
          <Slider
            value={[zoom]}
            min={MIN_ZOOM}
            max={MAX_ZOOM}
            step={0.05}
            disabled={!image}
            onValueChange={(v) => setZoom(clamp(parseSliderValue(v), MIN_ZOOM, MAX_ZOOM))}
          />
        </FieldContent>
      </Field>

      <div className="flex gap-1.5">
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="flex-1"
          disabled={!image}
          onClick={() => setZoom((z) => clamp(z * 0.85, MIN_ZOOM, MAX_ZOOM))}
        >
          <ZoomOut data-icon="inline-start" />
          Out
        </Button>
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="flex-1"
          disabled={!image}
          onClick={() => setZoom((z) => clamp(z * 1.18, MIN_ZOOM, MAX_ZOOM))}
        >
          <ZoomIn data-icon="inline-start" />
          In
        </Button>
        <Button type="button" variant="outline" size="sm" className="flex-1" disabled={!image} onClick={fitToScreen}>
          <Maximize2 data-icon="inline-start" />
          Fit
        </Button>
      </div>
    </section>
  );
}
