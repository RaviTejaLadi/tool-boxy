import { useEffect, useMemo, type CSSProperties } from 'react';
import { Pause, Play, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { cn, parseSliderValue } from '@/lib/utils';
import { ANIMATIONS, COLOR_SWATCHES, SHAPE_RADIUS, TEXT_ANIMATIONS } from '../constants';
import {
  buildTextKeyframeName,
  getBurstOffset,
  getDirectionCssVars,
  getScrapRotation,
  splitTextForAnimation,
  toKebab,
} from '../helpers';
import { useAnimationGeneratorStore } from '../stores';

export function PreviewPane() {
  const previewMode = useAnimationGeneratorStore((s) => s.previewMode);
  const animationType = useAnimationGeneratorStore((s) => s.animationType);
  const textAnimationType = useAnimationGeneratorStore((s) => s.textAnimationType);
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
  const previewText = useAnimationGeneratorStore((s) => s.previewText);
  const textFontSize = useAnimationGeneratorStore((s) => s.textFontSize);
  const textFontWeight = useAnimationGeneratorStore((s) => s.textFontWeight);
  const textColorIndex = useAnimationGeneratorStore((s) => s.textColorIndex);
  const textLetterSpacing = useAnimationGeneratorStore((s) => s.textLetterSpacing);
  const textSegmentMode = useAnimationGeneratorStore((s) => s.textSegmentMode);
  const textPhase = useAnimationGeneratorStore((s) => s.textPhase);
  const textDirection = useAnimationGeneratorStore((s) => s.textDirection);
  const textStagger = useAnimationGeneratorStore((s) => s.textStagger);
  const playKey = useAnimationGeneratorStore((s) => s.playKey);
  const isPlaying = useAnimationGeneratorStore((s) => s.isPlaying);
  const bumpPlayKey = useAnimationGeneratorStore((s) => s.bumpPlayKey);
  const setIsPlaying = useAnimationGeneratorStore((s) => s.setIsPlaying);
  const replay = useAnimationGeneratorStore((s) => s.replay);
  const setColorIndex = useAnimationGeneratorStore((s) => s.setColorIndex);
  const setTextColorIndex = useAnimationGeneratorStore((s) => s.setTextColorIndex);
  const setTextFontSize = useAnimationGeneratorStore((s) => s.setTextFontSize);
  const getTimingValue = useAnimationGeneratorStore((s) => s.getTimingValue);
  const getIterationValue = useAnimationGeneratorStore((s) => s.getIterationValue);

  const kebabName = toKebab(animationType);
  const activeColorIndex = previewMode === 'text' ? textColorIndex : colorIndex;
  const activeColor = COLOR_SWATCHES[activeColorIndex];
  const timingValue = getTimingValue();
  const iterationValue = getIterationValue();
  const dirVars = getDirectionCssVars(textDirection);

  const segments = useMemo(
    () => splitTextForAnimation(previewText || ' ', textSegmentMode),
    [previewText, textSegmentMode]
  );

  useEffect(() => {
    bumpPlayKey();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    previewMode,
    animationType,
    textAnimationType,
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
    previewText,
    textFontSize,
    textFontWeight,
    textColorIndex,
    textLetterSpacing,
    textSegmentMode,
    textPhase,
    textDirection,
    textStagger,
  ]);

  const motionLabel =
    previewMode === 'text' ? TEXT_ANIMATIONS[textAnimationType].label : ANIMATIONS[animationType].label;

  const enterName = buildTextKeyframeName(textAnimationType, 'enter');
  const exitName = buildTextKeyframeName(textAnimationType, 'exit');

  const getUnitAnimation = (unitIndex: number) => {
    const unitDelay = delay + Math.max(0, unitIndex) * textStagger;
    if (textPhase === 'both') {
      return {
        animationName: `${enterName}, ${exitName}`,
        animationDuration: `${duration}s, ${duration}s`,
        animationDelay: `${unitDelay}s, ${unitDelay + duration + 0.45}s`,
      };
    }
    return {
      animationName: textPhase === 'exit' ? exitName : enterName,
      animationDuration: `${duration}s`,
      animationDelay: `${unitDelay}s`,
    };
  };

  const setActiveColor = (index: number) => {
    if (previewMode === 'text') setTextColorIndex(index);
    else setColorIndex(index);
  };

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
        <div className="flex min-h-0 flex-1 flex-col items-center justify-center gap-5 p-6 lg:p-10">
          {/* Canvas chrome: colour + size live on the stage */}
          <div className="flex w-full max-w-2xl flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              {COLOR_SWATCHES.map((c, i) => (
                <button
                  key={c.name}
                  type="button"
                  title={c.name}
                  onClick={() => setActiveColor(i)}
                  className={cn(
                    'size-7 rounded-full ring-offset-2 ring-offset-background transition-all',
                    activeColorIndex === i ? 'ring-2 ring-foreground' : 'ring-1 ring-border hover:ring-foreground/40'
                  )}
                  style={{ backgroundColor: c.value }}
                />
              ))}
            </div>

            {previewMode === 'text' && (
              <div className="flex min-w-40 flex-1 items-center gap-2 sm:max-w-56">
                <span className="shrink-0 text-[11px] text-muted-foreground">Size</span>
                <Slider
                  value={[textFontSize]}
                  min={20}
                  max={96}
                  step={2}
                  onValueChange={(v) => setTextFontSize(parseSliderValue(v))}
                />
                <span className="w-8 shrink-0 text-right font-mono text-[11px] text-muted-foreground">
                  {textFontSize}
                </span>
              </div>
            )}
          </div>

          <div
            className="relative flex h-64 w-full max-w-2xl items-center justify-center overflow-hidden border border-dashed border-border bg-background/40 md:h-72"
            style={{ perspective: '800px' }}
          >
            {previewMode === 'shape' ? (
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
            ) : (
              <div
                key={playKey}
                className="max-w-[90%] px-4 text-center leading-tight"
                style={
                  {
                    ...dirVars,
                    color: activeColor.value,
                    fontSize: `${textFontSize}px`,
                    fontWeight: textFontWeight,
                    letterSpacing: `${textLetterSpacing}px`,
                    textShadow:
                      textAnimationType === 'neon' ? `0 0 18px ${activeColor.glow}` : `0 8px 28px ${activeColor.glow}`,
                  } as CSSProperties
                }
              >
                {segments.map((seg, i) => {
                  if (seg.isSpace) {
                    return (
                      <span key={`sp-${i}`} style={{ whiteSpace: 'pre' }}>
                        {seg.text}
                      </span>
                    );
                  }

                  const unitAnim = getUnitAnimation(seg.index);
                  const burst = getBurstOffset(Math.max(0, seg.index));
                  const scrapRot = getScrapRotation(Math.max(0, seg.index));

                  return (
                    <span
                      key={`u-${i}-${seg.index}`}
                      style={{
                        display: 'inline-block',
                        whiteSpace: 'pre',
                        transformOrigin: 'center bottom',
                        ['--burst-x' as string]: burst.x,
                        ['--burst-y' as string]: burst.y,
                        ['--scrap-rot' as string]: scrapRot,
                        animationName: unitAnim.animationName,
                        animationDuration: unitAnim.animationDuration,
                        animationDelay: unitAnim.animationDelay,
                        animationTimingFunction: timingValue,
                        animationIterationCount: iterationValue,
                        animationDirection: direction,
                        animationFillMode: fillMode,
                        animationPlayState: isPlaying ? 'running' : 'paused',
                      }}
                    >
                      {seg.text}
                    </span>
                  );
                })}
              </div>
            )}
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

      <div className="pointer-events-none absolute bottom-3 left-1/2 max-w-[min(100%-1.5rem,36rem)] -translate-x-1/2">
        <span className="block truncate rounded-none border border-border bg-background/90 px-2 py-1 font-mono text-[11px] text-muted-foreground shadow-sm backdrop-blur-sm">
          {previewMode === 'text' ? 'Text' : 'Shape'} · {motionLabel}
          {previewMode === 'text' && !TEXT_ANIMATIONS[textAnimationType].controls.continuous ? ` · ${textPhase}` : ''}
          {isPlaying ? ' · playing' : ' · paused'}
        </span>
      </div>
    </div>
  );
}
