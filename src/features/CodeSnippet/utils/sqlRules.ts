// @ts-nocheck — typed gradually
import { KW } from './keywords';
import { R } from './shared';

export function sqlRules() {
  return [
    R('comment', '--.*'),
    R('string', "'[^']*'"),
    R('number', '\\b\\d+\\.?\\d*\\b'),
    R('keyword', `\\b(?:${KW.sql.join('|')})\\b`, 'i'),
    R('function', '[A-Za-z_][\\w]*(?=\\s*\\()'),
    R('plain', '[A-Za-z_][\\w]*'),
    R('punctuation', '[(),;.*=<>!+-]+'),
    R('plain', '[ \\t]+'),
  ];
}
