import { LOREM_IPSUM, type OutputFormat } from '../constants';

export function generateParagraphs(count: number): string[] {
  const sentences: string[] = LOREM_IPSUM.split('.')
    .map((s) => s.trim())
    .filter((s) => s.length > 0);
  const result: string[] = [];

  for (let i = 0; i < count; i++) {
    const shuffled = [...sentences];
    const offset = (i * 3) % shuffled.length;
    const rotated = [...shuffled.slice(offset), ...shuffled.slice(0, offset)];
    const numSentences = 3 + (i % 4);
    const para = rotated.slice(0, numSentences).join('. ') + '.';
    result.push(para);
  }
  return result;
}

export function formatLorem(paragraphs: string[], format: OutputFormat): string {
  if (format === 'html') {
    return paragraphs.map((p) => `<p>${p}</p>`).join('');
  }
  return paragraphs.join('\n\n');
}

export function generateLorem(count: number, format: OutputFormat): string {
  return formatLorem(generateParagraphs(count), format);
}
