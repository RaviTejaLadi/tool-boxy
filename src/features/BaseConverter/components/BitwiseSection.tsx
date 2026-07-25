import { Button } from '@/components/ui/button';
import { OPERATIONS } from '../constants';
import { useConverterStore } from '../stores';
import { SectionHeading } from './SectionHeading';
import { ValueInputs } from './ValueInputs';

export function BitwiseSection() {
  const valueA = useConverterStore((s) => s.valueA);
  const valueB = useConverterStore((s) => s.valueB);
  const operation = useConverterStore((s) => s.operation);
  const setValueAFromBase = useConverterStore((s) => s.setValueAFromBase);
  const setValueBFromBase = useConverterStore((s) => s.setValueBFromBase);
  const setOperation = useConverterStore((s) => s.setOperation);

  return (
    <section className="space-y-5">
      <div className="space-y-4">
        <SectionHeading className="mb-3">Operation</SectionHeading>
        <div className="flex flex-wrap gap-2">
          {OPERATIONS.map((op) => (
            <Button
              key={op}
              type="button"
              variant={operation === op ? 'default' : 'outline'}
              size="sm"
              onClick={() => setOperation(op)}
              className="font-mono"
            >
              {op}
            </Button>
          ))}
        </div>
      </div>

      <ValueInputs label="Value A" values={valueA} onChange={setValueAFromBase} />
      {operation !== 'NOT' && <ValueInputs label="Value B" values={valueB} onChange={setValueBFromBase} />}
    </section>
  );
}
