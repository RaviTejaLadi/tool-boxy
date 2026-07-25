import { OPERATION_META, OPERATIONS } from '../constants';
import { SectionHeading } from './SectionHeading';

export function ReferenceSection() {
  return (
    <section className="space-y-4">
      <SectionHeading className="mb-3">Reference</SectionHeading>
      <div className="space-y-2">
        {OPERATIONS.map((op) => {
          const meta = OPERATION_META[op];
          return (
            <div key={op} className="border border-border bg-muted/30 px-3 py-2">
              <span className="font-mono text-xs text-primary">
                {op} ({meta.symbol})
              </span>
              <p className="mt-0.5 font-mono text-[10px] text-muted-foreground">{meta.description}</p>
            </div>
          );
        })}
      </div>
    </section>
  );
}
