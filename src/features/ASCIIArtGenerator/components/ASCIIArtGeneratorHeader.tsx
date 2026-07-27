import { useState } from 'react';
import { ALargeSmall, Check, Copy, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { downloadAsciiArt } from '../helpers';
import { useAsciiStore } from '../stores';

export function ASCIIArtGeneratorHeader() {
  const asciiArt = useAsciiStore((s) => s.asciiArt);
  const isGenerating = useAsciiStore((s) => s.isGenerating);
  const [copied, setCopied] = useState(false);

  const hasAscii = asciiArt.length > 0;

  const handleCopy = async () => {
    if (!hasAscii) return;
    await navigator.clipboard.writeText(asciiArt);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1500);
  };

  const handleDownload = () => {
    if (!hasAscii) return;
    downloadAsciiArt(asciiArt);
  };

  return (
    <header className="flex shrink-0 items-center justify-between border-b border-border px-6 py-3">
      <div className="flex items-center gap-2.5">
        <div className="flex size-7 items-center justify-center bg-primary text-primary-foreground">
          <ALargeSmall className="size-4" />
        </div>
        <div>
          <div className="font-heading text-sm leading-none font-semibold">ASCII Art Generator</div>
          <div className="mt-1 font-mono text-[11px] leading-none text-muted-foreground">
            Convert images into ASCII art
          </div>
        </div>
      </div>

      {hasAscii && (
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={() => void handleCopy()} disabled={isGenerating}>
            {copied ? <Check data-icon="inline-start" className="text-primary" /> : <Copy data-icon="inline-start" />}
            {copied ? 'Copied' : 'Copy'}
          </Button>
          <Button size="sm" onClick={handleDownload} disabled={isGenerating}>
            <Download data-icon="inline-start" />
            Download
          </Button>
        </div>
      )}
    </header>
  );
}
