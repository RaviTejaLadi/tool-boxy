import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { usePlaceholderStore } from '../stores';
import { SectionHeading } from './SectionHeading';

export function AppearanceSection() {
  const bgColor = usePlaceholderStore((s) => s.bgColor);
  const textColor = usePlaceholderStore((s) => s.textColor);
  const customText = usePlaceholderStore((s) => s.customText);
  const setBgColor = usePlaceholderStore((s) => s.setBgColor);
  const setTextColor = usePlaceholderStore((s) => s.setTextColor);
  const setCustomText = usePlaceholderStore((s) => s.setCustomText);

  return (
    <section className="space-y-4">
      <SectionHeading className="mb-3">Appearance</SectionHeading>

      <div className="flex gap-3">
        <div className="flex-1 space-y-2">
          <Label className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">Background</Label>
          <div className="flex items-center gap-2">
            <label className="relative size-9 shrink-0 cursor-pointer overflow-hidden border border-border">
              <span className="absolute inset-0" style={{ backgroundColor: bgColor }} />
              <input
                type="color"
                value={bgColor}
                onChange={(e) => setBgColor(e.target.value)}
                className="absolute inset-0 size-full cursor-pointer opacity-0"
                aria-label="Pick background colour"
              />
            </label>
            <Input
              type="text"
              value={bgColor}
              onChange={(e) => setBgColor(e.target.value)}
              spellCheck={false}
              className="font-mono text-sm"
            />
          </div>
        </div>
        <div className="flex-1 space-y-2">
          <Label className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">Text</Label>
          <div className="flex items-center gap-2">
            <label className="relative size-9 shrink-0 cursor-pointer overflow-hidden border border-border">
              <span className="absolute inset-0" style={{ backgroundColor: textColor }} />
              <input
                type="color"
                value={textColor}
                onChange={(e) => setTextColor(e.target.value)}
                className="absolute inset-0 size-full cursor-pointer opacity-0"
                aria-label="Pick text colour"
              />
            </label>
            <Input
              type="text"
              value={textColor}
              onChange={(e) => setTextColor(e.target.value)}
              spellCheck={false}
              className="font-mono text-sm"
            />
          </div>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="custom-text" className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">
          Custom Text
        </Label>
        <Input
          id="custom-text"
          type="text"
          value={customText}
          onChange={(e) => setCustomText(e.target.value)}
          placeholder="Enter custom text"
        />
      </div>
    </section>
  );
}
