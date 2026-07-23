import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { Palette } from '../constants';

export function PaletteCard({ palette, onSelect }: { palette: Palette; onSelect: () => void }) {
  return (
    <div
      role="button"
      tabIndex={0}
      onClick={onSelect}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onSelect();
        }
      }}
      className="cursor-pointer overflow-hidden border border-border bg-card transition-colors hover:border-ring"
    >
      <div className="flex h-20 w-full">
        {palette.colors.map((color, i) => (
          <span key={i} className="h-full flex-1" style={{ backgroundColor: color }} aria-hidden />
        ))}
      </div>
      <div className="flex items-center justify-between gap-2 px-4 py-3">
        <div className="min-w-0">
          <p className="truncate font-mono text-[15px] font-bold">{palette.name}</p>
          <p className="font-mono text-[11px] text-muted-foreground">{palette.colors.length} colours</p>
        </div>
        <Button
          type="button"
          size="icon"
          variant="ghost"
          onClick={(e) => {
            e.stopPropagation();
            onSelect();
          }}
          aria-label={`Open ${palette.name} in Palette Generator`}
          className="size-8 shrink-0 text-muted-foreground hover:text-foreground"
        >
          <ArrowRight className="size-4" />
        </Button>
      </div>
    </div>
  );
}
