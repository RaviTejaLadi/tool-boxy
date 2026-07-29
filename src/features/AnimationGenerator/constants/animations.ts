import type { LucideIcon } from 'lucide-react';
import {
  Activity,
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  ArrowUp,
  ArrowUpDown,
  Eye,
  EyeOff,
  FlipHorizontal,
  Maximize2,
  Minimize2,
  Move,
  RotateCw,
} from 'lucide-react';

export type AnimationType =
  | 'fadeIn'
  | 'fadeOut'
  | 'slideInLeft'
  | 'slideInRight'
  | 'slideInUp'
  | 'slideInDown'
  | 'scaleIn'
  | 'scaleOut'
  | 'rotate'
  | 'bounce'
  | 'pulse'
  | 'shake'
  | 'flip';

export interface AnimationDefinition {
  label: string;
  icon: LucideIcon;
  keyframes: string;
  defaultDuration: number;
  defaultTiming: string;
  defaultIteration: string;
  defaultDirection: string;
  defaultFill: string;
}

export const ANIMATIONS: Record<AnimationType, AnimationDefinition> = {
  fadeIn: {
    label: 'Fade In',
    icon: Eye,
    keyframes: `  0% {
    opacity: 0;
  }
  100% {
    opacity: 1;
  }`,
    defaultDuration: 0.6,
    defaultTiming: 'ease-out',
    defaultIteration: '1',
    defaultDirection: 'normal',
    defaultFill: 'both',
  },
  fadeOut: {
    label: 'Fade Out',
    icon: EyeOff,
    keyframes: `  0% {
    opacity: 1;
  }
  100% {
    opacity: 0;
  }`,
    defaultDuration: 0.6,
    defaultTiming: 'ease-in',
    defaultIteration: '1',
    defaultDirection: 'normal',
    defaultFill: 'both',
  },
  slideInLeft: {
    label: 'Slide In Left',
    icon: ArrowRight,
    keyframes: `  0% {
    transform: translateX(-80px);
    opacity: 0;
  }
  100% {
    transform: translateX(0);
    opacity: 1;
  }`,
    defaultDuration: 0.5,
    defaultTiming: 'ease-out',
    defaultIteration: '1',
    defaultDirection: 'normal',
    defaultFill: 'both',
  },
  slideInRight: {
    label: 'Slide In Right',
    icon: ArrowLeft,
    keyframes: `  0% {
    transform: translateX(80px);
    opacity: 0;
  }
  100% {
    transform: translateX(0);
    opacity: 1;
  }`,
    defaultDuration: 0.5,
    defaultTiming: 'ease-out',
    defaultIteration: '1',
    defaultDirection: 'normal',
    defaultFill: 'both',
  },
  slideInUp: {
    label: 'Slide In Up',
    icon: ArrowUp,
    keyframes: `  0% {
    transform: translateY(80px);
    opacity: 0;
  }
  100% {
    transform: translateY(0);
    opacity: 1;
  }`,
    defaultDuration: 0.5,
    defaultTiming: 'ease-out',
    defaultIteration: '1',
    defaultDirection: 'normal',
    defaultFill: 'both',
  },
  slideInDown: {
    label: 'Slide In Down',
    icon: ArrowDown,
    keyframes: `  0% {
    transform: translateY(-80px);
    opacity: 0;
  }
  100% {
    transform: translateY(0);
    opacity: 1;
  }`,
    defaultDuration: 0.5,
    defaultTiming: 'ease-out',
    defaultIteration: '1',
    defaultDirection: 'normal',
    defaultFill: 'both',
  },
  scaleIn: {
    label: 'Scale In',
    icon: Maximize2,
    keyframes: `  0% {
    transform: scale(0.4);
    opacity: 0;
  }
  100% {
    transform: scale(1);
    opacity: 1;
  }`,
    defaultDuration: 0.4,
    defaultTiming: 'cubic-bezier(.34,1.56,.64,1)',
    defaultIteration: '1',
    defaultDirection: 'normal',
    defaultFill: 'both',
  },
  scaleOut: {
    label: 'Scale Out',
    icon: Minimize2,
    keyframes: `  0% {
    transform: scale(1);
    opacity: 1;
  }
  100% {
    transform: scale(0.4);
    opacity: 0;
  }`,
    defaultDuration: 0.4,
    defaultTiming: 'ease-in',
    defaultIteration: '1',
    defaultDirection: 'normal',
    defaultFill: 'both',
  },
  rotate: {
    label: 'Rotate',
    icon: RotateCw,
    keyframes: `  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }`,
    defaultDuration: 1.2,
    defaultTiming: 'linear',
    defaultIteration: 'infinite',
    defaultDirection: 'normal',
    defaultFill: 'none',
  },
  bounce: {
    label: 'Bounce',
    icon: ArrowUpDown,
    keyframes: `  0%, 20%, 50%, 80%, 100% {
    transform: translateY(0);
  }
  40% {
    transform: translateY(-30px);
  }
  60% {
    transform: translateY(-15px);
  }`,
    defaultDuration: 1,
    defaultTiming: 'ease-in-out',
    defaultIteration: 'infinite',
    defaultDirection: 'normal',
    defaultFill: 'none',
  },
  pulse: {
    label: 'Pulse',
    icon: Activity,
    keyframes: `  0%, 100% {
    transform: scale(1);
    opacity: 1;
  }
  50% {
    transform: scale(1.08);
    opacity: 0.85;
  }`,
    defaultDuration: 1.4,
    defaultTiming: 'ease-in-out',
    defaultIteration: 'infinite',
    defaultDirection: 'normal',
    defaultFill: 'none',
  },
  shake: {
    label: 'Shake',
    icon: Move,
    keyframes: `  0%, 100% {
    transform: translateX(0);
  }
  10%, 30%, 50%, 70%, 90% {
    transform: translateX(-10px);
  }
  20%, 40%, 60%, 80% {
    transform: translateX(10px);
  }`,
    defaultDuration: 0.6,
    defaultTiming: 'ease-in-out',
    defaultIteration: '2',
    defaultDirection: 'normal',
    defaultFill: 'none',
  },
  flip: {
    label: 'Flip',
    icon: FlipHorizontal,
    keyframes: `  0% {
    transform: rotateY(0deg);
  }
  100% {
    transform: rotateY(360deg);
  }`,
    defaultDuration: 0.8,
    defaultTiming: 'ease-in-out',
    defaultIteration: '1',
    defaultDirection: 'normal',
    defaultFill: 'both',
  },
};
