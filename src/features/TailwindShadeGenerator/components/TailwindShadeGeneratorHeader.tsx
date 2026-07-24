import { AudioWaveform } from 'lucide-react';

export function TailwindShadeGeneratorHeader() {
  return (
    <header className="flex shrink-0 items-center justify-between border-b border-border px-4 py-2">
      <div className="flex items-center gap-2.5">
        <div className="flex size-7 items-center justify-center bg-primary text-primary-foreground">
          <AudioWaveform className="size-4" />
        </div>
        <div>
          <div className="font-heading text-sm leading-none font-semibold">Tailwind Shade Generator</div>
          <div className="mt-1 font-mono text-[11px] leading-none text-muted-foreground">
            Generate Tailwind colour scales
          </div>
        </div>
      </div>
    </header>
  );
}
