import { Check, Copy, Fingerprint, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useUuidStore } from '../stores';

export function UUIDGeneratorHeader() {
  const activeVersion = useUuidStore((s) => s.activeVersion);
  const uuidV4 = useUuidStore((s) => s.uuidV4);
  const uuidV7 = useUuidStore((s) => s.uuidV7);
  const generateActive = useUuidStore((s) => s.generateActive);
  const copyActive = useUuidStore((s) => s.copyActive);
  const copied = useUuidStore((s) => s.copied);
  const activeUuid = activeVersion === 'v4' ? uuidV4 : uuidV7;

  return (
    <header className="flex shrink-0 items-center justify-between border-b border-border px-6 py-3">
      <div className="flex items-center gap-2.5">
        <div className="flex size-7 items-center justify-center bg-primary text-primary-foreground">
          <Fingerprint className="size-4" />
        </div>
        <div>
          <div className="font-heading text-sm leading-none font-semibold">UUID Generator</div>
          <div className="mt-1 font-mono text-[11px] leading-none text-muted-foreground">
            Generate v4 and v7 identifiers
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <Button variant="outline" size="sm" onClick={generateActive}>
          <RefreshCw data-icon="inline-start" />
          Generate
        </Button>
        <Button size="sm" onClick={copyActive} disabled={!activeUuid}>
          {copied ? <Check data-icon="inline-start" /> : <Copy data-icon="inline-start" />}
          {copied ? 'Copied' : 'Copy'}
        </Button>
      </div>
    </header>
  );
}
