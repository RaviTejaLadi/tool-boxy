import { useEffect } from 'react';
import { Pause, Play, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ANIMATIONS, COLOR_SWATCHES, SHAPE_RADIUS } from '../constants';
import { toKebab } from '../helpers';
import { useAnimationGeneratorStore } from '../stores';

export function PreviewPane() {
  const animationType = useAnimationGeneratorStore((s) => s.animationType);
  const duration = useAnimationGeneratorStore((s) => s.duration);
  const delay = useAnimationGeneratorStore((s) => s.delay);
  const timingFunction = useAnimationGeneratorStore((s) => s.timingFunction);
  const bezier = useAnimationGeneratorStore((s) => s.bezier);
  const iterationCount = useAnimationGeneratorStore((s) => s.iterationCount);
  const iterationCustom = useAnimationGeneratorStore((s) => s.iterationCustom);
  const direction = useAnimationGeneratorStore((s) => s.direction);
  const fillMode = useAnimationGeneratorStore((s) => s.fillMode);
  const shape = useAnimationGeneratorStore((s) => s.shape);
  const size = useAnimationGeneratorStore((s) => s.size);
  const colorIndex = useAnimationGeneratorStore((s) => s.colorIndex);
  const playKey = useAnimationGeneratorStore((s) => s.playKey);
  const isPlaying = useAnimationGeneratorStore((s) => s.isPlaying);
  const bumpPlayKey = useAnimationGeneratorStore((s) => s.bumpPlayKey);
  const setIsPlaying = useAnimationGeneratorStore((s) => s.setIsPlaying);
  const replay = useAnimationGeneratorStore((s) => s.replay);
  const getTimingValue = useAnimationGeneratorStore((s) => s.getTimingValue);
  const getIterationValue = useAnimationGeneratorStore((s) => s.getIterationValue);

  const kebabName = toKebab(animationType);
  const activeColor = COLOR_SWATCHES[colorIndex];
  const timingValue = getTimingValue();
  const iterationValue = getIterationValue();

  useEffect(() => {
    bumpPlayKey();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    animationType,
    duration,
    delay,
    timingFunction,
    bezier,
    iterationCount,
    iterationCustom,
    direction,
    fillMode,
    shape,
    size,
    colorIndex,
  ]);

  const timingLabel = timingFunction === 'custom' ? 'custom' : timingFunction;

  return (
    <div className="relative flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden bg-muted/40">
      <div
        className="flex min-h-0 flex-1 flex-col overflow-auto"
        style={{
          backgroundImage:
            'radial-gradient(circle, color-mix(in oklab, var(--foreground) 8%, transparent) 1px, transparent 1px)',
          backgroundSize: '22px 22px',
        }}
      >
        <div className="flex min-h-0 flex-1 flex-col items-center justify-center gap-4 p-6 lg:p-10">
          <div
            className="relative flex h-56 w-full max-w-xl items-center justify-center overflow-hidden border border-dashed border-border md:h-64"
            style={{ perspective: '600px' }}
          >
            <div
              key={playKey}
              style={{
                width: size,
                height: size,
                borderRadius: SHAPE_RADIUS[shape],
                backgroundColor: activeColor.value,
                boxShadow: `0 0 40px ${activeColor.glow}`,
                animationName: kebabName,
                animationDuration: `${duration}s`,
                animationTimingFunction: timingValue,
                animationDelay: `${delay}s`,
                animationIterationCount: iterationValue,
                animationDirection: direction,
                animationFillMode: fillMode,
                animationPlayState: isPlaying ? 'running' : 'paused',
              }}
            />
          </div>

          <div className="flex items-center gap-2">
            <Button size="sm" onClick={() => setIsPlaying(!isPlaying)}>
              {isPlaying ? <Pause data-icon="inline-start" /> : <Play data-icon="inline-start" />}
              {isPlaying ? 'Pause' : 'Play'}
            </Button>
            <Button variant="outline" size="sm" onClick={replay}>
              <RotateCcw data-icon="inline-start" />
              Replay
            </Button>
          </div>
        </div>
      </div>

      <div className="pointer-events-none absolute bottom-3 left-1/2 max-w-[min(100%-1.5rem,28rem)] -translate-x-1/2">
        <span className="block truncate rounded-none border border-border bg-background/90 px-2 py-1 font-mono text-[11px] text-muted-foreground shadow-sm backdrop-blur-sm">
          {ANIMATIONS[animationType].label} · {duration.toFixed(2)}s · {timingLabel}
          {isPlaying ? ' · playing' : ' · paused'}
        </span>
      </div>
    </div>
  );
}
