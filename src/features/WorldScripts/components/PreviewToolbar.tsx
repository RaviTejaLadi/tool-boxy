import { ChevronLeft, ChevronRight, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { selectFilteredLanguages, useWorldScriptsStore } from '../stores';

export function PreviewToolbar() {
  const symbolQuery = useWorldScriptsStore((s) => s.symbolQuery);
  const setSymbolQuery = useWorldScriptsStore((s) => s.setSymbolQuery);
  const stepLanguage = useWorldScriptsStore((s) => s.stepLanguage);
  const browseScript = useWorldScriptsStore((s) => s.browseScript);
  const browseKind = useWorldScriptsStore((s) => s.browseKind);
  const browseDirection = useWorldScriptsStore((s) => s.browseDirection);

  const poolSize = selectFilteredLanguages({ browseScript, browseKind, browseDirection }).length;

  return (
    <div className="flex flex-col gap-2 border-b border-border px-5 py-3 sm:flex-row sm:items-center">
      <div className="relative min-w-0 flex-1">
        <Search className="pointer-events-none absolute top-1/2 left-2.5 size-3.5 -translate-y-1/2 text-muted-foreground" />
        <Input
          value={symbolQuery}
          onChange={(e) => setSymbolQuery(e.target.value)}
          placeholder="Filter symbols (char, U+0531, decimal…)"
          className="h-8 rounded-none pl-8 font-mono text-xs"
        />
      </div>
      <div className="flex shrink-0 items-center gap-1 self-end sm:self-auto">
        <Button
          type="button"
          variant="outline"
          size="icon"
          className="size-8 rounded-none"
          onClick={() => stepLanguage(-1)}
          disabled={poolSize <= 1}
          aria-label="Previous language"
        >
          <ChevronLeft className="size-4" />
        </Button>
        <Button
          type="button"
          variant="outline"
          size="icon"
          className="size-8 rounded-none"
          onClick={() => stepLanguage(1)}
          disabled={poolSize <= 1}
          aria-label="Next language"
        >
          <ChevronRight className="size-4" />
        </Button>
      </div>
    </div>
  );
}
