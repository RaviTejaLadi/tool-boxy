import { BASE_LABELS, BASE_PREFIXES, BASES, BIT_COUNT, PLACEHOLDER_DECIMAL } from '../constants';
import { formatValue, isEmptyValue } from '../helpers';
import { useConverterStore } from '../stores';

const PLACEHOLDER = formatValue(PLACEHOLDER_DECIMAL);

function ValueGrid({
  values,
  muted = false,
}: {
  values: { decimal: string; hexadecimal: string; binary: string; octal: string };
  muted?: boolean;
}) {
  return (
    <div className="grid w-full max-w-lg grid-cols-1 gap-3 sm:grid-cols-2">
      {BASES.map((base) => (
        <div key={base} className="border border-border bg-background/90 px-4 py-3 shadow-sm backdrop-blur-sm">
          <div className="font-mono text-[10px] tracking-wide text-muted-foreground uppercase">{BASE_LABELS[base]}</div>
          <div className={`mt-1 break-all font-mono text-sm tabular-nums ${muted ? 'text-muted-foreground/50' : ''}`}>
            {BASE_PREFIXES[base]}
            {values[base] || '—'}
          </div>
        </div>
      ))}
    </div>
  );
}

export function PreviewPane() {
  const activeMode = useConverterStore((s) => s.activeMode);
  const converterValue = useConverterStore((s) => s.converterValue);
  const bits = useConverterStore((s) => s.bits);
  const valueA = useConverterStore((s) => s.valueA);
  const valueB = useConverterStore((s) => s.valueB);
  const operation = useConverterStore((s) => s.operation);
  const getBitwiseResult = useConverterStore((s) => s.getBitwiseResult);

  const isConverterEmpty = isEmptyValue(converterValue);
  const bitwiseResult = activeMode === 'bitwise' ? getBitwiseResult() : null;
  const isBitwiseEmpty = activeMode === 'bitwise' && bitwiseResult == null;

  const result =
    activeMode === 'bitwise' ? bitwiseResult ?? PLACEHOLDER : isConverterEmpty ? PLACEHOLDER : converterValue;

  const showPlaceholder = activeMode === 'converter' ? isConverterEmpty : isBitwiseEmpty;

  const expression =
    activeMode === 'bitwise'
      ? operation === 'NOT'
        ? `~ ${valueA.decimal || PLACEHOLDER.decimal}`
        : `${valueA.decimal || PLACEHOLDER.decimal} ${operation} ${valueB.decimal || PLACEHOLDER.decimal}`
      : converterValue.decimal || PLACEHOLDER.decimal;

  return (
    <div className="relative flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden bg-muted/40">
      <div
        className="flex min-h-0 flex-1 flex-col overflow-auto"
        style={{
          backgroundImage:
            'radial-gradient(circle, color-mix(in oklab, var(--foreground) 8%, transparent) 1px, transparent 1px)',
          backgroundSize: '22px 22px',
        }}
      >
        <div className="flex min-h-0 flex-1 flex-col items-center justify-center gap-8 p-6 lg:p-10">
          <div className="space-y-2 text-center">
            <p className="font-mono text-[11px] tracking-wide text-muted-foreground uppercase">
              {activeMode === 'converter' ? 'Converted value' : 'Result'}
            </p>
            <p
              className={`font-heading text-3xl font-semibold tracking-tight tabular-nums sm:text-4xl ${
                showPlaceholder ? 'text-muted-foreground/50' : ''
              }`}
            >
              {result.decimal}
            </p>
            {activeMode === 'bitwise' && <p className="font-mono text-[11px] text-muted-foreground">{expression}</p>}
          </div>

          <ValueGrid values={result} muted={showPlaceholder} />

          {activeMode === 'converter' && (
            <div className="w-full max-w-lg space-y-2">
              <p className="font-mono text-[10px] tracking-wide text-muted-foreground uppercase">
                {BIT_COUNT}-bit pattern
              </p>
              <div className="flex flex-wrap justify-center gap-1 border border-border bg-background/90 p-3 shadow-sm backdrop-blur-sm">
                {bits.map((bit, index) => (
                  <div
                    key={index}
                    className={`flex h-8 w-6 flex-col items-center justify-center font-mono text-[10px] ${
                      bit ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'
                    }`}
                  >
                    <span>{bit ? '1' : '0'}</span>
                    <span className="text-[7px] opacity-60">{BIT_COUNT - 1 - index}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="pointer-events-none absolute bottom-3 left-1/2 -translate-x-1/2">
        <span className="rounded-none border border-border bg-background/90 px-2 py-1 font-mono text-[11px] text-muted-foreground tabular-nums shadow-sm backdrop-blur-sm">
          {activeMode === 'converter' ? `dec ${expression}` : expression}
        </span>
      </div>
    </div>
  );
}
