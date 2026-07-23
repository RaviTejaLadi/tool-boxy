import { useFilterStore } from '../stores';
import type { Palette } from '../constants';
import { PaletteCard } from './PaletteCard';

export function PaletteGrid({
  palettes,
  onSelectPalette,
}: {
  palettes: Palette[];
  onSelectPalette?: (palette: Palette) => void;
}) {
  const query = useFilterStore((s) => s.query);

  if (palettes.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center gap-1 border border-border bg-card py-16 text-center">
        <p className="text-sm font-medium">No palettes match &ldquo;{query}&rdquo;</p>
        <p className="font-mono text-[11px] text-muted-foreground">Try a different search term or category.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
      {palettes.map((palette) => (
        <PaletteCard key={palette.id} palette={palette} onSelect={() => onSelectPalette?.(palette)} />
      ))}
    </div>
  );
}
