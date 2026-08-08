import type { LucideIcon } from 'lucide-react';
import {
  ALargeSmall,
  ArrowUpDown,
  ArrowUpFromLine,
  Baseline,
  Blocks,
  BookOpen,
  CircleDot,
  Flame,
  FlipHorizontal2,
  MoveHorizontal,
  MoveVertical,
  PencilLine,
  RotateCcw,
  Sparkles,
  Spline,
  Stamp,
  Type,
  Waves,
  Wind,
  Zap,
} from 'lucide-react';

export type TextAnimationCategory = 'basic' | 'writing' | 'exaggerate';

export type TextSegmentMode = 'line' | 'word' | 'character';

export type TextMotionPhase = 'enter' | 'exit' | 'both';

export type TextAnimationType =
  | 'rise'
  | 'pan'
  | 'fade'
  | 'breathe'
  | 'tectonic'
  | 'drift'
  | 'typewriter'
  | 'ascend'
  | 'shift'
  | 'block'
  | 'burst'
  | 'bounce'
  | 'roll'
  | 'skate'
  | 'tumble'
  | 'neon'
  | 'scrapbook'
  | 'pop'
  | 'stomp'
  | 'baseline';

export interface TextAnimationControls {
  /** Enter / Exit / Both */
  phase: boolean;
  /** Motion direction (left/right/up/down) */
  direction: boolean;
  /** Animate by line / word / character */
  segment: boolean;
  /** Continuous looping motion (Breathe, Drift, Neon) */
  continuous: boolean;
}

export interface TextAnimationDefinition {
  label: string;
  description: string;
  category: TextAnimationCategory;
  icon: LucideIcon;
  /** Prefer per-character / word stagger when true */
  prefersSegment: TextSegmentMode;
  supportsDirection: boolean;
  controls: TextAnimationControls;
  defaultDuration: number;
  defaultTiming: string;
  defaultIteration: string;
  defaultDirection: string;
  defaultFill: string;
  defaultStagger: number;
  keyframesEnter: string;
  keyframesExit: string;
}

export const TEXT_ANIMATION_CATEGORIES: { id: TextAnimationCategory; label: string }[] = [
  { id: 'basic', label: 'Basic' },
  { id: 'writing', label: 'Writing' },
  { id: 'exaggerate', label: 'Exaggerate' },
];

export const TEXT_ANIMATIONS: Record<TextAnimationType, TextAnimationDefinition> = {
  rise: {
    label: 'Rise',
    description: 'Float upward with a soft fade',
    category: 'basic',
    icon: ArrowUpFromLine,
    prefersSegment: 'line',
    supportsDirection: false,
    controls: {
      phase: true,
      direction: false,
      segment: true,
      continuous: false,
    },
    defaultDuration: 0.7,
    defaultTiming: 'ease-out',
    defaultIteration: '1',
    defaultDirection: 'normal',
    defaultFill: 'both',
    defaultStagger: 0.06,
    keyframesEnter: `  0% {
    opacity: 0;
    transform: translateY(28px);
  }
  100% {
    opacity: 1;
    transform: translateY(0);
  }`,
    keyframesExit: `  0% {
    opacity: 1;
    transform: translateY(0);
  }
  100% {
    opacity: 0;
    transform: translateY(-28px);
  }`,
  },
  pan: {
    label: 'Pan',
    description: 'Slide in from the side',
    category: 'basic',
    icon: MoveHorizontal,
    prefersSegment: 'line',
    supportsDirection: true,
    controls: {
      phase: true,
      direction: true,
      segment: true,
      continuous: false,
    },
    defaultDuration: 0.65,
    defaultTiming: 'ease-out',
    defaultIteration: '1',
    defaultDirection: 'normal',
    defaultFill: 'both',
    defaultStagger: 0.05,
    keyframesEnter: `  0% {
    opacity: 0;
    transform: translate(var(--pan-from-x, 48px), var(--pan-from-y, 0px));
  }
  100% {
    opacity: 1;
    transform: translate(0, 0);
  }`,
    keyframesExit: `  0% {
    opacity: 1;
    transform: translate(0, 0);
  }
  100% {
    opacity: 0;
    transform: translate(var(--pan-to-x, -48px), var(--pan-to-y, 0px));
  }`,
  },
  fade: {
    label: 'Fade',
    description: 'Clean opacity dissolve',
    category: 'basic',
    icon: Sparkles,
    prefersSegment: 'line',
    supportsDirection: false,
    controls: {
      phase: true,
      direction: false,
      segment: true,
      continuous: false,
    },
    defaultDuration: 0.55,
    defaultTiming: 'ease-in-out',
    defaultIteration: '1',
    defaultDirection: 'normal',
    defaultFill: 'both',
    defaultStagger: 0.04,
    keyframesEnter: `  0% {
    opacity: 0;
  }
  100% {
    opacity: 1;
  }`,
    keyframesExit: `  0% {
    opacity: 1;
  }
  100% {
    opacity: 0;
  }`,
  },
  breathe: {
    label: 'Breathe',
    description: 'Gentle living scale pulse',
    category: 'basic',
    icon: Waves,
    prefersSegment: 'line',
    supportsDirection: false,
    controls: {
      phase: false,
      direction: false,
      segment: false,
      continuous: true,
    },
    defaultDuration: 1.8,
    defaultTiming: 'ease-in-out',
    defaultIteration: 'infinite',
    defaultDirection: 'normal',
    defaultFill: 'none',
    defaultStagger: 0,
    keyframesEnter: `  0%, 100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.045);
  }`,
    keyframesExit: `  0%, 100% {
    transform: scale(1);
  }
  50% {
    transform: scale(0.96);
  }`,
  },
  tectonic: {
    label: 'Tectonic',
    description: 'Subtle earth-shift wobble',
    category: 'basic',
    icon: Spline,
    prefersSegment: 'line',
    supportsDirection: false,
    controls: {
      phase: true,
      direction: false,
      segment: true,
      continuous: false,
    },
    defaultDuration: 0.85,
    defaultTiming: 'ease-in-out',
    defaultIteration: '1',
    defaultDirection: 'normal',
    defaultFill: 'both',
    defaultStagger: 0.03,
    keyframesEnter: `  0% {
    opacity: 0;
    transform: translate(-10px, 8px) rotate(-1.5deg);
  }
  40% {
    opacity: 1;
    transform: translate(6px, -4px) rotate(1deg);
  }
  70% {
    transform: translate(-3px, 2px) rotate(-0.5deg);
  }
  100% {
    opacity: 1;
    transform: translate(0, 0) rotate(0deg);
  }`,
    keyframesExit: `  0% {
    opacity: 1;
    transform: translate(0, 0) rotate(0deg);
  }
  100% {
    opacity: 0;
    transform: translate(12px, -10px) rotate(2deg);
  }`,
  },
  drift: {
    label: 'Drift',
    description: 'Soft floating hover',
    category: 'basic',
    icon: Wind,
    prefersSegment: 'line',
    supportsDirection: true,
    controls: {
      phase: false,
      direction: true,
      segment: false,
      continuous: true,
    },
    defaultDuration: 2.4,
    defaultTiming: 'ease-in-out',
    defaultIteration: 'infinite',
    defaultDirection: 'alternate',
    defaultFill: 'none',
    defaultStagger: 0,
    keyframesEnter: `  0% {
    transform: translate(0, 0);
  }
  100% {
    transform: translate(var(--drift-x, 10px), var(--drift-y, -8px));
  }`,
    keyframesExit: `  0% {
    transform: translate(0, 0);
  }
  100% {
    transform: translate(var(--drift-x, -10px), var(--drift-y, 8px));
  }`,
  },
  typewriter: {
    label: 'Typewriter',
    description: 'Reveal character by character',
    category: 'writing',
    icon: PencilLine,
    prefersSegment: 'character',
    supportsDirection: false,
    controls: {
      phase: true,
      direction: false,
      segment: true,
      continuous: false,
    },
    defaultDuration: 0.05,
    defaultTiming: 'steps(1, end)',
    defaultIteration: '1',
    defaultDirection: 'normal',
    defaultFill: 'both',
    defaultStagger: 0.05,
    keyframesEnter: `  0% {
    opacity: 0;
  }
  100% {
    opacity: 1;
  }`,
    keyframesExit: `  0% {
    opacity: 1;
  }
  100% {
    opacity: 0;
  }`,
  },
  ascend: {
    label: 'Ascend',
    description: 'Letters climb into place',
    category: 'writing',
    icon: MoveVertical,
    prefersSegment: 'character',
    supportsDirection: false,
    controls: {
      phase: true,
      direction: false,
      segment: true,
      continuous: false,
    },
    defaultDuration: 0.45,
    defaultTiming: 'cubic-bezier(.22,1,.36,1)',
    defaultIteration: '1',
    defaultDirection: 'normal',
    defaultFill: 'both',
    defaultStagger: 0.04,
    keyframesEnter: `  0% {
    opacity: 0;
    transform: translateY(1.1em);
  }
  100% {
    opacity: 1;
    transform: translateY(0);
  }`,
    keyframesExit: `  0% {
    opacity: 1;
    transform: translateY(0);
  }
  100% {
    opacity: 0;
    transform: translateY(-1.1em);
  }`,
  },
  shift: {
    label: 'Shift',
    description: 'Words slide sideways in sequence',
    category: 'writing',
    icon: FlipHorizontal2,
    prefersSegment: 'word',
    supportsDirection: true,
    controls: {
      phase: true,
      direction: true,
      segment: true,
      continuous: false,
    },
    defaultDuration: 0.5,
    defaultTiming: 'ease-out',
    defaultIteration: '1',
    defaultDirection: 'normal',
    defaultFill: 'both',
    defaultStagger: 0.08,
    keyframesEnter: `  0% {
    opacity: 0;
    transform: translate(var(--pan-from-x, 36px), var(--pan-from-y, 0px));
  }
  100% {
    opacity: 1;
    transform: translate(0, 0);
  }`,
    keyframesExit: `  0% {
    opacity: 1;
    transform: translate(0, 0);
  }
  100% {
    opacity: 0;
    transform: translate(var(--pan-to-x, -36px), var(--pan-to-y, 0px));
  }`,
  },
  block: {
    label: 'Block',
    description: 'Chunky block wipe reveal',
    category: 'writing',
    icon: Blocks,
    prefersSegment: 'word',
    supportsDirection: true,
    controls: {
      phase: true,
      direction: true,
      segment: true,
      continuous: false,
    },
    defaultDuration: 0.55,
    defaultTiming: 'cubic-bezier(.2,.8,.2,1)',
    defaultIteration: '1',
    defaultDirection: 'normal',
    defaultFill: 'both',
    defaultStagger: 0.1,
    keyframesEnter: `  0% {
    opacity: 0;
    clip-path: inset(0 100% 0 0);
    transform: translateX(-12px);
  }
  100% {
    opacity: 1;
    clip-path: inset(0 0 0 0);
    transform: translateX(0);
  }`,
    keyframesExit: `  0% {
    opacity: 1;
    clip-path: inset(0 0 0 0);
    transform: translateX(0);
  }
  100% {
    opacity: 0;
    clip-path: inset(0 0 0 100%);
    transform: translateX(12px);
  }`,
  },
  burst: {
    label: 'Burst',
    description: 'Explode outward then settle',
    category: 'writing',
    icon: Zap,
    prefersSegment: 'character',
    supportsDirection: false,
    controls: {
      phase: true,
      direction: false,
      segment: true,
      continuous: false,
    },
    defaultDuration: 0.7,
    defaultTiming: 'cubic-bezier(.34,1.4,.64,1)',
    defaultIteration: '1',
    defaultDirection: 'normal',
    defaultFill: 'both',
    defaultStagger: 0.03,
    keyframesEnter: `  0% {
    opacity: 0;
    transform: translate(var(--burst-x, 0px), var(--burst-y, 0px)) scale(0.3);
  }
  70% {
    opacity: 1;
    transform: translate(calc(var(--burst-x, 0px) * 0.2), calc(var(--burst-y, 0px) * 0.2)) scale(1.08);
  }
  100% {
    opacity: 1;
    transform: translate(0, 0) scale(1);
  }`,
    keyframesExit: `  0% {
    opacity: 1;
    transform: translate(0, 0) scale(1);
  }
  100% {
    opacity: 0;
    transform: translate(var(--burst-x, 0px), var(--burst-y, 0px)) scale(0.2);
  }`,
  },
  bounce: {
    label: 'Bounce',
    description: 'Playful spring landing',
    category: 'writing',
    icon: ArrowUpDown,
    prefersSegment: 'word',
    supportsDirection: false,
    controls: {
      phase: true,
      direction: false,
      segment: true,
      continuous: false,
    },
    defaultDuration: 0.75,
    defaultTiming: 'cubic-bezier(.34,1.56,.64,1)',
    defaultIteration: '1',
    defaultDirection: 'normal',
    defaultFill: 'both',
    defaultStagger: 0.07,
    keyframesEnter: `  0% {
    opacity: 0;
    transform: translateY(-40px) scale(0.9);
  }
  60% {
    opacity: 1;
    transform: translateY(6px) scale(1.04);
  }
  100% {
    opacity: 1;
    transform: translateY(0) scale(1);
  }`,
    keyframesExit: `  0% {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
  100% {
    opacity: 0;
    transform: translateY(28px) scale(0.9);
  }`,
  },
  roll: {
    label: 'Roll',
    description: 'Rotate into view',
    category: 'writing',
    icon: RotateCcw,
    prefersSegment: 'character',
    supportsDirection: true,
    controls: {
      phase: true,
      direction: true,
      segment: true,
      continuous: false,
    },
    defaultDuration: 0.6,
    defaultTiming: 'ease-out',
    defaultIteration: '1',
    defaultDirection: 'normal',
    defaultFill: 'both',
    defaultStagger: 0.045,
    keyframesEnter: `  0% {
    opacity: 0;
    transform: rotate(var(--roll-from, -120deg)) translateY(12px);
  }
  100% {
    opacity: 1;
    transform: rotate(0deg) translateY(0);
  }`,
    keyframesExit: `  0% {
    opacity: 1;
    transform: rotate(0deg) translateY(0);
  }
  100% {
    opacity: 0;
    transform: rotate(var(--roll-to, 120deg)) translateY(-12px);
  }`,
  },
  skate: {
    label: 'Skate',
    description: 'Skim in with a slight skew',
    category: 'writing',
    icon: ALargeSmall,
    prefersSegment: 'word',
    supportsDirection: true,
    controls: {
      phase: true,
      direction: true,
      segment: true,
      continuous: false,
    },
    defaultDuration: 0.55,
    defaultTiming: 'cubic-bezier(.2,.9,.3,1)',
    defaultIteration: '1',
    defaultDirection: 'normal',
    defaultFill: 'both',
    defaultStagger: 0.08,
    keyframesEnter: `  0% {
    opacity: 0;
    transform: translate(var(--pan-from-x, 56px), var(--pan-from-y, 0px)) skewX(var(--skate-skew, -12deg));
  }
  70% {
    opacity: 1;
    transform: translate(calc(var(--pan-from-x, 56px) * -0.05), calc(var(--pan-from-y, 0px) * -0.05)) skewX(calc(var(--skate-skew, -12deg) * -0.2));
  }
  100% {
    opacity: 1;
    transform: translate(0, 0) skewX(0deg);
  }`,
    keyframesExit: `  0% {
    opacity: 1;
    transform: translate(0, 0) skewX(0deg);
  }
  100% {
    opacity: 0;
    transform: translate(var(--pan-to-x, -56px), var(--pan-to-y, 0px)) skewX(var(--skate-skew, 12deg));
  }`,
  },
  tumble: {
    label: 'Tumble',
    description: 'Flip and tumble into place',
    category: 'exaggerate',
    icon: CircleDot,
    prefersSegment: 'character',
    supportsDirection: false,
    controls: {
      phase: true,
      direction: false,
      segment: true,
      continuous: false,
    },
    defaultDuration: 0.85,
    defaultTiming: 'cubic-bezier(.2,.8,.2,1)',
    defaultIteration: '1',
    defaultDirection: 'normal',
    defaultFill: 'both',
    defaultStagger: 0.05,
    keyframesEnter: `  0% {
    opacity: 0;
    transform: rotateX(90deg) translateY(20px) scale(0.8);
  }
  100% {
    opacity: 1;
    transform: rotateX(0deg) translateY(0) scale(1);
  }`,
    keyframesExit: `  0% {
    opacity: 1;
    transform: rotateX(0deg) translateY(0) scale(1);
  }
  100% {
    opacity: 0;
    transform: rotateX(-90deg) translateY(-16px) scale(0.85);
  }`,
  },
  neon: {
    label: 'Neon',
    description: 'Electric glow flicker',
    category: 'exaggerate',
    icon: Flame,
    prefersSegment: 'line',
    supportsDirection: false,
    controls: {
      phase: false,
      direction: false,
      segment: false,
      continuous: true,
    },
    defaultDuration: 1.4,
    defaultTiming: 'ease-in-out',
    defaultIteration: 'infinite',
    defaultDirection: 'normal',
    defaultFill: 'none',
    defaultStagger: 0,
    keyframesEnter: `  0%, 19%, 21%, 23%, 25%, 54%, 56%, 100% {
    opacity: 1;
    text-shadow:
      0 0 4px currentColor,
      0 0 12px currentColor,
      0 0 28px color-mix(in oklab, currentColor 70%, transparent);
  }
  20%, 24%, 55% {
    opacity: 0.45;
    text-shadow: none;
  }`,
    keyframesExit: `  0% {
    opacity: 1;
    text-shadow:
      0 0 4px currentColor,
      0 0 12px currentColor;
  }
  100% {
    opacity: 0;
    text-shadow: none;
  }`,
  },
  scrapbook: {
    label: 'Scrapbook',
    description: 'Collage-style rotate drop',
    category: 'exaggerate',
    icon: BookOpen,
    prefersSegment: 'word',
    supportsDirection: false,
    controls: {
      phase: true,
      direction: false,
      segment: true,
      continuous: false,
    },
    defaultDuration: 0.7,
    defaultTiming: 'cubic-bezier(.34,1.4,.64,1)',
    defaultIteration: '1',
    defaultDirection: 'normal',
    defaultFill: 'both',
    defaultStagger: 0.09,
    keyframesEnter: `  0% {
    opacity: 0;
    transform: translateY(-24px) rotate(var(--scrap-rot, -8deg)) scale(1.15);
  }
  100% {
    opacity: 1;
    transform: translateY(0) rotate(0deg) scale(1);
  }`,
    keyframesExit: `  0% {
    opacity: 1;
    transform: translateY(0) rotate(0deg) scale(1);
  }
  100% {
    opacity: 0;
    transform: translateY(18px) rotate(var(--scrap-rot, 8deg)) scale(0.9);
  }`,
  },
  pop: {
    label: 'Pop',
    description: 'Punchy overshoot scale',
    category: 'exaggerate',
    icon: Stamp,
    prefersSegment: 'word',
    supportsDirection: false,
    controls: {
      phase: true,
      direction: false,
      segment: true,
      continuous: false,
    },
    defaultDuration: 0.5,
    defaultTiming: 'cubic-bezier(.34,1.56,.64,1)',
    defaultIteration: '1',
    defaultDirection: 'normal',
    defaultFill: 'both',
    defaultStagger: 0.07,
    keyframesEnter: `  0% {
    opacity: 0;
    transform: scale(0.2);
  }
  100% {
    opacity: 1;
    transform: scale(1);
  }`,
    keyframesExit: `  0% {
    opacity: 1;
    transform: scale(1);
  }
  100% {
    opacity: 0;
    transform: scale(0.2);
  }`,
  },
  stomp: {
    label: 'Stomp',
    description: 'Hard slam from above',
    category: 'exaggerate',
    icon: Baseline,
    prefersSegment: 'word',
    supportsDirection: false,
    controls: {
      phase: true,
      direction: false,
      segment: true,
      continuous: false,
    },
    defaultDuration: 0.45,
    defaultTiming: 'cubic-bezier(.2,.9,.2,1)',
    defaultIteration: '1',
    defaultDirection: 'normal',
    defaultFill: 'both',
    defaultStagger: 0.08,
    keyframesEnter: `  0% {
    opacity: 0;
    transform: translateY(-60px) scaleY(1.4);
  }
  70% {
    opacity: 1;
    transform: translateY(4px) scaleY(0.92);
  }
  100% {
    opacity: 1;
    transform: translateY(0) scaleY(1);
  }`,
    keyframesExit: `  0% {
    opacity: 1;
    transform: translateY(0) scaleY(1);
  }
  100% {
    opacity: 0;
    transform: translateY(40px) scaleY(1.2);
  }`,
  },
  baseline: {
    label: 'Baseline',
    description: 'Rise from the text baseline',
    category: 'exaggerate',
    icon: Type,
    prefersSegment: 'character',
    supportsDirection: false,
    controls: {
      phase: true,
      direction: false,
      segment: true,
      continuous: false,
    },
    defaultDuration: 0.5,
    defaultTiming: 'ease-out',
    defaultIteration: '1',
    defaultDirection: 'normal',
    defaultFill: 'both',
    defaultStagger: 0.035,
    keyframesEnter: `  0% {
    opacity: 0;
    transform: translateY(0.55em);
    clip-path: inset(100% 0 0 0);
  }
  100% {
    opacity: 1;
    transform: translateY(0);
    clip-path: inset(0 0 0 0);
  }`,
    keyframesExit: `  0% {
    opacity: 1;
    transform: translateY(0);
    clip-path: inset(0 0 0 0);
  }
  100% {
    opacity: 0;
    transform: translateY(0.55em);
    clip-path: inset(100% 0 0 0);
  }`,
  },
};

export const TEXT_ANIMATION_ORDER: TextAnimationType[] = [
  'rise',
  'pan',
  'fade',
  'breathe',
  'tectonic',
  'drift',
  'typewriter',
  'ascend',
  'shift',
  'block',
  'burst',
  'bounce',
  'roll',
  'skate',
  'tumble',
  'neon',
  'scrapbook',
  'pop',
  'stomp',
  'baseline',
];

export const TEXT_DIRECTION_OPTIONS = [
  { value: 'left', label: 'From left' },
  { value: 'right', label: 'From right' },
  { value: 'up', label: 'From below' },
  { value: 'down', label: 'From above' },
] as const;

export type TextDirection = (typeof TEXT_DIRECTION_OPTIONS)[number]['value'];

export const TEXT_SEGMENT_OPTIONS: { value: TextSegmentMode; label: string }[] = [
  { value: 'line', label: 'Line' },
  { value: 'word', label: 'Word' },
  { value: 'character', label: 'Character' },
];

export const TEXT_PHASE_OPTIONS: { value: TextMotionPhase; label: string }[] = [
  { value: 'enter', label: 'Enter' },
  { value: 'exit', label: 'Exit' },
  { value: 'both', label: 'Both' },
];

export const TEXT_FONT_WEIGHTS = [
  { value: '400', label: 'Regular' },
  { value: '500', label: 'Medium' },
  { value: '600', label: 'Semibold' },
  { value: '700', label: 'Bold' },
  { value: '800', label: 'Extra Bold' },
] as const;
