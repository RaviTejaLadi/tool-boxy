import { QUICK_REFS, TYPOGRAPHY_UNITS } from '../constants';

export function ReferencePanel() {
  return (
    <div className="space-y-6 border-t border-border p-4 sm:p-5">
      <div>
        <p className="mb-2 border-b border-border pb-1 font-mono text-[11px] tracking-wide text-primary">
          Unit Descriptions
        </p>
        <div className="grid grid-cols-1 gap-x-6 gap-y-1.5 md:grid-cols-2">
          {TYPOGRAPHY_UNITS.map((unit) => (
            <div key={unit.symbol} className="flex gap-2 text-sm">
              <span className="w-10 shrink-0 font-mono font-medium">{unit.symbol}</span>
              <span className="text-muted-foreground">{unit.description}</span>
            </div>
          ))}
        </div>
      </div>

      <div>
        <p className="mb-2 border-b border-border pb-1 font-mono text-[11px] tracking-wide text-primary">
          Quick Reference
        </p>
        <ul className="space-y-1 font-mono text-xs text-muted-foreground">
          {QUICK_REFS.map((ref) => (
            <li key={ref}>{ref}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}
