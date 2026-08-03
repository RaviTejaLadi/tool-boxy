import { useMemo } from 'react';
import { filterPatterns, useFlexPatternsStore } from '../stores';
import { PatternCard } from './PatternCard';

export function PatternGrid() {
  const activePatternId = useFlexPatternsStore((s) => s.activePatternId);
  const searchQuery = useFlexPatternsStore((s) => s.searchQuery);
  const selectPattern = useFlexPatternsStore((s) => s.selectPattern);

  const patterns = useMemo(() => filterPatterns(searchQuery), [searchQuery]);

  if (patterns.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center gap-1 border border-border bg-card py-16 text-center">
        <p className="text-sm font-medium">No patterns match your search</p>
        <p className="font-mono text-[11px] text-muted-foreground">Try a different keyword.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
      {patterns.map((pattern) => (
        <PatternCard
          key={pattern.id}
          pattern={pattern}
          active={activePatternId === pattern.id}
          onSelect={() => selectPattern(pattern.id)}
        />
      ))}
    </div>
  );
}
