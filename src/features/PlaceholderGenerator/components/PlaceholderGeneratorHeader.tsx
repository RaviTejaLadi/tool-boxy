import { useState } from 'react';
import { Check, Copy, Image, ImageDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { buildDataUrl, downloadPng, copyToClipboard, type PlaceholderConfig } from '../helpers';

export function PlaceholderGeneratorHeader({ config }: { config: PlaceholderConfig }) {
  const [copied, setCopied] = useState(false);

  const handleCopyUrl = async () => {
    await copyToClipboard(buildDataUrl(config));
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1500);
  };

  return (
    <header className="flex shrink-0 items-center justify-between border-b border-border px-6 py-3">
      <div className="flex items-center gap-2.5">
        <div className="flex size-7 items-center justify-center bg-primary text-primary-foreground">
          <Image className="size-4" />
        </div>
        <div>
          <div className="font-heading text-sm leading-none font-semibold">Placeholder Generator</div>
          <div className="mt-1 font-mono text-[11px] leading-none text-muted-foreground">
            Generate placeholder images
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <Button variant="outline" size="sm" onClick={() => void handleCopyUrl()}>
          {copied ? <Check data-icon="inline-start" className="text-primary" /> : <Copy data-icon="inline-start" />}
          {copied ? 'Copied' : 'Copy URL'}
        </Button>
        <Button size="sm" onClick={() => downloadPng(config)}>
          <ImageDown data-icon="inline-start" />
          Download PNG
        </Button>
      </div>
    </header>
  );
}
