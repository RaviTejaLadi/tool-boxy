import { BookOpen, Check, Copy, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useWordCounterStore } from '../stores';

export function WordCounterHeader() {
  const clear = useWordCounterStore((s) => s.clear);
  const copyStats = useWordCounterStore((s) => s.copyStats);
  const copied = useWordCounterStore((s) => s.copied);
  const text = useWordCounterStore((s) => s.text);

  return (
    <header className="flex shrink-0 items-center justify-between border-b border-border px-6 py-3">
      <div className="flex items-center gap-2.5">
        <div className="flex size-7 items-center justify-center bg-primary text-primary-foreground">
          <BookOpen className="size-4" />
        </div>
        <div>
          <div className="font-heading text-sm leading-none font-semibold">Word Counter</div>
          <div className="mt-1 font-mono text-[11px] leading-none text-muted-foreground">
            Count words, characters and more
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <Button variant="outline" size="sm" onClick={clear} disabled={!text}>
          <Trash2 data-icon="inline-start" />
          Clear
        </Button>
        <Button size="sm" onClick={() => void copyStats()}>
          {copied ? <Check data-icon="inline-start" /> : <Copy data-icon="inline-start" />}
          {copied ? 'Copied' : 'Copy Stats'}
        </Button>
      </div>
    </header>
  );
}
