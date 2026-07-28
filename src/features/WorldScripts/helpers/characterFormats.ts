export type CharacterFormats = {
  char: string;
  codePoint: number;
  unicodeLabel: string;
  decimalLabel: string;
  html: string;
  css: string;
  js: string;
};

export function getCharacterFormats(char: string): CharacterFormats {
  const codePoint = char.codePointAt(0) ?? 0;
  const hex = codePoint.toString(16).toUpperCase().padStart(4, '0');

  return {
    char,
    codePoint,
    unicodeLabel: `U+${hex}`,
    decimalLabel: String(codePoint),
    html: `&#x${hex};`,
    css: `\\${hex} `,
    js: codePoint > 0xffff ? `\\u{${codePoint.toString(16).toUpperCase()}}` : `\\u${hex}`,
  };
}
