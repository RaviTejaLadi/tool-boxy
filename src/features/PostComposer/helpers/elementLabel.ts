import type { CanvasElement } from '../types';

export function elementLabel(el: CanvasElement): string {
  if (el.type === 'text') {
    const line = el.text.split('\n')[0]?.trim();
    return line ? line.slice(0, 28) : 'Text';
  }
  if (el.type === 'image') return 'Image';
  const name = el.shapeType.charAt(0).toUpperCase() + el.shapeType.slice(1);
  return name;
}

export function elementTypeLabel(el: CanvasElement): string {
  if (el.type === 'text') return 'Text';
  if (el.type === 'image') return 'Image';
  return 'Shape';
}
