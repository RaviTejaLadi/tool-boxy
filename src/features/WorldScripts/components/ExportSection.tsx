import { Check, Copy } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { alphabetAsJson, alphabetAsString, alphabetAsUnicodeLines, getDisplayLetters } from '../helpers';
import { selectLanguage, useWorldScriptsStore } from '../stores';
import { SectionHeading } from './SectionHeading';

async function copyText(text: string) {
  try {
    await navigator.clipboard.writeText(text);
  } catch {
    // clipboard may be unavailable
  }
}

export function ExportSection() {
  const selectedId = useWorldScriptsStore((s) => s.selectedId);
  const includeLowercase = useWorldScriptsStore((s) => s.includeLowercase);
  const exportFlash = useWorldScriptsStore((s) => s.exportFlash);
  const flashExport = useWorldScriptsStore((s) => s.flashExport);
  const selected = selectLanguage(selectedId);
  const letters = getDisplayLetters(selected, includeLowercase);

  const runCopy = async (tag: string, text: string) => {
    await copyText(text);
    flashExport(tag);
  };

  const actions = [
    { tag: 'chars', label: 'Copy characters', text: alphabetAsString(letters) },
    { tag: 'unicode', label: 'Copy Unicode list', text: alphabetAsUnicodeLines(letters) },
    { tag: 'json', label: 'Copy JSON', text: alphabetAsJson(letters) },
  ] as const;

  return (
    <section className="space-y-4">
      <SectionHeading className="mb-3">Export</SectionHeading>

      <div className="space-y-2">
        {actions.map(({ tag, label, text }) => {
          const copied = exportFlash === tag;
          return (
            <Button
              key={tag}
              type="button"
              variant="outline"
              size="sm"
              className="h-9 w-full justify-start rounded-none font-mono text-xs"
              onClick={() => void runCopy(tag, text)}
            >
              {copied ? <Check data-icon="inline-start" className="text-primary" /> : <Copy data-icon="inline-start" />}
              {label}
            </Button>
          );
        })}
      </div>
    </section>
  );
}
