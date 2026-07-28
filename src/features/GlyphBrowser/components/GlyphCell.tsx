import { Check, Copy } from 'lucide-react';
import { useState } from 'react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { getCharacterFormats } from '../helpers';

const COPY_ACTIONS = [
  { id: 'char', label: 'Char', getValue: (f: ReturnType<typeof getCharacterFormats>) => f.char },
  { id: 'html', label: 'HTML', getValue: (f: ReturnType<typeof getCharacterFormats>) => f.html },
  { id: 'css', label: 'CSS', getValue: (f: ReturnType<typeof getCharacterFormats>) => f.css },
  { id: 'js', label: 'JS', getValue: (f: ReturnType<typeof getCharacterFormats>) => f.js },
] as const;

type CopyActionId = (typeof COPY_ACTIONS)[number]['id'];

async function copyText(text: string) {
  try {
    await navigator.clipboard.writeText(text);
  } catch {
    // clipboard may be unavailable
  }
}

type GlyphCellProps = {
  glyph: string;
  cellKey: string;
  className?: string;
};

export function GlyphCell({ glyph, cellKey, className }: GlyphCellProps) {
  const [open, setOpen] = useState(false);
  const [copiedId, setCopiedId] = useState<CopyActionId | null>(null);
  const formats = getCharacterFormats(glyph);

  const handleCopy = async (id: CopyActionId, text: string) => {
    await copyText(text);
    setCopiedId(id);
    window.setTimeout(() => setCopiedId(null), 1500);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger
        aria-label={`${formats.unicodeLabel}, decimal ${formats.decimalLabel}`}
        className={cn(
          'flex aspect-square cursor-pointer items-center justify-center border border-border bg-muted/40 text-lg transition-colors hover:border-primary/50 hover:text-primary sm:text-xl',
          open && 'border-primary/60 bg-primary/15 text-primary',
          className
        )}
      >
        {glyph}
      </PopoverTrigger>
      <PopoverContent side="top" align="center" sideOffset={6} className="w-52 gap-0 p-0">
        <div className="flex items-center gap-3 px-3 py-3">
          <span className="text-3xl leading-none" aria-hidden>
            {glyph}
          </span>
          <div className="min-w-0">
            <p className="font-mono text-sm font-semibold tracking-tight">{formats.unicodeLabel}</p>
            <p className="mt-0.5 font-mono text-[11px] text-muted-foreground">Decimal: {formats.decimalLabel}</p>
          </div>
        </div>
        <div className="grid grid-cols-2 border-t border-border">
          {COPY_ACTIONS.map(({ id, label, getValue }) => {
            const copied = copiedId === id;
            return (
              <button
                key={`${cellKey}-${id}`}
                type="button"
                className="flex items-center gap-2 border-border px-3 py-2.5 text-left text-xs font-medium transition-colors hover:bg-muted/60 [&:nth-child(odd)]:border-r [&:nth-child(-n+2)]:border-b"
                onClick={() => void handleCopy(id, getValue(formats))}
              >
                {copied ? (
                  <Check className="size-3.5 shrink-0 text-primary" aria-hidden />
                ) : (
                  <Copy className="size-3.5 shrink-0 text-muted-foreground" aria-hidden />
                )}
                {label}
              </button>
            );
          })}
        </div>
      </PopoverContent>
    </Popover>
  );
}
