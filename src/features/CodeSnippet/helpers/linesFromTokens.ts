// @ts-nocheck — typed gradually
export function linesFromTokens(tokens) {
  const lines = [[]];
  for (const t of tokens) {
    const parts = t.text.split('\n');
    parts.forEach((part, idx) => {
      if (idx > 0) lines.push([]);
      if (part.length > 0) lines[lines.length - 1].push({ text: part, type: t.type });
    });
  }
  return lines;
}
