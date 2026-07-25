import { useRef } from 'react';
import { Upload } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ACCEPT_IMAGE, SUPPORTED_FORMATS_LABEL } from '../constants';
import { processImageFile } from '../helpers';
import { useFaviconStore } from '../stores';
import { SectionHeading } from './SectionHeading';

export function UploadSection() {
  const fileName = useFaviconStore((s) => s.fileName);
  const setSource = useFaviconStore((s) => s.setSource);
  const setFavicons = useFaviconStore((s) => s.setFavicons);
  const setGenerating = useFaviconStore((s) => s.setGenerating);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSelect = async (files: FileList | null) => {
    const file = files?.[0];
    if (!file) return;
    setGenerating(true);
    try {
      const result = await processImageFile(file);
      if (!result) return;
      setSource(result.image, result.fileName);
      setFavicons(result.favicons);
    } finally {
      setGenerating(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  return (
    <section className="space-y-3">
      <SectionHeading className="mb-3">Upload</SectionHeading>

      <input
        type="file"
        ref={fileInputRef}
        accept={ACCEPT_IMAGE}
        className="hidden"
        onChange={(e) => {
          void handleSelect(e.target.files);
        }}
      />

      <Button type="button" variant="outline" className="w-full" onClick={() => fileInputRef.current?.click()}>
        <Upload data-icon="inline-start" />
        Select image
      </Button>

      {fileName ? (
        <p className="truncate font-mono text-[11px] text-muted-foreground" title={fileName}>
          {fileName}
        </p>
      ) : (
        <p className="font-mono text-[11px] leading-relaxed text-muted-foreground">
          Drop onto the preview, paste from clipboard, or select a file. Supports {SUPPORTED_FORMATS_LABEL}.
        </p>
      )}

      <p className="font-mono text-[11px] leading-relaxed text-muted-foreground">
        Image is centre-cropped to a square for each size.
      </p>
    </section>
  );
}
