import { useRef } from 'react';
import { FolderUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ingestFolder } from '../helpers';
import { useCodeViewerStore } from '../stores';
import { SectionHeading } from './SectionHeading';

export function UploadSection() {
  const isLoading = useCodeViewerStore((s) => s.isLoading);
  const setFolder = useCodeViewerStore((s) => s.setFolder);
  const setError = useCodeViewerStore((s) => s.setError);
  const setLoading = useCodeViewerStore((s) => s.setLoading);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFiles = async (files: FileList | null) => {
    setLoading(true);
    const result = await ingestFolder(files);
    if ('error' in result) {
      setError(result.error);
      return;
    }
    setFolder(result);
  };

  return (
    <section className="space-y-3">
      <SectionHeading className="mb-3">Upload</SectionHeading>

      <input
        type="file"
        ref={fileInputRef}
        className="hidden"
        multiple
        // @ts-expect-error — non-standard directory picker attributes
        webkitdirectory=""
        directory=""
        onChange={(e) => {
          void handleFiles(e.target.files);
          e.target.value = '';
        }}
      />

      <Button
        type="button"
        variant="outline"
        className="w-full rounded-none"
        disabled={isLoading}
        onClick={() => fileInputRef.current?.click()}
      >
        <FolderUp data-icon="inline-start" />
        {isLoading ? 'Loading…' : 'Select folder'}
      </Button>

      <p className="font-mono text-[11px] leading-relaxed text-muted-foreground">
        Local-only audit: Project DNA, content search, TODO/secret findings, markdown preview, and LLM digest export.
      </p>
    </section>
  );
}
