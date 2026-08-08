import { ANIMATIONS, type AnimationType } from '../constants';
import {
  TEXT_ANIMATIONS,
  type TextAnimationType,
  type TextDirection,
  type TextMotionPhase,
  type TextSegmentMode,
} from '../constants/textAnimations';

export function toKebab(str: string) {
  return str.replace(/([a-z0-9])([A-Z])/g, '$1-$2').toLowerCase();
}

export const ALL_SHAPE_KEYFRAMES_CSS = Object.entries(ANIMATIONS)
  .map(([key, val]) => `@keyframes ${toKebab(key)} {\n${val.keyframes}\n}`)
  .join('\n\n');

export function buildTextKeyframeName(type: TextAnimationType, phase: 'enter' | 'exit') {
  return `text-${type}-${phase}`;
}

export const ALL_TEXT_KEYFRAMES_CSS = (Object.keys(TEXT_ANIMATIONS) as TextAnimationType[])
  .flatMap((key) => {
    const def = TEXT_ANIMATIONS[key];
    return [
      `@keyframes ${buildTextKeyframeName(key, 'enter')} {\n${def.keyframesEnter}\n}`,
      `@keyframes ${buildTextKeyframeName(key, 'exit')} {\n${def.keyframesExit}\n}`,
    ];
  })
  .join('\n\n');

/** @deprecated use ALL_SHAPE_KEYFRAMES_CSS — kept for compatibility */
export const ALL_KEYFRAMES_CSS = `${ALL_SHAPE_KEYFRAMES_CSS}\n\n${ALL_TEXT_KEYFRAMES_CSS}`;

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

export function getDirectionCssVars(direction: TextDirection): Record<string, string> {
  switch (direction) {
    case 'left':
      return {
        '--pan-from-x': '-48px',
        '--pan-from-y': '0px',
        '--pan-to-x': '48px',
        '--pan-to-y': '0px',
        '--drift-x': '10px',
        '--drift-y': '0px',
        '--roll-from': '120deg',
        '--roll-to': '-120deg',
        '--skate-skew': '12deg',
      };
    case 'right':
      return {
        '--pan-from-x': '48px',
        '--pan-from-y': '0px',
        '--pan-to-x': '-48px',
        '--pan-to-y': '0px',
        '--drift-x': '-10px',
        '--drift-y': '0px',
        '--roll-from': '-120deg',
        '--roll-to': '120deg',
        '--skate-skew': '-12deg',
      };
    case 'up':
      return {
        '--pan-from-x': '0px',
        '--pan-from-y': '36px',
        '--pan-to-x': '0px',
        '--pan-to-y': '-36px',
        '--drift-x': '0px',
        '--drift-y': '-10px',
        '--roll-from': '-90deg',
        '--roll-to': '90deg',
        '--skate-skew': '0deg',
      };
    case 'down':
      return {
        '--pan-from-x': '0px',
        '--pan-from-y': '-36px',
        '--pan-to-x': '0px',
        '--pan-to-y': '36px',
        '--drift-x': '0px',
        '--drift-y': '10px',
        '--roll-from': '90deg',
        '--roll-to': '-90deg',
        '--skate-skew': '0deg',
      };
    default:
      return {};
  }
}

export type TextSegment = {
  text: string;
  isSpace: boolean;
  index: number;
};

export function splitTextForAnimation(text: string, mode: TextSegmentMode): TextSegment[] {
  if (mode === 'line') {
    return [{ text, isSpace: false, index: 0 }];
  }

  if (mode === 'word') {
    const parts = text.split(/(\s+)/);
    let index = 0;
    return parts
      .filter((p) => p.length > 0)
      .map((part) => {
        const isSpace = /^\s+$/.test(part);
        const segment: TextSegment = { text: part, isSpace, index: isSpace ? -1 : index };
        if (!isSpace) index += 1;
        return segment;
      });
  }

  // character
  let index = 0;
  return Array.from(text).map((char) => {
    const isSpace = /\s/.test(char);
    const segment: TextSegment = { text: char === ' ' ? '\u00A0' : char, isSpace, index: isSpace ? -1 : index };
    if (!isSpace) index += 1;
    return segment;
  });
}

export function getBurstOffset(i: number): { x: string; y: string } {
  const angle = (i * 137.5 * Math.PI) / 180;
  const dist = 18 + (i % 5) * 6;
  return {
    x: `${Math.round(Math.cos(angle) * dist)}px`,
    y: `${Math.round(Math.sin(angle) * dist)}px`,
  };
}

export function getScrapRotation(i: number): string {
  const rotations = [-10, 7, -5, 12, -8, 6, -14, 9];
  return `${rotations[i % rotations.length]}deg`;
}

export function buildTextCssText(params: {
  textAnimationType: TextAnimationType;
  phase: TextMotionPhase;
  duration: number;
  timingValue: string;
  delay: number;
  iterationValue: number | string;
  direction: string;
  fillMode: string;
  stagger: number;
  segmentMode: TextSegmentMode;
  textDirection: TextDirection;
  previewText: string;
}) {
  const def = TEXT_ANIMATIONS[params.textAnimationType];
  const enterName = buildTextKeyframeName(params.textAnimationType, 'enter');
  const exitName = buildTextKeyframeName(params.textAnimationType, 'exit');
  const className = `text-${params.textAnimationType}`;
  const unitClass = `${className}__unit`;

  const dirVars = getDirectionCssVars(params.textDirection);
  const varBlock = Object.entries(dirVars)
    .map(([k, v]) => `  ${k}: ${v};`)
    .join('\n');

  const keyframes =
    params.phase === 'enter'
      ? `@keyframes ${enterName} {\n${def.keyframesEnter}\n}`
      : params.phase === 'exit'
      ? `@keyframes ${exitName} {\n${def.keyframesExit}\n}`
      : `@keyframes ${enterName} {\n${def.keyframesEnter}\n}\n\n@keyframes ${exitName} {\n${def.keyframesExit}\n}`;

  const animationName =
    params.phase === 'both' ? `${enterName}, ${exitName}` : params.phase === 'exit' ? exitName : enterName;

  const durationBlock = params.phase === 'both' ? `${params.duration}s, ${params.duration}s` : `${params.duration}s`;

  const delayNote =
    params.phase === 'both'
      ? `  /* Second animation starts after the enter finishes — tweak as needed */\n  animation-delay: var(--unit-delay, ${params.delay}s), calc(var(--unit-delay, ${params.delay}s) + ${params.duration}s + 0.4s);`
      : `  animation-delay: var(--unit-delay, ${params.delay}s);`;

  const segments = splitTextForAnimation(params.previewText, params.segmentMode).filter((s) => !s.isSpace);
  const staggerRules =
    params.segmentMode === 'line' || params.stagger === 0
      ? ''
      : `\n${segments
          .map(
            (_, i) =>
              `.${unitClass}:nth-child(${i + 1}) {\n  --unit-delay: ${(params.delay + i * params.stagger).toFixed(
                3
              )}s;\n}`
          )
          .join('\n')}`;

  return `${keyframes}

.${className} {
${varBlock ? `${varBlock}\n` : ''}  display: inline-block;
}

.${unitClass} {
  display: inline-block;
  white-space: pre;
  transform-origin: center bottom;
  animation-name: ${animationName};
  animation-duration: ${durationBlock};
  animation-timing-function: ${params.timingValue};
  animation-iteration-count: ${params.iterationValue};
  animation-direction: ${params.direction};
  animation-fill-mode: ${params.fillMode};
${delayNote}
}${staggerRules}`;
}

export function buildTextHtmlText(params: {
  textAnimationType: TextAnimationType;
  segmentMode: TextSegmentMode;
  previewText: string;
}) {
  const className = `text-${params.textAnimationType}`;
  const unitClass = `${className}__unit`;
  const segments = splitTextForAnimation(params.previewText, params.segmentMode);

  if (params.segmentMode === 'line') {
    return `<span class="${className}">
  <span class="${unitClass}">${escapeHtml(params.previewText)}</span>
</span>`;
  }

  const inner = segments
    .map((seg) => {
      if (seg.isSpace) return escapeHtml(seg.text);
      return `  <span class="${unitClass}">${escapeHtml(seg.text)}</span>`;
    })
    .join(params.segmentMode === 'word' ? '\n' : '');

  return `<span class="${className}">
${inner}
</span>`;
}

function escapeHtml(value: string) {
  return value.replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('"', '&quot;');
}
