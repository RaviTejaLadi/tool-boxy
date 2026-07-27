import { useMemo, useRef } from 'react';
import {
  ArrowDown,
  ArrowDownLeft,
  ArrowDownRight,
  ArrowLeft,
  ArrowRight,
  ArrowUp,
  ArrowUpLeft,
  ArrowUpRight,
  FlipHorizontal2,
  FlipVertical2,
  RotateCcw,
  X,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import {
  BLEND_MODE_OPTIONS,
  MAX_OPACITY,
  MAX_SCALE,
  MIN_OPACITY,
  MIN_SCALE,
  OBJECT_FIT_OPTIONS,
  OPACITY_STEP,
  ROTATION_OPTIONS,
  SCALE_STEP,
  type BlendMode,
  type ObjectFitMode,
  type RotationDeg,
} from '../constants';
import { getNeighborIndex, type GridDirection } from '../helpers';
import { useStitcherStore } from '../stores';
import { SectionHeading } from './SectionHeading';

function parseSliderValue(value: number | readonly number[]) {
  return Array.isArray(value) ? value[0] : value;
}

function ImageRow({ id, index, total }: { id: string; index: number; total: number }) {
  const image = useStitcherStore((s) => s.images.find((img) => img.id === id));
  const selectedImageId = useStitcherStore((s) => s.selectedImageId);
  const selectImage = useStitcherStore((s) => s.selectImage);
  const removeImage = useStitcherStore((s) => s.removeImage);
  const moveImage = useStitcherStore((s) => s.moveImage);
  const swapImages = useStitcherStore((s) => s.swapImages);
  const setImageScale = useStitcherStore((s) => s.setImageScale);
  const updateImageProps = useStitcherStore((s) => s.updateImageProps);
  const resetImageProps = useStitcherStore((s) => s.resetImageProps);
  const dragFrom = useRef<number | null>(null);

  if (!image) return null;

  const isActive = selectedImageId === image.id;

  const neighbor = {
    'up-left': getNeighborIndex(index, total, 'up-left'),
    up: getNeighborIndex(index, total, 'up'),
    'up-right': getNeighborIndex(index, total, 'up-right'),
    left: getNeighborIndex(index, total, 'left'),
    right: getNeighborIndex(index, total, 'right'),
    'down-left': getNeighborIndex(index, total, 'down-left'),
    down: getNeighborIndex(index, total, 'down'),
    'down-right': getNeighborIndex(index, total, 'down-right'),
  };

  const moveInDirection = (direction: GridDirection) => {
    const target = getNeighborIndex(index, total, direction);
    if (target != null) swapImages(index, target);
  };

  return (
    <li>
      <div
        draggable
        onDragStart={(e) => {
          dragFrom.current = index;
          e.dataTransfer.effectAllowed = 'move';
          e.dataTransfer.setData('text/plain', String(index));
        }}
        onDragOver={(e) => {
          e.preventDefault();
          e.dataTransfer.dropEffect = 'move';
        }}
        onDrop={(e) => {
          e.preventDefault();
          const from = dragFrom.current ?? Number(e.dataTransfer.getData('text/plain'));
          if (!Number.isNaN(from)) moveImage(from, index);
          dragFrom.current = null;
        }}
        className={`border px-2 py-2 transition-colors ${
          isActive ? 'border-primary bg-primary/5' : 'border-border bg-background'
        }`}
      >
        <div className="flex w-full min-w-0 items-center gap-2">
          <button
            type="button"
            onClick={() => selectImage(image.id)}
            className="flex min-w-0 flex-1 items-center gap-2 text-left"
          >
            <span className="flex size-5 shrink-0 items-center justify-center border border-border bg-muted/40 font-mono text-[10px] tabular-nums">
              {index + 1}
            </span>
            <img
              src={image.dataUrl}
              alt=""
              className="size-8 shrink-0 border border-border bg-muted/30 object-contain"
              draggable={false}
              style={{
                opacity: image.opacity,
                mixBlendMode: image.blendMode,
                transform: `rotate(${image.rotation}deg) scaleX(${image.flipX ? -1 : 1}) scaleY(${
                  image.flipY ? -1 : 1
                })`,
              }}
            />
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium">{image.name}</p>
              <p className="font-mono text-[10px] text-muted-foreground">
                {image.width}×{image.height} · {image.fit} · {Math.round(image.opacity * 100)}%
              </p>
            </div>
          </button>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="size-7 shrink-0 text-muted-foreground hover:text-destructive"
            onClick={() => removeImage(image.id)}
            title="Remove"
          >
            <X className="size-3.5" />
          </Button>
        </div>

        {isActive && (
          <div className="mt-3 space-y-4 border-t border-border pt-3">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">Scale</Label>
                <span className="font-mono text-xs tabular-nums">{Math.round(image.scale * 100)}%</span>
              </div>
              <Slider
                min={MIN_SCALE}
                max={MAX_SCALE}
                step={SCALE_STEP}
                value={[image.scale]}
                onValueChange={(value) => setImageScale(image.id, parseSliderValue(value))}
                aria-label={`Scale for ${image.name}`}
              />
            </div>

            <div className="space-y-2">
              <Label
                htmlFor={`fit-${image.id}`}
                className="text-xs font-semibold tracking-wide text-muted-foreground uppercase"
              >
                Fit
              </Label>
              <Select
                value={image.fit}
                onValueChange={(value) => {
                  if (value) updateImageProps(image.id, { fit: value as ObjectFitMode });
                }}
              >
                <SelectTrigger id={`fit-${image.id}`} className="w-full font-mono text-sm">
                  <SelectValue placeholder="Select fit" />
                </SelectTrigger>
                <SelectContent>
                  {OBJECT_FIT_OPTIONS.map((opt) => (
                    <SelectItem key={opt.id} value={opt.id} className="font-mono">
                      {opt.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label
                htmlFor={`blend-${image.id}`}
                className="text-xs font-semibold tracking-wide text-muted-foreground uppercase"
              >
                Blend
              </Label>
              <Select
                value={image.blendMode}
                onValueChange={(value) => {
                  if (value) updateImageProps(image.id, { blendMode: value as BlendMode });
                }}
              >
                <SelectTrigger id={`blend-${image.id}`} className="w-full font-mono text-sm">
                  <SelectValue placeholder="Select blend" />
                </SelectTrigger>
                <SelectContent>
                  {BLEND_MODE_OPTIONS.map((opt) => (
                    <SelectItem key={opt.id} value={opt.id} className="font-mono">
                      {opt.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">Opacity</Label>
                <span className="font-mono text-xs tabular-nums">{Math.round(image.opacity * 100)}%</span>
              </div>
              <Slider
                min={MIN_OPACITY}
                max={MAX_OPACITY}
                step={OPACITY_STEP}
                value={[image.opacity]}
                onValueChange={(value) => updateImageProps(image.id, { opacity: parseSliderValue(value) })}
                aria-label={`Opacity for ${image.name}`}
              />
            </div>

            <div className="space-y-2">
              <Label className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">Rotate</Label>
              <div className="grid grid-cols-4 gap-1.5">
                {ROTATION_OPTIONS.map((opt) => (
                  <Button
                    key={opt.id}
                    type="button"
                    variant={image.rotation === opt.id ? 'default' : 'outline'}
                    size="sm"
                    className="h-7 justify-center px-1 font-mono text-[11px]"
                    onClick={() => updateImageProps(image.id, { rotation: opt.id as RotationDeg })}
                  >
                    {opt.label}
                  </Button>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">Flip</Label>
              <div className="grid grid-cols-2 gap-1.5">
                <Button
                  type="button"
                  variant={image.flipX ? 'default' : 'outline'}
                  size="sm"
                  className="h-7 font-mono text-[11px]"
                  onClick={() => updateImageProps(image.id, { flipX: !image.flipX })}
                >
                  <FlipHorizontal2 data-icon="inline-start" className="size-3.5" />
                  Horizontal
                </Button>
                <Button
                  type="button"
                  variant={image.flipY ? 'default' : 'outline'}
                  size="sm"
                  className="h-7 font-mono text-[11px]"
                  onClick={() => updateImageProps(image.id, { flipY: !image.flipY })}
                >
                  <FlipVertical2 data-icon="inline-start" className="size-3.5" />
                  Vertical
                </Button>
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">Position</Label>
              <div className="grid grid-cols-3 gap-1.5">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="h-7"
                  disabled={neighbor['up-left'] == null}
                  onClick={() => moveInDirection('up-left')}
                  title="Move top-left"
                >
                  <ArrowUpLeft className="size-3.5" />
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="h-7"
                  disabled={neighbor.up == null}
                  onClick={() => moveInDirection('up')}
                  title="Move top"
                >
                  <ArrowUp className="size-3.5" />
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="h-7"
                  disabled={neighbor['up-right'] == null}
                  onClick={() => moveInDirection('up-right')}
                  title="Move top-right"
                >
                  <ArrowUpRight className="size-3.5" />
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="h-7"
                  disabled={neighbor.left == null}
                  onClick={() => moveInDirection('left')}
                  title="Move left"
                >
                  <ArrowLeft className="size-3.5" />
                </Button>
                <div className="flex h-7 items-center justify-center border border-dashed border-border font-mono text-[10px] text-muted-foreground">
                  {index + 1}
                </div>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="h-7"
                  disabled={neighbor.right == null}
                  onClick={() => moveInDirection('right')}
                  title="Move right"
                >
                  <ArrowRight className="size-3.5" />
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="h-7"
                  disabled={neighbor['down-left'] == null}
                  onClick={() => moveInDirection('down-left')}
                  title="Move bottom-left"
                >
                  <ArrowDownLeft className="size-3.5" />
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="h-7"
                  disabled={neighbor.down == null}
                  onClick={() => moveInDirection('down')}
                  title="Move bottom"
                >
                  <ArrowDown className="size-3.5" />
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="h-7"
                  disabled={neighbor['down-right'] == null}
                  onClick={() => moveInDirection('down-right')}
                  title="Move bottom-right"
                >
                  <ArrowDownRight className="size-3.5" />
                </Button>
              </div>
            </div>

            <Button
              type="button"
              variant="outline"
              size="sm"
              className="h-7 w-full border-destructive/40 font-mono text-[11px] text-destructive hover:bg-destructive/10 hover:text-destructive"
              onClick={() => resetImageProps(image.id)}
              title="Reset all properties"
            >
              <RotateCcw data-icon="inline-start" className="size-3.5" />
              Reset properties
            </Button>
          </div>
        )}
      </div>
    </li>
  );
}

export function ImagesSection() {
  const idsSignature = useStitcherStore((s) => s.images.map((img) => img.id).join('|'));
  const imageCount = useStitcherStore((s) => s.images.length);

  const imageIds = useMemo(() => (idsSignature.length > 0 ? idsSignature.split('|') : []), [idsSignature]);

  if (imageCount === 0) {
    return (
      <section className="space-y-3">
        <SectionHeading className="mb-3">Images</SectionHeading>
        <p className="font-mono text-[11px] text-muted-foreground">
          Drop or paste images onto the canvas to start composing.
        </p>
      </section>
    );
  }

  return (
    <section className="space-y-3">
      <SectionHeading className="mb-3">Images · {imageCount}</SectionHeading>
      <p className="font-mono text-[11px] leading-relaxed text-muted-foreground">
        Select an image to edit fit, blend, opacity, rotate, flip, and grid position.
      </p>
      <ul className="space-y-2">
        {imageIds.map((id, index) => (
          <ImageRow key={id} id={id} index={index} total={imageCount} />
        ))}
      </ul>
    </section>
  );
}
