import { useRef } from 'react';
import { Upload } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ACCEPT_IMAGE, SUPPORTED_FORMATS_LABEL } from '../constants';
import { processFiles } from '../helpers';
import { useConverterStore } from '../stores';
import { SectionHeading } from './SectionHeading';

export function UploadSection() {
  const addImages = useConverterStore((s) => s.addImages);
  const fileInputRef = useRef<HTMLInputElement>(null);

  return (
    <section className="space-y-3">
      <SectionHeading className="mb-3">Upload</SectionHeading>

      <input
        type="file"
        ref={fileInputRef}
        accept={ACCEPT_IMAGE}
        multiple
        className="hidden"
        onChange={(e) => {
          void processFiles(e.target.files).then(({ images }) => {
            if (images.length > 0) addImages(images);
          });
          e.target.value = '';
        }}
      />

      <Button type="button" variant="outline" className="w-full" onClick={() => fileInputRef.current?.click()}>
        <Upload data-icon="inline-start" />
        Select images
      </Button>

      <p className="font-mono text-[11px] leading-relaxed text-muted-foreground">
        Drop onto the preview, paste from clipboard, or select files. Supports {SUPPORTED_FORMATS_LABEL}.
      </p>
    </section>
  );
}
