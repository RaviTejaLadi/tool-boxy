import { type ComponentProps, type CSSProperties } from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { cn } from '@/lib/utils';
import { MAX_HIGHLIGHT_LENGTH } from './constants';
import { type SyntaxThemeVariant, useSyntaxTheme } from './useSyntaxTheme';
import './SyntaxHighlight.css';

function buildCodeTagStyle(themeVariant: SyntaxThemeVariant, override?: CSSProperties): CSSProperties {
  return {
    background: 'transparent',
    fontFamily: 'inherit',
    fontSize: 'inherit',
    lineHeight: 'inherit',
    textShadow: 'none',
    padding: 0,
    margin: 0,
    ...(themeVariant === 'panel'
      ? {
          display: 'block',
          whiteSpace: 'pre-wrap',
          overflowWrap: 'anywhere',
        }
      : {}),
    ...override,
  };
}

function buildPreStyle(themeVariant: SyntaxThemeVariant, override?: CSSProperties): CSSProperties {
  return {
    margin: 0,
    padding: 0,
    background: 'transparent',
    fontFamily: 'inherit',
    fontSize: 'inherit',
    lineHeight: 'inherit',
    overflow: 'visible',
    textShadow: 'none',
    ...(themeVariant === 'panel'
      ? {
          padding: '1.25rem 1.5rem',
          fontSize: '13px',
          lineHeight: 1.7,
          minHeight: '100%',
          whiteSpace: 'pre-wrap',
          overflowWrap: 'anywhere',
        }
      : {}),
    ...override,
  };
}

export type SyntaxHighlightProps = {
  code: string;
  language?: string;
  className?: string;
  wrap?: boolean;
  maxLength?: number;
  showLineNumbers?: boolean;
  themeVariant?: SyntaxThemeVariant;
  fallbackClassName?: string;
} & Omit<ComponentProps<typeof SyntaxHighlighter>, 'children' | 'language' | 'style'>;

export function SyntaxHighlight({
  code,
  language = 'text',
  className,
  wrap = false,
  maxLength = MAX_HIGHLIGHT_LENGTH,
  showLineNumbers = false,
  themeVariant = 'default',
  fallbackClassName,
  customStyle,
  codeTagProps,
  PreTag = 'div',
  ...props
}: SyntaxHighlightProps) {
  'use no memo';

  const { style } = useSyntaxTheme(themeVariant);
  const safeCode = code ?? '';
  const shouldHighlight = safeCode.length <= maxLength;
  const codeTagStyle = typeof codeTagProps?.style === 'object' ? codeTagProps.style : undefined;

  if (!shouldHighlight) {
    return (
      <div className={cn('syntax-highlight-root', className)}>
        <pre
          className={cn(
            'syntax-highlight-fallback m-0 font-[inherit] text-[length:inherit] leading-[inherit] whitespace-pre-wrap',
            wrap && 'break-all',
            fallbackClassName
          )}
        >
          {safeCode}
        </pre>
      </div>
    );
  }

  return (
    <div className={cn('syntax-highlight-root', className)}>
      <SyntaxHighlighter
        language={language}
        style={style}
        showLineNumbers={showLineNumbers}
        wrapLongLines={wrap}
        PreTag={PreTag}
        className="syntax-highlight-pre"
        customStyle={buildPreStyle(themeVariant, customStyle)}
        codeTagProps={{
          ...codeTagProps,
          className: cn('syntax-highlight-code', codeTagProps?.className),
          style: buildCodeTagStyle(themeVariant, codeTagStyle),
        }}
        {...props}
      >
        {safeCode}
      </SyntaxHighlighter>
    </div>
  );
}

export function SyntaxHighlightPanel({
  code,
  language,
  className,
}: {
  code: string;
  language: string;
  className?: string;
}) {
  const { isDark } = useSyntaxTheme('panel');

  return (
    <div
      className={cn(
        'syntax-highlight-panel mx-auto h-full min-h-0 w-full max-w-4xl overflow-x-hidden overflow-y-auto border border-border font-mono text-[13px] leading-[1.7]',
        isDark ? 'bg-[#1d1f21]' : 'bg-[#fafafa]',
        className
      )}
    >
      <SyntaxHighlight code={code} language={language} wrap themeVariant="panel" />
    </div>
  );
}
