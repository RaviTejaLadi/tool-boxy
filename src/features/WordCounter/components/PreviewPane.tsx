import { Textarea } from '@/components/ui/textarea';
import { useWordCounterStore } from '../stores';

export function PreviewPane() {
  const text = useWordCounterStore((s) => s.text);
  const setText = useWordCounterStore((s) => s.setText);
  const stats = useWordCounterStore((s) => s.stats);

  return (
    <div className="relative flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden bg-muted/40">
      <div
        className="flex min-h-0 flex-1 flex-col overflow-auto"
        style={{
          backgroundImage:
            'radial-gradient(circle, color-mix(in oklab, var(--foreground) 8%, transparent) 1px, transparent 1px)',
          backgroundSize: '22px 22px',
        }}
      >
        <div className="flex min-h-0 flex-1 flex-col p-6 lg:p-10">
          <div className="mx-auto flex w-full max-w-2xl min-h-0 flex-1 flex-col border border-border bg-background/90 shadow-sm backdrop-blur-sm">
            <p className="border-b border-border px-5 py-3 font-mono text-[10px] tracking-wide text-muted-foreground uppercase">
              Input text
            </p>
            <Textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Type or paste your text here..."
              className="min-h-0 flex-1 resize-none rounded-none border-0 bg-transparent px-5 py-4 font-mono text-sm shadow-none focus-visible:ring-0"
            />
          </div>
        </div>
      </div>

      <div className="pointer-events-none absolute bottom-3 left-1/2 -translate-x-1/2">
        <span className="rounded-none border border-border bg-background/90 px-2 py-1 font-mono text-[11px] text-muted-foreground tabular-nums shadow-sm backdrop-blur-sm">
          {stats.words} word{stats.words === 1 ? '' : 's'} · {stats.characters} chars
        </span>
      </div>
    </div>
  );
}
