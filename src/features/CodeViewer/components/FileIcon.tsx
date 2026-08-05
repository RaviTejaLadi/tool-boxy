import {
  FileArchiveIcon,
  FileAudioIcon,
  FileCodeIcon,
  FileCppIcon,
  FileCssIcon,
  FileCsvIcon,
  FileHtmlIcon,
  FileImageIcon,
  FileJpgIcon,
  FileJsIcon,
  FileJsxIcon,
  FileMdIcon,
  FilePdfIcon,
  FilePngIcon,
  FilePyIcon,
  FileRsIcon,
  FileSqlIcon,
  FileSvgIcon,
  FileTextIcon,
  FileTsIcon,
  FileTsxIcon,
  FileTxtIcon,
  FileVideoIcon,
  FileVueIcon,
  FileZipIcon,
  FolderIcon,
  FolderOpenIcon,
} from '@phosphor-icons/react';
import { cn } from '@/lib/utils';
import { getExtension } from '../helpers';

type FileIconProps = {
  name: string;
  type: 'file' | 'folder';
  open?: boolean;
  className?: string;
};

type IconSpec = {
  Icon: typeof FileTextIcon;
  className: string;
};

const BY_NAME: Record<string, IconSpec> = {
  'package.json': { Icon: FileCodeIcon, className: 'text-emerald-600 dark:text-emerald-400' },
  'tsconfig.json': { Icon: FileTsIcon, className: 'text-sky-600 dark:text-sky-400' },
  'readme.md': { Icon: FileMdIcon, className: 'text-blue-600 dark:text-blue-400' },
  dockerfile: { Icon: FileCodeIcon, className: 'text-sky-500' },
  '.gitignore': { Icon: FileTxtIcon, className: 'text-orange-500' },
  '.env': { Icon: FileTxtIcon, className: 'text-amber-500' },
};

const BY_EXT: Record<string, IconSpec> = {
  ts: { Icon: FileTsIcon, className: 'text-sky-600 dark:text-sky-400' },
  tsx: { Icon: FileTsxIcon, className: 'text-sky-500 dark:text-sky-300' },
  js: { Icon: FileJsIcon, className: 'text-yellow-500' },
  jsx: { Icon: FileJsxIcon, className: 'text-yellow-400' },
  mjs: { Icon: FileJsIcon, className: 'text-yellow-500' },
  cjs: { Icon: FileJsIcon, className: 'text-yellow-500' },
  json: { Icon: FileCodeIcon, className: 'text-amber-500' },
  css: { Icon: FileCssIcon, className: 'text-blue-500' },
  scss: { Icon: FileCssIcon, className: 'text-pink-500' },
  less: { Icon: FileCssIcon, className: 'text-indigo-400' },
  html: { Icon: FileHtmlIcon, className: 'text-orange-500' },
  htm: { Icon: FileHtmlIcon, className: 'text-orange-500' },
  md: { Icon: FileMdIcon, className: 'text-blue-600 dark:text-blue-400' },
  mdx: { Icon: FileMdIcon, className: 'text-blue-500' },
  py: { Icon: FilePyIcon, className: 'text-yellow-600 dark:text-yellow-400' },
  rs: { Icon: FileRsIcon, className: 'text-orange-600' },
  sql: { Icon: FileSqlIcon, className: 'text-cyan-600 dark:text-cyan-400' },
  vue: { Icon: FileVueIcon, className: 'text-emerald-500' },
  svg: { Icon: FileSvgIcon, className: 'text-orange-400' },
  png: { Icon: FilePngIcon, className: 'text-purple-500' },
  jpg: { Icon: FileJpgIcon, className: 'text-purple-500' },
  jpeg: { Icon: FileJpgIcon, className: 'text-purple-500' },
  gif: { Icon: FileImageIcon, className: 'text-purple-400' },
  webp: { Icon: FileImageIcon, className: 'text-purple-400' },
  ico: { Icon: FileImageIcon, className: 'text-purple-400' },
  bmp: { Icon: FileImageIcon, className: 'text-purple-400' },
  avif: { Icon: FileImageIcon, className: 'text-purple-400' },
  pdf: { Icon: FilePdfIcon, className: 'text-red-500' },
  mp3: { Icon: FileAudioIcon, className: 'text-fuchsia-500' },
  wav: { Icon: FileAudioIcon, className: 'text-fuchsia-500' },
  ogg: { Icon: FileAudioIcon, className: 'text-fuchsia-500' },
  mp4: { Icon: FileVideoIcon, className: 'text-rose-500' },
  webm: { Icon: FileVideoIcon, className: 'text-rose-500' },
  mov: { Icon: FileVideoIcon, className: 'text-rose-500' },
  zip: { Icon: FileZipIcon, className: 'text-amber-600' },
  gz: { Icon: FileArchiveIcon, className: 'text-amber-600' },
  tar: { Icon: FileArchiveIcon, className: 'text-amber-600' },
  '7z': { Icon: FileArchiveIcon, className: 'text-amber-600' },
  rar: { Icon: FileArchiveIcon, className: 'text-amber-600' },
  csv: { Icon: FileCsvIcon, className: 'text-emerald-600' },
  txt: { Icon: FileTxtIcon, className: 'text-muted-foreground' },
  cpp: { Icon: FileCppIcon, className: 'text-blue-500' },
  hpp: { Icon: FileCppIcon, className: 'text-blue-500' },
  c: { Icon: FileCodeIcon, className: 'text-blue-600' },
  h: { Icon: FileCodeIcon, className: 'text-blue-600' },
  go: { Icon: FileCodeIcon, className: 'text-cyan-500' },
  java: { Icon: FileCodeIcon, className: 'text-red-400' },
  php: { Icon: FileCodeIcon, className: 'text-violet-500' },
  rb: { Icon: FileCodeIcon, className: 'text-red-500' },
  sh: { Icon: FileCodeIcon, className: 'text-green-600' },
  bash: { Icon: FileCodeIcon, className: 'text-green-600' },
  yml: { Icon: FileCodeIcon, className: 'text-rose-400' },
  yaml: { Icon: FileCodeIcon, className: 'text-rose-400' },
  xml: { Icon: FileCodeIcon, className: 'text-orange-400' },
  toml: { Icon: FileCodeIcon, className: 'text-slate-500' },
};

const DEFAULT_FILE: IconSpec = { Icon: FileTextIcon, className: 'text-muted-foreground' };

export function FileIcon({ name, type, open = false, className }: FileIconProps) {
  if (type === 'folder') {
    const Icon = open ? FolderOpenIcon : FolderIcon;
    return <Icon className={cn('size-3.5 shrink-0 text-amber-500', className)} weight="fill" />;
  }

  const byName = BY_NAME[name.toLowerCase()];
  const byExt = BY_EXT[getExtension(name)];
  const { Icon, className: colorClass } = byName ?? byExt ?? DEFAULT_FILE;

  return <Icon className={cn('size-3.5 shrink-0', colorClass, className)} weight="duotone" />;
}
