import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { ScrollArea } from '@/components/ui/scroll-area';
import type { FileNode } from '../helpers';

export function MarkdownPreview({ file }: { file: FileNode }) {
  return (
    <ScrollArea className="h-0 min-h-0 flex-1">
      <article className="prose prose-sm dark:prose-invert max-w-none p-6 lg:p-8">
        <ReactMarkdown remarkPlugins={[remarkGfm]}>{file.content ?? ''}</ReactMarkdown>
      </article>
    </ScrollArea>
  );
}
