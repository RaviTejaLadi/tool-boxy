// @ts-nocheck — typed gradually
import { Download, ImageDown, FileCode2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ButtonGroup } from '@/components/ui/button-group';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { useExportStore } from '../stores';

const EXPORT_SCALES = [1, 2, 3];

export function CodeSnippetHeader({ onDownloadSVG, onDownloadPNG }) {
  const exportScale = useExportStore((s) => s.exportScale);
  const setExportScale = useExportStore((s) => s.setExportScale);

  return (
    <header className="flex shrink-0 items-center justify-between border-b border-border px-6 py-3">
      <div className="flex items-center gap-2.5">
        <div className="flex size-7 items-center justify-center bg-primary text-primary-foreground">
          <FileCode2 className="size-4" />
        </div>
        <div>
          <div className="font-heading text-sm leading-none font-semibold">Code Snippet</div>
          <div className="mt-1 font-mono text-[11px] leading-none text-muted-foreground">
            Create code snippets with ease
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <ButtonGroup className="mr-1 hidden sm:flex">
          <ToggleGroup
            value={[String(exportScale)]}
            onValueChange={(value) => {
              const next = value[0];
              if (next) setExportScale(Number(next));
            }}
            variant="outline"
            size="sm"
            spacing={0}
            className="w-full"
          >
            {EXPORT_SCALES.map((scale) => (
              <ToggleGroupItem
                key={scale}
                value={String(scale)}
                className="rounded-none border-0 px-2.5 font-mono text-xs"
              >
                {scale}x
              </ToggleGroupItem>
            ))}
          </ToggleGroup>
        </ButtonGroup>

        <Button variant="outline" size="sm" onClick={onDownloadSVG}>
          <Download data-icon="inline-start" />
          SVG
        </Button>
        <Button size="sm" onClick={onDownloadPNG}>
          <ImageDown data-icon="inline-start" />
          Download PNG
        </Button>
      </div>
    </header>
  );
}
