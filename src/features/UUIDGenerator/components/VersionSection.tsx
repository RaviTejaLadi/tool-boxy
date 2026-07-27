import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useUuidStore } from '../stores';
import type { UuidVersion } from '../helpers';
import { SectionHeading } from './SectionHeading';

export function VersionSection() {
  const activeVersion = useUuidStore((s) => s.activeVersion);
  const setActiveVersion = useUuidStore((s) => s.setActiveVersion);

  return (
    <section className="space-y-4">
      <SectionHeading className="mb-3">Version</SectionHeading>
      <Tabs value={activeVersion} onValueChange={(v) => setActiveVersion(v as UuidVersion)}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="v4">UUID v4</TabsTrigger>
          <TabsTrigger value="v7">UUID v7</TabsTrigger>
        </TabsList>
      </Tabs>
      <p className="font-mono text-[10px] text-muted-foreground">
        {activeVersion === 'v4'
          ? 'Cryptographically secure random identifiers (RFC 4122).'
          : 'Timestamp-based identifiers with sort-friendly ordering.'}
      </p>
    </section>
  );
}
