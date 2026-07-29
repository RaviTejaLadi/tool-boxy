import { Grid } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { parseSliderValue } from '@/lib/utils';
import type { CornerValues } from '../helpers';
import { useBorderRadiusStore } from '../stores';
import { SectionHeading } from './SectionHeading';

const CORNER_KEYS = ['topLeft', 'topRight', 'bottomRight', 'bottomLeft'] as const;

function CornerControl({ corner, label }: { corner: keyof CornerValues; label: string }) {
  const corners = useBorderRadiusStore((s) => s.corners);
  const handleCornerChange = useBorderRadiusStore((s) => s.handleCornerChange);

  return (
    <div className="space-y-2">
      <Label>{label}</Label>
      <Slider
        value={[corners[corner]]}
        onValueChange={(val) => handleCornerChange(corner, parseSliderValue(val))}
        min={0}
        max={200}
        step={1}
      />
      <Input
        type="number"
        value={corners[corner]}
        onChange={(e) => handleCornerChange(corner, parseInt(e.target.value, 10) || 0)}
        min={0}
        max={200}
        className="h-8 w-20 font-mono text-sm"
      />
    </div>
  );
}

export function ControlsSection() {
  const linked = useBorderRadiusStore((s) => s.linked);
  const activeTab = useBorderRadiusStore((s) => s.activeTab);
  const corners = useBorderRadiusStore((s) => s.corners);
  const toggleLink = useBorderRadiusStore((s) => s.toggleLink);
  const applyPreset = useBorderRadiusStore((s) => s.applyPreset);
  const setActiveTab = useBorderRadiusStore((s) => s.setActiveTab);
  const handleCornerChange = useBorderRadiusStore((s) => s.handleCornerChange);

  return (
    <section className="space-y-4">
      <SectionHeading className="mb-3">Corners</SectionHeading>

      <div className="flex flex-wrap items-center justify-between gap-2">
        <Button variant={linked ? 'default' : 'outline'} size="sm" onClick={toggleLink} className="gap-2">
          <Grid className="size-4" />
          {linked ? 'Linked' : 'Unlinked'}
        </Button>
        <div className="flex flex-wrap gap-1">
          {[0, 4, 8, 16, 32].map((preset) => (
            <Button
              key={preset}
              variant="outline"
              size="sm"
              className="px-2 font-mono text-xs"
              onClick={() => applyPreset(preset)}
            >
              {preset}
            </Button>
          ))}
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="top">Top</TabsTrigger>
          <TabsTrigger value="bottom">Bottom</TabsTrigger>
          <TabsTrigger value="individual">Each</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="mt-4 space-y-4">
          <div className="space-y-2">
            <Label>All corners</Label>
            <Slider
              value={[corners.topLeft]}
              onValueChange={(val) => handleCornerChange('topLeft', parseSliderValue(val))}
              min={0}
              max={200}
              step={1}
            />
            <Input
              type="number"
              value={corners.topLeft}
              onChange={(e) => handleCornerChange('topLeft', parseInt(e.target.value, 10) || 0)}
              min={0}
              max={200}
              className="h-8 w-20 font-mono text-sm"
            />
          </div>
        </TabsContent>

        <TabsContent value="top" className="mt-4 space-y-4">
          <CornerControl corner="topLeft" label="Top left" />
          <CornerControl corner="topRight" label="Top right" />
        </TabsContent>

        <TabsContent value="bottom" className="mt-4 space-y-4">
          <CornerControl corner="bottomRight" label="Bottom right" />
          <CornerControl corner="bottomLeft" label="Bottom left" />
        </TabsContent>

        <TabsContent value="individual" className="mt-4 space-y-4">
          {CORNER_KEYS.map((corner) => (
            <CornerControl
              key={corner}
              corner={corner}
              label={corner.replace(/([A-Z])/g, ' $1').replace(/^./, (c) => c.toUpperCase())}
            />
          ))}
        </TabsContent>
      </Tabs>
    </section>
  );
}
