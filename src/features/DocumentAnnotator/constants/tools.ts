import {
  MousePointer2,
  Hand,
  Square,
  Circle,
  Minus,
  MoveUpRight,
  Pencil,
  Type,
  Highlighter,
  Eraser,
  Hash,
  EyeOff,
  type LucideIcon,
} from 'lucide-react';
import type { Tool } from '../types';

export interface ToolDef {
  value: Tool;
  label: string;
  shortcut: string;
  icon: LucideIcon;
}

/** Navigation / freehand / text tools */
export const TOOLS: ToolDef[] = [
  { value: 'select', label: 'Select', shortcut: 'V', icon: MousePointer2 },
  { value: 'pan', label: 'Pan', shortcut: 'H', icon: Hand },
  { value: 'pen', label: 'Pen', shortcut: 'P', icon: Pencil },
  { value: 'text', label: 'Text', shortcut: 'T', icon: Type },
  { value: 'eraser', label: 'Eraser', shortcut: 'E', icon: Eraser },
];

/** Geometric / markup shapes */
export const SHAPES: ToolDef[] = [
  { value: 'rect', label: 'Rectangle', shortcut: 'R', icon: Square },
  { value: 'ellipse', label: 'Ellipse', shortcut: 'O', icon: Circle },
  { value: 'line', label: 'Line', shortcut: 'L', icon: Minus },
  { value: 'arrow', label: 'Arrow', shortcut: 'A', icon: MoveUpRight },
  { value: 'highlight', label: 'Highlight', shortcut: 'G', icon: Highlighter },
  { value: 'callout', label: 'Callout', shortcut: 'N', icon: Hash },
  { value: 'redact', label: 'Redact', shortcut: 'X', icon: EyeOff },
];

export const ALL_TOOLS: ToolDef[] = [...TOOLS, ...SHAPES];

export const TOOL_SHORTCUTS: Record<string, Tool> = {
  v: 'select',
  h: 'pan',
  r: 'rect',
  o: 'ellipse',
  l: 'line',
  a: 'arrow',
  p: 'pen',
  t: 'text',
  g: 'highlight',
  e: 'eraser',
  n: 'callout',
  x: 'redact',
};
