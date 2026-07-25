export interface PlaceholderConfig {
  width: number;
  height: number;
  text: string;
  bgColor: string;
  textColor: string;
}

export function buildSvg({ width, height, text, bgColor, textColor }: PlaceholderConfig): string {
  const fontSize = Math.min(width, height) / 10;

  return `<svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
  <rect width="100%" height="100%" fill="${bgColor}"/>
  <text
    x="50%"
    y="50%"
    font-family="Arial, sans-serif"
    font-size="${fontSize}px"
    fill="${textColor}"
    text-anchor="middle"
    dominant-baseline="central"
  >${text}</text>
</svg>`;
}

export function buildDataUrl(config: PlaceholderConfig): string {
  return `data:image/svg+xml,${encodeURIComponent(buildSvg(config))}`;
}
