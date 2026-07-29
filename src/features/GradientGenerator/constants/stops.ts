export type GradientType = 'linear' | 'corners' | 'mesh';

export interface ColorStop {
  id: string;
  color: string;
  position?: number;
  x?: number;
  y?: number;
  label?: string;
}

export const INITIAL_LINEAR_STOPS: ColorStop[] = [
  { id: '1', color: '#3b82f6', position: 0 },
  { id: '2', color: '#d2c417', position: 83 },
];

export const INITIAL_CORNER_STOPS: ColorStop[] = [
  { id: 'tl', color: '#3b82f6', label: 'Top Left' },
  { id: 'bl', color: '#10b981', label: 'Bottom Left' },
  { id: 'tr', color: '#8b5cf6', label: 'Top Right' },
  { id: 'br', color: '#f59e0b', label: 'Bottom Right' },
];

export const INITIAL_MESH_STOPS: ColorStop[] = [
  { id: '1', color: '#3b82f6', x: 9, y: 0, label: 'Sky Dancer' },
  { id: '2', color: '#8b5cf6', x: 100, y: 0, label: 'Candy Grape Fizz' },
  { id: '3', color: '#18b981', x: 0, y: 100, label: 'Slime Girl' },
  { id: '4', color: '#f59e0b', x: 100, y: 100, label: 'Cheddar' },
];
