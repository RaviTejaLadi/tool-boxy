export type Background = { type: 'color' | 'gradient'; value: string };

export type ShapeType =
  | 'rect'
  | 'circle'
  | 'triangle'
  | 'line'
  | 'pill'
  | 'diamond'
  | 'parallelogram'
  | 'trapezoid'
  | 'pentagon'
  | 'hexagon'
  | 'heptagon'
  | 'octagon'
  | 'decagon'
  | 'star'
  | 'star-4'
  | 'star-6'
  | 'burst'
  | 'flower'
  | 'heart'
  | 'semicircle'
  | 'quarter-circle'
  | 'ring'
  | 'teardrop'
  | 'crescent'
  | 'moon'
  | 'cross'
  | 'cloud'
  | 'speech-bubble'
  | 'shield'
  | 'badge'
  | 'bolt'
  | 'sun'
  | 'leaf'
  | 'gear'
  | 'arrow'
  | 'arrow-left'
  | 'arrow-up'
  | 'arrow-down'
  | 'arrow-double'
  | 'chevron-right'
  | 'chevron-left'
  | 'chevron-up'
  | 'chevron-down'
  | 'chevron-double'
  | 'ribbon'
  | 'banner'
  | 'ticket'
  | 'tag'
  | 'bookmark'
  | 'flag'
  | 'pin'
  | 'frame'
  | 'bracket-left'
  | 'bracket-right'
  | 'corner'
  | 'wave'
  | 'funnel'
  | 'hourglass';

export type BaseElement = {
  id: string;
  x: number;
  y: number;
  width: number;
  height: number;
  opacity?: number;
  rotation?: number;
};

export type ShapeElement = BaseElement & {
  type: 'shape';
  shapeType: ShapeType;
  fill: string;
  radius?: number;
  stroke?: string;
  strokeWidth?: number;
};

export type TextElement = BaseElement & {
  type: 'text';
  text: string;
  fontSize: number;
  fontWeight: number;
  fontFamily: string;
  color: string;
  align: 'left' | 'center' | 'right';
  letterSpacing?: number;
  lineHeight?: number;
};

export type ImageElement = BaseElement & {
  type: 'image';
  src: string;
  objectFit?: 'cover' | 'contain';
};

export type CanvasElement = ShapeElement | TextElement | ImageElement;

export type Slide = {
  id: string;
  name: string;
  background: Background;
  elements: CanvasElement[];
};

export type PanelId = 'design' | 'text' | 'shapes' | 'images' | 'background' | 'edit';

export type Format = import('./constants/formats').FormatDef;

export type DesignPreset = {
  id: string;
  name: string;
  category: string;
  background: Background;
  preview: string;
  buildElements: (w: number, h: number) => Omit<CanvasElement, 'id'>[];
};
