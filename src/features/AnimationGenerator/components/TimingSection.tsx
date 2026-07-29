import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { parseSliderValue } from '@/lib/utils';
import { DIRECTION_OPTIONS, FILL_OPTIONS, ITERATION_OPTIONS, TIMING_PRESETS } from '../constants';
import { useAnimationGeneratorStore } from '../stores';
import { SectionHeading } from './SectionHeading';

export function TimingSection() {
  const duration = useAnimationGeneratorStore((s) => s.duration);
  const delay = useAnimationGeneratorStore((s) => s.delay);
  const timingFunction = useAnimationGeneratorStore((s) => s.timingFunction);
  const bezier = useAnimationGeneratorStore((s) => s.bezier);
  const iterationCount = useAnimationGeneratorStore((s) => s.iterationCount);
  const iterationCustom = useAnimationGeneratorStore((s) => s.iterationCustom);
  const direction = useAnimationGeneratorStore((s) => s.direction);
  const fillMode = useAnimationGeneratorStore((s) => s.fillMode);
  const setDuration = useAnimationGeneratorStore((s) => s.setDuration);
  const setDelay = useAnimationGeneratorStore((s) => s.setDelay);
  const setTimingFunction = useAnimationGeneratorStore((s) => s.setTimingFunction);
  const setBezier = useAnimationGeneratorStore((s) => s.setBezier);
  const setIterationCount = useAnimationGeneratorStore((s) => s.setIterationCount);
  const setIterationCustom = useAnimationGeneratorStore((s) => s.setIterationCustom);
  const setDirection = useAnimationGeneratorStore((s) => s.setDirection);
  const setFillMode = useAnimationGeneratorStore((s) => s.setFillMode);

  return (
    <section className="space-y-4">
      <SectionHeading className="mb-3">Timing</SectionHeading>

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label className="text-xs text-muted-foreground">Duration</Label>
          <span className="font-mono text-xs">{duration.toFixed(2)}s</span>
        </div>
        <Slider
          value={[duration]}
          min={0.1}
          max={5}
          step={0.1}
          onValueChange={(v) => setDuration(parseSliderValue(v))}
        />
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label className="text-xs text-muted-foreground">Delay</Label>
          <span className="font-mono text-xs">{delay.toFixed(2)}s</span>
        </div>
        <Slider value={[delay]} min={0} max={3} step={0.1} onValueChange={(v) => setDelay(parseSliderValue(v))} />
      </div>

      <div className="space-y-2">
        <Label className="text-xs text-muted-foreground">Timing function</Label>
        <Select value={timingFunction} onValueChange={(v) => v && setTimingFunction(v)}>
          <SelectTrigger className="h-8">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {TIMING_PRESETS.map((t) => (
              <SelectItem key={t.value} value={t.value}>
                {t.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {timingFunction === 'custom' && (
          <div className="grid grid-cols-4 gap-2 pt-1">
            {(['x1', 'y1', 'x2', 'y2'] as const).map((k) => (
              <div key={k} className="space-y-1">
                <Label className="text-[10px] uppercase text-muted-foreground">{k}</Label>
                <Input
                  type="number"
                  step={0.01}
                  value={bezier[k]}
                  onChange={(e) => setBezier({ ...bezier, [k]: parseFloat(e.target.value) || 0 })}
                  className="h-8 font-mono text-xs"
                />
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-2">
          <Label className="text-xs text-muted-foreground">Iterations</Label>
          <Select value={iterationCount} onValueChange={(v) => v && setIterationCount(v)}>
            <SelectTrigger className="h-8">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {ITERATION_OPTIONS.map((opt) => (
                <SelectItem key={opt} value={opt}>
                  {opt === 'custom' ? 'Custom' : opt === 'infinite' ? 'Infinite' : opt}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {iterationCount === 'custom' && (
            <Input
              type="number"
              min={1}
              step={1}
              value={iterationCustom}
              onChange={(e) => setIterationCustom(Math.max(1, parseInt(e.target.value, 10) || 1))}
              className="h-8 font-mono text-xs"
            />
          )}
        </div>

        <div className="space-y-2">
          <Label className="text-xs text-muted-foreground">Direction</Label>
          <Select value={direction} onValueChange={(v) => v && setDirection(v)}>
            <SelectTrigger className="h-8">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {DIRECTION_OPTIONS.map((opt) => (
                <SelectItem key={opt} value={opt}>
                  {opt}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-2">
        <Label className="text-xs text-muted-foreground">Fill mode</Label>
        <Select value={fillMode} onValueChange={(v) => v && setFillMode(v)}>
          <SelectTrigger className="h-8">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {FILL_OPTIONS.map((opt) => (
              <SelectItem key={opt} value={opt}>
                {opt}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </section>
  );
}
