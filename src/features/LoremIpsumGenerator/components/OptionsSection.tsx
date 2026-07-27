import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { FORMAT_OPTIONS, PARAGRAPH_COUNTS, type OutputFormat } from '../constants';
import { useLoremStore } from '../stores';
import { SectionHeading } from './SectionHeading';

export function OptionsSection() {
  const paragraphCount = useLoremStore((s) => s.paragraphCount);
  const format = useLoremStore((s) => s.format);
  const setParagraphCount = useLoremStore((s) => s.setParagraphCount);
  const setFormat = useLoremStore((s) => s.setFormat);

  return (
    <section className="space-y-4">
      <SectionHeading className="mb-3">Options</SectionHeading>

      <div className="space-y-2">
        <Label
          htmlFor="lorem-paragraphs"
          className="text-xs font-semibold tracking-wide text-muted-foreground uppercase"
        >
          Paragraphs
        </Label>
        <Select
          value={String(paragraphCount)}
          onValueChange={(value) => {
            if (value) setParagraphCount(Number(value));
          }}
        >
          <SelectTrigger id="lorem-paragraphs" className="w-full font-mono text-sm">
            <SelectValue placeholder="Select count" />
          </SelectTrigger>
          <SelectContent>
            {PARAGRAPH_COUNTS.map((count) => (
              <SelectItem key={count} value={String(count)} className="font-mono">
                {count}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="lorem-format" className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">
          Format
        </Label>
        <Select
          value={format}
          onValueChange={(value) => {
            if (value) setFormat(value as OutputFormat);
          }}
        >
          <SelectTrigger id="lorem-format" className="w-full text-sm">
            <SelectValue placeholder="Select format" />
          </SelectTrigger>
          <SelectContent>
            {FORMAT_OPTIONS.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </section>
  );
}
