import { Blend, Check, Copy } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useGradientStore } from '../stores';

export function GradientGeneratorHeader() {
  const copied = useGradientStore((s) => s.copied);
  const copyCss = useGradientStore((s) => s.copyCss);

  return (
    <header className="flex shrink-0 items-center justify-between border-b border-border px-6 py-3">
      <div className="flex items-center gap-2.5">
        <div className="flex size-7 items-center justify-center bg-primary text-primary-foreground">
          <Blend className="size-4" />
        </div>
        <div>
          <div className="font-heading text-sm leading-none font-semibold">Gradient Generator</div>
          <div className="mt-1 font-mono text-[11px] leading-none text-muted-foreground">
            Linear, corner, and mesh gradients
          </div>
        </div>
      </div>

      <Button size="sm" onClick={() => void copyCss()}>
        {copied ? <Check data-icon="inline-start" /> : <Copy data-icon="inline-start" />}
        {copied ? 'Copied' : 'Copy CSS'}
      </Button>
    </header>
  );
}
