import { formatLabel } from '../helpers';
import { useAnnotatorStore, selectAnnotations } from '../stores';
import { SectionHeading } from './SectionHeading';

export function InfoSection() {
  const image = useAnnotatorStore((s) => s.image);
  const fileName = useAnnotatorStore((s) => s.fileName);
  const exportFormat = useAnnotatorStore((s) => s.exportFormat);
  const sourceKind = useAnnotatorStore((s) => s.sourceKind);
  const pageNumber = useAnnotatorStore((s) => s.pageNumber);
  const numPages = useAnnotatorStore((s) => s.numPages);
  const annotations = useAnnotatorStore(selectAnnotations);

  if (!image) return null;

  return (
    <section className="space-y-2">
      <SectionHeading>Document</SectionHeading>
      <dl className="space-y-1.5 font-mono text-[11px] text-muted-foreground">
        <div className="flex justify-between gap-3">
          <dt>Type</dt>
          <dd className="text-foreground">{sourceKind === 'pdf' ? 'PDF' : 'Image'}</dd>
        </div>
        <div className="flex justify-between gap-3">
          <dt>Size</dt>
          <dd className="text-foreground">
            {image.naturalWidth} × {image.naturalHeight}
          </dd>
        </div>
        {sourceKind === 'pdf' && numPages > 1 && (
          <div className="flex justify-between gap-3">
            <dt>Page</dt>
            <dd className="text-foreground">
              {pageNumber} / {numPages}
            </dd>
          </div>
        )}
        <div className="flex justify-between gap-3">
          <dt>Export</dt>
          <dd className="text-foreground">{formatLabel(exportFormat)}</dd>
        </div>
        <div className="flex justify-between gap-3">
          <dt>Marks</dt>
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
