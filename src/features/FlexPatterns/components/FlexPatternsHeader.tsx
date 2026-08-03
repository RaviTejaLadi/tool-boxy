import { LayoutGrid, Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { FLEX_PATTERNS } from '../constants';
import { useFlexPatternsStore } from '../stores';

export function FlexPatternsHeader() {
  const searchQuery = useFlexPatternsStore((s) => s.searchQuery);
  const setSearchQuery = useFlexPatternsStore((s) => s.setSearchQuery);

  return (
    <header className="shrink-0 space-y-4 border-b border-border px-4 py-4 lg:px-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <div className="flex size-9 shrink-0 items-center justify-center bg-primary text-primary-foreground">
            <LayoutGrid className="size-4" />
          </div>
          <div>
            <h1 className="font-heading text-base leading-none font-semibold">Flex Patterns</h1>
            <p className="mt-1.5 text-sm text-muted-foreground">
              {FLEX_PATTERNS.length} real-world flex layouts — click any pattern to preview and copy code
            </p>
          </div>
        </div>
        <div className="relative w-full sm:max-w-xs">
          <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search patterns…"
            className="h-9 rounded-none pl-9 font-mono text-sm"
          />
        </div>
      </div>
    </header>
  );
}
