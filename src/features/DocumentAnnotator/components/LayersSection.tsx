import { BringToFront, Copy, SendToBack, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAnnotatorStore, selectAnnotations } from '../stores';
import { SectionHeading } from './SectionHeading';

export function LayersSection() {
  const selectedId = useAnnotatorStore((s) => s.selectedId);
  const annotations = useAnnotatorStore(selectAnnotations);
  const deleteSelected = useAnnotatorStore((s) => s.deleteSelected);
  const duplicateSelected = useAnnotatorStore((s) => s.duplicateSelected);
  const bringForward = useAnnotatorStore((s) => s.bringForward);
  const sendBackward = useAnnotatorStore((s) => s.sendBackward);

  const hasSelection = Boolean(selectedId && annotations.some((a) => a.id === selectedId));

  return (
    <section className="space-y-3">
      <SectionHeading className="mb-1">Selection</SectionHeading>
      <div className="grid grid-cols-2 gap-1.5">
        <Button type="button" variant="outline" size="sm" disabled={!hasSelection} onClick={duplicateSelected}>
          <Copy data-icon="inline-start" />
          Duplicate
        </Button>
        <Button type="button" variant="outline" size="sm" disabled={!hasSelection} onClick={deleteSelected}>
          <Trash2 data-icon="inline-start" />
          Delete
        </Button>
        <Button type="button" variant="outline" size="sm" disabled={!hasSelection} onClick={bringForward}>
          <BringToFront data-icon="inline-start" />
          Forward
        </Button>
        <Button type="button" variant="outline" size="sm" disabled={!hasSelection} onClick={sendBackward}>
          <SendToBack data-icon="inline-start" />
          Backward
        </Button>
      </div>
      <p className="font-mono text-[11px] text-muted-foreground">
        {hasSelection ? 'Ctrl+D duplicate · Del delete' : 'Select an annotation to edit layers'}
      </p>
    </section>
  );
}
