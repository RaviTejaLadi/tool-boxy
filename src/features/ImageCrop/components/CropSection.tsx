import { Crop, ImageDown, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { parseSliderValue } from '@/lib/utils';
import { ASPECT_RATIOS, MAX_ZOOM, MIN_ZOOM, type AspectRatioId } from '../constants';
import { cropImage, downloadCropped } from '../helpers';
import { useCropStore } from '../stores';
import { SectionHeading } from './SectionHeading';

export function CropSection() {
  const source = useCropStore((s) => s.source);
  const cropArea = useCropStore((s) => s.cropArea);
  const displaySize = useCropStore((s) => s.displaySize);
  const zoom = useCropStore((s) => s.zoom);
  const aspectRatioId = useCropStore((s) => s.aspectRatioId);
  const cropped = useCropStore((s) => s.cropped);
  const isProcessing = useCropStore((s) => s.isProcessing);
  const setZoom = useCropStore((s) => s.setZoom);
  const setAspectRatioId = useCropStore((s) => s.setAspectRatioId);
  const setCropped = useCropStore((s) => s.setCropped);
  const setProcessing = useCropStore((s) => s.setProcessing);

  const cropWidth =
    cropArea && displaySize.width > 0 && source
      ? Math.round((cropArea.width / displaySize.width) * source.width)
      : null;
  const cropHeight =
    cropArea && displaySize.height > 0 && source
      ? Math.round((cropArea.height / displaySize.height) * source.height)
      : null;

  const handleCrop = async () => {
    if (!source || !cropArea || displaySize.width === 0) return;
    setProcessing(true);
    try {
      const result = await cropImage(source, cropArea, displaySize);
      setCropped(result);
    } finally {
      setProcessing(false);
    }
  };

  return (
    <section className="space-y-3">
      <SectionHeading className="mb-3">Crop</SectionHeading>

      <div className="space-y-2">
        <Label className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">Aspect ratio</Label>
        <ToggleGroup
          value={[aspectRatioId]}
          onValueChange={(value) => {
            const next = value[0] as AspectRatioId | undefined;
            if (next) setAspectRatioId(next);
          }}
          variant="outline"
          size="sm"
          spacing={0}
          className="flex w-full flex-wrap"
          disabled={!source || isProcessing}
        >
          {ASPECT_RATIOS.map((ratio) => (
            <ToggleGroupItem key={ratio.id} value={ratio.id} className="rounded-none border-0 px-2.5 font-mono text-xs">
              {ratio.label}
            </ToggleGroupItem>
          ))}
        </ToggleGroup>
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">Zoom</Label>
          <span className="font-mono text-[11px] tabular-nums text-muted-foreground">{Math.round(zoom * 100)}%</span>
        </div>
        <Slider
          value={[zoom]}
          min={MIN_ZOOM}
          max={MAX_ZOOM}
          step={0.1}
          onValueChange={(value) => setZoom(parseSliderValue(value))}
          disabled={!source || isProcessing || cropped != null}
        />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1.5 border border-border bg-muted/30 px-3 py-2">
          <p className="font-mono text-[10px] tracking-wide text-muted-foreground uppercase">Crop size</p>
          <p className="font-mono text-xs tabular-nums">
            {cropWidth != null && cropHeight != null ? `${cropWidth} × ${cropHeight} px` : '—'}
          </p>
        </div>
        <div className="space-y-1.5 border border-border bg-muted/30 px-3 py-2">
          <p className="font-mono text-[10px] tracking-wide text-muted-foreground uppercase">Source</p>
          <p className="font-mono text-xs tabular-nums">{source ? `${source.width} × ${source.height}` : '—'}</p>
        </div>
      </div>

      <div className="flex flex-col gap-2 pt-1">
        <Button
          type="button"
          size="sm"
          className="w-full"
          onClick={() => void handleCrop()}
          disabled={!source || !cropArea || isProcessing || cropped != null}
        >
          {isProcessing ? (
            <Loader2 data-icon="inline-start" className="animate-spin" />
          ) : (
            <Crop data-icon="inline-start" />
          )}
          {isProcessing ? 'Cropping…' : 'Apply crop'}
        </Button>
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="w-full"
          onClick={() => cropped && downloadCropped(cropped)}
          disabled={!cropped || isProcessing}
        >
          <ImageDown data-icon="inline-start" />
          Download PNG
        </Button>
      </div>
    </section>
  );
}
