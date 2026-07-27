import { Check, Copy } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useQrStore } from '../stores';
import { SectionHeading } from './SectionHeading';

export function ContentSection() {
  const text = useQrStore((s) => s.text);
  const copied = useQrStore((s) => s.copied);
  const setText = useQrStore((s) => s.setText);
  const copyText = useQrStore((s) => s.copyText);

  return (
    <section className="space-y-4">
      <SectionHeading className="mb-3">Content</SectionHeading>
      <div className="space-y-2">
        <Label htmlFor="qr-input" className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">
          Content / URL
        </Label>
        <div className="flex gap-2">
          <Input
            id="qr-input"
            type="text"
            placeholder="Enter text or link..."
            value={text}
            onChange={(e) => setText(e.target.value)}
            className="flex-1 font-mono text-sm"
          />
          <Button variant="outline" size="icon" onClick={() => void copyText()} title="Copy content" disabled={!text}>
            {copied ? <Check className="size-4 text-green-600" /> : <Copy className="size-4" />}
          </Button>
        </div>
      </div>
    </section>
  );
}
