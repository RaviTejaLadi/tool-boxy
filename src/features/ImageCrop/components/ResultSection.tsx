import { Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { downloadCropped } from '../helpers';
import { useCropStore } from '../stores';
import { SectionHeading } from './SectionHeading';

export function ResultSection() {
  const source = useCropStore((s) => s.source);
  const cropped = useCropStore((s) => s.cropped);
  const setCropped = useCropStore((s) => s.setCropped);

  if (!source) {
    return (
      <section className="space-y-3">
        <SectionHeading className="mb-3">Result</SectionHeading>
        <p className="font-mono text-[11px] text-muted-foreground">Upload an image to begin cropping.</p>
      </section>
    );
  }

  if (!cropped) {
    return (
      <section className="space-y-3">
        <SectionHeading className="mb-3">Result</SectionHeading>
        <p className="font-mono text-[11px] text-muted-foreground">
          Adjust the crop area, then apply crop to generate a result.
        </p>
      </section>
    );
  }

  return (
    <section className="space-y-3">
      <SectionHeading className="mb-3">Result</SectionHeading>

      <div className="flex items-center gap-2 border border-primary bg-primary/5 px-2 py-2">
        <img
          src={cropped.dataUrl}
          alt=""
          className="size-12 shrink-0 border border-border bg-muted/30 object-contain"
        />
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-medium">{cropped.name}</p>
          <p className="font-mono text-[10px] text-muted-foreground">
            {cropped.width}×{cropped.height} · {cropped.size}
          </p>
        </div>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="size-7 shrink-0 text-muted-foreground hover:text-foreground"
          onClick={() => downloadCropped(cropped)}
          title="Download"
        >
          <Download className="size-3.5" />
        </Button>
      </div>

      <Button type="button" variant="outline" size="sm" className="w-full" onClick={() => setCropped(null)}>
        Edit crop again
      </Button>
    </section>
  );
}
