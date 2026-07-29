import type { AnimationType } from './animations';

export interface AnimationPreset {
  label: string;
  description: string;
  type: AnimationType;
  duration: number;
  timing: string;
  iteration: string;
  direction: string;
  fill: string;
}

export const PRESETS: AnimationPreset[] = [
  {
    label: 'Fade In',
    description: 'Simple entrance',
    type: 'fadeIn',
    duration: 0.6,
    timing: 'ease-out',
    iteration: '1',
    direction: 'normal',
    fill: 'both',
  },
  {
    label: 'Slide Up Reveal',
    description: 'Content entering from below',
    type: 'slideInUp',
    duration: 0.5,
    timing: 'ease-out',
    iteration: '1',
    direction: 'normal',
    fill: 'both',
  },
  {
    label: 'Pop In',
    description: 'Playful overshoot scale',
    type: 'scaleIn',
    duration: 0.45,
    timing: 'cubic-bezier(.34,1.56,.64,1)',
    iteration: '1',
    direction: 'normal',
    fill: 'both',
  },
  {
    label: 'Loading Spinner',
    description: 'Continuous linear rotation',
    type: 'rotate',
    duration: 1,
    timing: 'linear',
    iteration: 'infinite',
    direction: 'normal',
    fill: 'none',
  },
  {
    label: 'Attention Bounce',
    description: 'Draw the eye, looping',
    type: 'bounce',
    duration: 1,
    timing: 'ease-in-out',
    iteration: 'infinite',
    direction: 'normal',
    fill: 'none',
  },
  {
    label: 'Pulse Glow',
    description: 'Gentle breathing loop',
    type: 'pulse',
    duration: 1.4,
    timing: 'ease-in-out',
    iteration: 'infinite',
    direction: 'normal',
    fill: 'none',
  },
  {
    label: 'Shake Error',
    description: 'Form validation feedback',
    type: 'shake',
    duration: 0.5,
    timing: 'ease-in-out',
    iteration: '2',
    direction: 'normal',
    fill: 'none',
  },
  {
    label: 'Card Flip',
    description: 'Reveal the back face',
    type: 'flip',
    duration: 0.8,
    timing: 'ease-in-out',
    iteration: '1',
    direction: 'normal',
    fill: 'both',
  },
];
