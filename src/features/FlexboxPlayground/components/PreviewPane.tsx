import { ITEM_COLORS } from '../constants';
import { useFlexboxPlaygroundStore } from '../stores';

export function PreviewPane() {
  const flexDirection = useFlexboxPlaygroundStore((s) => s.flexDirection);
  const flexWrap = useFlexboxPlaygroundStore((s) => s.flexWrap);
  const justifyContent = useFlexboxPlaygroundStore((s) => s.justifyContent);
  const alignItems = useFlexboxPlaygroundStore((s) => s.alignItems);
  const alignContent = useFlexboxPlaygroundStore((s) => s.alignContent);
  const gap = useFlexboxPlaygroundStore((s) => s.gap);
  const itemCount = useFlexboxPlaygroundStore((s) => s.itemCount);
  const itemWidth = useFlexboxPlaygroundStore((s) => s.itemWidth);
  const itemHeight = useFlexboxPlaygroundStore((s) => s.itemHeight);
  const itemGrow = useFlexboxPlaygroundStore((s) => s.itemGrow);
  const itemShrink = useFlexboxPlaygroundStore((s) => s.itemShrink);
  const itemBasis = useFlexboxPlaygroundStore((s) => s.itemBasis);
  const alignSelf = useFlexboxPlaygroundStore((s) => s.alignSelf);

  const itemStyle = {
    width: itemWidth,
    height: itemHeight,
    flexGrow: itemGrow,
    flexShrink: itemShrink,
    flexBasis: itemBasis !== 'auto' ? itemBasis : 'auto',
    alignSelf: alignSelf !== 'auto' ? alignSelf : undefined,
  };

  const summary = `${flexDirection} · ${justifyContent} · gap ${gap}px`;

  return (
    <div className="relative flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden bg-muted/40">
      <div
        className="flex min-h-0 flex-1 flex-col overflow-auto"
        style={{
          backgroundImage:
            'radial-gradient(circle, color-mix(in oklab, var(--foreground) 8%, transparent) 1px, transparent 1px)',
          backgroundSize: '22px 22px',
        }}
      >
        <div className="flex min-h-0 flex-1 flex-col items-center justify-center p-6 lg:p-10">
          <div
            className="min-h-[min(420px,55vh)] w-full max-w-4xl border border-dashed border-border bg-background/80 p-4 transition-all duration-300"
            style={{
              display: 'flex',
              flexDirection: flexDirection as React.CSSProperties['flexDirection'],
              flexWrap: flexWrap as React.CSSProperties['flexWrap'],
              justifyContent: justifyContent as React.CSSProperties['justifyContent'],
              alignItems: alignItems as React.CSSProperties['alignItems'],
              alignContent: alignContent as React.CSSProperties['alignContent'],
              gap: `${gap}px`,
            }}
          >
            {Array.from({ length: itemCount }, (_, i) => (
              <div
                key={i}
                className="flex items-center justify-center rounded-lg font-heading text-lg font-semibold text-primary-foreground shadow-sm transition-all duration-300"
                style={{
                  ...itemStyle,
                  backgroundColor: ITEM_COLORS[i % ITEM_COLORS.length],
                }}
              >
                {i + 1}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="pointer-events-none absolute bottom-3 left-1/2 max-w-[min(100%-1.5rem,32rem)] -translate-x-1/2">
        <span className="block truncate rounded-none border border-border bg-background/90 px-2 py-1 font-mono text-[11px] text-muted-foreground shadow-sm backdrop-blur-sm">
          {summary}
        </span>
      </div>
    </div>
  );
}
