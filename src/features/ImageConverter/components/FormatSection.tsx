import { useState } from 'react';
import { ImageDown, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { getFormat, OUTPUT_FORMATS, type OutputFormatId } from '../constants';
import { convertImages, downloadAllConverted } from '../helpers';
import { useConverterStore } from '../stores';
import { SectionHeading } from './SectionHeading';

export function FormatSection() {
  const images = useConverterStore((s) => s.images);
  const converted = useConverterStore((s) => s.converted);
  const formatId = useConverterStore((s) => s.formatId);
  const resizeMode = useConverterStore((s) => s.resizeMode);
  const resizeWidth = useConverterStore((s) => s.resizeWidth);
  const resizeHeight = useConverterStore((s) => s.resizeHeight);
  const scalePercent = useConverterStore((s) => s.scalePercent);
  const preserveTransparency = useConverterStore((s) => s.preserveTransparency);
  const quality = useConverterStore((s) => s.quality);
  const isConverting = useConverterStore((s) => s.isConverting);
  const setFormatId = useConverterStore((s) => s.setFormatId);
  const setConverting = useConverterStore((s) => s.setConverting);
  const setConverted = useConverterStore((s) => s.setConverted);
  const [isDownloading, setIsDownloading] = useState(false);

  const format = getFormat(formatId);

  const handleConvert = async () => {
    if (images.length === 0 || !format.convertible) return;
    setConverting(true);
    try {
      const results = await convertImages(images, {
        formatId,
        resizeMode,
        width: resizeWidth,
        height: resizeHeight,
        scalePercent,
        preserveTransparency,
        quality,
      });
      setConverted(results);
    } finally {
      setConverting(false);
    }
  };

  const handleDownloadAll = async () => {
    if (converted.length === 0) return;
    setIsDownloading(true);
    try {
      await downloadAllConverted(converted);
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <section className="space-y-3">
      <SectionHeading className="mb-3">Convert to</SectionHeading>

      <div className="grid grid-cols-2 gap-1.5">
        {OUTPUT_FORMATS.map((item) => {
          const isActive = formatId === item.id;
          return (
            <Button
              key={item.id}
              type="button"
              variant={isActive ? 'default' : 'outline'}
              size="sm"
              disabled={!item.convertible}
              title={item.convertible ? item.label : `${item.label} is not supported in-browser`}
              className="justify-start px-2 font-mono text-xs"
              onClick={() => setFormatId(item.id as OutputFormatId)}
            >
              {item.label}
            </Button>
          );
        })}
      </div>

      <p className="font-mono text-[11px] leading-relaxed text-muted-foreground">
        JXL, GIF, TIFF, and ICNS encoding is not available in the browser.
      </p>

      <div className="flex flex-col gap-2 pt-1">
        <Button
          type="button"
          size="sm"
          className="w-full"
          onClick={() => void handleConvert()}
          disabled={images.length === 0 || !format.convertible || isConverting || isDownloading}
        >
          {isConverting ? <Loader2 data-icon="inline-start" className="animate-spin" /> : null}
          {isConverting ? 'Converting…' : `Convert to ${format.label}`}
        </Button>
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="w-full"
          onClick={() => void handleDownloadAll()}
          disabled={converted.length === 0 || isConverting || isDownloading}
        >
          {isDownloading ? (
            <Loader2 data-icon="inline-start" className="animate-spin" />
          ) : (
            <ImageDown data-icon="inline-start" />
          )}
          {isDownloading ? 'Preparing…' : 'Download All'}
        </Button>
      </div>
    </section>
  );
}
