import { useState } from 'react';
import { ChevronDown, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { typeLabel } from '../helpers';

type JsonTreeProps = {
  data: unknown;
  name?: string | number | false;
  defaultExpanded?: boolean;
  depth?: number;
};

function ValueNode({ value }: { value: unknown }) {
  if (value === null) {
    return <span className="text-muted-foreground">null</span>;
  }
  if (typeof value === 'boolean') {
    return <span className="text-amber-600 dark:text-amber-400">{String(value)}</span>;
  }
  if (typeof value === 'number') {
    return <span className="text-blue-600 dark:text-blue-400">{value}</span>;
  }
  if (typeof value === 'string') {
    return <span className="text-emerald-700 dark:text-emerald-400">"{value}"</span>;
  }
  return <span className="text-foreground">{String(value)}</span>;
}

function JsonTreeNode({ data, name = false, defaultExpanded = true, depth = 0 }: JsonTreeProps) {
  const isExpandable = data !== null && typeof data === 'object';
  const [open, setOpen] = useState(defaultExpanded);

  if (!isExpandable) {
    return (
      <div className="flex items-baseline gap-1.5 font-mono text-[13px] leading-6">
        {name !== false && (
          <>
            <span className="text-primary">{typeof name === 'number' ? name : `"${name}"`}</span>
            <span className="text-muted-foreground">:</span>
          </>
        )}
        <ValueNode value={data} />
      </div>
    );
  }

  const entries = Array.isArray(data)
    ? data.map((item, index) => [index, item] as const)
    : Object.entries(data as Record<string, unknown>);
  const bracketOpen = Array.isArray(data) ? '[' : '{';
  const bracketClose = Array.isArray(data) ? ']' : '}';
  const sizeLabel = typeLabel(data);

  return (
    <div className="font-mono text-[13px] leading-6">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="group flex w-full items-baseline gap-1 text-left hover:bg-muted/50"
      >
        <span className="inline-flex size-4 shrink-0 items-center justify-center text-muted-foreground">
          {open ? <ChevronDown className="size-3.5" /> : <ChevronRight className="size-3.5" />}
        </span>
        {name !== false && (
          <>
            <span className="text-primary">{typeof name === 'number' ? name : `"${name}"`}</span>
            <span className="text-muted-foreground">:</span>
          </>
        )}
        <span className="text-muted-foreground">{bracketOpen}</span>
        {!open && (
          <>
            <span className="text-muted-foreground/70">…</span>
            <span className="text-muted-foreground">{bracketClose}</span>
            <span className="ml-1 text-[11px] text-muted-foreground/60">{sizeLabel}</span>
          </>
        )}
        {open && <span className="ml-1 text-[11px] text-muted-foreground/60">{sizeLabel}</span>}
      </button>

      {open && (
        <div className={cn('border-l border-border/60', depth === 0 ? 'ml-2' : 'ml-4')}>
          <div className="pl-3">
            {entries.map(([key, value]) => (
              <JsonTreeNode
                key={String(key)}
                data={value}
                name={key}
                defaultExpanded={defaultExpanded}
                depth={depth + 1}
              />
            ))}
          </div>
          <div className="pl-4 text-muted-foreground">{bracketClose}</div>
        </div>
      )}
    </div>
  );
}

export function JsonTree({ data, defaultExpanded = true }: { data: unknown; defaultExpanded?: boolean }) {
  return <JsonTreeNode data={data} name={false} defaultExpanded={defaultExpanded} depth={0} />;
}
