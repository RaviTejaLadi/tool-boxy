// @ts-nocheck — typed gradually
import { R, STR, NUM } from './shared';

export function clikeRules(keywords) {
  return [
    R('comment', '\\/\\*[\\s\\S]*?\\*\\/'),
    R('comment', '\\/\\/.*'),
    R('string', STR),
    R('number', NUM),
    R('keyword', `\\b(?:${keywords.join('|')})\\b`),
    R('function', '[A-Za-z_$][\\w$]*(?=\\s*\\()'),
    R('type', '\\b[A-Z][\\w$]*\\b'),
    R('plain', '[A-Za-z_$][\\w$]*'),
    R('punctuation', '[{}()\\[\\];:,.<>+\\-*/%=!&|^~?@]+'),
    R('plain', '[ \\t]+'),
  ];
}
