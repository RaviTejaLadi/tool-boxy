import { useState } from 'react';
import { Check, Copy, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { buildSvg, buildDataUrl, downloadSvg, copyToClipboard, type PlaceholderConfig } from '../helpers';
import { SectionHeading } from './SectionHeading';

export function ExportSection({ config }: { config: PlaceholderConfig }) {
  const [copied, setCopied] = useState(false);
  const svg = buildSvg(config);

  const handleCopy = async () => {
    await copyToClipboard(svg);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1500);
  };

  return (
    <section className="space-y-3">
      <SectionHeading>SVG Export</SectionHeading>

      <div className="overflow-hidden border border-border">
        <div className="flex items-center justify-between border-b border-border px-3 py-2">
          <h3 className="text-sm font-semibold">Markup</h3>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => void handleCopy()}
            className="h-7 gap-1.5 px-2 text-xs text-muted-foreground hover:text-foreground"
          >
            {copied ? <Check className="size-3.5 text-primary" /> : <Copy className="size-3.5" />}
            {copied ? 'Copied' : 'Copy'}
          </Button>
        </div>
        <pre className="max-h-56 overflow-auto px-3 py-3 font-mono text-[13px] leading-6 break-all whitespace-pre-wrap text-primary">
          {svg}
        </pre>
      </div>

      <Button
        type="button"
        variant="outline"
        className="w-full"
        onClick={() => void copyToClipboard(buildDataUrl(config))}
      >
        <Copy data-icon="inline-start" />
        Copy SVG Data URL
      </Button>

      <Button type="button" variant="outline" className="w-full" onClick={() => downloadSvg(config)}>
        <Download data-icon="inline-start" />
        Download SVG
      </Button>
    </section>
  );
}
