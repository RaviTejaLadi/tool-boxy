// @ts-nocheck — typed gradually
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { DESIGN_PRESETS, PRESET_CATEGORIES } from '../constants';
import { useComposerStore } from '../stores';
import { SectionHeading } from './SectionHeading';

export function PresetsSection() {
  const [category, setCategory] = useState('All');
  const applyPresetToSlide = useComposerStore((s) => s.applyPresetToSlide);
  const applyPresetAsNewSlide = useComposerStore((s) => s.applyPresetAsNewSlide);

  const filtered = category === 'All' ? DESIGN_PRESETS : DESIGN_PRESETS.filter((p) => p.category === category);

  return (
    <section>
      <SectionHeading className="mb-3">Templates</SectionHeading>
      <p className="mb-3 text-xs leading-relaxed text-muted-foreground">
        Pick a template to apply to the current slide, or add it as a new slide.
      </p>

      <div className="mb-3 flex flex-wrap gap-1">
        {['All', ...PRESET_CATEGORIES].map((cat) => (
          <Button
            key={cat}
            type="button"
            variant={category === cat ? 'secondary' : 'outline'}
            size="sm"
            className="h-7 font-mono text-[10px]"
            onClick={() => setCategory(cat)}
          >
            {cat}
          </Button>
        ))}
      </div>

      <div className="grid grid-cols-2 gap-2">
        {filtered.map((preset) => (
          <div key={preset.id} className="group overflow-hidden rounded-lg border border-border bg-background">
            <div
              className="aspect-square w-full cursor-pointer transition-opacity hover:opacity-90"
              style={{
                backgroundColor: preset.background.type === 'color' ? preset.background.value : undefined,
                backgroundImage: preset.background.type === 'gradient' ? preset.preview : undefined,
              }}
              onClick={() => applyPresetToSlide(preset.id)}
              title={`Apply ${preset.name} to current slide`}
            />
            <div className="space-y-1.5 p-2">
              <p className="truncate font-mono text-[10px] font-medium">{preset.name}</p>
              <div className="flex gap-1">
                <Button
                  type="button"
                  variant="secondary"
                  size="sm"
                  className="h-6 flex-1 font-mono text-[9px]"
                  onClick={() => applyPresetToSlide(preset.id)}
                >
                  Apply
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="h-6 flex-1 font-mono text-[9px]"
                  onClick={() => applyPresetAsNewSlide(preset.id)}
                >
                  + New
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
