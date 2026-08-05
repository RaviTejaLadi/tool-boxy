import { Button } from '@/components/ui/button';
import { ALL_TOOLS, SHAPES } from '../constants';
import { useAnnotatorStore } from '../stores';
import { SectionHeading } from './SectionHeading';

export function ShapesSection() {
  const image = useAnnotatorStore((s) => s.image);
  const tool = useAnnotatorStore((s) => s.tool);
  const setTool = useAnnotatorStore((s) => s.setTool);
  const activeLabel = ALL_TOOLS.find((t) => t.value === tool)?.label ?? tool;

  return (
    <section>
      <SectionHeading className="mb-3">Shapes</SectionHeading>
      <div className="grid grid-cols-4 gap-1.5">
        {SHAPES.map(({ value, label, shortcut, icon: Icon }) => (
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
      <p className="mt-2 font-mono text-[11px] text-muted-foreground">Active: {activeLabel}</p>
    </section>
  );
}
