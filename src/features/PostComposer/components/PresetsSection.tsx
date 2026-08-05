// @ts-nocheck — typed gradually
import { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { DESIGN_PRESETS, PRESET_CATEGORIES } from '../constants';
import { useComposerStore } from '../stores';
import { PresetThumbnail } from './PresetThumbnail';
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
        Premium layouts with layered typography, accents, and shapes. Apply to the current slide or add as new.
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

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        {filtered.map((preset) => (
          <div
            key={preset.id}
            className="group overflow-hidden rounded-lg border border-border bg-background transition-shadow hover:shadow-md"
          >
            <button
              type="button"
              className="block w-full cursor-pointer text-left"
              onClick={() => applyPresetToSlide(preset.id)}
              title={`Apply ${preset.name} to current slide`}
            >
              <PresetThumbnail preset={preset} />
            </button>
            <div className="space-y-2 border-t border-border p-2.5">
              <div className="flex items-center gap-1.5">
                <p className="min-w-0 flex-1 truncate font-mono text-[10px] font-semibold">{preset.name}</p>
                {preset.category === 'Premium' && (
                  <Badge variant="secondary" className="h-4 shrink-0 px-1.5 font-mono text-[8px] uppercase">
                    Pro
                  </Badge>
                )}
              </div>
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
