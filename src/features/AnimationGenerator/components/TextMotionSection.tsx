import { cn } from '@/lib/utils';
import { TEXT_ANIMATION_CATEGORIES, TEXT_ANIMATION_ORDER, TEXT_ANIMATIONS, type TextAnimationType } from '../constants';
import { useAnimationGeneratorStore } from '../stores';
import { SectionHeading } from './SectionHeading';

export function TextMotionSection() {
  const textAnimationType = useAnimationGeneratorStore((s) => s.textAnimationType);
  const textCategoryFilter = useAnimationGeneratorStore((s) => s.textCategoryFilter);
  const selectTextAnimationType = useAnimationGeneratorStore((s) => s.selectTextAnimationType);
  const setTextCategoryFilter = useAnimationGeneratorStore((s) => s.setTextCategoryFilter);

  const filtered = TEXT_ANIMATION_ORDER.filter((key) => {
    if (textCategoryFilter === 'all') return true;
    return TEXT_ANIMATIONS[key].category === textCategoryFilter;
  });

  return (
    <section className="space-y-3">
      <SectionHeading>Animations</SectionHeading>

      <div className="flex flex-wrap gap-1">
        <FilterChip active={textCategoryFilter === 'all'} onClick={() => setTextCategoryFilter('all')} label="All" />
        {TEXT_ANIMATION_CATEGORIES.map((cat) => (
          <FilterChip
            key={cat.id}
            active={textCategoryFilter === cat.id}
            onClick={() => setTextCategoryFilter(cat.id)}
            label={cat.label}
          />
        ))}
      </div>

      <div className="grid grid-cols-3 gap-1.5">
        {filtered.map((key) => {
          const val = TEXT_ANIMATIONS[key];
          const Icon = val.icon;
          const active = key === textAnimationType;
          return (
            <button
              key={key}
              type="button"
              title={val.description}
              onClick={() => selectTextAnimationType(key as TextAnimationType)}
              className={cn(
                'flex flex-col items-center gap-1 border px-1.5 py-2 text-[10px] leading-tight transition-colors',
                active
                  ? 'border-primary bg-primary/10 text-primary'
                  : 'border-border bg-muted/30 text-muted-foreground hover:border-muted-foreground/40 hover:text-foreground'
              )}
            >
              <Icon className="size-3.5 shrink-0" />
              {val.label}
            </button>
          );
        })}
      </div>
    </section>
  );
}

function FilterChip({ active, onClick, label }: { active: boolean; onClick: () => void; label: string }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'border px-2.5 py-1 text-[11px] transition-colors',
        active
          ? 'border-primary bg-primary/10 text-primary'
          : 'border-border bg-muted/20 text-muted-foreground hover:text-foreground'
      )}
    >
      {label}
    </button>
  );
}
