import { Key, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useJwtStore } from '../stores';

export function JWTDecoderHeader() {
  const clear = useJwtStore((s) => s.clear);

  return (
    <header className="flex shrink-0 items-center justify-between border-b border-border px-6 py-3">
      <div className="flex items-center gap-2.5">
        <div className="flex size-7 items-center justify-center bg-primary text-primary-foreground">
          <Key className="size-4" />
        </div>
        <div>
          <div className="font-heading text-sm leading-none font-semibold">JWT Decoder</div>
          <div className="mt-1 font-mono text-[11px] leading-none text-muted-foreground">
            Decode and inspect JWT tokens
          </div>
        </div>
      </div>

      <Button variant="outline" size="sm" onClick={clear}>
        <Trash2 data-icon="inline-start" />
        Reset
      </Button>
    </header>
  );
}
