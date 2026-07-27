import { useEffect, useRef } from 'react';
import { ALargeSmall } from 'lucide-react';
import { generateAscii, getAsciiStats } from '../helpers';
import { useAsciiStore } from '../stores';

export function PreviewPane() {
  const imageSrc = useAsciiStore((s) => s.imageSrc);
  const asciiArt = useAsciiStore((s) => s.asciiArt);
  const width = useAsciiStore((s) => s.width);
  const isGenerating = useAsciiStore((s) => s.isGenerating);
  const setAsciiArt = useAsciiStore((s) => s.setAsciiArt);
  const setGenerating = useAsciiStore((s) => s.setGenerating);
  const setError = useAsciiStore((s) => s.setError);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!imageSrc) {
      setAsciiArt('');
      return;
    }

    const canvas = canvasRef.current;
    if (!canvas) return;

    let cancelled = false;
    setGenerating(true);
    setError(null);

    void generateAscii(imageSrc, width, canvas)
      .then((result) => {
        if (cancelled) return;
        setAsciiArt(result);
      })
      .catch((err) => {
        if (cancelled) return;
        setError(err instanceof Error ? err.message : 'Failed to generate ASCII art');
        setAsciiArt('');
      })
      .finally(() => {
        if (!cancelled) setGenerating(false);
      });

    return () => {
      cancelled = true;
    };
  }, [imageSrc, width, setAsciiArt, setGenerating, setError]);

  const stats = asciiArt ? getAsciiStats(asciiArt) : null;

  return (
    <div className="relative flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden bg-muted/40">
      <canvas ref={canvasRef} className="hidden" aria-hidden />

      <div
        className="flex min-h-0 flex-1 flex-col overflow-hidden"
        style={{
          backgroundImage:
            'radial-gradient(circle, color-mix(in oklab, var(--foreground) 8%, transparent) 1px, transparent 1px)',
          backgroundSize: '22px 22px',
        }}
      >
        {!asciiArt && !isGenerating ? (
          <div className="flex min-h-0 flex-1 items-center justify-center p-8 lg:p-14">
            <div className="flex w-full max-w-md flex-col items-center justify-center gap-3 border-2 border-dashed border-border bg-background/60 px-8 py-14 text-center">
              <ALargeSmall className="size-10 text-muted-foreground" />
              <div className="space-y-1">
                <p className="font-heading text-sm font-semibold">No ASCII art yet</p>
                <p className="font-mono text-[11px] text-muted-foreground">
                  Upload an image to convert it into ASCII art
                </p>
              </div>
            </div>
          </div>
        ) : isGenerating && !asciiArt ? (
          <div className="flex min-h-0 flex-1 flex-col items-center justify-center gap-3 p-8">
            <div className="size-8 animate-spin rounded-full border-2 border-border border-t-primary" />
            <p className="font-mono text-[11px] text-muted-foreground">Generating ASCII art…</p>
          </div>
        ) : (
          <div className="flex min-h-0 flex-1 flex-col overflow-auto p-4 lg:p-6">
            <div className="min-h-0 flex-1 overflow-auto border border-border bg-zinc-950 p-4 shadow-sm">
              <pre className="select-all font-mono text-[8px] leading-2 whitespace-pre text-green-400">{asciiArt}</pre>
            </div>
          </div>
        )}
      </div>

      {stats && (
        <div className="pointer-events-none absolute bottom-3 left-1/2 -translate-x-1/2">
          <span className="rounded-none border border-border bg-background/90 px-2 py-1 font-mono text-[11px] text-muted-foreground tabular-nums shadow-sm backdrop-blur-sm">
            {stats.lines} lines · {stats.characters} characters
            {isGenerating ? ' · updating…' : ''}
          </span>
        </div>
      )}
    </div>
  );
}
