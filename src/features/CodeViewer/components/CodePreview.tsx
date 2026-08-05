import { useEffect } from 'react';
import { SyntaxHighlight } from '@/components/SyntaxHighlight';
import { ScrollArea } from '@/components/ui/scroll-area';
import { getLanguage, type FileNode } from '../helpers';
import { useCodeViewerStore } from '../stores';

export function CodePreview({ file }: { file: FileNode }) {
  const wordWrap = useCodeViewerStore((s) => s.wordWrap);
  const showLineNumbers = useCodeViewerStore((s) => s.showLineNumbers);
  const fontSize = useCodeViewerStore((s) => s.fontSize);
  const highlightLine = useCodeViewerStore((s) => s.highlightLine);
  const code = file.content ?? '';
  const language = getLanguage(file.name);

  useEffect(() => {
    if (!highlightLine) return;
    const id = `cv-line-${highlightLine}`;
    const timer = window.setTimeout(() => {
      document.getElementById(id)?.scrollIntoView({ block: 'center', behavior: 'smooth' });
    }, 60);
    return () => window.clearTimeout(timer);
  }, [highlightLine, file.path]);

  return (
    <ScrollArea className="h-0 min-h-0 flex-1">
      <div className="min-w-full">
        <SyntaxHighlight
          key={`${file.path}:${language}:${showLineNumbers}:${wordWrap}`}
          code={code.length > 0 ? code : ' '}
          language={language}
          showLineNumbers={showLineNumbers}
          wrap={wordWrap}
          className="overflow-x-auto bg-background font-mono text-foreground"
          customStyle={{
            margin: 0,
            padding: showLineNumbers ? '1rem 0' : '1rem 1.25rem',
            fontSize,
            lineHeight: 1.65,
            background: 'transparent',
            whiteSpace: wordWrap ? 'pre-wrap' : 'pre',
          }}
          lineNumberStyle={{
            minWidth: '3rem',
            paddingRight: '1rem',
            paddingLeft: '0.75rem',
            marginRight: '1rem',
            borderRight: '1px solid var(--border)',
            color: 'var(--muted-foreground)',
            background: 'transparent',
          }}
          lineProps={(lineNumber: number) => ({
            id: `cv-line-${lineNumber}`,
            style:
              highlightLine === lineNumber
                ? {
                    background: 'color-mix(in oklab, var(--primary) 18%, transparent)',
                    display: 'block',
                    width: '100%',
                  }
                : { display: 'block', width: '100%' },
          })}
        />
      </div>
    </ScrollArea>
  );
}
