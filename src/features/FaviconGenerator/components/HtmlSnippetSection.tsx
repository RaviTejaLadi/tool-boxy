import { useState } from 'react';
import { Check, Copy } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { buildHtmlSnippet, copyToClipboard } from '../helpers';
import { useFaviconStore } from '../stores';
import { SectionHeading } from './SectionHeading';

export function HtmlSnippetSection() {
  const favicons = useFaviconStore((s) => s.favicons);
  const [copied, setCopied] = useState(false);

  if (favicons.length === 0) {
    return (
      <section className="space-y-3">
        <SectionHeading className="mb-3">HTML Snippet</SectionHeading>
        <p className="font-mono text-[11px] text-muted-foreground">Generate favicons to get the HTML snippet.</p>
      </section>
    );
  }

  const snippet = buildHtmlSnippet();

  const handleCopy = async () => {
    await copyToClipboard(snippet);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1500);
  };

  return (
    <section className="space-y-3">
      <SectionHeading className="mb-3">HTML Snippet</SectionHeading>

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
        <pre className="max-h-56 overflow-auto px-3 py-3 font-mono text-[12px] leading-5 break-all whitespace-pre-wrap text-primary">
          {snippet}
        </pre>
      </div>

      <Button type="button" variant="outline" className="w-full" onClick={() => void handleCopy()}>
        {copied ? <Check data-icon="inline-start" className="text-primary" /> : <Copy data-icon="inline-start" />}
        {copied ? 'Copied' : 'Copy to Clipboard'}
      </Button>
    </section>
  );
}
