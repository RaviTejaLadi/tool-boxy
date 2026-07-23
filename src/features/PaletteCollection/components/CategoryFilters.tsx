import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { CATEGORIES } from '../constants';
import { useFilterStore, type ActiveCategory } from '../stores';

function CategoryPill({ label, active, onClick }: { label: string; active: boolean; onClick: () => void }) {
  return (
    <Button
      type="button"
      size="sm"
      variant={active ? 'default' : 'outline'}
      aria-pressed={active}
      onClick={onClick}
      className={cn('rounded-none', !active && 'bg-card text-foreground hover:bg-muted')}
    >
      {label}
    </Button>
  );
}

export function CategoryFilters() {
  const activeCategory = useFilterStore((s) => s.activeCategory);
  const setActiveCategory = useFilterStore((s) => s.setActiveCategory);

  const select = (category: ActiveCategory) => () => setActiveCategory(category);

  return (
    <div className="flex flex-wrap gap-2">
      <CategoryPill label="All" active={activeCategory === 'All'} onClick={select('All')} />
      {CATEGORIES.map((cat) => (
        <CategoryPill key={cat} label={cat} active={activeCategory === cat} onClick={select(cat)} />
      ))}
    </div>
  );
}
