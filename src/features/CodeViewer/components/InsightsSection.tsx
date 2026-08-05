import { useMemo } from 'react';
import { computeInsights, formatBytes } from '../helpers';
import { useCodeViewerStore } from '../stores';
import { SectionHeading } from './SectionHeading';

export function InsightsSection() {
  const fileSystem = useCodeViewerStore((s) => s.fileSystem);
  const openPathAtLine = useCodeViewerStore((s) => s.openPathAtLine);
  const insights = useMemo(() => computeInsights(fileSystem), [fileSystem]);

  if (!insights) {
    return (
      <section>
        <SectionHeading className="mb-3">Insights</SectionHeading>
        <p className="font-mono text-[11px] text-muted-foreground">Upload a folder to see project DNA</p>
      </section>
    );
  }

  const maxLangLines = Math.max(...insights.languages.map((l) => l.lines), 1);

  return (
    <section className="space-y-5">
      <div>
        <SectionHeading className="mb-3">Project DNA</SectionHeading>
        <p className="mb-3 font-mono text-[11px] leading-relaxed text-muted-foreground">
          Instant audit of the uploaded tree — not an editor, a lens on the codebase.
        </p>
        <div className="grid grid-cols-2 gap-2">
          {[
            ['Files', String(insights.totalFiles)],
            ['Text', String(insights.textFiles)],
            ['Assets', String(insights.assetFiles)],
            ['Size', formatBytes(insights.totalBytes)],
            ['Lines', String(insights.totalLines)],
            ['Code', String(insights.codeLines)],
          ].map(([label, value]) => (
            <div key={label} className="border border-border bg-muted/30 px-2.5 py-2">
              <div className="font-mono text-[10px] text-muted-foreground">{label}</div>
              <div className="mt-0.5 font-heading text-sm font-semibold tabular-nums">{value}</div>
            </div>
          ))}
        </div>
      </div>

      <div>
        <SectionHeading className="mb-3">Languages</SectionHeading>
        <div className="space-y-2">
          {insights.languages.slice(0, 10).map((lang) => (
            <div key={lang.language}>
              <div className="mb-1 flex items-center justify-between font-mono text-[11px]">
                <span>{lang.language}</span>
                <span className="text-muted-foreground">
                  {lang.files}f · {lang.lines}l
                </span>
              </div>
              <div className="h-1.5 bg-muted">
                <div
                  className="h-full bg-primary"
                  style={{ width: `${Math.max(4, (lang.lines / maxLangLines) * 100)}%` }}
                />
              </div>
            </div>
          ))}
          {insights.languages.length === 0 && (
            <p className="font-mono text-[11px] text-muted-foreground">No text files analyzed</p>
          )}
        </div>
      </div>

      <div>
        <SectionHeading className="mb-3">Largest files</SectionHeading>
        <div className="space-y-1">
          {insights.largestFiles.map((file) => (
            <button
              key={file.path}
              type="button"
              onClick={() => openPathAtLine(file.path, 1)}
              className="flex w-full items-center justify-between gap-2 border border-transparent px-1 py-1 text-left font-mono text-[11px] hover:border-border hover:bg-accent/40"
            >
              <span className="truncate">{file.name}</span>
              <span className="shrink-0 text-muted-foreground">{formatBytes(file.bytes)}</span>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
