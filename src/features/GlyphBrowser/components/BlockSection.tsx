import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { BLOCKS } from '../constants';
import { selectFilteredGlyphs, useGlyphBrowserStore } from '../stores';
import { SectionHeading } from './SectionHeading';

export function BlockSection() {
  const blockId = useGlyphBrowserStore((s) => s.blockId);
  const query = useGlyphBrowserStore((s) => s.query);
  const setBlockId = useGlyphBrowserStore((s) => s.setBlockId);

  const visibleCount = selectFilteredGlyphs({ blockId, query }).length;

  return (
    <section className="space-y-4">
      <div className="mb-3 flex items-center justify-between gap-2">
        <SectionHeading>Unicode block</SectionHeading>
        <span className="font-mono text-[10px] text-muted-foreground tabular-nums">{visibleCount} shown</span>
      </div>

      <div className="space-y-1.5">
        <Label className="font-mono text-[10px] tracking-wide text-muted-foreground uppercase">Block</Label>
        <Select value={blockId} onValueChange={(v) => v && setBlockId(v)}>
          <SelectTrigger className="h-9 w-full rounded-none font-mono text-xs">
            <SelectValue placeholder="Select block" />
          </SelectTrigger>
          <SelectContent className="max-h-72 rounded-none">
            {BLOCKS.map((block) => (
              <SelectItem key={block.id} value={block.id}>
                {block.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </section>
  );
}
