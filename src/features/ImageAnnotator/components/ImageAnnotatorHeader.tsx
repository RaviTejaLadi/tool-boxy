import { ImageDown, PenLine, Redo2, Trash2, Undo2, Upload } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { formatLabel } from '../helpers';
import { useAnnotatorStore, selectAnnotations, selectCanUndo, selectCanRedo } from '../stores';

export function ImageAnnotatorHeader({ onUpload, onDownload }: { onUpload: () => void; onDownload: () => void }) {
  const image = useAnnotatorStore((s) => s.image);
  const fileName = useAnnotatorStore((s) => s.fileName);
  const exportFormat = useAnnotatorStore((s) => s.exportFormat);
  const annotations = useAnnotatorStore(selectAnnotations);
  const canUndo = useAnnotatorStore(selectCanUndo);
  const canRedo = useAnnotatorStore(selectCanRedo);
  const undo = useAnnotatorStore((s) => s.undo);
  const redo = useAnnotatorStore((s) => s.redo);
  const confirmClear = useAnnotatorStore((s) => s.confirmClear);
  const setConfirmClear = useAnnotatorStore((s) => s.setConfirmClear);
  const clearAnnotations = useAnnotatorStore((s) => s.clearAnnotations);

  return (
    <header className="flex shrink-0 items-center justify-between gap-3 border-b border-border px-6 py-3">
      <div className="flex min-w-0 items-center gap-2.5">
        <div className="flex size-7 shrink-0 items-center justify-center bg-primary text-primary-foreground">
          <PenLine className="size-4" />
        </div>
        <div className="min-w-0">
          <div className="font-heading text-sm leading-none font-semibold">Image Annotator</div>
          <div className="mt-1 truncate font-mono text-[11px] leading-none text-muted-foreground">
            {image
              ? `${fileName || 'image'} · ${annotations.length} annotation${annotations.length === 1 ? '' : 's'}`
              : 'Drop, paste, or upload an image — annotate in the browser'}
          </div>
        </div>
      </div>

      <div className="flex shrink-0 items-center gap-2">
        <Button variant="outline" size="icon" className="size-8" disabled={!canUndo} onClick={undo} title="Undo">
          <Undo2 className="size-4" />
        </Button>
        <Button variant="outline" size="icon" className="size-8" disabled={!canRedo} onClick={redo} title="Redo">
          <Redo2 className="size-4" />
        </Button>
        <Button
          variant="outline"
          size="icon"
          className={`size-8 hidden sm:flex ${confirmClear ? 'text-destructive' : ''}`}
          disabled={!image || annotations.length === 0}
          title={confirmClear ? 'Click again to confirm' : 'Clear all annotations'}
          onClick={() => {
            if (!confirmClear) {
              setConfirmClear(true);
              window.setTimeout(() => setConfirmClear(false), 2500);
              return;
            }
            clearAnnotations();
          }}
        >
          <Trash2 className="size-4" />
        </Button>

        <Button variant="outline" size="sm" onClick={onUpload}>
          <Upload data-icon="inline-start" />
          {image ? 'Replace' : 'Upload'}
        </Button>
        <Button size="sm" disabled={!image} onClick={onDownload}>
          <ImageDown data-icon="inline-start" />
          Export {formatLabel(exportFormat)}
        </Button>
      </div>
    </header>
  );
}
