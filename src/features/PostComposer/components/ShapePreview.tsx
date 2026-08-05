// @ts-nocheck — typed gradually
import type { ShapeType } from '../types';
import { getShapeRenderStyle } from '../helpers/shapePaths';

export function ShapePreview({ shapeType }: { shapeType: ShapeType }) {
  const style = getShapeRenderStyle(shapeType, 'currentColor', shapeType === 'rect' ? 4 : 0, 0.35);

  return (
    <div className="flex size-8 items-center justify-center text-primary">
      <div
        className="size-6 shrink-0"
        style={{
          ...style,
          ...(shapeType === 'line' ? { height: 3, width: '100%' } : {}),
        }}
      />
    </div>
  );
}
