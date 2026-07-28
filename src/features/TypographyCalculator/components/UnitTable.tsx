import { Check, Copy } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { TYPOGRAPHY_UNITS } from '../constants';
import { convertValue, formatResult, isValidNumber } from '../helpers';
import { useTypographyCalculatorStore } from '../stores';

async function copyText(text: string, id: string, flashCopied: (id: string) => void) {
  try {
    await navigator.clipboard.writeText(text);
  } catch {
    // clipboard may be unavailable — still flash UI
  }
  flashCopied(id);
}

export function UnitTable() {
  const baseFontSize = useTypographyCalculatorStore((s) => s.baseFontSize);
  const sourceUnit = useTypographyCalculatorStore((s) => s.sourceUnit);
  const sourceValue = useTypographyCalculatorStore((s) => s.sourceValue);
  const setUnitValue = useTypographyCalculatorStore((s) => s.setUnitValue);
  const copiedId = useTypographyCalculatorStore((s) => s.copiedId);
  const flashCopied = useTypographyCalculatorStore((s) => s.flashCopied);

  const displayValue = (symbol: string) => {
    if (symbol === sourceUnit) return sourceValue;
    if (!isValidNumber(sourceValue)) return '0';
    return formatResult(convertValue(Number(sourceValue), sourceUnit, symbol, baseFontSize));
  };

  return (
    <div>
      {TYPOGRAPHY_UNITS.map((unit) => {
        const value = displayValue(unit.symbol);
        const copied = copiedId === unit.symbol;

        return (
          <div
            key={unit.symbol}
            className="grid grid-cols-[minmax(9rem,14rem)_1fr_3rem] border-b border-border last:border-b-0 sm:grid-cols-[minmax(12rem,18rem)_1fr_3.5rem]"
          >
            <div className="flex items-center gap-2 border-r border-border px-3 py-2.5 sm:px-4">
              <span className="text-sm font-semibold">{unit.name}</span>
              <span className="font-mono text-xs text-muted-foreground">{unit.symbol}</span>
            </div>

            <div className="border-r border-border">
              <Input
                type="text"
                inputMode="decimal"
                value={value}
                onChange={(e) => setUnitValue(unit.symbol, e.target.value)}
                onFocus={() => {
                  if (sourceUnit !== unit.symbol) {
                    setUnitValue(unit.symbol, value);
                  }
                }}
                className="h-full rounded-none border-0 bg-transparent px-3 py-2.5 text-left font-mono text-sm shadow-none focus-visible:ring-0 sm:px-4"
              />
            </div>

            <div className="flex items-center justify-center">
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="size-8 text-muted-foreground hover:text-foreground"
                onClick={() => void copyText(value, unit.symbol, flashCopied)}
                aria-label={`Copy ${unit.name} value`}
              >
                {copied ? <Check className="size-3.5 text-primary" /> : <Copy className="size-3.5" />}
              </Button>
            </div>
          </div>
        );
      })}
    </div>
  );
}
