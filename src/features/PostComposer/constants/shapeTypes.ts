import {
  ArrowRight,
  Circle,
  Diamond,
  Heart,
  Hexagon,
  Minus,
  RectangleHorizontal,
  Square,
  Star,
  Triangle,
} from 'lucide-react';

export const SHAPE_CATEGORIES = [
  {
    id: 'basic',
    label: 'Basic',
    shapes: [
      { id: 'rect', label: 'Rectangle', icon: Square },
      { id: 'circle', label: 'Circle', icon: Circle },
      { id: 'triangle', label: 'Triangle', icon: Triangle },
      { id: 'line', label: 'Line', icon: Minus },
      { id: 'pill', label: 'Pill', icon: RectangleHorizontal },
    ],
  },
  {
    id: 'geometric',
    label: 'Geometric',
    shapes: [
      { id: 'star', label: 'Star', icon: Star },
      { id: 'diamond', label: 'Diamond', icon: Diamond },
      { id: 'hexagon', label: 'Hexagon', icon: Hexagon },
      { id: 'heart', label: 'Heart', icon: Heart },
    ],
  },
  {
    id: 'arrows',
    label: 'Arrows',
    shapes: [{ id: 'arrow', label: 'Arrow', icon: ArrowRight }],
  },
] as const;

export const DEFAULT_SHAPE_FILL = '#14E8B4';

export const ALL_SHAPE_IDS = SHAPE_CATEGORIES.flatMap((c) => c.shapes.map((s) => s.id));
