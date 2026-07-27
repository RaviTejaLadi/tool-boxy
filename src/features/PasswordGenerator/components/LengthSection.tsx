import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Button } from '@/components/ui/button';
import { usePasswordStore } from '../stores';
import { SectionHeading } from './SectionHeading';

function parseSliderValue(value: number | readonly number[]) {
  return Array.isArray(value) ? value[0] : value;
}

export function LengthSection() {
  const length = usePasswordStore((s) => s.length);
  const setLength = usePasswordStore((s) => s.setLength);
  const commitLength = usePasswordStore((s) => s.commitLength);
  const setLengthAndGenerate = usePasswordStore((s) => s.setLengthAndGenerate);
  const includeUppercase = usePasswordStore((s) => s.includeUppercase);
  const includeLowercase = usePasswordStore((s) => s.includeLowercase);
  const includeNumbers = usePasswordStore((s) => s.includeNumbers);
  const includeSymbols = usePasswordStore((s) => s.includeSymbols);
  const disabled = !(includeUppercase || includeLowercase || includeNumbers || includeSymbols);

  return (
    <section className="space-y-4">
      <SectionHeading className="mb-3">Length</SectionHeading>

      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <Label
            htmlFor="password-length"
            className="text-xs font-semibold tracking-wide text-muted-foreground uppercase"
          >
            Characters
          </Label>
          <span className="font-mono text-sm tabular-nums text-foreground">{length}</span>
        </div>

        <Slider
          id="password-length"
          min={4}
          max={64}
          step={1}
          value={[length]}
          onValueChange={(value) => setLength(parseSliderValue(value))}
          onValueCommitted={(value) => commitLength(parseSliderValue(value))}
          disabled={disabled}
          aria-label="Password length"
        />

        <div className="flex justify-between font-mono text-[10px] text-muted-foreground">
          <span>4</span>
          <span>64</span>
        </div>

        <div className="grid grid-cols-3 gap-2">
          {[12, 16, 24].map((value) => (
            <Button
              key={value}
              variant="outline"
              size="sm"
              onClick={() => setLengthAndGenerate(value)}
              disabled={disabled}
            >
              {value}
            </Button>
          ))}
        </div>
      </div>
    </section>
  );
}
