import { SectionHeading } from './SectionHeading';

export function TipsSection() {
  return (
    <section className="space-y-3">
      <SectionHeading className="mb-3">Tips</SectionHeading>
      <p className="font-mono text-[11px] leading-relaxed text-muted-foreground">
        Click a glyph to open copy options for the character, HTML entity, CSS escape, and JavaScript escape. Use the
        search bar to filter by character or code point (<span className="text-foreground">U+0041</span>,{' '}
        <span className="text-foreground">0x41</span>, or decimal).
      </p>
    </section>
  );
}
