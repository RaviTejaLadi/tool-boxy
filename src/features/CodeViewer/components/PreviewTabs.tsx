import { XIcon } from '@phosphor-icons/react';
import { cn } from '@/lib/utils';
import { findFileByPath } from '../helpers';
import { useCodeViewerStore } from '../stores';
import { FileIcon } from './FileIcon';

export function PreviewTabs() {
  const fileSystem = useCodeViewerStore((s) => s.fileSystem);
  const openTabs = useCodeViewerStore((s) => s.openTabs);
  const selectedFile = useCodeViewerStore((s) => s.selectedFile);
  const selectFile = useCodeViewerStore((s) => s.selectFile);
  const closeTab = useCodeViewerStore((s) => s.closeTab);

  if (!fileSystem || openTabs.length === 0) return null;

  return (
    <div className="flex shrink-0 items-stretch overflow-x-auto border-b border-border bg-muted/30">
      {openTabs.map((path) => {
        const file = findFileByPath(fileSystem, path);
        if (!file) return null;
        const active = selectedFile?.path === path;
        return (
          <div
            key={path}
            className={cn(
              'group flex max-w-56 shrink-0 items-center gap-1.5 border-r border-border px-2.5 py-1.5',
              active ? 'bg-background text-foreground' : 'text-muted-foreground hover:bg-background/60'
            )}
          >
            <button
              type="button"
              className="flex min-w-0 flex-1 items-center gap-1.5 text-left"
              onClick={() => selectFile(file)}
              title={path}
            >
              <FileIcon name={file.name} type="file" />
              <span className="truncate font-mono text-[11px]">{file.name}</span>
            </button>
            <button
              type="button"
              aria-label={`Close ${file.name}`}
              className={cn(
                'rounded-sm p-0.5 opacity-0 transition-opacity hover:bg-accent group-hover:opacity-100',
                active && 'opacity-70'
              )}
              onClick={(e) => {
                e.stopPropagation();
                closeTab(path);
              }}
            >
              <XIcon className="size-3" />
            </button>
          </div>
        );
      })}
    </div>
  );
}
