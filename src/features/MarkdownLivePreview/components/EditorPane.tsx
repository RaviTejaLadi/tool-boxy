import type { Ref } from 'react';
import { Textarea } from '@/components/ui/textarea';
import { useMarkdownStore } from '../stores';

type EditorPaneProps = {
  editorRef: Ref<HTMLTextAreaElement>;
  onScroll: () => void;
};

export function EditorPane({ editorRef, onScroll }: EditorPaneProps) {
  const markdown = useMarkdownStore((s) => s.markdown);
  const setMarkdown = useMarkdownStore((s) => s.setMarkdown);

  return (
    <section className="flex w-1/2 min-h-0 flex-col border-r border-border">
      <Textarea
        ref={editorRef}
        value={markdown}
        onChange={(e) => setMarkdown(e.target.value)}
        onScroll={onScroll}
        className="field-sizing-fixed h-full min-h-0 flex-1 resize-none overflow-y-auto rounded-none border-none bg-background p-4 font-mono text-sm leading-relaxed focus-visible:ring-0"
        placeholder="Type your markdown here..."
        aria-label="Markdown editor"
      />
    </section>
  );
}
