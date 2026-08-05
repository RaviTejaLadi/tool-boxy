import { Separator } from '@/components/ui/separator';
import { formatBytes, getLanguage } from '../helpers';
import { useCodeViewerStore } from '../stores';
import { SectionHeading } from './SectionHeading';

export function InfoSection() {
  const folderName = useCodeViewerStore((s) => s.folderName);
  const fileCount = useCodeViewerStore((s) => s.fileCount);
  const selectedFile = useCodeViewerStore((s) => s.selectedFile);

  return (
    <section>
      <Separator />
      <SectionHeading className="my-3">Info</SectionHeading>
      <div className="space-y-1.5 font-mono text-xs text-muted-foreground">
        <p>{folderName ? `${folderName} · ${fileCount} files` : 'No folder loaded'}</p>
        {selectedFile ? (
          <>
            <p className="break-all">{selectedFile.path}</p>
            <p>
              {selectedFile.kind ?? 'text'}
              {selectedFile.kind === 'text' || selectedFile.kind === 'svg'
                ? ` · ${getLanguage(selectedFile.name)}`
                : ''}
              {typeof selectedFile.size === 'number' ? ` · ${formatBytes(selectedFile.size)}` : ''}
            </p>
          </>
        ) : (
          <p>No file selected</p>
        )}
      </div>
    </section>
  );
}
