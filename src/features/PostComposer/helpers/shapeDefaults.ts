import type { ShapeType } from '../types';

export function getShapeDefaultSize(shapeType: ShapeType): {
  width: number;
  height: number;
  radius?: number;
} {
  switch (shapeType) {
    case 'line':
      return { width: 420, height: 8 };
    case 'arrow':
    case 'arrow-left':
    case 'arrow-up':
    case 'arrow-down':
    case 'arrow-double':
      return { width: 180, height: 90 };
    case 'chevron-right':
    case 'chevron-left':
    case 'chevron-up':
    case 'chevron-down':
    case 'chevron-double':
      return { width: 120, height: 120 };
    case 'bracket-left':
    case 'bracket-right':
    case 'corner':
      return { width: 140, height: 180 };
    case 'frame':
      return { width: 320, height: 320, radius: 12 };
    case 'ribbon':
    case 'banner':
      return { width: 420, height: 120 };
    case 'flag':
    case 'tag':
    case 'bookmark':
      return { width: 160, height: 220 };
    case 'pin':
      return { width: 120, height: 160 };
    case 'speech-bubble':
      return { width: 320, height: 200 };
    default:
      return { width: 280, height: 280, radius: shapeType === 'rect' ? 16 : 0 };
  }
}
