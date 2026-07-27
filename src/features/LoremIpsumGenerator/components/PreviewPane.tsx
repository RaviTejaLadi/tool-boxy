import { useLoremStore } from '../stores';

export function PreviewPane() {
  const generatedText = useLoremStore((s) => s.generatedText);
  const format = useLoremStore((s) => s.format);
  const paragraphCount = useLoremStore((s) => s.paragraphCount);

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
          <div className="mx-auto w-full max-w-2xl flex-1 border border-border bg-background/90 p-5 shadow-sm backdrop-blur-sm">
            <p className="mb-3 font-mono text-[10px] tracking-wide text-muted-foreground uppercase">
              {format === 'html' ? 'HTML source' : 'Plain text'}
            </p>
            <pre
              className={`max-h-full overflow-auto whitespace-pre-wrap wrap-break-word text-sm leading-relaxed ${
                format === 'html' ? 'font-mono text-[13px]' : 'font-sans'
              }`}
            >
              {generatedText || 'Click Generate to create placeholder text.'}
            </pre>
          </div>
        </div>
      </div>

      <div className="pointer-events-none absolute bottom-3 left-1/2 -translate-x-1/2">
        <span className="rounded-none border border-border bg-background/90 px-2 py-1 font-mono text-[11px] text-muted-foreground tabular-nums shadow-sm backdrop-blur-sm">
          {paragraphCount} paragraph{paragraphCount === 1 ? '' : 's'}
        </span>
      </div>
    </div>
  );
}
