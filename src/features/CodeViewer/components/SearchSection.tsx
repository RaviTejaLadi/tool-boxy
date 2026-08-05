import { MagnifyingGlassIcon } from '@phosphor-icons/react';
import { Input } from '@/components/ui/input';
import { useCodeViewerStore } from '../stores';
import { SectionHeading } from './SectionHeading';

export function SearchSection() {
  const folderName = useCodeViewerStore((s) => s.folderName);
  const searchQuery = useCodeViewerStore((s) => s.searchQuery);
  const setSearchQuery = useCodeViewerStore((s) => s.setSearchQuery);

  if (!folderName) return null;

  return (
    <section className="space-y-3">
      <SectionHeading>Search</SectionHeading>
      <div className="relative">
        <MagnifyingGlassIcon className="pointer-events-none absolute top-1/2 left-2.5 size-3.5 -translate-y-1/2 text-muted-foreground" />
        <Input
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Filter files…"
          className="h-8 rounded-none pl-8 font-mono text-[12px]"
        />
      </div>
    </section>
  );
}
