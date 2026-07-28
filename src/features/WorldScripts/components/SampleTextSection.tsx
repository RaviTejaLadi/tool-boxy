import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { getSampleText } from '../constants';
import { selectLanguage, useWorldScriptsStore } from '../stores';
import { SectionHeading } from './SectionHeading';

function parseSliderValue(value: number | readonly number[]) {
  return Array.isArray(value) ? value[0] : value;
}

export function SampleTextSection() {
  const selectedId = useWorldScriptsStore((s) => s.selectedId);
  const sampleFontSize = useWorldScriptsStore((s) => s.sampleFontSize);
  const setSampleFontSize = useWorldScriptsStore((s) => s.setSampleFontSize);
  const selected = selectLanguage(selectedId);
  const sample = getSampleText(selected.id, selected.native);

  return (
    <section className="space-y-4">
      <SectionHeading className="mb-3">Sample text</SectionHeading>

      <div
        dir={selected.direction}
        className="border border-border bg-muted/30 px-3 py-3 leading-relaxed"
        style={{ fontSize: `${sampleFontSize}px` }}
      >
        {sample}
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between gap-2">
          <Label className="font-mono text-[10px] tracking-wide text-muted-foreground uppercase">Preview size</Label>
          <span className="font-mono text-[11px] text-muted-foreground tabular-nums">{sampleFontSize}px</span>
        </div>
        <Slider
          value={[sampleFontSize]}
          min={14}
          max={40}
          step={1}
          onValueChange={(value) => setSampleFontSize(parseSliderValue(value) ?? sampleFontSize)}
        />
      </div>
    </section>
  );
}
