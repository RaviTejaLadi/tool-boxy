import { uid } from './canvasUtils';
import type { CanvasElement } from '../types';

export function initialElements(): CanvasElement[] {
  return [
    {
      id: uid(),
      type: 'shape',
      shapeType: 'circle',
      x: 660,
      y: 640,
      width: 560,
      height: 560,
      fill: '#FFFFFF',
      opacity: 0.08,
      rotation: 0,
    },
    {
      id: uid(),
      type: 'text',
      x: 80,
      y: 760,
      width: 920,
      height: 180,
      text: 'Big ideas,\nsmall effort.',
      fontSize: 72,
      fontWeight: 800,
      fontFamily: 'Georgia, serif',
      color: '#FFFFFF',
      align: 'left',
      opacity: 1,
      rotation: 0,
    },
    {
      id: uid(),
      type: 'text',
      x: 80,
      y: 940,
      width: 760,
      height: 80,
      text: 'Design your next post in minutes.',
      fontSize: 28,
      fontWeight: 400,
      fontFamily: 'system-ui, sans-serif',
      color: '#E5E7EB',
      align: 'left',
      opacity: 1,
      rotation: 0,
    },
  ];
}
