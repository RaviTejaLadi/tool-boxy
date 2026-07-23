// @ts-nocheck — typed gradually
import { Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';
import { BACKGROUNDS } from '../constants';
import { useBackgroundStore } from '../stores';
import { SectionHeading } from './SectionHeading';

function backgroundStyle(background) {
  if (background.type === 'gradient') {
    return {
      backgroundImage: `linear-gradient(135deg, ${background.stops[0].color}, ${background.stops[1].color})`,
    };
  }
  if (background.type === 'solid') {
    return { backgroundColor: background.color };
  }
  return {
    backgroundImage:
      'repeating-conic-gradient(color-mix(in oklab, var(--muted-foreground) 40%, transparent) 0% 25%, transparent 0% 50%)',
    backgroundSize: '8px 8px',
  };
}

export function BackgroundSection() {
  const bgId = useBackgroundStore((s) => s.bgId);
  const customColor = useBackgroundStore((s) => s.customColor);
  const setBgId = useBackgroundStore((s) => s.setBgId);
  const setCustomColor = useBackgroundStore((s) => s.setCustomColor);

  return (
    <section>
      <SectionHeading className="mb-3">Background</SectionHeading>
      <div className="flex flex-wrap gap-1.5">
        {BACKGROUNDS.map((background) => (
          <Button
            key={background.id}
            type="button"
            variant="outline"
            title={background.label}
            onClick={() => setBgId(background.id)}
            className={cn(
              'size-8 shrink-0  border p-0 transition-all',
              bgId === background.id ? 'border-primary ring-1 ring-primary' : 'border-border hover:border-ring'
            )}
            style={backgroundStyle(background)}
          />
        ))}
        <Label
          title="Custom color"
          className={cn(
            'relative size-8 shrink-0 cursor-pointer overflow-hidden  border transition-all',
            bgId === 'custom' ? 'border-primary ring-1 ring-primary' : 'border-border hover:border-ring'
          )}
          style={{ backgroundColor: customColor }}
        >
          <Input
            type="color"
            value={customColor}
            onChange={(e) => {
              setCustomColor(e.target.value);
              setBgId('custom');
            }}
            className="absolute inset-0 size-full cursor-pointer opacity-0"
          />
          <Sparkles className="pointer-events-none absolute right-0.5 bottom-0.5 size-2.5 text-white/80 drop-shadow" />
        </Label>
      </div>
    </section>
  );
}
