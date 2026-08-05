// @ts-nocheck — typed gradually
const HANDLES = [
  { corner: 'nw', className: '-left-1.5 -top-1.5 cursor-nwse-resize' },
  { corner: 'ne', className: '-right-1.5 -top-1.5 cursor-nesw-resize' },
  { corner: 'sw', className: '-left-1.5 -bottom-1.5 cursor-nesw-resize' },
  { corner: 'se', className: '-right-1.5 -bottom-1.5 cursor-nwse-resize' },
];

export function SelectionOverlay({ label, typeLabel, onResizeStart }) {
  return (
    <div className="pointer-events-none absolute inset-0 z-20">
      {/* Bounding box — high contrast on any background */}
      <div
        className="absolute inset-0 border-2 border-primary"
        style={{
          boxShadow:
            '0 0 0 1px color-mix(in oklab, var(--background) 90%, transparent), 0 0 0 3px color-mix(in oklab, var(--primary) 35%, transparent)',
        }}
      />

      {/* Type badge */}
      <div className="absolute -top-7 left-0 flex max-w-full items-center gap-1.5">
        <span className="shrink-0 rounded-sm bg-primary px-1.5 py-0.5 font-mono text-[9px] font-semibold tracking-wide text-primary-foreground uppercase">
          {typeLabel}
        </span>
        <span className="truncate rounded-sm bg-background/95 px-1.5 py-0.5 font-mono text-[9px] text-foreground shadow-sm ring-1 ring-border">
          {label}
        </span>
      </div>

      {/* Corner resize handles */}
      {HANDLES.map(({ corner, className }) => (
        <div
          key={corner}
          role="button"
          aria-label={`Resize ${corner}`}
          onMouseDown={(e) => onResizeStart(e, corner)}
          className={`pointer-events-auto absolute size-3 rounded-sm border-2 border-primary bg-background shadow-sm ${className}`}
        />
      ))}

      {/* Edge midpoint guides (visual only) */}
      <div className="absolute top-1/2 -left-px h-3 w-0.5 -translate-y-1/2 bg-primary/60" />
      <div className="absolute top-1/2 -right-px h-3 w-0.5 -translate-y-1/2 bg-primary/60" />
      <div className="absolute -top-px left-1/2 h-0.5 w-3 -translate-x-1/2 bg-primary/60" />
      <div className="absolute -bottom-px left-1/2 h-0.5 w-3 -translate-x-1/2 bg-primary/60" />
    </div>
  );
}

export function HoverOutline() {
  return (
    <div
      className="pointer-events-none absolute inset-0 z-10 border border-dashed border-primary/70"
      style={{
        boxShadow: 'inset 0 0 0 1px color-mix(in oklab, var(--background) 60%, transparent)',
      }}
    />
  );
}
