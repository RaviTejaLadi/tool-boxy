import type { PaletteColor } from './generate';

export function downloadPaletteImage(colors: PaletteColor[], canvas?: HTMLCanvasElement | null) {
  const width = 900;
  const height = 400;
  const target = canvas ?? document.createElement('canvas');
  target.width = width;
  target.height = height;
  const ctx = target.getContext('2d');
  if (!ctx) return;

  const swatchW = width / colors.length;

  colors.forEach((c, i) => {
    ctx.fillStyle = c.hex;
    ctx.fillRect(i * swatchW, 0, swatchW, height - 70);

    ctx.fillStyle = '#0B1611';
    ctx.fillRect(i * swatchW, height - 70, swatchW, 70);

    ctx.fillStyle = '#F5F1E6';
    ctx.font = 'bold 15px sans-serif';
    ctx.fillText(c.hex, i * swatchW + 14, height - 42);

    ctx.fillStyle = '#9FB0A6';
    ctx.font = '12px sans-serif';
    ctx.fillText(c.name, i * swatchW + 14, height - 22);
  });

  target.toBlob((blob) => {
    if (!blob) return;
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'palette.png';
    a.click();
    URL.revokeObjectURL(url);
  });
}
