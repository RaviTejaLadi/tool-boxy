import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { usePasswordStore } from '../stores';
import { SectionHeading } from './SectionHeading';

export function AdvancedSection() {
  const excludeAmbiguous = usePasswordStore((s) => s.excludeAmbiguous);
  const setExcludeAmbiguous = usePasswordStore((s) => s.setExcludeAmbiguous);
  const includeUppercase = usePasswordStore((s) => s.includeUppercase);
  const includeLowercase = usePasswordStore((s) => s.includeLowercase);
  const includeNumbers = usePasswordStore((s) => s.includeNumbers);
  const includeSymbols = usePasswordStore((s) => s.includeSymbols);
  const hasOptions = includeUppercase || includeLowercase || includeNumbers || includeSymbols;

  return (
    <section className="space-y-4">
      <SectionHeading className="mb-3">Advanced</SectionHeading>
      <div className="flex items-start justify-between gap-3 border border-border bg-muted/40 px-3 py-3">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Switch
              id="exclude-ambiguous"
              checked={excludeAmbiguous}
              onCheckedChange={(checked) => setExcludeAmbiguous(checked)}
              disabled={!hasOptions}
            />
            <Label htmlFor="exclude-ambiguous" className="cursor-pointer text-sm font-normal">
              Exclude ambiguous
            </Label>
          </div>
          <p className="font-mono text-[10px] text-muted-foreground">e.g. {'{}[]()il1O0'}</p>
        </div>
      </div>
    </section>
  );
}
