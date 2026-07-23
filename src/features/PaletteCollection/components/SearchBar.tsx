import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { useFilterStore } from '../stores';

export function SearchBar({ resultCount }: { resultCount: number }) {
  const query = useFilterStore((s) => s.query);
  const setQuery = useFilterStore((s) => s.setQuery);

  return (
    <div className="flex items-center gap-3 border border-border bg-card px-4 py-2">
      <Search className="size-4 shrink-0 text-muted-foreground" />
      <Input
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search palettes..."
        className="border-0 bg-inherit! px-0 shadow-none focus-visible:ring-0"
      />
      <span className="shrink-0 whitespace-nowrap font-mono text-[11px] text-muted-foreground">
        {resultCount} palette{resultCount === 1 ? '' : 's'}
      </span>
    </div>
  );
}
