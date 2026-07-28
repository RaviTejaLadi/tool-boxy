import { ChevronLeft, ChevronRight, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useGlyphBrowserStore } from '../stores';

export function PreviewToolbar() {
  const query = useGlyphBrowserStore((s) => s.query);
  const setQuery = useGlyphBrowserStore((s) => s.setQuery);
  const stepBlock = useGlyphBrowserStore((s) => s.stepBlock);

  return (
    <div className="flex flex-col gap-2 border-b border-border px-5 py-3 sm:flex-row sm:items-center">
      <div className="relative min-w-0 flex-1">
        <Search className="pointer-events-none absolute top-1/2 left-2.5 size-3.5 -translate-y-1/2 text-muted-foreground" />
        <Input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Filter glyphs (char, U+0041, 0x41…)"
          className="h-8 rounded-none pl-8 font-mono text-xs"
        />
      </div>
      <div className="flex shrink-0 items-center gap-1 self-end sm:self-auto">
        <Button
          type="button"
          variant="outline"
          size="icon"
          className="size-8 rounded-none"
          onClick={() => stepBlock(-1)}
          aria-label="Previous block"
        >
          <ChevronLeft className="size-4" />
        </Button>
        <Button
          type="button"
          variant="outline"
          size="icon"
          className="size-8 rounded-none"
          onClick={() => stepBlock(1)}
          aria-label="Next block"
        >
          <ChevronRight className="size-4" />
        </Button>
      </div>
    </div>
  );
}
