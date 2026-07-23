// @ts-nocheck — typed gradually
import { CODE_FONT, UI_FONT } from '../constants/fonts';
import { escapeXml } from './escapeXml';

/* Single source of truth. The live preview, SVG download and PNG
   download all render from this same markup. */
export function buildSVG(params) {
  const {
    lines,
    theme,
    background,
    customColor,
    showTitleBar,
    title,
    showWindowControls,
    showLineNumbers,
    showShadow,
    cornerRadius,
    fontSize,
    framePadding,
  } = params;

  const lineHeight = Math.round(fontSize * 1.65);
  const innerPad = Math.max(20, Math.round(fontSize * 1.5));
  const titleBarHeight = showTitleBar ? Math.round(fontSize * 2.6) : 0;

  const measure = params.measure;
  const gutterDigits = String(lines.length).length;
  const gutterWidth = showLineNumbers ? Math.ceil(measure('0'.repeat(gutterDigits))) + 28 : 0;

  let maxLineWidth = 0;
  lines.forEach((tokens) => {
    const w = tokens.reduce((acc, t) => acc + measure(t.text), 0);
    if (w > maxLineWidth) maxLineWidth = w;
  });

  const cardWidth = Math.max(280, Math.ceil(maxLineWidth) + innerPad * 2 + gutterWidth);
  const codeTop = titleBarHeight + innerPad;
  const cardHeight = codeTop + Math.max(1, lines.length) * lineHeight + innerPad;

  const frameWidth = cardWidth + framePadding * 2;
  const frameHeight = cardHeight + framePadding * 2;
  const cardX = framePadding;
  const cardY = framePadding;

  let defs = '';
  let bgFill = null;
  if (background.type === 'gradient') {
    defs += `<linearGradient id="bgGrad" x1="0%" y1="0%" x2="100%" y2="100%">${background.stops
      .map((s) => `<stop offset="${s.offset}" stop-color="${s.color}"/>`)
      .join('')}</linearGradient>`;
    bgFill = 'url(#bgGrad)';
  } else if (background.type === 'solid') {
    bgFill = background.color;
  } else if (background.type === 'custom') {
    bgFill = customColor;
  }

  defs += `<filter id="cardShadow" x="-30%" y="-30%" width="160%" height="160%"><feDropShadow dx="0" dy="22" stdDeviation="28" flood-color="#000000" flood-opacity="0.45"/></filter>`;

  let s = '';
  s += `<svg xmlns="http://www.w3.org/2000/svg" width="${frameWidth}" height="${frameHeight}" viewBox="0 0 ${frameWidth} ${frameHeight}">`;
  s += `<defs>${defs}</defs>`;
  if (bgFill) s += `<rect x="0" y="0" width="${frameWidth}" height="${frameHeight}" fill="${bgFill}"/>`;

  s += `<g ${showShadow ? 'filter="url(#cardShadow)"' : ''}>`;
  s += `<rect x="${cardX}" y="${cardY}" width="${cardWidth}" height="${cardHeight}" rx="${cornerRadius}" fill="${theme.bg}"/>`;
  s += `</g>`;

  s += `<clipPath id="cardClip"><rect x="${cardX}" y="${cardY}" width="${cardWidth}" height="${cardHeight}" rx="${cornerRadius}"/></clipPath>`;
  s += `<g clip-path="url(#cardClip)">`;

  if (showTitleBar) {
    if (showWindowControls) {
      const dotY = cardY + titleBarHeight / 2;
      ['#ff5f57', '#febc2e', '#28c840'].forEach((c, i) => {
        s += `<circle cx="${cardX + 22 + i * 20}" cy="${dotY}" r="6" fill="${c}" opacity="0.9"/>`;
      });
    }
    if (title) {
      s += `<text x="${cardX + cardWidth / 2}" y="${
        cardY + titleBarHeight / 2 + 4
      }" text-anchor="middle" font-family='${UI_FONT}' font-size="12.5" fill="${theme.titleColor}">${escapeXml(
        title
      )}</text>`;
    }
    s += `<line x1="${cardX}" y1="${cardY + titleBarHeight}" x2="${cardX + cardWidth}" y2="${
      cardY + titleBarHeight
    }" stroke="${theme.gutter}" stroke-width="1" opacity="0.5"/>`;
  }

  lines.forEach((tokens, idx) => {
    const y = cardY + codeTop + idx * lineHeight + fontSize * 0.85;
    if (showLineNumbers) {
      s += `<text x="${
        cardX + innerPad + gutterWidth - 16
      }" y="${y}" text-anchor="end" font-family='${CODE_FONT}' font-size="${fontSize}" fill="${theme.gutter}">${
        idx + 1
      }</text>`;
    }
    s += `<text x="${
      cardX + innerPad + gutterWidth
    }" y="${y}" font-family='${CODE_FONT}' font-size="${fontSize}" xml:space="preserve">`;
    tokens.forEach((t) => {
      const fill = theme.colors[t.type] || theme.colors.plain;
      s += `<tspan fill="${fill}">${escapeXml(t.text)}</tspan>`;
    });
    s += `</text>`;
  });

  s += `</g></svg>`;
  return { svg: s, frameWidth, frameHeight };
}
