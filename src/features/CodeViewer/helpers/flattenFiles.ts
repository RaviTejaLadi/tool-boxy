import type { FileNode } from './fileTree';

export function flattenFiles(node: FileNode | null): FileNode[] {
  if (!node) return [];
  if (node.type === 'file') return [node];
  return (node.children ?? []).flatMap(flattenFiles);
}

export function flattenTextFiles(node: FileNode | null): FileNode[] {
  return flattenFiles(node).filter(
    (file) => (file.kind === 'text' || file.kind === 'svg') && typeof file.content === 'string'
  );
}
