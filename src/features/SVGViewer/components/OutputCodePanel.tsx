import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { atomDark, oneLight } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { useTheme } from '@/components/theme/theme-provider';
import { cn } from '@/lib/utils';

type OutputLanguage = 'tsx' | 'jsx' | 'uri';

type OutputCodePanelProps = {
  code: string;
  language: OutputLanguage;
  filename?: string;
  label?: string;
  copyValue?: string;
};

const LANGUAGE_META: Record<OutputLanguage, string> = {
  tsx: 'tsx',
  jsx: 'jsx',
  uri: 'markup',
};

export function OutputCodePanel({ code, language }: OutputCodePanelProps) {
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === 'dark';

  return (
    <div
      className={cn(
        'mx-auto h-full min-h-0 w-full max-w-4xl overflow-x-hidden overflow-y-auto border border-border',
        isDark ? 'bg-[#1d1f21]' : 'bg-[#fafafa]'
      )}
    >
      <SyntaxHighlighter
        language={LANGUAGE_META[language]}
        style={isDark ? atomDark : oneLight}
        showLineNumbers={false}
        wrapLongLines
        PreTag="div"
        customStyle={{
          margin: 0,
          padding: '1.25rem 1.5rem',
          background: 'transparent',
          fontSize: '13px',
          lineHeight: 1.7,
          minHeight: '100%',
          textShadow: 'none',
          overflow: 'visible',
          whiteSpace: 'pre-wrap',
          overflowWrap: 'anywhere',
        }}
        codeTagProps={{
          style: {
            fontFamily: 'var(--font-mono, ui-monospace, SFMono-Regular, Menlo, monospace)',
            background: 'transparent',
            textShadow: 'none',
            display: 'block',
            whiteSpace: 'pre-wrap',
            overflowWrap: 'anywhere',
          },
        }}
      >
        {code}
      </SyntaxHighlighter>
    </div>
  );
}
