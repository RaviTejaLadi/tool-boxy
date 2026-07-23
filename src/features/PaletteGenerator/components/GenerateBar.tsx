import { ChevronDown, Minus, Plus, Shuffle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { MIN_COLORS, MAX_COLORS } from '../constants';
import { usePaletteStore } from '../stores';

export function GenerateBar() {
  const colors = usePaletteStore((s) => s.colors);
  const cohesive = usePaletteStore((s) => s.cohesive);
  const setCohesive = usePaletteStore((s) => s.setCohesive);
  const regenerateAll = usePaletteStore((s) => s.regenerateAll);
  const changeCount = usePaletteStore((s) => s.changeCount);

  return (
    <div className="flex flex-col items-stretch overflow-hidden border border-border bg-card sm:flex-row">
      <DropdownMenu>
        <DropdownMenuTrigger className="flex flex-1 items-center justify-between border-b border-border px-4 py-3 text-left outline-none sm:border-r sm:border-b-0">
          <div>
            <div className="text-sm font-semibold">{cohesive ? 'Random' : 'Fully Random'}</div>
            <div className="text-xs text-muted-foreground">
              {cohesive ? 'Random cohesive palette' : 'No hue relationship'}
            </div>
          </div>
          <ChevronDown className="size-4 text-muted-foreground" />
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start">
          <DropdownMenuItem onClick={() => setCohesive(true)}>Random cohesive palette</DropdownMenuItem>
          <DropdownMenuItem onClick={() => setCohesive(false)}>Fully random palette</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <Button type="button" onClick={regenerateAll} className="h-auto flex-[2] rounded-none px-6 py-3 font-semibold">
        <Shuffle data-icon="inline-start" />
        Generate
      </Button>

      <div className="flex items-center justify-center gap-4 border-t border-border px-5 py-3 sm:border-t-0 sm:border-l">
        <Button
          type="button"
          variant="ghost"
          size="icon"
          onClick={() => changeCount(-1)}
          disabled={colors.length <= MIN_COLORS}
          aria-label="Fewer colours"
          className="size-8"
        >
          <Minus className="size-4" />
        </Button>
        <span className="w-4 text-center font-mono text-sm">{colors.length}</span>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          onClick={() => changeCount(1)}
          disabled={colors.length >= MAX_COLORS}
          aria-label="More colours"
          className="size-8"
        >
          <Plus className="size-4" />
        </Button>
      </div>
    </div>
  );
}
