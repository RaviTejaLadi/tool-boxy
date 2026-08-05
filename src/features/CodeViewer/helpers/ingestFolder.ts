import { MAX_ASSET_BYTES, MAX_FILES, MAX_TEXT_BYTES, SKIP_DIR_NAMES } from '../constants';
import { getFileKind } from './fileKind';
import { addPath, findFirstFile, getExtension, type FileKind, type FileNode } from './fileTree';

type MutableNode = {
  name: string;
  type: 'file' | 'folder';
  content?: string;
  objectUrl?: string;
  mimeType?: string;
  kind?: FileKind;
  size?: number;
  children?: Map<string, MutableNode>;
};

type RelativeFile = {
  file: File;
  relativePath: string;
};

type FileSystemEntryLike = {
  isFile: boolean;
  isDirectory: boolean;
  name: string;
  file: (success: (file: File) => void, error?: (err: DOMException) => void) => void;
  createReader: () => {
    readEntries: (success: (entries: FileSystemEntryLike[]) => void, error?: (err: DOMException) => void) => void;
  };
};

function shouldSkipPath(relativePath: string): boolean {
  const segments = relativePath.split(/[/\\]/).filter(Boolean);
  return segments.some((segment) => SKIP_DIR_NAMES.has(segment));
}

function ensureFolder(root: MutableNode, segments: string[]): MutableNode {
  let current = root;
  for (const segment of segments) {
    if (!current.children) current.children = new Map();
    let next = current.children.get(segment);
    if (!next) {
      next = { name: segment, type: 'folder', children: new Map() };
      current.children.set(segment, next);
    }
    current = next;
  }
  return current;
}

function toFileNode(node: MutableNode): FileNode {
  if (node.type === 'file') {
    return {
      name: node.name,
      type: 'file',
      content: node.content,
      objectUrl: node.objectUrl,
      mimeType: node.mimeType,
      kind: node.kind,
      size: node.size,
    };
  }
  const children = [...(node.children?.values() ?? [])].map(toFileNode).sort((a, b) => {
    if (a.type !== b.type) return a.type === 'folder' ? -1 : 1;
    return a.name.localeCompare(b.name);
  });
  return { name: node.name, type: 'folder', children };
}

async function buildFileNode(file: File): Promise<Omit<MutableNode, 'children'>> {
  const kind = getFileKind(file.name);
  const base = {
    name: file.name,
    type: 'file' as const,
    kind,
    size: file.size,
    mimeType: file.type || undefined,
  };

  if (kind === 'image' || kind === 'audio' || kind === 'video' || kind === 'pdf') {
    if (file.size > MAX_ASSET_BYTES) {
      return {
        ...base,
        kind: 'binary',
        content: `// Asset too large to preview (${Math.round(file.size / 1024)} KB)`,
      };
    }
    return { ...base, objectUrl: URL.createObjectURL(file) };
  }

  if (kind === 'svg') {
    const objectUrl = file.size <= MAX_ASSET_BYTES ? URL.createObjectURL(file) : undefined;
    if (file.size > MAX_TEXT_BYTES) {
      return {
        ...base,
        objectUrl,
        content: `// SVG too large to show as code (${Math.round(file.size / 1024)} KB)`,
      };
    }
    try {
      return { ...base, objectUrl, content: await file.text() };
    } catch {
      return { ...base, objectUrl, content: '// Unable to read SVG contents' };
    }
  }

  if (kind === 'binary') {
    return { ...base, content: `// Binary file (.${getExtension(file.name)}) — preview not available` };
  }

  if (file.size > MAX_TEXT_BYTES) {
    return {
      ...base,
      content: `// File too large to preview (${Math.round(file.size / 1024)} KB)\n// Max preview size is ${Math.round(
        MAX_TEXT_BYTES / 1024
      )} KB`,
    };
  }

  try {
    const text = await file.text();
    if (text.includes('\u0000')) {
      return {
        ...base,
        kind: 'binary',
        content: '// Binary file — preview not available',
      };
    }
    return { ...base, content: text };
  } catch {
    return { ...base, content: '// Unable to read file contents' };
  }
}

function readAllDirectoryEntries(reader: ReturnType<FileSystemEntryLike['createReader']>) {
  return new Promise<FileSystemEntryLike[]>((resolve, reject) => {
    const entries: FileSystemEntryLike[] = [];
    const readBatch = () => {
      reader.readEntries((batch) => {
        if (batch.length === 0) {
          resolve(entries);
          return;
        }
        entries.push(...batch);
        readBatch();
      }, reject);
    };
    readBatch();
  });
}

async function walkEntry(entry: FileSystemEntryLike, prefix: string): Promise<RelativeFile[]> {
  const relativePath = prefix ? `${prefix}/${entry.name}` : entry.name;
  if (shouldSkipPath(relativePath)) return [];

  if (entry.isFile) {
    const file = await new Promise<File>((resolve, reject) => {
      entry.file(resolve, reject);
    });
    return [{ file, relativePath }];
  }

  if (entry.isDirectory) {
    const reader = entry.createReader();
    const children = await readAllDirectoryEntries(reader);
    const nested = await Promise.all(children.map((child) => walkEntry(child, relativePath)));
    return nested.flat();
  }

  return [];
}

function asEntryLike(entry: FileSystemEntry | null): FileSystemEntryLike | null {
  return entry ? (entry as unknown as FileSystemEntryLike) : null;
}

export async function collectDroppedFiles(dataTransfer: DataTransfer | null): Promise<RelativeFile[]> {
  if (!dataTransfer) return [];

  const items = dataTransfer.items;
  if (items && items.length > 0) {
    const entries: FileSystemEntryLike[] = [];
    for (let i = 0; i < items.length; i += 1) {
      const item = items[i] as DataTransferItem & {
        webkitGetAsEntry?: () => FileSystemEntry | null;
      };
      const entry = typeof item.webkitGetAsEntry === 'function' ? asEntryLike(item.webkitGetAsEntry()) : null;
      if (entry) entries.push(entry);
    }

    if (entries.length > 0) {
      const nested = await Promise.all(entries.map((entry) => walkEntry(entry, '')));
      return nested.flat();
    }
  }

  return Array.from(dataTransfer.files).map((file) => ({
    file,
    relativePath: file.webkitRelativePath || file.name,
  }));
}

export type IngestFolderResult =
  | { fileSystem: FileNode; selectedFile: FileNode | null; fileCount: number; folderName: string }
  | { error: string };

export async function ingestRelativeFiles(entries: RelativeFile[]): Promise<IngestFolderResult> {
  if (entries.length === 0) {
    return { error: 'No files found in the selected folder' };
  }

  const usable = entries.filter(({ relativePath }) => relativePath && !shouldSkipPath(relativePath));

  if (usable.length === 0) {
    return { error: 'No readable files found (common folders like node_modules are skipped)' };
  }

  if (usable.length > MAX_FILES) {
    return { error: `Folder has too many files (max ${MAX_FILES}). Try a smaller project folder.` };
  }

  const firstRelative = usable[0].relativePath;
  const rootName = firstRelative.split(/[/\\]/)[0] || 'project';
  const root: MutableNode = { name: rootName, type: 'folder', children: new Map() };

  await Promise.all(
    usable.map(async ({ file, relativePath }) => {
      const segments = relativePath.split(/[/\\]/).filter(Boolean);
      const nested = segments[0] === rootName ? segments.slice(1) : segments;
      if (nested.length === 0) return;

      const fileName = nested.at(-1)!;
      const folderSegments = nested.slice(0, -1);
      const parent = folderSegments.length ? ensureFolder(root, folderSegments) : root;
      if (!parent.children) parent.children = new Map();

      const built = await buildFileNode(file);
      parent.children.set(fileName, built);
    })
  );

  const fileSystem = addPath(toFileNode(root));
  return {
    fileSystem,
    selectedFile: findFirstFile(fileSystem),
    fileCount: usable.length,
    folderName: rootName,
  };
}

export async function ingestFolder(files: FileList | File[] | null): Promise<IngestFolderResult> {
  const list = files ? Array.from(files) : [];
  return ingestRelativeFiles(
    list.map((file) => ({
      file,
      relativePath: file.webkitRelativePath || file.name,
    }))
  );
}

export async function ingestDataTransfer(dataTransfer: DataTransfer | null): Promise<IngestFolderResult> {
  const entries = await collectDroppedFiles(dataTransfer);
  return ingestRelativeFiles(entries);
}
