import { BIT_COUNT } from '../constants';
import { useConverterStore } from '../stores';
import { SectionHeading } from './SectionHeading';

export function BitToggleSection() {
  const bits = useConverterStore((s) => s.bits);
  const toggleBit = useConverterStore((s) => s.toggleBit);

  return (
    <section className="space-y-4">
      <SectionHeading className="mb-3">Bit Toggle ({BIT_COUNT}-bit)</SectionHeading>
      <div className="flex flex-wrap gap-1">
        {bits.map((bit, index) => (
          <button
            key={index}
            type="button"
            onClick={() => toggleBit(index)}
            className={`flex h-10 w-7 flex-col items-center justify-center border font-mono text-xs transition-colors ${
              bit
                ? 'border-primary bg-primary text-primary-foreground'
                : 'border-border bg-muted/50 text-muted-foreground hover:border-primary/50 hover:bg-muted'
            }`}
          >
            <span>{bit ? '1' : '0'}</span>
            <span className="text-[8px] opacity-60">{BIT_COUNT - 1 - index}</span>
          </button>
        ))}
      </div>
    </section>
  );
}
