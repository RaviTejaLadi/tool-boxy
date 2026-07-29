import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { parseSliderValue } from '@/lib/utils';
import {
  ALIGN_CONTENT_OPTIONS,
  ALIGN_ITEMS_OPTIONS,
  FLEX_DIRECTION_OPTIONS,
  FLEX_WRAP_OPTIONS,
  JUSTIFY_CONTENT_OPTIONS,
} from '../constants';
import { useFlexboxPlaygroundStore } from '../stores';
import { SectionHeading } from './SectionHeading';

export function ContainerSection() {
  const flexDirection = useFlexboxPlaygroundStore((s) => s.flexDirection);
  const flexWrap = useFlexboxPlaygroundStore((s) => s.flexWrap);
  const justifyContent = useFlexboxPlaygroundStore((s) => s.justifyContent);
  const alignItems = useFlexboxPlaygroundStore((s) => s.alignItems);
  const alignContent = useFlexboxPlaygroundStore((s) => s.alignContent);
  const gap = useFlexboxPlaygroundStore((s) => s.gap);
  const setFlexDirection = useFlexboxPlaygroundStore((s) => s.setFlexDirection);
  const setFlexWrap = useFlexboxPlaygroundStore((s) => s.setFlexWrap);
  const setJustifyContent = useFlexboxPlaygroundStore((s) => s.setJustifyContent);
  const setAlignItems = useFlexboxPlaygroundStore((s) => s.setAlignItems);
  const setAlignContent = useFlexboxPlaygroundStore((s) => s.setAlignContent);
  const setGap = useFlexboxPlaygroundStore((s) => s.setGap);

  return (
    <section className="space-y-4">
      <SectionHeading className="mb-3">Container</SectionHeading>

      <div className="space-y-2">
        <Label className="text-xs text-muted-foreground">Flex direction</Label>
        <Select value={flexDirection} onValueChange={(value) => value && setFlexDirection(value)}>
          <SelectTrigger className="h-9 w-full text-sm">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {FLEX_DIRECTION_OPTIONS.map((option) => (
              <SelectItem key={option} value={option}>
                {option}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label className="text-xs text-muted-foreground">Flex wrap</Label>
        <Select value={flexWrap} onValueChange={(value) => value && setFlexWrap(value)}>
          <SelectTrigger className="h-9 w-full text-sm">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {FLEX_WRAP_OPTIONS.map((option) => (
              <SelectItem key={option} value={option}>
                {option}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label className="text-xs text-muted-foreground">Justify content</Label>
        <Select value={justifyContent} onValueChange={(value) => value && setJustifyContent(value)}>
          <SelectTrigger className="h-9 w-full text-sm">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {JUSTIFY_CONTENT_OPTIONS.map((option) => (
              <SelectItem key={option} value={option}>
                {option}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label className="text-xs text-muted-foreground">Align items</Label>
        <Select value={alignItems} onValueChange={(value) => value && setAlignItems(value)}>
          <SelectTrigger className="h-9 w-full text-sm">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {ALIGN_ITEMS_OPTIONS.map((option) => (
              <SelectItem key={option} value={option}>
                {option}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label className="text-xs text-muted-foreground">Align content</Label>
        <Select value={alignContent} onValueChange={(value) => value && setAlignContent(value)}>
          <SelectTrigger className="h-9 w-full text-sm">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {ALIGN_CONTENT_OPTIONS.map((option) => (
              <SelectItem key={option} value={option}>
                {option}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label className="text-xs text-muted-foreground">Gap</Label>
          <span className="font-mono text-xs">{gap}px</span>
        </div>
        <Slider value={[gap]} min={0} max={40} step={2} onValueChange={(v) => setGap(parseSliderValue(v))} />
      </div>
    </section>
  );
}
