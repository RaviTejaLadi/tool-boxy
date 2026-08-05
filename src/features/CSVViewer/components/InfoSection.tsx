import { Separator } from '@/components/ui/separator';
import { useCsvStore } from '../stores';
import { SectionHeading } from './SectionHeading';

export function InfoSection({ visibleRows }: { visibleRows: number }) {
  const data = useCsvStore((s) => s.data);
  const headers = useCsvStore((s) => s.headers);
  const fileName = useCsvStore((s) => s.fileName);

  return (
    <section>
      <Separator />
      <SectionHeading className="my-3">Info</SectionHeading>
      <p className="font-mono text-xs text-muted-foreground">
        {data.length === 0
          ? 'No file loaded'
          : `${fileName || 'untitled.csv'} · ${headers.length} cols · ${visibleRows}/${data.length} rows`}
      </p>
    </section>
  );
}
