import { useEffect, useRef, useState } from 'react';
import { cn } from '@/lib/utils';
import { getPatternCanvasSize, PREVIEW_CONTAINER_CLASS, PREVIEW_ITEM_CLASS } from '../constants/previewStyles';
import type { FlexPattern } from '../constants/patterns';
import { getFlexItemStyle } from '../helpers';

interface PatternPreviewProps {
  pattern: FlexPattern;
  className?: string;
}

export function PatternPreview({ pattern, className }: PatternPreviewProps) {
  const { container, items } = pattern;
  const { width, height } = getPatternCanvasSize(pattern);

  return (
    <div
      className={cn(PREVIEW_CONTAINER_CLASS, className)}
      style={{
        display: 'flex',
        width,
        height,
        minHeight: height,
        flexDirection: container.flexDirection as React.CSSProperties['flexDirection'],
        flexWrap: container.flexWrap as React.CSSProperties['flexWrap'],
        justifyContent: container.justifyContent as React.CSSProperties['justifyContent'],
        alignItems: container.alignItems as React.CSSProperties['alignItems'],
        alignContent: container.alignContent as React.CSSProperties['alignContent'],
        gap: `${container.gap}px`,
        padding: container.padding !== undefined ? `${container.padding}px` : undefined,
      }}
    >
      {items.map((item, index) => (
        <div
          key={`${item.label}-${index}`}
          className={cn(PREVIEW_ITEM_CLASS, 'text-[11px] leading-tight')}
          style={getFlexItemStyle(item)}
        >
          <span className="truncate px-0.5">{item.label}</span>
        </div>
      ))}
    </div>
  );
}

interface PreviewThumbnailProps {
  pattern: FlexPattern;
}

export function PreviewThumbnail({ pattern }: PreviewThumbnailProps) {
  const frameRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(0.5);
  const { width, height } = getPatternCanvasSize(pattern);

  useEffect(() => {
    const frame = frameRef.current;
    if (!frame) return;

    const updateScale = () => {
      const pad = 12;
      const availW = frame.clientWidth - pad * 2;
      const availH = frame.clientHeight - pad * 2;
      if (availW <= 0 || availH <= 0) return;
      setScale(Math.min(availW / width, availH / height));
    };

    updateScale();
    const observer = new ResizeObserver(updateScale);
    observer.observe(frame);
    return () => observer.disconnect();
  }, [width, height]);

  return (
    <div ref={frameRef} className="relative flex h-36 w-full items-center justify-center overflow-hidden bg-muted/40">
      <div className="pointer-events-none shrink-0 origin-center" style={{ transform: `scale(${scale})` }}>
        <PatternPreview pattern={pattern} />
      </div>
    </div>
  );
}

export function PreviewStage({ pattern, className }: { pattern: FlexPattern; className?: string }) {
  const { height } = getPatternCanvasSize(pattern);

  return (
    <div
      className={cn('flex items-center justify-center overflow-auto bg-muted/40 p-6', className)}
      style={{ minHeight: height + 48 }}
    >
      <PatternPreview pattern={pattern} className="max-w-full shadow-sm" />
    </div>
  );
}
