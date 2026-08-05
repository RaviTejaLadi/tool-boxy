// @ts-nocheck — typed gradually
import { Button } from '@/components/ui/button';
import { FONT_FAMILIES, QUICK_COLORS, TEXT_STYLE_PRESETS } from '../constants';
import { useComposerStore } from '../stores';
import { SectionHeading } from './SectionHeading';

export function TextSection() {
  const addText = useComposerStore((s) => s.addText);

  return (
    <section>
      <SectionHeading className="mb-3">Text styles</SectionHeading>
      <p className="mb-3 text-xs text-muted-foreground">Click to add text to the canvas. Double-click to edit.</p>
      <div className="space-y-2">
        {TEXT_STYLE_PRESETS.map((preset) => (
          <Button
            key={preset.name}
            type="button"
            variant="outline"
            onClick={() => addText(preset)}
            className="h-auto w-full justify-start px-3 py-3 text-left"
            style={{
              fontFamily: preset.fontFamily,
              fontWeight: preset.fontWeight,
              fontSize: Math.min(preset.fontSize * 0.28, 20),
            }}
          >
            {preset.name}
          </Button>
        ))}
      </div>

      <SectionHeading className="mb-3 mt-6">Quick colors</SectionHeading>
      <p className="mb-2 text-xs text-muted-foreground">Default text color when adding new text.</p>
      <div className="flex flex-wrap gap-1.5">
        {QUICK_COLORS.map((color) => (
          <button
            key={color}
            type="button"
            title={color}
            className="size-7 rounded-md border border-border transition-transform hover:scale-110"
            style={{ backgroundColor: color }}
            onClick={() =>
              addText({
                text: 'New text',
                fontSize: 32,
                fontWeight: 600,
                fontFamily: FONT_FAMILIES[0].value,
              })
            }
          />
        ))}
      </div>
    </section>
  );
}
