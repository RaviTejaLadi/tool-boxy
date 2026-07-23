// @ts-nocheck — typed gradually
import { R } from './shared';

export function jsonRules() {
  return [
    R('property', '"(?:\\\\.|[^"\\\\])*"(?=\\s*:)'),
    R('string', '"(?:\\\\.|[^"\\\\])*"'),
    R('number', '-?\\b\\d+\\.?\\d*(?:[eE][+-]?\\d+)?\\b'),
    R('keyword', '\\b(?:true|false|null)\\b'),
    R('punctuation', '[{}\\[\\]:,]+'),
    R('plain', '[ \\t]+'),
  ];
}
