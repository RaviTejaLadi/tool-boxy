import { ColorPickerSwatch } from '@/components/ColorPickerSwatch';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { parseSliderValue } from '@/lib/utils';
import type { GradientType } from '../constants';
import { getCurrentCSS } from '../helpers';
import { useGradientStore } from '../stores';
import { SectionHeading } from './SectionHeading';

export function ControlsSection() {
  const activeTab = useGradientStore((s) => s.activeTab);
  const angle = useGradientStore((s) => s.angle);
  const noise = useGradientStore((s) => s.noise);
  const exportSize = useGradientStore((s) => s.exportSize);
  const linearStops = useGradientStore((s) => s.linearStops);
  const cornerStops = useGradientStore((s) => s.cornerStops);
  const meshStops = useGradientStore((s) => s.meshStops);
  const meshGrid = useGradientStore((s) => s.meshGrid);
  const setActiveTab = useGradientStore((s) => s.setActiveTab);
  const setAngle = useGradientStore((s) => s.setAngle);
  const setNoise = useGradientStore((s) => s.setNoise);
  const setExportSize = useGradientStore((s) => s.setExportSize);
  const setLinearStops = useGradientStore((s) => s.setLinearStops);
  const setCornerStops = useGradientStore((s) => s.setCornerStops);
  const setMeshStops = useGradientStore((s) => s.setMeshStops);
  const setMeshGrid = useGradientStore((s) => s.setMeshGrid);

  const css = getCurrentCSS(activeTab, angle, linearStops, cornerStops, meshStops);

  return (
    <>
      <section className="space-y-3">
        <SectionHeading className="mb-3">Type</SectionHeading>
        <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as GradientType)}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="linear">Linear</TabsTrigger>
            <TabsTrigger value="corners">Corners</TabsTrigger>
            <TabsTrigger value="mesh">Mesh</TabsTrigger>
          </TabsList>
        </Tabs>
      </section>

      {activeTab === 'linear' && (
        <section className="space-y-3">
          <SectionHeading className="mb-3">Colour stops</SectionHeading>
          {linearStops.map((stop, idx) => (
            <div key={stop.id} className="flex items-center gap-2">
              <ColorPickerSwatch
                value={stop.color}
                onChange={(color) => {
                  const next = [...linearStops];
                  next[idx] = { ...next[idx], color };
                  setLinearStops(next);
                }}
                className="size-8"
                ariaLabel={`Pick colour for stop ${idx + 1}`}
              />
              <Input
                value={stop.color}
                onChange={(e) => {
                  const next = [...linearStops];
                  next[idx] = { ...next[idx], color: e.target.value };
                  setLinearStops(next);
                }}
                className="h-8 w-24 font-mono text-xs"
              />
              <Input
                type="number"
                value={stop.position}
                onChange={(e) => {
                  const next = [...linearStops];
                  next[idx] = { ...next[idx], position: Number(e.target.value) };
                  setLinearStops(next);
                }}
                className="h-8 w-16"
                min={0}
                max={100}
              />
              <span className="text-xs text-muted-foreground">%</span>
              {idx > 0 && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setLinearStops(linearStops.filter((_, i) => i !== idx))}
                >
                  ✕
                </Button>
              )}
            </div>
          ))}
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              const last = linearStops[linearStops.length - 1];
              setLinearStops([
                ...linearStops,
                {
                  id: String(Date.now()),
                  color: '#000000',
                  position: Math.min(100, (last?.position || 0) + 10),
                },
              ]);
            }}
          >
            Add stop
          </Button>

          <div className="space-y-2 pt-2">
            <Label>Angle</Label>
            <div className="flex items-center gap-2">
              <Slider
                value={[angle]}
                onValueChange={(v) => setAngle(parseSliderValue(v))}
                max={360}
                step={1}
                className="flex-1"
              />
              <Input
                type="number"
                value={angle}
                onChange={(e) => setAngle(Number(e.target.value))}
                className="h-8 w-16"
              />
              <span className="text-xs">deg</span>
            </div>
          </div>
        </section>
      )}

      {activeTab === 'corners' && (
        <section className="space-y-3">
          <SectionHeading className="mb-3">Corner colours</SectionHeading>
          <div className="grid grid-cols-1 gap-2">
            {cornerStops.map((stop, idx) => (
              <div key={stop.id} className="flex items-center gap-2">
                <ColorPickerSwatch
                  value={stop.color}
                  onChange={(color) => {
                    const next = [...cornerStops];
                    next[idx] = { ...next[idx], color };
                    setCornerStops(next);
                  }}
                  className="size-8"
                  ariaLabel={`Pick ${stop.label} colour`}
                />
                <Input
                  value={stop.color}
                  onChange={(e) => {
                    const next = [...cornerStops];
                    next[idx] = { ...next[idx], color: e.target.value };
                    setCornerStops(next);
                  }}
                  className="h-8 w-24 font-mono text-xs"
                />
                <span className="truncate text-xs text-muted-foreground">{stop.label}</span>
              </div>
            ))}
          </div>
        </section>
      )}

      {activeTab === 'mesh' && (
        <section className="space-y-3">
          <div className="flex items-center justify-between">
            <SectionHeading className="mb-0 border-0 pb-0">Control points</SectionHeading>
            <Select value={meshGrid} onValueChange={(v) => v && setMeshGrid(v as '2x2' | '3x3')}>
              <SelectTrigger className="h-8 w-24">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="2x2">2x2</SelectItem>
                <SelectItem value="3x3">3x3</SelectItem>
              </SelectContent>
            </Select>
          </div>
          {meshStops.map((stop, idx) => (
            <div key={stop.id} className="flex flex-wrap items-center gap-2">
              <ColorPickerSwatch
                value={stop.color}
                onChange={(color) => {
                  const next = [...meshStops];
                  next[idx] = { ...next[idx], color };
                  setMeshStops(next);
                }}
                className="size-8"
                ariaLabel={`Pick ${stop.label} colour`}
              />
              <Input
                value={stop.color}
                onChange={(e) => {
                  const next = [...meshStops];
                  next[idx] = { ...next[idx], color: e.target.value };
                  setMeshStops(next);
                }}
                className="h-8 w-20 font-mono text-xs"
              />
              <span className="w-16 truncate text-xs text-muted-foreground">{stop.label}</span>
              <Input
                type="number"
                value={stop.x}
                onChange={(e) => {
                  const next = [...meshStops];
                  next[idx] = { ...next[idx], x: Number(e.target.value) };
                  setMeshStops(next);
                }}
                className="h-8 w-12"
              />
              <Input
                type="number"
                value={stop.y}
                onChange={(e) => {
                  const next = [...meshStops];
                  next[idx] = { ...next[idx], y: Number(e.target.value) };
                  setMeshStops(next);
                }}
                className="h-8 w-12"
              />
            </div>
          ))}
        </section>
      )}

      <section className="space-y-2">
        <SectionHeading className="mb-3">Noise · {noise}%</SectionHeading>
        <Slider value={[noise]} onValueChange={(v) => setNoise(parseSliderValue(v))} max={100} step={1} />
        <p className="text-xs text-muted-foreground">Grain for image export only, not CSS preview.</p>
      </section>

      <section className="space-y-2">
        <SectionHeading className="mb-3">Export size</SectionHeading>
        <Select value={exportSize} onValueChange={(v) => v && setExportSize(v)}>
          <SelectTrigger className="h-8">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="512x512">512</SelectItem>
            <SelectItem value="1024x1024">1K</SelectItem>
            <SelectItem value="1920x1080">4K HD</SelectItem>
            <SelectItem value="1080x1080">Insta</SelectItem>
            <SelectItem value="1080x1920">Story</SelectItem>
          </SelectContent>
        </Select>
      </section>

      <section className="space-y-2">
        <SectionHeading className="mb-3">CSS</SectionHeading>
        <pre className="max-h-32 overflow-auto border border-border bg-muted/40 p-3 font-mono text-[10px] whitespace-pre-wrap break-all">
          {css}
        </pre>
      </section>
    </>
  );
}
