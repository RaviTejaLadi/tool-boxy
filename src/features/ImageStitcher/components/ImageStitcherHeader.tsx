import { useState } from 'react';
import { Download, Layers, Loader2, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { getFormat } from '../constants';
import { downloadExport, stitchImages } from '../helpers';
import { useStitcherStore } from '../stores';

function ImageStitcherHeader() {
  const images = useStitcherStore((s) => s.images);
  const formatId = useStitcherStore((s) => s.formatId);
  const clearAll = useStitcherStore((s) => s.clearAll);
  const setError = useStitcherStore((s) => s.setError);
  const [isExporting, setIsExporting] = useState(false);

  const format = getFormat(formatId);
  const canExport = images.length > 0;

  const handleDownload = async () => {
    if (!canExport || isExporting) return;
    setIsExporting(true);
    setError(null);
    try {
      const exported = await stitchImages(images, { formatId });
      downloadExport(exported);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to export stitch');
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <header className="flex shrink-0 items-center justify-between gap-3 border-b border-border px-6 py-3">
      <div className="flex min-w-0 items-center gap-2.5">
        <div className="flex size-7 shrink-0 items-center justify-center bg-primary text-primary-foreground">
          <Layers className="size-4" />
        </div>
        <div className="min-w-0">
          <div className="font-heading text-sm leading-none font-semibold">Image Stitcher</div>
          <div className="mt-1 font-mono text-[11px] leading-none text-muted-foreground">
            Combine multiple images into one
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <Button variant="outline" size="sm" onClick={clearAll} disabled={images.length === 0 || isExporting}>
          <Trash2 data-icon="inline-start" />
          Clear
        </Button>
        <Button size="sm" onClick={() => void handleDownload()} disabled={!canExport || isExporting}>
          {isExporting ? (
            <Loader2 data-icon="inline-start" className="animate-spin" />
          ) : (
            <Download data-icon="inline-start" />
          )}
          {isExporting ? 'Exporting…' : `Download ${format.label}`}
        </Button>
      </div>
    </header>
  );
}

export { ImageStitcherHeader };
