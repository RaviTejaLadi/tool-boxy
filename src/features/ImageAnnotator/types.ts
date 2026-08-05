export type Tool =
  | 'select'
  | 'pan'
  | 'rect'
  | 'ellipse'
  | 'line'
  | 'arrow'
  | 'pen'
  | 'text'
  | 'highlight'
  | 'callout'
  | 'redact'
  | 'eraser';

export type ShapeType = 'rect' | 'ellipse' | 'highlight' | 'redact';
export type PathType = 'line' | 'arrow' | 'pen';
export type ExportFormat = 'png' | 'jpeg' | 'webp';

export interface Point {
  x: number;
  y: number;
}

export interface BaseAnnotation {
  id: string;
  color: string;
  strokeWidth: number;
  opacity: number;
  dashed: boolean;
}

export interface ShapeAnnotation extends BaseAnnotation {
  type: ShapeType;
  x: number;
  y: number;
  w: number;
  h: number;
  filled: boolean;
}

export interface PathAnnotation extends BaseAnnotation {
  type: PathType;
  points: Point[];
}

export interface TextAnnotation extends BaseAnnotation {
  type: 'text';
  x: number;
  y: number;
  text: string;
  fontSize: number;
}

export interface CalloutAnnotation extends BaseAnnotation {
  type: 'callout';
  x: number;
  y: number;
  number: number;
  fontSize: number;
}

export type Annotation = ShapeAnnotation | PathAnnotation | TextAnnotation | CalloutAnnotation;

export interface DragState {
  mode: 'move' | 'resize' | 'endpoint';
  handle?: string;
  originId: string;
  startImg: Point;
  original: Annotation;
}

export interface Bounds {
  x: number;
  y: number;
  w: number;
  h: number;
}

export interface ImageMeta {
  name: string;
  mimeType: string;
  format: ExportFormat;
}
