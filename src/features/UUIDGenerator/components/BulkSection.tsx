import { Copy, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useUuidStore } from '../stores';
import { SectionHeading } from './SectionHeading';

export function BulkSection() {
  const count = useUuidStore((s) => s.count);
  const setCount = useUuidStore((s) => s.setCount);
  const bulkUuids = useUuidStore((s) => s.bulkUuids);
  const generateBulk = useUuidStore((s) => s.generateBulk);
  const clearBulk = useUuidStore((s) => s.clearBulk);
  const copyAllBulk = useUuidStore((s) => s.copyAllBulk);
  const copyText = useUuidStore((s) => s.copyText);

  return (
    <section className="space-y-4">
      <SectionHeading className="mb-3">Bulk</SectionHeading>

      <div className="space-y-2">
        <Label htmlFor="uuid-count" className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">
          Count (max 100)
        </Label>
        <Input
          id="uuid-count"
          type="number"
          min={1}
          max={100}
          value={count}
          onChange={(e) => setCount(parseInt(e.target.value, 10) || 1)}
          className="font-mono text-sm"
        />
      </div>

      <div className="flex flex-wrap gap-2">
        <Button variant="outline" size="sm" onClick={() => generateBulk('v4')}>
          Generate v4
        </Button>
        <Button variant="outline" size="sm" onClick={() => generateBulk('v7')}>
          Generate v7
        </Button>
        {bulkUuids.length > 0 && (
          <>
            <Button variant="outline" size="sm" onClick={copyAllBulk}>
              <Copy data-icon="inline-start" />
              Copy all
            </Button>
            <Button variant="destructive" size="sm" onClick={clearBulk}>
              <Trash2 data-icon="inline-start" />
              Clear
            </Button>
          </>
        )}
      </div>

      {bulkUuids.length > 0 && (
        <div className="space-y-2">
          <p className="font-mono text-[10px] tracking-wide text-muted-foreground uppercase">
            {bulkUuids.length} generated
          </p>
          <div className="max-h-48 overflow-y-auto border border-border bg-muted/30">
            <ul className="divide-y divide-border">
              {bulkUuids.map((uuid, index) => (
                <li key={`${uuid}-${index}`} className="flex items-center gap-2 px-2 py-1.5">
                  <span className="min-w-0 flex-1 truncate font-mono text-[11px]">{uuid}</span>
                  <Button variant="ghost" size="sm" className="h-6 shrink-0 px-1.5" onClick={() => copyText(uuid)}>
                    <Copy className="size-3" />
                  </Button>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </section>
  );
}
