import { getPreviewBackground } from '../helpers';
import { useGradientStore } from '../stores';

export function PreviewPane() {
  const activeTab = useGradientStore((s) => s.activeTab);
  const angle = useGradientStore((s) => s.angle);
  const linearStops = useGradientStore((s) => s.linearStops);
  const cornerStops = useGradientStore((s) => s.cornerStops);
  const meshStops = useGradientStore((s) => s.meshStops);

  const background = getPreviewBackground(activeTab, angle, linearStops, cornerStops, meshStops);

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
        <div className="flex min-h-0 flex-1 flex-col items-center justify-center p-6 lg:p-10">
          <div className="h-56 w-full max-w-xl border border-border shadow-sm" style={{ background }} />
        </div>
      </div>

      <div className="pointer-events-none absolute bottom-3 left-1/2 -translate-x-1/2">
        <span className="rounded-none border border-border bg-background/90 px-2 py-1 font-mono text-[11px] capitalize text-muted-foreground shadow-sm backdrop-blur-sm">
          {activeTab} gradient
        </span>
      </div>
    </div>
  );
}
