import { useState } from 'react';
import { Globe, ImageDown, Loader2, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { downloadAllFavicons } from '../helpers';
import { useFaviconStore } from '../stores';

export function FaviconGeneratorHeader() {
  const image = useFaviconStore((s) => s.image);
  const favicons = useFaviconStore((s) => s.favicons);
  const clear = useFaviconStore((s) => s.clear);
  const isGenerating = useFaviconStore((s) => s.isGenerating);
  const [isDownloading, setIsDownloading] = useState(false);

  const hasContent = Boolean(image) || favicons.length > 0;

  const handleDownloadAll = async () => {
    if (!image) return;
    setIsDownloading(true);
    try {
      await downloadAllFavicons(image);
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <header className="flex shrink-0 items-center justify-between border-b border-border px-6 py-3">
      <div className="flex items-center gap-2.5">
        <div className="flex size-7 items-center justify-center bg-primary text-primary-foreground">
          <Globe className="size-4" />
        </div>
        <div>
          <div className="font-heading text-sm leading-none font-semibold">Favicon Generator</div>
          <div className="mt-1 font-mono text-[11px] leading-none text-muted-foreground">
            Generate favicons from any image
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <Button variant="outline" size="sm" onClick={clear} disabled={!hasContent || isDownloading}>
          <Trash2 data-icon="inline-start" />
          Clear
        </Button>
        <Button
          size="sm"
          onClick={() => void handleDownloadAll()}
          disabled={!image || favicons.length === 0 || isGenerating || isDownloading}
        >
          {isDownloading ? (
            <Loader2 data-icon="inline-start" className="animate-spin" />
          ) : (
            <ImageDown data-icon="inline-start" />
          )}
          {isDownloading ? 'Zipping…' : 'Download All'}
        </Button>
      </div>
    </header>
  );
}
