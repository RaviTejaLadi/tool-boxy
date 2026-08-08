import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Textarea } from '@/components/ui/textarea';
import { cn, parseSliderValue } from '@/lib/utils';
import { TEXT_ANIMATIONS, TEXT_DIRECTION_OPTIONS, TEXT_PHASE_OPTIONS, TEXT_SEGMENT_OPTIONS } from '../constants';
import { useAnimationGeneratorStore } from '../stores';
import { SectionHeading } from './SectionHeading';

/** Map duration (0.2–2s) ↔ friendly speed (1–10, higher = faster). */
function durationToSpeed(duration: number) {
  const clamped = Math.min(2, Math.max(0.2, duration));
  return Math.round(1 + ((2 - clamped) / 1.8) * 9);
}

function speedToDuration(speed: number) {
  const s = Math.min(10, Math.max(1, speed));
  return Math.round((2 - ((s - 1) / 9) * 1.8) * 100) / 100;
}

export function TextPropertiesSection() {
  const textAnimationType = useAnimationGeneratorStore((s) => s.textAnimationType);
  const previewText = useAnimationGeneratorStore((s) => s.previewText);
  const duration = useAnimationGeneratorStore((s) => s.duration);
  const textSegmentMode = useAnimationGeneratorStore((s) => s.textSegmentMode);
  const textPhase = useAnimationGeneratorStore((s) => s.textPhase);
  const textDirection = useAnimationGeneratorStore((s) => s.textDirection);
  const textStagger = useAnimationGeneratorStore((s) => s.textStagger);
  const iterationCount = useAnimationGeneratorStore((s) => s.iterationCount);
  const setPreviewText = useAnimationGeneratorStore((s) => s.setPreviewText);
  const setDuration = useAnimationGeneratorStore((s) => s.setDuration);
  const setTextSegmentMode = useAnimationGeneratorStore((s) => s.setTextSegmentMode);
  const setTextPhase = useAnimationGeneratorStore((s) => s.setTextPhase);
  const setTextDirection = useAnimationGeneratorStore((s) => s.setTextDirection);
  const setTextStagger = useAnimationGeneratorStore((s) => s.setTextStagger);
  const setIterationCount = useAnimationGeneratorStore((s) => s.setIterationCount);

  const def = TEXT_ANIMATIONS[textAnimationType];
  const { controls } = def;
  const speed = durationToSpeed(duration);
  const showStagger = controls.segment && textSegmentMode !== 'line';

  return (
    <section className="space-y-4">
      <div>
        <SectionHeading>{def.label}</SectionHeading>
        <p className="mt-1.5 text-xs text-muted-foreground">{def.description}</p>
      </div>

      <div className="space-y-2">
        <Label className="text-xs text-muted-foreground">Text</Label>
        <Textarea
          value={previewText}
          onChange={(e) => setPreviewText(e.target.value)}
          rows={2}
          className="resize-none text-sm"
          placeholder="Type your text…"
        />
      </div>

      {controls.phase && (
        <div className="space-y-2">
          <Label className="text-xs text-muted-foreground">Apply to</Label>
          <div className="grid grid-cols-3 border border-border">
            {TEXT_PHASE_OPTIONS.map((opt) => (
              <button
                key={opt.value}
                type="button"
                onClick={() => setTextPhase(opt.value)}
                className={cn(
                  'px-2 py-1.5 text-xs transition-colors',
                  textPhase === opt.value
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-muted/30 text-muted-foreground hover:bg-muted/60 hover:text-foreground'
                )}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>
      )}

      {controls.continuous && (
        <div className="space-y-2">
          <Label className="text-xs text-muted-foreground">Loop</Label>
          <div className="grid grid-cols-2 border border-border">
            <button
              type="button"
              onClick={() => setIterationCount('infinite')}
              className={cn(
                'px-2 py-1.5 text-xs transition-colors',
                iterationCount === 'infinite'
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-muted/30 text-muted-foreground hover:bg-muted/60 hover:text-foreground'
              )}
            >
              On
            </button>
            <button
              type="button"
              onClick={() => setIterationCount('1')}
              className={cn(
                'px-2 py-1.5 text-xs transition-colors',
                iterationCount !== 'infinite'
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-muted/30 text-muted-foreground hover:bg-muted/60 hover:text-foreground'
              )}
            >
              Once
            </button>
          </div>
        </div>
      )}

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label className="text-xs text-muted-foreground">Speed</Label>
          <span className="text-[11px] text-muted-foreground">{speed}/10</span>
        </div>
        <Slider
          value={[speed]}
          min={1}
          max={10}
          step={1}
          onValueChange={(v) => setDuration(speedToDuration(parseSliderValue(v)))}
        />
        <div className="flex justify-between text-[10px] text-muted-foreground">
          <span>Slow</span>
          <span>Fast</span>
        </div>
      </div>

      {controls.direction && (
        <div className="space-y-2">
          <Label className="text-xs text-muted-foreground">Direction</Label>
          <div className="grid grid-cols-2 gap-1.5">
            {TEXT_DIRECTION_OPTIONS.map((opt) => (
              <button
                key={opt.value}
                type="button"
                onClick={() => setTextDirection(opt.value)}
                className={cn(
                  'border px-2 py-1.5 text-xs transition-colors',
                  textDirection === opt.value
                    ? 'border-primary bg-primary/10 text-primary'
                    : 'border-border bg-muted/30 text-muted-foreground hover:border-muted-foreground/40 hover:text-foreground'
                )}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>
      )}

      {controls.segment && (
        <div className="space-y-2">
          <Label className="text-xs text-muted-foreground">Animate by</Label>
          <div className="grid grid-cols-3 border border-border">
            {TEXT_SEGMENT_OPTIONS.map((opt) => (
              <button
                key={opt.value}
                type="button"
                onClick={() => setTextSegmentMode(opt.value)}
                className={cn(
                  'px-2 py-1.5 text-xs transition-colors',
                  textSegmentMode === opt.value
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-muted/30 text-muted-foreground hover:bg-muted/60 hover:text-foreground'
                )}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>
      )}

      {showStagger && (
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label className="text-xs text-muted-foreground">Stagger</Label>
            <span className="font-mono text-xs">{textStagger.toFixed(2)}s</span>
          </div>
          <Slider
            value={[textStagger]}
            min={0}
            max={0.2}
            step={0.01}
            onValueChange={(v) => setTextStagger(parseSliderValue(v))}
          />
        </div>
      )}
    </section>
  );
}
