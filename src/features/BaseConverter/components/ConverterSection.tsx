import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { PLACEHOLDER_DECIMAL } from '../constants';
import { useConverterStore } from '../stores';
import { SectionHeading } from './SectionHeading';

export function ConverterSection() {
  const decimal = useConverterStore((s) => s.converterValue.decimal);
  const setConverterFromBase = useConverterStore((s) => s.setConverterFromBase);

  return (
    <section className="space-y-4">
      <SectionHeading className="mb-3">Value</SectionHeading>
      <div className="space-y-2">
        <Label
          htmlFor="converter-value"
          className="text-xs font-semibold tracking-wide text-muted-foreground uppercase"
        >
          Decimal
        </Label>
        <Input
          id="converter-value"
          value={decimal}
          placeholder={String(PLACEHOLDER_DECIMAL)}
          onChange={(e) => setConverterFromBase(e.target.value, 'decimal')}
          className="font-mono text-sm"
        />
      </div>
    </section>
  );
}
