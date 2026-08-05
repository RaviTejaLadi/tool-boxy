import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Field, FieldContent, FieldLabel } from '@/components/ui/field';
import { parseSliderValue } from '@/lib/utils';
import { COLORS } from '../constants';
import { useAnnotatorStore, selectAnnotations } from '../stores';
import { SectionHeading } from './SectionHeading';

export function StyleSection() {
  const image = useAnnotatorStore((s) => s.image);
  const tool = useAnnotatorStore((s) => s.tool);
  const color = useAnnotatorStore((s) => s.color);
  const strokeWidth = useAnnotatorStore((s) => s.strokeWidth);
  const fontSize = useAnnotatorStore((s) => s.fontSize);
  const opacity = useAnnotatorStore((s) => s.opacity);
  const filled = useAnnotatorStore((s) => s.filled);
  const dashed = useAnnotatorStore((s) => s.dashed);
  const selectedId = useAnnotatorStore((s) => s.selectedId);
  const annotations = useAnnotatorStore(selectAnnotations);
  const setColor = useAnnotatorStore((s) => s.setColor);
  const setStrokeWidth = useAnnotatorStore((s) => s.setStrokeWidth);
  const setFontSize = useAnnotatorStore((s) => s.setFontSize);
  const setOpacity = useAnnotatorStore((s) => s.setOpacity);
  const setFilled = useAnnotatorStore((s) => s.setFilled);
  const setDashed = useAnnotatorStore((s) => s.setDashed);
  const applyStyleToSelected = useAnnotatorStore((s) => s.applyStyleToSelected);

  const selected = annotations.find((a) => a.id === selectedId) ?? null;
  const showFontSize =
    tool === 'text' || tool === 'callout' || selected?.type === 'text' || selected?.type === 'callout';
  const canFill = tool === 'rect' || tool === 'ellipse' || selected?.type === 'rect' || selected?.type === 'ellipse';
  const canDash =
    tool === 'rect' ||
    tool === 'ellipse' ||
    tool === 'line' ||
    tool === 'arrow' ||
    tool === 'pen' ||
    selected?.type === 'rect' ||
    selected?.type === 'ellipse' ||
    selected?.type === 'line' ||
    selected?.type === 'arrow' ||
    selected?.type === 'pen';

  const activeColor = selected?.color ?? color;
  const activeStroke = selected?.strokeWidth ?? strokeWidth;
  const activeFontSize = selected?.type === 'text' || selected?.type === 'callout' ? selected.fontSize : fontSize;
  const activeOpacity = selected?.opacity ?? opacity;
  const activeFilled = selected && 'filled' in selected ? selected.filled : filled;
  const activeDashed = selected?.dashed ?? dashed;

  const setColorValue = (c: string) => {
    setColor(c);
    if (selected) applyStyleToSelected({ color: c });
  };

  const setStrokeValue = (w: number) => {
    setStrokeWidth(w);
    if (selected) applyStyleToSelected({ strokeWidth: w });
  };

  const setFontSizeValue = (s: number) => {
    setFontSize(s);
    if (selected?.type === 'text' || selected?.type === 'callout') applyStyleToSelected({ fontSize: s });
  };

  const setOpacityValue = (o: number) => {
    setOpacity(o);
    if (selected) applyStyleToSelected({ opacity: o });
  };

  return (
    <section className="space-y-4">
      <SectionHeading className="mb-1">Style</SectionHeading>

      <div>
        <Label className="mb-2 block text-sm">Color</Label>
        <div className="flex flex-wrap items-center gap-1.5">
          {COLORS.map((c) => (
            <button
              key={c}
              type="button"
              disabled={!image}
              onClick={() => setColorValue(c)}
              aria-label={`Color ${c}`}
              className={`size-6 shrink-0 rounded-none border transition-transform hover:scale-105 disabled:opacity-40 ${
                activeColor === c ? 'ring-2 ring-primary ring-offset-1 ring-offset-background' : 'border-border'
              }`}
              style={{ backgroundColor: c }}
            />
          ))}
          <input
            type="color"
            value={activeColor}
            disabled={!image}
            onChange={(e) => setColorValue(e.target.value)}
            className="size-6 cursor-pointer rounded-none border border-border bg-transparent disabled:opacity-40"
            title="Custom color"
          />
        </div>
      </div>

      <Field>
        <div className="mb-2 flex items-center justify-between">
          <Label className="text-sm">{showFontSize ? 'Font size' : 'Stroke'}</Label>
          <span className="font-mono text-xs text-muted-foreground">
            {showFontSize ? activeFontSize : activeStroke}px
          </span>
        </div>
        <FieldContent>
          <Slider
            value={[showFontSize ? activeFontSize : activeStroke]}
            min={showFontSize ? 12 : 1}
            max={showFontSize ? 96 : 40}
            step={1}
            disabled={!image}
            onValueChange={(v) =>
              showFontSize ? setFontSizeValue(parseSliderValue(v)) : setStrokeValue(parseSliderValue(v))
            }
          />
        </FieldContent>
      </Field>

      <Field>
        <div className="mb-2 flex items-center justify-between">
          <Label className="text-sm">Opacity</Label>
          <span className="font-mono text-xs text-muted-foreground">{Math.round(activeOpacity * 100)}%</span>
        </div>
        <FieldContent>
          <Slider
            value={[activeOpacity]}
            min={0.1}
            max={1}
            step={0.05}
            disabled={!image}
            onValueChange={(v) => setOpacityValue(parseSliderValue(v))}
          />
        </FieldContent>
      </Field>

      {canFill && (
        <Field orientation="horizontal" className="items-center justify-between">
          <FieldLabel className="text-sm">Filled</FieldLabel>
          <Switch
            checked={activeFilled}
            disabled={!image}
            onCheckedChange={(checked) => {
              setFilled(checked);
              if (selected && 'filled' in selected) applyStyleToSelected({ filled: checked });
            }}
          />
        </Field>
      )}

      {canDash && (
        <Field orientation="horizontal" className="items-center justify-between">
          <FieldLabel className="text-sm">Dashed</FieldLabel>
          <Switch
            checked={activeDashed}
            disabled={!image}
            onCheckedChange={(checked) => {
              setDashed(checked);
              if (selected) applyStyleToSelected({ dashed: checked });
            }}
          />
        </Field>
      )}
    </section>
  );
}
