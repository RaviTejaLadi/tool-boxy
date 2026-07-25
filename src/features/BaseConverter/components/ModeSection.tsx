import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useConverterStore, type ActiveMode } from '../stores';
import { SectionHeading } from './SectionHeading';

export function ModeSection() {
  const activeMode = useConverterStore((s) => s.activeMode);
  const setActiveMode = useConverterStore((s) => s.setActiveMode);

  return (
    <section className="space-y-4">
      <SectionHeading className="mb-3">Mode</SectionHeading>
      <Tabs value={activeMode} onValueChange={(v) => setActiveMode(v as ActiveMode)}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="converter">Converter</TabsTrigger>
          <TabsTrigger value="bitwise">Bitwise</TabsTrigger>
        </TabsList>
      </Tabs>
    </section>
  );
}
