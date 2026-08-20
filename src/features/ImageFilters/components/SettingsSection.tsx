import { ImageDown, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { parseSliderValue } from '@/lib/utils';
import {
  DEFAULT_FILTER_ID,
  EXPORT_FORMATS,
  MAX_INTENSITY,
  MIN_INTENSITY,
  composeFilterCss,
  getFilterById,
  isSettingsDefault,
  type ExportFormat,
  type FilterSettings,
} from '../constants';
import { downloadFiltered } from '../helpers';
import { useFilterStore } from '../stores';
import { SectionHeading } from './SectionHeading';

type SliderConfig = {
  key: keyof FilterSettings;
  label: string;
  min: number;
  max: number;
  step: number;
  format: (v: number) => string;
};

const SLIDERS: SliderConfig[] = [
  { key: 'brightness', label: 'Brightness', min: 0, max: 200, step: 1, format: (v) => `${v}%` },
  { key: 'contrast', label: 'Contrast', min: 0, max: 200, step: 1, format: (v) => `${v}%` },
  { key: 'saturation', label: 'Saturation', min: 0, max: 200, step: 1, format: (v) => `${v}%` },
  { key: 'blur', label: 'Blur', min: 0, max: 20, step: 0.5, format: (v) => `${v}px` },
  { key: 'grayscale', label: 'Grayscale', min: 0, max: 100, step: 1, format: (v) => `${v}%` },
  { key: 'sepia', label: 'Sepia', min: 0, max: 100, step: 1, format: (v) => `${v}%` },
  { key: 'hueRotate', label: 'Hue Rotate', min: 0, max: 360, step: 1, format: (v) => `${v}deg` },
  { key: 'invert', label: 'Invert', min: 0, max: 100, step: 1, format: (v) => `${v}%` },
  { key: 'opacity', label: 'Opacity', min: 0, max: 100, step: 1, format: (v) => `${v}%` },
];

export function SettingsSection() {
  const source = useFilterStore((s) => s.source);
  const selectedFilterId = useFilterStore((s) => s.selectedFilterId);
  const intensity = useFilterStore((s) => s.intensity);
  const settings = useFilterStore((s) => s.settings);
  const exportFormat = useFilterStore((s) => s.exportFormat);
  const isExporting = useFilterStore((s) => s.isExporting);
  const setIntensity = useFilterStore((s) => s.setIntensity);
  const setSetting = useFilterStore((s) => s.setSetting);
  const resetSettings = useFilterStore((s) => s.resetSettings);
  const setExportFormat = useFilterStore((s) => s.setExportFormat);
  const setExporting = useFilterStore((s) => s.setExporting);

  const currentFilter = getFilterById(selectedFilterId);
  const disabled = !source;
  const canReset = !isSettingsDefault(settings) || intensity !== 100;

  const handleDownload = async () => {
    if (!source) return;
    setExporting(true);
    try {
      const css = composeFilterCss(currentFilter.css, settings);
      await downloadFiltered(source, css, intensity, currentFilter.id, exportFormat, settings.opacity);
    } finally {
      setExporting(false);
    }
  };

  return (
    <section className="space-y-5">
      <div className="flex items-center justify-between gap-2">
        <SectionHeading className="mb-0 flex-1">Settings</SectionHeading>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="h-7 px-2 font-mono text-[10px]"
          onClick={resetSettings}
          disabled={disabled || !canReset}
        >
          <RotateCcw data-icon="inline-start" className="size-3" />
          Reset
        </Button>
      </div>

      <div className="space-y-4">
        {SLIDERS.map((slider) => (
          <div key={slider.key} className="space-y-2">
            <div className="flex items-center justify-between gap-2">
              <Label className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">
                {slider.label}
              </Label>
              <span className="font-mono text-[11px] tabular-nums text-muted-foreground">
                {slider.format(settings[slider.key])}
              </span>
            </div>
            <Slider
              value={[settings[slider.key]]}
              min={slider.min}
              max={slider.max}
              step={slider.step}
              onValueChange={(value) => setSetting(slider.key, parseSliderValue(value))}
              disabled={disabled}
            />
          </div>
        ))}

        <div className="space-y-2">
          <div className="flex items-center justify-between gap-2">
            <Label className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">
              Filter intensity
            </Label>
            <span className="font-mono text-[11px] tabular-nums text-muted-foreground">{intensity}%</span>
          </div>
          <Slider
            value={[intensity]}
            min={MIN_INTENSITY}
            max={MAX_INTENSITY}
            step={1}
            onValueChange={(value) => setIntensity(parseSliderValue(value))}
            disabled={disabled || (selectedFilterId === DEFAULT_FILTER_ID && isSettingsDefault(settings))}
          />
          <p className="font-mono text-[10px] leading-relaxed text-muted-foreground">
            Blend between the original and the edited result.
          </p>
        </div>
      </div>

      <div className="space-y-2">
        <Label className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">Format</Label>
        <ToggleGroup
          value={[exportFormat]}
          onValueChange={(value) => {
            const next = value[0] as ExportFormat | undefined;
            if (next) setExportFormat(next);
          }}
          variant="outline"
          size="sm"
          spacing={0}
          className="flex w-full"
          disabled={disabled}
        >
          {EXPORT_FORMATS.map((format) => (
            <ToggleGroupItem
              key={format.id}
              value={format.id}
              className="flex-1 rounded-none border-0 px-2.5 font-mono text-xs"
            >
              {format.label}
            </ToggleGroupItem>
          ))}
        </ToggleGroup>
      </div>

      <Button
        type="button"
        size="sm"
        className="w-full"
        onClick={() => void handleDownload()}
        disabled={disabled || isExporting}
      >
        <ImageDown data-icon="inline-start" />
        {isExporting ? 'Exporting…' : `Download ${exportFormat.toUpperCase()}`}
      </Button>

      <div className="space-y-1.5 border border-border bg-muted/30 px-3 py-2">
        <p className="font-mono text-[10px] tracking-wide text-muted-foreground uppercase">Active filter</p>
        <p className="text-xs text-foreground">{currentFilter.name}</p>
        <p className="font-mono text-[10px] text-muted-foreground">{currentFilter.description}</p>
      </div>
    </section>
  );
}
