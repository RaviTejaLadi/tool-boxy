// @ts-nocheck — typed gradually
import { Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';
import { GRADIENTS, SOLIDS } from '../constants';
import { useComposerStore } from '../stores';
import { SectionHeading } from './SectionHeading';

export function BackgroundSection() {
  const background = useComposerStore((s) => {
    const slide = s.slides.find((slide) => slide.id === s.activeSlideId);
    return slide?.background;
  });
  const setBackground = useComposerStore((s) => s.setBackground);

  if (!background) return null;

  const isSolidActive = (color) => background.type === 'color' && background.value === color;
  const isGradientActive = (gradient) => background.type === 'gradient' && background.value === gradient;

  return (
    <section>
      <SectionHeading className="mb-3">Background</SectionHeading>
      <p className="mb-3 text-xs text-muted-foreground">Set the background for the current slide.</p>
      <div className="space-y-4">
        <div>
          <p className="mb-2 font-mono text-[10px] tracking-wide text-muted-foreground uppercase">Solid colors</p>
          <div className="flex flex-wrap gap-1.5">
            {SOLIDS.map((color) => (
              <Button
                key={color}
                type="button"
                variant="outline"
                title={color}
                onClick={() => setBackground({ type: 'color', value: color })}
                className={cn(
                  'size-8 shrink-0 border p-0 transition-all',
                  isSolidActive(color) ? 'border-primary ring-1 ring-primary' : 'border-border hover:border-ring'
                )}
                style={{ backgroundColor: color }}
              />
            ))}
            <Label
              title="Custom color"
              className={cn(
                'relative size-8 shrink-0 cursor-pointer overflow-hidden border transition-all',
                background.type === 'color' && !SOLIDS.includes(background.value)
                  ? 'border-primary ring-1 ring-primary'
                  : 'border-border hover:border-ring'
              )}
              style={{
                backgroundColor:
                  background.type === 'color' && !SOLIDS.includes(background.value) ? background.value : '#888',
              }}
            >
              <Input
                type="color"
                value={background.type === 'color' ? background.value : '#888888'}
                onChange={(e) => setBackground({ type: 'color', value: e.target.value })}
                className="absolute inset-0 size-full cursor-pointer opacity-0"
              />
              <Sparkles className="pointer-events-none absolute right-0.5 bottom-0.5 size-2.5 text-white/80 drop-shadow" />
            </Label>
          </div>
        </div>
        <div>
          <p className="mb-2 font-mono text-[10px] tracking-wide text-muted-foreground uppercase">Gradients</p>
          <div className="flex flex-wrap gap-1.5">
            {GRADIENTS.map((gradient) => (
              <Button
                key={gradient}
                type="button"
                variant="outline"
                onClick={() => setBackground({ type: 'gradient', value: gradient })}
                className={cn(
                  'size-8 shrink-0 border p-0 transition-all',
                  isGradientActive(gradient) ? 'border-primary ring-1 ring-primary' : 'border-border hover:border-ring'
                )}
                style={{ backgroundImage: gradient }}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
