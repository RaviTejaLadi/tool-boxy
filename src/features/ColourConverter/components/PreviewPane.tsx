import { ColorPickerSwatch } from '@/components/ColorPickerSwatch';
import { useColourConverterStore } from '../stores';

export function PreviewPane() {
  const hex = useColourConverterStore((s) => s.hex);
  const setHex = useColourConverterStore((s) => s.setHex);

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
          <ColorPickerSwatch
            value={hex}
            onChange={setHex}
            className="size-48 shadow-sm sm:size-56"
            ariaLabel="Pick colour"
          />
        </div>
      </div>

      <div className="pointer-events-none absolute bottom-3 left-1/2 -translate-x-1/2">
        <span className="rounded-none border border-border bg-background/90 px-2 py-1 font-mono text-[11px] uppercase text-muted-foreground shadow-sm backdrop-blur-sm">
          {hex}
        </span>
      </div>
    </div>
  );
}
