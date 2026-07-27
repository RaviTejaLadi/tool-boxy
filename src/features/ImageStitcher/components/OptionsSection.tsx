import { OUTPUT_FORMATS, type OutputFormatId } from '../constants';
import { Button } from '@/components/ui/button';
import { useStitcherStore } from '../stores';
import { SectionHeading } from './SectionHeading';

export function OptionsSection() {
  const images = useStitcherStore((s) => s.images);
  const formatId = useStitcherStore((s) => s.formatId);
  const setFormatId = useStitcherStore((s) => s.setFormatId);

  return (
    <section className="space-y-3">
      <SectionHeading className="mb-3">Export</SectionHeading>

      <div className="space-y-2">
        <p className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">Format</p>
        <div className="grid grid-cols-3 gap-1.5">
          {OUTPUT_FORMATS.map((item) => {
            const isActive = formatId === item.id;
            return (
              <Button
                key={item.id}
                type="button"
                variant={isActive ? 'default' : 'outline'}
                size="sm"
                className="justify-center px-2 font-mono text-xs"
                onClick={() => setFormatId(item.id as OutputFormatId)}
              >
                {item.label}
              </Button>
            );
          })}
        </div>
        <p className="font-mono text-[11px] leading-relaxed text-muted-foreground">
          Composition updates live. Export runs once when you download.
        </p>
      </div>

      <div className="space-y-1.5 border border-border bg-muted/30 px-3 py-2">
        <p className="font-mono text-[10px] tracking-wide text-muted-foreground uppercase">Images</p>
        <p className="font-mono text-xs tabular-nums">{images.length}</p>
      </div>
    </section>
  );
}
