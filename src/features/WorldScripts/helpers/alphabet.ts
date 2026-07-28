import type { LanguageEntry } from '../constants';
import { getCharacterFormats } from './characterFormats';

export function getDisplayLetters(language: LanguageEntry, includeLowercase: boolean): string[] {
  const seen = new Set<string>();
  const result: string[] = [];

  const push = (char: string) => {
    if (!seen.has(char)) {
      seen.add(char);
      result.push(char);
    }
  };

  for (const letter of language.letters) {
    push(letter);
  }

  if (includeLowercase) {
    for (const letter of language.letters) {
      const lower = letter.toLocaleLowerCase();
      if (lower !== letter) push(lower);
    }
  }

  return result;
}

export function filterSymbols(letters: string[], query: string): string[] {
  const q = query.trim().toLowerCase();
  if (!q) return letters;

  return letters.filter((char) => {
    const formats = getCharacterFormats(char);
    return (
      char.toLowerCase().includes(q) ||
      formats.unicodeLabel.toLowerCase().includes(q.replace(/^u\+?/, 'u+')) ||
      formats.decimalLabel.includes(q)
    );
  });
}

export function alphabetAsString(letters: string[]): string {
  return letters.join('');
}

export function alphabetAsUnicodeLines(letters: string[]): string {
  return letters
    .map((char) => {
      const { unicodeLabel, char: c } = getCharacterFormats(char);
      return `${unicodeLabel}\t${c}`;
    })
    .join('\n');
}

export function alphabetAsJson(letters: string[]): string {
  const payload = letters.map((char) => {
    const f = getCharacterFormats(char);
    return {
      char: f.char,
      codePoint: f.codePoint,
      unicode: f.unicodeLabel,
      html: f.html,
      css: f.css,
      js: f.js,
    };
  });
  return JSON.stringify(payload, null, 2);
}
