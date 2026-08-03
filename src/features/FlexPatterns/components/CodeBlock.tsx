import { SyntaxHighlight } from '@/components/SyntaxHighlight';
import { CopyButton } from './CopyButton';

export function CodeBlock({
  title,
  id,
  code,
  language = 'css',
}: {
  title: string;
  id: string;
  code: string;
  language?: string;
}) {
  return (
    <div className="overflow-hidden border border-border bg-card">
      <div className="flex items-center justify-between border-b border-border px-4 py-2.5">
        <h3 className="font-mono text-xs font-semibold tracking-wide text-muted-foreground uppercase">{title}</h3>
        <CopyButton text={code} id={id} />
      </div>
      <SyntaxHighlight
        code={code}
        language={language}
        wrap
        className="max-h-52 overflow-auto px-4 py-3 font-mono text-[12px] leading-6 text-foreground"
      />
    </div>
  );
}
