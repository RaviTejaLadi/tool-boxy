import { formatLabel } from '../helpers';
import { useAnnotatorStore, selectAnnotations } from '../stores';
import { SectionHeading } from './SectionHeading';

export function InfoSection() {
  const image = useAnnotatorStore((s) => s.image);
  const fileName = useAnnotatorStore((s) => s.fileName);
  const exportFormat = useAnnotatorStore((s) => s.exportFormat);
  const annotations = useAnnotatorStore(selectAnnotations);

  if (!image) return null;

  return (
    <section>
      <SectionHeading className="mb-3">Image</SectionHeading>
      <dl className="space-y-1.5 font-mono text-[11px] text-muted-foreground">
        <div className="flex justify-between gap-3">
          <dt>Size</dt>
          <dd className="text-foreground">
            {image.naturalWidth} × {image.naturalHeight}
          </dd>
        </div>
        <div className="flex justify-between gap-3">
          <dt>Format</dt>
          <dd className="text-foreground">{formatLabel(exportFormat)}</dd>
        </div>
        <div className="flex justify-between gap-3">
          <dt>Annotations</dt>
          <dd className="text-foreground">{annotations.length}</dd>
        </div>
        <div className="flex justify-between gap-3">
          <dt className="shrink-0">File</dt>
          <dd className="truncate text-right text-foreground" title={fileName}>
            {fileName}
          </dd>
        </div>
      </dl>
    </section>
  );
}
