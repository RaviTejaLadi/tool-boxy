export function prettifyHtml(html: string): string {
  const trimmed = html.trim();
  if (!trimmed) return trimmed;

  const tokens = trimmed
    .replace(/>\s+</g, '><')
    .replace(/</g, '\n<')
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean);

  let indent = 0;
  const lines: string[] = [];
  const voidTags = new Set([
    'area',
    'base',
    'br',
    'col',
    'embed',
    'hr',
    'img',
    'input',
    'link',
    'meta',
    'param',
    'source',
    'track',
    'wbr',
  ]);

  for (const token of tokens) {
    if (token.startsWith('</')) indent = Math.max(indent - 1, 0);
    lines.push(`${'  '.repeat(indent)}${token}`);
    if (
      token.startsWith('<') &&
      !token.startsWith('</') &&
      !token.startsWith('<?') &&
      !token.startsWith('<!') &&
      !token.endsWith('/>') &&
      !/^<[^>]+\/>$/.test(token)
    ) {
      const tag = token.match(/^<([^\s/>]+)/)?.[1]?.toLowerCase();
      if (tag && !voidTags.has(tag) && !token.includes(`</${tag}>`)) indent += 1;
    }
  }

  return `${lines.join('\n')}\n`;
}

export function buildPreviewDocument(htmlContent: string): string {
  return `<!DOCTYPE html>
<html>
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <script src="https://cdn.tailwindcss.com"><\/script>
    <style>
      html, body {
        margin: 0;
        min-height: 100%;
        background: transparent;
      }
      body {
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
      }
    </style>
  </head>
  <body>
    ${htmlContent}
  </body>
</html>`;
}

export function downloadText(content: string, filename: string, mime = 'text/plain') {
  const blob = new Blob([content], { type: mime });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}
