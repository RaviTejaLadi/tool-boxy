function dataUrlToBytes(dataUrl: string): Uint8Array {
  const base64 = dataUrl.split(',')[1] ?? '';
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes;
}

/** Build a multi-resolution ICO from PNG buffers (PNG-compressed ICONIMAGE). */
export function createIcoFromPngDataUrls(pngDataUrls: { size: number; dataUrl: string }[]): Uint8Array {
  const images = pngDataUrls.map(({ size, dataUrl }) => ({
    size,
    data: dataUrlToBytes(dataUrl),
  }));

  const count = images.length;
  const headerSize = 6;
  const entrySize = 16;
  const dataOffset = headerSize + entrySize * count;
  const totalSize = dataOffset + images.reduce((sum, img) => sum + img.data.length, 0);

  const buffer = new Uint8Array(totalSize);
  const view = new DataView(buffer.buffer);

  view.setUint16(0, 0, true);
  view.setUint16(2, 1, true);
  view.setUint16(4, count, true);

  let offset = dataOffset;
  images.forEach((img, index) => {
    const entryOffset = headerSize + index * entrySize;
    const dim = img.size >= 256 ? 0 : img.size;
    view.setUint8(entryOffset, dim);
    view.setUint8(entryOffset + 1, dim);
    view.setUint8(entryOffset + 2, 0);
    view.setUint8(entryOffset + 3, 0);
    view.setUint16(entryOffset + 4, 1, true);
    view.setUint16(entryOffset + 6, 32, true);
    view.setUint32(entryOffset + 8, img.data.length, true);
    view.setUint32(entryOffset + 12, offset, true);
    buffer.set(img.data, offset);
    offset += img.data.length;
  });

  return buffer;
}
