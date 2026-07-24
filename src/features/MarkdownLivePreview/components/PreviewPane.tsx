import { useMemo, useRef, type Ref } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import { useTheme } from '@/components/theme/theme-provider';
import { buildMarkdownComponents } from './buildMarkdownComponents';
import { useMarkdownStore } from '../stores';
import '../markdownPreview.css';

type PreviewPaneProps = {
  previewRef: Ref<HTMLElement>;
  contentRef: Ref<HTMLElement>;
  onScroll: () => void;
};

export function PreviewPane({ previewRef, contentRef, onScroll }: PreviewPaneProps) {
  const markdown = useMarkdownStore((s) => s.markdown);
  const copiedCodeKey = useMarkdownStore((s) => s.copiedCodeKey);
  const copyCode = useMarkdownStore((s) => s.copyCode);
  const { resolvedTheme } = useTheme();
  const scrollRootRef = useRef<HTMLElement | null>(null);

  const setPreviewRef = (node: HTMLElement | null) => {
    scrollRootRef.current = node;
    if (typeof previewRef === 'function') {
      previewRef(node);
    } else if (previewRef) {
      previewRef.current = node;
    }
  };

  const components = useMemo(
    () =>
      buildMarkdownComponents({
        idPrefix: 'md-preview-',
        isDarkTheme: resolvedTheme === 'dark',
        copiedKey: copiedCodeKey,
        handleCopy: (key, text) => {
          void copyCode(key, text);
        },
        scrollToId: (id) => {
          const root = scrollRootRef.current;
          const target = root?.querySelector<HTMLElement>(`#${CSS.escape(id)}`);
          target?.scrollIntoView({ behavior: 'smooth', block: 'start' });
        },
      }),
    [copiedCodeKey, copyCode, resolvedTheme]
  );

  return (
    <section
      ref={setPreviewRef}
      onScroll={onScroll}
      className="w-1/2 min-h-0 overflow-y-auto bg-muted/40 p-6"
      aria-label="Markdown preview"
    >
      <article ref={contentRef} className="markdown-preview mx-auto max-w-3xl">
        <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeRaw]} components={components}>
          {markdown}
        </ReactMarkdown>
      </article>
    </section>
  );
}
