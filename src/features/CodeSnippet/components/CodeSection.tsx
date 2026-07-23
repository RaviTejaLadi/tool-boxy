// @ts-nocheck — typed gradually
import { Textarea } from '@/components/ui/textarea';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Field, FieldGroup, FieldLabel } from '@/components/ui/field';
import { useCodeStore } from '../stores';
import { SectionHeading } from './SectionHeading';

export function CodeSection() {
  const code = useCodeStore((s) => s.code);
  const setCode = useCodeStore((s) => s.setCode);

  return (
    <section>
      <SectionHeading className="mb-3">Code</SectionHeading>
      <FieldGroup className="gap-2.5">
        <Field>
          <FieldLabel className="sr-only">Code</FieldLabel>
          <ScrollArea className="h-64 rounded-none border border-input">
            <Textarea
              value={code}
              onChange={(e) => setCode(e.target.value)}
              rows={8}
              spellCheck={false}
              className="field-sizing-content min-h-64 resize-none border-0 font-mono text-[13px] focus-visible:ring-0"
              placeholder="Paste or type your code..."
            />
          </ScrollArea>
        </Field>
      </FieldGroup>
    </section>
  );
}
