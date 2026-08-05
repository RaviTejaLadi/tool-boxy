import { Button } from '@/components/ui/button';
import { TOOLS } from '../constants';
import { useAnnotatorStore } from '../stores';
import { SectionHeading } from './SectionHeading';

export function ToolsSection() {
  const image = useAnnotatorStore((s) => s.image);
  const tool = useAnnotatorStore((s) => s.tool);
  const setTool = useAnnotatorStore((s) => s.setTool);

  return (
    <section>
      <SectionHeading className="mb-3">Tools</SectionHeading>
      <div className="grid grid-cols-5 gap-1.5">
        {TOOLS.map(({ value, label, shortcut, icon: Icon }) => (
          <Button
            key={value}
            type="button"
            variant={tool === value ? 'default' : 'outline'}
            size="icon"
            title={`${label} (${shortcut})`}
            aria-label={label}
            aria-pressed={tool === value}
            disabled={!image}
            onClick={() => setTool(value)}
            className="size-9"
          >
            <Icon className="size-4" />
          </Button>
        ))}
      </div>
    </section>
  );
}
