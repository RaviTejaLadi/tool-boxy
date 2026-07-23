import { useMemo } from 'react';
import { cn } from '@/lib/utils';
import { PALETTES, type Palette } from './constants';
import { PaletteCollectionHeader, SearchBar, CategoryFilters, PaletteGrid } from './components';
import { useFilterStore } from './stores';

export type { Palette, PaletteCategory } from './constants';

export interface PaletteCollectionProps {
  palettes?: Palette[];
  onSelectPalette?: (palette: Palette) => void;
  className?: string;
}

export default function PaletteCollection({ palettes = PALETTES, onSelectPalette, className }: PaletteCollectionProps) {
  const query = useFilterStore((s) => s.query);
  const activeCategory = useFilterStore((s) => s.activeCategory);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return palettes.filter((p) => {
      const matchesQuery = q.length === 0 || p.name.toLowerCase().includes(q);
      const matchesCategory = activeCategory === 'All' || p.categories.includes(activeCategory);
      return matchesQuery && matchesCategory;
    });
  }, [palettes, query, activeCategory]);

  return (
    <div className={cn('flex h-full min-h-0 w-full flex-col bg-background text-foreground', className)}>
      <PaletteCollectionHeader />

      <div className="min-h-0 flex-1 overflow-y-auto">
        <div className="mx-auto flex max-w-6xl flex-col gap-4 px-4 py-6 sm:px-8">
          <SearchBar resultCount={filtered.length} />
          <CategoryFilters />
          <PaletteGrid palettes={filtered} onSelectPalette={onSelectPalette} />
        </div>
      </div>
    </div>
  );
}
