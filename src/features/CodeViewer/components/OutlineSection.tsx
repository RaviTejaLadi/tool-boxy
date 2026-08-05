import { useMemo } from 'react';
import { extractOutline } from '../helpers';
import { useCodeViewerStore } from '../stores';
import { SectionHeading } from './SectionHeading';

export function OutlineSection() {
  const selectedFile = useCodeViewerStore((s) => s.selectedFile);
  const selectFile = useCodeViewerStore((s) => s.selectFile);
  const symbols = useMemo(() => extractOutline(selectedFile), [selectedFile]);

  if (!selectedFile || (selectedFile.kind !== 'text' && selectedFile.kind !== 'svg')) return null;

  return (
    <section className="space-y-3">
      <SectionHeading>Outline</SectionHeading>
      {symbols.length === 0 ? (
        <p className="font-mono text-[11px] text-muted-foreground">No symbols detected in this file</p>
      ) : (
        <div className="max-h-48 space-y-0.5 overflow-auto border border-border bg-muted/20 p-1">
          {symbols.map((symbol) => (
            <button
              key={`${symbol.kind}:${symbol.name}:${symbol.line}`}
              type="button"
              onClick={() => selectFile(selectedFile, symbol.line)}
              className="flex w-full items-center gap-2 px-2 py-1 text-left font-mono text-[11px] hover:bg-accent/50"
            >
              <span className="w-14 shrink-0 text-[10px] uppercase text-muted-foreground">{symbol.kind}</span>
              <span className="truncate">{symbol.name}</span>
              <span className="ml-auto text-muted-foreground">{symbol.line}</span>
            </button>
          ))}
        </div>
      )}
    </section>
  );
}
