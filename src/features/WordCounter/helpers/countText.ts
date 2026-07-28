export type TextStats = {
  words: number;
  characters: number;
  charactersNoSpaces: number;
  sentences: number;
  paragraphs: number;
  lines: number;
  readingTime: number;
  speakingTime: number;
};

export function countText(text: string): TextStats {
  const words = text.trim() === '' ? 0 : text.trim().split(/\s+/).length;
  const characters = text.length;
  const charactersNoSpaces = text.replace(/\s/g, '').length;
  const sentences = text.trim() === '' ? 0 : text.split(/[.!?]+/).filter((s) => s.trim().length > 0).length;
  const paragraphs = text.trim() === '' ? 0 : text.split(/\n+/).filter((p) => p.trim().length > 0).length;
  const lines = text === '' ? 0 : text.split('\n').length;

  // Reading ~200 wpm, speaking ~150 wpm (minutes, minimum 1 when empty/short)
  const readingTime = words === 0 ? 1 : Math.max(1, Math.ceil(words / 200));
  const speakingTime = words === 0 ? 1 : Math.max(1, Math.ceil(words / 150));

  return {
    words,
    characters,
    charactersNoSpaces,
    sentences,
    paragraphs,
    lines,
    readingTime,
    speakingTime,
  };
}

export function formatStats(stats: TextStats): string {
  return [
    `Word Count: ${stats.words}`,
    `Characters: ${stats.characters}`,
    `Characters (no spaces): ${stats.charactersNoSpaces}`,
    `Sentences: ${stats.sentences}`,
    `Paragraphs: ${stats.paragraphs}`,
    `Lines: ${stats.lines}`,
    `Reading Time: ${stats.readingTime} min`,
    `Speaking Time: ${stats.speakingTime} min`,
  ].join('\n');
}
