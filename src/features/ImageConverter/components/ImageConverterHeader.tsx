import { Images, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useConverterStore } from '../stores';

export function ImageConverterHeader() {
  const images = useConverterStore((s) => s.images);
  const converted = useConverterStore((s) => s.converted);
  const isConverting = useConverterStore((s) => s.isConverting);
  const clearAll = useConverterStore((s) => s.clearAll);

  const hasContent = images.length > 0 || converted.length > 0;

  return (
    <header className="flex shrink-0 items-center justify-between border-b border-border px-6 py-3">
      <div className="flex items-center gap-2.5">
        <div className="flex size-7 items-center justify-center bg-primary text-primary-foreground">
          <Images className="size-4" />
        </div>
        <div>
          <div className="font-heading text-sm leading-none font-semibold">Image Converter</div>
          <div className="mt-1 font-mono text-[11px] leading-none text-muted-foreground">
            Convert images with resize and format options
          </div>
        </div>
      </div>

      <Button variant="outline" size="sm" onClick={clearAll} disabled={!hasContent || isConverting}>
        <Trash2 data-icon="inline-start" />
        Clear
      </Button>
    </header>
  );
}
