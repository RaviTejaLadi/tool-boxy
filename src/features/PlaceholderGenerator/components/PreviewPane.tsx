import { usePlaceholderStore } from '../stores';

export function PreviewPane({ dataUrl }: { dataUrl: string }) {
  const width = usePlaceholderStore((s) => s.width);
  const height = usePlaceholderStore((s) => s.height);

  return (
    <div className="relative flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden bg-muted/40">
      <div
        className="flex min-h-0 flex-1 items-center justify-center p-8 lg:p-14"
        style={{
          backgroundImage:
            'radial-gradient(circle, color-mix(in oklab, var(--foreground) 8%, transparent) 1px, transparent 1px)',
          backgroundSize: '22px 22px',
        }}
      >
        <img
          src={dataUrl}
          alt={`Placeholder ${width}x${height}`}
          className="max-h-full max-w-full border border-border object-contain shadow-sm"
        />
      </div>

      <div className="pointer-events-none absolute bottom-3 left-1/2 -translate-x-1/2">
        <span className="rounded-none border border-border bg-background/90 px-2 py-1 font-mono text-[11px] text-muted-foreground tabular-nums shadow-sm backdrop-blur-sm">
          {width} × {height}
        </span>
      </div>
    </div>
  );
}
