import { useRef } from 'react';
import { cn } from '@/lib/utils';
import { MarkdownLivePreviewHeader, EditorPane, PreviewPane } from './components';
import { createScrollSync, exportPreviewPdf } from './helpers';

export interface MarkdownLivePreviewProps {
  className?: string;
}

export default function MarkdownLivePreview({ className }: MarkdownLivePreviewProps) {
  const editorRef = useRef<HTMLTextAreaElement>(null);
  const previewRef = useRef<HTMLElement>(null);
  const previewContentRef = useRef<HTMLElement>(null);
  const syncFrom = useRef(createScrollSync()).current;

  const handleExportPdf = () => {
    exportPreviewPdf(previewContentRef.current);
  };

  return (
    <div className={cn('flex h-full min-h-0 w-full flex-col bg-background text-foreground', className)}>
      <MarkdownLivePreviewHeader onExportPdf={handleExportPdf} />

      <div className="flex min-h-0 flex-1 overflow-hidden">
        <EditorPane
          editorRef={editorRef}
          onScroll={() => {
            if (editorRef.current) syncFrom(editorRef.current, previewRef.current);
          }}
        />
        <PreviewPane
          previewRef={previewRef}
          contentRef={previewContentRef}
          onScroll={() => {
            if (previewRef.current) syncFrom(previewRef.current, editorRef.current);
          }}
        />
      </div>
    </div>
  );
}
