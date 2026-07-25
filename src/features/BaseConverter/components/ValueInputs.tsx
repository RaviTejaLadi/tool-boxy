import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { BASE_LABELS, BASE_PREFIXES, BASES, PLACEHOLDER_DECIMAL, type Base } from '../constants';
import { formatValue, type ValueSet } from '../helpers';

const PLACEHOLDER = formatValue(PLACEHOLDER_DECIMAL);

export function ValueInputs({
  label,
  values,
  onChange,
}: {
  label?: string;
  values: ValueSet;
  onChange: (value: string, base: Base) => void;
}) {
  return (
    <div className="space-y-3">
      {label && <Label className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">{label}</Label>}
      <div className="space-y-2">
        {BASES.map((base) => (
          <div key={base} className="flex items-center gap-2">
            <span className="w-16 shrink-0 font-mono text-[10px] text-muted-foreground">{BASE_LABELS[base]}</span>
            <div className="flex min-w-0 flex-1 items-center gap-1.5">
              {BASE_PREFIXES[base] && (
                <span className="font-mono text-[10px] text-muted-foreground/70">{BASE_PREFIXES[base].trim()}</span>
              )}
              <Input
                value={values[base]}
                placeholder={PLACEHOLDER[base]}
                onChange={(e) => onChange(e.target.value, base)}
                className="font-mono text-sm"
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
