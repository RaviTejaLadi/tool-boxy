import { Crop, ImageDown, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { downloadCropped } from '../helpers';
import { useCropStore } from '../stores';

export function ImageCropHeader() {
  const source = useCropStore((s) => s.source);
  const cropped = useCropStore((s) => s.cropped);
  const isProcessing = useCropStore((s) => s.isProcessing);
  const clearAll = useCropStore((s) => s.clearAll);

  const hasContent = source != null || cropped != null;

  return (
    <header className="flex shrink-0 items-center justify-between border-b border-border px-6 py-3">
      <div className="flex items-center gap-2.5">
        <div className="flex size-7 items-center justify-center bg-primary text-primary-foreground">
          <Crop className="size-4" />
        </div>
        <div>
          <div className="font-heading text-sm leading-none font-semibold">Image Crop</div>
          <div className="mt-1 font-mono text-[11px] leading-none text-muted-foreground">
            Crop images with zoom and aspect ratio
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2">
        {cropped && (
          <Button size="sm" onClick={() => downloadCropped(cropped)} disabled={isProcessing}>
            <ImageDown data-icon="inline-start" />
            Download PNG
          </Button>
        )}
        <Button variant="outline" size="sm" onClick={clearAll} disabled={!hasContent || isProcessing}>
          <Trash2 data-icon="inline-start" />
          Clear
        </Button>
      </div>
    </header>
  );
}
