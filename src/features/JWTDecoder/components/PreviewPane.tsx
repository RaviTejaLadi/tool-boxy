import { AlertCircle } from 'lucide-react';
import { SyntaxHighlight } from '@/components/SyntaxHighlight';
import { ScrollArea } from '@/components/ui/scroll-area';
import { formatPart } from '../helpers';
import { useJwtStore } from '../stores';

export function PreviewPane() {
  const decodedData = useJwtStore((s) => s.decodedData);
  const error = useJwtStore((s) => s.error);
  const activePart = useJwtStore((s) => s.activePart);
  const jwtInput = useJwtStore((s) => s.jwtInput);

  const algorithm = decodedData && typeof decodedData.header.alg === 'string' ? decodedData.header.alg : '—';

  const previewText = decodedData
    ? formatPart(decodedData, activePart)
    : 'Paste a JWT token to inspect its header, payload, and signature.';

  return (
    <div className="relative flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden bg-muted/40">
      <div
        className="flex min-h-0 flex-1 flex-col overflow-hidden"
        style={{
          backgroundImage:
            'radial-gradient(circle, color-mix(in oklab, var(--foreground) 8%, transparent) 1px, transparent 1px)',
          backgroundSize: '22px 22px',
        }}
      >
        {error ? (
          <div className="m-auto flex max-w-md flex-col items-center gap-2 border border-destructive/40 bg-background/90 px-4 py-6 text-center text-destructive shadow-sm backdrop-blur-sm">
            <AlertCircle className="size-5" />
            <p className="font-mono text-[11px]">{error}</p>
          </div>
        ) : (
          <ScrollArea className="h-full w-full">
            <div className="flex min-h-full flex-col p-6 lg:p-10">
              <p className="mb-3 font-mono text-[11px] tracking-wide text-muted-foreground uppercase">{activePart}</p>
              <SyntaxHighlight
                code={previewText}
                language={decodedData ? 'json' : 'text'}
                wrap
                className={`font-mono text-[13px] leading-6 break-all ${
                  decodedData ? 'text-foreground' : 'text-muted-foreground/50'
                }`}
              />
            </div>
          </ScrollArea>
        )}
      </div>

      <div className="pointer-events-none absolute bottom-3 left-1/2 -translate-x-1/2">
        <span className="rounded-none border border-border bg-background/90 px-2 py-1 font-mono text-[11px] text-muted-foreground tabular-nums shadow-sm backdrop-blur-sm">
          {jwtInput.trim() && !error ? `alg ${algorithm}` : 'alg —'}
        </span>
      </div>
    </div>
  );
}
