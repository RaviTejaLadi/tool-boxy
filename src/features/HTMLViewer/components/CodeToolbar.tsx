import { Redo2, Settings2, Undo2, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { useViewerStore } from '../stores';

export function CodeToolbar() {
  const past = useViewerStore((s) => s.past);
  const future = useViewerStore((s) => s.future);
  const wordWrap = useViewerStore((s) => s.wordWrap);
  const undo = useViewerStore((s) => s.undo);
  const redo = useViewerStore((s) => s.redo);
  const prettify = useViewerStore((s) => s.prettify);
  const clearCode = useViewerStore((s) => s.clearCode);
  const setWordWrap = useViewerStore((s) => s.setWordWrap);

  return (
    <div className="flex shrink-0 flex-wrap items-center gap-1.5 border-b border-border px-3 py-2">
      <Button
        variant="ghost"
        size="icon"
        className="size-8"
        onClick={undo}
        disabled={past.length === 0}
        aria-label="Undo"
      >
        <Undo2 className="size-4" />
      </Button>
      <Button
        variant="ghost"
        size="icon"
        className="size-8"
        onClick={redo}
        disabled={future.length === 0}
        aria-label="Redo"
      >
        <Redo2 className="size-4" />
      </Button>

      <div className="ml-auto flex flex-wrap items-center gap-1.5">
        <Button variant="outline" size="sm" onClick={prettify}>
          Prettify
        </Button>
        <Button variant="ghost" size="icon" className="size-8" onClick={clearCode} aria-label="Clear">
          <X className="size-4" />
        </Button>
        <Popover>
          <PopoverTrigger
            className="inline-flex size-8 items-center justify-center rounded-none text-muted-foreground outline-none hover:bg-accent hover:text-accent-foreground"
            aria-label="Settings"
          >
            <Settings2 className="size-4" />
          </PopoverTrigger>
          <PopoverContent align="end" className="w-56">
            <div className="flex items-center justify-between gap-3">
              <Label htmlFor="html-word-wrap" className="font-mono text-[11px]">
                Word wrap
              </Label>
              <Switch id="html-word-wrap" checked={wordWrap} onCheckedChange={setWordWrap} />
            </div>
          </PopoverContent>
        </Popover>
      </div>
    </div>
  );
}
