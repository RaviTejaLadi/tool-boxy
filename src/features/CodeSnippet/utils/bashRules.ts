// @ts-nocheck — typed gradually
import { KW } from './keywords';
import { R } from './shared';

export function bashRules() {
  return [
    R('comment', '#.*'),
    R('string', '"(?:\\\\.|[^"\\\\])*"|\'[^\']*\''),
    R('function', '\\$\\{[^}]*\\}|\\$[A-Za-z_][\\w]*|\\$\\?|\\$\\d'),
    R('number', '\\b\\d+\\b'),
    R('keyword', `\\b(?:${KW.bash.join('|')})\\b`),
    R('plain', '[A-Za-z_][\\w.\\-\\/]*'),
    R('punctuation', '[|&;()<>=\\-]+'),
    R('plain', '[ \\t]+'),
  ];
}
