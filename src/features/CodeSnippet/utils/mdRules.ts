// @ts-nocheck — typed gradually
import { R } from './shared';

export function mdRules() {
  return [
    R('keyword', '^#{1,6}[ \\t].*', 'm'),
    R('string', '`[^`]*`'),
    R('function', '\\*\\*[^*]*\\*\\*|__[^_]*__'),
    R('type', '\\*[^*]*\\*|_[^_]*_'),
    R('tag', '\\[[^\\]]*\\]\\([^)]*\\)'),
    R('comment', '^>.*', 'm'),
    R('punctuation', '^[ \\t]*[-*+](?=\\s)', 'm'),
    R('plain', '[^\\n]+'),
  ];
}
