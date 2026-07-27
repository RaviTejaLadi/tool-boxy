import { QRCodeSVG } from 'qrcode.react';
import { useQrStore } from '../stores';

function truncateContent(value: string, max = 48) {
  if (value.length <= max) return value;
  return `${value.slice(0, max - 1)}…`;
}

export function PreviewPane() {
  const text = useQrStore((s) => s.text);
  const fgColor = useQrStore((s) => s.fgColor);
  const bgColor = useQrStore((s) => s.bgColor);

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
            id="qr-preview-container"
            className="border border-border p-4 shadow-sm backdrop-blur-sm"
            style={{ backgroundColor: bgColor }}
          >
            {text ? (
              <QRCodeSVG value={text} size={210} fgColor={fgColor} bgColor={bgColor} level="H" />
            ) : (
              <div className="flex size-[210px] items-center justify-center font-mono text-xs text-muted-foreground">
                Enter text to generate
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="pointer-events-none absolute bottom-3 left-1/2 -translate-x-1/2">
        <span className="rounded-none border border-border bg-background/90 px-2 py-1 font-mono text-[11px] text-muted-foreground shadow-sm backdrop-blur-sm">
          {text ? truncateContent(text) : 'No content'}
        </span>
      </div>
    </div>
  );
}
