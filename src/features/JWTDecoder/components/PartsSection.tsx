import { Check, Copy } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import type { JwtPart } from '../helpers';
import { useJwtStore } from '../stores';
import { SectionHeading } from './SectionHeading';

const PARTS: { id: JwtPart; label: string }[] = [
  { id: 'header', label: 'Header' },
  { id: 'payload', label: 'Payload' },
  { id: 'signature', label: 'Signature' },
];

export function PartsSection() {
  const activePart = useJwtStore((s) => s.activePart);
  const decodedData = useJwtStore((s) => s.decodedData);
  const copied = useJwtStore((s) => s.copied);
  const setActivePart = useJwtStore((s) => s.setActivePart);
  const copyActivePart = useJwtStore((s) => s.copyActivePart);

  return (
    <section className="space-y-4">
      <div className="flex items-end justify-between gap-2">
        <SectionHeading className="mb-0 flex-1">Parts</SectionHeading>
        <Button
          variant="ghost"
          size="icon"
          className="size-7 shrink-0"
          onClick={copyActivePart}
          disabled={!decodedData}
          aria-label="Copy active part"
        >
          {copied ? <Check className="size-3.5" /> : <Copy className="size-3.5" />}
        </Button>
      </div>

      <Tabs
        value={activePart}
        onValueChange={(value) => {
          if (value) setActivePart(value as JwtPart);
        }}
      >
        <TabsList className="grid w-full grid-cols-3 rounded-none">
          {PARTS.map((part) => (
            <TabsTrigger key={part.id} value={part.id} className="rounded-none font-mono text-[11px]">
              {part.label}
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>

      <p className="font-mono text-[11px] text-muted-foreground">
        Select a part to preview. Use copy to clipboard from the header above.
      </p>
    </section>
  );
}
