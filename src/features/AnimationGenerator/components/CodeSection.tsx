import { useMemo } from 'react';
import { SyntaxHighlight } from '@/components/SyntaxHighlight';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { buildCssText, buildHtmlText, getIterationValue, getTimingValue } from '../helpers';
import { useAnimationGeneratorStore } from '../stores';
import { SectionHeading } from './SectionHeading';

export function CodeSection() {
  const codeTab = useAnimationGeneratorStore((s) => s.codeTab);
  const setCodeTab = useAnimationGeneratorStore((s) => s.setCodeTab);
  const animationType = useAnimationGeneratorStore((s) => s.animationType);
  const duration = useAnimationGeneratorStore((s) => s.duration);
  const delay = useAnimationGeneratorStore((s) => s.delay);
  const timingFunction = useAnimationGeneratorStore((s) => s.timingFunction);
  const bezier = useAnimationGeneratorStore((s) => s.bezier);
  const iterationCount = useAnimationGeneratorStore((s) => s.iterationCount);
  const iterationCustom = useAnimationGeneratorStore((s) => s.iterationCustom);
  const direction = useAnimationGeneratorStore((s) => s.direction);
  const fillMode = useAnimationGeneratorStore((s) => s.fillMode);

  const cssText = useMemo(
    () =>
      buildCssText({
        animationType,
        duration,
        timingValue: getTimingValue(timingFunction, bezier),
        delay,
        iterationValue: getIterationValue(iterationCount, iterationCustom),
        direction,
        fillMode,
      }),
    [animationType, duration, delay, timingFunction, bezier, iterationCount, iterationCustom, direction, fillMode]
  );

  const htmlText = useMemo(() => buildHtmlText(animationType), [animationType]);

  return (
    <section className="space-y-2">
      <SectionHeading className="mb-3">Generated code</SectionHeading>
      <Tabs value={codeTab} onValueChange={(v) => setCodeTab(v as 'css' | 'html')}>
        <TabsList>
          <TabsTrigger value="css">CSS</TabsTrigger>
          <TabsTrigger value="html">HTML</TabsTrigger>
        </TabsList>
        <TabsContent value="css" className="mt-2">
          <SyntaxHighlight
            code={cssText}
            language="css"
            wrap
            className="max-h-48 overflow-auto border border-border bg-muted/40 p-3 font-mono text-[10px] leading-relaxed"
          />
        </TabsContent>
        <TabsContent value="html" className="mt-2">
          <SyntaxHighlight
            code={htmlText}
            language="markup"
            wrap
            className="max-h-48 overflow-auto border border-border bg-muted/40 p-3 font-mono text-[10px] leading-relaxed"
          />
        </TabsContent>
      </Tabs>
    </section>
  );
}
