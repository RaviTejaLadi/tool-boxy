import { useEffect, useMemo, useState } from 'react';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { cn } from '@/lib/utils';
import { scanFindings, type FindingKind } from '../helpers';
import { useCodeViewerStore } from '../stores';
import { SectionHeading } from './SectionHeading';

const KIND_ORDER: FindingKind[] = ['SECRET', 'BUG', 'FIXME', 'HACK', 'TODO', 'NOTE'];

const KIND_CLASS: Record<FindingKind, string> = {
  SECRET: 'text-destructive',
  BUG: 'text-red-500',
  FIXME: 'text-orange-500',
  HACK: 'text-amber-500',
  TODO: 'text-sky-500',
  NOTE: 'text-muted-foreground',
};

export function FindingsSection() {
  const fileSystem = useCodeViewerStore((s) => s.fileSystem);
  const openPathAtLine = useCodeViewerStore((s) => s.openPathAtLine);
  const findings = useMemo(() => scanFindings(fileSystem), [fileSystem]);

  const tabs = useMemo(() => {
    const map = new Map<FindingKind, number>();
    for (const f of findings) map.set(f.kind, (map.get(f.kind) ?? 0) + 1);
    return KIND_ORDER.filter((kind) => map.has(kind)).map((kind) => ({
      kind,
      count: map.get(kind) ?? 0,
    }));
  }, [findings]);

  const [activeKind, setActiveKind] = useState<FindingKind | null>(null);

  useEffect(() => {
    if (tabs.length === 0) {
      setActiveKind(null);
      return;
    }
    if (!activeKind || !tabs.some((tab) => tab.kind === activeKind)) {
      setActiveKind(tabs[0].kind);
    }
  }, [tabs, activeKind]);

  const visible = useMemo(
    () => (activeKind ? findings.filter((f) => f.kind === activeKind) : []),
    [findings, activeKind]
  );

  return (
    <section className="space-y-3">
      <SectionHeading>Findings</SectionHeading>
      <p className="font-mono text-[11px] leading-relaxed text-muted-foreground">
        Surface TODO debt and possible secrets without leaving the browser. Nothing is uploaded.
      </p>

      {tabs.length === 0 ? (
        <p className="font-mono text-[11px] text-muted-foreground">No TODOs or secrets found</p>
      ) : (
        <>
          <ToggleGroup
            value={activeKind ? [activeKind] : []}
            onValueChange={(value) => {
              const next = value[0] as FindingKind | undefined;
              if (next) setActiveKind(next);
            }}
            variant="outline"
            size="sm"
            spacing={0}
            className="flex w-full flex-wrap"
          >
            {tabs.map(({ kind, count }) => (
              <ToggleGroupItem
                key={kind}
                value={kind}
                className={cn('rounded-none px-2 font-mono text-[10px]', KIND_CLASS[kind])}
              >
                {kind}
                <span className="ml-1 text-muted-foreground">{count}</span>
              </ToggleGroupItem>
            ))}
          </ToggleGroup>

          <div className="max-h-[45vh] space-y-1 overflow-auto border border-border bg-muted/20 p-1">
            <p className="px-2 py-1 font-mono text-[10px] text-muted-foreground">
              {activeKind} · {visible.length} item{visible.length === 1 ? '' : 's'}
            </p>
            {visible.map((finding) => (
              <button
                key={finding.id}
                type="button"
                onClick={() => openPathAtLine(finding.path, finding.line)}
                className="block w-full border border-transparent px-2 py-1.5 text-left transition-colors hover:border-border hover:bg-accent/50"
              >
                <div className="truncate font-mono text-[11px] text-primary">
                  {finding.name}
                  <span className="text-muted-foreground">:{finding.line}</span>
                </div>
                <div className="truncate font-mono text-[10px] text-foreground/80">{finding.preview}</div>
              </button>
            ))}
          </div>
        </>
      )}
    </section>
  );
}
