import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { parseSliderValue } from '@/lib/utils';
import { generateGlassCssBlock } from '../helpers';
import { useGlassmorphismStore } from '../stores';
import { SectionHeading } from './SectionHeading';

export function GlassControlsSection() {
  const bgColor = useGlassmorphismStore((s) => s.bgColor);
  const bgOpacity = useGlassmorphismStore((s) => s.bgOpacity);
  const borderColor = useGlassmorphismStore((s) => s.borderColor);
  const borderOpacity = useGlassmorphismStore((s) => s.borderOpacity);
  const blur = useGlassmorphismStore((s) => s.blur);
  const borderRadius = useGlassmorphismStore((s) => s.borderRadius);
  const shadowIntensity = useGlassmorphismStore((s) => s.shadowIntensity);
  const borderWidth = useGlassmorphismStore((s) => s.borderWidth);
  const enableBorder = useGlassmorphismStore((s) => s.enableBorder);
  const enableShadow = useGlassmorphismStore((s) => s.enableShadow);
  const gradient1 = useGlassmorphismStore((s) => s.gradient1);
  const gradient2 = useGlassmorphismStore((s) => s.gradient2);
  const gradientAngle = useGlassmorphismStore((s) => s.gradientAngle);
  const getGlassOptions = useGlassmorphismStore((s) => s.getGlassOptions);
  const getPreviewBackground = useGlassmorphismStore((s) => s.getPreviewBackground);
  const setBgColor = useGlassmorphismStore((s) => s.setBgColor);
  const setBgOpacity = useGlassmorphismStore((s) => s.setBgOpacity);
  const setBorderColor = useGlassmorphismStore((s) => s.setBorderColor);
  const setBorderOpacity = useGlassmorphismStore((s) => s.setBorderOpacity);
  const setBlur = useGlassmorphismStore((s) => s.setBlur);
  const setBorderRadius = useGlassmorphismStore((s) => s.setBorderRadius);
  const setShadowIntensity = useGlassmorphismStore((s) => s.setShadowIntensity);
  const setBorderWidth = useGlassmorphismStore((s) => s.setBorderWidth);
  const setEnableBorder = useGlassmorphismStore((s) => s.setEnableBorder);
  const setEnableShadow = useGlassmorphismStore((s) => s.setEnableShadow);
  const setGradient1 = useGlassmorphismStore((s) => s.setGradient1);
  const setGradient2 = useGlassmorphismStore((s) => s.setGradient2);
  const setGradientAngle = useGlassmorphismStore((s) => s.setGradientAngle);

  const cssBlock = generateGlassCssBlock(getGlassOptions());

  return (
    <>
      <Tabs defaultValue="glass" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="glass">Glass</TabsTrigger>
          <TabsTrigger value="background">Background</TabsTrigger>
        </TabsList>

        <TabsContent value="glass" className="mt-4 space-y-4">
          <section className="space-y-4">
            <SectionHeading className="mb-3">Surface</SectionHeading>
            <div className="space-y-2">
              <Label>Background colour</Label>
              <div className="flex items-center gap-2">
                <Input
                  type="color"
                  value={bgColor}
                  onChange={(e) => setBgColor(e.target.value)}
                  className="size-10 border-0 p-1"
                />
                <Slider
                  value={[bgOpacity]}
                  onValueChange={(v) => setBgOpacity(parseSliderValue(v))}
                  max={100}
                  step={1}
                  className="flex-1"
                />
                <span className="w-10 font-mono text-xs tabular-nums">{bgOpacity}%</span>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label>Border</Label>
                <Switch checked={enableBorder} onCheckedChange={setEnableBorder} />
              </div>
              {enableBorder && (
                <div className="space-y-2 border-l-2 border-border pl-3">
                  <div className="flex items-center gap-2">
                    <Input
                      type="color"
                      value={borderColor}
                      onChange={(e) => setBorderColor(e.target.value)}
                      className="size-10 border-0 p-1"
                    />
                    <Slider
                      value={[borderOpacity]}
                      onValueChange={(v) => setBorderOpacity(parseSliderValue(v))}
                      max={100}
                      step={1}
                      className="flex-1"
                    />
                    <span className="w-10 font-mono text-xs">{borderOpacity}%</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Label className="text-xs">Width</Label>
                    <Slider
                      value={[borderWidth]}
                      onValueChange={(v) => setBorderWidth(parseSliderValue(v))}
                      max={5}
                      step={0.5}
                      className="flex-1"
                    />
                    <span className="w-10 font-mono text-xs">{borderWidth}px</span>
                  </div>
                </div>
              )}
            </div>

            <div className="space-y-2">
              <Label>Blur · {blur}px</Label>
              <Slider value={[blur]} onValueChange={(v) => setBlur(parseSliderValue(v))} max={30} step={1} />
            </div>

            <div className="space-y-2">
              <Label>Border radius · {borderRadius}px</Label>
              <Slider
                value={[borderRadius]}
                onValueChange={(v) => setBorderRadius(parseSliderValue(v))}
                max={40}
                step={1}
              />
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label>Shadow</Label>
                <Switch checked={enableShadow} onCheckedChange={setEnableShadow} />
              </div>
              {enableShadow && (
                <div className="space-y-2 border-l-2 border-border pl-3">
                  <Label className="text-xs">Intensity · {shadowIntensity}%</Label>
                  <Slider
                    value={[shadowIntensity]}
                    onValueChange={(v) => setShadowIntensity(parseSliderValue(v))}
                    max={50}
                    step={1}
                  />
                </div>
              )}
            </div>
          </section>
        </TabsContent>

        <TabsContent value="background" className="mt-4 space-y-4">
          <section className="space-y-4">
            <SectionHeading className="mb-3">Gradient</SectionHeading>
            <div className="space-y-2">
              <Label>Colour 1</Label>
              <Input
                type="color"
                value={gradient1}
                onChange={(e) => setGradient1(e.target.value)}
                className="h-10 w-full p-1"
              />
            </div>
            <div className="space-y-2">
              <Label>Colour 2</Label>
              <Input
                type="color"
                value={gradient2}
                onChange={(e) => setGradient2(e.target.value)}
                className="h-10 w-full p-1"
              />
            </div>
            <div className="space-y-2">
              <Label>Angle · {gradientAngle}°</Label>
              <Slider
                value={[gradientAngle]}
                onValueChange={(v) => setGradientAngle(parseSliderValue(v))}
                max={360}
                step={1}
              />
            </div>
            <div className="h-14 border border-border" style={{ background: getPreviewBackground() }} />
          </section>
        </TabsContent>
      </Tabs>

      <section className="space-y-2">
        <SectionHeading className="mb-3">CSS output</SectionHeading>
        <pre className="max-h-40 overflow-auto border border-border bg-muted/40 p-3 font-mono text-[10px] whitespace-pre-wrap">
          {cssBlock}
        </pre>
      </section>
    </>
  );
}
