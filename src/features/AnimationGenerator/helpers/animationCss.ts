import { ANIMATIONS, type AnimationType } from '../constants';

export function toKebab(str: string) {
  return str.replace(/([a-z0-9])([A-Z])/g, '$1-$2').toLowerCase();
}

export const ALL_KEYFRAMES_CSS = Object.entries(ANIMATIONS)
  .map(([key, val]) => `@keyframes ${toKebab(key)} {\n${val.keyframes}\n}`)
  .join('\n\n');

export function getTimingValue(timingFunction: string, bezier: { x1: number; y1: number; x2: number; y2: number }) {
  return timingFunction === 'custom'
    ? `cubic-bezier(${bezier.x1},${bezier.y1},${bezier.x2},${bezier.y2})`
    : timingFunction;
}

export function getIterationValue(iterationCount: string, iterationCustom: number) {
  return iterationCount === 'custom' ? iterationCustom : iterationCount;
}

export function buildCssText(params: {
  animationType: AnimationType;
  duration: number;
  timingValue: string;
  delay: number;
  iterationValue: number | string;
  direction: string;
  fillMode: string;
}) {
  const kebabName = toKebab(params.animationType);
  return `@keyframes ${kebabName} {
${ANIMATIONS[params.animationType].keyframes}
}

.${kebabName} {
  animation-name: ${kebabName};
  animation-duration: ${params.duration}s;
  animation-timing-function: ${params.timingValue};
  animation-delay: ${params.delay}s;
  animation-iteration-count: ${params.iterationValue};
  animation-direction: ${params.direction};
  animation-fill-mode: ${params.fillMode};
}`;
}

export function buildHtmlText(animationType: AnimationType) {
  const kebabName = toKebab(animationType);
  return `<div class="${kebabName}">\n  Your content\n</div>`;
}
