import { Button } from '@/components/ui/button';
import { formatBorderRadius } from '../helpers';
import { useBorderRadiusStore } from '../stores';

const SIZE_CLASS: Record<string, string> = {
  small: 'w-32 h-32',
  medium: 'w-40 h-40',
  large: 'w-56 h-56',
};

export function PreviewPane() {
  const corners = useBorderRadiusStore((s) => s.corners);
  const previewSize = useBorderRadiusStore((s) => s.previewSize);
  const setPreviewSize = useBorderRadiusStore((s) => s.setPreviewSize);

  const radius = formatBorderRadius(corners);

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
        <div className="flex min-h-0 flex-1 flex-col items-center justify-center gap-6 p-6 lg:p-10">
          <div
            className={`${SIZE_CLASS[previewSize]} bg-linear-to-br from-blue-500 to-purple-600 shadow-sm transition-all duration-300`}
            style={{ borderRadius: radius }}
          >
            <div className="flex h-full w-full items-center justify-center p-2 text-center text-sm font-medium text-white opacity-90">
              {radius}
            </div>
          </div>

          <div className="flex gap-2">
            {(['small', 'medium', 'large'] as const).map((size) => (
              <Button
                key={size}
                variant={previewSize === size ? 'default' : 'outline'}
                size="sm"
                className="capitalize"
                onClick={() => setPreviewSize(size)}
              >
                {size}
              </Button>
            ))}
          </div>
        </div>
      </div>

      <div className="pointer-events-none absolute bottom-3 left-1/2 max-w-[min(100%-1.5rem,28rem)] -translate-x-1/2">
        <span className="block truncate rounded-none border border-border bg-background/90 px-2 py-1 font-mono text-[11px] text-muted-foreground shadow-sm backdrop-blur-sm">
          border-radius: {radius};
        </span>
      </div>
    </div>
  );
}
