import { useState } from 'react';
import { CaretDownIcon, CaretRightIcon } from '@phosphor-icons/react';
import { cn } from '@/lib/utils';
import type { FileNode } from '../helpers';
import { useCodeViewerStore } from '../stores';
import { FileIcon } from './FileIcon';

type FileTreeProps = {
  node: FileNode;
  level: number;
  forceOpen?: boolean;
};

export function FileTree({ node, level, forceOpen = false }: FileTreeProps) {
  const selectedFile = useCodeViewerStore((s) => s.selectedFile);
  const selectFile = useCodeViewerStore((s) => s.selectFile);
  const [isOpen, setIsOpen] = useState(level < 2 || forceOpen);
  const open = forceOpen || isOpen;

  if (node.type === 'file') {
    const isSelected = selectedFile?.path === node.path;
    return (
      <button
        type="button"
        className={cn(
          'flex w-full items-center gap-1.5 py-1 pr-2 text-left font-mono text-[12px] transition-colors hover:bg-accent/50',
          isSelected && 'bg-accent text-accent-foreground'
        )}
        style={{ paddingLeft: `${level * 14 + 8}px` }}
        onClick={() => selectFile(node)}
        title={node.path}
      >
        <FileIcon name={node.name} type="file" />
        <span className="truncate">{node.name}</span>
      </button>
    );
  }

  return (
    <div>
      <button
        type="button"
        className="flex w-full items-center gap-0.5 py-1 pr-2 text-left font-mono text-[12px] transition-colors hover:bg-accent/50"
        style={{ paddingLeft: `${level * 14 + 4}px` }}
        onClick={() => setIsOpen((value) => !value)}
      >
        {open ? (
          <CaretDownIcon className="size-3.5 shrink-0 text-muted-foreground" />
        ) : (
          <CaretRightIcon className="size-3.5 shrink-0 text-muted-foreground" />
        )}
        <FileIcon name={node.name} type="folder" open={open} className="mr-1" />
        <span className="truncate">{node.name}</span>
      </button>
      {open &&
        node.children?.map((child) => (
          <FileTree key={child.path ?? child.name} node={child} level={level + 1} forceOpen={forceOpen} />
        ))}
    </div>
  );
}
