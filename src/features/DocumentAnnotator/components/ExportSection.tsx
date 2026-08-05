import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Field, FieldContent } from '@/components/ui/field';
import { ButtonGroup } from '@/components/ui/button-group';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { parseSliderValue } from '@/lib/utils';
import { formatLabel } from '../helpers';
import { useAnnotatorStore } from '../stores';
import type { ExportFormat } from '../types';
import { SectionHeading } from './SectionHeading';

const FORMATS: ExportFormat[] = ['pdf', 'png', 'jpeg', 'webp'];

export function ExportSection() {
  const image = useAnnotatorStore((s) => s.image);
  const sourceKind = useAnnotatorStore((s) => s.sourceKind);
  const numPages = useAnnotatorStore((s) => s.numPages);
  const exportFormat = useAnnotatorStore((s) => s.exportFormat);
  const exportQuality = useAnnotatorStore((s) => s.exportQuality);
  const setExportFormat = useAnnotatorStore((s) => s.setExportFormat);
  const setExportQuality = useAnnotatorStore((s) => s.setExportQuality);

  return (
    <section className="space-y-4">
      <SectionHeading className="mb-1">Export</SectionHeading>

      <Field>
        <div className="mb-2 flex items-center justify-between">
          <Label className="text-sm">Format</Label>
          <span className="font-mono text-xs text-muted-foreground">{formatLabel(exportFormat)}</span>
        </div>
        <FieldContent>
          <ButtonGroup className="w-full">
            <ToggleGroup
              value={[exportFormat]}
              onValueChange={(value) => {
                const next = value[0] as ExportFormat | undefined;
                if (next) setExportFormat(next);
              }}
              variant="outline"
              size="sm"
              spacing={0}
              className="w-full"
              disabled={!image}
            >
              {FORMATS.map((format) => (
                <ToggleGroupItem key={format} value={format} className="flex-1 rounded-none border-0 font-mono text-xs">
                  {formatLabel(format)}
                </ToggleGroupItem>
              ))}
            </ToggleGroup>
          </ButtonGroup>
        </FieldContent>
      </Field>

      {(exportFormat === 'jpeg' || exportFormat === 'webp') && (
        <Field>
          <div className="mb-2 flex items-center justify-between">
            <Label className="text-sm">Quality</Label>
            <span className="font-mono text-xs text-muted-foreground">{Math.round(exportQuality * 100)}%</span>
          </div>
          <FieldContent>
            <Slider
              value={[exportQuality]}
              min={0.5}
              max={1}
              step={0.01}
              disabled={!image}
              onValueChange={(v) => setExportQuality(parseSliderValue(v))}
            />
          </FieldContent>
        </Field>
      )}

      <p className="font-mono text-[11px] text-muted-foreground">
        {exportFormat === 'pdf' && sourceKind === 'pdf' && numPages > 1
          ? `Exports all ${numPages} pages with annotations into one PDF.`
          : exportFormat === 'pdf'
          ? 'Exports the current view as a single-page PDF.'
          : 'JPG/WebP use a white background. PDF is selected by default for uploaded PDFs.'}
      </p>
    </section>
  );
}
