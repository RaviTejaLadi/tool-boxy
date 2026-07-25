import type { PlaceholderConfig } from './buildSvg';
import { buildSvg } from './buildSvg';

export function downloadPng({ width, height, text, bgColor, textColor }: PlaceholderConfig): void {
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  ctx.fillStyle = bgColor;
  ctx.fillRect(0, 0, width, height);

  ctx.fillStyle = textColor;
  ctx.font = `${Math.min(width, height) / 10}px Arial, sans-serif`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(text, width / 2, height / 2);

  const link = document.createElement('a');
  link.download = `placeholder-${width}x${height}.png`;
  link.href = canvas.toDataURL('image/png');
  link.click();
}

export function downloadSvg(config: PlaceholderConfig): void {
  const blob = new Blob([buildSvg(config)], { type: 'image/svg+xml' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `placeholder-${config.width}x${config.height}.svg`;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}

export async function copyToClipboard(text: string): Promise<void> {
  try {
    await navigator.clipboard.writeText(text);
  } catch {
    // clipboard may be unavailable — caller still flashes UI feedback
  }
}
