import { LANGUAGE_BY_EXT } from '../constants';

export type FileKind = 'text' | 'image' | 'svg' | 'audio' | 'video' | 'pdf' | 'binary';

export type FileNode = {
  name: string;
  type: 'file' | 'folder';
  path?: string;
  content?: string;
  objectUrl?: string;
  mimeType?: string;
  kind?: FileKind;
  size?: number;
  children?: FileNode[];
};

export function addPath(node: FileNode, parentPath = ''): FileNode {
  const path = parentPath ? `${parentPath}/${node.name}` : node.name;
  if (node.type === 'file') {
    return { ...node, path };
  }
  return {
    ...node,
    path,
    children: node.children?.map((child) => addPath(child, path)),
  };
}

export function findFirstFile(node: FileNode): FileNode | null {
  if (node.type === 'file') return node;
  if (!node.children) return null;
  for (const child of node.children) {
    const found = findFirstFile(child);
    if (found) return found;
  }
  return null;
}

export function findFileByPath(node: FileNode | null, path: string): FileNode | null {
  if (!node) return null;
  if (node.path === path) return node.type === 'file' ? node : null;
  if (!node.children) return null;
  for (const child of node.children) {
    const found = findFileByPath(child, path);
    if (found) return found;
  }
  return null;
}

export function countFiles(node: FileNode): number {
  if (node.type === 'file') return 1;
  return (node.children ?? []).reduce((sum, child) => sum + countFiles(child), 0);
}

export function getExtension(filename: string): string {
  const base = filename.split(/[/\\]/).pop() ?? filename;
  if (base.toLowerCase() === 'dockerfile') return 'dockerfile';
  const parts = base.split('.');
  if (parts.length < 2) return '';
  return parts.at(-1)?.toLowerCase() ?? '';
}

/** Prism language id for react-syntax-highlighter (must exist in prism languages). */
export function getLanguage(filename: string): string {
  const ext = getExtension(filename);
  return LANGUAGE_BY_EXT[ext] || 'clike';
}

export function collectObjectUrls(node: FileNode | null): string[] {
  if (!node) return [];
  if (node.type === 'file') return node.objectUrl ? [node.objectUrl] : [];
  return (node.children ?? []).flatMap(collectObjectUrls);
}

export function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

/** Filter tree by name/path query; keeps ancestor folders of matches. */
export function filterFileTree(node: FileNode, query: string): FileNode | null {
  const q = query.trim().toLowerCase();
  if (!q) return node;

  if (node.type === 'file') {
    const haystack = `${node.name} ${node.path ?? ''}`.toLowerCase();
    return haystack.includes(q) ? node : null;
  }

  const children = (node.children ?? [])
    .map((child) => filterFileTree(child, q))
    .filter((child): child is FileNode => Boolean(child));

  if (children.length === 0) {
    const haystack = `${node.name} ${node.path ?? ''}`.toLowerCase();
    return haystack.includes(q) ? { ...node, children: [] } : null;
  }

  return { ...node, children };
}
