import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';
import { ButtonGroup } from '@/components/ui/button-group';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { Field, FieldContent, FieldLabel } from '@/components/ui/field';
import { RESIZE_OPTIONS, type ResizeMode } from '../constants';
import { useConverterStore } from '../stores';
import { SectionHeading } from './SectionHeading';

export function OptionsSection() {
  const formatId = useConverterStore((s) => s.formatId);
  const resizeMode = useConverterStore((s) => s.resizeMode);
  const resizeWidth = useConverterStore((s) => s.resizeWidth);
  const resizeHeight = useConverterStore((s) => s.resizeHeight);
  const scalePercent = useConverterStore((s) => s.scalePercent);
  const preserveTransparency = useConverterStore((s) => s.preserveTransparency);
  const quality = useConverterStore((s) => s.quality);
  const setResizeMode = useConverterStore((s) => s.setResizeMode);
  const setResizeWidth = useConverterStore((s) => s.setResizeWidth);
  const setResizeHeight = useConverterStore((s) => s.setResizeHeight);
  const setScalePercent = useConverterStore((s) => s.setScalePercent);
  const setPreserveTransparency = useConverterStore((s) => s.setPreserveTransparency);
  const setQuality = useConverterStore((s) => s.setQuality);

  const showTransparency = formatId === 'png' || formatId === 'webp' || formatId === 'ico' || formatId === 'svg';
  const showQuality = formatId === 'jpeg' || formatId === 'webp';
  const resizeHint = RESIZE_OPTIONS.find((o) => o.id === resizeMode)?.hint ?? '';

  return (
    <section className="space-y-4">
      <SectionHeading className="mb-1">Options</SectionHeading>

      {showTransparency && (
        <Field orientation="horizontal" className="items-center justify-between">
          <FieldLabel className="text-sm">Preserve transparency</FieldLabel>
          <Switch checked={preserveTransparency} onCheckedChange={setPreserveTransparency} />
        </Field>
      )}

      {showQuality && (
        <Field>
          <div className="mb-2 flex items-center justify-between">
            <Label className="text-sm">Quality</Label>
            <span className="font-mono text-xs text-muted-foreground">{Math.round(quality * 100)}%</span>
          </div>
          <FieldContent>
            <Slider
              value={[quality]}
              min={0.1}
              max={1}
              step={0.01}
              onValueChange={(value) => setQuality(Array.isArray(value) ? value[0] : value)}
            />
          </FieldContent>
        </Field>
      )}

      <Field>
        <div className="mb-2 flex items-center justify-between">
          <Label className="text-sm">Resize</Label>
        </div>
        <FieldContent>
          <ButtonGroup className="w-full">
            <ToggleGroup
              value={[resizeMode]}
              onValueChange={(value) => {
                const next = value[0] as ResizeMode | undefined;
                if (next) setResizeMode(next);
              }}
              variant="outline"
              size="sm"
              spacing={0}
              className="w-full"
            >
              {RESIZE_OPTIONS.map((option) => (
                <ToggleGroupItem
                  key={option.id}
                  value={option.id}
                  className="flex-1 rounded-none border-0 px-2 font-mono text-xs"
                >
                  {option.label}
                </ToggleGroupItem>
              ))}
            </ToggleGroup>
          </ButtonGroup>
        </FieldContent>
        <p className="mt-2 font-mono text-[11px] text-muted-foreground">{resizeHint}</p>
      </Field>

      {resizeMode === 'dimensions' && (
        <div className="flex gap-3">
          <div className="flex-1 space-y-2">
            <Label
              htmlFor="resize-width"
              className="text-xs font-semibold tracking-wide text-muted-foreground uppercase"
            >
              Width
            </Label>
            <Input
              id="resize-width"
              type="number"
              min={1}
              value={resizeWidth}
              onChange={(e) => setResizeWidth(parseInt(e.target.value) || 1)}
              className="font-mono text-sm"
            />
          </div>
          <div className="flex-1 space-y-2">
            <Label
              htmlFor="resize-height"
              className="text-xs font-semibold tracking-wide text-muted-foreground uppercase"
            >
              Height
            </Label>
            <Input
              id="resize-height"
              type="number"
              min={1}
              value={resizeHeight}
              onChange={(e) => setResizeHeight(parseInt(e.target.value) || 1)}
              className="font-mono text-sm"
            />
          </div>
        </div>
      )}

      {resizeMode === 'scale' && (
        <Field>
          <div className="mb-2 flex items-center justify-between">
            <Label className="text-sm">Scale</Label>
            <span className="font-mono text-xs text-muted-foreground">{scalePercent}%</span>
          </div>
          <FieldContent>
            <Slider
              value={[scalePercent]}
              min={1}
              max={200}
              step={1}
              onValueChange={(value) => setScalePercent(Array.isArray(value) ? value[0] : value)}
            />
          </FieldContent>
        </Field>
      )}
    </section>
  );
}
