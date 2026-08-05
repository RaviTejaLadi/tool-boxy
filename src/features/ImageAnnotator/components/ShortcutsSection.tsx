import { SectionHeading } from './SectionHeading';

const ROWS = [
  ['V / H', 'Select / Pan'],
  ['P / T / E', 'Pen / Text / Eraser'],
  ['R / O', 'Rect / Ellipse'],
  ['L / A', 'Line / Arrow'],
  ['G / N / X', 'Highlight / Callout / Redact'],
  ['Space', 'Hold to pan'],
  ['Del', 'Delete selection'],
  ['Ctrl+D', 'Duplicate'],
  ['Ctrl+Z', 'Undo / Redo'],
  ['Scroll', 'Zoom at cursor'],
] as const;

export function ShortcutsSection() {
  return (
    <section>
      <SectionHeading className="mb-3">Shortcuts</SectionHeading>
      <ul className="space-y-1.5 font-mono text-[11px] text-muted-foreground">
        {ROWS.map(([key, label]) => (
          <li key={key} className="flex items-center justify-between gap-3">
            <kbd className="rounded-none border border-border bg-muted px-1.5 py-0.5 text-foreground">{key}</kbd>
            <span className="text-right">{label}</span>
          </li>
        ))}
      </ul>
      <p className="mt-3 text-xs text-muted-foreground">Paste an image from the clipboard to load it.</p>
    </section>
  );
}
