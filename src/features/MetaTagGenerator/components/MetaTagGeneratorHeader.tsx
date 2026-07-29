import { Check, Copy, Eye, EyeOff, Tag } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useMetaTagStore } from '../stores';

export function MetaTagGeneratorHeader() {
  const copied = useMetaTagStore((s) => s.copied);
  const showPreview = useMetaTagStore((s) => s.showPreview);
  const copyMetaTags = useMetaTagStore((s) => s.copyMetaTags);
  const togglePreview = useMetaTagStore((s) => s.togglePreview);

  return (
    <header className="flex shrink-0 flex-wrap items-center justify-between gap-3 border-b border-border px-6 py-3">
      <div className="flex items-center gap-2.5">
        <div className="flex size-7 items-center justify-center bg-primary text-primary-foreground">
          <Tag className="size-4" />
        </div>
        <div>
          <div className="font-heading text-sm leading-none font-semibold">Meta Tag Generator</div>
          <div className="mt-1 font-mono text-[11px] leading-none text-muted-foreground">
            Open Graph and Twitter meta tags
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <Button variant="outline" size="sm" onClick={togglePreview}>
          {showPreview ? <EyeOff data-icon="inline-start" /> : <Eye data-icon="inline-start" />}
          {showPreview ? 'Hide preview' : 'Show preview'}
        </Button>
        <Button size="sm" onClick={() => void copyMetaTags()}>
          {copied ? <Check data-icon="inline-start" /> : <Copy data-icon="inline-start" />}
          {copied ? 'Copied' : 'Copy tags'}
        </Button>
      </div>
    </header>
  );
}
