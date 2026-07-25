import { useState } from 'react';
import { Check, Copy } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { copyToClipboard } from '../helpers';
import { useEncoderStore } from '../stores';
import { SectionHeading } from './SectionHeading';

type CopyKind = 'base64' | 'dataUri' | 'allBase64' | 'allDataUri' | null;

export function OutputSection() {
  const images = useEncoderStore((s) => s.images);
  const selectedId = useEncoderStore((s) => s.selectedId);
  const selected = images.find((img) => img.id === selectedId) ?? images[0];
  const [copied, setCopied] = useState<CopyKind>(null);

  const flash = (kind: CopyKind) => {
    setCopied(kind);
    window.setTimeout(() => setCopied(null), 1500);
  };

  if (!selected) {
    return (
      <section className="space-y-3">
        <SectionHeading className="mb-3">Output</SectionHeading>
        <p className="font-mono text-[11px] text-muted-foreground">Encode an image to see Base64 output.</p>
      </section>
    );
  }

  const snippet = selected.base64.slice(0, 180);

  return (
    <section className="space-y-3">
      <SectionHeading className="mb-3">Output</SectionHeading>

      <div className="overflow-hidden border border-border">
        <div className="flex items-center justify-between border-b border-border px-3 py-2">
          <h3 className="truncate text-sm font-semibold">{selected.name}</h3>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => {
              void copyToClipboard(selected.base64).then(() => flash('base64'));
            }}
            className="h-7 gap-1.5 px-2 text-xs text-muted-foreground hover:text-foreground"
          >
            {copied === 'base64' ? <Check className="size-3.5 text-primary" /> : <Copy className="size-3.5" />}
            {copied === 'base64' ? 'Copied' : 'Copy'}
          </Button>
        </div>
        <pre className="max-h-40 overflow-auto px-3 py-3 font-mono text-[12px] leading-5 break-all whitespace-pre-wrap text-primary">
          {snippet}
          {selected.base64.length > 180 ? '…' : ''}
        </pre>
      </div>

      <Button
        type="button"
        variant="outline"
        className="w-full"
        onClick={() => {
          void copyToClipboard(selected.base64).then(() => flash('base64'));
        }}
      >
        {copied === 'base64' ? (
          <Check data-icon="inline-start" className="text-primary" />
        ) : (
          <Copy data-icon="inline-start" />
        )}
        {copied === 'base64' ? 'Copied Raw Base64' : 'Copy Raw Base64'}
      </Button>

      <Button
        type="button"
        variant="outline"
        className="w-full"
        onClick={() => {
          void copyToClipboard(selected.dataUri).then(() => flash('dataUri'));
        }}
      >
        {copied === 'dataUri' ? (
          <Check data-icon="inline-start" className="text-primary" />
        ) : (
          <Copy data-icon="inline-start" />
        )}
        {copied === 'dataUri' ? 'Copied Data URI' : 'Copy Data URI'}
      </Button>

      {images.length > 1 && (
        <>
          <Button
            type="button"
            variant="outline"
            className="w-full"
            onClick={() => {
              void copyToClipboard(images.map((img) => img.base64).join('\n')).then(() => flash('allBase64'));
            }}
          >
            {copied === 'allBase64' ? (
              <Check data-icon="inline-start" className="text-primary" />
            ) : (
              <Copy data-icon="inline-start" />
            )}
            {copied === 'allBase64' ? 'Copied All Raw' : 'Copy All Raw Base64'}
          </Button>
          <Button
            type="button"
            variant="outline"
            className="w-full"
            onClick={() => {
              void copyToClipboard(images.map((img) => img.dataUri).join('\n')).then(() => flash('allDataUri'));
            }}
          >
            {copied === 'allDataUri' ? (
              <Check data-icon="inline-start" className="text-primary" />
            ) : (
              <Copy data-icon="inline-start" />
            )}
            {copied === 'allDataUri' ? 'Copied All URIs' : 'Copy All Data URIs'}
          </Button>
        </>
      )}
    </section>
  );
}
