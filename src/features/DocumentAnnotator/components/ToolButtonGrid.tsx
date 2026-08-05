import { Button } from '@/components/ui/button';
import type { ToolDef } from '../constants';
import type { Tool } from '../types';

export function ToolButtonGrid({
  items,
  tool,
  disabled,
  onSelect,
}: {
  items: ToolDef[];
  tool: Tool;
  disabled?: boolean;
  onSelect: (tool: Tool) => void;
  columns?: 4 | 5;
}) {
  return (
    <div className="flex flex-wrap content-start gap-1">
      {items.map(({ value, label, shortcut, icon: Icon }) => (
        <Button
          key={value}
          type="button"
          variant={tool === value ? 'default' : 'outline'}
          size="icon"
          title={`${label} (${shortcut})`}
          aria-label={label}
          aria-pressed={tool === value}
          disabled={disabled}
          onClick={() => onSelect(value)}
          className="size-8 shrink-0"
        >
          <Icon className="size-3.5" />
        </Button>
      ))}
    </div>
  );
}
