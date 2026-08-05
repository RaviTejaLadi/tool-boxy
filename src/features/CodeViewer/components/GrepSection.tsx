import { useMemo } from 'react';
import { MagnifyingGlassIcon } from '@phosphor-icons/react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { grepFiles } from '../helpers';
import { useCodeViewerStore } from '../stores';
import { SectionHeading } from './SectionHeading';

export function GrepSection() {
  const fileSystem = useCodeViewerStore((s) => s.fileSystem);
  const grepQuery = useCodeViewerStore((s) => s.grepQuery);
  const grepCaseSensitive = useCodeViewerStore((s) => s.grepCaseSensitive);
  const setGrepQuery = useCodeViewerStore((s) => s.setGrepQuery);
  const setGrepCaseSensitive = useCodeViewerStore((s) => s.setGrepCaseSensitive);
  const openPathAtLine = useCodeViewerStore((s) => s.openPathAtLine);

  const hits = useMemo(
    () => grepFiles(fileSystem, grepQuery, { caseSensitive: grepCaseSensitive }),
    [fileSystem, grepQuery, grepCaseSensitive]
  );

  return (
    <section className="space-y-3">
      <SectionHeading>Content search</SectionHeading>
      <p className="font-mono text-[11px] leading-relaxed text-muted-foreground">
        Grep across every text file in the uploaded folder — jump straight to the match.
      </p>

      <div className="relative">
        <MagnifyingGlassIcon className="pointer-events-none absolute top-1/2 left-2.5 size-3.5 -translate-y-1/2 text-muted-foreground" />
        <Input
          value={grepQuery}
          onChange={(e) => setGrepQuery(e.target.value)}
          placeholder="Search in files…"
          className="h-8 rounded-none pl-8 font-mono text-[12px]"
        />
      </div>

      <div className="flex items-center justify-between gap-3">
        <Label htmlFor="grep-case" className="font-mono text-[11px] text-muted-foreground">
          Case sensitive
        </Label>
        <Switch id="grep-case" checked={grepCaseSensitive} onCheckedChange={setGrepCaseSensitive} />
      </div>

      {!grepQuery.trim() ? (
        <p className="font-mono text-[11px] text-muted-foreground">Type a query to search file contents</p>
      ) : hits.length === 0 ? (
        <p className="font-mono text-[11px] text-muted-foreground">No matches</p>
      ) : (
        <div className="max-h-[45vh] space-y-1 overflow-auto border border-border bg-muted/20 p-1">
          <p className="px-2 py-1 font-mono text-[10px] text-muted-foreground">
            {hits.length}
            {hits.length >= 200 ? '+' : ''} matches
          </p>
          {hits.map((hit) => (
            <button
              key={`${hit.path}:${hit.line}:${hit.preview}`}
              type="button"
              onClick={() => openPathAtLine(hit.path, hit.line)}
              className="block w-full border border-transparent px-2 py-1.5 text-left transition-colors hover:border-border hover:bg-accent/50"
            >
              <div className="truncate font-mono text-[11px] text-primary">
                {hit.name}
                <span className="text-muted-foreground">:{hit.line}</span>
              </div>
              <div className="truncate font-mono text-[10px] text-muted-foreground">{hit.preview || ' '}</div>
            </button>
          ))}
        </div>
      )}
    </section>
  );
}
