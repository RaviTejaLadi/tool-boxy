export const uid = () => Math.random().toString(36).slice(2, 9);

export function loadImage(src: string) {
  return new Promise<HTMLImageElement>((resolve, reject) => {
    const img = new window.Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });
}

export function drawRoundedRect(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) {
  const radius = Math.min(r, w / 2, h / 2);
  ctx.beginPath();
  ctx.moveTo(x + radius, y);
  ctx.arcTo(x + w, y, x + w, y + h, radius);
  ctx.arcTo(x + w, y + h, x, y + h, radius);
  ctx.arcTo(x, y + h, x, y, radius);
  ctx.arcTo(x, y, x + w, y, radius);
  ctx.closePath();
}

export function wrapCanvasText(ctx: CanvasRenderingContext2D, text: string, maxWidth: number) {
  const out: string[] = [];
  (text || '').split('\n').forEach((paragraph) => {
    const words = paragraph.split(' ');
    let line = '';
    words.forEach((word) => {
      const test = line ? line + ' ' + word : word;
      if (ctx.measureText(test).width > maxWidth && line) {
        out.push(line);
        line = word;
      } else {
        line = test;
      }
    });
    out.push(line);
  });
  return out;
}

export function paintGradient(ctx: CanvasRenderingContext2D, cssGradient: string, w: number, h: number) {
  const colors = cssGradient.match(/#[0-9A-Fa-f]{6}/g) || ['#111827', '#374151'];
  const grad = ctx.createLinearGradient(0, 0, w, h);
  colors.forEach((c, i) => grad.addColorStop(i / Math.max(colors.length - 1, 1), c));
  return grad;
}
