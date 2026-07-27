import { ASCII_CHARS, FONT_ASPECT_RATIO, MAX_FILE_SIZE } from '../constants';

export function charForBrightness(brightness: number): string {
  const index = Math.floor((brightness / 255) * (ASCII_CHARS.length - 1));
  return ASCII_CHARS[Math.min(index, ASCII_CHARS.length - 1)];
}

export function generateAsciiFromImageData(imageData: ImageData, width: number, height: number): string {
  const pixels = imageData.data;
  let asciiResult = '';

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const index = (y * width + x) * 4;
      const r = pixels[index];
      const g = pixels[index + 1];
      const b = pixels[index + 2];
      const brightness = 0.299 * r + 0.587 * g + 0.114 * b;
      asciiResult += charForBrightness(brightness);
    }
    asciiResult += '\n';
  }

  return asciiResult;
}

export function generateAsciiFromCanvas(canvas: HTMLCanvasElement, img: HTMLImageElement, width: number): string {
  const ctx = canvas.getContext('2d');
  if (!ctx) {
    throw new Error('Canvas context not available');
  }

  const height = Math.floor((img.height / img.width) * width * FONT_ASPECT_RATIO);
  canvas.width = width;
  canvas.height = height;
  ctx.drawImage(img, 0, 0, width, height);

  const imageData = ctx.getImageData(0, 0, width, height);
  return generateAsciiFromImageData(imageData, width, height);
}

export function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error('Failed to load image. Please try another file.'));
    img.src = src;
  });
}

export async function generateAscii(imageSrc: string, width: number, canvas: HTMLCanvasElement): Promise<string> {
  const img = await loadImage(imageSrc);
  return generateAsciiFromCanvas(canvas, img, width);
}

export function isValidImageFile(file: File): string | null {
  if (!file.type.startsWith('image/')) {
    return 'Please upload a valid image file';
  }
  if (file.size > MAX_FILE_SIZE) {
    return 'Image size must be less than 10MB';
  }
  return null;
}

export function readFileAsDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (event) => resolve(event.target?.result as string);
    reader.onerror = () => reject(new Error('Failed to read image file'));
    reader.readAsDataURL(file);
  });
}

export function downloadAsciiArt(asciiArt: string, fileName = 'ascii-art.txt') {
  const blob = new Blob([asciiArt], { type: 'text/plain' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = fileName;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

export function getAsciiStats(asciiArt: string) {
  const lines = asciiArt.split('\n').filter((line) => line.length > 0).length;
  return { lines, characters: asciiArt.length };
}
