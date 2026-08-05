import { ALL_TOOLS, SHAPES } from '../constants';
import { useAnnotatorStore, selectHasDocument } from '../stores';
import { SectionHeading } from './SectionHeading';
import { ToolButtonGrid } from './ToolButtonGrid';

export function ShapesSection() {
  const hasDocument = useAnnotatorStore(selectHasDocument);
  const tool = useAnnotatorStore((s) => s.tool);
  const setTool = useAnnotatorStore((s) => s.setTool);
  const activeLabel = ALL_TOOLS.find((t) => t.value === tool)?.label ?? tool;

  return (
    <section className="space-y-2">
      <SectionHeading>Shapes</SectionHeading>
      <ToolButtonGrid items={SHAPES} tool={tool} disabled={!hasDocument} onSelect={setTool} />
      <p className="font-mono text-[11px] text-muted-foreground">Active: {activeLabel}</p>
    </section>
  );
}
