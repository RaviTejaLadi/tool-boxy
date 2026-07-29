import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { parseSliderValue } from '@/lib/utils';
import { ALIGN_SELF_OPTIONS, FLEX_BASIS_OPTIONS } from '../constants';
import { useFlexboxPlaygroundStore } from '../stores';
import { SectionHeading } from './SectionHeading';

export function ItemsSection() {
  const itemCount = useFlexboxPlaygroundStore((s) => s.itemCount);
  const itemWidth = useFlexboxPlaygroundStore((s) => s.itemWidth);
  const itemHeight = useFlexboxPlaygroundStore((s) => s.itemHeight);
  const itemGrow = useFlexboxPlaygroundStore((s) => s.itemGrow);
  const itemShrink = useFlexboxPlaygroundStore((s) => s.itemShrink);
  const itemBasis = useFlexboxPlaygroundStore((s) => s.itemBasis);
  const alignSelf = useFlexboxPlaygroundStore((s) => s.alignSelf);
  const setItemCount = useFlexboxPlaygroundStore((s) => s.setItemCount);
  const setItemWidth = useFlexboxPlaygroundStore((s) => s.setItemWidth);
  const setItemHeight = useFlexboxPlaygroundStore((s) => s.setItemHeight);
  const setItemGrow = useFlexboxPlaygroundStore((s) => s.setItemGrow);
  const setItemShrink = useFlexboxPlaygroundStore((s) => s.setItemShrink);
  const setItemBasis = useFlexboxPlaygroundStore((s) => s.setItemBasis);
  const setAlignSelf = useFlexboxPlaygroundStore((s) => s.setAlignSelf);

  return (
    <section className="space-y-4">
      <SectionHeading className="mb-3">Items</SectionHeading>

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label className="text-xs text-muted-foreground">Count</Label>
          <span className="font-mono text-xs">{itemCount}</span>
        </div>
        <Slider value={[itemCount]} min={2} max={8} step={1} onValueChange={(v) => setItemCount(parseSliderValue(v))} />
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label className="text-xs text-muted-foreground">Width</Label>
          <span className="font-mono text-xs">{itemWidth}px</span>
        </div>
        <Slider
          value={[itemWidth]}
          min={40}
          max={160}
          step={5}
          onValueChange={(v) => setItemWidth(parseSliderValue(v))}
        />
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label className="text-xs text-muted-foreground">Height</Label>
          <span className="font-mono text-xs">{itemHeight}px</span>
        </div>
        <Slider
          value={[itemHeight]}
          min={40}
          max={160}
          step={5}
          onValueChange={(v) => setItemHeight(parseSliderValue(v))}
        />
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label className="text-xs text-muted-foreground">Flex grow</Label>
          <span className="font-mono text-xs">{itemGrow}</span>
        </div>
        <Slider value={[itemGrow]} min={0} max={3} step={1} onValueChange={(v) => setItemGrow(parseSliderValue(v))} />
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label className="text-xs text-muted-foreground">Flex shrink</Label>
          <span className="font-mono text-xs">{itemShrink}</span>
        </div>
        <Slider
          value={[itemShrink]}
          min={0}
          max={3}
          step={1}
          onValueChange={(v) => setItemShrink(parseSliderValue(v))}
        />
      </div>

      <div className="space-y-2">
        <Label className="text-xs text-muted-foreground">Flex basis</Label>
        <Select value={itemBasis} onValueChange={(value) => value && setItemBasis(value)}>
          <SelectTrigger className="h-9 w-full text-sm">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {FLEX_BASIS_OPTIONS.map((option) => (
              <SelectItem key={option} value={option}>
                {option}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label className="text-xs text-muted-foreground">Align self</Label>
        <Select value={alignSelf} onValueChange={(value) => value && setAlignSelf(value)}>
          <SelectTrigger className="h-9 w-full text-sm">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {ALIGN_SELF_OPTIONS.map((option) => (
              <SelectItem key={option} value={option}>
                {option}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </section>
  );
}
