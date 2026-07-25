import { Check, Copy } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { UNIT_CATEGORIES } from '../constants';
import { convertValue, formatResult, isValidNumber } from '../helpers';
import { useUnitConverterStore } from '../stores';

async function copyText(text: string, id: string, flashCopied: (id: string) => void) {
  try {
    await navigator.clipboard.writeText(text);
  } catch {
    // clipboard may be unavailable — still flash UI
  }
  flashCopied(id);
}

export function UnitTable() {
  const category = useUnitConverterStore((s) => s.category);
  const sourceUnit = useUnitConverterStore((s) => s.sourceUnit);
  const sourceValue = useUnitConverterStore((s) => s.sourceValue);
  const setUnitValue = useUnitConverterStore((s) => s.setUnitValue);
  const copiedId = useUnitConverterStore((s) => s.copiedId);
  const flashCopied = useUnitConverterStore((s) => s.flashCopied);

  const units = UNIT_CATEGORIES[category].units;

  const displayValue = (symbol: string) => {
    if (symbol === sourceUnit) return sourceValue;
    if (!isValidNumber(sourceValue)) return '0';
    return formatResult(convertValue(Number(sourceValue), sourceUnit, symbol, category));
  };

  return (
    <div>
      {units.map((unit) => {
        const value = displayValue(unit.symbol);
        const copyKey = `${category}:${unit.symbol}`;
        const copied = copiedId === copyKey;

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
                onClick={() => void copyText(value, copyKey, flashCopied)}
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
