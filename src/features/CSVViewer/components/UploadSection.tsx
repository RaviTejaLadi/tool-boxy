import { useRef } from 'react';
import { Upload } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ACCEPT_CSV, SUPPORTED_FORMATS_LABEL } from '../constants';
import { ingestCsvFile } from '../helpers';
import { useCsvStore } from '../stores';
import { SectionHeading } from './SectionHeading';

export function UploadSection() {
  const setParsed = useCsvStore((s) => s.setParsed);
  const setError = useCsvStore((s) => s.setError);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFiles = async (files: FileList | null) => {
    const file = files?.[0];
    const result = await ingestCsvFile(file);
    if ('error' in result) {
      setError(result.error);
      return;
    }
    setParsed(result);
  };

  return (
    <section className="space-y-3">
      <SectionHeading className="mb-3">Upload</SectionHeading>

      <input
        type="file"
        ref={fileInputRef}
        accept={ACCEPT_CSV}
        className="hidden"
        onChange={(e) => {
          void handleFiles(e.target.files);
          e.target.value = '';
        }}
      />

      <Button
        type="button"
        variant="outline"
        className="w-full rounded-none"
        onClick={() => fileInputRef.current?.click()}
      >
        <Upload data-icon="inline-start" />
        Select CSV
      </Button>

      <p className="font-mono text-[11px] leading-relaxed text-muted-foreground">
        Drop onto the preview or select a file. Supports {SUPPORTED_FORMATS_LABEL}.
      </p>
    </section>
  );
}
