import { useMemo } from 'react';
import { SyntaxHighlight } from '@/components/SyntaxHighlight';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  buildCssText,
  buildHtmlText,
  buildTextCssText,
  buildTextHtmlText,
  getIterationValue,
  getTimingValue,
} from '../helpers';
import { useAnimationGeneratorStore } from '../stores';
import { SectionHeading } from './SectionHeading';

export function CodeSection() {
  const codeTab = useAnimationGeneratorStore((s) => s.codeTab);
  const setCodeTab = useAnimationGeneratorStore((s) => s.setCodeTab);
  const previewMode = useAnimationGeneratorStore((s) => s.previewMode);
  const animationType = useAnimationGeneratorStore((s) => s.animationType);
  const textAnimationType = useAnimationGeneratorStore((s) => s.textAnimationType);
  const duration = useAnimationGeneratorStore((s) => s.duration);
  const delay = useAnimationGeneratorStore((s) => s.delay);
  const timingFunction = useAnimationGeneratorStore((s) => s.timingFunction);
  const bezier = useAnimationGeneratorStore((s) => s.bezier);
  const iterationCount = useAnimationGeneratorStore((s) => s.iterationCount);
  const iterationCustom = useAnimationGeneratorStore((s) => s.iterationCustom);
  const direction = useAnimationGeneratorStore((s) => s.direction);
  const fillMode = useAnimationGeneratorStore((s) => s.fillMode);
  const textPhase = useAnimationGeneratorStore((s) => s.textPhase);
  const textStagger = useAnimationGeneratorStore((s) => s.textStagger);
  const textSegmentMode = useAnimationGeneratorStore((s) => s.textSegmentMode);
  const textDirection = useAnimationGeneratorStore((s) => s.textDirection);
  const previewText = useAnimationGeneratorStore((s) => s.previewText);

  const cssText = useMemo(() => {
    const timingValue = getTimingValue(timingFunction, bezier);
    const iterationValue = getIterationValue(iterationCount, iterationCustom);

    if (previewMode === 'text') {
      return buildTextCssText({
        textAnimationType,
        phase: textPhase,
        duration,
        timingValue,
        delay,
        iterationValue,
        direction,
        fillMode,
        stagger: textStagger,
        segmentMode: textSegmentMode,
        textDirection,
        previewText,
      });
    }

    return buildCssText({
      animationType,
      duration,
      timingValue,
      delay,
      iterationValue,
      direction,
      fillMode,
    });
  }, [
    previewMode,
    animationType,
    textAnimationType,
    duration,
    delay,
    timingFunction,
    bezier,
    iterationCount,
    iterationCustom,
    direction,
    fillMode,
    textPhase,
    textStagger,
    textSegmentMode,
    textDirection,
    previewText,
  ]);

  const htmlText = useMemo(() => {
    if (previewMode === 'text') {
      return buildTextHtmlText({
        textAnimationType,
        segmentMode: textSegmentMode,
        previewText,
      });
    }
    return buildHtmlText(animationType);
  }, [previewMode, animationType, textAnimationType, textSegmentMode, previewText]);

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
            className="max-h-56 overflow-auto border border-border bg-muted/40 p-3 font-mono text-[10px] leading-relaxed"
          />
        </TabsContent>
        <TabsContent value="html" className="mt-2">
          <SyntaxHighlight
            code={htmlText}
            language="markup"
            wrap
            className="max-h-56 overflow-auto border border-border bg-muted/40 p-3 font-mono text-[10px] leading-relaxed"
          />
        </TabsContent>
      </Tabs>
    </section>
  );
}
