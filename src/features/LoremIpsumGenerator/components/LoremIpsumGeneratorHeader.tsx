import { Check, Copy, RefreshCw, Type } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useLoremStore } from '../stores';

export function LoremIpsumGeneratorHeader() {
  const generate = useLoremStore((s) => s.generate);
  const copy = useLoremStore((s) => s.copy);
  const copied = useLoremStore((s) => s.copied);
  const generatedText = useLoremStore((s) => s.generatedText);

  return (
    <header className="flex shrink-0 items-center justify-between border-b border-border px-6 py-3">
      <div className="flex items-center gap-2.5">
        <div className="flex size-7 items-center justify-center bg-primary text-primary-foreground">
          <Type className="size-4" />
        </div>
        <div>
          <div className="font-heading text-sm leading-none font-semibold">Lorem Ipsum Generator</div>
          <div className="mt-1 font-mono text-[11px] leading-none text-muted-foreground">
            Generate placeholder paragraphs
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <Button variant="outline" size="sm" onClick={generate}>
          <RefreshCw data-icon="inline-start" />
          Generate
        </Button>
        <Button size="sm" onClick={copy} disabled={!generatedText}>
          {copied ? <Check data-icon="inline-start" /> : <Copy data-icon="inline-start" />}
          {copied ? 'Copied' : 'Copy'}
        </Button>
      </div>
    </header>
  );
}
