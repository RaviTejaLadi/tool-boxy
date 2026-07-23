// @ts-nocheck — typed gradually
import { Separator } from '@/components/ui/separator';
import { useExportStore } from '../stores';
import { SectionHeading } from './SectionHeading';

export function ExportInfo() {
  const frameWidth = useExportStore((s) => s.frameWidth);
  const frameHeight = useExportStore((s) => s.frameHeight);
  const exportScale = useExportStore((s) => s.exportScale);

  return (
    <section>
      <Separator />
      <SectionHeading className="my-3">Export</SectionHeading>
      <p className="font-mono text-xs text-muted-foreground">
        {Math.round(frameWidth)} &times; {Math.round(frameHeight)}px &middot; PNG @{exportScale}x renders{' '}
        {Math.round(frameWidth * exportScale)} &times; {Math.round(frameHeight * exportScale)}px
      </p>
    </section>
  );
}
