import { Textarea } from '@/components/ui/textarea';
import { useJwtStore } from '../stores';
import { SectionHeading } from './SectionHeading';

export function InputSection() {
  const jwtInput = useJwtStore((s) => s.jwtInput);
  const setJwtInput = useJwtStore((s) => s.setJwtInput);

  return (
    <section className="space-y-4">
      <SectionHeading className="mb-3">Input</SectionHeading>
      <Textarea
        placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
        value={jwtInput}
        onChange={(e) => setJwtInput(e.target.value)}
        className="min-h-28 resize-none font-mono text-sm"
      />
    </section>
  );
}
