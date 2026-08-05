import { AUDIO_EXTENSIONS, BINARY_EXTENSIONS, IMAGE_EXTENSIONS, VIDEO_EXTENSIONS } from '../constants';
import { getExtension, type FileKind } from './fileTree';

export function getFileKind(filename: string): FileKind {
  const ext = getExtension(filename);
  if (ext === 'svg') return 'svg';
  if (ext === 'pdf') return 'pdf';
  if (IMAGE_EXTENSIONS.has(ext)) return 'image';
  if (AUDIO_EXTENSIONS.has(ext)) return 'audio';
  if (VIDEO_EXTENSIONS.has(ext)) return 'video';
  if (BINARY_EXTENSIONS.has(ext)) return 'binary';
  return 'text';
}

export function isAssetKind(kind: FileKind | undefined): boolean {
  return kind === 'image' || kind === 'svg' || kind === 'audio' || kind === 'video' || kind === 'pdf';
}
