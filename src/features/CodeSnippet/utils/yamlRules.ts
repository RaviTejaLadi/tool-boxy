// @ts-nocheck — typed gradually
import { R } from './shared';

export function yamlRules() {
  return [
    R('comment', '#.*'),
    R('property', '^[ \\t]*[\\w.\\-]+(?=\\s*:)', 'm'),
    R('string', '"[^"]*"|\'[^\']*\''),
    R('keyword', '\\b(?:true|false|null|yes|no)\\b', 'i'),
    R('number', '\\b-?\\d+\\.?\\d*\\b'),
    R('punctuation', '^[ \\t]*-(?=\\s)', 'm'),
    R('plain', '[^\\n]+'),
  ];
}
