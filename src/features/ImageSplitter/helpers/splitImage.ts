import type { SourceImage, Tile } from '../stores';

function dataUrlToBlob(dataUrl: string): Blob {
  const [header, data] = dataUrl.split(',');
  const mime = header.match(/:(.*?);/)?.[1] ?? 'image/png';
  const binary = atob(data);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
  return new Blob([bytes], { type: mime });
}

export async function splitImage(source: SourceImage, columns: number, rows: number): Promise<Tile[]> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      const tileWidth = img.width / columns;
      const tileHeight = img.height / rows;
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');

      if (!ctx) {
        reject(new Error('Canvas not supported'));
        return;
      }

      const tiles: Tile[] = [];
      let id = 0;

      for (let row = 0; row < rows; row++) {
        for (let col = 0; col < columns; col++) {
          canvas.width = Math.max(1, Math.round(tileWidth));
          canvas.height = Math.max(1, Math.round(tileHeight));

          ctx.clearRect(0, 0, canvas.width, canvas.height);
          ctx.drawImage(
            img,
            col * tileWidth,
            row * tileHeight,
            tileWidth,
            tileHeight,
            0,
            0,
            canvas.width,
            canvas.height
          );

          const dataUrl = canvas.toDataURL('image/png');
          const blob = dataUrlToBlob(dataUrl);
          const base = source.name.replace(/\.[^.]+$/, '') || 'image';

          tiles.push({
            id: id++,
            dataUrl,
            blob,
            name: `${base}-r${row + 1}-c${col + 1}.png`,
            row,
            col,
            width: canvas.width,
            height: canvas.height,
          });
        }
      }

      resolve(tiles);
    };

    img.onerror = () => reject(new Error('Failed to load image'));
    img.src = source.dataUrl;
  });
}
