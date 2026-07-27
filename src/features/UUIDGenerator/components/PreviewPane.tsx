import { useUuidStore } from '../stores';

const VERSION_LABELS = {
  v4: 'UUID v4 · Random',
  v7: 'UUID v7 · Timestamp',
} as const;

export function PreviewPane() {
  const activeVersion = useUuidStore((s) => s.activeVersion);
  const uuidV4 = useUuidStore((s) => s.uuidV4);
  const uuidV7 = useUuidStore((s) => s.uuidV7);

  const uuid = activeVersion === 'v4' ? uuidV4 : uuidV7;
  const empty = !uuid;

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
        <div className="flex min-h-0 flex-1 flex-col items-center justify-center gap-4 p-6 lg:p-10">
          <p className="font-mono text-[11px] tracking-wide text-muted-foreground uppercase">
            {activeVersion === 'v4' ? 'Random UUID' : 'Timestamp UUID'}
          </p>
          <p
            className={`max-w-full break-all text-center font-mono text-xl font-semibold tracking-tight sm:text-2xl lg:text-3xl ${
              empty ? 'text-muted-foreground/50' : ''
            }`}
          >
            {uuid || 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx'}
          </p>
        </div>
      </div>

      <div className="pointer-events-none absolute bottom-3 left-1/2 -translate-x-1/2">
        <span className="rounded-none border border-border bg-background/90 px-2 py-1 font-mono text-[11px] text-muted-foreground shadow-sm backdrop-blur-sm">
          {VERSION_LABELS[activeVersion]}
        </span>
      </div>
    </div>
  );
}
