import { useMemo } from 'react';
import { AlertCircle, Copy, Search } from 'lucide-react';
import { SyntaxHighlight } from '@/components/SyntaxHighlight';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { VIEW_TABS, type ViewMode } from '../constants';
import { filterJson, isEmptyJson, parseJson, prettifyJson } from '../helpers';
import { useJsonStore } from '../stores';
import { JsonTree } from './JsonTree';

export function PreviewPane() {
  const jsonCode = useJsonStore((s) => s.jsonCode);
  const error = useJsonStore((s) => s.error);
  const searchTerm = useJsonStore((s) => s.searchTerm);
  const expanded = useJsonStore((s) => s.expanded);
  const viewMode = useJsonStore((s) => s.viewMode);
  const setSearchTerm = useJsonStore((s) => s.setSearchTerm);
  const toggleExpanded = useJsonStore((s) => s.toggleExpanded);
  const setViewMode = useJsonStore((s) => s.setViewMode);

  const parsed = useMemo(() => (error ? null : parseJson(jsonCode)), [jsonCode, error]);
  const filtered = useMemo(
    () => (parsed === null ? null : searchTerm ? filterJson(parsed, searchTerm) : parsed),
    [parsed, searchTerm]
  );
  const empty = filtered === null || isEmptyJson(filtered);
  const rawText = useMemo(() => {
    if (empty || filtered === null) return 'No matching data found';
    try {
      return JSON.stringify(filtered, null, 2);
    } catch {
      return String(filtered);
    }
  }, [filtered, empty]);

  const copyActive = async () => {
    if (error || !jsonCode.trim()) return;
    const value = viewMode === 'raw' ? rawText : prettifyJson(jsonCode);
    if (value) await navigator.clipboard.writeText(value);
  };

  return (
    <section className="relative flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden bg-muted/40">
      <div className="flex shrink-0 items-center justify-between gap-2 border-b border-border px-3 py-2">
        <Tabs value={viewMode} onValueChange={(v) => setViewMode(v as ViewMode)} className="min-w-0 flex-1">
          <TabsList
            variant="line"
            className="h-8 max-w-full justify-start gap-0 overflow-x-auto overflow-y-hidden rounded-none p-0 scrollbar-none [&::-webkit-scrollbar]:hidden"
          >
            {VIEW_TABS.map((tab) => (
              <TabsTrigger
                key={tab.id}
                value={tab.id}
                className="h-8 flex-none rounded-none border-0 border-b-2 border-transparent px-3 py-0 font-mono text-[11px] text-muted-foreground after:hidden hover:text-foreground data-active:border-primary data-active:bg-primary/10 data-active:font-semibold data-active:text-primary data-active:shadow-none"
              >
                {tab.label}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
        <Button
          variant="outline"
          size="sm"
          className="shrink-0"
          onClick={toggleExpanded}
          disabled={!!error || viewMode !== 'tree'}
        >
          {expanded ? 'Collapse' : 'Expand'} All
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="size-8 shrink-0"
          onClick={copyActive}
          disabled={!!error || !jsonCode.trim()}
          aria-label="Copy output"
        >
          <Copy className="size-4" />
        </Button>
      </div>

      <div className="shrink-0 border-b border-border px-3 py-2">
        <div className="relative">
          <Search className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search JSON..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            disabled={!!error}
            className="rounded-none pl-9 font-mono text-[13px]"
          />
        </div>
      </div>

      <div className="flex min-h-0 flex-1 overflow-hidden">
        {error ? (
          <div className="m-auto flex max-w-md flex-col items-center gap-2 border border-destructive/40 bg-background/90 px-4 py-6 text-center text-destructive">
            <AlertCircle className="size-5" />
            <p className="font-mono text-[11px]">{error}</p>
          </div>
        ) : (
          <ScrollArea className="h-full w-full">
            <div className="p-4 lg:p-5">
              {empty ? (
                <div className="flex items-center justify-center py-16 font-mono text-[11px] text-muted-foreground">
                  No matching data found
                </div>
              ) : viewMode === 'tree' ? (
                <JsonTree key={String(expanded)} data={filtered} defaultExpanded={expanded} />
              ) : (
                <SyntaxHighlight
                  code={rawText}
                  language="json"
                  wrap
                  className="font-mono text-[13px] leading-6 text-foreground"
                />
              )}
            </div>
          </ScrollArea>
        )}
      </div>
    </section>
  );
}
