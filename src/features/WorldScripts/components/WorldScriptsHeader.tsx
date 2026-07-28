import { Languages, Shuffle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { selectFilteredLanguages, useWorldScriptsStore } from '../stores';

export function WorldScriptsHeader() {
  const browseScript = useWorldScriptsStore((s) => s.browseScript);
  const browseKind = useWorldScriptsStore((s) => s.browseKind);
  const browseDirection = useWorldScriptsStore((s) => s.browseDirection);
  const pickRandomLanguage = useWorldScriptsStore((s) => s.pickRandomLanguage);

  const pool = selectFilteredLanguages({ browseScript, browseKind, browseDirection });
  const scriptCount = new Set(pool.map((l) => l.script)).size;

  return (
    <header className="flex shrink-0 flex-wrap items-center justify-between gap-3 border-b border-border px-6 py-3">
      <div className="flex items-center gap-2.5">
        <div className="flex size-7 items-center justify-center bg-primary text-primary-foreground">
          <Languages className="size-4" />
        </div>
        <div>
          <div className="font-heading text-sm leading-none font-semibold">World Scripts</div>
          <div className="mt-1 font-mono text-[11px] leading-none text-muted-foreground">
            Alphabets, abugidas, syllabaries &amp; logographic samples
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <span className="font-mono text-[11px] text-muted-foreground tabular-nums">
          {pool.length} languages · {scriptCount} scripts
        </span>
        <Button type="button" variant="outline" size="sm" className="rounded-none" onClick={() => pickRandomLanguage()}>
          <Shuffle data-icon="inline-start" />
          Explore
        </Button>
      </div>
    </header>
  );
}
