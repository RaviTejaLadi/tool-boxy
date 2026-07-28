import { useWordCounterStore } from '../stores';
import { SectionHeading } from './SectionHeading';

const PRIMARY_STATS = [
  { key: 'words', label: 'Words' },
  { key: 'characters', label: 'Characters' },
  { key: 'sentences', label: 'Sentences' },
  { key: 'paragraphs', label: 'Paragraphs' },
] as const;

const SECONDARY_STATS = [
  { key: 'charactersNoSpaces', label: 'No spaces' },
  { key: 'lines', label: 'Lines' },
  { key: 'readingTime', label: 'Reading', suffix: ' min' },
  { key: 'speakingTime', label: 'Speaking', suffix: ' min' },
] as const;

export function StatsSection() {
  const stats = useWordCounterStore((s) => s.stats);

  return (
    <section className="space-y-4">
      <SectionHeading className="mb-3">Statistics</SectionHeading>

      <div className="grid grid-cols-2 gap-2">
        {PRIMARY_STATS.map(({ key, label }) => (
          <div key={key} className="border border-border bg-muted/40 px-3 py-3 text-center">
            <div className="font-mono text-xl font-semibold tabular-nums">{stats[key]}</div>
            <div className="mt-1 font-mono text-[10px] tracking-wide text-muted-foreground uppercase">{label}</div>
          </div>
        ))}
      </div>

      <div className="space-y-1.5">
        {SECONDARY_STATS.map(({ key, label, ...rest }) => {
          const suffix = 'suffix' in rest ? rest.suffix : '';
          return (
            <div
              key={key}
              className="flex items-center justify-between border border-border bg-muted/30 px-3 py-2 font-mono text-xs"
            >
              <span className="text-muted-foreground">{label}</span>
              <span className="font-medium tabular-nums">
                {stats[key]}
                {suffix}
              </span>
            </div>
          );
        })}
      </div>
    </section>
  );
}
