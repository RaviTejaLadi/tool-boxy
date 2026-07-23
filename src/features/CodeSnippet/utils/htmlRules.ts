// @ts-nocheck — typed gradually
import { R } from './shared';

export function htmlRules() {
  return [
    R('comment', '<!--[\\s\\S]*?-->'),
    R('tag', '<\\/?[a-zA-Z][\\w:-]*'),
    R('punctuation', '\\/?>'),
    R('attr', '[a-zA-Z_:][\\w:-]*(?=\\s*=)'),
    R('string', '"[^"]*"|\'[^\']*\''),
    R('punctuation', '='),
    R('plain', '[^<>]+'),
  ];
}
