import { FileIcon as PhosphorFileIcon } from '@phosphor-icons/react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { formatBytes, type FileNode } from '../helpers';
import { useCodeViewerStore } from '../stores';
import { CodePreview } from './CodePreview';

export function AssetPreview({ file }: { file: FileNode }) {
  const svgViewMode = useCodeViewerStore((s) => s.svgViewMode);

  if (file.kind === 'svg' && svgViewMode === 'code') {
    return <CodePreview file={file} />;
  }

  if (file.kind === 'image' || file.kind === 'svg') {
    const src =
      file.objectUrl ||
      (file.kind === 'svg' && file.content
        ? `data:image/svg+xml;charset=utf-8,${encodeURIComponent(file.content)}`
        : null);

    if (src) {
      return (
        <ScrollArea className="h-0 min-h-0 flex-1">
          <div
            className="flex min-h-full items-center justify-center p-8"
            style={{
              backgroundImage:
                'repeating-conic-gradient(color-mix(in oklab, var(--muted-foreground) 18%, transparent) 0% 25%, transparent 0% 50%)',
              backgroundSize: '16px 16px',
            }}
          >
            <img
              src={src}
              alt={file.name}
              className="max-h-[70vh] max-w-full border border-border bg-background object-contain shadow-sm"
            />
          </div>
        </ScrollArea>
      );
    }
  }

  if (file.kind === 'audio' && file.objectUrl) {
    return (
      <div className="m-auto flex w-full max-w-lg flex-col items-center gap-4 px-6 py-16">
        <p className="font-mono text-[12px] text-muted-foreground">{file.name}</p>
        <audio controls src={file.objectUrl} className="w-full" />
      </div>
    );
  }

  if (file.kind === 'video' && file.objectUrl) {
    return (
      <ScrollArea className="h-0 min-h-0 flex-1">
        <div className="flex min-h-full items-center justify-center p-6">
          <video controls src={file.objectUrl} className="max-h-[70vh] max-w-full border border-border bg-black" />
        </div>
      </ScrollArea>
    );
  }

  if (file.kind === 'pdf' && file.objectUrl) {
    return (
      <iframe title={file.name} src={file.objectUrl} className="h-0 min-h-0 w-full flex-1 border-0 bg-background" />
    );
  }

  return (
    <div className="m-auto flex w-full max-w-md flex-col items-center gap-3 border border-dashed border-border bg-background/60 px-6 py-16 text-center">
      <div className="flex size-12 items-center justify-center bg-muted text-muted-foreground">
        <PhosphorFileIcon className="size-5" />
      </div>
      <div>
        <p className="font-heading text-sm font-semibold">Preview not available</p>
        <p className="mt-1 font-mono text-[11px] text-muted-foreground">
          {file.name}
          {typeof file.size === 'number' ? ` · ${formatBytes(file.size)}` : ''}
        </p>
      </div>
    </div>
  );
}
