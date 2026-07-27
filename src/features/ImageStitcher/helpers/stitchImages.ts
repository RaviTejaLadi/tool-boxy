import { getFormat, toCanvasComposite, type ObjectFitMode, type OutputFormatId } from '../constants';
import type { StitchImage } from '../stores';
import { chunkByPattern, computeRowPattern } from './layout';

export type StitchExport = {
  blob: Blob;
  width: number;
  height: number;
  mimeType: string;
  extension: string;
  fileName: string;
};

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error('Failed to load image'));
    img.src = src;
  });
}

function canvasToBlob(canvas: HTMLCanvasElement, mime: string, quality: number): Promise<Blob> {
  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (blob) resolve(blob);
        else reject(new Error('Failed to encode image'));
      },
      mime,
      quality
    );
  });
}

function getDrawRect(
  fit: ObjectFitMode,
  natW: number,
  natH: number,
  boxW: number,
  boxH: number
): { dx: number; dy: number; dw: number; dh: number } {
  if (fit === 'fill') {
    return { dx: 0, dy: 0, dw: boxW, dh: boxH };
  }

  if (fit === 'none') {
    const dw = natW;
    const dh = natH;
    return { dx: (boxW - dw) / 2, dy: (boxH - dh) / 2, dw, dh };
  }

  const scale = fit === 'contain' ? Math.min(boxW / natW, boxH / natH) : Math.max(boxW / natW, boxH / natH);
  const dw = natW * scale;
  const dh = natH * scale;
  return { dx: (boxW - dw) / 2, dy: (boxH - dh) / 2, dw, dh };
}

function drawImageInCell(
  ctx: CanvasRenderingContext2D,
  img: HTMLImageElement,
  image: StitchImage,
  x: number,
  y: number,
  boxW: number,
  boxH: number
) {
  const { dx, dy, dw, dh } = getDrawRect(image.fit, img.naturalWidth, img.naturalHeight, boxW, boxH);

  ctx.save();
  ctx.beginPath();
  ctx.rect(x, y, boxW, boxH);
  ctx.clip();

  ctx.globalAlpha = image.opacity;
  ctx.globalCompositeOperation = toCanvasComposite(image.blendMode);

  const cx = x + boxW / 2;
  const cy = y + boxH / 2;
  ctx.translate(cx, cy);
  ctx.rotate((image.rotation * Math.PI) / 180);
  ctx.scale(image.flipX ? -1 : 1, image.flipY ? -1 : 1);
  ctx.translate(-cx, -cy);

  ctx.drawImage(img, x + dx, y + dy, dw, dh);
  ctx.restore();
}

type SizedItem = {
  el: HTMLImageElement;
  image: StitchImage;
  w: number;
  h: number;
};

function sizeRowItems(images: StitchImage[], loaded: HTMLImageElement[], baseH: number): SizedItem[] {
  return images.map((image, i) => {
    const scale = image.scale > 0 ? image.scale : 1;
    const w = Math.max(1, Math.round((image.width / Math.max(image.height, 1)) * baseH * scale));
    return { el: loaded[i], image, w, h: baseH };
  });
}

/** Smart multi-row collage — rows sized by computeRowPattern. */
function stitchCollage(images: StitchImage[], loaded: HTMLImageElement[]): HTMLCanvasElement {
  const pattern = computeRowPattern(images.length);
  const rows = chunkByPattern(
    images.map((image, i) => ({ image, el: loaded[i] })),
    pattern
  );

  const baseH = Math.max(...images.map((img) => img.height), 1);
  const sizedRows = rows.map((row) =>
    sizeRowItems(
      row.map((r) => r.image),
      row.map((r) => r.el),
      baseH
    )
  );

  const canvasWidth = Math.max(1, ...sizedRows.map((row) => row.reduce((sum, item) => sum + item.w, 0)));
  const canvasHeight = Math.max(1, sizedRows.length * baseH);

  const canvas = document.createElement('canvas');
  canvas.width = canvasWidth;
  canvas.height = canvasHeight;
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Canvas not supported');

  // White base so JPEG exports don't get black letterboxing under contain/none
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  sizedRows.forEach((row, rowIndex) => {
    const rowW = row.reduce((sum, item) => sum + item.w, 0);
    const stretch = canvasWidth / Math.max(rowW, 1);
    let x = 0;
    const y = rowIndex * baseH;

    row.forEach((item, itemIndex) => {
      const isLast = itemIndex === row.length - 1;
      const w = isLast ? canvasWidth - x : Math.max(1, Math.round(item.w * stretch));
      drawImageInCell(ctx, item.el, item.image, x, y, w, baseH);
      x += w;
    });
  });

  return canvas;
}

/** One-shot export — call only when the user downloads. */
export async function stitchImages(
  images: StitchImage[],
  options: {
    formatId: OutputFormatId;
    quality?: number;
  }
): Promise<StitchExport> {
  if (images.length < 1) {
    throw new Error('Add at least one image');
  }

  const format = getFormat(options.formatId);
  const loaded = await Promise.all(images.map((image) => loadImage(image.dataUrl)));
  const canvas = stitchCollage(images, loaded);

  const quality = options.quality ?? 0.92;
  const blob = await canvasToBlob(canvas, format.mime, quality);

  return {
    blob,
    width: canvas.width,
    height: canvas.height,
    mimeType: format.mime,
    extension: format.extension,
    fileName: `stitched.${format.extension}`,
  };
}
