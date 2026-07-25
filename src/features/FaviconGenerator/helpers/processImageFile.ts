import { generateFavicons, isValidImageFile, readFileAsDataUrl } from './generateFavicons';
import type { GeneratedFavicon } from '../stores';

export async function processImageFile(file: File | null | undefined): Promise<{
  image: string;
  fileName: string;
  favicons: GeneratedFavicon[];
} | null> {
  if (!file || !isValidImageFile(file)) return null;

  const image = await readFileAsDataUrl(file);
  const favicons = await generateFavicons(image);
  return {
    image,
    fileName: file.name || `pasted-image-${Date.now()}`,
    favicons,
  };
}
