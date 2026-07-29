import { getContrastRating } from '../helpers';
import { useContrastCheckerStore, useContrastRatio } from '../stores';

export function PreviewPane() {
  const background = useContrastCheckerStore((s) => s.background);
  const foreground = useContrastCheckerStore((s) => s.foreground);
  const ratio = useContrastRatio();
  const rating = getContrastRating(ratio);

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
          <div
            className="w-full max-w-lg border border-border p-6 shadow-sm transition-colors"
            style={{ backgroundColor: background }}
          >
            <p className="text-xl font-bold" style={{ color: foreground }}>
              Large text (24px+)
            </p>
            <p className="mt-3 text-base" style={{ color: foreground }}>
              Normal text at 16px. The quick brown fox jumps over the lazy dog.
            </p>
            <p className="mt-2 text-sm" style={{ color: foreground }}>
              Small text at 14px for captions.
            </p>
          </div>
        </div>
      </div>

      <div className="pointer-events-none absolute bottom-3 left-1/2 -translate-x-1/2">
        <span className="rounded-none border border-border bg-background/90 px-2 py-1 font-mono text-[11px] shadow-sm backdrop-blur-sm">
          <span className="font-semibold tabular-nums">{ratio}:1</span>
          <span className={`ml-2 ${rating.color}`}>{rating.label}</span>
        </span>
      </div>
    </div>
  );
}
