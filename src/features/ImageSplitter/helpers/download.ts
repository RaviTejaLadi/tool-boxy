import JSZip from 'jszip';
import type { Tile } from '../stores';

function triggerDownload(blob: Blob, fileName: string): void {
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = fileName;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}

export function downloadTile(tile: Tile): void {
  triggerDownload(tile.blob, tile.name);
}

export async function downloadAllTiles(tiles: Tile[]): Promise<void> {
  if (tiles.length === 0) return;

  if (tiles.length === 1) {
    downloadTile(tiles[0]);
    return;
  }

  const zip = new JSZip();
  const usedNames = new Set<string>();

  for (const tile of tiles) {
    let name = tile.name;
    let i = 1;
    while (usedNames.has(name)) {
      const base = tile.name.replace(/(\.[^.]+)$/, '');
      const ext = tile.name.match(/(\.[^.]+)$/)?.[1] ?? '';
      name = `${base}-${i}${ext}`;
      i += 1;
    }
    usedNames.add(name);
    zip.file(name, tile.blob);
  }

  const blob = await zip.generateAsync({ type: 'blob' });
  triggerDownload(blob, 'image-tiles.zip');
}
