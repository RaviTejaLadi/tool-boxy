import { useState } from 'react';
import { Check, Copy, ImagePlus, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { copyToClipboard } from '../helpers';
import { useEncoderStore } from '../stores';

export function Base64ImageEncoderHeader() {
  const images = useEncoderStore((s) => s.images);
  const clearAll = useEncoderStore((s) => s.clearAll);
  const [copied, setCopied] = useState(false);

  const handleCopyAll = async () => {
    if (images.length === 0) return;
    await copyToClipboard(images.map((img) => img.dataUri).join('\n'));
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1500);
  };

  return (
    <header className="flex shrink-0 items-center justify-between border-b border-border px-6 py-3">
      <div className="flex items-center gap-2.5">
        <div className="flex size-7 items-center justify-center bg-primary text-primary-foreground">
          <ImagePlus className="size-4" />
        </div>
        <div>
          <div className="font-heading text-sm leading-none font-semibold">Base64 Image Encoder</div>
          <div className="mt-1 font-mono text-[11px] leading-none text-muted-foreground">
            Convert images to Base64 for CSS/HTML
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <Button variant="outline" size="sm" onClick={clearAll} disabled={images.length === 0}>
          <Trash2 data-icon="inline-start" />
          Clear
        </Button>
        <Button size="sm" onClick={() => void handleCopyAll()} disabled={images.length === 0}>
          {copied ? (
            <Check data-icon="inline-start" className="text-primary-foreground" />
          ) : (
            <Copy data-icon="inline-start" />
          )}
          {copied ? 'Copied' : 'Copy All URIs'}
        </Button>
      </div>
    </header>
  );
}
