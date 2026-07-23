// @ts-nocheck — typed gradually
import { KW } from './keywords';
import { R, STR, NUM } from './shared';

export function pyRules() {
  return [
    R('string', '\'\'\'[\\s\\S]*?\'\'\'|"""[\\s\\S]*?"""'),
    R('comment', '#.*'),
    R('string', STR),
    R('function', '@[A-Za-z_][\\w.]*'),
    R('number', NUM),
    R('keyword', `\\b(?:${KW.python.join('|')})\\b`),
    R('function', '[A-Za-z_][\\w]*(?=\\s*\\()'),
    R('type', '\\b[A-Z][\\w]*\\b'),
    R('plain', '[A-Za-z_][\\w]*'),
    R('punctuation', '[{}()\\[\\]:,.<>+\\-*/%=!&|^~]+'),
    R('plain', '[ \\t]+'),
  ];
}
