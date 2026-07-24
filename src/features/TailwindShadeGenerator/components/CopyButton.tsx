import { Check, Copy } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useShadeStore } from '../stores';

async function copyText(text: string, id: string, flashCopied: (id: string) => void) {
  try {
    await navigator.clipboard.writeText(text);
  } catch {
    // clipboard may be unavailable — still flash UI
  }
  flashCopied(id);
}

export function CopyButton({ text, id, className = '' }: { text: string; id: string; className?: string }) {
  const copiedId = useShadeStore((s) => s.copiedId);
  const flashCopied = useShadeStore((s) => s.flashCopied);
  const copied = copiedId === id;

  return (
    <Button
      type="button"
      variant="ghost"
      size="sm"
      onClick={() => void copyText(text, id, flashCopied)}
      className={cn('h-7 gap-1.5 px-2 text-xs text-muted-foreground hover:text-foreground', className)}
    >
      {copied ? <Check className="size-3.5 text-primary" /> : <Copy className="size-3.5" />}
      {copied ? 'Copied' : 'Copy'}
    </Button>
  );
}
