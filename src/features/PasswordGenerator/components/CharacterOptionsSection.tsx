import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { usePasswordStore } from '../stores';
import { SectionHeading } from './SectionHeading';

const OPTIONS = [
  { id: 'uppercase', label: 'Uppercase (A-Z)', key: 'includeUppercase', setter: 'setIncludeUppercase' },
  { id: 'lowercase', label: 'Lowercase (a-z)', key: 'includeLowercase', setter: 'setIncludeLowercase' },
  { id: 'numbers', label: 'Numbers (0-9)', key: 'includeNumbers', setter: 'setIncludeNumbers' },
  { id: 'symbols', label: 'Symbols (!@#$%)', key: 'includeSymbols', setter: 'setIncludeSymbols' },
] as const;

export function CharacterOptionsSection() {
  const includeUppercase = usePasswordStore((s) => s.includeUppercase);
  const includeLowercase = usePasswordStore((s) => s.includeLowercase);
  const includeNumbers = usePasswordStore((s) => s.includeNumbers);
  const includeSymbols = usePasswordStore((s) => s.includeSymbols);
  const setIncludeUppercase = usePasswordStore((s) => s.setIncludeUppercase);
  const setIncludeLowercase = usePasswordStore((s) => s.setIncludeLowercase);
  const setIncludeNumbers = usePasswordStore((s) => s.setIncludeNumbers);
  const setIncludeSymbols = usePasswordStore((s) => s.setIncludeSymbols);

  const checked = {
    includeUppercase,
    includeLowercase,
    includeNumbers,
    includeSymbols,
  };

  const setters = {
    setIncludeUppercase,
    setIncludeLowercase,
    setIncludeNumbers,
    setIncludeSymbols,
  };

  return (
    <section className="space-y-4">
      <SectionHeading className="mb-3">Character sets</SectionHeading>
      <div className="grid grid-cols-1 gap-3">
        {OPTIONS.map((option) => (
          <div key={option.id} className="flex items-center gap-2">
            <Checkbox
              id={option.id}
              checked={checked[option.key]}
              onCheckedChange={(value) => setters[option.setter](Boolean(value))}
            />
            <Label htmlFor={option.id} className="cursor-pointer text-sm font-normal">
              {option.label}
            </Label>
          </div>
        ))}
      </div>
    </section>
  );
}
