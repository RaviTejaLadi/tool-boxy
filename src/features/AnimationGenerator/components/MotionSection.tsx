import { cn } from '@/lib/utils';
import { ANIMATIONS, type AnimationType } from '../constants';
import { useAnimationGeneratorStore } from '../stores';
import { SectionHeading } from './SectionHeading';

export function MotionSection() {
  const animationType = useAnimationGeneratorStore((s) => s.animationType);
  const selectAnimationType = useAnimationGeneratorStore((s) => s.selectAnimationType);

  return (
    <section>
      <SectionHeading className="mb-3">Motion</SectionHeading>
      <div className="grid grid-cols-3 gap-2">
        {(Object.entries(ANIMATIONS) as [AnimationType, (typeof ANIMATIONS)[AnimationType]][]).map(([key, val]) => {
          const Icon = val.icon;
          const active = key === animationType;
          return (
            <button
              key={key}
              type="button"
              onClick={() => selectAnimationType(key)}
              className={cn(
                'flex flex-col items-center gap-1.5 border px-2 py-2.5 text-[10px] leading-tight transition-colors',
                active
                  ? 'border-primary bg-primary/10 text-primary'
                  : 'border-border bg-muted/30 text-muted-foreground hover:border-muted-foreground/40 hover:text-foreground'
              )}
            >
              <Icon className="size-4 shrink-0" />
              {val.label}
            </button>
          );
        })}
      </div>
      <p className="mt-2 text-xs text-muted-foreground">Picking a motion loads recommended timing — fine-tune below.</p>
    </section>
  );
}
