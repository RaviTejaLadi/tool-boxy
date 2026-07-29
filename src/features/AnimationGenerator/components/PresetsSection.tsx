import { PRESETS } from '../constants';
import { useAnimationGeneratorStore } from '../stores';
import { SectionHeading } from './SectionHeading';

export function PresetsSection() {
  const applyPreset = useAnimationGeneratorStore((s) => s.applyPreset);

  return (
    <section>
      <SectionHeading className="mb-3">Quick presets</SectionHeading>
      <div className="flex flex-col gap-1.5">
        {PRESETS.map((preset) => (
          <button
            key={preset.label}
            type="button"
            onClick={() => applyPreset(preset)}
            className="flex items-center justify-between gap-2 border border-border bg-muted/30 px-3 py-2 text-left text-sm transition-colors hover:bg-muted/60"
          >
            <span>{preset.label}</span>
            <span className="truncate text-xs text-muted-foreground">{preset.description}</span>
          </button>
        ))}
      </div>
    </section>
  );
}
