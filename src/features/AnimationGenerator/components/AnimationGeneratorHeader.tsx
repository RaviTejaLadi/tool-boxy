import { Check, Copy, RotateCcw, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAnimationGeneratorStore } from '../stores';

export function AnimationGeneratorHeader() {
  const copied = useAnimationGeneratorStore((s) => s.copied);
  const copyCode = useAnimationGeneratorStore((s) => s.copyCode);
  const resetAll = useAnimationGeneratorStore((s) => s.resetAll);

  return (
    <header className="flex shrink-0 items-center justify-between border-b border-border px-6 py-3">
      <div className="flex items-center gap-2.5">
        <div className="flex size-7 items-center justify-center bg-primary text-primary-foreground">
          <Sparkles className="size-4" />
        </div>
        <div>
          <div className="font-heading text-sm leading-none font-semibold">Animation Generator</div>
          <div className="mt-1 font-mono text-[11px] leading-none text-muted-foreground">
            Design keyframe animations and copy CSS
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <Button variant="outline" size="sm" onClick={resetAll}>
          <RotateCcw data-icon="inline-start" />
          Reset
        </Button>
        <Button size="sm" onClick={() => void copyCode()}>
          {copied ? <Check data-icon="inline-start" /> : <Copy data-icon="inline-start" />}
          {copied ? 'Copied' : 'Copy code'}
        </Button>
      </div>
    </header>
  );
}
