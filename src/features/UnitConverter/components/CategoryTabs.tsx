import { Database, Droplets, Gauge, Ruler, Square, Thermometer, Weight, type LucideIcon } from 'lucide-react';
import { CATEGORY_KEYS, UNIT_CATEGORIES, type CategoryKey } from '../constants';
import { useUnitConverterStore } from '../stores';
import { cn } from '@/lib/utils';

const CATEGORY_ICONS: Record<CategoryKey, LucideIcon> = {
  length: Ruler,
  weight: Weight,
  data: Database,
  temp: Thermometer,
  speed: Gauge,
  area: Square,
  volume: Droplets,
};

export function CategoryTabs() {
  const category = useUnitConverterStore((s) => s.category);
  const setCategory = useUnitConverterStore((s) => s.setCategory);

  return (
    <div className="overflow-x-auto border-b border-border">
      <div className="flex min-w-max">
        {CATEGORY_KEYS.map((key) => {
          const active = category === key;
          const Icon = CATEGORY_ICONS[key];
          return (
            <button
              key={key}
              type="button"
              onClick={() => setCategory(key as CategoryKey)}
              className={cn(
                'inline-flex items-center gap-1.5 border-r border-border px-4 py-2.5 font-mono text-xs tracking-wide transition-colors last:border-r-0 sm:px-5 sm:text-sm',
                active ? 'bg-muted text-foreground' : 'text-muted-foreground hover:bg-muted/50 hover:text-foreground'
              )}
            >
              <Icon className="size-3.5 shrink-0" />
              {UNIT_CATEGORIES[key].shortName}
            </button>
          );
        })}
      </div>
    </div>
  );
}
