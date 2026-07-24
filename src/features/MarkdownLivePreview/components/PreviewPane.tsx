import type { Ref } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { useMarkdownStore } from '../stores';

type PreviewPaneProps = {
  previewRef: Ref<HTMLElement>;
  contentRef: Ref<HTMLElement>;
  onScroll: () => void;
};

export function PreviewPane({ previewRef, contentRef, onScroll }: PreviewPaneProps) {
  const markdown = useMarkdownStore((s) => s.markdown);

  return (
    <section
      ref={previewRef}
      onScroll={onScroll}
      className="w-1/2 min-h-0 overflow-y-auto bg-muted/40 p-6"
      aria-label="Markdown preview"
    >
      <article
        ref={contentRef}
        className="prose prose-neutral dark:prose-invert max-w-none prose-headings:border-b prose-headings:border-border prose-headings:pb-2"
      >
        <ReactMarkdown remarkPlugins={[remarkGfm]}>{markdown}</ReactMarkdown>
      </article>
    </section>
  );
}
