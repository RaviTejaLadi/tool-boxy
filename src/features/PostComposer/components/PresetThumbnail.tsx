// @ts-nocheck — typed gradually
import { useComposerStore } from '../stores';
import { getShapeRenderStyle } from '../helpers/shapePaths';
import type { DesignPreset } from '../types';

export function PresetThumbnail({ preset }: { preset: DesignPreset }) {
  const format = useComposerStore((s) => s.format);
  const w = format.w;
  const h = format.h;
  const thumbSize = 140;
  const scale = thumbSize / Math.max(w, h);
  const stageW = w * scale;
  const stageH = h * scale;
  const elements = preset.buildElements(w, h);

  return (
    <div
      className="relative flex aspect-square w-full items-center justify-center overflow-hidden bg-muted/30"
      style={{
        backgroundColor: preset.background.type === 'color' ? preset.background.value : undefined,
        backgroundImage: preset.background.type === 'gradient' ? preset.preview : undefined,
      }}
    >
      <div
        className="relative shrink-0 overflow-hidden shadow-sm ring-1 ring-black/10"
        style={{ width: stageW, height: stageH }}
      >
        {elements.map((el, i) => {
          if (el.type === 'shape') {
            const shapeStyle = getShapeRenderStyle(el.shapeType, el.fill, el.radius || 0, scale);
            return (
              <div
                key={i}
                style={{
                  position: 'absolute',
                  left: el.x * scale,
                  top: el.y * scale,
                  width: el.width * scale,
                  height: el.height * scale,
                  transform: `rotate(${el.rotation || 0}deg)`,
                  opacity: el.opacity ?? 1,
                  ...shapeStyle,
                }}
              />
            );
          }
          if (el.type === 'text') {
            return (
              <div
                key={i}
                style={{
                  position: 'absolute',
                  left: el.x * scale,
                  top: el.y * scale,
                  width: el.width * scale,
                  height: el.height * scale,
                  transform: `rotate(${el.rotation || 0}deg)`,
                  opacity: el.opacity ?? 1,
                  fontSize: Math.max(4, el.fontSize * scale),
                  fontWeight: el.fontWeight,
                  fontFamily: el.fontFamily,
                  color: el.color,
                  textAlign: el.align,
                  whiteSpace: 'pre-wrap',
                  lineHeight: el.lineHeight || 1.2,
                  letterSpacing: el.letterSpacing ? `${el.letterSpacing * scale}px` : undefined,
                  overflow: 'hidden',
                }}
              >
                {el.text}
              </div>
            );
          }
          return null;
        })}
      </div>
    </div>
  );
}
