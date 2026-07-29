import { useMemo } from 'react';
import { buildFlexboxCss } from '../helpers';
import { useFlexboxPlaygroundStore } from '../stores';
import { SectionHeading } from './SectionHeading';

export function CssSection() {
  const flexDirection = useFlexboxPlaygroundStore((s) => s.flexDirection);
  const flexWrap = useFlexboxPlaygroundStore((s) => s.flexWrap);
  const justifyContent = useFlexboxPlaygroundStore((s) => s.justifyContent);
  const alignItems = useFlexboxPlaygroundStore((s) => s.alignItems);
  const alignContent = useFlexboxPlaygroundStore((s) => s.alignContent);
  const gap = useFlexboxPlaygroundStore((s) => s.gap);
  const itemWidth = useFlexboxPlaygroundStore((s) => s.itemWidth);
  const itemHeight = useFlexboxPlaygroundStore((s) => s.itemHeight);
  const itemGrow = useFlexboxPlaygroundStore((s) => s.itemGrow);
  const itemShrink = useFlexboxPlaygroundStore((s) => s.itemShrink);
  const itemBasis = useFlexboxPlaygroundStore((s) => s.itemBasis);
  const alignSelf = useFlexboxPlaygroundStore((s) => s.alignSelf);

  const cssText = useMemo(
    () =>
      buildFlexboxCss({
        flexDirection,
        flexWrap,
        justifyContent,
        alignItems,
        alignContent,
        gap,
        itemWidth,
        itemHeight,
        itemGrow,
        itemShrink,
        itemBasis,
        alignSelf,
      }),
    [
      flexDirection,
      flexWrap,
      justifyContent,
      alignItems,
      alignContent,
      gap,
      itemWidth,
      itemHeight,
      itemGrow,
      itemShrink,
      itemBasis,
      alignSelf,
    ]
  );

  return (
    <section className="space-y-2">
      <SectionHeading className="mb-3">Generated CSS</SectionHeading>
      <pre className="max-h-48 overflow-auto border border-border bg-muted/40 p-3 font-mono text-[10px] leading-relaxed whitespace-pre-wrap">
        {cssText}
      </pre>
    </section>
  );
}
