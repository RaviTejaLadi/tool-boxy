import { type CSSProperties, type ReactNode, type Ref } from 'react';
import { createElement as createHighlightElement, Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import {
  EDITOR_FONT_SIZE,
  EDITOR_GUTTER_BG,
  EDITOR_LINE_HEIGHT,
  MAX_HIGHLIGHT_LENGTH,
} from './constants';
import { useSyntaxTheme } from './useSyntaxTheme';

type EditorCodeHighlightProps = {
  code: string;
  language: string;
  wordWrap: boolean;
  gutterWidth: string;
  layerRef: Ref<HTMLDivElement>;
  lineKeyPrefix?: string;
};

const HIGHLIGHTER_STYLE = {
  margin: 0,
  padding: 0,
  background: 'transparent',
  fontFamily: 'inherit',
  fontSize: 'inherit',
  lineHeight: 'inherit',
  overflow: 'visible',
  textShadow: 'none',
} as const;

const CODE_TAG_STYLE = {
  fontFamily: 'inherit',
  fontSize: 'inherit',
  lineHeight: 'inherit',
  textShadow: 'none',
  background: 'transparent',
} as const;

export function EditorCodeHighlight({
  code,
  language,
  wordWrap,
  gutterWidth,
  layerRef,
  lineKeyPrefix = 'line',
}: EditorCodeHighlightProps) {
  'use no memo';

  const { style } = useSyntaxTheme();
  const safeCode = code ?? '';
  const isHighlighted = safeCode.length <= MAX_HIGHLIGHT_LENGTH;
  const totalLines = Math.max(safeCode.split('\n').length, 1);

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

  const renderHighlightedLines = ({
    rows,
    stylesheet,
    useInlineStyles,
  }: {
    rows: readonly unknown[];
    stylesheet: Record<string, CSSProperties>;
    useInlineStyles: boolean;
  }) =>
    Array.from({ length: Math.max(rows.length, totalLines) }, (_, index) => {
      const row = rows[index];
      return renderLine(
        index + 1,
        row
          ? createHighlightElement({
              node: row as Parameters<typeof createHighlightElement>[0]['node'],
              stylesheet,
              useInlineStyles,
              key: `${lineKeyPrefix}-${index}`,
            })
          : null
      );
    });

  return (
    <div
      ref={layerRef}
      aria-hidden
      className="pointer-events-none absolute inset-0 overflow-hidden py-3 font-mono"
      style={{ fontSize: EDITOR_FONT_SIZE, lineHeight: `${EDITOR_LINE_HEIGHT}px`, tabSize: 2 }}
    >
      {isHighlighted ? (
        <SyntaxHighlighter
          language={language}
          style={style}
          PreTag="div"
          CodeTag="div"
          customStyle={HIGHLIGHTER_STYLE}
          codeTagProps={{ style: CODE_TAG_STYLE }}
          renderer={renderHighlightedLines}
        >
          {safeCode}
        </SyntaxHighlighter>
      ) : (
        safeCode.split('\n').map((line, index) => renderLine(index + 1, line))
      )}
    </div>
  );
}
