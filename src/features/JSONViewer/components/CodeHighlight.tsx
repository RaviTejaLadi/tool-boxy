import { type CSSProperties, type ReactNode, type Ref } from 'react';
import { Prism as SyntaxHighlighter, createElement } from 'react-syntax-highlighter';
import { atomDark, prism } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { useTheme } from '@/components/theme/theme-provider';
import { EDITOR_FONT_SIZE, EDITOR_GUTTER_BG, EDITOR_LINE_HEIGHT, MAX_HIGHLIGHT_LENGTH } from '../constants';

type CodeHighlightProps = {
  code: string;
  wordWrap: boolean;
  gutterWidth: string;
  layerRef: Ref<HTMLDivElement>;
};

export function CodeHighlight({ code, wordWrap, gutterWidth, layerRef }: CodeHighlightProps) {
  const { resolvedTheme } = useTheme();
  const isHighlighted = code.length <= MAX_HIGHLIGHT_LENGTH;
  const totalLines = Math.max(code.split('\n').length, 1);

  const numberStyle: CSSProperties = {
    width: gutterWidth,
    background: EDITOR_GUTTER_BG,
    borderRight: '1px solid var(--border)',
  };

  const contentStyle: CSSProperties = wordWrap
    ? { flex: '1 1 0%', minWidth: 0, whiteSpace: 'pre-wrap', overflowWrap: 'break-word' }
    : { flex: '0 0 auto', whiteSpace: 'pre' };

  const renderLine = (lineNumber: number, content: ReactNode) => (
    <div
      key={lineNumber}
      className={wordWrap ? 'flex' : 'flex w-max min-w-full'}
      style={{ minHeight: EDITOR_LINE_HEIGHT }}
    >
      <span
        className="sticky left-0 z-10 shrink-0 pr-3 text-right text-muted-foreground select-none"
        style={numberStyle}
      >
        {lineNumber}
      </span>
      <span className="px-4" style={contentStyle}>
        {content}
      </span>
    </div>
  );

  return (
    <div
      ref={layerRef}
      aria-hidden
      className="pointer-events-none absolute inset-0 overflow-hidden py-3 font-mono"
      style={{ fontSize: EDITOR_FONT_SIZE, lineHeight: `${EDITOR_LINE_HEIGHT}px`, tabSize: 2 }}
    >
      {isHighlighted ? (
        <SyntaxHighlighter
          language="json"
          style={resolvedTheme === 'dark' ? atomDark : prism}
          PreTag="div"
          CodeTag="div"
          customStyle={{
            margin: 0,
            padding: 0,
            background: 'transparent',
            fontFamily: 'inherit',
            fontSize: 'inherit',
            lineHeight: 'inherit',
            overflow: 'visible',
            textShadow: 'none',
          }}
          codeTagProps={{
            style: { fontFamily: 'inherit', fontSize: 'inherit', lineHeight: 'inherit', textShadow: 'none' },
          }}
          renderer={({ rows, stylesheet, useInlineStyles }) =>
            Array.from({ length: Math.max(rows.length, totalLines) }, (_, index) => {
              const row = rows[index];
              return renderLine(
                index + 1,
                row ? createElement({ node: row, stylesheet, useInlineStyles, key: `json-line-${index}` }) : null
              );
            })
          }
        >
          {code}
        </SyntaxHighlighter>
      ) : (
        code.split('\n').map((line, index) => renderLine(index + 1, line))
      )}
    </div>
  );
}
