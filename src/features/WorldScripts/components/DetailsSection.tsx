import { KIND_LABEL } from '../constants';
import { getDisplayLetters, getUnicodeRange } from '../helpers';
import { selectLanguage, useWorldScriptsStore } from '../stores';
import { SectionHeading } from './SectionHeading';

export function DetailsSection() {
  const selectedId = useWorldScriptsStore((s) => s.selectedId);
  const includeLowercase = useWorldScriptsStore((s) => s.includeLowercase);
  const selected = selectLanguage(selectedId);
  const letters = getDisplayLetters(selected, includeLowercase);
  const range = getUnicodeRange(letters);

  return (
    <section className="space-y-4">
      <SectionHeading className="mb-3">Details</SectionHeading>

      <dl className="space-y-2 font-mono text-xs">
        <div className="flex justify-between gap-3 border border-border bg-muted/30 px-3 py-2">
          <dt className="text-muted-foreground">Native</dt>
          <dd className="text-right font-medium">{selected.native}</dd>
        </div>
        <div className="flex justify-between gap-3 border border-border bg-muted/30 px-3 py-2">
          <dt className="text-muted-foreground">Script</dt>
          <dd className="text-right font-medium">{selected.script}</dd>
        </div>
        <div className="flex justify-between gap-3 border border-border bg-muted/30 px-3 py-2">
          <dt className="text-muted-foreground">Type</dt>
          <dd className="text-right font-medium">{KIND_LABEL[selected.kind]}</dd>
        </div>
        <div className="flex justify-between gap-3 border border-border bg-muted/30 px-3 py-2">
          <dt className="text-muted-foreground">Direction</dt>
          <dd className="text-right font-medium">{selected.direction === 'rtl' ? 'Right to left' : 'Left to right'}</dd>
        </div>
        {range ? (
          <div className="flex justify-between gap-3 border border-border bg-muted/30 px-3 py-2">
            <dt className="text-muted-foreground">Unicode range</dt>
            <dd className="text-right font-medium">{range.label}</dd>
          </div>
        ) : null}
        <div className="flex justify-between gap-3 border border-border bg-muted/30 px-3 py-2">
          <dt className="text-muted-foreground">Symbols shown</dt>
          <dd className="text-right font-medium tabular-nums">{letters.length}</dd>
        </div>
      </dl>
    </section>
  );
}
