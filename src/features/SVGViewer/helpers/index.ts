export function validateSvg(svgCode: string): string | null {
  if (!svgCode.trim()) return 'SVG code is empty.';
  try {
    const parser = new DOMParser();
    const svgDoc = parser.parseFromString(svgCode, 'image/svg+xml');
    const errorNode = svgDoc.querySelector('parsererror');
    if (errorNode) return 'Invalid SVG syntax. Please check your code.';
    if (!svgDoc.documentElement || svgDoc.documentElement.tagName.toLowerCase() !== 'svg') {
      return 'Root element must be an <svg>.';
    }
    return null;
  } catch {
    return 'Failed to parse SVG. Please check your code.';
  }
}

export function getSvgDimensions(svgCode: string): { width: string; height: string } {
  try {
    const parser = new DOMParser();
    const doc = parser.parseFromString(svgCode, 'image/svg+xml');
    const root = doc.documentElement;
    if (!root || root.querySelector('parsererror')) return { width: '—', height: '—' };

    const width = root.getAttribute('width');
    const height = root.getAttribute('height');
    if (width && height) {
      return {
        width: /px$/i.test(width) || /^\d+(\.\d+)?$/.test(width) ? `${parseFloat(width)}px` : width,
        height: /px$/i.test(height) || /^\d+(\.\d+)?$/.test(height) ? `${parseFloat(height)}px` : height,
      };
    }

    const viewBox = root.getAttribute('viewBox');
    if (viewBox) {
      const parts = viewBox.trim().split(/[\s,]+/);
      if (parts.length === 4) {
        return { width: `${parts[2]}px`, height: `${parts[3]}px` };
      }
    }
  } catch {
    /* ignore */
  }
  return { width: '—', height: '—' };
}

export function prettifySvg(svgCode: string): string {
  const trimmed = svgCode.trim();
  if (!trimmed) return trimmed;

  const tokens = trimmed
    .replace(/>\s+</g, '><')
    .replace(/</g, '\n<')
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean);

  let indent = 0;
  const lines: string[] = [];

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
      const tag = token.match(/^<([^\s/>]+)/)?.[1];
      if (tag && !token.includes(`</${tag}>`)) indent += 1;
    }
  }

  return `${lines.join('\n')}\n`;
}

export function optimizeSvg(svgCode: string): string {
  let out = svgCode.trim();
  if (!out) return out;

  out = out.replace(/<!--[\s\S]*?-->/g, '');
  out = out.replace(/\s{2,}/g, ' ');
  out = out.replace(/>\s+</g, '><');
  out = out.replace(/\s+([<>])/g, '$1');
  out = out.replace(/([<>])\s+/g, '$1');
  out = out.replace(/\s*=\s*/g, '=');
  out = out.replace(/\s+$/gm, '');
  out = out.replace(/^\s+/gm, '');
  out = out.replace(/\n{2,}/g, '\n');

  return `${prettifySvg(out).trim()}\n`;
}

const ATTR_TO_CAMEL: Record<string, string> = {
  'clip-path': 'clipPath',
  'clip-rule': 'clipRule',
  'fill-opacity': 'fillOpacity',
  'fill-rule': 'fillRule',
  'font-family': 'fontFamily',
  'font-size': 'fontSize',
  'font-weight': 'fontWeight',
  'stroke-dasharray': 'strokeDasharray',
  'stroke-dashoffset': 'strokeDashoffset',
  'stroke-linecap': 'strokeLinecap',
  'stroke-linejoin': 'strokeLinejoin',
  'stroke-miterlimit': 'strokeMiterlimit',
  'stroke-opacity': 'strokeOpacity',
  'stroke-width': 'strokeWidth',
  'stop-color': 'stopColor',
  'stop-opacity': 'stopOpacity',
  'text-anchor': 'textAnchor',
  'vector-effect': 'vectorEffect',
  class: 'className',
  for: 'htmlFor',
};

function renameAttrs(svgCode: string): string {
  return svgCode.replace(/\s([a-zA-Z_:][\w:.-]*)=/g, (match, name: string) => {
    if (name.startsWith('data-') || name.startsWith('aria-')) return match;
    const mapped = ATTR_TO_CAMEL[name] ?? ATTR_TO_CAMEL[name.toLowerCase()];
    return mapped ? ` ${mapped}=` : match;
  });
}

function indentBlock(code: string, spaces = 4): string {
  const pad = ' '.repeat(spaces);
  return code
    .split('\n')
    .map((line) => (line ? `${pad}${line}` : line))
    .join('\n');
}

export function svgToReact(svgCode: string): string {
  let jsx = renameAttrs(svgCode.trim());
  jsx = jsx.replace(/\sstyle="([^"]*)"/g, (_m, style: string) => {
    const entries = style
      .split(';')
      .map((s) => s.trim())
      .filter(Boolean)
      .map((pair) => {
        const [k, ...rest] = pair.split(':');
        const key = k.trim().replace(/-([a-z])/g, (_, c: string) => c.toUpperCase());
        const value = rest.join(':').trim();
        const num = Number(value);
        return Number.isFinite(num) && value !== '' && !/[a-z%]/i.test(value)
          ? `${key}: ${num}`
          : `${key}: '${value.replace(/'/g, "\\'")}'`;
      });
    return ` style={{ ${entries.join(', ')} }}`;
  });
  jsx = jsx.replace(/<svg\b/, '<svg {...props}');

  return `export default function Icon(props) {\n  return (\n${indentBlock(jsx)}\n  );\n}\n`;
}

export function svgToReactNative(svgCode: string): string {
  let code = renameAttrs(svgCode.trim());
  const tagMap: Record<string, string> = {
    svg: 'Svg',
    path: 'Path',
    circle: 'Circle',
    rect: 'Rect',
    line: 'Line',
    polygon: 'Polygon',
    polyline: 'Polyline',
    g: 'G',
    text: 'Text',
    tspan: 'TSpan',
    defs: 'Defs',
    clippath: 'ClipPath',
    lineargradient: 'LinearGradient',
    radialgradient: 'RadialGradient',
    stop: 'Stop',
    mask: 'Mask',
    pattern: 'Pattern',
    use: 'Use',
    symbol: 'Symbol',
    ellipse: 'Ellipse',
  };

  code = code.replace(/<\/?([a-zA-Z][\w:-]*)/g, (match, tag: string) => {
    const mapped = tagMap[tag.toLowerCase()];
    return mapped ? match.replace(tag, mapped) : match;
  });
  code = code.replace(/<Svg\b/, '<Svg {...props}');

  return `import Svg, {\n  Circle,\n  ClipPath,\n  Defs,\n  Ellipse,\n  G,\n  Line,\n  LinearGradient,\n  Mask,\n  Path,\n  Pattern,\n  Polygon,\n  Polyline,\n  RadialGradient,\n  Rect,\n  Stop,\n  Symbol,\n  Text,\n  TSpan,\n  Use,\n} from 'react-native-svg';\n\nexport default function Icon(props) {\n  return (\n${indentBlock(
    code
  )}\n  );\n}\n`;
}

export function svgToDataUri(svgCode: string): string {
  const encoded = encodeURIComponent(svgCode.trim()).replace(/'/g, '%27').replace(/"/g, '%22');
  return `data:image/svg+xml,${encoded}`;
}

export async function svgToPngDataUrl(svgCode: string, scale = 2): Promise<string> {
  const { width, height } = getSvgDimensions(svgCode);
  const w = Math.max(parseFloat(width) || 400, 1);
  const h = Math.max(parseFloat(height) || 400, 1);

  const blob = new Blob([svgCode], { type: 'image/svg+xml;charset=utf-8' });
  const url = URL.createObjectURL(blob);

  try {
    const img = await new Promise<HTMLImageElement>((resolve, reject) => {
      const image = new Image();
      image.onload = () => resolve(image);
      image.onerror = () => reject(new Error('Failed to render SVG'));
      image.src = url;
    });

    const canvas = document.createElement('canvas');
    canvas.width = Math.ceil(w * scale);
    canvas.height = Math.ceil(h * scale);
    const ctx = canvas.getContext('2d');
    if (!ctx) throw new Error('Canvas unavailable');
    ctx.scale(scale, scale);
    ctx.drawImage(img, 0, 0, w, h);
    return canvas.toDataURL('image/png');
  } finally {
    URL.revokeObjectURL(url);
  }
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

export function downloadDataUrl(dataUrl: string, filename: string) {
  const a = document.createElement('a');
  a.href = dataUrl;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
}
