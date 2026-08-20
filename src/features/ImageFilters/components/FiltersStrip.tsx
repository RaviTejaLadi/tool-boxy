import { useState } from 'react';
import { ChevronDown, ChevronUp, Filter } from 'lucide-react';
import { FILTER_CATEGORIES, getFilterById, getFiltersByCategory, type FilterCategoryId } from '../constants';
import { useFilterStore } from '../stores';

const CATEGORY_TABS: { id: FilterCategoryId | 'all'; label: string }[] = [
  { id: 'all', label: 'All' },
  ...FILTER_CATEGORIES,
];

export function FiltersStrip() {
  const source = useFilterStore((s) => s.source);
  const selectedFilterId = useFilterStore((s) => s.selectedFilterId);
  const categoryId = useFilterStore((s) => s.categoryId);
  const setSelectedFilterId = useFilterStore((s) => s.setSelectedFilterId);
  const setCategoryId = useFilterStore((s) => s.setCategoryId);

  const [expanded, setExpanded] = useState(true);

  const filters = getFiltersByCategory(categoryId);
  const selectedFilter = getFilterById(selectedFilterId);

  if (!source) return null;

  return (
    <div
      className={`flex min-h-0 shrink-0 flex-col border-t border-border bg-background/80 backdrop-blur-sm ${
        expanded ? 'max-h-[40%]' : ''
      }`}
    >
      <button
        type="button"
        onClick={() => setExpanded((value) => !value)}
        aria-expanded={expanded}
        className="flex shrink-0 items-center justify-between gap-3 px-4 py-2.5 text-left transition-colors hover:bg-muted/40"
      >
        <div className="flex min-w-0 items-center gap-2">
          <Filter className="size-3.5 shrink-0 text-muted-foreground" />
          <span className="font-mono text-[11px] tracking-wide text-primary uppercase">Filters</span>
          <span className="truncate font-mono text-[11px] text-muted-foreground">
            {selectedFilter.name}
            {!expanded ? ` · ${filters.length}` : ''}
          </span>
        </div>
        {expanded ? (
          <ChevronDown className="size-4 shrink-0 text-muted-foreground" />
        ) : (
          <ChevronUp className="size-4 shrink-0 text-muted-foreground" />
        )}
      </button>

      {expanded && (
        <div className="flex min-h-0 flex-1 flex-col space-y-2 px-4 pt-0 pb-3">
          <div className="flex shrink-0 flex-wrap items-center gap-1.5">
            {CATEGORY_TABS.map((tab) => {
              const isActive = categoryId === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setCategoryId(tab.id)}
                  className={`border px-2 py-0.5 font-mono text-[10px] tracking-wide whitespace-nowrap transition-colors ${
                    isActive
                      ? 'border-primary bg-primary text-primary-foreground'
                      : 'border-border bg-background text-muted-foreground hover:border-primary/50 hover:text-foreground'
                  }`}
                >
                  {tab.label}
                </button>
              );
            })}
          </div>

          <div className="min-h-0 flex-1 overflow-x-hidden overflow-y-auto">
            <div className="grid grid-cols-[repeat(auto-fill,minmax(4.25rem,1fr))] gap-1.5">
              {filters.map((filter) => {
                const isSelected = selectedFilterId === filter.id;

                return (
                  <button
                    key={filter.id}
                    type="button"
                    onClick={() => setSelectedFilterId(filter.id)}
                    title={filter.description}
                    className={`border p-1 text-left transition-colors ${
                      isSelected
                        ? 'border-primary bg-primary/5'
                        : 'border-border bg-background hover:border-primary/50 hover:bg-muted/40'
                    }`}
                  >
                    <div className="aspect-square overflow-hidden border border-border bg-muted/40">
                      <img
                        src={source.dataUrl}
                        alt=""
                        aria-hidden
                        className="size-full object-cover"
                        style={{ filter: filter.css || 'none' }}
                      />
                    </div>
                    <p className="mt-1 truncate text-center font-mono text-[9px] leading-tight text-foreground">
                      {filter.name}
                    </p>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
