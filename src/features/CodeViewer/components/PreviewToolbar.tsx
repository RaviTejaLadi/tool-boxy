import { useState } from 'react';
import { ArticleIcon, CheckIcon, CodeIcon, CopyIcon, ImageIcon } from '@phosphor-icons/react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { formatBytes, getLanguage, type FileNode } from '../helpers';
import { useCodeViewerStore } from '../stores';
import { FileIcon } from './FileIcon';

function isMarkdown(name: string) {
  return /\.(md|mdx)$/i.test(name);
}

export function PreviewToolbar({ file }: { file: FileNode }) {
  const svgViewMode = useCodeViewerStore((s) => s.svgViewMode);
  const setSvgViewMode = useCodeViewerStore((s) => s.setSvgViewMode);
  const mdPreview = useCodeViewerStore((s) => s.mdPreview);
  const setMdPreview = useCodeViewerStore((s) => s.setMdPreview);
  const highlightLine = useCodeViewerStore((s) => s.highlightLine);
  const [copied, setCopied] = useState(false);

  const canCopy = Boolean(file.content) && (file.kind === 'text' || file.kind === 'svg' || file.kind === 'binary');

  const copyContent = async () => {
    if (!file.content) return;
    try {
      await navigator.clipboard.writeText(file.content);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1500);
    } catch {
      // clipboard may be unavailable
    }
  };

  return (
    <div className="flex shrink-0 items-center gap-2 border-b border-border bg-card/70 px-3 py-2">
      <FileIcon name={file.name} type="file" />
      <div className="min-w-0 flex-1">
        <div className="truncate font-mono text-[12px] text-foreground">{file.path}</div>
        <div className="mt-0.5 font-mono text-[10px] text-muted-foreground">
          {file.kind ?? 'text'}
          {file.kind === 'text' || (file.kind === 'svg' && svgViewMode === 'code')
            ? ` · ${getLanguage(file.name)}`
            : ''}
          {typeof file.size === 'number' ? ` · ${formatBytes(file.size)}` : ''}
          {highlightLine ? ` · L${highlightLine}` : ''}
        </div>
      </div>

      {isMarkdown(file.name) && (
        <ToggleGroup
          value={[mdPreview ? 'preview' : 'code']}
          onValueChange={(value) => {
            const next = value[0];
            if (next === 'preview' || next === 'code') setMdPreview(next === 'preview');
          }}
          variant="outline"
          size="sm"
          spacing={0}
        >
          <ToggleGroupItem value="preview" className="rounded-none px-2" aria-label="Preview markdown">
            <ArticleIcon className="size-3.5" />
          </ToggleGroupItem>
          <ToggleGroupItem value="code" className="rounded-none px-2" aria-label="Markdown source">
            <CodeIcon className="size-3.5" />
          </ToggleGroupItem>
        </ToggleGroup>
      )}

      {file.kind === 'svg' && (
        <ToggleGroup
          value={[svgViewMode]}
          onValueChange={(value) => {
            const next = value[0];
            if (next === 'preview' || next === 'code') setSvgViewMode(next);
          }}
          variant="outline"
          size="sm"
          spacing={0}
        >
          <ToggleGroupItem value="preview" className="rounded-none px-2" aria-label="Preview SVG">
            <ImageIcon className="size-3.5" />
          </ToggleGroupItem>
          <ToggleGroupItem value="code" className="rounded-none px-2" aria-label="SVG source">
            <CodeIcon className="size-3.5" />
          </ToggleGroupItem>
        </ToggleGroup>
      )}

      <Badge variant="outline" className="hidden rounded-none font-mono text-[10px] sm:inline-flex">
        {file.kind === 'text' || (file.kind === 'svg' && svgViewMode === 'code') ? getLanguage(file.name) : file.kind}
      </Badge>

      <Button variant="outline" size="sm" onClick={copyContent} disabled={!canCopy}>
        {copied ? <CheckIcon data-icon="inline-start" /> : <CopyIcon data-icon="inline-start" />}
        {copied ? 'Copied' : 'Copy'}
      </Button>
    </div>
  );
}
