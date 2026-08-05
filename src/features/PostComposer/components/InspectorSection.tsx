// @ts-nocheck — typed gradually
import {
  AlignCenter,
  AlignLeft,
  AlignRight,
  ChevronDown,
  ChevronUp,
  ChevronsDown,
  ChevronsUp,
  Copy,
  Trash2,
} from 'lucide-react';
import { useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Slider } from '@/components/ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { parseSliderValue } from '@/lib/utils';
import { FONT_FAMILIES, QUICK_COLORS } from '../constants';
import { useActiveElements, useComposerStore } from '../stores';
import { SectionHeading } from './SectionHeading';

function sliderHandlers(patchSelected, updateSelected, toPatch, toCommit = toPatch) {
  return {
    onValueChange: (value) => patchSelected(toPatch(parseSliderValue(value))),
    onValueCommitted: (value) => updateSelected(toCommit(parseSliderValue(value))),
  };
}

export function InspectorSection() {
  const elements = useActiveElements();
  const selectedId = useComposerStore((s) => s.selectedId);
  const patchSelected = useComposerStore((s) => s.patchSelected);
  const updateSelected = useComposerStore((s) => s.updateSelected);
  const duplicateSelected = useComposerStore((s) => s.duplicateSelected);
  const reorder = useComposerStore((s) => s.reorder);
  const deleteSelected = useComposerStore((s) => s.deleteSelected);
  const replaceInputRef = useRef(null);

  const selected = elements.find((el) => el.id === selectedId) || null;

  const replaceSelectedImage = (file) => {
    const reader = new FileReader();
    reader.onload = () => updateSelected({ src: reader.result });
    reader.readAsDataURL(file);
  };

  const setNumeric = (key, value) => {
    const num = Number(value);
    if (!Number.isFinite(num)) return;
    updateSelected({ [key]: num });
  };

  return (
    <section>
      <SectionHeading className="mb-3">Edit element</SectionHeading>
      {!selected && (
        <p className="text-sm text-muted-foreground">
          Select an element on the canvas to edit position, style, and layers.
        </p>
      )}

      {selected && (
        <div className="space-y-5">
          <div className="flex flex-wrap items-center gap-1">
            <Button size="icon" variant="outline" className="size-8" onClick={duplicateSelected} title="Duplicate">
              <Copy className="size-3.5" />
            </Button>
            <Button size="icon" variant="outline" className="size-8" onClick={() => reorder('up')} title="Forward">
              <ChevronUp className="size-3.5" />
            </Button>
            <Button size="icon" variant="outline" className="size-8" onClick={() => reorder('down')} title="Backward">
              <ChevronDown className="size-3.5" />
            </Button>
            <Button
              size="icon"
              variant="outline"
              className="size-8"
              onClick={() => reorder('top')}
              title="Bring to front"
            >
              <ChevronsUp className="size-3.5" />
            </Button>
            <Button
              size="icon"
              variant="outline"
              className="size-8"
              onClick={() => reorder('bottom')}
              title="Send to back"
            >
              <ChevronsDown className="size-3.5" />
            </Button>
            <Button
              size="icon"
              variant="outline"
              className="size-8 text-destructive hover:text-destructive"
              onClick={deleteSelected}
              title="Delete"
            >
              <Trash2 className="size-3.5" />
            </Button>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <Label className="font-mono text-[10px] text-muted-foreground uppercase">X</Label>
              <Input
                type="number"
                value={Math.round(selected.x)}
                onChange={(e) => setNumeric('x', e.target.value)}
                className="mt-1 h-8 font-mono text-xs"
              />
            </div>
            <div>
              <Label className="font-mono text-[10px] text-muted-foreground uppercase">Y</Label>
              <Input
                type="number"
                value={Math.round(selected.y)}
                onChange={(e) => setNumeric('y', e.target.value)}
                className="mt-1 h-8 font-mono text-xs"
              />
            </div>
            <div>
              <Label className="font-mono text-[10px] text-muted-foreground uppercase">Width</Label>
              <Input
                type="number"
                value={Math.round(selected.width)}
                onChange={(e) => setNumeric('width', e.target.value)}
                className="mt-1 h-8 font-mono text-xs"
              />
            </div>
            <div>
              <Label className="font-mono text-[10px] text-muted-foreground uppercase">Height</Label>
              <Input
                type="number"
                value={Math.round(selected.height)}
                onChange={(e) => setNumeric('height', e.target.value)}
                className="mt-1 h-8 font-mono text-xs"
              />
            </div>
          </div>

          {selected.type === 'text' && (
            <div className="space-y-4">
              <div>
                <p className="mb-1.5 font-mono text-[10px] text-muted-foreground uppercase">Font</p>
                <Select
                  value={selected.fontFamily}
                  onValueChange={(value) => value && updateSelected({ fontFamily: value })}
                >
                  <SelectTrigger className="h-8 w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {FONT_FAMILIES.map((font) => (
                      <SelectItem key={font.id} value={font.value}>
                        {font.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <p className="mb-1.5 font-mono text-[10px] text-muted-foreground uppercase">
                  Size: {selected.fontSize}px
                </p>
                <Slider
                  value={[selected.fontSize]}
                  min={12}
                  max={160}
                  step={1}
                  {...sliderHandlers(patchSelected, updateSelected, (v) => ({ fontSize: v }))}
                />
              </div>
              <div>
                <p className="mb-1.5 font-mono text-[10px] text-muted-foreground uppercase">Weight</p>
                <div className="flex gap-1">
                  {[400, 600, 800].map((w) => (
                    <Button
                      key={w}
                      type="button"
                      variant={selected.fontWeight === w ? 'secondary' : 'outline'}
                      size="sm"
                      className="flex-1 font-mono text-xs"
                      onClick={() => updateSelected({ fontWeight: w })}
                    >
                      {w === 400 ? 'Regular' : w === 600 ? 'Medium' : 'Bold'}
                    </Button>
                  ))}
                </div>
              </div>
              <div>
                <p className="mb-1.5 font-mono text-[10px] text-muted-foreground uppercase">Align</p>
                <div className="flex gap-1">
                  {[
                    { v: 'left', icon: AlignLeft },
                    { v: 'center', icon: AlignCenter },
                    { v: 'right', icon: AlignRight },
                  ].map((a) => {
                    const Icon = a.icon;
                    return (
                      <Button
                        key={a.v}
                        type="button"
                        variant={selected.align === a.v ? 'secondary' : 'outline'}
                        size="sm"
                        className="flex-1"
                        onClick={() => updateSelected({ align: a.v })}
                      >
                        <Icon className="size-3.5" />
                      </Button>
                    );
                  })}
                </div>
              </div>
              <div>
                <p className="mb-1.5 font-mono text-[10px] text-muted-foreground uppercase">Color</p>
                <div className="flex flex-wrap gap-1.5">
                  {QUICK_COLORS.map((color) => (
                    <button
                      key={color}
                      type="button"
                      className="size-7 rounded-md border border-border"
                      style={{ backgroundColor: color }}
                      onClick={() => updateSelected({ color })}
                    />
                  ))}
                </div>
                <input
                  type="color"
                  value={selected.color}
                  onChange={(e) => updateSelected({ color: e.target.value })}
                  className="mt-2 h-8 w-full cursor-pointer rounded-md border border-border bg-background"
                />
              </div>
            </div>
          )}

          {selected.type === 'shape' && (
            <div className="space-y-4">
              <div>
                <p className="mb-1.5 font-mono text-[10px] text-muted-foreground uppercase">Fill</p>
                <div className="flex flex-wrap gap-1.5">
                  {QUICK_COLORS.map((color) => (
                    <button
                      key={color}
                      type="button"
                      className="size-7 rounded-md border border-border"
                      style={{ backgroundColor: color }}
                      onClick={() => updateSelected({ fill: color })}
                    />
                  ))}
                </div>
                <input
                  type="color"
                  value={selected.fill}
                  onChange={(e) => updateSelected({ fill: e.target.value })}
                  className="mt-2 h-8 w-full cursor-pointer rounded-md border border-border bg-background"
                />
              </div>
              {(selected.shapeType === 'rect' || selected.shapeType === 'pill' || selected.shapeType === 'frame') && (
                <div>
                  <p className="mb-1.5 font-mono text-[10px] text-muted-foreground uppercase">
                    Corner radius: {selected.radius || 0}px
                  </p>
                  <Slider
                    value={[selected.radius || 0]}
                    min={0}
                    max={160}
                    step={2}
                    {...sliderHandlers(patchSelected, updateSelected, (v) => ({ radius: v }))}
                  />
                </div>
              )}
            </div>
          )}

          {selected.type === 'image' && (
            <div className="space-y-3">
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="w-full"
                onClick={() => replaceInputRef.current?.click()}
              >
                Replace image
              </Button>
              <input
                ref={replaceInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) replaceSelectedImage(file);
                  e.target.value = '';
                }}
              />
            </div>
          )}

          <Separator />

          <div>
            <p className="mb-1.5 font-mono text-[10px] text-muted-foreground uppercase">
              Opacity: {Math.round((selected.opacity ?? 1) * 100)}%
            </p>
            <Slider
              value={[Math.round((selected.opacity ?? 1) * 100)]}
              min={0}
              max={100}
              step={1}
              {...sliderHandlers(
                patchSelected,
                updateSelected,
                (v) => ({ opacity: v / 100 }),
                (v) => ({ opacity: v / 100 })
              )}
            />
          </div>
          <div>
            <p className="mb-1.5 font-mono text-[10px] text-muted-foreground uppercase">
              Rotation: {selected.rotation || 0}°
            </p>
            <Slider
              value={[selected.rotation || 0]}
              min={-180}
              max={180}
              step={1}
              {...sliderHandlers(patchSelected, updateSelected, (v) => ({ rotation: v }))}
            />
          </div>
        </div>
      )}
    </section>
  );
}
