import { SyntaxHighlightPanel } from '@/components/SyntaxHighlight';

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
  return <SyntaxHighlightPanel code={code} language={LANGUAGE_META[language]} />;
}
