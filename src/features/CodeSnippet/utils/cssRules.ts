// @ts-nocheck — typed gradually
import { R } from './shared';

export function cssRules() {
  return [
    R('comment', '\\/\\*[\\s\\S]*?\\*\\/'),
    R('string', '"[^"]*"|\'[^\']*\''),
    R('function', '@[a-zA-Z-]+'),
    R('property', '[a-zA-Z-]+(?=\\s*:)'),
    R('number', '#[0-9a-fA-F]{3,8}\\b|-?\\d*\\.?\\d+[a-z%]*\\b'),
    R('type', '[.#][a-zA-Z_-][\\w-]*'),
    R('plain', '[a-zA-Z-]+'),
    R('punctuation', '[{}();:,]+'),
    R('plain', '[ \\t]+'),
  ];
}
