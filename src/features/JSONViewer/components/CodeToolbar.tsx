import { Redo2, Settings2, Undo2, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { countKeys, parseJson } from '../helpers';
import { useJsonStore } from '../stores';

export function CodeToolbar() {
  const jsonCode = useJsonStore((s) => s.jsonCode);
  const past = useJsonStore((s) => s.past);
  const future = useJsonStore((s) => s.future);
  const wordWrap = useJsonStore((s) => s.wordWrap);
  const error = useJsonStore((s) => s.error);
  const undo = useJsonStore((s) => s.undo);
  const redo = useJsonStore((s) => s.redo);
  const prettify = useJsonStore((s) => s.prettify);
  const minify = useJsonStore((s) => s.minify);
  const clearCode = useJsonStore((s) => s.clearCode);
  const setWordWrap = useJsonStore((s) => s.setWordWrap);

  const parsed = error ? null : parseJson(jsonCode);
  const keyCount = parsed !== null ? countKeys(parsed) : 0;

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

      <span className="mx-1 font-mono text-[11px] text-muted-foreground">{error ? 'Invalid' : `${keyCount} keys`}</span>

      <div className="ml-auto flex flex-wrap items-center gap-1.5">
        <Button variant="outline" size="sm" onClick={minify} disabled={!!error}>
          Minify
        </Button>
        <Button variant="outline" size="sm" onClick={prettify} disabled={!!error}>
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
              <Label htmlFor="json-word-wrap" className="font-mono text-[11px]">
                Word wrap
              </Label>
              <Switch id="json-word-wrap" checked={wordWrap} onCheckedChange={setWordWrap} />
            </div>
          </PopoverContent>
        </Popover>
      </div>
    </div>
  );
}
