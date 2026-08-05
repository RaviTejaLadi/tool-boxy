import { FolderIcon } from '@phosphor-icons/react';
import { filterFileTree } from '../helpers';
import { useCodeViewerStore } from '../stores';
import { FileTree } from './FileTree';
import { SectionHeading } from './SectionHeading';

export function ExplorerSection() {
  const fileSystem = useCodeViewerStore((s) => s.fileSystem);
  const searchQuery = useCodeViewerStore((s) => s.searchQuery);
  const filtered = fileSystem ? filterFileTree(fileSystem, searchQuery) : null;

  return (
    <section>
      <SectionHeading className="mb-3 flex items-center gap-1.5">
        <FolderIcon className="size-3" weight="bold" />
        Explorer
      </SectionHeading>
      {filtered ? (
        <div className="max-h-[40vh] overflow-auto border border-border bg-muted/30 py-1 lg:max-h-[50vh]">
          <FileTree node={filtered} level={0} forceOpen={Boolean(searchQuery.trim())} />
        </div>
      ) : fileSystem ? (
        <p className="font-mono text-[11px] text-muted-foreground">No files match “{searchQuery}”</p>
      ) : (
        <p className="font-mono text-[11px] text-muted-foreground">Upload a folder to browse files</p>
      )}
    </section>
  );
}
