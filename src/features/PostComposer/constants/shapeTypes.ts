import type { ShapeType } from '../types';

export type ShapeDef = { id: ShapeType; label: string };

export const SHAPE_CATEGORIES: { id: string; label: string; shapes: ShapeDef[] }[] = [
  {
    id: 'basic',
    label: 'Basic',
    shapes: [
      { id: 'rect', label: 'Rectangle' },
      { id: 'circle', label: 'Circle' },
      { id: 'triangle', label: 'Triangle' },
      { id: 'line', label: 'Line' },
      { id: 'pill', label: 'Pill' },
      { id: 'diamond', label: 'Diamond' },
    ],
  },
  {
    id: 'polygons',
    label: 'Polygons',
    shapes: [
      { id: 'pentagon', label: 'Pentagon' },
      { id: 'hexagon', label: 'Hexagon' },
      { id: 'heptagon', label: 'Heptagon' },
      { id: 'octagon', label: 'Octagon' },
      { id: 'decagon', label: 'Decagon' },
      { id: 'parallelogram', label: 'Parallelogram' },
      { id: 'trapezoid', label: 'Trapezoid' },
    ],
  },
  {
    id: 'stars',
    label: 'Stars & Bursts',
    shapes: [
      { id: 'star', label: 'Star 5' },
      { id: 'star-4', label: 'Star 4' },
      { id: 'star-6', label: 'Star 6' },
      { id: 'burst', label: 'Burst' },
      { id: 'sun', label: 'Sun' },
      { id: 'flower', label: 'Flower' },
    ],
  },
  {
    id: 'curves',
    label: 'Curves & Arcs',
    shapes: [
      { id: 'semicircle', label: 'Semicircle' },
      { id: 'quarter-circle', label: 'Quarter' },
      { id: 'ring', label: 'Ring' },
      { id: 'teardrop', label: 'Teardrop' },
      { id: 'crescent', label: 'Crescent' },
      { id: 'moon', label: 'Moon' },
      { id: 'heart', label: 'Heart' },
      { id: 'leaf', label: 'Leaf' },
    ],
  },
  {
    id: 'symbols',
    label: 'Symbols',
    shapes: [
      { id: 'cross', label: 'Cross' },
      { id: 'cloud', label: 'Cloud' },
      { id: 'speech-bubble', label: 'Speech' },
      { id: 'shield', label: 'Shield' },
      { id: 'badge', label: 'Badge' },
      { id: 'bolt', label: 'Lightning' },
      { id: 'gear', label: 'Gear' },
    ],
  },
  {
    id: 'arrows',
    label: 'Arrows',
    shapes: [
      { id: 'arrow', label: 'Right' },
      { id: 'arrow-left', label: 'Left' },
      { id: 'arrow-up', label: 'Up' },
      { id: 'arrow-down', label: 'Down' },
      { id: 'arrow-double', label: 'Double' },
      { id: 'chevron-right', label: 'Chevron R' },
      { id: 'chevron-left', label: 'Chevron L' },
      { id: 'chevron-up', label: 'Chevron U' },
      { id: 'chevron-down', label: 'Chevron D' },
      { id: 'chevron-double', label: 'Chevrons' },
    ],
  },
  {
    id: 'labels',
    label: 'Labels & UI',
    shapes: [
      { id: 'ribbon', label: 'Ribbon' },
      { id: 'banner', label: 'Banner' },
      { id: 'ticket', label: 'Ticket' },
      { id: 'tag', label: 'Tag' },
      { id: 'bookmark', label: 'Bookmark' },
      { id: 'flag', label: 'Flag' },
      { id: 'pin', label: 'Pin' },
    ],
  },
  {
    id: 'frames',
    label: 'Frames & Layout',
    shapes: [
      { id: 'frame', label: 'Frame' },
      { id: 'bracket-left', label: 'Bracket L' },
      { id: 'bracket-right', label: 'Bracket R' },
      { id: 'corner', label: 'Corner' },
      { id: 'wave', label: 'Wave' },
      { id: 'funnel', label: 'Funnel' },
      { id: 'hourglass', label: 'Hourglass' },
    ],
  },
];

export const DEFAULT_SHAPE_FILL = '#14E8B4';

export const ALL_SHAPE_IDS = SHAPE_CATEGORIES.flatMap((c) => c.shapes.map((s) => s.id));
