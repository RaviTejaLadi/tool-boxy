// @ts-nocheck — typed gradually
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { ButtonGroup } from '@/components/ui/button-group';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { Field, FieldContent, FieldLabel } from '@/components/ui/field';
import { PADDING_PRESETS } from '../constants';
import { useWindowStore } from '../stores';
import { SectionHeading } from './SectionHeading';

export function WindowSection() {
  const showTitleBar = useWindowStore((s) => s.showTitleBar);
  const showWindowControls = useWindowStore((s) => s.showWindowControls);
  const showLineNumbers = useWindowStore((s) => s.showLineNumbers);
  const showShadow = useWindowStore((s) => s.showShadow);
  const framePadding = useWindowStore((s) => s.framePadding);
  const cornerRadius = useWindowStore((s) => s.cornerRadius);
  const fontSize = useWindowStore((s) => s.fontSize);
  const setShowTitleBar = useWindowStore((s) => s.setShowTitleBar);
  const setShowWindowControls = useWindowStore((s) => s.setShowWindowControls);
  const setShowLineNumbers = useWindowStore((s) => s.setShowLineNumbers);
  const setShowShadow = useWindowStore((s) => s.setShowShadow);
  const setFramePadding = useWindowStore((s) => s.setFramePadding);
  const setCornerRadius = useWindowStore((s) => s.setCornerRadius);
  const setFontSize = useWindowStore((s) => s.setFontSize);

  return (
    <section className="space-y-4">
      <SectionHeading className="mb-1">Window</SectionHeading>

      <Field orientation="horizontal" className="items-center justify-between">
        <FieldLabel className="text-sm">Title bar</FieldLabel>
        <Switch checked={showTitleBar} onCheckedChange={setShowTitleBar} />
      </Field>

      <Field orientation="horizontal" className="items-center justify-between">
        <FieldLabel className="text-sm">Window controls</FieldLabel>
        <Switch checked={showWindowControls} onCheckedChange={setShowWindowControls} disabled={!showTitleBar} />
      </Field>

      <Field orientation="horizontal" className="items-center justify-between">
        <FieldLabel className="text-sm">Line numbers</FieldLabel>
        <Switch checked={showLineNumbers} onCheckedChange={setShowLineNumbers} />
      </Field>

      <Field orientation="horizontal" className="items-center justify-between">
        <FieldLabel className="text-sm">Shadow</FieldLabel>
        <Switch checked={showShadow} onCheckedChange={setShowShadow} />
      </Field>

      <Field>
        <div className="mb-2 flex items-center justify-between">
          <Label className="text-sm">Padding</Label>
          <span className="font-mono text-xs text-muted-foreground">{framePadding}px</span>
        </div>
        <FieldContent>
          <ButtonGroup className="w-full">
            <ToggleGroup
              value={[String(framePadding)]}
              onValueChange={(value) => {
                const next = value[0];
                if (next) setFramePadding(Number(next));
              }}
              variant="outline"
              size="sm"
              spacing={0}
              className="w-full"
            >
              {PADDING_PRESETS.map((padding) => (
                <ToggleGroupItem
                  key={padding}
                  value={String(padding)}
                  className="flex-1 rounded-none border-0 font-mono text-xs"
                >
                  {padding}
                </ToggleGroupItem>
              ))}
            </ToggleGroup>
          </ButtonGroup>
        </FieldContent>
      </Field>

      <Field>
        <div className="mb-2 flex items-center justify-between">
          <Label className="text-sm">Corner radius</Label>
          <span className="font-mono text-xs text-muted-foreground">{cornerRadius}px</span>
        </div>
        <FieldContent>
          <Slider
            value={[cornerRadius]}
            min={0}
            max={32}
            step={1}
            onValueChange={(value) => setCornerRadius(Array.isArray(value) ? value[0] : value)}
          />
        </FieldContent>
      </Field>

      <Field>
        <div className="mb-2 flex items-center justify-between">
          <Label className="text-sm">Font size</Label>
          <span className="font-mono text-xs text-muted-foreground">{fontSize}px</span>
        </div>
        <FieldContent>
          <Slider
            value={[fontSize]}
            min={11}
            max={24}
            step={1}
            onValueChange={(value) => setFontSize(Array.isArray(value) ? value[0] : value)}
          />
        </FieldContent>
      </Field>
    </section>
  );
}
