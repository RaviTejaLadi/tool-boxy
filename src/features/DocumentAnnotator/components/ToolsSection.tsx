import { TOOLS } from '../constants';
import { useAnnotatorStore, selectHasDocument } from '../stores';
import { SectionHeading } from './SectionHeading';
import { ToolButtonGrid } from './ToolButtonGrid';

export function ToolsSection() {
  const hasDocument = useAnnotatorStore(selectHasDocument);
  const tool = useAnnotatorStore((s) => s.tool);
  const setTool = useAnnotatorStore((s) => s.setTool);

  return (
    <section className="space-y-2">
      <SectionHeading>Tools</SectionHeading>
      <ToolButtonGrid items={TOOLS} tool={tool} disabled={!hasDocument} onSelect={setTool} />
    </section>
  );
}
